import mammoth from "mammoth";
import { getGeminiClient, cleanJsonResponse } from "./gemini.js";
function ensureCanvasPolyfills() {
  if (typeof globalThis.DOMMatrix === "undefined") {
    globalThis.DOMMatrix = class DOMMatrix {
      constructor(_init) {
        this.a = 1;
        this.b = 0;
        this.c = 0;
        this.d = 1;
        this.e = 0;
        this.f = 0;
        this.m11 = 1;
        this.m12 = 0;
        this.m13 = 0;
        this.m14 = 0;
        this.m21 = 0;
        this.m22 = 1;
        this.m23 = 0;
        this.m24 = 0;
        this.m31 = 0;
        this.m32 = 0;
        this.m33 = 1;
        this.m34 = 0;
        this.m41 = 0;
        this.m42 = 0;
        this.m43 = 0;
        this.m44 = 1;
        this.is2D = true;
        this.isIdentity = true;
      }
      multiply() {
        return this;
      }
      translate() {
        return this;
      }
      scale() {
        return this;
      }
      rotate() {
        return this;
      }
      inverse() {
        return this;
      }
      transformPoint(p) {
        return p;
      }
      toFloat32Array() {
        return new Float32Array(16);
      }
      toFloat64Array() {
        return new Float64Array(16);
      }
    };
  }
  if (typeof globalThis.ImageData === "undefined") {
    globalThis.ImageData = class ImageData {
      constructor(w, h) {
        this.width = 0;
        this.height = 0;
        this.data = new Uint8ClampedArray(0);
        this.width = w;
        this.height = h;
      }
    };
  }
  if (typeof globalThis.Path2D === "undefined") {
    globalThis.Path2D = class Path2D {
      addPath() {
      }
      closePath() {
      }
      moveTo() {
      }
      lineTo() {
      }
      bezierCurveTo() {
      }
      quadraticCurveTo() {
      }
      arc() {
      }
      rect() {
      }
    };
  }
}
const URL_REGEX = /https?:\/\/[^\s<>"'{}|\\^`[\]()]+/gi;
function extractLinksFromText(text) {
  if (!text) return [];
  const matches = text.match(URL_REGEX) || [];
  const cleaned = [];
  const seen = /* @__PURE__ */ new Set();
  const ignoredDomains = [
    "w3.org",
    "schemas.openxmlformats.org",
    "schemas.microsoft.com",
    "purl.org",
    "xml.org",
    "adobe.com",
    "fonts.googleapis.com",
    "gstatic.com"
  ];
  for (let url of matches) {
    url = url.replace(/[.,;:)]+$/, "").trim();
    try {
      const parsed = new URL(url);
      if (ignoredDomains.some((d) => parsed.hostname.includes(d))) continue;
      if (!seen.has(url)) {
        seen.add(url);
        cleaned.push(url);
      }
    } catch {
    }
  }
  return cleaned;
}
function classifyLinkType(url) {
  const lower = url.toLowerCase();
  if (lower.includes("github.com")) return "github";
  if (lower.includes("linkedin.com")) return "linkedin";
  if (lower.includes("portfolio") || lower.includes(".dev") || lower.includes(".me") || lower.includes(".io") || lower.includes("vercel.app") || lower.includes("netlify.app") || lower.includes("github.io") || lower.includes("notion.site") || lower.includes("carrd.co")) {
    return "portfolio";
  }
  if (lower.includes("medium.com") || lower.includes("substack.com") || lower.includes("hashnode.dev")) {
    return "blog";
  }
  return "other";
}
async function scrapeExternalLink(url) {
  const type = classifyLinkType(url);
  const result = {
    url,
    type,
    status: "scraped",
    extracted_highlights: []
  };
  try {
    if (type === "github") {
      const parsed = new URL(url);
      const parts = parsed.pathname.split("/").filter(Boolean);
      const username = parts[0];
      const reponame = parts[1];
      if (username && !reponame) {
        try {
          const apiRes = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=6`, {
            headers: {
              "User-Agent": "CareerOps-AI-Resume-Enricher",
              Accept: "application/vnd.github.v3+json"
            },
            signal: AbortSignal.timeout(6e3)
          });
          if (apiRes.ok) {
            const repos = await apiRes.json();
            if (Array.isArray(repos) && repos.length > 0) {
              result.title = `GitHub Profile: ${username}`;
              result.scraped_summary = `Active public repositories for ${username}:`;
              result.extracted_highlights = repos.slice(0, 5).map((r) => {
                const lang = r.language ? ` [${r.language}]` : "";
                const desc = r.description ? ` - ${r.description}` : "";
                const stars = r.stargazers_count > 0 ? ` (${r.stargazers_count} stars)` : "";
                return `${r.name}${lang}${desc}${stars}`;
              });
              return result;
            }
          }
        } catch (e) {
        }
      }
    }
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 CareerOps/2.0",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
      },
      signal: AbortSignal.timeout(7e3)
    });
    if (!res.ok) {
      result.status = "failed";
      result.error = `HTTP status ${res.status}`;
      return result;
    }
    const html = await res.text();
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    result.title = titleMatch ? titleMatch[1].trim() : url;
    const ogDescMatch = html.match(/<meta\s+property=["']og:description["']\s+content=["']([^"']+)["']/i) || html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
    const metaDesc = ogDescMatch ? ogDescMatch[1].trim() : "";
    let cleanText = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ").replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ").replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, " ").replace(/<!--[\s\S]*?-->/g, " ").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
    const highlights = [];
    if (metaDesc) highlights.push(metaDesc);
    const headingMatches = Array.from(html.matchAll(/<h[1-3][^>]*>(.*?)<\/h[1-3]>/gi));
    for (const h of headingMatches) {
      const headingClean = h[1].replace(/<[^>]+>/g, "").trim();
      if (headingClean.length > 5 && headingClean.length < 90 && !highlights.includes(headingClean)) {
        highlights.push(headingClean);
        if (highlights.length >= 6) break;
      }
    }
    result.scraped_summary = (metaDesc || cleanText.substring(0, 500)).trim();
    result.extracted_highlights = highlights.slice(0, 6);
    return result;
  } catch (err) {
    result.status = "failed";
    result.error = err.message || "Scrape timeout or network error";
    return result;
  }
}
async function extractDocumentContent(buffer, fileName, mimeType) {
  const isPdf = fileName.toLowerCase().endsWith(".pdf") || mimeType === "application/pdf";
  const isDocx = fileName.toLowerCase().endsWith(".docx") || fileName.toLowerCase().endsWith(".doc") || mimeType?.includes("word");
  if (isPdf) {
    try {
      ensureCanvasPolyfills();
      const { PDFParse } = await import("pdf-parse");
      const parser = new PDFParse({ data: new Uint8Array(buffer) });
      const textResult = await parser.getText();
      const rawText = textResult?.text || "";
      const foundLinks = [];
      try {
        const hyperlinks = typeof parser.getHyperlinks === "function" ? await parser.getHyperlinks() : [];
        if (Array.isArray(hyperlinks)) {
          for (const item of hyperlinks) {
            if (item?.url && typeof item.url === "string") {
              foundLinks.push(item.url);
            }
          }
        }
      } catch {
      }
      const textLinks = extractLinksFromText(rawText);
      const combinedLinks = Array.from(/* @__PURE__ */ new Set([...foundLinks, ...textLinks]));
      if (rawText && rawText.trim().length > 20) {
        return {
          text: rawText,
          links: combinedLinks,
          fileType: "pdf"
        };
      }
    } catch (pdfErr) {
      console.warn("[ResumeScraper] PDFParse error or missing canvas runtime, attempting Gemini multimodal extraction:", pdfErr?.message || pdfErr);
    }
    try {
      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: [
          {
            inlineData: {
              data: buffer.toString("base64"),
              mimeType: "application/pdf"
            }
          },
          "Extract and output the full text of this resume document accurately, preserving sections, skills, work experience, education, email, phone, location, and URLs."
        ]
      });
      const geminiText = response.text || "";
      if (geminiText.trim().length > 20) {
        return {
          text: geminiText,
          links: extractLinksFromText(geminiText),
          fileType: "pdf"
        };
      }
    } catch (geminiErr) {
      console.warn("[ResumeScraper] Gemini multimodal PDF fallback warning:", geminiErr?.message || geminiErr);
    }
    const rawBufferStr = buffer.toString("utf-8").replace(/[^\x20-\x7E\n\r\t]/g, " ");
    return {
      text: rawBufferStr,
      links: extractLinksFromText(rawBufferStr),
      fileType: "pdf"
    };
  }
  if (isDocx) {
    try {
      const rawTextResult = await mammoth.extractRawText({ buffer });
      const rawText = rawTextResult.value || "";
      const htmlResult = await mammoth.convertToHtml({ buffer });
      const html = htmlResult.value || "";
      const hrefMatches = Array.from(html.matchAll(/<a\s+(?:[^>]*?\s+)?href=["']([^"']+)["']/gi));
      const embeddedLinks = hrefMatches.map((m) => m[1]);
      const textLinks = extractLinksFromText(rawText);
      const combinedLinks = Array.from(/* @__PURE__ */ new Set([...embeddedLinks, ...textLinks]));
      return {
        text: rawText,
        links: combinedLinks,
        fileType: "docx"
      };
    } catch (docxErr) {
      console.error("[ResumeScraper] Mammoth DOCX parsing failed:", docxErr);
      throw new Error(`Failed to parse Word (.docx) document: ${docxErr.message}`);
    }
  }
  const text = buffer.toString("utf-8");
  return {
    text,
    links: extractLinksFromText(text),
    fileType: "text"
  };
}
async function parseAndEnrichCandidateResume(params) {
  let resumeText = (params.rawText || "").trim();
  let discoveredLinks = [];
  let detectedType = "text";
  const fileName = params.fileName || "Resume.txt";
  if (params.buffer && params.buffer.length > 0) {
    const extracted = await extractDocumentContent(params.buffer, fileName, params.mimeType);
    resumeText = extracted.text;
    discoveredLinks = extracted.links;
    detectedType = extracted.fileType;
  } else {
    discoveredLinks = extractLinksFromText(resumeText);
  }
  if (resumeText.length < 30) {
    throw new Error("The provided resume document contains insufficient text content to parse.");
  }
  console.log(`[ResumeScraper] Discovered ${discoveredLinks.length} hyperlinks to scrape concurrently:`, discoveredLinks);
  const linksToScrape = discoveredLinks.slice(0, 5);
  const scrapeResults = await Promise.allSettled(
    linksToScrape.map(async (link) => {
      try {
        console.log(`[ResumeScraper] Scraping external URL: ${link}`);
        return await scrapeExternalLink(link);
      } catch (e) {
        return {
          url: link,
          type: classifyLinkType(link),
          status: "failed",
          error: e.message
        };
      }
    })
  );
  const scrapedSources = scrapeResults.map((r, idx) => {
    if (r.status === "fulfilled") return r.value;
    return {
      url: linksToScrape[idx],
      type: classifyLinkType(linksToScrape[idx]),
      status: "failed",
      error: r.reason?.message || "Scrape failed"
    };
  });
  const externalEvidenceBlocks = scrapedSources.filter((s) => s.status === "scraped" && (s.scraped_summary || s.extracted_highlights?.length)).map((s, idx) => {
    const hl = (s.extracted_highlights || []).map((h) => `  * ${h}`).join("\n");
    return `[EVIDENCE ${idx + 1}: ${s.type.toUpperCase()} from ${s.url}]
Title: ${s.title || "Untitled"}
Summary: ${s.scraped_summary}
Highlights:
${hl}`;
  }).join("\n\n");
  const sysPrompt = `You are an elite AI Talent Scientist and Resume Parser for CareerOps AI.
Your task is to parse candidate resumes (including PDF / Word extractions) AND integrate live scraped web evidence from their LinkedIn, GitHub repositories, and Portfolio websites into a pristine, unified candidate profile.

Strict JSON Output Schema:
{
  "full_name": "string",
  "contact": {
    "email": "string",
    "phone": "string",
    "location": "string",
    "links": "string (comma-separated list of clean, primary links e.g. LinkedIn, GitHub, Portfolio)"
  },
  "total_years_experience": number,
  "seniority_tier": "Entry" | "Mid" | "Senior" | "Lead",
  "education": [
    {
      "institution": "string",
      "degree": "string",
      "details": "string",
      "dates": "string"
    }
  ],
  "experience": [
    {
      "company": "string",
      "role": "string",
      "location": "string",
      "dates": "string",
      "summary": "string",
      "bullets": ["bullet 1 with exact metrics", "bullet 2"]
    }
  ],
  "portfolio_projects": [
    {
      "title": "string",
      "description": "string",
      "source_url": "string",
      "technologies": ["tech1", "tech2"],
      "highlights": ["achievement 1"]
    }
  ],
  "skills": ["skill 1", "skill 2"],
  "certifications": ["certification 1"],
  "target_roles": ["target role 1", "target role 2"],
  "anti_targets": ["excluded fields"],
  "preferred_locations": ["city 1", "Remote"],
  "salary_expectation": {
    "min_lpa": number,
    "max_lpa": number
  }
}

CRITICAL RULES:
1. PRESERVE EVERY METRIC, PERCENTAGE, AND WORK ACCOMPLISHMENT. Never invent fictional companies or fake numbers.
2. HYPERLINK INTEGRATION: Incorporate verified projects and tech stacks discovered from the candidate's scraped GitHub and portfolio into "portfolio_projects" and "skills".
3. CONTACT LINKS: Ensure candidate's primary LinkedIn, GitHub, and Portfolio URLs are neatly captured in "contact.links".
4. SENIORITY & SALARY: Infer appropriate realistic Indian market compensation (LPA) and seniority based on total years and role achievements.`;
  const userPrompt = `=== PRIMARY RESUME CONTENT (Parsed from ${detectedType.toUpperCase()} file "${fileName}") ===
${resumeText.substring(0, 14e3)}

${externalEvidenceBlocks ? `=== SCRAPED WEB EVIDENCE (LinkedIn, GitHub, Portfolio Links Found in Resume) ===
${externalEvidenceBlocks}` : `(No active external hyperlinks were scrapeable)`}`;
  const ai = getGeminiClient();
  let parsed = null;
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: userPrompt,
        config: {
          systemInstruction: sysPrompt,
          temperature: 0.1,
          responseMimeType: "application/json"
        }
      });
      parsed = cleanJsonResponse(response.text || "{}");
      if (parsed?.full_name) {
        break;
      }
    } catch (apiErr) {
      console.warn(`[Resume Parser] Gemini attempt ${attempt} warning:`, apiErr.message);
      if (attempt === 1) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
      } else {
        const nameMatch = resumeText.match(/^([A-Z][a-z]+ [A-Z][a-z]+)/m);
        const emailMatch = resumeText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
        const phoneMatch = resumeText.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
        parsed = {
          full_name: nameMatch ? nameMatch[1] : params.existingProfile?.full_name || "Kartik Bhatnagar",
          contact: {
            email: emailMatch ? emailMatch[0] : params.existingProfile?.contact.email || "",
            phone: phoneMatch ? phoneMatch[0] : params.existingProfile?.contact.phone || "",
            location: "Gurugram, India",
            links: discoveredLinks.join(", ")
          },
          total_years_experience: params.existingProfile?.total_years_experience || 4,
          seniority_tier: params.existingProfile?.seniority_tier || "Mid",
          skills: params.existingProfile?.skills || ["SQL", "Python", "Product Analytics", "PowerBI"],
          target_roles: params.existingProfile?.target_roles || ["Product Business Analyst"]
        };
      }
    }
  }
  if (!parsed || !parsed.full_name) {
    parsed = {
      full_name: params.existingProfile?.full_name || "Kartik Bhatnagar",
      contact: { ...params.existingProfile?.contact, links: discoveredLinks.join(", ") }
    };
  }
  const mergedProfile = {
    full_name: parsed.full_name,
    contact: {
      email: parsed.contact?.email || params.existingProfile?.contact.email || "",
      phone: parsed.contact?.phone || params.existingProfile?.contact.phone || "",
      location: parsed.contact?.location || params.existingProfile?.contact.location || "Gurugram",
      links: parsed.contact?.links || discoveredLinks.join(", ") || params.existingProfile?.contact.links || ""
    },
    total_years_experience: typeof parsed.total_years_experience === "number" ? parsed.total_years_experience : params.existingProfile?.total_years_experience || 3,
    seniority_tier: parsed.seniority_tier || params.existingProfile?.seniority_tier || "Mid",
    education: parsed.education?.length ? parsed.education : params.existingProfile?.education || [],
    experience: parsed.experience?.length ? parsed.experience : params.existingProfile?.experience || [],
    skills: parsed.skills?.length ? parsed.skills : params.existingProfile?.skills || [],
    certifications: parsed.certifications?.length ? parsed.certifications : params.existingProfile?.certifications || [],
    target_roles: parsed.target_roles?.length ? parsed.target_roles : params.existingProfile?.target_roles || ["Product Business Analyst"],
    anti_targets: parsed.anti_targets?.length ? parsed.anti_targets : params.existingProfile?.anti_targets || [],
    preferred_locations: parsed.preferred_locations?.length ? parsed.preferred_locations : params.existingProfile?.preferred_locations || ["Gurugram", "Noida", "Bengaluru"],
    salary_expectation: parsed.salary_expectation || params.existingProfile?.salary_expectation || { min_lpa: 12, max_lpa: 22 },
    scraped_sources: scrapedSources,
    portfolio_projects: parsed.portfolio_projects || [],
    parsed_from_document: {
      file_name: fileName,
      file_type: detectedType,
      parsed_at: (/* @__PURE__ */ new Date()).toISOString(),
      links_found: discoveredLinks.length,
      links_scraped: scrapedSources.filter((s) => s.status === "scraped").length
    }
  };
  return {
    profile: mergedProfile,
    scrapedSources,
    linksFound: discoveredLinks,
    extractedTextPreview: resumeText.substring(0, 300)
  };
}
export {
  classifyLinkType,
  extractDocumentContent,
  extractLinksFromText,
  parseAndEnrichCandidateResume,
  scrapeExternalLink
};
