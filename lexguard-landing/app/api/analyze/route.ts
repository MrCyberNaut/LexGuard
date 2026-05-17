import { NextRequest, NextResponse } from "next/server";

// Vercel free: 60s max. Pro: up to 300s. Gemini on large docs can take 20–30s.
export const maxDuration = 60;
import { callGemini } from "@/lib/gemini";
import { PARSER_SYSTEM_PROMPT, validateParserOutput } from "@/lib/agents/parser";
import { ANALYZER_SYSTEM_PROMPT, validateAnalyzerOutput } from "@/lib/agents/analyzer";
import { buildAdvocatePrompt, validateAdvocateOutput } from "@/lib/agents/advocate";
import { computeRiskScore, countBySeverity, sortBySeverity } from "@/lib/risk-score";
import type { AnalyzeRequest, AnalyzeResult, FinalClause } from "@/lib/types";

export async function POST(req: NextRequest): Promise<NextResponse<AnalyzeResult>> {
  try {
    const body = (await req.json()) as AnalyzeRequest;
    const { text, pdfBase64, userRole } = body;

    if (!text && !pdfBase64) {
      return NextResponse.json({ error: "Provide text or pdfBase64" }, { status: 400 });
    }

    // ── Agent 1: Parse ─────────────────────────────────────────
    const agent1Parts = pdfBase64
      ? [
          { inline_data: { mime_type: "application/pdf", data: pdfBase64 } },
          { text: "Extract all clauses from this legal document." },
        ]
      : [{ text: `Here is the contract text:\n\n${text}` }];

    const raw1 = await callGemini(PARSER_SYSTEM_PROMPT, agent1Parts);
    const parsed = validateParserOutput(raw1);

    // ── Agent 2: Risk Analysis ──────────────────────────────────
    const raw2 = await callGemini(
      ANALYZER_SYSTEM_PROMPT,
      [{ text: JSON.stringify(parsed) }]
    );
    const analyzed = validateAnalyzerOutput(raw2, parsed);

    // ── Agent 3: Advocate (HIGH clauses only) ───────────────────
    const highClauses = analyzed.filter((c) => c.severity === "HIGH");
    let advocated = highClauses; // default: carry through without advocate fields

    if (highClauses.length > 0) {
      const raw3 = await callGemini(
        buildAdvocatePrompt(userRole),
        [{ text: JSON.stringify(highClauses) }]
      );
      advocated = validateAdvocateOutput(raw3, highClauses);
    }

    // Merge advocate data back into full clause list
    const advocateById = new Map(advocated.map((a, i) => [highClauses[i].id, a]));
    const finalClauses: FinalClause[] = analyzed.map((c) =>
      c.severity === "HIGH" && advocateById.has(c.id)
        ? advocateById.get(c.id)!
        : c
    );

    const sorted = sortBySeverity(finalClauses);
    const riskScore = computeRiskScore(sorted);
    const counts = countBySeverity(sorted);

    return NextResponse.json({ clauses: sorted, riskScore, counts });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[analyze]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
