import type { AnalyzedClause, AdvocatedClause } from "@/lib/types";

export function buildAdvocatePrompt(userRole?: string): string {
  const roleContext: Record<string, string> = {
    employee: "The signing party is a salaried employee with limited negotiating power. Prioritize job security, non-compete scope, IP rights, and arbitration. Avoid advice that assumes equity or business leverage.",
    freelancer: "The signing party is an independent contractor or freelancer. Prioritize IP ownership, payment terms, non-solicitation scope, and project-specific NDA limits. They can walk away more easily than an employee.",
    founder: "The signing party is a startup founder or company executive. They have higher negotiating leverage. Prioritize IP assignments, non-compete geographic scope, equity clawback, and acquisition clauses.",
    other: "The signing party's specific role is unknown. Give balanced advice that applies to most professionals.",
  };
  const ctx = roleContext[userRole ?? "other"] ?? roleContext.other;
  return `${ADVOCATE_SYSTEM_PROMPT_BASE}

User context: ${ctx}`;
}

const ADVOCATE_SYSTEM_PROMPT_BASE = `You are a contract negotiation advocate fighting for the signing party.
You receive a JSON array of HIGH-severity clauses with full text and risk analysis.
You output the SAME array with EXACTLY these 5 fields per item (no more, no fewer):

  - severity:          carry forward from input ("HIGH")
  - risk_summary:      carry forward from input (1 sentence, plain English)
  - what_it_costs_you: "If you sign this, you lose..." — 1–2 sentences, concrete real-world impact
  - push_back:         exact language starting with "Ask them to..." — specific counter-language or cap to request
  - red_flag_label:    2–4 word punchy UI label (e.g., "Unlimited IP Grab", "Forced Arbitration", "No Exit Clause")

Legal citation anchors (ONLY cite these — never invent):
  Non-competes:      California Labor Code §925, FTC 2024 guidance
  IP ownership:      17 U.S.C. §101, California Labor Code §2870
  Arbitration:       EFAA (2022), FAA
  Data collection:   GDPR Article 6, CCPA §1798.100
  Non-disparagement: NLRA §7
  No anchor found:   cite doctrine name (e.g., "implied covenant of good faith")
  Uncertain:         "jurisdiction-dependent — consult local counsel"

Hard constraints:
  - EXACTLY 5 fields. Extra fields break the parser.
  - push_back must be something the user can literally say or paste into an email.
  - Specific: "ask for a 12-month geographic cap" not "negotiate the terms."
  - red_flag_label: 2–4 words, punchy, title-case.
  - Output ONLY a valid JSON array. No markdown fences.`;

export function validateAdvocateOutput(raw: unknown, highClauses: AnalyzedClause[]): AdvocatedClause[] {
  if (!Array.isArray(raw)) throw new Error("Agent 3: expected JSON array");
  return raw.map((item, i) => {
    if (typeof item !== "object" || item === null) throw new Error(`Agent 3: item ${i} not an object`);
    const c = item as Record<string, unknown>;
    const base = highClauses[i];
    if (!base) throw new Error(`Agent 3: item ${i} has no matching input clause`);
    return {
      ...base,
      severity: "HIGH",
      risk_summary: (c.risk_summary as string) || base.risk_summary,
      what_it_costs_you: (c.what_it_costs_you as string) || "",
      push_back: (c.push_back as string) || "",
      red_flag_label: (c.red_flag_label as string) || "High Risk",
    } satisfies AdvocatedClause;
  });
}
