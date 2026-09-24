const SALARY_PATTERNS = [
  // 1. Explicit Indian LPA: ₹12 - ₹18 LPA / 12 - 18 Lakhs / 12-18 LPA
  /(?:₹|INR|Rs\.?)?\s*(\d{1,3}(?:\.\d+)?)\s*(?:-|to|–|—)\s*(?:₹|INR|Rs\.?)?\s*(\d{1,3}(?:\.\d+)?)\s*(?:L|LPA|Lakhs?)\b/i,
  // 2. Single figure LPA: 15 LPA / ₹15 Lakhs
  /(?:₹|INR|Rs\.?)?\s*(\d{1,3}(?:\.\d+)?)\s*(?:L|LPA|Lakhs?)\b/i,
  // 3. Rupee figures in full amount: ₹8,00,000 - ₹14,00,000
  /(?:₹|INR|Rs\.?)\s*([\d,]{6,8})\s*(?:-|to|–|—)\s*(?:₹|INR|Rs\.?)?\s*([\d,]{6,8})/i,
  // 4. Compact LPA range: 12-16 LPA / 8-12 L/yr
  /(\d{1,2}(?:\.\d+)?)\s*(?:-|to|–|—)\s*(\d{1,2}(?:\.\d+)?)\s*(?:LPA|Lakhs?|L\/yr)\b/i,
  // 5. USD annual salaries (convert to LPA equivalent so it never produces absurd figures)
  /\$\s*([\d,]{4,7})\s*(?:-|to|–|—)\s*\$?\s*([\d,]{4,7})\s*(?:USD|\/yr|per year)?/i
];
const EXPERIENCE_PATTERNS = [
  // 1. Explicit Experience Header: Experience: 3 to 5 yrs / Exp: 4-6 years / Total Experience: 3-5 Years
  /(?:total\s*)?(?:relevant\s*)?(?:work\s*)?exp(?:erience)?\s*(?:expected|required|needed|range)?[:\s-]*(\d{1,2})\s*(?:-|to|–|—|~)\s*(\d{1,2})\s*(?:years?|yrs?\.?)/i,
  // 2. Experience with plus: Experience: 4+ years / Exp: 5+ yrs / Total Experience: 3+ yrs
  /(?:total\s*)?(?:relevant\s*)?(?:work\s*)?exp(?:erience)?\s*(?:expected|required|needed|range)?[:\s-]*(\d{1,2})\s*\+?\s*(?:years?|yrs?\.?)/i,
  // 3. Minimum / At least X to Y years: Minimum 3-5 years / Min 2 to 4 yrs
  /(?:minimum|min\.?|at least)\s*(\d{1,2})\s*(?:-|to|–|—|~)\s*(\d{1,2})\s*(?:years?|yrs?\.?)/i,
  // 4. Minimum / At least X years / X+ years: Minimum 3 years of experience / At least 4 years
  /(?:minimum|min\.?|at least)\s*(\d{1,2})\s*\+?\s*(?:years?|yrs?\.?)(?:\s*(?:of)?\s*(?:relevant|hands-on|industry|work)?\s*experience)?/i,
  // 5. Explicit X to Y years of experience: 4-6 years of experience / 04-06 years experience
  /(\d{1,2})\s*(?:-|to|–|—|~)\s*(\d{1,2})\s*(?:years?|yrs?\.?)\s*(?:of)?\s*(?:relevant|hands-on|industry|work|total)?\s*experience/i,
  // 6. In-bullet phrase: 3+ years experience with / 4+ years in Power Platform
  /(\d{1,2})\s*\+\s*(?:years?|yrs?\.?)\s*(?:of)?\s*(?:relevant|hands-on|industry|work|total)?\s*experience/i,
  // 7. General X-Y Years or Yrs badge / table item: 3-8 Yrs. / 4 - 9 Yrs / 5-10 years
  /\b(\d{1,2})\s*(?:-|to|–|—|~)\s*(\d{1,2})\s*(?:years?|yrs?\.?)\b/i,
  // 8. General X+ Years or Yrs: 5+ years / 3+ yrs
  /\b(\d{1,2})\s*\+\s*(?:years?|yrs?\.?)\b/i,
  // 9. Decimal years: 1.5 to 3 years / 2.5+ years
  /(\d(?:\.\d)?)\s*(?:-|to|–|—|~)\s*(\d(?:\.\d)?)\s*(?:years?|yrs?\.?)/i,
  // 10. Proximity pattern: requirements ... 3-5 years
  /(?:experience|qualifications|requirements)[\s\S]{0,80}?(\d{1,2})\s*(?:-|to|–|—|~)\s*(\d{1,2})\s*(?:years?|yrs?\.?)/i
];
function extractSalaryLpa(text) {
  if (!text) return void 0;
  for (const pat of SALARY_PATTERNS) {
    const m = pat.exec(text);
    if (m) {
      if (pat === SALARY_PATTERNS[2]) {
        const loRaw = parseFloat(m[1].replace(/,/g, ""));
        const hiRaw = parseFloat(m[2].replace(/,/g, ""));
        if (!isNaN(loRaw) && !isNaN(hiRaw)) {
          const loLpa = Math.round(loRaw / 1e5);
          const hiLpa = Math.round(hiRaw / 1e5);
          if (loLpa >= 1 && hiLpa <= 150) {
            return [Math.min(loLpa, hiLpa), Math.max(loLpa, hiLpa)];
          }
        }
      }
      if (pat === SALARY_PATTERNS[4]) {
        const loUsd = parseFloat(m[1].replace(/,/g, ""));
        const hiUsd = parseFloat(m[2].replace(/,/g, ""));
        if (!isNaN(loUsd) && !isNaN(hiUsd) && loUsd > 1e3) {
          const loLpa = Math.round(loUsd * 85 / 1e5);
          const hiLpa = Math.round(hiUsd * 85 / 1e5);
          return [Math.min(loLpa, hiLpa), Math.max(loLpa, hiLpa)];
        }
      }
      if (m[2]) {
        const lo = parseFloat(m[1].replace(/,/g, ""));
        const hi = parseFloat(m[2].replace(/,/g, ""));
        if (!isNaN(lo) && !isNaN(hi) && lo <= 150 && hi <= 150) {
          return [Math.min(lo, hi), Math.max(lo, hi)];
        }
      } else if (m[1]) {
        const v = parseFloat(m[1].replace(/,/g, ""));
        if (!isNaN(v) && v <= 150) {
          return [v, Math.round(v * 1.3)];
        }
      }
    }
  }
  return void 0;
}
function extractExperienceYears(text, rawHtml, title, link) {
  if (link) {
    const urlMatch = link.match(/(\d{1,2})[-_]to[-_](\d{1,2})[-_]years?/i) || link.match(/(\d{1,2})[-_](\d{1,2})[-_]years?/i);
    if (urlMatch) {
      const lo = parseInt(urlMatch[1], 10);
      const hi = parseInt(urlMatch[2], 10);
      if (lo <= 25 && hi <= 30 && lo <= hi) {
        return {
          range: [lo, hi],
          isInferred: false,
          reason: `Exact experience extracted from career requisition URL: ${lo}-${hi} Years`
        };
      }
    }
  }
  const combined = `${text || ""} ${rawHtml ? rawHtml.slice(0, 3e4) : ""}`;
  if (combined.trim()) {
    for (const pat of EXPERIENCE_PATTERNS) {
      const m = pat.exec(combined);
      if (m) {
        if (m[2]) {
          const lo = Math.round(parseFloat(m[1]));
          const hi = Math.round(parseFloat(m[2]));
          if (lo <= 25 && hi <= 30 && lo <= hi) {
            return {
              range: [lo, hi],
              isInferred: false,
              reason: `Exact requirement extracted from Job Description: ${m[0].trim()}`
            };
          }
        } else if (m[1]) {
          const lo = Math.round(parseFloat(m[1]));
          if (lo <= 25) {
            const hi = lo <= 2 ? lo + 2 : lo <= 5 ? lo + 3 : lo + 4;
            return {
              range: [lo, Math.min(hi, 25)],
              isInferred: false,
              reason: `Exact requirement extracted from Job Description: ${m[0].trim()}`
            };
          }
        }
      }
    }
  }
  if (title) {
    const t = title.toLowerCase();
    if (t.includes("director") || t.includes("head") || t.includes("vice president") || t.includes("vp")) {
      return {
        range: [10, 15],
        isInferred: true,
        reason: "Inferred from Seniority ('Director / Head' standard: 10-15 Years)"
      };
    }
    if (t.includes("lead") || t.includes("principal") || t.includes("staff") || t.includes("manager") || t.includes("architect") || t.includes("module lead")) {
      return {
        range: [6, 9],
        isInferred: true,
        reason: "Inferred from Seniority ('Lead / Architect' standard: 6-9 Years)"
      };
    }
    if (t.includes("senior") || t.includes("sr.") || t.includes("sr ") || t.includes("specialist ii") || t.includes("consultant ii")) {
      return {
        range: [3, 6],
        isInferred: true,
        reason: "Inferred from Seniority ('Senior / Specialist' standard: 3-6 Years)"
      };
    }
    if (t.includes("junior") || t.includes("associate") || t.includes("intern") || t.includes("entry") || t.includes("trainee") || t.includes("graduate") || t.includes("fresher")) {
      return {
        range: [0, 2],
        isInferred: true,
        reason: "Inferred from Seniority ('Entry / Associate' standard: 0-2 Years)"
      };
    }
    return {
      range: [2, 4],
      isInferred: true,
      reason: "Inferred from Role Title ('Mid-Level Professional' standard: 2-4 Years)"
    };
  }
  return void 0;
}
export {
  extractExperienceYears,
  extractSalaryLpa
};
