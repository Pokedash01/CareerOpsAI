import type { UserProfile, MatchResult } from '../src/types.js';
import { getGeminiClient, cleanJsonResponse } from './gemini.js';
import { resolveExperienceYears, estimateSalaryLpa } from './salaryEstimator.js';
import crypto from 'crypto';

// In-memory fit evaluation cache: zero LLM credit consumption on repeat evaluations
const FIT_CACHE = new Map<string, MatchResult>();

const KNOWN_ALIASES: Record<string, string> = {
  gurgaon: 'gurugram',
  gurugram: 'gurgaon',
  bangalore: 'bengaluru',
  bengaluru: 'bangalore',
  delhi: 'new delhi',
  'new delhi': 'delhi',
  noida: 'noida',
  remote: 'remote',
};

export function locationMatches(jobLocation: string, preferredLocations: string[] = []): boolean {
  if (!preferredLocations || preferredLocations.length === 0) return true;
  if (!jobLocation || jobLocation === 'Not specified') return true;

  const jobLocLower = jobLocation.toLowerCase();
  if (
    jobLocLower.includes('remote') ||
    jobLocLower.includes('work from home') ||
    jobLocLower.includes('hybrid') ||
    jobLocLower.includes('india') ||
    jobLocLower.includes('ncr') ||
    jobLocLower.includes('delhi ncr') ||
    jobLocLower.includes('haryana')
  ) {
    return true;
  }

  for (const pref of preferredLocations) {
    const prefLower = pref.toLowerCase();
    if (jobLocLower.includes(prefLower) || prefLower.includes(jobLocLower)) {
      return true;
    }
    const alias = KNOWN_ALIASES[jobLocLower];
    if (alias && (alias === prefLower || alias.includes(prefLower) || prefLower.includes(alias))) {
      return true;
    }
    const prefAlias = KNOWN_ALIASES[prefLower];
    if (prefAlias && (prefAlias === jobLocLower || prefAlias.includes(jobLocLower) || jobLocLower.includes(prefAlias))) {
      return true;
    }
  }
  return false;
}

export function experienceOk(candExp: number, expRange?: [number, number], tolerance: number = 1.8): { ok: boolean; reason?: string } {
  if (!expRange) return { ok: true };
  const [minReq] = expRange;
  if (candExp + tolerance < minReq) {
    return {
      ok: false,
      reason: `Role requires ${minReq}+ years, candidate profile has ${candExp} years.`,
    };
  }
  return { ok: true };
}

export function salaryOk(
  salaryRangeLpa?: [number, number],
  expectation?: { min_lpa: number; max_lpa?: number },
  tolerance: number = 1.0
): { ok: boolean; reason?: string } {
  if (!salaryRangeLpa || !expectation) return { ok: true };
  const jobMax = salaryRangeLpa[1];
  const candMin = expectation.min_lpa;
  if (jobMax + tolerance < candMin) {
    return {
      ok: false,
      reason: `Role offers up to ₹${jobMax} LPA, below expected minimum of ₹${candMin} LPA.`,
    };
  }
  return { ok: true };
}

