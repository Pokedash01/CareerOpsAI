import { GoogleGenAI } from "@google/genai";
let geminiClient = null;
function isGeminiConfigured() {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  return Boolean(apiKey && apiKey !== "dummy-key-for-dev" && !apiKey.startsWith("dummy") && apiKey.length > 15);
}
function getGeminiClient() {
  if (!geminiClient) {
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey || apiKey === "dummy-key-for-dev") {
      console.warn("[CareerOps AI] Notice: GEMINI_API_KEY is not configured. Heuristic models will be utilized.");
    }
    geminiClient = new GoogleGenAI({
      apiKey: apiKey || "dummy-key-for-dev",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
  }
  return geminiClient;
}
function cleanJsonResponse(rawText) {
  if (!rawText) return {};
  const cleaned = rawText.trim().replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch (err) {
    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");
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
export {
  cleanJsonResponse,
  getGeminiClient,
  isGeminiConfigured
};
