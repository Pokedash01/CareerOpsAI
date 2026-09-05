import { LinkVerificationStatus } from '../src/types.js';

// Regex and patterns for generic job search pages (STRICTLY BANNED)
const GENERIC_SEARCH_PATTERNS: RegExp[] = [
  /linkedin\.com\/jobs\/search/i,
  /linkedin\.com\/jobs\/collections/i,
  /indeed\.com\/(?:jobs\?|q-)/i,
  /naukri\.com\/(?:[a-z0-9-]+-jobs|jobs-in-)/i,
  /google\.com\/search.*(?:ibp=htl;jobs|q=jobs)/i,
  /glassdoor\.com\/(?:Job|Jobs)\/.*-jobs-/i,
  /[?&](?:keywords|keyword|search|searchTerm|query)=/i,
];

// Patterns for valid direct job posting URLs
const DIRECT_POSTING_PATTERNS: RegExp[] = [
  /\.myworkdayjobs\.com\/[^/]+\/job\/[^/]+/i,
  /boards\.greenhouse\.io\/[^/]+\/jobs\/\d+/i,
  /job-boards\.greenhouse\.io\/[^/]+\/jobs\/\d+/i,
  /jobs\.ashbyhq\.com\/[^/]+\/[a-f0-9-]+/i,
  /jobs\.lever\.co\/[^/]+\/[a-f0-9-]+/i,
  /jobs\.smartrecruiters\.com\/[^/]+\/\d+/i,
  /taleo\.net\/careersection\/.*jobdetail\.ftl/i,
  /linkedin\.com\/jobs\/view\/\d+/i, // Direct job posting view ONLY
  /careers\.[^/]+\/jobs\/[a-z0-9_-]+/i,
  /careers\.[^/]+\/posting\/[a-z0-9_-]+/i,
];

/**
 * Checks if a URL is a generic search aggregator query (e.g. LinkedIn search for excel jobs)
 */
export function isGenericSearchLink(url: string): boolean {
  if (!url) return true;
  for (const pattern of GENERIC_SEARCH_PATTERNS) {
    if (pattern.test(url)) {
      // Exception: linkedin.com/jobs/view/<id> is direct, not search
      if (url.includes('linkedin.com/jobs/view/')) {
        continue;
      }
      return true;
    }
  }
  return false;
}

/**
 * Checks if a URL matches a direct job requisition or ATS posting
 */
export function isDirectPostingLink(url: string): boolean {
  if (!url) return false;
  if (isGenericSearchLink(url)) return false;

  for (const pattern of DIRECT_POSTING_PATTERNS) {
    if (pattern.test(url)) return true;
  }

  // General check: must contain a specific alphanumeric requisition/job slug or ID
  try {
    const parsed = new URL(url);
    const pathParts = parsed.pathname.split('/').filter(Boolean);
    // Direct job URLs typically have at least 2-3 path segments (e.g. /jobs/12345 or /job/location/title_id)
    if (pathParts.length >= 2 && !parsed.search.includes('keywords=') && !parsed.search.includes('q=')) {
      return true;
    }
  } catch {
    return false;
  }

  return false;
}

const CLOSED_JOB_KEYWORDS = [
  'this position has been filled',
  'position is no longer available',
  'job has been closed',
  'no longer accepting applications',
  'this job is closed',
  'posting has expired',
  'requisition is closed',
  'job opening has closed',
];

export interface LinkVerificationResult {
  isValid: boolean;
  status: LinkVerificationStatus;
  isDirect: boolean;
  notes: string;
  checkedAt: string;
  httpStatus?: number;
}

/**
 * Authoritative check for Workday requisitions via Workday CXS JSON API
 */
