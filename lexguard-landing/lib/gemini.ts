import "server-only";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = "gemini-2.5-flash";
const BASE_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

interface GeminiPart {
  text?: string;
  inline_data?: { mime_type: string; data: string };
}

export async function callGemini(
  systemPrompt: string,
  userParts: GeminiPart[]
): Promise<unknown> {
  if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY not set in environment");

  const body = {
    system_instruction: { parts: [{ text: systemPrompt }] },
    contents: [{ role: "user", parts: userParts }],
    generationConfig: {
      temperature: 0.1,
      responseMimeType: "application/json",
    },
  };

  const res = await fetch(`${BASE_URL}?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    // 90s timeout — Gemini 2.5 Flash is fast but large contracts can take time
    signal: AbortSignal.timeout(90_000),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as Record<string, unknown>;
    const msg = (err?.error as Record<string, unknown>)?.message ?? `HTTP ${res.status}`;
    throw new Error(`Gemini API error: ${msg}`);
  }

  const data = await res.json() as Record<string, unknown>;
  const text = (
    (data?.candidates as Array<Record<string, unknown>>)?.[0]
      ?.content as Record<string, unknown>
  )?.parts as Array<Record<string, unknown>>;

  const rawText = (text?.[0]?.text as string) ?? "";

  try {
    return JSON.parse(rawText);
  } catch {
    // Strip markdown fences if the model added them despite responseMimeType
    const cleaned = rawText
      .replace(/^```(?:json)?\n?/i, "")
      .replace(/\n?```$/i, "")
      .trim();
    return JSON.parse(cleaned);
  }
}
