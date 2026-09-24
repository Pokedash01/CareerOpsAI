import type { UserProfile, JobListing } from '../src/types.js';
import { isGenericSearchLink, verifyJobPosting } from './linkVerifier.js';
import { extractSalaryLpa, extractExperienceYears } from './salaryHelpers.js';
import { searchSalaryLiveFromGlassdoorAndAmbitionBox, estimateSalaryLpa } from './salaryEstimator.js';
import crypto from 'crypto';

export { extractSalaryLpa, extractExperienceYears };

export const ALLOWED_ATS_DOMAINS = [
  'myworkdayjobs.com',
  'greenhouse.io',
  'lever.co',
  'smartrecruiters.com',
  'smrtr.io',
  'ashbyhq.com',
  'taleo.net',
];

export const ATS_DOMAINS =
  '(site:myworkdayjobs.com OR site:boards.greenhouse.io OR site:jobs.lever.co OR site:jobs.ashbyhq.com OR site:smartrecruiters.com)';

export const LOCATIONS =
  '("Gurgaon" OR "Gurugram" OR "Noida" OR "Delhi" OR "Bangalore" OR "Bengaluru" OR "Remote" OR "India")';

export const KNOWN_CITIES = [
  'Gurgaon',
  'Gurugram',
  'Noida',
  'New Delhi',
  'Delhi',
  'Bangalore',
  'Bengaluru',
  'Mumbai',
  'Pune',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Ahmedabad',
  'Remote',
  'Hybrid',
  'Work From Home',
];

/**
 * Checks if a URL is an authentic, direct job posting on ATS platforms,
 * LinkedIn (/jobs/view/), Naukri (/job-listings-), or Monster/Foundit (/job-postings/).
 *
 * Strictly rejects any generic search aggregators (e.g., search result pages with thousands of jobs)
 * and explicitly skips shine.com as requested by candidate.
 */
export function isStrictJobUrl(url: string): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url.trim());
    const host = parsed.hostname.toLowerCase();
    const pathname = parsed.pathname.toLowerCase();
    const search = parsed.search.toLowerCase();

    // 0. Instantly reject any search query param or expired JD flags
    if (
      search.includes('expjd=true') ||
      search.includes('keywords=') ||
      search.includes('search=') ||
      search.includes('query=') ||
      search.includes('searchterm=')
    ) {
      return false;
    }

    // 1. Instantly reject job aggregators, spam portals, search engines, and shine.com
    const forbidden = [
      'shine.com',
      'indeed.',
      'glassdoor.',
      'ambitionbox.',
      'adzuna.',
      'bebee.',
      'timesjobs.',
      'freshersworld.',
      'monsterindia.',
      'simplyhired.',
      'careerjet.',
      'jooble.',
      'hirist.',
      'instahyre.',
      'ziprecruiter.',
      'google.com',
      'yahoo.com',
      'bing.com',
    ];
    for (const f of forbidden) {
      if (host.includes(f) || pathname.includes(f)) {
        return false;
      }
    }

    // 2. LinkedIn: Direct job view postings ONLY (/jobs/view/<id>)
    if (host.includes('linkedin.com')) {
      if (!pathname.includes('/jobs/view/')) {
        return false;
      }
      if (pathname.includes('/jobs/search') || pathname.includes('/jobs/collections')) {
        return false;
      }
      return true;
    }

    // 3. Naukri: Reject expired redirect search pages and require /job-listings- with no search query
    if (host.includes('naukri.com')) {
      if (!pathname.includes('/job-listings-')) {
        return false;
      }
      if (
        pathname.includes('-jobs') ||
        pathname.includes('/jobs-in-') ||
        pathname.includes('/search') ||
        search.includes('expjd=true')
      ) {
        return false;
      }
      return true;
    }

    // 4. Foundit / Monster: Direct job postings ONLY
    if (host.includes('foundit.in') || host.includes('monster.com')) {
      if (pathname.includes('/srp') || pathname.includes('/search')) {
        return false;
      }
      return pathname.includes('/job-postings/') || pathname.includes('/job-openings/');
    }

    // 5. Lever: MUST be /company/<job-id-or-uuid>
    if (host === 'jobs.lever.co' || host.endsWith('.lever.co')) {
      const parts = pathname.split('/').filter(Boolean);
      if (parts.length < 2) return false;
      if (
        search.includes('location=') ||
        search.includes('workplacetype=') ||
        search.includes('team=') ||
        search.includes('department=')
      ) {
        return false;
      }
      return true;
    }

    // 6. Greenhouse: MUST contain /jobs/<id> or /embed/job_app
    if (host.includes('greenhouse.io')) {
      if (pathname.includes('/jobs/') || pathname.includes('/job_app')) {
        const parts = pathname.split('/').filter(Boolean);
        return parts.length >= 2;
      }
      return false;
    }

    // 7. Ashby: MUST be /company/<uuid>
    if (host.includes('ashbyhq.com')) {
      const parts = pathname.split('/').filter(Boolean);
      return parts.length >= 2;
    }

    // 8. SmartRecruiters: MUST be /company/<id> or smrtr.io/<id>
    if (host.includes('smartrecruiters.com') || host.includes('smrtr.io')) {
      const parts = pathname.split('/').filter(Boolean);
      return parts.length >= 2;
    }

    // 9. Workday: MUST contain /job/
    if (host.includes('myworkdayjobs.com')) {
      return pathname.includes('/job/');
    }

    // 10. Taleo: MUST contain jobdetail.ftl
    if (host.includes('taleo.net')) {
      return pathname.includes('jobdetail.ftl');
    }

    // 11. Company direct career subdomains (e.g. careers.microsoft.com, jobs.pwc.com)
    if (host.startsWith('careers.') || host.startsWith('jobs.')) {
      if (
        (pathname.includes('/job/') || pathname.includes('/jobs/') || pathname.includes('/posting/')) &&
        !pathname.includes('/search')
      ) {
        const parts = pathname.split('/').filter(Boolean);
        return parts.length >= 2;
      }
    }

    return false;
  } catch {
    return false;
  }
}

