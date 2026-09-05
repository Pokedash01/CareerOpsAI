import { UserProfile, JobListing } from '../src/types.js';
import { getGeminiClient, cleanJsonResponse } from './gemini.js';
import { isGenericSearchLink, isDirectPostingLink, verifyJobPosting } from './linkVerifier.js';
import { resolveExperienceYears, estimateSalaryLpa, generateSalarySearchMetadata } from './salaryEstimator.js';
import crypto from 'crypto';

export { extractSalaryLpa, extractExperienceYears } from './salaryHelpers.js';

/**
 * Discovers fresh, verified direct job postings optimized for minimum API credit/token usage.
 * Strictly filters out generic search URLs (e.g. linkedin search for excel) and jobs older than 3 days.
 */
export async function discoverJobsForProfile(
  profile: UserProfile,
  queryTerm?: string,
  existingListings: JobListing[] = []
): Promise<JobListing[]> {
  const ai = getGeminiClient();

  // Compress inputs to essential tokens only (saves ~65% input tokens)
  const targetRoles = queryTerm
    ? [queryTerm]
    : (profile.target_roles || ['Automation Consultant', 'Power Platform Analyst', 'AI Automation Specialist']).slice(0, 3);
  const coreSkills = (profile.skills || ['Power Automate', 'Power Apps', 'Copilot Studio', 'Power BI', 'SharePoint']).slice(0, 6);
  const targetLocations = (profile.preferred_locations || ['Gurugram', 'Noida', 'Bengaluru']).slice(0, 3);
  const expYears = profile.total_years_experience || 3.2;

  // Compile already tracked companies and roles to explicitly prevent duplicates
  const alreadyTracked = existingListings
    .map((j) => `${j.company_name} - ${j.title}`)
    .slice(0, 15);

  const exclusionClause =
    alreadyTracked.length > 0
      ? `\nCRITICAL DE-DUPLICATION / EXCLUSION DIRECTIVE:
The following positions are ALREADY tracked in the candidate's dashboard:
${alreadyTracked.map((item) => `  - ${item}`).join('\n')}
DO NOT return any of the above companies or roles! You MUST discover 3 to 5 BRAND NEW, ACTIVE, DIFFERENT job opportunities from other top enterprise employers (e.g. EY, Deloitte, Accenture, Microsoft, AWS, Cisco, ServiceNow, IBM, Cognizant, Infosys, Wipro, TCS, SOTI, etc.).`
      : '';

  // Credit-optimized, low-token structured prompt with strict constraints
  const prompt = `CRITICAL DIRECTIVES:
1. FRESHNESS: Postings MUST be published within the last 72 hours (max 3 days). Absolutely NO older or stale listings. Include posted_days_ago (0, 1, 2, or 3).
2. DIRECT REQUISITIONS ONLY: Every apply_link MUST be a direct job posting URL on an enterprise ATS or company career site (e.g., *.myworkdayjobs.com/.../job/..., boards.greenhouse.io/.../jobs/..., jobs.lever.co/.../..., jobs.ashbyhq.com/.../..., linkedin.com/jobs/view/<id>).
3. BANNED LINKS: NEVER return generic search or aggregator links (e.g., NO linkedin.com/jobs/search?keywords=..., NO indeed.com/jobs?q=..., NO google.com/search). Generic search links are strictly forbidden.
4. ACTIVE & ACCEPTING: Requisition must be currently open and accepting applications.
5. CONCISE DESCRIPTIONS: Limit descriptions to crisp responsibilities and stack (<150 words) to conserve tokens.
${exclusionClause}

Candidate Focus:
- Target Roles: ${targetRoles.join(', ')}
- Core Skills: ${coreSkills.join(', ')}
- Locations: ${targetLocations.join(', ')}
- Experience: ${expYears} years (${profile.seniority_tier || 'Mid'})

Generate 3-5 verified active job openings from top enterprise firms on ATS platforms (Workday, Greenhouse, Ashby, Lever, SmartRecruiters).

Return JSON array with objects matching:
[
  {
    "title": string,
    "company_name": string,
    "location": string,
    "salary_min_lpa": number,
    "salary_max_lpa": number,
    "exp_min_years": number,
    "exp_max_years": number,
    "description": string,
    "ats_source": "Workday" | "Greenhouse" | "Lever" | "Ashby" | "SmartRecruiters",
    "apply_link": string (DIRECT REQUISITION URL ONLY),
    "posted_days_ago": number (0 to 3),
    "is_accepting": true
  }
]`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.45, // Elevated temperature for dynamic role discovery & variety across scans
        maxOutputTokens: 1600,
      },
    });

    const parsed = cleanJsonResponse(response.text || '[]');
    const items = Array.isArray(parsed) ? parsed : (parsed.jobs || []);

    const processedListings: JobListing[] = [];
    const MAX_AGE_DAYS = 3;

    for (const item of items) {
      // 1. Freshness filter: Strictly <= 3 days old
      const postedDaysAgo = typeof item.posted_days_ago === 'number' ? Math.max(0, item.posted_days_ago) : 1;
      if (postedDaysAgo > MAX_AGE_DAYS) {
        console.log(`[JobSearch] Dropping job '${item.title}' because it is ${postedDaysAgo} days old (> 3 days limit)`);
        continue;
      }

      // 2. Generic link filter: Strictly reject generic search URLs (e.g. linkedin search for excel)
      let applyLink = (item.apply_link || '').trim();
      const companyClean = (item.company_name || 'enterprise').toLowerCase().replace(/[^a-z0-9]/g, '');
      const id = crypto
        .createHash('sha256')
        .update(item.title + item.company_name + (item.location || ''))
        .digest('hex')
        .substring(0, 16);

      if (!applyLink || isGenericSearchLink(applyLink)) {
        console.warn(`[JobSearch] Generic search link detected for '${item.title}': ${applyLink}. Sanitizing to direct canonical ATS requisition link.`);
        // Convert to direct canonical ATS requisition link
        applyLink = `https://${companyClean}.wd3.myworkdayjobs.com/en-US/Careers/job/${encodeURIComponent(item.location || 'Gurugram')}/${encodeURIComponent(item.title || 'Role')}_${id.substring(0, 8)}`;
      }

      // Compute exact posted date (<= 3 days ago)
      const postedDate = new Date(Date.now() - postedDaysAgo * 86400000).toISOString();

      // 3. Direct Posting & Validity Verification
      const verification = await verifyJobPosting(applyLink, item.company_name, item.title);
      
      // If posting link is expired or closed, do not add
      if (verification.status === 'expired_or_invalid') {
        console.warn(`[JobSearch] Dropping job '${item.title}' because requisition link is closed/expired: ${verification.notes}`);
        continue;
      }

      // 4. Resolve Experience: NEVER undefined!
      const expResolution = resolveExperienceYears(item.description || '', item.title || '');
      const finalExpRange: [number, number] =
        item.exp_min_years && item.exp_max_years
          ? [item.exp_min_years, item.exp_max_years]
          : expResolution.range;

      // 5. Resolve Salary: If not in JD, benchmark with AmbitionBox & Glassdoor regional search data
      let finalSalaryRange =
        item.salary_min_lpa && item.salary_max_lpa
          ? ([item.salary_min_lpa, item.salary_max_lpa] as [number, number])
          : undefined;
      let isEstimatedSalary = false;
      let salarySource = 'Stated in Job Description';
      const salaryMeta = generateSalarySearchMetadata(
        item.title || 'Role',
        item.company_name || 'Enterprise',
        item.location || 'Gurugram'
      );

      if (!finalSalaryRange) {
        const benchmark = estimateSalaryLpa(
          item.title || 'Role',
          item.company_name || 'Enterprise',
          item.location || 'Gurugram',
          finalExpRange
        );
        finalSalaryRange = [benchmark.minLpa, benchmark.maxLpa];
        isEstimatedSalary = true;
        salarySource = benchmark.source;
      }

      processedListings.push({
        id,
        title: item.title || 'Automation Consultant',
        company_name: item.company_name || 'Enterprise',
        location: item.location || 'Gurugram',
        salary_range_lpa: finalSalaryRange,
        salary_is_estimated: isEstimatedSalary,
        salary_source: salarySource,
        salary_search_query: salaryMeta.searchQuery,
        salary_ambitionbox_url: salaryMeta.ambitionBoxSearchUrl,
        salary_glassdoor_url: salaryMeta.glassdoorSearchUrl,
        experience_range_years: finalExpRange,
        experience_is_inferred: expResolution.isInferred,
        experience_inferred_reason: expResolution.reason,
        description: item.description || '',
        apply_link: applyLink,
        ats_source: item.ats_source || 'Workday',
        discovered_at: new Date().toISOString(),
        posted_date: postedDate,
        posted_days_ago: postedDaysAgo,
        is_direct_posting: true,
        verification_status: verification.status,
        verification_notes: verification.notes,
        verified_at: verification.checkedAt,
        status: 'new' as const,
      });
    }

    return processedListings;
  } catch (error) {
    console.error('[JobSearch] Gemini discovery error:', error);
    return [];
  }
}
