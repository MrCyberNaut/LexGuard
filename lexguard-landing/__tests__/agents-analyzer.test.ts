import { validateAnalyzerOutput } from "@/lib/agents/analyzer";
import type { ParsedClause } from "@/lib/types";

const makeClause = (id: number): ParsedClause => ({
  id,
  text: `Clause ${id} text.`,
  type: "Other",
  section: null,
});

const validAnalyzed = {
  severity: "HIGH",
  risk_summary: "This clause transfers all your IP to the company.",
  legal_reasoning: "Under 17 U.S.C. §101 work-for-hire doctrine...",
  category_flags: ["ip_risk"],
};

describe("validateAnalyzerOutput", () => {
  it("throws if input is not an array", () => {
    expect(() => validateAnalyzerOutput({ items: [] }, [])).toThrow("Agent 2: expected JSON array");
  });

  it("throws if length does not match parsed input", () => {
    const parsed = [makeClause(1), makeClause(2)];
    expect(() => validateAnalyzerOutput([validAnalyzed], parsed)).toThrow("Agent 2: expected 2 items, got 1");
  });

  it("throws if an item is not an object", () => {
    const parsed = [makeClause(1)];
    expect(() => validateAnalyzerOutput(["not an object"], parsed)).toThrow();
  });

  it("throws on invalid severity", () => {
    const parsed = [makeClause(1)];
    const bad = { ...validAnalyzed, severity: "CRITICAL" };
    expect(() => validateAnalyzerOutput([bad], parsed)).toThrow('invalid severity "CRITICAL"');
  });

  it("throws if risk_summary is missing", () => {
    const parsed = [makeClause(1)];
    const bad = { severity: "HIGH", legal_reasoning: "Some reasoning.", category_flags: [] };
    expect(() => validateAnalyzerOutput([bad], parsed)).toThrow("missing risk_summary");
  });

  it("parses valid HIGH clause correctly", () => {
    const parsed = [makeClause(1)];
    const result = validateAnalyzerOutput([validAnalyzed], parsed);
    expect(result).toHaveLength(1);
    expect(result[0].severity).toBe("HIGH");
    expect(result[0].risk_summary).toBe(validAnalyzed.risk_summary);
    expect(result[0].category_flags).toEqual(["ip_risk"]);
  });

  it("merges original parsed clause fields", () => {
    const parsed = [makeClause(42)];
    const result = validateAnalyzerOutput([validAnalyzed], parsed);
    expect(result[0].id).toBe(42);
    expect(result[0].text).toBe("Clause 42 text.");
  });

  it("filters out invalid category flags", () => {
    const parsed = [makeClause(1)];
    const item = { ...validAnalyzed, category_flags: ["ip_risk", "invalid_flag", "financial_risk"] };
    const result = validateAnalyzerOutput([item], parsed);
    expect(result[0].category_flags).toEqual(["ip_risk", "financial_risk"]);
  });

  it("defaults empty category_flags when not an array", () => {
    const parsed = [makeClause(1)];
    const item = { ...validAnalyzed, category_flags: null };
    const result = validateAnalyzerOutput([item], parsed);
    expect(result[0].category_flags).toEqual([]);
  });

  it("defaults legal_reasoning to empty string when missing", () => {
    const parsed = [makeClause(1)];
    const item = { severity: "LOW", risk_summary: "Standard clause.", category_flags: [] };
    const result = validateAnalyzerOutput([item], parsed);
    expect(result[0].legal_reasoning).toBe("");
  });

  it("handles all valid severities", () => {
    const parsed = [makeClause(1), makeClause(2), makeClause(3)];
    const items = [
      { severity: "HIGH", risk_summary: "High risk.", category_flags: [] },
      { severity: "MEDIUM", risk_summary: "Medium risk.", category_flags: [] },
      { severity: "LOW", risk_summary: "Low risk.", category_flags: [] },
    ];
    const result = validateAnalyzerOutput(items, parsed);
    expect(result.map((c) => c.severity)).toEqual(["HIGH", "MEDIUM", "LOW"]);
  });

  it("preserves order of multiple clauses", () => {
    const parsed = [makeClause(1), makeClause(2), makeClause(3)];
    const items = parsed.map((_, i) => ({
      severity: "MEDIUM",
      risk_summary: `Summary ${i + 1}`,
      category_flags: [],
    }));
    const result = validateAnalyzerOutput(items, parsed);
    expect(result.map((c) => c.id)).toEqual([1, 2, 3]);
  });
});
