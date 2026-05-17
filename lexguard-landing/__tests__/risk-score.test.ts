import { computeRiskScore, countBySeverity, sortBySeverity, riskLevel } from "@/lib/risk-score";
import type { FinalClause } from "@/lib/types";

const makeClause = (id: number, severity: "HIGH" | "MEDIUM" | "LOW"): FinalClause => ({
  id,
  text: `Clause ${id}`,
  type: "Other",
  section: null,
  severity,
  risk_summary: "Test summary",
  legal_reasoning: "Test reasoning",
  category_flags: [],
});

describe("computeRiskScore", () => {
  it("returns 0 for empty clause list", () => {
    expect(computeRiskScore([])).toBe(0);
  });

  it("scores HIGH clauses at 30 points each", () => {
    expect(computeRiskScore([makeClause(1, "HIGH")])).toBe(30);
  });

  it("scores MEDIUM clauses at 10 points each", () => {
    expect(computeRiskScore([makeClause(1, "MEDIUM")])).toBe(10);
  });

  it("scores LOW clauses at 2 points each", () => {
    expect(computeRiskScore([makeClause(1, "LOW")])).toBe(2);
  });

  it("caps score at 100", () => {
    const clauses = Array.from({ length: 10 }, (_, i) => makeClause(i, "HIGH"));
    expect(computeRiskScore(clauses)).toBe(100);
  });

  it("sums mixed severities correctly", () => {
    const clauses = [
      makeClause(1, "HIGH"),   // 30
      makeClause(2, "MEDIUM"), // 10
      makeClause(3, "LOW"),    // 2
    ];
    expect(computeRiskScore(clauses)).toBe(42);
  });

  it("does not exceed 100 with many MEDIUM clauses", () => {
    const clauses = Array.from({ length: 15 }, (_, i) => makeClause(i, "MEDIUM"));
    expect(computeRiskScore(clauses)).toBe(100);
  });
});

describe("countBySeverity", () => {
  it("returns zero counts for empty list", () => {
    expect(countBySeverity([])).toEqual({ high: 0, medium: 0, low: 0 });
  });

  it("counts each severity correctly", () => {
    const clauses = [
      makeClause(1, "HIGH"),
      makeClause(2, "HIGH"),
      makeClause(3, "MEDIUM"),
      makeClause(4, "LOW"),
      makeClause(5, "LOW"),
      makeClause(6, "LOW"),
    ];
    expect(countBySeverity(clauses)).toEqual({ high: 2, medium: 1, low: 3 });
  });
});

describe("sortBySeverity", () => {
  it("sorts HIGH before MEDIUM before LOW", () => {
    const clauses = [
      makeClause(1, "LOW"),
      makeClause(2, "HIGH"),
      makeClause(3, "MEDIUM"),
    ];
    const sorted = sortBySeverity(clauses);
    expect(sorted[0].severity).toBe("HIGH");
    expect(sorted[1].severity).toBe("MEDIUM");
    expect(sorted[2].severity).toBe("LOW");
  });

  it("does not mutate the original array", () => {
    const clauses = [makeClause(1, "LOW"), makeClause(2, "HIGH")];
    const original = [...clauses];
    sortBySeverity(clauses);
    expect(clauses[0].id).toBe(original[0].id);
  });

  it("preserves relative order within same severity", () => {
    const clauses = [makeClause(3, "HIGH"), makeClause(1, "HIGH"), makeClause(2, "HIGH")];
    const sorted = sortBySeverity(clauses);
    expect(sorted.map((c) => c.id)).toEqual([3, 1, 2]);
  });
});

describe("riskLevel", () => {
  it("returns critical for scores >= 70", () => {
    expect(riskLevel(70)).toBe("critical");
    expect(riskLevel(100)).toBe("critical");
  });

  it("returns elevated for scores 45–69", () => {
    expect(riskLevel(45)).toBe("elevated");
    expect(riskLevel(69)).toBe("elevated");
  });

  it("returns moderate for scores 20–44", () => {
    expect(riskLevel(20)).toBe("moderate");
    expect(riskLevel(44)).toBe("moderate");
  });

  it("returns low for scores below 20", () => {
    expect(riskLevel(0)).toBe("low");
    expect(riskLevel(19)).toBe("low");
  });
});
