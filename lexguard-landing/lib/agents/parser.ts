import type { ParsedClause, ClauseType } from "@/lib/types";

export const PARSER_SYSTEM_PROMPT = `You are a contract clause extraction agent.
Your task is to break a legal contract into individual clauses.
You receive the full text of a legal document.

You output a JSON array where each item has:
  - id: sequential integer starting from 1
  - text: the original clause text verbatim
  - type: one of [IP_Transfer, NDA, Non_Compete, Termination, Liability, Arbitration, Data_Privacy, Payment, Auto_Renewal, Other]
  - section: the section heading if present, or null

Constraints:
  - Extract every clause. Aim for 10–25 items.
  - Keep clause text verbatim — do not paraphrase.
  - Group multi-sentence clauses that form one legal concept.
  - Output ONLY a valid JSON array. No markdown fences, no commentary.`;

export function validateParserOutput(raw: unknown): ParsedClause[] {
  if (!Array.isArray(raw)) throw new Error("Agent 1: expected JSON array");
  return raw.map((item, i) => {
    if (typeof item !== "object" || item === null) throw new Error(`Agent 1: item ${i} is not an object`);
    const c = item as Record<string, unknown>;
    if (typeof c.id !== "number") throw new Error(`Agent 1: item ${i} missing id`);
    if (typeof c.text !== "string" || c.text.trim() === "") throw new Error(`Agent 1: item ${i} missing text`);
    return {
      id: c.id as number,
      text: c.text as string,
      type: (c.type as ClauseType) || "Other",
      section: (c.section as string | null) ?? null,
    } satisfies ParsedClause;
  });
}
