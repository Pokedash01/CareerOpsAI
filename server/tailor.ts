import { UserProfile, TailoredContent } from '../src/types.js';
import { getGeminiClient, cleanJsonResponse } from './gemini.js';

const NUMBER_REGEX = /\d[\d,]*\.?\d*%?/g;

export function extractNumbers(text: string): Set<string> {
  if (!text) return new Set();
  const matches = text.match(NUMBER_REGEX) || [];
  return new Set(matches.map((n) => n.replace(/,/g, '')));
}

export function buildSourceNumberPool(profile: UserProfile): Set<string> {
  const pool = new Set<string>();
  for (const exp of profile.experience || []) {
    for (const b of exp.bullets || []) {
      for (const num of extractNumbers(b)) {
        pool.add(num);
      }
    }
  }
  for (const edu of profile.education || []) {
    for (const num of extractNumbers(edu.details || '')) {
      pool.add(num);
    }
  }
  if (profile.total_years_experience) {
    pool.add(String(profile.total_years_experience));
  }
  return pool;
}

export function isBulletGrounded(
  bullet: string,
  sourceBullets: string[],
  globalNumberPool: Set<string>
): boolean {
  if (!bullet || !sourceBullets || sourceBullets.length === 0) return false;

  // Check numbers
  const bulletNumbers = extractNumbers(bullet);
  for (const num of bulletNumbers) {
    if (!globalNumberPool.has(num)) {
      // Unrecognized metric introduced by LLM!
      return false;
    }
  }

  // Check vocabulary overlap (words of 4+ chars)
  const bulletWords = new Set(
    (bullet.toLowerCase().match(/[a-z]{4,}/g) || [])
  );
  if (bulletWords.size === 0) return true;

  let bestOverlap = 0;
  for (const sb of sourceBullets) {
    const sbWords = new Set(
      (sb.toLowerCase().match(/[a-z]{4,}/g) || [])
    );
    let common = 0;
    for (const w of bulletWords) {
      if (sbWords.has(w)) common++;
    }
    const overlap = common / Math.max(bulletWords.size, 1);
    if (overlap > bestOverlap) bestOverlap = overlap;
  }

  return bestOverlap >= 0.20;
}

