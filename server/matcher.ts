import { UserProfile, MatchResult } from '../src/types.js';
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
  if (jobLocLower.includes('remote') || jobLocLower.includes('work from home')) return true;

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

export function experienceOk(candExp: number, expRange?: [number, number], tolerance: number = 1.0): { ok: boolean; reason?: string } {
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
  expectation?: { min_lpa: number; max_lpa: number },
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
  // Guaranteed Experience Resolution: Never missing or undefined
  const expRes = resolveExperienceYears(jobDesc, jobTitle);
  const effectiveExpRange: [number, number] = experienceRangeYears || expRes.range;

  // Guaranteed Salary Resolution: Stated in JD or AmbitionBox/Glassdoor regional benchmark
  let effectiveSalaryRange: [number, number] | undefined = salaryRangeLpa;
  let salaryFact = '';
  if (!effectiveSalaryRange) {
    const bench = estimateSalaryLpa(jobTitle, company, location, effectiveExpRange);
    effectiveSalaryRange = [bench.minLpa, bench.maxLpa];
    salaryFact = `₹${bench.minLpa} - ₹${bench.maxLpa} LPA (AmbitionBox & Glassdoor Market Data)`;
  } else {
    salaryFact = `₹${effectiveSalaryRange[0]} - ₹${effectiveSalaryRange[1]} LPA`;
  }

  const experienceFact = experienceRangeYears
    ? `${experienceRangeYears[0]}-${experienceRangeYears[1]} Years`
    : `${expRes.range[0]}-${expRes.range[1]} Years (Inferred from Seniority)`;

  // In-memory cache key: returns immediately with 0 credit consumption if evaluated previously
  const cacheKey = crypto
    .createHash('sha256')
    .update(`${profile.full_name}_${jobTitle}_${company}_${location}_${jobDesc.substring(0, 300)}_${effectiveExpRange.join('-')}`)
    .digest('hex');

  if (FIT_CACHE.has(cacheKey)) {
    return { ...FIT_CACHE.get(cacheKey)!, evaluated_at: new Date().toISOString() };
  }

  const candExp = Number(profile.total_years_experience || 3.0);
  const candSkills = (profile.skills || []).map((s) => s.toLowerCase());
  const preferredLocations = profile.preferred_locations || [];
  const antiTargets = (profile.anti_targets || []).map((t) => t.toLowerCase());
  const titleLower = jobTitle.toLowerCase();

  // Deterministic checks (Zero LLM credit consumption)
  for (const anti of antiTargets) {
    if (titleLower.includes(anti)) {
      const res: MatchResult = {
        is_viable: false,
        match_score: 10,
        detected_experience: experienceFact,
        salary_range: salaryFact,
        location,
        skills_gap: `Anti-target role: ${anti}`,
        rejection_reason: `Role matches candidate anti-target blacklist: '${anti}'.`,
        evaluated_at: new Date().toISOString(),
      };
      FIT_CACHE.set(cacheKey, res);
      return res;
    }
  }

  if (titleLower.includes('java') && !candSkills.some((s) => s.includes('java') && !s.includes('script'))) {
    const res: MatchResult = {
      is_viable: false,
      match_score: 18,
      detected_experience: experienceFact,
      salary_range: salaryFact,
      location,
      skills_gap: 'Core Java / Spring Boot',
      rejection_reason: 'Role explicitly requires dedicated Java backend development stack which is absent from profile.',
      evaluated_at: new Date().toISOString(),
    };
    FIT_CACHE.set(cacheKey, res);
    return res;
  }

  if (titleLower.includes('embedded') || titleLower.includes('firmware') || titleLower.includes('verilog')) {
    const res: MatchResult = {
      is_viable: false,
      match_score: 15,
      detected_experience: experienceFact,
      salary_range: salaryFact,
      location,
      skills_gap: 'Hardware / Embedded Systems',
      rejection_reason: 'Domain mismatch: Hardware/Embedded systems engineering.',
      evaluated_at: new Date().toISOString(),
    };
    FIT_CACHE.set(cacheKey, res);
    return res;
  }

  if (!locationMatches(location, preferredLocations)) {
    const res: MatchResult = {
      is_viable: false,
      match_score: 25,
      detected_experience: experienceFact,
      salary_range: salaryFact,
      location,
      skills_gap: 'Location mismatch',
      rejection_reason: `Location '${location}' does not match candidate preferred locations: ${preferredLocations.join(', ')}`,
      evaluated_at: new Date().toISOString(),
    };
    FIT_CACHE.set(cacheKey, res);
    return res;
  }

  const expCheck = experienceOk(candExp, effectiveExpRange);
  if (!expCheck.ok) {
    return {
      is_viable: false,
      match_score: 30,
      detected_experience: experienceFact,
      salary_range: salaryFact,
      location,
      skills_gap: 'Seniority gap',
      rejection_reason: expCheck.reason,
      evaluated_at: new Date().toISOString(),
    };
  }

  const salCheck = salaryOk(effectiveSalaryRange, profile.salary_expectation);
  if (!salCheck.ok) {
    return {
      is_viable: false,
      match_score: 35,
      detected_experience: experienceFact,
      salary_range: salaryFact,
      location,
      skills_gap: 'Compensation expectation gap',
      rejection_reason: salCheck.reason,
      evaluated_at: new Date().toISOString(),
    };
  }

  // LLM Substantive Evaluation
  const systemPrompt = `You are a strict technical recruiter evaluating candidate fit for a job description.
Candidate Profile:
- Full Name: ${profile.full_name}
- Total Years Experience: ${candExp}
- Current Seniority: ${profile.seniority_tier}
- Key Skills: ${profile.skills.join(', ')}
- Certifications: ${profile.certifications.join(', ')}

Ground Truth facts extracted and benchmarked:
- Location: ${location}
- Salary benchmark/stated: ${salaryFact}
- Experience benchmark/stated: ${experienceFact}

STRICT EVALUATION CRITERIA:
1. High viability (score >= 75) is reserved for candidates who genuinely possess 75%+ of required core technologies and domain focus.
2. If the role requires a primary tech stack the candidate lacks, score MUST be < 60 and is_viable = false.
3. For detected_experience: return "${experienceFact}".
4. For salary_range: return "${salaryFact}".
5. Highlight 2-4 concrete strengths and 0-3 weaknesses/skills gaps.
6. Return JSON matching this exact schema:
{
  "is_viable": boolean,
  "match_score": number (0 to 100 integer),
  "detected_experience": string,
  "salary_range": string,
  "location": string,
  "skills_gap": string ("None" or specific missing competencies),
  "summary_reasoning": string,
  "strengths": string[],
  "weaknesses": string[]
}`;

  const prompt = `Target Role: ${jobTitle} at ${company}
Job Description:
${jobDesc.substring(0, 1500)}

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
    const matchRes: MatchResult = {
      is_viable: Boolean(result.is_viable),
      match_score: typeof result.match_score === 'number' ? Math.min(100, Math.max(0, result.match_score)) : 70,
      detected_experience: result.detected_experience || experienceFact,
      salary_range: result.salary_range || salaryFact,
      location: result.location || location,
      skills_gap: result.skills_gap || 'None',
      summary_reasoning: result.summary_reasoning || `Evaluated fit for ${jobTitle} at ${company}`,
      strengths: Array.isArray(result.strengths) ? result.strengths : [],
      weaknesses: Array.isArray(result.weaknesses) ? result.weaknesses : [],
      evaluated_at: new Date().toISOString(),
    };
    FIT_CACHE.set(cacheKey, matchRes);
    return matchRes;
  } catch (error) {
    console.error('[Matcher] Gemini evaluation failed, computing heuristic score:', error);
    // Heuristic fallback if Gemini API is temporarily unavailable
    const jdLower = jobDesc.toLowerCase();
    let score = 65;
    const matchedSkills: string[] = [];
    const missingSkills: string[] = [];

    for (const skill of profile.skills) {
      if (jdLower.includes(skill.toLowerCase())) {
        score += 4;
        matchedSkills.push(skill);
      }
    }

    if (matchedSkills.length > 3) score += 10;
    score = Math.min(95, score);

    return {
      is_viable: score >= 75,
      match_score: score,
      detected_experience: experienceFact,
      salary_range: salaryFact,
      location,
      skills_gap: missingSkills.length > 0 ? missingSkills.join(', ') : 'None',
      summary_reasoning: `Candidate aligns with key requirements including ${matchedSkills.slice(0, 4).join(', ')}.`,
      strengths: matchedSkills.map((s) => `Demonstrated competency in ${s}`),
      weaknesses: [],
      evaluated_at: new Date().toISOString(),
    };
  }
}