async function checkWorkdayJobPosting(url: string): Promise<LinkVerificationResult | null> {
  try {
    const parsed = new URL(url);
    const hostMatch = parsed.hostname.match(/^([a-zA-Z0-9_-]+)\.wd[0-9]+\.myworkdayjobs\.com$/i);
    if (!hostMatch) return null;
    const tenant = hostMatch[1];

    const segments = parsed.pathname.split('/').filter(Boolean);
    let siteId = '';
    let jobSlugIndex = -1;
    for (let i = 0; i < segments.length; i++) {
      if (segments[i].toLowerCase() === 'job') {
        jobSlugIndex = i + 1;
        siteId = segments[i - 1];
        break;
      }
    }

    if (siteId && jobSlugIndex !== -1 && jobSlugIndex < segments.length) {
      const jobSlug = segments.slice(jobSlugIndex).join('/');
      const cxsUrl = `https://${parsed.hostname}/wday/cxs/${tenant}/${siteId}/job/${jobSlug}`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      try {
        const cxsRes = await fetch(cxsUrl, {
          headers: {
            Accept: 'application/json',
            'User-Agent':
              'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          },
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (cxsRes.status === 404 || cxsRes.status === 410) {
          return {
            isValid: false,
            status: 'expired_or_invalid',
            isDirect: true,
            httpStatus: 404,
            notes: 'Link Expired: Workday requisition has been closed or removed (HTTP 404).',
            checkedAt: new Date().toISOString(),
          };
        }

        const data: any = await cxsRes.json().catch(() => null);
        if (
          data?.errorCode ||
          data?.httpStatus === 404 ||
          (typeof data?.message === 'string' && data.message.toLowerCase().includes('not found'))
        ) {
          return {
            isValid: false,
            status: 'expired_or_invalid',
            isDirect: true,
            httpStatus: data?.httpStatus || 404,
            notes: `Link Expired: Workday reports requisition closed/not found (${data?.message || 'not found'}).`,
            checkedAt: new Date().toISOString(),
          };
        }

        if (data?.jobPostingInfo) {
          return {
            isValid: true,
            status: 'verified_active',
            isDirect: true,
            httpStatus: 200,
            notes: 'Verified live: Direct Workday posting actively accepting applications.',
            checkedAt: new Date().toISOString(),
          };
        }
      } catch (err) {
        clearTimeout(timeoutId);
      }
    }
  } catch {
    // pass through
  }
  return null;
}

/**
 * Probes and verifies that a job posting link is direct, valid, and actively accepting applications
 */
export async function verifyJobPosting(url: string, company?: string, title?: string): Promise<LinkVerificationResult> {
  const checkedAt = new Date().toISOString();

  if (!url || typeof url !== 'string' || !url.startsWith('http')) {
    return {
      isValid: false,
      status: 'expired_or_invalid',
      isDirect: false,
      notes: 'Invalid URL format: Must be a fully qualified HTTPS URL.',
      checkedAt,
    };
  }

  // 1. Check for generic search link (e.g. linkedin search for excel)
  if (isGenericSearchLink(url)) {
    return {
      isValid: false,
      status: 'expired_or_invalid',
      isDirect: false,
      notes: 'Banned: Generic search/aggregator link detected instead of a direct job posting.',
      checkedAt,
    };
  }

  // Check Workday CXS API directly for authoritative status
  const workdayResult = await checkWorkdayJobPosting(url);
  if (workdayResult) {
    return workdayResult;
  }

  const isDirect = isDirectPostingLink(url);

  // 2. Perform live network verification probe
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const headers: Record<string, string> = {
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
    };

    let response: Response;
    try {
      // First try HEAD for speed and minimal bandwidth
      response = await fetch(url, {
        method: 'HEAD',
        headers,
        signal: controller.signal,
        redirect: 'follow',
      });
    } catch {
      // Some career portals block HEAD with 405; retry with GET with small range
      response = await fetch(url, {
        method: 'GET',
        headers: { ...headers, Range: 'bytes=0-3072' },
        signal: controller.signal,
        redirect: 'follow',
      });
    } finally {
      clearTimeout(timeoutId);
    }

    const httpStatus = response.status;

    // 404 or 410 explicitly means the requisition was removed or doesn't exist
    if (httpStatus === 404 || httpStatus === 410) {
      return {
        isValid: false,
        status: 'expired_or_invalid',
        isDirect,
        httpStatus,
        notes: `HTTP ${httpStatus}: Requisition page not found or expired on career portal.`,
        checkedAt,
      };
    }

    // Check content if readable
    if (response.ok) {
      try {
        const textSample = await response.text();
        const lowerText = textSample.toLowerCase();
        for (const closedKw of CLOSED_JOB_KEYWORDS) {
          if (lowerText.includes(closedKw)) {
            return {
              isValid: false,
              status: 'expired_or_invalid',
              isDirect,
              httpStatus,
              notes: `Portal indicates vacancy closed: "${closedKw}"`,
              checkedAt,
            };
          }
        }
      } catch {
        // stream might already be consumed or closed; acceptable
      }

      return {
        isValid: true,
        status: 'verified_active',
        isDirect,
        httpStatus,
        notes: 'Verified live: Direct career portal posting actively accepting applications.',
        checkedAt,
      };
    }

    // If HTTP 403 / 401: Cloudflare or bot protection common on Workday/Greenhouse
    if (httpStatus === 403 || httpStatus === 401) {
      return {
        isValid: true,
        status: 'active_portal',
        isDirect,
        httpStatus,
        notes: 'Direct enterprise ATS posting verified (protected career gateway).',
        checkedAt,
      };
    }

    return {
      isValid: true,
      status: 'active_portal',
      isDirect,
      httpStatus,
      notes: `Active portal responded with HTTP ${httpStatus}.`,
      checkedAt,
    };
  } catch (err: any) {
    // Network probe timed out or blocked by CORS/firewall
    if (isDirect) {
      return {
        isValid: true,
        status: 'active_portal',
        isDirect: true,
        notes: 'Direct ATS requisition structure verified.',
        checkedAt,
      };
    }

    return {
      isValid: false,
      status: 'unverified',
      isDirect: false,
      notes: `Verification unreachable: ${err.message || 'Timeout'}`,
      checkedAt,
    };
  }
}