export async function evaluateJobFit(
  profile: UserProfile,
  jobTitle: string,
  company: string,
  jobDesc: string,
  location: string = 'Not specified',
  salaryRangeLpa?: [number, number],
  experienceRangeYears?: [number, number]
): Promise<MatchResult> {
  const candExp = Number(profile.total_years_experience || 3.0);
  const candSkills = (profile.skills || []).map((s) => s.toLowerCase());
  const preferredLocations = profile.preferred_locations || [];
  const antiTargets = (profile.anti_targets || []).map((t) => t.toLowerCase());
  const titleLower = jobTitle.toLowerCase();

  // In-memory cache key: returns immediately with 0 credit consumption if evaluated previously
  const cacheKey = crypto
    .createHash('sha256')
    .update(`${profile.full_name}_${jobTitle}_${company}_${location}_${jobDesc.substring(0, 300)}_${salaryRangeLpa ? salaryRangeLpa.join('-') : 'none'}_${experienceRangeYears ? experienceRangeYears.join('-') : 'none'}`)
    .digest('hex');

  if (FIT_CACHE.has(cacheKey)) {
    return { ...FIT_CACHE.get(cacheKey)!, evaluated_at: new Date().toISOString() };
  }

  // --- Deterministic hard filters (checked in code, not left to the LLM) ---
  for (const anti of antiTargets) {
    if (titleLower.includes(anti)) {
      const res: MatchResult = {
        is_viable: false,
        match_score: 0,
        detected_experience: experienceRangeYears ? `${experienceRangeYears[0]}-${experienceRangeYears[1]} Years` : 'Not specified in JD',
        salary_range: salaryRangeLpa ? `₹${salaryRangeLpa[0]} - ₹${salaryRangeLpa[1]} LPA` : 'Not specified in JD',
        location,
        skills_gap: `Anti-target role: ${anti}`,
        rejection_reason: `Role matches candidate anti-target blacklist: '${anti}'.`,
        evaluated_at: new Date().toISOString(),
      };
      FIT_CACHE.set(cacheKey, res);
      return res;
    }
  }

  if (titleLower.includes('python') && !candSkills.includes('python')) {
    const res: MatchResult = {
      is_viable: false,
      match_score: 0,
      detected_experience: experienceRangeYears ? `${experienceRangeYears[0]}-${experienceRangeYears[1]} Years` : 'Not specified in JD',
      salary_range: salaryRangeLpa ? `₹${salaryRangeLpa[0]} - ₹${salaryRangeLpa[1]} LPA` : 'Not specified in JD',
      location,
      skills_gap: 'Python',
      rejection_reason: 'Role demands Python',
      evaluated_at: new Date().toISOString(),
    };
    FIT_CACHE.set(cacheKey, res);
    return res;
  }

  if (titleLower.includes('java') && !candSkills.includes('java')) {
    const res: MatchResult = {
      is_viable: false,
      match_score: 0,
      detected_experience: experienceRangeYears ? `${experienceRangeYears[0]}-${experienceRangeYears[1]} Years` : 'Not specified in JD',
      salary_range: salaryRangeLpa ? `₹${salaryRangeLpa[0]} - ₹${salaryRangeLpa[1]} LPA` : 'Not specified in JD',
      location,
      skills_gap: 'Java',
      rejection_reason: 'Role demands Java',
      evaluated_at: new Date().toISOString(),
    };
    FIT_CACHE.set(cacheKey, res);
    return res;
  }

  if (!locationMatches(location, preferredLocations)) {
    const res: MatchResult = {
      is_viable: false,
      match_score: 0,
      detected_experience: 'Not evaluated',
      salary_range: 'Not evaluated',
      location,
      skills_gap: 'Location mismatch',
      rejection_reason: `Location '${location}' not in preferred list [${preferredLocations.join(', ')}]`,
      evaluated_at: new Date().toISOString(),
    };
    FIT_CACHE.set(cacheKey, res);
    return res;
  }

  const expCheck = experienceOk(candExp, experienceRangeYears);
  if (!expCheck.ok) {
    const res: MatchResult = {
      is_viable: false,
      match_score: 0,
      detected_experience: experienceRangeYears ? `${experienceRangeYears[0]}-${experienceRangeYears[1]} Years` : 'Not evaluated',
      salary_range: 'Not evaluated',
      location,
      skills_gap: 'Seniority gap',
      rejection_reason: expCheck.reason,
      evaluated_at: new Date().toISOString(),
    };
    FIT_CACHE.set(cacheKey, res);
    return res;
  }

  const salCheck = salaryOk(salaryRangeLpa, profile.salary_expectation);
  if (!salCheck.ok) {
    const res: MatchResult = {
      is_viable: false,
      match_score: 0,
      detected_experience: 'Not evaluated',
      salary_range: salaryRangeLpa ? `₹${salaryRangeLpa[0]} - ₹${salaryRangeLpa[1]} LPA` : 'Not evaluated',
      location,
      skills_gap: 'Compensation expectation gap',
      rejection_reason: salCheck.reason,
      evaluated_at: new Date().toISOString(),
    };
    FIT_CACHE.set(cacheKey, res);
    return res;
  }

  // --- End deterministic filters; LLM evaluates substantive skill and role fit ---
  const salaryFact = salaryRangeLpa
    ? `₹${salaryRangeLpa[0]} - ₹${salaryRangeLpa[1]} LPA`
    : 'Benchmark: ₹12 - ₹18 LPA (AmbitionBox & Glassdoor)';
  const experienceFact = experienceRangeYears
    ? `${experienceRangeYears[0]}-${experienceRangeYears[1]} Years`
    : 'Not explicitly stated in JD';

  const systemPrompt = `You are a strict technical recruiter evaluating a candidate against a job description.
Candidate Experience: ${candExp} Years.
Candidate Verified Skills: ${profile.skills.join(', ')}
Baseline facts extracted from the requisition:
- Location: ${location}
- Baseline Salary: ${salaryFact}
- Extracted Experience: ${experienceFact}

STRICT ACCURACY RULES:
1. Thoroughly read the entire job description, including Technical Requirements, Qualifications, and Key Responsibilities.
2. If the job expects knowledge of tools, APIs, frameworks, or languages the candidate lacks (e.g., Power Fx, REST APIs, SPFx, PCF, C#, Java, Python), you MUST list them explicitly in "skills_gap" (e.g. "Power Fx, REST APIs"). NEVER return "None" if requirements differ from candidate skills.
3. If the candidate lacks essential required tech stack items (such as Power Fx or REST APIs for a Lead role), adjust match_score accordingly (e.g. 55-75%) and explain the gap clearly.
4. For "detected_experience": Extract the EXACT required years of experience explicitly stated in the Job Description (e.g., "3-5 Years", "5+ Years", "Minimum 4 Years", "1-3 Years"). If the JD truly contains no mention of experience years anywhere, return "${experienceFact}".
5. For "salary_range": If the JD states salary numbers, state them. Otherwise return "${salaryFact}".

Return JSON matching this exact schema:
{
  "is_viable": boolean,
  "match_score": number (0 to 100),
  "detected_experience": string,
  "salary_range": string,
  "location": "${location}",
  "skills_gap": "None" or "Specific Missing Tools (e.g. Power Fx, REST APIs)",
  "summary_reasoning": string,
  "strengths": string[],
  "weaknesses": string[]
}`;

  const prompt = `Target Role: ${jobTitle} at ${company}
Job Description:
${jobDesc.substring(0, 10000)}

Analyze fit thoroughly and output valid JSON.`;

  try {
    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.2,
        responseMimeType: 'application/json',
        maxOutputTokens: 600, // strictly prevent excess credit burn
      },
    });

    const result = cleanJsonResponse(response.text || '{}');

    // Deterministic technical gap check for high-frequency Power Platform / Integration skills:
    const jdLower = jobDesc.toLowerCase();
    const candSkillsLower = (profile.skills || []).map((s) => s.toLowerCase());
    const explicitGaps: string[] = [];

    if (
      (jdLower.includes('power fx') || jdLower.includes('powerfx')) &&
      !candSkillsLower.some((s) => s.includes('power fx') || s.includes('powerfx'))
    ) {
      explicitGaps.push('Power Fx');
    }
    if (
      (jdLower.includes('rest api') || jdLower.includes('rest apis')) &&
      !candSkillsLower.some((s) => s.includes('rest api') || s.includes('rest apis') || s.includes('rest'))
    ) {
      explicitGaps.push('REST APIs');
    }
    if (jdLower.includes('spfx') && !candSkillsLower.some((s) => s.includes('spfx'))) {
      explicitGaps.push('SPFx');
    }
    if (
      (jdLower.includes('pcf') || jdLower.includes('power apps component framework')) &&
      !candSkillsLower.some((s) => s.includes('pcf'))
    ) {
      explicitGaps.push('PCF');
    }

    let detectedGap = result.skills_gap || 'None';
    if (explicitGaps.length > 0) {
      if (!detectedGap || detectedGap.toLowerCase() === 'none') {
        detectedGap = explicitGaps.join(', ');
      } else {
        for (const g of explicitGaps) {
          if (!detectedGap.toLowerCase().includes(g.toLowerCase())) {
            detectedGap += `, ${g}`;
          }
        }
      }
    }

    const matchRes: MatchResult = {
      is_viable: Boolean(result.is_viable),
      match_score: typeof result.match_score === 'number' ? Math.min(100, Math.max(0, result.match_score)) : 70,
      detected_experience: result.detected_experience || experienceFact,
      salary_range: result.salary_range || salaryFact,
      location: result.location || location,
      skills_gap: detectedGap,
      summary_reasoning: result.summary_reasoning || `Evaluated fit for ${jobTitle} at ${company}`,
      strengths: Array.isArray(result.strengths) ? result.strengths : [],
      weaknesses: Array.isArray(result.weaknesses) ? result.weaknesses : [],
      evaluated_at: new Date().toISOString(),
    };
    FIT_CACHE.set(cacheKey, matchRes);
    return matchRes;
  } catch (error) {
    console.error('[Matcher] Gemini evaluation failed, computing heuristic score:', error);
    // Sophisticated heuristic fallback if Gemini API is temporarily unavailable
    const jdLower = jobDesc.toLowerCase();
    const candSkillsLower = (profile.skills || []).map((s) => s.toLowerCase());
    let score = 65;
    const matchedSkills: string[] = [];
    const missingSkills: string[] = [];

    // 1. Role Title Alignment
    const targetRoles = profile.target_roles || [];
    const isDirectRoleMatch = targetRoles.some((r) => {
      const rl = r.toLowerCase();
      return (
        titleLower.includes(rl) ||
        rl.includes(titleLower) ||
        (titleLower.includes('business analyst') && rl.includes('business analyst')) ||
        (titleLower.includes('analyst') && rl.includes('analyst')) ||
        (titleLower.includes('solutions') && rl.includes('solutions')) ||
        (titleLower.includes('power') && rl.includes('power')) ||
        (titleLower.includes('automation') && rl.includes('automation')) ||
        (titleLower.includes('data') && rl.includes('data'))
      );
    });
    if (isDirectRoleMatch) {
      score += 12;
    }

    // 2. Location Alignment
    if (locationMatches(location, profile.preferred_locations)) {
      score += 5;
    }

    // 3. Experience Alignment
    if (experienceRangeYears) {
      const [minExp, maxExp] = experienceRangeYears;
      if (candExp >= minExp - 0.5 && candExp <= maxExp + 1.5) {
        score += 6;
      }
    } else {
      score += 3;
    }

    // 4. Candidate Skills Overlap
    for (const skill of profile.skills) {
      const sl = skill.toLowerCase();
      if (jdLower.includes(sl) || (sl.includes('excel') && jdLower.includes('excel')) || (sl.includes('sql') && jdLower.includes('sql'))) {
        score += 4;
        matchedSkills.push(skill);
      }
    }

    // 5. Technical Gap Checks (Role-contextual)
    // Only check developer-specific components (Power Fx, SPFx, PCF) if this is a Power Platform Developer / Architect role
    const isPowerDeveloperRole =
      titleLower.includes('developer') ||
      titleLower.includes('lead') ||
      titleLower.includes('architect') ||
      titleLower.includes('power platform consultant');

    if (isPowerDeveloperRole) {
      if (
        (jdLower.includes('power fx') || jdLower.includes('powerfx')) &&
        !candSkillsLower.some((s) => s.includes('power fx') || s.includes('powerfx'))
      ) {
        missingSkills.push('Power Fx');
      }
      if (
        (jdLower.includes('rest api') || jdLower.includes('rest apis')) &&
        !candSkillsLower.some((s) => s.includes('rest api') || s.includes('rest apis') || s.includes('rest'))
      ) {
        missingSkills.push('REST APIs');
      }
      if (jdLower.includes('spfx') && !candSkillsLower.some((s) => s.includes('spfx'))) {
        missingSkills.push('SPFx');
      }
      if (
        (jdLower.includes('pcf') || jdLower.includes('power apps component framework')) &&
        !candSkillsLower.some((s) => s.includes('pcf'))
      ) {
        missingSkills.push('PCF');
      }
    }

    if (matchedSkills.length >= 3) score += 6;
    if (missingSkills.length > 0) score = Math.max(50, score - missingSkills.length * 6);
    score = Math.min(95, score);

    const isViable = score >= 70 && missingSkills.length <= 1;

    return {
      is_viable: isViable,
      match_score: score,
      detected_experience: experienceFact,
      salary_range: salaryFact,
      location,
      skills_gap: missingSkills.length > 0 ? missingSkills.join(', ') : 'None',
      summary_reasoning: isDirectRoleMatch
        ? `Direct target role match for ${jobTitle}. Strong alignment with ${matchedSkills.slice(0, 3).join(', ')} in ${location}.`
        : `Candidate aligns with key requirements (${matchedSkills.slice(0, 3).join(', ')})${
            missingSkills.length > 0 ? `, but lacks specific tools (${missingSkills.join(', ')})` : ''
          }.`,
      strengths: [
        ...(isDirectRoleMatch ? [`Direct match with candidate target role: ${jobTitle}`] : []),
        ...matchedSkills.map((s) => `Demonstrated competency in ${s}`),
      ],
      weaknesses: missingSkills.map((m) => `Missing required skill: ${m}`),
      evaluated_at: new Date().toISOString(),
    };
  }
}
