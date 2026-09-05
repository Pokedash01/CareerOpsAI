const SALARY_PATTERNS = [
  /(?:₹|INR|Rs\.?)?\s*(\d{1,3}(?:\.\d+)?)\s*(?:-|to)\s*(?:₹|INR|Rs\.?)?\s*(\d{1,3}(?:\.\d+)?)\s*L(?:PA|akhs?)\b/i,
  /(?:₹|INR|Rs\.?)?\s*(\d{1,3}(?:\.\d+)?)\s*L(?:PA|akhs?)\b/i,
  /\$\s*([\d,]{4,7})\s*(?:-|to)\s*\$?\s*([\d,]{4,7})/i,
];

const EXPERIENCE_PATTERNS = [
  /(\d{1,2})\s*(?:-|to)\s*(\d{1,2})\s*\+?\s*years?\s*(?:of)?\s*(?:relevant\s*)?experience/i,
  /(?:minimum|min\.?|at least)?\s*(\d{1,2})\s*\+?\s*years?\s*(?:of)?\s*(?:relevant\s*)?experience/i,
];

export function extractSalaryLpa(text: string): [number, number] | undefined {
  if (!text) return undefined;
  const m1 = SALARY_PATTERNS[0].exec(text);
  if (m1) {
    const lo = parseFloat(m1[1]);
    const hi = parseFloat(m1[2]);
    return [Math.min(lo, hi), Math.max(lo, hi)];
  }
  const m2 = SALARY_PATTERNS[1].exec(text);
  if (m2) {
    const v = parseFloat(m2[1]);
    return [v, v];
  }
  return undefined;
}

export function extractExperienceYears(text: string): [number, number] | undefined {
  if (!text) return undefined;
  const m1 = EXPERIENCE_PATTERNS[0].exec(text);
  if (m1) {
    const lo = parseFloat(m1[1]);
    const hi = parseFloat(m1[2]);
    return [Math.min(lo, hi), Math.max(lo, hi)];
  }
  const m2 = EXPERIENCE_PATTERNS[1].exec(text);
  if (m2) {
    const v = parseFloat(m2[1]);
    return [v, v];
  }
  return undefined;
}
