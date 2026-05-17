import type { FinalClause } from "@/lib/types";

export function computeRiskScore(clauses: FinalClause[]): number {
  const raw = clauses.reduce((acc, c) => {
    if (c.severity === "HIGH") return acc + 30;
    if (c.severity === "MEDIUM") return acc + 10;
    return acc + 2;
  }, 0);
  return Math.min(100, raw);
}

export function countBySeverity(clauses: FinalClause[]) {
  return {
    high: clauses.filter((c) => c.severity === "HIGH").length,
    medium: clauses.filter((c) => c.severity === "MEDIUM").length,
    low: clauses.filter((c) => c.severity === "LOW").length,
  };
}

// Sort: HIGH first, then MEDIUM, then LOW. Within each group, preserve order.
export function sortBySeverity(clauses: FinalClause[]): FinalClause[] {
  const order: Record<string, number> = { HIGH: 0, MEDIUM: 1, LOW: 2 };
  return [...clauses].sort((a, b) => order[a.severity] - order[b.severity]);
}

export function riskLevel(score: number): "critical" | "elevated" | "moderate" | "low" {
  if (score >= 70) return "critical";
  if (score >= 45) return "elevated";
  if (score >= 20) return "moderate";
  return "low";
}
