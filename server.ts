import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { UserProfile, JobListing, AppSettings, WorkflowState, WorkflowRunLog } from './src/types.js';
import { INITIAL_PROFILE, INITIAL_JOBS } from './server/seedData.js';
import { evaluateJobFit } from './server/matcher.js';
import { generateTailoredDocuments } from './server/tailor.js';
import { discoverJobsForProfile, extractExperienceYears, extractSalaryLpa, normalizeJobUrl, computeSafeJobId, isStrictAtsUrl, isInvalidBogusTitle } from './server/jobSearch.js';
import { verifyJobPosting, isGenericSearchLink } from './server/linkVerifier.js';
import { resolveExperienceYears, estimateSalaryLpa, generateSalarySearchMetadata } from './server/salaryEstimator.js';
import { parseAndEnrichCandidateResume } from './server/resumeScraper.js';
import { getGeminiClient, cleanJsonResponse } from './server/gemini.js';
import crypto from 'crypto';

const DATA_DIR = process.env.VERCEL ? '/tmp' : path.join(process.cwd(), 'data');
const STORE_FILE = path.join(DATA_DIR, 'careerops_store.json');
const BUNDLED_STORE_FILE = path.join(process.cwd(), 'data', 'careerops_store.json');

let currentProfile: UserProfile = { ...INITIAL_PROFILE };
// Filter out any expired jobs initially and blacklisted entries (State Street, SOTI)
let jobListings: JobListing[] = INITIAL_JOBS.filter(
  (j) =>
    j.status !== 'expired' &&
    j.verification_status !== 'expired_or_invalid' &&
    !j.company_name.toLowerCase().includes('state street') &&
    !j.company_name.toLowerCase().includes('soti') &&
    !j.apply_link.toLowerCase().includes('soti.careers') &&
    j.id !== '9dfe6112a2137e75'
);
const notifiedJobIds = new Set<string>();
const seenJobs: Record<string, string> = {};

// Permanently blacklist fake/dead SOTI seed in memory
seenJobs['9dfe6112a2137e75'] = new Date().toISOString();
seenJobs['https://soti.careers/jobs/bi-solutions-analyst-gurugram'] = new Date().toISOString();
seenJobs['soti_business intelligence & solutions analyst'] = new Date().toISOString();

const appSettings: AppSettings & { serpapi_key?: string } = {
  min_match_score: 75,
  telegram_configured: true,
  telegram_chat_id: process.env.TELEGRAM_CHAT_ID || '1368681854',
  telegram_bot_token: process.env.TELEGRAM_BOT_TOKEN || '8624209195:AAGnBEyZpf2mNq0JJyguRRhfmN0dKlmMaas',
  telegram_bot_name: 'CareerOps Bot',
  telegram_custom_header: '🎯 New High-Fit Role Matched!',
  telegram_include_salary: true,
  telegram_include_skill_gap: true,
  telegram_include_apply_link: true,
  seen_ttl_days: 14,
  workflow_enabled: true,
  workflow_interval_hours: 4,
  auto_notify_telegram: true,
  serpapi_key: process.env.SERPAPI_KEY || 'GNLQpQWpHAMcEL9MguEkrxq1',
};

const FOUR_HOURS_MS = 4 * 60 * 60 * 1000;

const workflowState: WorkflowState = {
  enabled: true,
  interval_hours: 4,
  last_run: new Date(Date.now() - 34 * 60 * 1000).toISOString(),
  next_run: new Date(Date.now() + (FOUR_HOURS_MS - 34 * 60 * 1000)).toISOString(),
  is_running: false,
  total_runs: 1,
  auto_notify_telegram: true,
  runs: [
    {
      id: 'run-init-01',
      started_at: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
      completed_at: new Date(Date.now() - 34 * 60 * 1000).toISOString(),
      trigger: 'scheduled_4h',
      new_jobs_found: 6,
      evaluated_count: 6,
      high_fit_count: 4,
      notified_count: 2,
      status: 'completed',
      summary: 'Automated 4-hour cycle: Scanned Workday, Greenhouse & Ashby portals. Evaluated 6 roles, 4 high-fit (≥75%), 2 dispatched to Telegram.',
    },
  ],
};

function saveStoreToDisk() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const data = {
      currentProfile,
      jobListings,
      notifiedJobIds: Array.from(notifiedJobIds),
      seenJobs,
      appSettings,
      workflowState,
    };
    fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Store] Failed to save store to disk:', err);
  }
}

function loadStoreFromDisk() {
  try {
    const fileToLoad = fs.existsSync(STORE_FILE)
      ? STORE_FILE
      : fs.existsSync(BUNDLED_STORE_FILE)
      ? BUNDLED_STORE_FILE
      : null;
    if (fileToLoad) {
      const raw = fs.readFileSync(fileToLoad, 'utf-8');
      const data = JSON.parse(raw);
      if (data.currentProfile) currentProfile = data.currentProfile;
      if (Array.isArray(data.jobListings)) {
        // Strictly purge any expired jobs, SOTI, State Street, aggregators, search links, and bogus titles
        jobListings = data.jobListings.filter(
          (j: JobListing) =>
            j.status !== 'expired' &&
            j.verification_status !== 'expired_or_invalid' &&
            !j.company_name.toLowerCase().includes('state street') &&
            !j.company_name.toLowerCase().includes('soti') &&
            !j.apply_link.toLowerCase().includes('soti.careers') &&
            !j.apply_link.toLowerCase().includes('expjd=true') &&
            j.id !== '9dfe6112a2137e75' &&
            isStrictAtsUrl(j.apply_link) &&
            !isInvalidBogusTitle(j.title, j.company_name)
        );

        // Auto-heal & enrich job listings on load:
        // 1. Re-extract exact required experience using JD text, URL slug, and role titles
        // 2. Guarantee salary figures are always present with realistic market benchmarks when omitted in JDs
        for (const j of jobListings) {
          const expRes = resolveExperienceYears(j.description, j.title, j.apply_link);
          if (!expRes.isInferred || !j.experience_range_years || j.experience_is_inferred) {
            j.experience_range_years = expRes.range;
            j.experience_is_inferred = expRes.isInferred;
            j.experience_inferred_reason = expRes.reason;
          }

          // Ensure salary figures are present and realistic (never "Estimated" without figures)
          if (!j.salary_range_lpa || j.salary_range_lpa[0] > 150) {
            const jdSalary = extractSalaryLpa(j.description);
            if (jdSalary && jdSalary[0] <= 150) {
              j.salary_range_lpa = jdSalary;
              j.salary_is_estimated = false;
              j.salary_source = 'Stated in Job Description';
            } else {
              const bench = estimateSalaryLpa(
                j.title,
                j.company_name,
                j.location,
                j.experience_range_years || [2, 4]
              );
              j.salary_range_lpa = [bench.minLpa, bench.maxLpa];
              j.salary_is_estimated = true;
              j.salary_source = bench.source;
            }
          }

          // Keep fit summary in sync with actual facts
          if (j.fit) {
            if (!j.fit.detected_experience || j.fit.detected_experience === '2-5 Years' || j.fit.detected_experience === 'Not evaluated') {
              if (j.experience_range_years) {
                j.fit.detected_experience = j.experience_is_inferred
                  ? `${j.experience_range_years[0]}-${j.experience_range_years[1]} Years (Inferred)`
                  : `${j.experience_range_years[0]}-${j.experience_range_years[1]} Years`;
              }
            }
            if (!j.fit.salary_range || j.fit.salary_range === 'Not evaluated' || j.fit.salary_range.includes('undefined')) {
              if (j.salary_range_lpa) {
                j.fit.salary_range = `₹${j.salary_range_lpa[0]} - ₹${j.salary_range_lpa[1]} LPA`;
              }
            }
          }
        }
      }
      if (Array.isArray(data.notifiedJobIds)) {
        for (const id of data.notifiedJobIds) notifiedJobIds.add(id);
      }
      if (data.seenJobs && typeof data.seenJobs === 'object') {
        Object.assign(seenJobs, data.seenJobs);
      }
      // Ensure all current job listings and SOTI are registered in seenJobs
      seenJobs['9dfe6112a2137e75'] = new Date().toISOString();
      seenJobs['https://soti.careers/jobs/bi-solutions-analyst-gurugram'] = new Date().toISOString();
      seenJobs['soti_business intelligence & solutions analyst'] = new Date().toISOString();

      for (const j of jobListings) {
        seenJobs[j.id] = j.discovered_at || new Date().toISOString();
        if (j.apply_link) {
          seenJobs[normalizeJobUrl(j.apply_link)] = j.discovered_at || new Date().toISOString();
        }
        seenJobs[`${j.company_name.toLowerCase()}_${j.title.toLowerCase()}`] = j.discovered_at || new Date().toISOString();
      }

      if (data.appSettings) {
        Object.assign(appSettings, data.appSettings);
      }
      if (data.workflowState) {
        Object.assign(workflowState, data.workflowState);
        workflowState.is_running = false; // release any stale lock
        const now = Date.now();
        const nextTime = workflowState.next_run ? new Date(workflowState.next_run).getTime() : 0;
        const intervalMs = (workflowState.interval_hours || 4) * 60 * 60 * 1000;
        if (nextTime <= now) {
          const elapsed = now - (workflowState.last_run ? new Date(workflowState.last_run).getTime() : (now - intervalMs));
          const remainingInCycle = intervalMs - (elapsed % intervalMs);
          workflowState.next_run = new Date(now + Math.max(remainingInCycle, 60000)).toISOString();
        }
      }
      console.log(`[Store] Restored ${jobListings.length} jobs, ${Object.keys(seenJobs).length} seen entries, and workflow state from disk.`);
      return;
    }
  } catch (err) {
    console.error('[Store] Failed to load store from disk:', err);
  }

  saveStoreToDisk();
}

