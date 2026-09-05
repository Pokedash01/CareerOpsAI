import { GoogleGenAI } from "@google/genai";

let geminiClient: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI {
  if (!geminiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("[CareerOps AI] Warning: GEMINI_API_KEY is not set in environment.");
    }
    geminiClient = new GoogleGenAI({
      apiKey: apiKey || "dummy-key-for-dev",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return geminiClient;
}

export function cleanJsonResponse(rawText: string): any {
  if (!rawText) return {};
  const cleaned = rawText
    .trim()
    .replace(/^```(?:json)?\n?/i, '')
    .replace(/\n?```$/i, '')
    .trim();
  try {
    return JSON.parse(cleaned);
  } catch (err) {
    // Attempt relaxed extraction of first JSON object/array
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      try {
        return JSON.parse(cleaned.substring(firstBrace, lastBrace + 1));
      } catch (innerErr) {
        console.error("Failed to parse extracted JSON block:", innerErr);
      }
    }
    console.error("Failed to parse JSON response:", err, "Raw text:", rawText);
    throw new Error("Unable to parse model JSON output");
  }
}