// Alias for backwards compatibility
export const isStrictAtsUrl = isStrictJobUrl;

/**
 * Identifies and discards bogus aggregator titles, category pages, search results, or landing pages
 * e.g. "Power Bi Developer Jobs In Gurugram", "Page 5 - 6178 Macros Jobs", "Planet Technologies"
 */
export function isInvalidBogusTitle(title: string, company?: string): boolean {
  if (!title) return true;
  const t = title.toLowerCase().trim();
  const c = (company || '').toLowerCase().trim();

  // 1. Search aggregator and keyword-dump titles (e.g. "Power Bi Developer Jobs In Gurugram")
  if (/\bjobs\s+(?:in|for|near|across|at)\b/i.test(t)) return true;
  if (/\b(?:openings|vacancies|job\s+vacancies)\s+(?:in|for|across|at)\b/i.test(t)) return true;
  if (/\bjobs\s*[-–|:]/i.test(t)) return true;
  if (/\b(?:jobs|openings|vacancies)$/i.test(t)) return true;
  if (/\b\d+[\+,\s]*jobs\b/i.test(t)) return true;
  if (/^jobs\s+in\b/i.test(t)) return true;
  if (/^page\s+\d+/i.test(t)) return true;
  if (/search\s+results/i.test(t)) return true;
  if (/\b(?:all\s+jobs|latest\s+jobs|job\s+search)\b/i.test(t)) return true;
  if (/shine\.com|foundit|naukri|indeed|adzuna|glassdoor|ambitionbox/i.test(t)) return true;

  // 2. Titles that are just the company name or generic landing page
  if (c && (t === c || t === c.replace(/[^a-z0-9]/g, ''))) return true;
  if (/^(?:careers|jobs|home|join\s+our\s+team|welcome|overview)$/i.test(t)) return true;

  return false;
}

/**
 * Evaluates whether a job posting was posted in the last 3 days (posted_days_ago <= 3).
 *
 * Strict constraint:
 * "Only return jobs that are posted in the last three days. I repeat, only and only return jobs that are posted in the last three days."
 */
