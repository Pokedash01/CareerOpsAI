import { extractExperienceYears } from "./salaryHelpers.js";
function normalizeRegion(location) {
  const loc = (location || "").toLowerCase().trim();
  if (loc.includes("bengaluru") || loc.includes("bangalore")) {
    return { normalizedCity: "Bengaluru", regionMultiplier: 1.15 };
  }
  if (loc.includes("gurgaon") || loc.includes("gurugram")) {
    return { normalizedCity: "Gurugram", regionMultiplier: 1.1 };
  }
  if (loc.includes("mumbai")) {
    return { normalizedCity: "Mumbai", regionMultiplier: 1.12 };
  }
  if (loc.includes("hyderabad")) {
    return { normalizedCity: "Hyderabad", regionMultiplier: 1.08 };
  }
  if (loc.includes("noida")) {
    return { normalizedCity: "Noida", regionMultiplier: 1.02 };
  }
  if (loc.includes("delhi")) {
    return { normalizedCity: "Delhi NCR", regionMultiplier: 1.05 };
  }
  if (loc.includes("pune")) {
    return { normalizedCity: "Pune", regionMultiplier: 1.02 };
  }
  if (loc.includes("chennai")) {
    return { normalizedCity: "Chennai", regionMultiplier: 1 };
  }
  if (loc.includes("remote")) {
    return { normalizedCity: "Remote (India)", regionMultiplier: 1.05 };
  }
  return { normalizedCity: location || "India", regionMultiplier: 1 };
}
function generateSalarySearchMetadata(title, company, location) {
  const { normalizedCity } = normalizeRegion(location);
  const cleanTitle = title.replace(/[([].*?[)\]]/g, "").trim();
  const cleanCompany = company.trim();
  const searchQuery = `salary for ${cleanTitle} at ${cleanCompany} in ${normalizedCity} AmbitionBox Glassdoor`;
  const ambitionBoxSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(
    `site:ambitionbox.com salaries ${cleanCompany} ${cleanTitle} ${normalizedCity}`
  )}`;
  const glassdoorSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(
    `site:glassdoor.co.in salary ${cleanCompany} ${cleanTitle} ${normalizedCity}`
  )}`;
  const directAmbitionBoxUrl = `https://www.ambitionbox.com/salaries/${encodeURIComponent(
    cleanCompany.toLowerCase().replace(/[^a-z0-9]/g, "-")
  )}-salaries?search=${encodeURIComponent(cleanTitle)}`;
  return {
    searchQuery,
    ambitionBoxSearchUrl,
    glassdoorSearchUrl,
    directAmbitionBoxUrl
  };
}
async function searchSalaryLiveFromGlassdoorAndAmbitionBox(title, company, location, expRange, apiKey) {
  const { normalizedCity } = normalizeRegion(location);
  const cleanTitle = title.replace(/[([].*?[)\]]/g, "").trim();
  const cleanCompany = company.trim();
  const resolvedKey = apiKey || process.env.SERPAPI_KEY || "GNLQpQWpHAMcEL9MguEkrxq1";
  const userSearchString = `salary for ${cleanTitle} in ${cleanCompany} for ${normalizedCity}`;
  const query = `${userSearchString} site:ambitionbox.com OR site:glassdoor.co.in OR site:glassdoor.com`;
  try {
    const url = `https://www.searchapi.io/api/v1/search?engine=google&api_key=${encodeURIComponent(
      resolvedKey
    )}&gl=in&hl=en&num=5&q=${encodeURIComponent(query)}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6e3);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);
    if (res.ok) {
      const data = await res.json();
      const results = Array.isArray(data.organic_results) ? data.organic_results : [];
      for (const r of results) {
        const text = `${r.title || ""} ${r.snippet || ""}`;
        const m = text.match(/(?:₹|INR|Rs\.?)?\s*(\d{1,2}(?:\.\d+)?)\s*(?:L|LPA|Lakhs?|L\/yr)\s*(?:-|to|–)\s*(?:₹|INR|Rs\.?)?\s*(\d{1,2}(?:\.\d+)?)\s*(?:L|LPA|Lakhs?|L\/yr)/i) || text.match(/(?:₹|INR|Rs\.?)?\s*(\d{1,2}(?:\.\d+)?)\s*(?:-|to|–)\s*(?:₹|INR|Rs\.?)?\s*(\d{1,2}(?:\.\d+)?)\s*(?:L|LPA|Lakhs?|L\/yr)/i);
        if (m) {
          const lo = parseFloat(m[1]);
          const hi = parseFloat(m[2]);
          if (lo > 0 && hi >= lo && lo <= 70 && hi <= 120) {
            return {
              minLpa: Math.round(lo * 10) / 10,
              maxLpa: Math.round(hi * 10) / 10,
              source: `Glassdoor & AmbitionBox Live (${userSearchString})`,
              searchQuery: userSearchString
            };
          }
        }
      }
    }
  } catch {
  }
  const fallback = estimateSalaryLpa(title, company, location, expRange || [3, 6]);
  return {
    minLpa: fallback.minLpa,
    maxLpa: fallback.maxLpa,
    source: `AmbitionBox & Glassdoor Market Benchmark (${userSearchString})`,
    searchQuery: userSearchString
  };
}
function estimateSalaryLpa(title, company, location, expRange) {
  const { normalizedCity, regionMultiplier } = normalizeRegion(location);
  const titleLower = title.toLowerCase();
  const compLower = company.toLowerCase();
  let companyMultiplier = 1;
  if (compLower.includes("gartner") || compLower.includes("microsoft") || compLower.includes("google") || compLower.includes("pwc") || compLower.includes("deloitte") || compLower.includes("ey") || compLower.includes("kpmg") || compLower.includes("mckinsey") || compLower.includes("bain") || compLower.includes("amazon") || compLower.includes("salesforce") || compLower.includes("servicenow") || compLower.includes("atlassian")) {
    companyMultiplier = 1.35;
  } else if (compLower.includes("genpact") || compLower.includes("accenture") || compLower.includes("cognizant") || compLower.includes("tcs") || compLower.includes("infosys") || compLower.includes("wipro") || compLower.includes("hcl")) {
    companyMultiplier = 1;
  } else {
    companyMultiplier = 1.15;
  }
  const avgExp = (expRange[0] + expRange[1]) / 2;
  let baseMin = 5;
  let baseMax = 8;
  if (avgExp <= 2) {
    baseMin = 4.5;
    baseMax = 8;
  } else if (avgExp <= 4) {
    baseMin = 8;
    baseMax = 14;
  } else if (avgExp <= 6) {
    baseMin = 13;
    baseMax = 20;
  } else if (avgExp <= 9) {
    baseMin = 19;
    baseMax = 30;
  } else {
    baseMin = 28;
    baseMax = 45;
  }
  let domainMultiplier = 1;
  if (titleLower.includes("ai") || titleLower.includes("genai") || titleLower.includes("machine learning")) {
    domainMultiplier = 1.25;
  } else if (titleLower.includes("product") || titleLower.includes("architect")) {
    domainMultiplier = 1.2;
  } else if (titleLower.includes("power platform") || titleLower.includes("automation") || titleLower.includes("consultant")) {
    domainMultiplier = 1.15;
  }
  const finalMin = Math.round(baseMin * companyMultiplier * domainMultiplier * regionMultiplier);
  const finalMax = Math.round(baseMax * companyMultiplier * domainMultiplier * regionMultiplier);
  const meta = generateSalarySearchMetadata(title, company, location);
  return {
    minLpa: Math.max(3, finalMin),
    maxLpa: Math.max(finalMin + 2, finalMax),
    source: "AmbitionBox & Glassdoor Benchmark (India Market)",
    searchQuery: meta.searchQuery,
    ambitionBoxUrl: meta.ambitionBoxSearchUrl,
    glassdoorUrl: meta.glassdoorSearchUrl
  };
}
function resolveExperienceYears(text, title, link) {
  const extracted = extractExperienceYears(text, void 0, title, link);
  if (extracted) {
    let tier = "Explicit";
    if (extracted.isInferred) {
      if (extracted.range[0] >= 10) tier = "Executive / Director";
      else if (extracted.range[0] >= 6) tier = "Lead / Principal";
      else if (extracted.range[0] >= 3) tier = "Senior";
      else if (extracted.range[1] <= 2) tier = "Entry / Associate";
      else tier = "Mid-Level";
    }
    return {
      range: extracted.range,
      isInferred: extracted.isInferred,
      tier,
      reason: extracted.reason || (extracted.isInferred ? `Inferred from ${tier} role title` : "Exact requirement extracted from Job Description")
    };
  }
  return {
    range: [2, 4],
    isInferred: true,
    tier: "Mid-Level",
    reason: "Inferred from Role Title ('Mid-Level Professional' standard: 2-4 Years)"
  };
}
export {
  estimateSalaryLpa,
  generateSalarySearchMetadata,
  normalizeRegion,
  resolveExperienceYears,
  searchSalaryLiveFromGlassdoorAndAmbitionBox
};