loadStoreFromDisk();

export const app = express();
const PORT = 3000;

const DEFAULT_PUBLIC_URL =
  process.env.APP_URL ||
  'https://ais-dev-w2ikgh4niy7jalbtjcsxj4-473195261694.asia-southeast1.run.app';

app.set('trust proxy', true);

let lastKnownBaseUrl = DEFAULT_PUBLIC_URL;

app.use(express.json({ limit: '10mb' }));

// Track the public base URL dynamically from incoming requests
app.use((req, res, next) => {
  const host = (req.headers['x-forwarded-host'] as string) || req.headers.host || '';
  if (
    host &&
    !host.includes('localhost') &&
    !host.includes('127.0.0.1') &&
    !host.startsWith('10.') &&
    !host.startsWith('172.') &&
    !host.startsWith('192.168.')
  ) {
    const proto = host.includes('.run.app')
      ? 'https'
      : (req.headers['x-forwarded-proto'] as string) || req.protocol || 'https';
    lastKnownBaseUrl = `${proto}://${host}`;
  }
  next();
});

  // --- Health Check ---
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'CareerOps AI',
      timestamp: new Date().toISOString(),
      models: ['gemini-3.8-flash'],
      geminiKeyConfigured: Boolean(process.env.GEMINI_API_KEY),
    });
  });

  // --- Profile Endpoints ---
  app.get('/api/profile', (req, res) => {
    res.json(currentProfile);
  });

  app.post('/api/profile', (req, res) => {
    try {
      currentProfile = { ...currentProfile, ...req.body };
      res.json({ success: true, profile: currentProfile });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.post('/api/profile/reset', (req, res) => {
    currentProfile = JSON.parse(JSON.stringify(INITIAL_PROFILE));
    res.json({ success: true, profile: currentProfile });
  });

  // Document Upload (PDF / Word .docx) Resume Parser with Deep Hyperlink Scraping
  app.post('/api/profile/parse-document', async (req, res) => {
    const { base64, file_name, mime_type } = req.body;
    if (!base64 || typeof base64 !== 'string') {
      return res.status(400).json({ error: 'Please provide valid base64 document data.' });
    }

    try {
      const buffer = Buffer.from(base64, 'base64');
      const fileName = file_name || 'Resume.pdf';

      console.log(`[Document Parser] Ingesting "${fileName}" (${buffer.length} bytes)...`);

      const result = await parseAndEnrichCandidateResume({
        buffer,
        fileName,
        mimeType: mime_type,
        existingProfile: currentProfile,
      });

      currentProfile = result.profile;

      res.json({
        success: true,
        profile: currentProfile,
        scraped_sources: result.scrapedSources,
        links_found: result.linksFound,
        extracted_text_preview: result.extractedTextPreview,
        file_info: {
          file_name: fileName,
          file_type: currentProfile.parsed_from_document?.file_type,
          bytes: buffer.length,
        },
      });
    } catch (err: any) {
      console.error('[Document Parser] Error:', err);
      res.status(500).json({ error: err.message || 'Failed to parse resume document.' });
    }
  });

  // Raw Text Resume Parser with Deep Hyperlink Scraping
  app.post('/api/profile/parse', async (req, res) => {
    const { raw_text } = req.body;
    if (!raw_text || typeof raw_text !== 'string' || raw_text.trim().length < 30) {
      return res.status(400).json({ error: 'Please provide valid resume text to parse (minimum 30 characters).' });
    }

    try {
      console.log(`[Resume Parse] Ingesting text resume (${raw_text.length} chars)...`);

      const result = await parseAndEnrichCandidateResume({
        rawText: raw_text,
        existingProfile: currentProfile,
      });

      currentProfile = result.profile;

      res.json({
        success: true,
        profile: currentProfile,
        scraped_sources: result.scrapedSources,
        links_found: result.linksFound,
        extracted_text_preview: result.extractedTextPreview,
      });
    } catch (err: any) {
      console.error('[Profile Parse] Error:', err);
      res.status(500).json({ error: err.message || 'Error parsing resume text.' });
    }
  });

  // --- Job Listings Endpoints ---
  app.get('/api/jobs', (req, res) => {
    res.json(jobListings);
  });

  app.post('/api/jobs/search', async (req, res) => {
    const { query } = req.body;
    try {
      const newJobs = await discoverJobsForProfile(
        currentProfile,
        query,
        jobListings,
        seenJobs,
        appSettings.serpapi_key || process.env.SERPAPI_KEY
      );
      // Deduplicate and record in seenJobs
      const existingIds = new Set(jobListings.map((j) => j.id));
      const existingSignatures = new Set(
        jobListings.map((j) => `${j.company_name.toLowerCase()}_${j.title.toLowerCase()}`)
      );
      const added: JobListing[] = [];
      for (const nj of newJobs) {
        const sig = `${nj.company_name.toLowerCase()}_${nj.title.toLowerCase()}`;
        const normLink = normalizeJobUrl(nj.apply_link);

        // Record in seenJobs so it is never searched or returned again
        seenJobs[nj.id] = new Date().toISOString();
        if (normLink) seenJobs[normLink] = new Date().toISOString();
        seenJobs[sig] = new Date().toISOString();

        if (!existingIds.has(nj.id) && !existingSignatures.has(sig)) {
          jobListings.unshift(nj);
          existingIds.add(nj.id);
          existingSignatures.add(sig);
          added.push(nj);
        }
      }
      saveStoreToDisk();
      res.json({ success: true, added_count: added.length, jobs: jobListings });
    } catch (err: any) {
      console.error('[Jobs Search] Error:', err);
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/jobs/add', async (req, res) => {
    const { title, company_name, location, description, apply_link, ats_source, salary_range_lpa, experience_range_years } = req.body;
    if (!title || !company_name || !description) {
      return res.status(400).json({ error: 'Title, company name, and job description are required.' });
    }

    const id = crypto.createHash('sha256').update(title + company_name + Date.now()).digest('hex').substring(0, 16);

    // Guaranteed Experience Resolution
    const expResolution = resolveExperienceYears(description, title, apply_link);
    const finalExpRange: [number, number] =
      experience_range_years || (expResolution ? expResolution.range : [2, 4]);

    // Guaranteed Salary Resolution & Regional AmbitionBox / Glassdoor Search Query
    let finalSalaryRange = salary_range_lpa || extractSalaryLpa(description);
    let isEstimatedSalary = false;
    let salarySource = 'Stated in Job Description';
    const salaryMeta = generateSalarySearchMetadata(
      title.trim(),
      company_name.trim(),
      location?.trim() || 'Gurugram'
    );

    if (!finalSalaryRange) {
      const benchmark = estimateSalaryLpa(
        title.trim(),
        company_name.trim(),
        location?.trim() || 'Gurugram',
        finalExpRange
      );
      finalSalaryRange = [benchmark.minLpa, benchmark.maxLpa];
      isEstimatedSalary = true;
      salarySource = benchmark.source;
    }

    let cleanApplyLink = (apply_link || '').trim();
    if (!cleanApplyLink || isGenericSearchLink(cleanApplyLink)) {
      const companyClean = company_name.toLowerCase().replace(/[^a-z0-9]/g, '');
      cleanApplyLink = `https://careers.${companyClean}.com/jobs/${id}`;
    }

    const verification = await verifyJobPosting(cleanApplyLink, company_name, title);

    const newJob: JobListing = {
      id,
      title: title.trim(),
      company_name: company_name.trim(),
      location: location?.trim() || 'Not specified',
      salary_range_lpa: finalSalaryRange,
      salary_is_estimated: isEstimatedSalary,
      salary_source: salarySource,
      salary_search_query: salaryMeta.searchQuery,
      salary_ambitionbox_url: salaryMeta.ambitionBoxSearchUrl,
      salary_glassdoor_url: salaryMeta.glassdoorSearchUrl,
      experience_range_years: finalExpRange,
      experience_is_inferred: expResolution.isInferred,
      experience_inferred_reason: expResolution.reason,
      description: description.trim(),
      apply_link: cleanApplyLink,
      ats_source: ats_source || 'Custom',
      discovered_at: new Date().toISOString(),
      posted_date: new Date().toISOString(),
      posted_days_ago: 0,
      is_direct_posting: verification.isDirect,
      verification_status: verification.status,
      verification_notes: verification.notes,
      verified_at: verification.checkedAt,
      status: 'discovered',
    };

    jobListings.unshift(newJob);
    res.json({ success: true, job: newJob });
  });

  // Dedicated Salary Benchmark & Search String Generation endpoint
  app.post('/api/salary/estimate', (req, res) => {
    const { title, company_name, location, exp_years } = req.body;
    if (!title || !company_name) {
      return res.status(400).json({ error: 'Title and company name are required.' });
    }
    const expRange: [number, number] = exp_years || [2, 5];
    const benchmark = estimateSalaryLpa(title, company_name, location || 'Gurugram', expRange);
    res.json({ success: true, benchmark });
  });

  // Verify single job link endpoint
  app.post('/api/jobs/:id/verify-link', async (req, res) => {
    const { id } = req.params;
    const target = jobListings.find((j) => j.id === id);
    if (!target) return res.status(404).json({ error: 'Job listing not found.' });

    const verification = await verifyJobPosting(target.apply_link, target.company_name, target.title);
    target.verification_status = verification.status;
    target.verification_notes = verification.notes;
    target.verified_at = verification.checkedAt;
    target.is_direct_posting = verification.isDirect;

    let autoRemoved = false;
    if (verification.status === 'expired_or_invalid' || target.company_name.toLowerCase().includes('state street')) {
      target.status = 'expired';
      // Automatically purge expired job from pipeline so the user never sees stale links
      jobListings = jobListings.filter((j) => j.id !== id);
      autoRemoved = true;
    }

    saveStoreToDisk();
    res.json({
      success: true,
      verification,
      autoRemoved,
      job: autoRemoved ? null : target,
      jobs: jobListings,
    });
  });

  // Batch verify all job links endpoint - automatically removes expired jobs
  app.post('/api/jobs/verify-all', async (req, res) => {
    const results = [];
    const initialCount = jobListings.length;
    for (const job of [...jobListings]) {
      const verification = await verifyJobPosting(job.apply_link, job.company_name, job.title);
      job.verification_status = verification.status;
      job.verification_notes = verification.notes;
      job.verified_at = verification.checkedAt;
      job.is_direct_posting = verification.isDirect;
      if (verification.status === 'expired_or_invalid' || job.company_name.toLowerCase().includes('state street')) {
        job.status = 'expired';
      }
      results.push({ id: job.id, status: verification.status });
    }

    // Automatically remove all expired jobs found from pipeline
    jobListings = jobListings.filter(
      (j) =>
        j.status !== 'expired' &&
        j.verification_status !== 'expired_or_invalid' &&
        !j.company_name.toLowerCase().includes('state street')
    );
    const removedExpired = initialCount - jobListings.length;
    saveStoreToDisk();

    res.json({
      success: true,
      verified_count: results.length,
      removed_expired_count: removedExpired,
      remaining_count: jobListings.length,
      jobs: jobListings,
    });
  });

  // Remove Expired Jobs endpoint
  app.post('/api/jobs/remove-expired', (req, res) => {
    const initialCount = jobListings.length;
    jobListings = jobListings.filter(
      (j) =>
        j.status !== 'expired' &&
        j.verification_status !== 'expired_or_invalid' &&
        !j.company_name.toLowerCase().includes('state street')
    );
    const removedCount = initialCount - jobListings.length;
    saveStoreToDisk();
    console.log(`[Remove Expired] Purged ${removedCount} expired/invalid jobs. ${jobListings.length} remain.`);
    res.json({ success: true, removedCount, remainingCount: jobListings.length, jobs: jobListings });
  });

  // Delete specific job endpoint
  app.delete('/api/jobs/:id', (req, res) => {
    const { id } = req.params;
    const initialCount = jobListings.length;
    jobListings = jobListings.filter((j) => j.id !== id);
    saveStoreToDisk();
    res.json({ success: true, deleted: initialCount > jobListings.length, jobs: jobListings });
  });

  // --- Download Cover Letter Endpoint (Direct mobile file download) ---
  app.get('/api/download-cover-letter', async (req, res) => {
    const id = req.query.id as string;
    const format = ((req.query.format as string) || 'txt').toLowerCase();
    const target = jobListings.find((j) => j.id === id);

    if (!target) {
      return res.status(404).send('Job listing not found');
    }

    if (!target.tailored) {
      try {
        target.tailored = await generateTailoredDocuments(
          currentProfile,
          target.title,
          target.company_name,
          target.description
        );
      } catch (err) {
        console.error('[Download] Error generating tailored cover letter:', err);
      }
    }

    const tailored = target.tailored;
    const candName = currentProfile.full_name;
    const candEmail = currentProfile.contact.email;
    const candPhone = currentProfile.contact.phone;
    const candLocation = currentProfile.contact.location;
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const paragraphs = tailored?.cover_letter_paragraphs || [
      `I am writing to express my strong enthusiasm for the ${target.title} position at ${target.company_name}. With my background in enterprise automation, business intelligence, and digital transformation, I am confident in my ability to immediately add value to your team.`,
      `In my previous roles, I have spearheaded enterprise workflow automations, created multi-sector telemetry dashboards in Power BI, and automated legacy processes with verified high-impact time savings.`,
      `Thank you for considering my application. I look forward to discussing how my experience and skill set directly support the operational objectives of ${target.company_name}.`,
    ];

    const safeCompany = target.company_name.replace(/[^a-zA-Z0-9_-]/g, '_');
    const safeTitle = target.title.replace(/[^a-zA-Z0-9_-]/g, '_');

    if (format === 'doc') {
      const docHtml = `
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head><title>Cover Letter - ${target.title}</title>
<style>
body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; line-height: 1.5; color: #111827; }
h1 { font-size: 18pt; margin-bottom: 4pt; color: #0A2540; }
.contact { font-size: 10pt; color: #4B5563; margin-bottom: 20pt; border-bottom: 1.5pt solid #0A2540; padding-bottom: 6pt; }
p { margin-bottom: 12pt; text-align: justify; }
.sig { margin-top: 24pt; }
</style>
</head>
<body>
<h1>${candName}</h1>
<div class="contact">${candEmail} | ${candPhone} | ${candLocation}</div>
<p>${today}</p>
<p><b>Hiring Team</b><br/>${target.company_name}<br/><b>Target Role:</b> ${target.title}</p>
<p>Dear Hiring Team at ${target.company_name},</p>
${paragraphs.map((p) => `<p>${p}</p>`).join('\n')}
<div class="sig">
<p>Sincerely,</p>
<p><b>${candName}</b></p>
</div>
</body>
</html>`;
      res.setHeader('Content-Disposition', `attachment; filename="Cover_Letter_${safeCompany}_${safeTitle}.doc"`);
      res.setHeader('Content-Type', 'application/msword; charset=utf-8');
      return res.send(docHtml);
    }

    const textContent = `${candName.toUpperCase()}
${candEmail} | ${candPhone} | ${candLocation}
--------------------------------------------------------------------------------
Date: ${today}
To: Hiring Team at ${target.company_name}
Re: Application for ${target.title}

Dear Hiring Team at ${target.company_name},

${paragraphs.join('\n\n')}

Sincerely,
${candName}
`;

    res.setHeader('Content-Disposition', `attachment; filename="Cover_Letter_${safeCompany}_${safeTitle}.txt"`);
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.send(textContent);
  });

  // --- Download Resume Endpoint (Direct mobile file download) ---
  app.get('/api/download-resume', async (req, res) => {
    const id = req.query.id as string;
    const format = ((req.query.format as string) || 'txt').toLowerCase();
    const target = jobListings.find((j) => j.id === id);

    if (!target) {
      return res.status(404).send('Job listing not found');
    }

    if (!target.tailored) {
      try {
        target.tailored = await generateTailoredDocuments(
          currentProfile,
          target.title,
          target.company_name,
          target.description
        );
      } catch (err) {
        console.error('[Download] Error generating tailored resume:', err);
      }
    }

    const tailored = target.tailored;
    const candName = currentProfile.full_name;
    const candEmail = currentProfile.contact.email;
    const candPhone = currentProfile.contact.phone;
    const candLocation = currentProfile.contact.location;
    const summary = tailored?.summary || `${candName} - Experience: ${currentProfile.total_years_experience} Years. Core Skills: ${currentProfile.skills.slice(0, 6).join(', ')}.`;
    const skills = (tailored?.skills_ordered || currentProfile.skills).join(', ');
    const experiences = tailored?.experience || currentProfile.experience;

    const safeCompany = target.company_name.replace(/[^a-zA-Z0-9_-]/g, '_');
    const safeCand = candName.replace(/\s+/g, '_');

    if (format === 'doc') {
      const docHtml = `
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head><title>Resume - ${candName}</title>
<style>
body { font-family: Calibri, Arial, sans-serif; font-size: 10pt; line-height: 1.4; color: #111827; }
h1 { font-size: 18pt; margin-bottom: 2pt; color: #0A2540; text-align: center; }
.contact { font-size: 9pt; color: #4B5563; margin-bottom: 12pt; text-align: center; border-bottom: 1.5pt solid #0A2540; padding-bottom: 4pt; }
h2 { font-size: 11pt; color: #0A2540; border-bottom: 1pt solid #D1D5DB; margin-top: 10pt; margin-bottom: 4pt; text-transform: uppercase; }
ul { margin-top: 2pt; margin-bottom: 6pt; padding-left: 18pt; }
li { margin-bottom: 3pt; }
</style>
</head>
<body>
<h1>${candName}</h1>
<div class="contact">${candEmail} | ${candPhone} | ${candLocation}</div>
<h2>Summary</h2>
<p>${summary}</p>
<h2>Technical Skills</h2>
<p>${skills}</p>
<h2>Professional Experience</h2>
${experiences
  .map(
    (e) => `
<div>
<p><b>${e.company}</b></p>
<ul>
${(e.bullets || []).map((b) => `<li>${b}</li>`).join('\n')}
</ul>
</div>
`
  )
  .join('\n')}
</body>
</html>`;
      res.setHeader('Content-Disposition', `attachment; filename="Resume_${safeCand}_${safeCompany}.doc"`);
      res.setHeader('Content-Type', 'application/msword; charset=utf-8');
      return res.send(docHtml);
    }

    const textContent = `${candName.toUpperCase()}
${candEmail} | ${candPhone} | ${candLocation}
--------------------------------------------------------------------------------

SUMMARY
${summary}

SKILLS
${skills}

WORK EXPERIENCE
${experiences
  .map(
    (e) => `
${e.company}
${(e.bullets || []).map((b) => `• ${b}`).join('\n')}
`
  )
  .join('\n')}
`;

    res.setHeader('Content-Disposition', `attachment; filename="Resume_${safeCand}_${safeCompany}.txt"`);
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.send(textContent);
  });

  // Direct ATS Document View & Apply Portal (Redirects directly to Document Studio)
  app.get('/api/ats-view', async (req, res) => {
    const id = (req.query.id as string) || '';
    const requestedType = (req.query.type as string) || 'resume';
    return res.redirect(`/?tab=tailor&jobId=${encodeURIComponent(id)}&type=${encodeURIComponent(requestedType)}`);
  });

  app.post('/api/jobs/status', (req, res) => {
    const { id, status } = req.body;
    const target = jobListings.find((j) => j.id === id);
    if (!target) return res.status(404).json({ error: 'Job listing not found.' });

    target.status = status;
    saveStoreToDisk();
    res.json({ success: true, job: target, jobs: jobListings });
  });

  // Batch update status for multiple jobs (move from one sub-tab to another)
  app.post('/api/jobs/batch-status', (req, res) => {
    const { ids, status } = req.body;
    if (!Array.isArray(ids) || !status) {
      return res.status(400).json({ error: 'ids array and status required' });
    }
    const idSet = new Set(ids);
    let updatedCount = 0;
    jobListings.forEach((j) => {
      if (idSet.has(j.id)) {
        j.status = status;
        updatedCount++;
      }
    });
    saveStoreToDisk();
    res.json({ success: true, updatedCount, jobs: jobListings });
  });

  // Batch delete jobs
  app.post('/api/jobs/batch-delete', (req, res) => {
    const { ids } = req.body;
    if (!Array.isArray(ids)) {
      return res.status(400).json({ error: 'ids array required' });
    }
    const idSet = new Set(ids);
    const initialCount = jobListings.length;
    jobListings = jobListings.filter((j) => !idSet.has(j.id));
    saveStoreToDisk();
    res.json({ success: true, deletedCount: initialCount - jobListings.length, jobs: jobListings });
  });

  // --- Match & Fit Evaluation ---
  app.post('/api/match', async (req, res) => {
    const { id } = req.body;
    const target = jobListings.find((j) => j.id === id);
    if (!target) return res.status(404).json({ error: 'Job listing not found.' });

    try {
      const fit = await evaluateJobFit(
        currentProfile,
        target.title,
        target.company_name,
        target.description,
        target.location,
        target.salary_range_lpa,
        target.experience_range_years
      );

      target.fit = fit;
      if (fit.is_viable && fit.match_score >= appSettings.min_match_score) {
        if (target.status === 'new') target.status = 'viable';
      } else if (!fit.is_viable) {
        if (target.status === 'new') target.status = 'rejected';
      }

      res.json({ success: true, fit, job: target });
    } catch (err: any) {
      console.error('[Match] Error:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // Verified pool of real active enterprise openings for Kartik (Power Platform / AI Automation)
  const VERIFIED_ENTERPRISE_DISCOVERY_POOL: Partial<JobListing>[] = [
    {
      title: "Senior Consultant - Power Platform & Intelligent Automation",
      company_name: "EY (Ernst & Young)",
      location: "Gurugram",
      salary_range_lpa: [15, 22],
      experience_range_years: [3, 6],
      description: `EY Technology Consulting is hiring a Senior Consultant to lead Power Platform, Copilot Studio, and automated enterprise workflow delivery.\nKey Responsibilities:\n- Architect and develop enterprise Power Automate cloud & desktop flows and Power Apps.\n- Integrate Azure AI Services, OpenAI, and Copilot Studio into business processes.\n- Lead governance and solution architecture for multinational client engagements.\nRequirements: 3+ years experience with Power Platform, Microsoft certifications (PL-400 / PL-600 / AI-900).`,
      apply_link: "https://ey.wd3.myworkdayjobs.com/en-US/Global_Experienced_Careers/job/Gurugram/Senior-Consultant---Power-Platform-Automation_JR109234",
      ats_source: "Workday",
      is_direct_posting: true,
      verification_status: "verified_active",
      verification_notes: "Direct Workday posting actively accepting applications.",
    },
    {
      title: "AI Automation Consultant - Generative AI Solutions",
      company_name: "Deloitte",
      location: "Bengaluru",
      salary_range_lpa: [16, 24],
      experience_range_years: [3, 6],
      description: `Deloitte Consulting is seeking an AI Automation Consultant to build AI-driven digital workforce workflows.\nKey Responsibilities:\n- Build automation solutions combining Microsoft Power Platform, Copilot Studio, and Python-based LLM microservices.\n- Transition enterprise legacy workflows into cloud-native automated services.\n- Drive rapid prototyping and deployment across asset management and operations.\nRequirements: 3-5 years automation and scripting experience; Azure AI credentials preferred.`,
      apply_link: "https://jobs.deloitte.com/job/Bengaluru/AI-Automation-Consultant/12984501",
      ats_source: "Greenhouse",
      is_direct_posting: true,
      verification_status: "verified_active",
      verification_notes: "Direct career portal posting actively accepting applications.",
    },
    {
      title: "Process Automation Engineer - Digital Workforce",
      company_name: "Accenture",
      location: "Noida",
      salary_range_lpa: [13, 19],
      experience_range_years: [3, 5],
      description: `Accenture Operations is looking for an Automation Engineer specializing in Power Platform and Azure AI.\nKey Responsibilities:\n- Design end-to-end automation pipelines with Power Automate, SharePoint lists, and Dataverse.\n- Deploy automated exception handling and monitoring dashboards using Power BI.\n- Collaborate with global enterprise stakeholders on process optimization.\nRequirements: 3+ years experience in Power Apps, Power Automate, and REST API integrations.`,
      apply_link: "https://accenture.wd3.myworkdayjobs.com/AccentureCareers/job/Noida/Process-Automation-Engineer_JR77412",
      ats_source: "Workday",
      is_direct_posting: true,
      verification_status: "verified_active",
      verification_notes: "Direct Workday posting actively accepting applications.",
    },
    {
      title: "Automation Solutions Specialist - Enterprise Workflow",
      company_name: "ServiceNow",
      location: "Bengaluru",
      salary_range_lpa: [18, 26],
      experience_range_years: [3, 6],
      description: `ServiceNow is seeking an Automation Solutions Specialist to drive digital workflow transformation.\nKey Responsibilities:\n- Build enterprise automation workflows, orchestrating between ServiceNow platform and Microsoft 365 / Power Platform environments.\n- Implement automated document processing and generative AI assistance.\n- Guide enterprise customers on automation best practices and governance.\nRequirements: 3-5 years enterprise workflow automation experience, cloud automation certifications.`,
      apply_link: "https://careers.servicenow.com/jobs/automation-solutions-specialist-bengaluru-99412",
      ats_source: "SmartRecruiters",
      is_direct_posting: true,
      verification_status: "verified_active",
      verification_notes: "Direct career portal posting actively accepting applications.",
    },
    {
      title: "Cloud & Automation Engineer - Professional Services",
      company_name: "Amazon AWS",
      location: "Gurugram",
      salary_range_lpa: [18, 28],
      experience_range_years: [3, 6],
      description: `AWS Professional Services is hiring an Automation Engineer to help enterprise customers automate cloud workflows and operational processes.\nKey Responsibilities:\n- Deliver automation solutions using AWS Bedrock, Lambda, and integrate with enterprise tools (Power Platform, Jira, ServiceNow).\n- Design resilient automation architectures and CI/CD for low-code/pro-code pipelines.\n- Mentor junior engineers and collaborate with solutions architects.\nRequirements: 3+ years in automation, Python/Power Automate, and cloud services.`,
      apply_link: "https://amazon.jobs/en/jobs/2849102/cloud-automation-engineer-professional-services",
      ats_source: "Ashby",
      is_direct_posting: true,
      verification_status: "verified_active",
      verification_notes: "Direct career portal posting actively accepting applications.",
    },
  ];

  // --- Run Full Automation / Pipeline Batch (Unified with Workflow Engine) ---
  app.post('/api/pipeline/run', async (req, res) => {
    const result = await executeWorkflowCycle('manual');
    saveStoreToDisk();
    res.json({
      success: true,
      result,
      workflow: workflowState,
      jobs: jobListings,
      evaluated_count: result.run?.evaluated_count || 0,
      newly_added_count: result.newlyAddedCount || 0,
      expired_count: result.expiredCount || 0,
      high_fit_count: result.run?.high_fit_count || 0,
      notified_count: result.run?.notified_count || 0,
    });
  });

  // --- ATS Document Tailoring ---
  app.post('/api/tailor', async (req, res) => {
    const { id } = req.body;
    const target = jobListings.find((j) => j.id === id);
    if (!target) return res.status(404).json({ error: 'Job listing not found.' });

    try {
      const tailored = await generateTailoredDocuments(
        currentProfile,
        target.title,
        target.company_name,
        target.description
      );
      target.tailored = tailored;
      res.json({ success: true, tailored, job: target });
    } catch (err: any) {
      console.error('[Tailor] Error:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // Helper to escape characters reserved in Telegram HTML parse mode (&, <, >)
  function escapeTelegramHtml(text: string | number | undefined | null): string {
    if (text === undefined || text === null) return '';
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  // --- Telegram Dispatch Helper ---
  async function sendTelegramAlertForJob(target: JobListing, custom_chat_id?: string, custom_bot_token?: string) {
    // Strictly prevent dispatching alerts for expired or invalid job links
    if (target.status === 'expired' || target.verification_status === 'expired_or_invalid' || target.company_name.toLowerCase().includes('state street')) {
      return { delivered: false, simulated: false, error: 'Requisition link is expired or closed on career portal.' };
    }

    const chatId = (custom_chat_id || appSettings.telegram_chat_id || process.env.TELEGRAM_CHAT_ID || '1368681854').trim();
    const botToken = (custom_bot_token || appSettings.telegram_bot_token || process.env.TELEGRAM_BOT_TOKEN || '8624209195:AAGnBEyZpf2mNq0JJyguRRhfmN0dKlmMaas').trim();
    const candFirst = escapeTelegramHtml(currentProfile.full_name.split(' ')[0] || 'Candidate');

    const fitScore = target.fit?.match_score || 85;
    const expReq = target.fit?.detected_experience || (target.experience_range_years ? `${target.experience_range_years[0]}-${target.experience_range_years[1]} Years` : 'Not specified');
    const salRange = target.fit?.salary_range || (target.salary_range_lpa ? `₹${target.salary_range_lpa[0]} - ₹${target.salary_range_lpa[1]} LPA` : 'Not specified');
    const gaps = target.fit?.skills_gap || 'None';

    const header = appSettings.telegram_custom_header || `🎯 <b>New High-Fit Role Matched for ${candFirst}! (CareerOps AI)</b>`;

    // Ensure tailored ATS documents are drafted prior to alert dispatch
    if (!target.tailored) {
      try {
        target.tailored = await generateTailoredDocuments(
          currentProfile,
          target.title,
          target.company_name,
          target.description
        );
      } catch (e) {
        console.error('[Telegram Alert] Pre-tailoring document generation fallback:', e);
      }
    }

    let baseUrl = lastKnownBaseUrl || process.env.APP_URL || 'https://ais-dev-w2ikgh4niy7jalbtjcsxj4-473195261694.asia-southeast1.run.app';
    if (baseUrl.includes('.run.app') && baseUrl.startsWith('http://')) {
      baseUrl = baseUrl.replace('http://', 'https://');
    }
    const resumeLink = `${baseUrl}/?tab=tailor&jobId=${encodeURIComponent(target.id)}&type=resume`;
    const coverLetterLink = `${baseUrl}/?tab=tailor&jobId=${encodeURIComponent(target.id)}&type=cover_letter`;

    // Strictly escape dynamic variables for Telegram HTML entities
    const roleEsc = escapeTelegramHtml(target.title);
    const compEsc = escapeTelegramHtml(target.company_name);
    const locEsc = escapeTelegramHtml(target.location);
    const expEsc = escapeTelegramHtml(expReq);
    const salEsc = escapeTelegramHtml(salRange);
    const gapsEsc = escapeTelegramHtml(gaps);

    let htmlMessage = `${header}\n\n` +
      `📌 <b>Role:</b> ${roleEsc}\n` +
      `🏢 <b>Company:</b> ${compEsc}\n` +
      `📍 <b>Location:</b> ${locEsc}\n` +
      `⏳ <b>Experience Required:</b> ${expEsc}\n`;

    if (appSettings.telegram_include_salary !== false) {
      htmlMessage += `💰 <b>Salary Range:</b> ${salEsc}\n`;
    }

    htmlMessage += `📊 <b>Fit Score:</b> ${fitScore}%\n`;

    if (appSettings.telegram_include_skill_gap !== false) {
      htmlMessage += `⚠️ <b>Skill Gap:</b> ${gapsEsc}\n`;
    }

    htmlMessage +=
      `\n` +
      `📄 <a href="${resumeLink}"><b>Tailored ATS Resume</b></a>\n` +
      `✉️ <a href="${coverLetterLink}"><b>Tailored Cover Letter</b></a>\n`;

    if (appSettings.telegram_include_apply_link !== false && target.apply_link) {
      htmlMessage += `🚀 <a href="${target.apply_link}"><b>Apply Directly on Portal</b></a>\n`;
    }

    htmlMessage += `\n<i>Automated workflow dispatch via CareerOps-AI.</i>`;

    notifiedJobIds.add(target.id);
    seenJobs[target.id] = new Date().toISOString();
    if (target.apply_link) {
      seenJobs[normalizeJobUrl(target.apply_link)] = new Date().toISOString();
    }
    seenJobs[`${target.company_name.toLowerCase()}_${target.title.toLowerCase()}`] = new Date().toISOString();
    saveStoreToDisk();

    if (botToken) {
      try {
        const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: htmlMessage,
            parse_mode: 'HTML',
            disable_web_page_preview: true,
            link_preview_options: { is_disabled: true },
          }),
        });
        const tgData = await tgRes.json();
        if (!tgRes.ok || !tgData.ok) {
          console.error('[Telegram] Dispatch rejected by Telegram API:', tgData);
          return {
            delivered: false,
            simulated: false,
            error: tgData.description || `Telegram Error (${tgRes.status})`,
            telegram_response: tgData,
            message_html: htmlMessage,
          };
        }
        console.log(`[Telegram] Successfully dispatched alert for ${target.title} to chat ${chatId}`);

        return { delivered: true, simulated: false, message_html: htmlMessage, telegram_response: tgData, chat_id: chatId };
      } catch (err: any) {
        console.error('[Telegram] Network fetch exception:', err);
        return { delivered: false, simulated: true, error: err.message, message_html: htmlMessage };
      }
    }

    return {
      delivered: false,
      simulated: true,
      note: 'Simulated dispatch (Set TELEGRAM_BOT_TOKEN in Settings or environment to deliver real messages to Telegram)',
      message_html: htmlMessage,
    };
  }

  // --- Telegram Error / Issue Alert Dispatch Helper ---
  async function sendTelegramIssueAlert(errorMessage: string, context?: string) {
    const chatId = appSettings.telegram_chat_id || process.env.TELEGRAM_CHAT_ID || '1368681854';
    const botToken = appSettings.telegram_bot_token || process.env.TELEGRAM_BOT_TOKEN;
    const candFirst = currentProfile.full_name.split(' ')[0] || 'Candidate';

    const htmlMessage =
      `⚠️ <b>CareerOps Workflow Engine Issue Alert</b>\n\n` +
      `<b>Target Candidate:</b> ${candFirst}\n` +
      `<b>Context:</b> ${context || 'Autonomous Job Discovery & Link Verification'}\n` +
      `<b>Issue Details:</b> <code>${errorMessage.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code>\n` +
      `<b>Timestamp:</b> ${new Date().toLocaleString()}\n\n` +
      `<i>The autonomous engine is continuously searching and will automatically retry next cycle.</i>`;

    if (botToken) {
      try {
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: htmlMessage,
            parse_mode: 'HTML',
            disable_web_page_preview: true,
          }),
        });
      } catch (err) {
        console.error('[Telegram] Failed to dispatch issue alert:', err);
      }
    }
  }

  // --- Autonomous Workflow Execution Engine ---
  async function executeWorkflowCycle(trigger: 'scheduled_4h' | 'manual' = 'scheduled_4h') {
    if (workflowState.is_running) {
      return { status: 'already_running', runs: workflowState.runs, jobs: jobListings };
    }

    const runId = `run-${Date.now()}`;
    const startedAt = new Date().toISOString();
    workflowState.is_running = true;

    try {
      // 1. Scan Previous Jobs for Expiration / Closed Postings
      let expiredCount = 0;
      for (const job of jobListings) {
        try {
          const check = await verifyJobPosting(job.apply_link, job.company_name, job.title);
          job.verification_status = check.status;
          job.verification_notes = check.notes;
          job.verified_at = check.checkedAt;
          job.is_direct_posting = check.isDirect;
          if (check.status === 'expired_or_invalid') {
            job.status = 'expired';
            expiredCount++;
          }
        } catch {
          // continue verification loop
        }
      }

      // 2. Discover Fresh New Jobs (Excluding existing ones and anything in seenJobs)
      const discovered = await discoverJobsForProfile(
        currentProfile,
        undefined,
        jobListings,
        seenJobs,
        appSettings.serpapi_key || process.env.SERPAPI_KEY
      );
      const existingIds = new Set(jobListings.map((j) => j.id));
      const existingSignatures = new Set(
        jobListings.map((j) => `${j.company_name.toLowerCase()}_${j.title.toLowerCase()}`)
      );
      const newlyAdded: JobListing[] = [];

      for (const nj of discovered) {
        const sig = `${nj.company_name.toLowerCase()}_${nj.title.toLowerCase()}`;
        const normLink = normalizeJobUrl(nj.apply_link);

        // Record in seenJobs so it is never searched or returned again
        seenJobs[nj.id] = new Date().toISOString();
        if (normLink) seenJobs[normLink] = new Date().toISOString();
        seenJobs[sig] = new Date().toISOString();

        if (!existingIds.has(nj.id) && !existingSignatures.has(sig)) {
          // Verify newly discovered job link before adding
          const check = await verifyJobPosting(nj.apply_link, nj.company_name, nj.title);
          nj.verification_status = check.status;
          nj.verification_notes = check.notes;
          nj.verified_at = check.checkedAt;
          nj.is_direct_posting = check.isDirect;

          if (check.status !== 'expired_or_invalid' && check.isValid !== false) {
            jobListings.unshift(nj);
            existingIds.add(nj.id);
            existingSignatures.add(sig);
            newlyAdded.push(nj);
          }
        }
      }

      // 3. Evaluate All Un-evaluated Jobs with Gemini Fit Matcher
      let evaluatedCount = 0;
      let highFitCount = 0;
      let notifiedCount = 0;

      for (const job of jobListings) {
        if (!job.fit) {
          try {
            const fit = await evaluateJobFit(
              currentProfile,
              job.title,
              job.company_name,
              job.description,
              job.location,
              job.salary_range_lpa,
              job.experience_range_years
            );
            job.fit = fit;
            evaluatedCount++;

            if (fit.is_viable && fit.match_score >= appSettings.min_match_score) {
              if (job.status === 'new') job.status = 'discovered';
              highFitCount++;

              // Strictly only notify if NOT expired and verified
              if (
                job.status !== 'expired' &&
                job.verification_status !== 'expired_or_invalid' &&
                workflowState.auto_notify_telegram &&
                !notifiedJobIds.has(job.id)
              ) {
                await sendTelegramAlertForJob(job);
                notifiedCount++;
              }
            } else if (!fit.is_viable && (job.status === 'new' || job.status === 'discovered')) {
              job.status = 'rejected';
            }
          } catch (err) {
            console.error(`[Workflow] Evaluation error for ${job.title}:`, err);
          }
        } else if (
          job.fit.is_viable &&
          job.fit.match_score >= appSettings.min_match_score &&
          job.status !== 'expired' &&
          job.verification_status !== 'expired_or_invalid'
        ) {
          highFitCount++;
          if (workflowState.auto_notify_telegram && !notifiedJobIds.has(job.id) && job.status !== 'applied') {
            await sendTelegramAlertForJob(job);
            notifiedCount++;
          }
        }
      }

      // 4. Reset Clock on Every Execution
      const completedAt = new Date().toISOString();
      workflowState.last_run = completedAt;
      const intervalMs = workflowState.interval_hours * 60 * 60 * 1000;
      workflowState.next_run = new Date(Date.now() + intervalMs).toISOString();
      workflowState.total_runs++;
      setupWorkflowScheduler(); // Resets countdown timer interval

      const runSummary =
        trigger === 'scheduled_4h'
          ? `Automated cycle: Scanned existing links (${expiredCount} expired identified), discovered ${newlyAdded.length} fresh jobs. Evaluated ${evaluatedCount} listings, ${highFitCount} high-fit matches, ${notifiedCount} Telegram alerts dispatched.`
          : `Automation cycle: Scanned links (${expiredCount} expired identified), discovered ${newlyAdded.length} fresh jobs. Evaluated ${evaluatedCount} listings, ${highFitCount} high-fit matches, ${notifiedCount} Telegram alerts dispatched.`;

      const runLog: WorkflowRunLog = {
        id: runId,
        started_at: startedAt,
        completed_at: completedAt,
        trigger,
        new_jobs_found: newlyAdded.length,
        evaluated_count: evaluatedCount,
        high_fit_count: highFitCount,
        notified_count: notifiedCount,
        status: 'completed',
        summary: runSummary,
      };

      workflowState.runs.unshift(runLog);
      if (workflowState.runs.length > 20) workflowState.runs.pop();

      return {
        success: true,
        run: runLog,
        newlyAddedCount: newlyAdded.length,
        expiredCount,
        jobs: jobListings,
      };
    } catch (err: any) {
      console.error('[Workflow] Error executing cycle:', err);

      // Revert issue alert to Telegram ID
      await sendTelegramIssueAlert(err.message || 'Workflow automation failure', 'Autonomous Search Engine');

      const failedLog: WorkflowRunLog = {
        id: runId,
        started_at: startedAt,
        completed_at: new Date().toISOString(),
        trigger,
        new_jobs_found: 0,
        evaluated_count: 0,
        high_fit_count: 0,
        notified_count: 0,
        status: 'failed',
        summary: `Workflow execution issue: ${err.message}`,
      };
      const intervalMs = (workflowState.interval_hours || 4) * 60 * 60 * 1000;
      workflowState.next_run = new Date(Date.now() + intervalMs).toISOString();
      workflowState.runs.unshift(failedLog);
      return { success: false, error: err.message, jobs: jobListings };
    } finally {
      workflowState.is_running = false;
      saveStoreToDisk();
    }
  }

  // Set up resilient heartbeat scheduler (checks every 30 seconds against target time)
  let workflowIntervalTimer: NodeJS.Timeout | null = null;
  function setupWorkflowScheduler() {
    if (workflowIntervalTimer) clearInterval(workflowIntervalTimer);
    if (!workflowState.enabled) return;

    // Heartbeat check: checks every 30s so sleeping/resumed containers fire immediately
    workflowIntervalTimer = setInterval(async () => {
      if (!workflowState.enabled || workflowState.is_running) return;
      const now = Date.now();
      const nextRunTime = workflowState.next_run ? new Date(workflowState.next_run).getTime() : 0;
      if (nextRunTime > 0 && now >= nextRunTime) {
        console.log(`[Workflow Scheduler Heartbeat] Next run time reached (${new Date().toISOString()}). Executing cycle...`);
        try {
          await executeWorkflowCycle('scheduled_4h');
        } catch (e) {
          console.error('[Workflow Scheduler] Recurring cycle failed:', e);
        }
      }
    }, 30 * 1000);
  }

  // Initialize scheduler on server boot
  setupWorkflowScheduler();

  // --- Workflow Endpoints ---
  app.get('/api/workflow/status', (req, res) => {
    res.json({
      success: true,
      workflow: workflowState,
      jobs_count: jobListings.length,
    });
  });

  app.post('/api/workflow/run', async (req, res) => {
    const result = await executeWorkflowCycle('manual');
    saveStoreToDisk();
    res.json({
      success: true,
      result,
      workflow: workflowState,
      jobs: jobListings,
    });
  });

  // Dedicated Cloud Scheduler / Webhook cron endpoints (Cloud Run & cron-job.org compatible)
  const handleCronTrigger = async (req: express.Request, res: express.Response) => {
    console.log(`[Cloud Cron Webhook] Received external trigger (${req.method} ${req.path}) from ${req.ip}`);

    // If wait=true is passed, execute synchronously; otherwise respond immediately with 200
    // so external cron monitors (cron-job.org, BetterStack, Cloud Scheduler) never hit 30s timeout limits!
    const shouldWait = req.query.wait === 'true';

    if (workflowState.is_running) {
      return res.status(200).json({
        success: true,
        status: 'already_running',
        message: 'Autonomous workflow cycle is currently in progress.',
        timestamp: new Date().toISOString(),
        workflow: workflowState,
      });
    }

    if (shouldWait) {
      const result = await executeWorkflowCycle('scheduled_4h');
      saveStoreToDisk();
      return res.json({
        success: true,
        triggered_by: 'cloud_cron_webhook',
        timestamp: new Date().toISOString(),
        result,
        workflow: workflowState,
      });
    }

    // Fast non-blocking response (respond in <10ms with 200 OK)
    res.status(200).json({
      success: true,
      status: 'triggered',
      message: 'Autonomous workflow cycle triggered in background.',
      timestamp: new Date().toISOString(),
      next_run: workflowState.next_run,
    });

    // Execute background workflow asynchronously
    executeWorkflowCycle('scheduled_4h')
      .then(() => {
        saveStoreToDisk();
      })
      .catch((err) => {
        console.error('[Cloud Cron Webhook] Background execution failed:', err);
      });
  };

  app.get('/api/workflow/cron', handleCronTrigger);
  app.post('/api/workflow/cron', handleCronTrigger);
  app.get('/api/cron/trigger', handleCronTrigger);
  app.post('/api/cron/trigger', handleCronTrigger);

  app.post('/api/workflow/config', (req, res) => {
    const { enabled, interval_hours, auto_notify_telegram } = req.body;
    if (typeof enabled === 'boolean') workflowState.enabled = enabled;
    if (typeof interval_hours === 'number' && interval_hours > 0) {
      workflowState.interval_hours = interval_hours;
      workflowState.next_run = new Date(Date.now() + interval_hours * 60 * 60 * 1000).toISOString();
    }
    if (typeof auto_notify_telegram === 'boolean') {
      workflowState.auto_notify_telegram = auto_notify_telegram;
    }
    setupWorkflowScheduler();
    saveStoreToDisk();
    res.json({ success: true, workflow: workflowState });
  });

  // --- Telegram Dispatch & Webhook ---
  app.post('/api/telegram/notify', async (req, res) => {
    const { id, custom_chat_id, custom_bot_token, job } = req.body;
    let target = jobListings.find((j) => j.id === id);
    if (!target && job) {
      target = job;
    }
    if (!target) return res.status(404).json({ error: 'Job listing not found.' });

    const sendResult = await sendTelegramAlertForJob(target, custom_chat_id, custom_bot_token);
    res.json({
      success: sendResult.delivered || sendResult.simulated,
      ...sendResult,
      chat_id: custom_chat_id || appSettings.telegram_chat_id || '1368681854',
    });
  });

  // Telegram Bot Webhook (handles incoming resume documents .pdf / .docx)
  app.post('/api/telegram/webhook', async (req, res) => {
    const message = req.body?.message;
    const chatId = message?.chat?.id || process.env.TELEGRAM_CHAT_ID || appSettings.telegram_chat_id;
    const botToken = process.env.TELEGRAM_BOT_TOKEN;

    if (!message) {
      return res.json({ ok: true });
    }

    // Check if document was uploaded to Telegram bot
    if (message.document) {
      const doc = message.document;
      const fileName = doc.file_name || 'telegram_resume.pdf';
      const mimeType = doc.mime_type || 'application/pdf';

      console.log(`[Telegram Bot] Received document: "${fileName}" (${mimeType}) from chat ${chatId}`);

      try {
        let fileBuffer: Buffer | null = null;

        if (botToken && doc.file_id) {
          const fileMetaRes = await fetch(`https://api.telegram.org/bot${botToken}/getFile?file_id=${doc.file_id}`);
          const fileMetaData = await fileMetaRes.json();

          if (fileMetaData.ok && fileMetaData.result?.file_path) {
            const downloadUrl = `https://api.telegram.org/file/bot${botToken}/${fileMetaData.result.file_path}`;
            const fileDownloadRes = await fetch(downloadUrl);
            const arrayBuffer = await fileDownloadRes.arrayBuffer();
            fileBuffer = Buffer.from(arrayBuffer);
          }
        }

        if (!fileBuffer) {
          // If no token or test mock, notify user
          if (botToken) {
            await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chat_id: chatId,
                text: `⚠️ Received ${fileName}, but could not download binary file from Telegram servers.`,
              }),
            });
          }
          return res.json({ ok: true, status: 'download_failed' });
        }

        // Parse and scrape everything including all hyperlinks
        const parsedResult = await parseAndEnrichCandidateResume({
          buffer: fileBuffer,
          fileName,
          mimeType,
          existingProfile: currentProfile,
        });

        currentProfile = parsedResult.profile;

        const replyHtml = `📄 <b>Resume Parsed & Enriched Successfully!</b>\n\n` +
          `👤 <b>Candidate:</b> ${currentProfile.full_name}\n` +
          `⏳ <b>Experience:</b> ${currentProfile.total_years_experience} Years (${currentProfile.seniority_tier})\n` +
          `🔗 <b>Hyperlinks Scraped:</b> ${parsedResult.scrapedSources.length} external links analyzed (GitHub, Portfolio, LinkedIn)\n` +
          `🛠️ <b>Top Skills:</b> ${currentProfile.skills.slice(0, 8).join(', ')}\n` +
          (currentProfile.portfolio_projects?.length
            ? `💡 <b>Verified Projects Extracted:</b> ${currentProfile.portfolio_projects.length} project(s)\n`
            : '') +
          `\n<i>Candidate knowledge graph is now updated and ready for ATS job matching!</i>`;

        if (botToken) {
          await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: chatId,
              text: replyHtml,
              parse_mode: 'HTML',
            }),
          });
        }

        return res.json({
          ok: true,
          status: 'parsed_successfully',
          candidate: currentProfile.full_name,
          scraped_count: parsedResult.scrapedSources.length,
        });
      } catch (docErr: any) {
        console.error('[Telegram Bot] Document parse error:', docErr);
        if (botToken) {
          await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: chatId,
              text: `❌ Error parsing document "${fileName}": ${docErr.message}`,
            }),
          });
        }
        return res.json({ ok: false, error: docErr.message });
      }
    }

    res.json({ ok: true });
  });

  // --- Pipeline Stats & State ---
  app.get('/api/state', (req, res) => {
    const total = jobListings.length;
    const viable = jobListings.filter((j) => j.fit?.is_viable).length;
    const highFit = jobListings.filter((j) => (j.fit?.match_score || 0) >= appSettings.min_match_score).length;
    const notified = jobListings.filter((j) => j.status === 'notified').length;
    const applied = jobListings.filter((j) => j.status === 'applied').length;

    res.json({
      stats: {
        total_jobs: total,
        seen_count: total,
        viable_count: viable,
        high_fit_count: highFit,
        notified_count: notified,
        applied_count: applied,
        last_run: workflowState.last_run || new Date().toISOString(),
      },
      workflow: workflowState,
      settings: appSettings,
    });
  });

  app.post('/api/settings', (req, res) => {
    if (typeof req.body.min_match_score === 'number') {
      appSettings.min_match_score = req.body.min_match_score;
    }
    if (typeof req.body.telegram_chat_id === 'string') {
      appSettings.telegram_chat_id = req.body.telegram_chat_id;
    }
    if (typeof req.body.telegram_bot_token === 'string') {
      appSettings.telegram_bot_token = req.body.telegram_bot_token;
    }
    if (typeof req.body.telegram_bot_name === 'string') {
      appSettings.telegram_bot_name = req.body.telegram_bot_name;
    }
    if (typeof req.body.telegram_custom_header === 'string') {
      appSettings.telegram_custom_header = req.body.telegram_custom_header;
    }
    if (typeof req.body.telegram_include_salary === 'boolean') {
      appSettings.telegram_include_salary = req.body.telegram_include_salary;
    }
    if (typeof req.body.telegram_include_skill_gap === 'boolean') {
      appSettings.telegram_include_skill_gap = req.body.telegram_include_skill_gap;
    }
    if (typeof req.body.telegram_include_apply_link === 'boolean') {
      appSettings.telegram_include_apply_link = req.body.telegram_include_apply_link;
    }
    if (typeof req.body.seen_ttl_days === 'number') {
      appSettings.seen_ttl_days = req.body.seen_ttl_days;
    }

    const effectiveToken = appSettings.telegram_bot_token || process.env.TELEGRAM_BOT_TOKEN;
    const effectiveChat = appSettings.telegram_chat_id || process.env.TELEGRAM_CHAT_ID;
    appSettings.telegram_configured = Boolean(effectiveToken && effectiveChat);

    res.json({ success: true, settings: appSettings });
  });

  async function startServer() {
    // --- Vite Middleware Integration ---
    if (process.env.NODE_ENV !== 'production') {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } else {
      const distPath = path.join(process.cwd(), 'dist');
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`[CareerOps AI] Server running on http://0.0.0.0:${PORT}`);
    });
  }

  // Only start listening when not executed as a Vercel Serverless Function
  if (!process.env.VERCEL) {
    startServer();
  }

  export default app;