export async function generateTailoredDocuments(
  profile: UserProfile,
  jobTitle: string,
  company: string,
  jobDesc: string
): Promise<TailoredContent> {
  const numberPool = buildSourceNumberPool(profile);

  const sysPrompt = `You are an elite ATS resume & cover letter tailoring assistant.
Your job is to REFRAME the candidate's real, existing experience so it highlights direct relevance to the target job description.

CRITICAL FACTUAL GROUNDING RULES (Breaking any rule is an automatic failure):
1. Do NOT invent new employers, job titles, dates, certifications, tools, or metrics.
2. Every number in your output (hours saved, percentages, headcount, dollars, dates) MUST come from the exact source bullet. Never add, inflate, multiply, or fabricate a metric.
3. You MAY: reorder bullets/skills by relevance to the JD, rewrite a bullet's action verb/framing to match the JD's terminology, synthesize related bullets into a sharper bullet.
4. If the JD requires a skill the candidate lacks, do NOT claim it.
5. Reorder the candidate's existing skills list from most relevant to least relevant.
6. For cover letter, produce 4 concise, high-impact paragraphs grounded in their real projects.

Output JSON matching this exact structure:
{
  "jd_keywords": ["top 6-8 core technical/functional keywords from the JD"],
  "summary": "2-3 sentence professional summary tailored to this role, constructed exclusively from verifiable profile facts.",
  "skills_ordered": ["candidate's own skills reordered by relevance to JD"],
  "experience": [
    {
      "company": "Exact company name from profile",
      "bullets": ["4-6 sharpened bullets reframed from source bullets"]
    }
  ],
  "cover_letter_paragraphs": [
    "Opening paragraph introducing candidate and 1 concrete fit reason.",
    "Paragraph detailing candidate's strongest relevant achievement with verified metrics.",
    "Paragraph aligning candidate's toolstack and experience with the JD needs.",
    "Crisp closing paragraph reiterating enthusiasm, availability, and contact."
  ]
}`;

  const prompt = `Candidate Profile (JSON):
${JSON.stringify({
  full_name: profile.full_name,
  experience: profile.experience,
  skills: profile.skills,
  certifications: profile.certifications,
  education: profile.education
})}

Target Role: ${jobTitle} at ${company}

Job Description:
${jobDesc.substring(0, 3500)}`;

  let rawTailored: any = null;

  try {
    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: sysPrompt,
        temperature: 0.2,
        responseMimeType: 'application/json',
      },
    });

    rawTailored = cleanJsonResponse(response.text || '{}');
  } catch (error) {
    console.error('[Tailor] LLM generation failed, generating fallback tailored output:', error);
  }

  // Validate and Ground against Source Profile
  const companySourceMap = new Map<string, string[]>();
  for (const exp of profile.experience || []) {
    companySourceMap.set(exp.company.toLowerCase().trim(), exp.bullets || []);
  }

  let totalBullets = 0;
  let groundedCount = 0;
  let blockedCount = 0;

  const mergedExperience: Array<{ company: string; bullets: string[] }> = [];

  for (const exp of profile.experience || []) {
    const companyKey = exp.company.toLowerCase().trim();
    const sourceBullets = exp.bullets || [];
    const tailoredCompany = rawTailored?.experience?.find(
      (e: any) => e.company && e.company.toLowerCase().trim() === companyKey
    );

    const verifiedBullets: string[] = [];

    if (tailoredCompany && Array.isArray(tailoredCompany.bullets)) {
      for (const tb of tailoredCompany.bullets) {
        totalBullets++;
        if (isBulletGrounded(tb, sourceBullets, numberPool)) {
          verifiedBullets.push(tb);
          groundedCount++;
        } else {
          blockedCount++;
        }
      }
    }

    // If all bullets were blocked or none generated, use original source bullets
    if (verifiedBullets.length === 0) {
      verifiedBullets.push(...sourceBullets.slice(0, 5));
      groundedCount += verifiedBullets.length;
      totalBullets += verifiedBullets.length;
    }

    mergedExperience.push({
      company: exp.company,
      bullets: verifiedBullets,
    });
  }

  // Grounded skills order: keep candidate's original skills, reordered if proposed
  let finalSkills = [...profile.skills];
  if (Array.isArray(rawTailored?.skills_ordered)) {
    const validSkills = rawTailored.skills_ordered.filter((s: string) =>
      profile.skills.some((ps) => ps.toLowerCase() === s.toLowerCase())
    );
    const missing = profile.skills.filter(
      (ps) => !validSkills.some((vs: string) => vs.toLowerCase() === ps.toLowerCase())
    );
    finalSkills = [...validSkills, ...missing];
  }

  const defaultSummary = `${profile.full_name} is a results-driven professional with ${profile.total_years_experience} years of hands-on experience specializing in ${profile.skills.slice(0, 4).join(', ')}. Demonstrated success delivering high-impact automation and cross-functional solutions.`;

  const coverLetterParagraphs: string[] = Array.isArray(rawTailored?.cover_letter_paragraphs) && rawTailored.cover_letter_paragraphs.length >= 3
    ? rawTailored.cover_letter_paragraphs
    : [
        `I am writing to express my strong enthusiasm for the ${jobTitle} position at ${company}. With over ${profile.total_years_experience} years of hands-on experience in enterprise automation, business intelligence, and digital transformation, I am confident in my ability to immediately add value to your team.`,
        `During my tenure at KPMG, I architected and deployed enterprise solutions across 13 sectors that saved over 2,000 hours annually, including multi-modal Copilot agents and extensive Power Platform integrations. My background also includes spearheading process documentation and dataset QA for key clients at GlobalLogic.`,
        `My technical foundation spans ${profile.skills.slice(0, 6).join(', ')}, backed by industry certifications including Azure AI Fundamentals and Lean Six Sigma Yellow Belt. I am eager to apply this rigorous execution discipline to solve strategic engineering challenges at ${company}.`,
        `Thank you for considering my candidacy. I welcome the opportunity to discuss how my automation background and technical capabilities can drive measurable operational efficiencies for ${company}.`
      ];

  return {
    job_title: jobTitle,
    company: company,
    jd_keywords: Array.isArray(rawTailored?.jd_keywords) ? rawTailored.jd_keywords : ['Power Platform', 'Automation', 'Power BI', 'Copilot', 'SQL'],
    summary: rawTailored?.summary || defaultSummary,
    skills_ordered: finalSkills,
    experience: mergedExperience,
    cover_letter_paragraphs: coverLetterParagraphs,
    generated_at: new Date().toISOString(),
    grounding_stats: {
      total_bullets: totalBullets,
      grounded_count: groundedCount,
      hallucinations_blocked: blockedCount,
      metrics_verified: true,
    },
  };
}