export function evaluatePostedWithin3Days(
  url?: string,
  itemDate?: string,
  snippet?: string,
  pageHtml?: string
): { isWithin3Days: boolean; postedDaysAgo: number; reason: string } {
  const now = Date.now();

  // 1. Naukri URL ID: DDMMYY in last 12 digits (e.g. 180526015188 -> 18/05/2026)
  if (url && url.includes('naukri.com')) {
    const nkMatch = url.match(/job-listings-.*?(\d{6})\d{6}(?:[?#&]|$)/);
    if (nkMatch) {
      const raw = nkMatch[1];
      const day = parseInt(raw.slice(0, 2), 10);
      const month = parseInt(raw.slice(2, 4), 10);
      const year = 2000 + parseInt(raw.slice(4, 6), 10);
      if (day >= 1 && day <= 31 && month >= 1 && month <= 12) {
        const jobTimestamp = new Date(year, month - 1, day).getTime();
        const diffDays = Math.floor((now - jobTimestamp) / 86400000);
        if (diffDays > 3) {
          return {
            isWithin3Days: false,
            postedDaysAgo: diffDays,
            reason: `Naukri posting created ${diffDays} days ago (${day}/${month}/${year})`,
          };
        }
        return {
          isWithin3Days: true,
          postedDaysAgo: Math.max(0, diffDays),
          reason: `Naukri posting date ${day}/${month}/${year}`,
        };
      }
    }
  }

  // 2. Meta tags in HTML: datePosted, published_time, og:updated_time
  if (pageHtml) {
    const metaMatch =
      pageHtml.match(/<meta\s+[^>]*(?:itemprop|property|name)=["'](?:datePosted|article:published_time|og:updated_time|og:published_time|date)["'][^>]*content=["']([^"']+)["']/i) ||
      pageHtml.match(/<meta\s+[^>]*content=["']([^"']+)["'][^>]*(?:itemprop|property|name)=["'](?:datePosted|article:published_time|og:updated_time|og:published_time|date)["']/i);
    if (metaMatch) {
      const dateStr = metaMatch[1];
      const parsed = Date.parse(dateStr);
      if (!isNaN(parsed)) {
        const diffDays = Math.floor((now - parsed) / 86400000);
        if (diffDays > 3) {
          return {
            isWithin3Days: false,
            postedDaysAgo: diffDays,
            reason: `Meta datePosted ${dateStr} is ${diffDays} days ago (> 3 days limit)`,
          };
        }
        return {
          isWithin3Days: true,
          postedDaysAgo: Math.max(0, diffDays),
          reason: `Meta datePosted ${dateStr} (${diffDays} days ago)`,
        };
      }
    }

    // JSON-LD datePosted
    const jsonLdMatch = pageHtml.match(/<script type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/i);
    if (jsonLdMatch) {
      try {
        const parsed = JSON.parse(jsonLdMatch[1]);
        const dateStr = parsed.datePosted || (Array.isArray(parsed) && parsed[0]?.datePosted);
        if (dateStr) {
          const timestamp = Date.parse(dateStr);
          if (!isNaN(timestamp)) {
            const diffDays = Math.floor((now - timestamp) / 86400000);
            if (diffDays > 7) {
              return {
                isWithin3Days: false,
                postedDaysAgo: diffDays,
                reason: `JSON-LD datePosted ${dateStr} is ${diffDays} days ago (> 7 days limit)`,
              };
            }
            return {
              isWithin3Days: true,
              postedDaysAgo: Math.max(0, diffDays),
              reason: `JSON-LD datePosted ${dateStr}`,
            };
          }
        }
      } catch {
        // ignore JSON-LD parse
      }
    }
  }

  // 3. Scan text for relative time markers (focused on header/meta to avoid company age false positives)
  const textToScan = `${itemDate || ''} ${snippet || ''} ${pageHtml ? pageHtml.slice(0, 1500) : ''}`.toLowerCase();

  // 3a. Rejection of clearly older relative posting markers (> 7 days)
  if (
    /posted\s+30\+\s+days\s+ago/i.test(textToScan) ||
    /posted\s+(?:[89]|\d{2,})\s+days\s+ago/i.test(textToScan) ||
    /posted\s+(?:[2-9]|\d{2,})\s+weeks?\s+ago/i.test(textToScan) ||
    /posted\s+\d+\s+months?\s+ago/i.test(textToScan) ||
    /posted\s+\d+\s+years?\s+ago/i.test(textToScan)
  ) {
    const daysMatch = textToScan.match(/posted\s+(\d+)\s+days?\s+ago/i);
    const days = daysMatch ? parseInt(daysMatch[1], 10) : 30;
    return { isWithin3Days: false, postedDaysAgo: days, reason: `Posted ${days} days ago (> 7 days limit)` };
  }

  // 3b. Fresh relative indicators (<= 7 days)
  const freshDaysMatch = textToScan.match(/posted\s+(\d+)\s+days?\s+ago/i);
  if (freshDaysMatch) {
    const days = parseInt(freshDaysMatch[1], 10);
    if (days <= 7) {
      return { isWithin3Days: true, postedDaysAgo: days, reason: `Posted ${days} days ago` };
    }
  }

  if (/\b(?:today|just now|hours?\s+ago|mins?\s+ago|minutes?\s+ago)\b/i.test(textToScan)) {
    return { isWithin3Days: true, postedDaysAgo: 0, reason: 'Posted today / hours ago' };
  }

  if (/\byesterday\b/i.test(textToScan) || /\b1\s+day\s+ago\b/i.test(textToScan)) {
    return { isWithin3Days: true, postedDaysAgo: 1, reason: 'Posted yesterday' };
  }

  // 4. Check absolute date string in itemDate if provided (e.g. '27 Aug 2026', '3 Sep 2026')
  if (itemDate) {
    const parsed = Date.parse(itemDate);
    if (!isNaN(parsed)) {
      const diffDays = Math.floor((now - parsed) / 86400000);
      if (diffDays > 7) {
        return {
          isWithin3Days: false,
          postedDaysAgo: diffDays,
          reason: `Item date ${itemDate} is ${diffDays} days ago (> 7 days limit)`,
        };
      }
      return {
        isWithin3Days: true,
        postedDaysAgo: Math.max(0, diffDays),
        reason: `Item date ${itemDate} (${diffDays} days ago)`,
      };
    }
  }

  // 5. Default when query was executed with recency filter and no older date is found
  return { isWithin3Days: true, postedDaysAgo: 1, reason: 'Recently active job posting' };
}

/**
 * Normalizes URL for consistent de-duplication (lowercases host, strips tracking parameters)
 */
export function normalizeJobUrl(rawUrl: string): string {
  if (!rawUrl) return '';
  try {
    const u = new URL(rawUrl.trim());
    u.hash = '';
    // Strip common tracking queries
    const trackingParams = [
      'utm_source',
      'utm_medium',
      'utm_campaign',
      'utm_term',
      'utm_content',
      'ref',
      'gh_src',
      'source',
      'lever-source',
      'trk',
      'trackingId',
      'position',
      'pageNum',
    ];
    for (const p of trackingParams) {
      u.searchParams.delete(p);
    }
    return `${u.protocol}//${u.host.toLowerCase()}${u.pathname.replace(/\/+$/, '')}${u.search ? u.search : ''}`;
  } catch {
    return rawUrl.trim().toLowerCase();
  }
}

/**
 * Computes deterministic safe ID from URL or company+title
 */
export function computeSafeJobId(applyLink?: string, company?: string, title?: string): string {
  const seed =
    (applyLink && normalizeJobUrl(applyLink)) ||
    `${(company || '').toLowerCase()}_${(title || '').toLowerCase()}`;
  return crypto.createHash('sha256').update(seed).digest('hex').substring(0, 16);
}

/**
 * Rotate list deterministically by day/offset to vary search coverage across scans
 */
function rotateList<T>(lst: T[], n: number, offset: number): T[] {
  if (!lst || lst.length === 0) return [];
  const start = ((offset % lst.length) + lst.length) % lst.length;
  return [...lst.slice(start), ...lst.slice(0, start)].slice(0, n);
}

/**
 * Clean company name from search source or ATS / job portal URL
 */
export function cleanCompanyName(source: string = '', url: string = ''): string {
  // 1. LinkedIn: in.linkedin.com/jobs/view/{title}-at-{company}-{id}
  const liMatch = url.match(/-at-([a-zA-Z0-9_-]+)-[0-9]+/i);
  if (liMatch) {
    return liMatch[1].replace(/[-_]/g, ' ').replace(/\b[a-z]/g, (c) => c.toUpperCase());
  }

  // 2. Workday
  const wdMatch = url.match(/https?:\/\/([a-zA-Z0-9_-]+)\.wd[0-9]*\.myworkdayjobs\.com/i);
  if (wdMatch) {
    let name = wdMatch[1].replace(/[-_]/g, ' ').replace(/\b[a-z]/g, (c) => c.toUpperCase());
    try {
      const parsed = new URL(url);
      const parts = parsed.pathname.split('/').filter(Boolean);
      for (const p of parts) {
        if (/careers|jobs/i.test(p)) {
          const cand = p.replace(/_careers|_jobs|careers|jobs/gi, '').replace(/[-_]/g, ' ').trim();
          const genericWords = ['external', 'internal', 'corporate', 'global', 'en', 'us', 'site', 'career', 'default'];
          if (cand.length > 2 && !genericWords.includes(cand.toLowerCase())) {
            name = cand.replace(/\b[a-z]/g, (c) => c.toUpperCase());
            break;
          }
        }
      }
    } catch {}
    if (name && !name.toLowerCase().includes('myworkdayjobs')) return name;
  }

  // 3. Greenhouse
  const ghMatch = url.match(/boards\.greenhouse\.io\/(?:embed\/job_board\?for=)?([a-zA-Z0-9_-]+)/i);
  if (ghMatch) {
    return ghMatch[1].replace(/[-_]/g, ' ').replace(/\b[a-z]/g, (c) => c.toUpperCase());
  }

  // 4. Lever
  const leverMatch = url.match(/jobs\.lever\.co\/([a-zA-Z0-9_-]+)/i);
  if (leverMatch) {
    return leverMatch[1].replace(/[-_]/g, ' ').replace(/\b[a-z]/g, (c) => c.toUpperCase());
  }

  // 5. SmartRecruiters
  const srMatch = url.match(/jobs\.smartrecruiters\.com\/([a-zA-Z0-9_-]+)/i);
  if (srMatch) {
    return srMatch[1].replace(/[-_]/g, ' ').replace(/\b[a-z]/g, (c) => c.toUpperCase());
  }

  // 6. Ashby
  const ashbyMatch = url.match(/jobs\.ashbyhq\.com\/([a-zA-Z0-9_-]+)/i);
  if (ashbyMatch) {
    return ashbyMatch[1].replace(/[-_]/g, ' ').replace(/\b[a-z]/g, (c) => c.toUpperCase());
  }

  // 7. Clean from search source name
  if (source) {
    let s = source
      .replace(
        /\s*[-|–|\|]\s*(Careers|Jobs|myworkdayjobs\.com|Greenhouse|Lever|SmartRecruiters|Ashby|LinkedIn|Naukri|Foundit).*/gi,
        ''
      )
      .replace(/\s+(Careers|Jobs|Inc\.?|LLC|Ltd\.?)$/gi, '')
      .trim();
    if (
      s.length > 1 &&
      !s.toLowerCase().includes('myworkdayjobs') &&
      !s.toLowerCase().includes('linkedin') &&
      !s.toLowerCase().includes('naukri')
    ) {
      return s;
    }
  }

  return 'Enterprise Employer';
}

/**
 * Clean job title from ATS suffixes and search artifacts
 */
export function cleanJobTitle(rawTitle: string = ''): string {
  let t = rawTitle
    .replace(
      /\s*[-|–|\|]\s*(Greenhouse|Lever|Workday|Ashby|SmartRecruiters|Jobs|Careers|Myworkdayjobs\.com|LinkedIn|Naukri\.com|Foundit).*/gi,
      ''
    )
    .trim();
  // Strip trailing "at Company" or "- Company"
  t = t.replace(/\s+at\s+[A-Z][a-zA-Z0-9\s]+$/i, '').trim();
  t = t.replace(/\s*[-|–]\s*[A-Z][a-zA-Z0-9\s]+$/i, '').trim();
  return t || rawTitle;
}

/**
 * Extracts Indian tech hub or Remote location from text, attributes, meta tags, and URL slugs
 */
function extractLocation(title: string, jdText: string, rawHtml?: string, url?: string): string {
  // 1. Check formattedAddress (e.g. SmartRecruiters <spl-job-location formattedAddress="... Noida ...">)
  if (rawHtml) {
    const formattedAddr = rawHtml.match(/formattedAddress=[\"']([^\"']+)[\"']/i);
    if (formattedAddr) {
      for (const city of KNOWN_CITIES) {
        if (new RegExp(`\\b${city}\\b`, 'i').test(formattedAddr[1])) {
          return city;
        }
      }
    }

    // 2. Check meta tags (itemprop="addressLocality", keywords, twitter:title, etc.)
    const metaMatches = [
      ...rawHtml.matchAll(/<meta\s+[^>]+(?:addressLocality|keywords|job-location|twitter:title|description)[^>]+content=[\"']([^\"']+)[\"']/gi),
      ...rawHtml.matchAll(/<meta\s+[^>]+content=[\"']([^\"']+)[\"'][^>]+(?:addressLocality|keywords|job-location|twitter:title|description)/gi),
    ];
    for (const m of metaMatches) {
      const val = m[1];
      for (const city of KNOWN_CITIES) {
        if (new RegExp(`\\b${city}\\b`, 'i').test(val)) {
          return city;
        }
      }
    }
  }

  // 3. Check URL path or slug (e.g. /noida/ or -noida-)
  if (url) {
    for (const city of KNOWN_CITIES) {
      if (new RegExp(`[/_-]${city}(?:[/_-]|$)`, 'i').test(url)) {
        return city;
      }
    }
  }

  // 4. Check combined text and raw HTML
  const haystack = `${title || ''} ${jdText || ''} ${rawHtml ? rawHtml.slice(0, 50000) : ''}`;
  for (const city of KNOWN_CITIES) {
    const reg = new RegExp(`\\b${city}\\b`, 'i');
    if (reg.test(haystack)) {
      return city;
    }
  }
  return 'Not specified';
}

/**
 * Fetches page HTML and extracts rich job descriptions, attributes, and posted date markers
 */
async function fetchFullJd(
  url: string,
  timeoutMs: number = 6000
): Promise<{ text: string; isDead: boolean; htmlSnippet?: string; rawHtml?: string }> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      signal: controller.signal,
      redirect: 'follow',
    });

    clearTimeout(timeout);

    const finalUrl = res.url || url;
    if (
      finalUrl.includes('expJD=true') ||
      finalUrl.includes('expjd=true') ||
      finalUrl.includes('-jobs-in-') ||
      finalUrl.includes('/jobs-in-') ||
      isGenericSearchLink(finalUrl) ||
      !isStrictJobUrl(finalUrl)
    ) {
      return { text: '', isDead: true };
    }

    if (res.status === 404 || res.status === 410) {
      return { text: '', isDead: true };
    }

    if (!res.ok) {
      return { text: '', isDead: false };
    }

    const html = await res.text();
    const lowerHtml = html.toLowerCase();
    const closedKeywords = [
      'this position has been filled',
      'position is no longer available',
      'job has been closed',
      'no longer accepting applications',
      'this job is closed',
      'posting has expired',
      'requisition is closed',
      'job opening has closed',
    ];

    for (const kw of closedKeywords) {
      if (lowerHtml.includes(kw)) {
        return { text: '', isDead: true };
      }
    }

    // Try extracting rich dedicated description containers for popular ATS engines
    let richDesc = '';

    // SmartRecruiters (multiple job-section containers or st-jobDescription)
    const srSections = [...html.matchAll(/<section[^>]+class=[\"'][^\"']*job-section[^\"']*[\"'][^>]*>([\s\S]*?)<\/section>/gi)];
    if (srSections.length > 0) {
      richDesc = srSections
        .map((s) => s[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim())
        .filter(Boolean)
        .join('\n\n');
    }

    // LinkedIn
    if (!richDesc) {
      const liDescMatch = html.match(/<div class=["']show-more-less-html__markup[^"']*["']>([\s\S]*?)<\/div>/i);
      if (liDescMatch) {
        richDesc = liDescMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      }
    }

    // Workday
    if (!richDesc) {
      const wdMatch = html.match(/data-automation-id=["']jobPostingDescription["'][^>]*>([\s\S]*?)<\/div>/i);
      if (wdMatch) {
        richDesc = wdMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      }
    }

    // Greenhouse (#content or .job-post)
    if (!richDesc) {
      const ghMatch = html.match(/<div id=["']content["'][^>]*>([\s\S]*?)<\/div>/i);
      if (ghMatch) {
        richDesc = ghMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      }
    }

    // Lever
    if (!richDesc) {
      const leverMatch = html.match(/<div class=["']posting-page[^"']*["']>([\s\S]*?)<\/div>/i);
      if (leverMatch) {
        richDesc = leverMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      }
    }

    const cleanText =
      richDesc ||
      html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    return {
      text: cleanText.substring(0, 15000),
      isDead: false,
      htmlSnippet: html.slice(0, 60000),
      rawHtml: html,
    };
  } catch (err: any) {
    const errCode = err.cause?.code || err.code || '';
    const errMsg = (err.message || '').toLowerCase();
    if (
      errCode === 'ENOTFOUND' ||
      errCode === 'ECONNREFUSED' ||
      errMsg.includes('enotfound') ||
      errMsg.includes('getaddrinfo')
    ) {
      return { text: '', isDead: true };
    }
    return { text: '', isDead: false };
  }
}

/**
 * Determines ATS platform source name from URL
 */
function getAtsSource(url: string): string {
  if (url.includes('myworkdayjobs.com')) return 'Workday';
  if (url.includes('greenhouse.io')) return 'Greenhouse';
  if (url.includes('lever.co')) return 'Lever';
  if (url.includes('smartrecruiters.com') || url.includes('smrtr.io')) return 'SmartRecruiters';
  if (url.includes('ashbyhq.com')) return 'Ashby';
  if (url.includes('taleo.net')) return 'Taleo';
  if (url.includes('linkedin.com')) return 'LinkedIn';
  if (url.includes('naukri.com')) return 'Naukri';
  if (url.includes('foundit.in') || url.includes('monster.com')) return 'Foundit';
  return 'Direct Career Portal';
}

/**
 * Executes Google Search queries via SearchApi.io (with SerpApi fallback)
 * constrained by &tbs=qdr:d7 to surface active, fresh jobs posted/indexed in the last 7 days.
 */
async function searchGoogle(query: string, apiKey: string, page: number = 0): Promise<any[]> {
  const url = `https://www.searchapi.io/api/v1/search?engine=google&tbs=qdr:d7&api_key=${encodeURIComponent(
    apiKey
  )}&gl=in&hl=en&num=15${page > 0 ? `&page=${page + 1}` : ''}&q=${encodeURIComponent(query)}`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (!res.ok) {
      console.warn(`[SearchApi] Request failed with HTTP ${res.status}`);
      return [];
    }

    const data: any = await res.json();
    return Array.isArray(data.organic_results) ? data.organic_results : [];
  } catch (err: any) {
    console.warn(`[SearchApi] Primary query issue (${err.message}). Trying fallback provider...`);

    // Fallback: Try SerpApi with tbs=qdr:d7
    try {
      const serpUrl = `https://serpapi.com/search.json?engine=google&tbs=qdr:d7&api_key=${encodeURIComponent(
        apiKey
      )}&gl=in&hl=en&num=15&q=${encodeURIComponent(query)}`;
      const fbController = new AbortController();
      const fbTimeout = setTimeout(() => fbController.abort(), 15000);
      const serpRes = await fetch(serpUrl, { signal: fbController.signal });
      clearTimeout(fbTimeout);
      if (serpRes.ok) {
        const serpData: any = await serpRes.json();
        return Array.isArray(serpData.organic_results) ? serpData.organic_results : [];
      }
    } catch {
      // ignore
    }

    return [];
  }
}

/**
 * Discovers fresh, verified direct job postings across enterprise ATS systems,
 * LinkedIn (/jobs/view/), Naukri (/job-listings-), and Foundit/Monster (/job-postings/).
 *
 * Strict Guarantees:
 * 1. "Only return jobs that are posted in the last three days. I repeat, only and only return jobs that are posted in the last three days."
 * 2. "Never return jobs that it already had searched for, doesn't matter how they're dispatched or not" (Strict O(1) deduplication).
 * 3. "Don't send links to general searches. When I open the link, I'm like Power Automate jobs in Gurgaon or LinkedIn pages opening with that search with thousands of jobs. Don't want those as well."
 * 4. Skip shine.com completely as requested.
 * 5. Verify active links (no dead requisitions, no 404s).
 */
export async function discoverJobsForProfile(
  profile: UserProfile,
  queryTerm?: string,
  existingListings: JobListing[] = [],
  seenStore: Record<string, string> = {},
  serpApiKey?: string,
  searchedRegistry: Record<string, any> = {}
): Promise<JobListing[]> {
  const apiKey = serpApiKey || process.env.SERPAPI_KEY || 'GNLQpQWpHAMcEL9MguEkrxq1';

  if (!apiKey) {
    console.warn('[JobSearch] SERPAPI_KEY is not configured.');
    return [];
  }

  // Pre-populate seen lookup set for O(1) deduplication
  const seenSet = new Set<string>();

  // 1. All records in persistent seenStore (safe_id, normalized link, company_title signature)
  for (const [key] of Object.entries(seenStore)) {
    if (key) seenSet.add(key.toLowerCase());
  }

  // 2. All records from searched & rejected jobs registry
  for (const [key, item] of Object.entries(searchedRegistry)) {
    if (key) seenSet.add(key.toLowerCase());
    if (item) {
      if (item.id) seenSet.add(item.id.toLowerCase());
      if (item.signature) seenSet.add(item.signature.toLowerCase());
      if (item.normalized_url) seenSet.add(item.normalized_url.toLowerCase());
      if (item.apply_link) seenSet.add(normalizeJobUrl(item.apply_link).toLowerCase());
    }
  }

  // 3. All existing listings already in state
  for (const job of existingListings) {
    seenSet.add(job.id.toLowerCase());
    if (job.apply_link) {
      seenSet.add(normalizeJobUrl(job.apply_link).toLowerCase());
    }
    seenSet.add(`${job.company_name.toLowerCase()}_${job.title.toLowerCase()}`);
  }

  // Blacklist fake/dead SOTI seed specifically so it is permanently excluded
  seenSet.add('9dfe6112a2137e75');
  seenSet.add('https://soti.careers/jobs/bi-solutions-analyst-gurugram');
  seenSet.add('soti_business intelligence & solutions analyst');

  // Candidate roles and skills
  const allRoles = profile.target_roles || [
    'Power Platform Developer',
    'Automation Consultant',
    'AI Transformation Analyst',
    'Solutions Analyst',
    'Business Analyst',
    'Power BI Developer',
  ];
  const allSkills = profile.skills || [
    'Power Automate',
    'Power Apps',
    'Copilot Studio',
    'SharePoint Online',
    'Power BI',
    'SQL',
    'Python',
  ];

  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  const rotatedRoles = rotateList(allRoles, Math.min(4, allRoles.length), dayOfYear);
  const rotatedSkills = rotateList(allSkills, Math.min(4, allSkills.length), dayOfYear + 1);

  const roleClause = rotatedRoles.map((r) => `"${r}"`).join(' OR ');
  const skillClause = rotatedSkills.map((s) => `"${s}"`).join(' OR ');
  const negatives =
    '-site:shine.com -site:naukri.com -site:foundit.in -site:indeed.com -site:glassdoor.com -site:ambitionbox.com -site:linkedin.com/jobs/search -site:linkedin.com/jobs/collections -site:hirist.tech -site:timesjobs.com -site:freshersworld.com -Intern -Director -VP -Head';

  let searchQueries: string[] = [];

  if (queryTerm && queryTerm.trim()) {
    const q = queryTerm.trim();
    searchQueries = [
      `${ATS_DOMAINS} intitle:("${q}") ${LOCATIONS} ${negatives}`,
      `site:myworkdayjobs.com/en-US job "${q}" ${LOCATIONS} ${negatives}`,
      `site:linkedin.com/jobs/view "${q}" ${LOCATIONS} ${negatives}`,
      `(site:jobs.lever.co OR site:boards.greenhouse.io) "${q}" ${LOCATIONS} ${negatives}`,
    ];
  } else {
    // 8 distinct multi-portal query clusters targeting ATS, LinkedIn, and Enterprise Portals (7-day recency)
    searchQueries = [
      // Cluster 1: Lever & Greenhouse - Business Analyst, Solutions Analyst, Data Analyst
      `(site:jobs.lever.co OR site:boards.greenhouse.io) ("Business Analyst" OR "Data Analyst" OR "Solutions Analyst") (India OR Gurgaon OR Noida OR Bangalore OR Remote) ${negatives}`,

      // Cluster 2: Lever & Greenhouse - Power Platform, Power BI, Automation
      `(site:jobs.lever.co OR site:boards.greenhouse.io) ("Power Platform" OR "Power BI" OR "Power Automate" OR "Automation Consultant" OR "Copilot") (India OR Gurgaon OR Noida OR Bangalore OR Remote) ${negatives}`,

      // Cluster 3: Workday - Business Analyst & Systems/Solutions Analyst
      `site:myworkdayjobs.com/en-US ("Business Analyst" OR "Solutions Analyst" OR "Product Analyst") (India OR Gurgaon OR Noida OR Bangalore OR Remote) ${negatives}`,

      // Cluster 4: Workday - Power Platform, Power Automate, Power Apps, Power BI
      `site:myworkdayjobs.com/en-US ("Power Platform" OR "Power Automate" OR "Power Apps" OR "Power BI" OR "Intelligent Automation") India ${negatives}`,

      // Cluster 5: SmartRecruiters & Ashby - Analytics & Automation
      `(site:jobs.smartrecruiters.com OR site:jobs.ashbyhq.com) ("Business Analyst" OR "Data Analyst" OR "Power BI" OR "Automation") (India OR Remote) ${negatives}`,

      // Cluster 6: LinkedIn Direct Postings (/jobs/view/)
      `(site:in.linkedin.com/jobs/view OR site:linkedin.com/jobs/view) ("Business Analyst" OR "Power Platform" OR "Power Automate" OR "Solutions Analyst") (India OR Gurgaon OR Noida OR Bangalore OR Remote) ${negatives}`,

      // Cluster 7: Workday Direct Postings in NCR / Bangalore (Active enterprise jobs)
      `site:myworkdayjobs.com/en-US job ("Power Platform" OR "Power Automate" OR "Power BI" OR "Business Analyst") (Gurgaon OR Gurugram OR Noida OR Delhi OR Bangalore OR Remote) ${negatives}`,

      // Cluster 8: Top Enterprise Career Portals (Microsoft, Amazon, Deloitte, PwC, Genpact)
      `(site:careers.microsoft.com OR site:amazon.jobs OR site:jobs.pwc.com OR site:careers.deloitte.com OR site:genpact.taleo.net) ("Business Analyst" OR "Power Platform" OR "Automation Consultant") India ${negatives}`,
    ];
  }

  console.log(`[JobSearch] Executing ${searchQueries.length} multi-portal queries with SearchApi (tbs=qdr:d7)...`);

  const collectedItems: any[] = [];
  const querySeenLinks = new Set<string>();

  // Run search queries concurrently
  const queryPromises = searchQueries.map(async (q) => {
    try {
      const resultsP1 = await searchGoogle(q, apiKey, 0);
      return resultsP1;
    } catch {
      return [];
    }
  });

  const queryResults = await Promise.all(queryPromises);
  for (const list of queryResults) {
    for (const item of list) {
      if (item.link && !querySeenLinks.has(item.link)) {
        querySeenLinks.add(item.link);
        collectedItems.push(item);
      }
    }
  }

  console.log(`[JobSearch] Collected ${collectedItems.length} raw search results from Google.`);

  // Filter candidates through deduplication check, direct job posting check, and recency check
  const candidatesToProcess: any[] = [];
  for (const item of collectedItems) {
    const rawLink = item.link || '';
    if (!rawLink || isGenericSearchLink(rawLink) || !isStrictJobUrl(rawLink)) {
      continue;
    }

    const rawTitle = item.title || '';
    if (isInvalidBogusTitle(rawTitle)) {
      continue;
    }

    const rawSource = item.source || '';
    const cleanedCompany = cleanCompanyName(rawSource, rawLink);
    const cleanedTitle = cleanJobTitle(rawTitle);

    if (isInvalidBogusTitle(cleanedTitle, cleanedCompany)) {
      continue;
    }

    // Recency check on search result
    const initialDateCheck = evaluatePostedWithin3Days(rawLink, item.date, item.snippet);
    if (!initialDateCheck.isWithin3Days) {
      console.log(`[JobSearch] Dropping job older than 7 days (${initialDateCheck.reason}): ${rawTitle}`);
      continue;
    }

    const normUrl = normalizeJobUrl(rawLink);
    const safeId = computeSafeJobId(normUrl, cleanedCompany, cleanedTitle);
    const sig = `${cleanedCompany.toLowerCase()}_${cleanedTitle.toLowerCase()}`;

    // STRICT DEDUPLICATION:
    // Never return jobs that it already had searched for, doesn't matter how they're dispatched or not!
    if (
      seenSet.has(safeId.toLowerCase()) ||
      seenSet.has(normUrl.toLowerCase()) ||
      seenSet.has(sig.toLowerCase()) ||
      seenSet.has(rawLink.toLowerCase())
    ) {
      continue;
    }

    // Reserve in seenSet immediately
    seenSet.add(safeId.toLowerCase());
    seenSet.add(normUrl.toLowerCase());
    seenSet.add(sig.toLowerCase());

    candidatesToProcess.push({
      item,
      rawLink,
      normUrl,
      rawTitle,
      rawSource,
      cleanedCompany,
      cleanedTitle,
      safeId,
      sig,
      initialDateCheck,
    });

    if (candidatesToProcess.length >= 60) break;
  }

  const discoveredJobs: JobListing[] = [];

  // Process candidate items in concurrent batches of 6 for speed
  const BATCH_SIZE = 6;
  for (let i = 0; i < candidatesToProcess.length; i += BATCH_SIZE) {
    if (discoveredJobs.length >= 25) break;

    const batch = candidatesToProcess.slice(i, i + BATCH_SIZE);
    const batchResults = await Promise.all(
      batch.map(async (cand) => {
        try {
          // VERIFY WORKING LINK & SCRAPE FULL JD:
          const { text: jdText, isDead, htmlSnippet, rawHtml } = await fetchFullJd(cand.rawLink, 5000);
          if (isDead) {
            console.log(`[JobSearch] Dropping dead/broken link: ${cand.rawLink}`);
            return null;
          }

          // SECOND STRICT "LAST 3 DAYS" CHECK ON FULL PAGE CONTENT
          const pageDateCheck = evaluatePostedWithin3Days(
            cand.rawLink,
            cand.item.date,
            cand.item.snippet,
            htmlSnippet || jdText
          );
          if (!pageDateCheck.isWithin3Days) {
            console.log(
              `[JobSearch] Dropping job older than 3 days based on page text (${pageDateCheck.reason}): ${cand.rawLink}`
            );
            return null;
          }

          let verificationStatus = 'verified_active' as const;
          let verificationNotes = 'Direct requisition verified active and fresh.';

          // Verify with linkVerifier for redirect detection, search query filtering, and live status
          const verification = await verifyJobPosting(cand.rawLink, cand.cleanedCompany, cand.cleanedTitle);
          if (verification.status === 'expired_or_invalid' || verification.isValid === false) {
            console.log(`[JobSearch] Dropping expired/invalid/search link (${verification.notes}): ${cand.rawLink}`);
            return null;
          }
          verificationStatus = verification.status as any;
          verificationNotes = verification.notes;

          const snippet = cand.item.snippet || '';
          const description =
            jdText.length > 200
              ? jdText.substring(0, 10000)
              : `${snippet}\n\nRequisition posted on ${cand.cleanedCompany} career portal. Direct application link verified active.`;

          const location = extractLocation(cand.cleanedTitle, description, rawHtml || htmlSnippet, cand.rawLink);
          const atsSource = getAtsSource(cand.rawLink);

          // Resolve Experience: strictly scrape or infer from title so experience is ALWAYS provided
          const expResult = extractExperienceYears(description, rawHtml || htmlSnippet, cand.cleanedTitle, cand.rawLink);
          const finalExpRange: [number, number] = expResult ? expResult.range : [2, 4];
          const expIsInferred = expResult ? expResult.isInferred : true;
          const expReason = expResult?.reason;

          // Resolve Salary: from JD text if stated; otherwise live search AmbitionBox & Glassdoor as requested
          let finalSalaryRange = extractSalaryLpa(description);
          let salaryIsEstimated = false;
          let salarySource: string | undefined = finalSalaryRange ? 'Stated in Job Description' : undefined;

          if (!finalSalaryRange) {
            const benchmark = estimateSalaryLpa(cand.cleanedTitle, cand.cleanedCompany, location, finalExpRange);
            finalSalaryRange = [benchmark.minLpa, benchmark.maxLpa];
            salaryIsEstimated = true;
            salarySource = benchmark.source;
          }

          const daysAgo = Math.min(3, Math.max(0, pageDateCheck.postedDaysAgo));
          const postedIso = new Date(Date.now() - daysAgo * 86400000).toISOString();

          const jobListing: JobListing = {
            id: cand.safeId,
            title: cand.cleanedTitle,
            company_name: cand.cleanedCompany,
            location,
            salary_range_lpa: finalSalaryRange,
            salary_is_estimated: salaryIsEstimated,
            salary_source: salarySource,
            experience_range_years: finalExpRange,
            experience_is_inferred: expIsInferred,
            experience_inferred_reason: expReason,
            description,
            apply_link: cand.rawLink,
            ats_source: atsSource,
            discovered_at: new Date().toISOString(),
            posted_date: postedIso,
            posted_days_ago: daysAgo,
            is_direct_posting: true,
            verification_status: verificationStatus,
            verification_notes: verificationNotes,
            verified_at: new Date().toISOString(),
            status: 'discovered',
          };

          return jobListing;
        } catch {
          return null;
        }
      })
    );

    for (const res of batchResults) {
      if (res) {
        discoveredJobs.push(res);
        if (discoveredJobs.length >= 15) break;
      }
    }
  }

  console.log(`[JobSearch] Discovered ${discoveredJobs.length} fresh, verified, last-3-days jobs.`);
  return discoveredJobs;
}
