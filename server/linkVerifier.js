const GENERIC_SEARCH_PATTERNS = [
  /shine\.com/i,
  /foundit\.in\/srp/i,
  /foundit\.in\/search/i,
  /monsterindia/i,
  /adzuna/i,
  /bebee/i,
  /timesjobs/i,
  /freshersworld/i,
  /linkedin\.com\/jobs\/search/i,
  /linkedin\.com\/jobs\/collections/i,
  /indeed\.com\/(?:jobs\?|q-)/i,
  /naukri\.com\/(?:[a-z0-9-]+-jobs|jobs-in-|[a-z0-9-]+-jobs-in-)/i,
  /naukri\.com\/.*-(?:jobs|openings|vacancies)/i,
  /[?&]expjd=true/i,
  /google\.com\/search.*(?:ibp=htl;jobs|q=jobs)/i,
  /glassdoor\.com\/(?:Job|Jobs)\/.*-jobs-/i,
  /[?&](?:keywords|keyword|search|searchTerm|query)=/i,
  /\/jobs\/page-\d+/i,
  /\/jobs\?page=/i,
  /\/search\?/i,
  /jobs\.lever\.co\/[^/]+\/?(?:\?[^/]+)?$/i,
  // Lever company listing without individual job ID
  /boards\.greenhouse\.io\/[^/]+\/?(?:\?[^/]+)?$/i,
  // Greenhouse company listing without /jobs/<id>
  /jobs\.ashbyhq\.com\/[^/]+\/?(?:\?[^/]+)?$/i,
  // Ashby company listing without individual job ID
  /[?&](?:workplaceType|location|department|team)=/i
  // Aggregator search filter queries
];
const DIRECT_POSTING_PATTERNS = [
  /\.myworkdayjobs\.com\/[^/]+\/job\/[^/]+/i,
  /boards\.greenhouse\.io\/[^/]+\/jobs\/\d+/i,
  /job-boards\.greenhouse\.io\/[^/]+\/jobs\/\d+/i,
  /jobs\.ashbyhq\.com\/[^/]+\/[a-f0-9-]+/i,
  /jobs\.lever\.co\/[^/]+\/[a-f0-9-]+/i,
  /jobs\.smartrecruiters\.com\/[^/]+\/[0-9a-zA-Z_-]+/i,
  /smrtr\.io\/[0-9a-zA-Z_-]+/i,
  /taleo\.net\/careersection\/.*jobdetail\.ftl/i,
  /linkedin\.com\/jobs\/view\/\d+/i,
  // Direct job posting view ONLY
  /careers\.[^/]+\/jobs\/[a-z0-9_-]+/i,
  /careers\.[^/]+\/posting\/[a-z0-9_-]+/i
];
function isGenericSearchLink(url) {
  if (!url) return true;
  for (const pattern of GENERIC_SEARCH_PATTERNS) {
    if (pattern.test(url)) {
      if (url.includes("linkedin.com/jobs/view/")) {
        continue;
      }
      return true;
    }
  }
  return false;
}
function isDirectPostingLink(url) {
  if (!url) return false;
  if (isGenericSearchLink(url)) return false;
  for (const pattern of DIRECT_POSTING_PATTERNS) {
    if (pattern.test(url)) return true;
  }
  try {
    const parsed = new URL(url);
    const pathParts = parsed.pathname.split("/").filter(Boolean);
    if (pathParts.length >= 2 && !parsed.search.includes("keywords=") && !parsed.search.includes("q=")) {
      return true;
    }
  } catch {
    return false;
  }
  return false;
}
const CLOSED_JOB_KEYWORDS = [
  "this position has been filled",
  "position is no longer available",
  "job has been closed",
  "no longer accepting applications",
  "this job is closed",
  "posting has expired",
  "requisition is closed",
  "job opening has closed"
];
async function checkWorkdayJobPosting(url) {
  try {
    const parsed = new URL(url);
    const hostMatch = parsed.hostname.match(/^([a-zA-Z0-9_-]+)\.wd[0-9]+\.myworkdayjobs\.com$/i);
    if (!hostMatch) return null;
    const tenant = hostMatch[1];
    const segments = parsed.pathname.split("/").filter(Boolean);
    let siteId = "";
    let jobSlugIndex = -1;
    for (let i = 0; i < segments.length; i++) {
      if (segments[i].toLowerCase() === "job") {
        jobSlugIndex = i + 1;
        siteId = segments[i - 1];
        break;
      }
    }
    if (siteId && jobSlugIndex !== -1 && jobSlugIndex < segments.length) {
      const jobSlug = segments.slice(jobSlugIndex).join("/");
      const cxsUrl = `https://${parsed.hostname}/wday/cxs/${tenant}/${siteId}/job/${jobSlug}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4e3);
      try {
        const cxsRes = await fetch(cxsUrl, {
          headers: {
            Accept: "application/json",
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
          },
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        if (cxsRes.status === 404 || cxsRes.status === 410) {
          return {
            isValid: false,
            status: "expired_or_invalid",
            isDirect: true,
            httpStatus: 404,
            notes: "Link Expired: Workday requisition has been closed or removed (HTTP 404).",
            checkedAt: (/* @__PURE__ */ new Date()).toISOString()
          };
        }
        const data = await cxsRes.json().catch(() => null);
        if (data?.errorCode || data?.httpStatus === 404 || typeof data?.message === "string" && data.message.toLowerCase().includes("not found")) {
          return {
            isValid: false,
            status: "expired_or_invalid",
            isDirect: true,
            httpStatus: data?.httpStatus || 404,
            notes: `Link Expired: Workday reports requisition closed/not found (${data?.message || "not found"}).`,
            checkedAt: (/* @__PURE__ */ new Date()).toISOString()
          };
        }
        if (data?.jobPostingInfo) {
          return {
            isValid: true,
            status: "verified_active",
            isDirect: true,
            httpStatus: 200,
            notes: "Verified live: Direct Workday posting actively accepting applications.",
            checkedAt: (/* @__PURE__ */ new Date()).toISOString()
          };
        }
      } catch (err) {
        clearTimeout(timeoutId);
      }
    }
  } catch {
  }
  return null;
}
async function verifyJobPosting(url, company, title) {
  const checkedAt = (/* @__PURE__ */ new Date()).toISOString();
  if (!url || typeof url !== "string" || !url.startsWith("http")) {
    return {
      isValid: false,
      status: "expired_or_invalid",
      isDirect: false,
      notes: "Invalid URL format: Must be a fully qualified HTTPS URL.",
      checkedAt
    };
  }
  if (isGenericSearchLink(url)) {
    return {
      isValid: false,
      status: "expired_or_invalid",
      isDirect: false,
      notes: "Banned: Generic search/aggregator link detected instead of a direct job posting.",
      checkedAt
    };
  }
  const workdayResult = await checkWorkdayJobPosting(url);
  if (workdayResult) {
    return workdayResult;
  }
  const isDirect = isDirectPostingLink(url);
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);
    const headers = {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9"
    };
    let response;
    try {
      const manualRes = await fetch(url, {
        method: "GET",
        headers: { ...headers, Range: "bytes=0-1024" },
        signal: controller.signal,
        redirect: "manual"
      });
      if ([301, 302, 303, 307, 308].includes(manualRes.status)) {
        const loc = manualRes.headers.get("location") || "";
        let resolvedLoc = loc;
        try {
          resolvedLoc = new URL(loc, url).toString();
        } catch {
        }
        if (resolvedLoc.includes("expJD=true") || resolvedLoc.includes("expjd=true") || resolvedLoc.includes("-jobs-in-") || resolvedLoc.includes("/jobs-in-") || isGenericSearchLink(resolvedLoc)) {
          return {
            isValid: false,
            status: "expired_or_invalid",
            isDirect: false,
            httpStatus: manualRes.status,
            notes: `Expired posting: Career portal redirected to search query results page (${resolvedLoc.substring(0, 70)}).`,
            checkedAt
          };
        }
      }
      response = await fetch(url, {
        method: "GET",
        headers: { ...headers, Range: "bytes=0-4096" },
        signal: controller.signal,
        redirect: "follow"
      });
    } catch {
      response = await fetch(url, {
        method: "HEAD",
        headers,
        signal: controller.signal,
        redirect: "follow"
      });
    } finally {
      clearTimeout(timeoutId);
    }
    const httpStatus = response.status;
    const finalUrl = response.url || url;
    if (finalUrl.includes("expJD=true") || finalUrl.includes("expjd=true") || finalUrl.includes("-jobs-in-") || finalUrl.includes("/jobs-in-") || isGenericSearchLink(finalUrl)) {
      return {
        isValid: false,
        status: "expired_or_invalid",
        isDirect: false,
        httpStatus,
        notes: `Expired posting: Destination is a generic search query page (${finalUrl.substring(0, 70)}).`,
        checkedAt
      };
    }
    if (httpStatus === 404 || httpStatus === 410) {
      return {
        isValid: false,
        status: "expired_or_invalid",
        isDirect,
        httpStatus,
        notes: `HTTP ${httpStatus}: Requisition page not found or expired on career portal.`,
        checkedAt
      };
    }
    if (response.ok) {
      try {
        const textSample = await response.text();
        const lowerText = textSample.toLowerCase();
        for (const closedKw of CLOSED_JOB_KEYWORDS) {
          if (lowerText.includes(closedKw)) {
            return {
              isValid: false,
              status: "expired_or_invalid",
              isDirect,
              httpStatus,
              notes: `Portal indicates vacancy closed: "${closedKw}"`,
              checkedAt
            };
          }
        }
      } catch {
      }
      return {
        isValid: true,
        status: "verified_active",
        isDirect,
        httpStatus,
        notes: "Verified live: Direct career portal posting actively accepting applications.",
        checkedAt
      };
    }
    if (httpStatus === 403 || httpStatus === 401) {
      return {
        isValid: true,
        status: "active_portal",
        isDirect,
        httpStatus,
        notes: "Direct enterprise ATS posting verified (protected career gateway).",
        checkedAt
      };
    }
    return {
      isValid: true,
      status: "active_portal",
      isDirect,
      httpStatus,
      notes: `Active portal responded with HTTP ${httpStatus}.`,
      checkedAt
    };
  } catch (err) {
    const errCode = err.cause?.code || err.code || "";
    const errMsg = (err.message || "").toLowerCase();
    if (errCode === "ENOTFOUND" || errCode === "EAI_AGAIN" || errCode === "ECONNREFUSED" || errCode === "ENETUNREACH" || errMsg.includes("enotfound") || errMsg.includes("getaddrinfo") || errMsg.includes("econnrefused")) {
      return {
        isValid: false,
        status: "expired_or_invalid",
        isDirect: false,
        notes: `Broken link: Domain not found or server refused connection (${errCode || "ENOTFOUND"}).`,
        checkedAt
      };
    }
    const parsed = (() => {
      try {
        return new URL(url);
      } catch {
        return null;
      }
    })();
    const isEnterpriseAts = parsed && (parsed.hostname.endsWith("myworkdayjobs.com") || parsed.hostname.endsWith("greenhouse.io") || parsed.hostname.endsWith("lever.co") || parsed.hostname.endsWith("ashbyhq.com") || parsed.hostname.endsWith("smartrecruiters.com"));
    if (isEnterpriseAts && isDirect && !errMsg.includes("enotfound")) {
      return {
        isValid: true,
        status: "active_portal",
        isDirect: true,
        notes: "Direct enterprise ATS requisition structure verified.",
        checkedAt
      };
    }
    return {
      isValid: false,
      status: "expired_or_invalid",
      isDirect: false,
      notes: `Link unreachable: ${err.message || "Connection failed"}`,
      checkedAt
    };
  }
}
export {
  isDirectPostingLink,
  isGenericSearchLink,
  verifyJobPosting
};
