import { NextRequest, NextResponse } from "next/server";

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Gemini API key not configured on server." },
      { status: 500 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { systemPrompt, userContent, pdfBase64 } = body as {
    systemPrompt: string;
    userContent?: string;
    pdfBase64?: string;
  };

  if (!systemPrompt) {
    return NextResponse.json({ error: "systemPrompt is required." }, { status: 400 });
  }

  // Build the Gemini request body
  const parts: unknown[] = [];
  if (pdfBase64) {
    parts.push({ inline_data: { mime_type: "application/pdf", data: pdfBase64 } });
    parts.push({ text: "Extract all clauses from this legal document." });
  } else {
    parts.push({ text: userContent ?? "" });
  }

  const geminiBody = {
    system_instruction: { parts: [{ text: systemPrompt }] },
    contents: [{ role: "user", parts }],
    generationConfig: {
      temperature: 0.1,
      responseMimeType: "application/json",
    },
  };

  const resp = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(geminiBody),
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    return NextResponse.json(
      { error: (err as { error?: { message?: string } })?.error?.message ?? `Gemini error ${resp.status}` },
      { status: resp.status }
    );
  }

  const data = await resp.json();
  const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

  // Parse JSON — strip markdown fences if model added them
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    const cleaned = text
      .replace(/^```(?:json)?\n?/i, "")
      .replace(/\n?```$/i, "")
      .trim();
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return NextResponse.json(
        { error: "Gemini returned non-JSON output.", raw: text },
        { status: 502 }
      );
    }
  }

  return NextResponse.json({ result: parsed });
}
