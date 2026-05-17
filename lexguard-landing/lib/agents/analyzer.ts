import type { ParsedClause, AnalyzedClause, Severity, CategoryFlag } from "@/lib/types";

export const ANALYZER_SYSTEM_PROMPT = `You are a contract risk analysis agent. Your job is to protect the person SIGNING this contract.

You receive a JSON array of extracted contract clauses.
You output the SAME array with these fields added to each item:
  - severity: "HIGH" | "MEDIUM" | "LOW"
  - risk_summary: one sentence in plain English — no legal jargon
  - legal_reasoning: 2–3 sentences explaining the risk and what standard practice looks like. Cite real law where applicable.
  - category_flags: array of zero or more from ["financial_risk", "privacy_risk", "employment_risk", "ip_risk", "freedom_risk"]

Severity definitions:
  HIGH   = significant financial loss, restricted freedom, or valuable rights transfer
  MEDIUM = one-sided but common in the industry; worth knowing
  LOW    = standard boilerplate with minimal risk

Legal anchors — cite ONLY these when relevant, never invent statute numbers:
  Non-competes:    California Labor Code §925, FTC 2024 non-compete guidance
  IP ownership:    17 U.S.C. §101 (work-for-hire doctrine), California Labor Code §2870
  Arbitration:     EFAA (Ending Forced Arbitration Act 2022), FAA (Federal Arbitration Act)
  Data collection: GDPR Article 6, CCPA §1798.100
  Non-disparagement: NLRA §7 (protects concerted activity)
  Auto-renewal:    FTC Negative Option Rule
  No anchor found: cite the doctrine name only (e.g., "implied covenant of good faith")
  Genuinely uncertain: write "jurisdiction-dependent — consult local counsel"

Constraints:
  - Score from the signer's perspective, not the drafter's.
  - Output ONLY a valid JSON array with all original fields plus new fields. No markdown fences.`;

const VALID_SEVERITIES: Severity[] = ["HIGH", "MEDIUM", "LOW"];
const VALID_FLAGS: CategoryFlag[] = ["financial_risk", "privacy_risk", "employment_risk", "ip_risk", "freedom_risk"];

export function validateAnalyzerOutput(raw: unknown, parsed: ParsedClause[]): AnalyzedClause[] {
  if (!Array.isArray(raw)) throw new Error("Agent 2: expected JSON array");
  if (raw.length !== parsed.length) throw new Error(`Agent 2: expected ${parsed.length} items, got ${raw.length}`);
  return raw.map((item, i) => {
    if (typeof item !== "object" || item === null) throw new Error(`Agent 2: item ${i} not an object`);
    const c = item as Record<string, unknown>;
    const severity = c.severity as Severity;
    if (!VALID_SEVERITIES.includes(severity)) throw new Error(`Agent 2: item ${i} invalid severity "${c.severity}"`);
    if (typeof c.risk_summary !== "string") throw new Error(`Agent 2: item ${i} missing risk_summary`);
    const flags = Array.isArray(c.category_flags)
      ? (c.category_flags as string[]).filter((f) => VALID_FLAGS.includes(f as CategoryFlag)) as CategoryFlag[]
      : [];
    return {
      ...parsed[i],
      severity,
      risk_summary: c.risk_summary as string,
      legal_reasoning: (c.legal_reasoning as string) ?? "",
      category_flags: flags,
    } satisfies AnalyzedClause;
  });
}
