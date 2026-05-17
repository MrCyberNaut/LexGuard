import "server-only";
import type { GroundingSource } from "@/lib/types";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = "gemini-2.5-flash";
const BASE_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

interface GeminiPart {
  text?: string;
  inline_data?: { mime_type: string; data: string };
}

function parseJsonFromText(rawText: string): unknown {
  try {
    return JSON.parse(rawText);
  } catch {
    const cleaned = rawText
      .replace(/^```(?:json)?\n?/i, "")
      .replace(/\n?```$/i, "")
      .trim();
    return JSON.parse(cleaned);
  }
}

export async function callGemini(
  systemPrompt: string,
  userParts: GeminiPart[]
): Promise<unknown> {
  if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY not set in environment");

  const body = {
    system_instruction: { parts: [{ text: systemPrompt }] },
    contents: [{ role: "user", parts: userParts }],
    generationConfig: { temperature: 0.1, responseMimeType: "application/json" },
  };

  const res = await fetch(`${BASE_URL}?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(90_000),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as Record<string, unknown>;
    const msg = (err?.error as Record<string, unknown>)?.message ?? `HTTP ${res.status}`;
    throw new Error(`Gemini API error: ${msg}`);
  }

  const data = await res.json() as Record<string, unknown>;
  const parts = (
    (data?.candidates as Array<Record<string, unknown>>)?.[0]
      ?.content as Record<string, unknown>
  )?.parts as Array<Record<string, unknown>>;

  return parseJsonFromText((parts?.[0]?.text as string) ?? "");
}

export interface GroundedResponse {
  json: unknown;
  sources: GroundingSource[];
}

// Gemini grounding with Google Search — returns JSON + cited sources.
// Note: responseMimeType cannot be "application/json" when grounding is active;
// the model returns plain text that we parse manually.
export async function callGeminiWithGrounding(
  systemPrompt: string,
  userParts: GeminiPart[]
): Promise<GroundedResponse> {
  if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY not set in environment");

  const body = {
    system_instruction: { parts: [{ text: systemPrompt }] },
    contents: [{ role: "user", parts: userParts }],
    tools: [{ google_search: {} }],
    generationConfig: { temperature: 0.1 },
  };

  const res = await fetch(`${BASE_URL}?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(90_000),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as Record<string, unknown>;
    const msg = (err?.error as Record<string, unknown>)?.message ?? `HTTP ${res.status}`;
    throw new Error(`Gemini API error (grounded): ${msg}`);
  }

  const data = await res.json() as Record<string, unknown>;
  const candidate = (data?.candidates as Array<Record<string, unknown>>)?.[0];

  const parts = (candidate?.content as Record<string, unknown>)
    ?.parts as Array<Record<string, unknown>>;
  const rawText = (parts?.[0]?.text as string) ?? "";

  // Extract grounding sources from groundingMetadata
  const meta = candidate?.groundingMetadata as Record<string, unknown> | undefined;
  const chunks = (meta?.groundingChunks as Array<Record<string, unknown>>) ?? [];
  const sources: GroundingSource[] = chunks
    .map((chunk) => {
      const web = chunk?.web as Record<string, unknown> | undefined;
      return { uri: (web?.uri as string) ?? "", title: (web?.title as string) ?? "" };
    })
    .filter((s) => s.uri);

  return { json: parseJsonFromText(rawText), sources };
}
