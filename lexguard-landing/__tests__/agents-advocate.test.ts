import { validateAdvocateOutput, buildAdvocatePrompt } from "@/lib/agents/advocate";
import type { AnalyzedClause } from "@/lib/types";

const makeHighClause = (id: number): AnalyzedClause => ({
  id,
  text: `Clause ${id} text.`,
  type: "IP_Transfer",
  section: "Section 3",
  severity: "HIGH",
  risk_summary: "Company claims all your work.",
  legal_reasoning: "Under 17 U.S.C. §101...",
  category_flags: ["ip_risk"],
});

const validAdvocated = {
  severity: "HIGH",
  risk_summary: "Company claims all your work.",
  what_it_costs_you: "You lose all IP rights to your inventions.",
  push_back: "Ask them to limit IP assignment to work created during business hours using company resources.",
  red_flag_label: "Unlimited IP Grab",
};

describe("validateAdvocateOutput", () => {
  it("throws if input is not an array", () => {
    expect(() => validateAdvocateOutput({ items: [] }, [])).toThrow("Agent 3: expected JSON array");
  });

  it("throws if an item is not an object", () => {
    const highClauses = [makeHighClause(1)];
    expect(() => validateAdvocateOutput(["string"], highClauses)).toThrow();
  });

  it("throws if item has no matching input clause", () => {
    const highClauses = [makeHighClause(1)];
    expect(() => validateAdvocateOutput([validAdvocated, validAdvocated], highClauses)).toThrow("Agent 3: item 1 has no matching input clause");
  });

  it("parses a valid advocated clause", () => {
    const highClauses = [makeHighClause(1)];
    const result = validateAdvocateOutput([validAdvocated], highClauses);
    expect(result).toHaveLength(1);
    expect(result[0].severity).toBe("HIGH");
    expect(result[0].what_it_costs_you).toBe(validAdvocated.what_it_costs_you);
    expect(result[0].push_back).toBe(validAdvocated.push_back);
    expect(result[0].red_flag_label).toBe(validAdvocated.red_flag_label);
  });

  it("carries forward base clause fields", () => {
    const highClauses = [makeHighClause(7)];
    const result = validateAdvocateOutput([validAdvocated], highClauses);
    expect(result[0].id).toBe(7);
    expect(result[0].text).toBe("Clause 7 text.");
    expect(result[0].type).toBe("IP_Transfer");
  });

  it("falls back to base risk_summary when output omits it", () => {
    const highClauses = [makeHighClause(1)];
    const item = { ...validAdvocated, risk_summary: "" };
    const result = validateAdvocateOutput([item], highClauses);
    expect(result[0].risk_summary).toBe(highClauses[0].risk_summary);
  });

  it("defaults what_it_costs_you to empty string when missing", () => {
    const highClauses = [makeHighClause(1)];
    const item = { severity: "HIGH", risk_summary: "Risk.", red_flag_label: "Test" };
    const result = validateAdvocateOutput([item], highClauses);
    expect(result[0].what_it_costs_you).toBe("");
  });

  it("defaults red_flag_label to 'High Risk' when missing", () => {
    const highClauses = [makeHighClause(1)];
    const item = { severity: "HIGH", risk_summary: "Risk.", what_it_costs_you: "Loses rights." };
    const result = validateAdvocateOutput([item], highClauses);
    expect(result[0].red_flag_label).toBe("High Risk");
  });

  it("forces severity to HIGH regardless of input", () => {
    const highClauses = [makeHighClause(1)];
    const item = { ...validAdvocated, severity: "MEDIUM" };
    const result = validateAdvocateOutput([item], highClauses);
    expect(result[0].severity).toBe("HIGH");
  });

  it("handles multiple clauses preserving order", () => {
    const highClauses = [makeHighClause(1), makeHighClause(2)];
    const items = [validAdvocated, { ...validAdvocated, red_flag_label: "Forced Arbitration" }];
    const result = validateAdvocateOutput(items, highClauses);
    expect(result[0].id).toBe(1);
    expect(result[1].id).toBe(2);
    expect(result[1].red_flag_label).toBe("Forced Arbitration");
  });
});

describe("buildAdvocatePrompt", () => {
  it("includes employee context when role is employee", () => {
    const prompt = buildAdvocatePrompt("employee");
    expect(prompt).toContain("salaried employee");
  });

  it("includes freelancer context when role is freelancer", () => {
    const prompt = buildAdvocatePrompt("freelancer");
    expect(prompt).toContain("independent contractor");
  });

  it("includes founder context when role is founder", () => {
    const prompt = buildAdvocatePrompt("founder");
    expect(prompt).toContain("startup founder");
  });

  it("defaults to other context when role is undefined", () => {
    const prompt = buildAdvocatePrompt(undefined);
    expect(prompt).toContain("balanced advice");
  });

  it("defaults to other context for unknown role string", () => {
    const prompt = buildAdvocatePrompt("astronaut");
    expect(prompt).toContain("balanced advice");
  });

  it("always includes the base system prompt", () => {
    const prompt = buildAdvocatePrompt("employee");
    expect(prompt).toContain("contract negotiation advocate");
    expect(prompt).toContain("push_back");
    expect(prompt).toContain("red_flag_label");
  });
});
