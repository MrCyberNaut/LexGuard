import { isAdvocated } from "@/lib/types";
import type { AnalyzedClause, AdvocatedClause } from "@/lib/types";

const baseClause: AnalyzedClause = {
  id: 1,
  text: "All inventions shall belong to the Company.",
  type: "IP_Transfer",
  section: "Section 3",
  severity: "HIGH",
  risk_summary: "Company claims ownership of all your work.",
  legal_reasoning: "Under 17 U.S.C. §101 work-for-hire doctrine...",
  category_flags: ["ip_risk"],
};

const advocatedClause: AdvocatedClause = {
  ...baseClause,
  what_it_costs_you: "You lose rights to any invention created during employment.",
  push_back: "Ask them to limit IP assignment to work created during business hours using company resources.",
  red_flag_label: "Unlimited IP Grab",
};

describe("isAdvocated", () => {
  it("returns false for an AnalyzedClause without advocate fields", () => {
    expect(isAdvocated(baseClause)).toBe(false);
  });

  it("returns true for an AdvocatedClause with push_back field", () => {
    expect(isAdvocated(advocatedClause)).toBe(true);
  });

  it("returns false when push_back field is absent even if other fields exist", () => {
    const partial = { ...baseClause, what_it_costs_you: "something" };
    expect(isAdvocated(partial as AnalyzedClause)).toBe(false);
  });
});
