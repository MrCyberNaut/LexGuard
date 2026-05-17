// Shared TypeScript types for the 3-agent LexGuard pipeline

export type ClauseType =
  | "IP_Transfer"
  | "NDA"
  | "Non_Compete"
  | "Termination"
  | "Liability"
  | "Arbitration"
  | "Data_Privacy"
  | "Payment"
  | "Auto_Renewal"
  | "Other";

export type Severity = "HIGH" | "MEDIUM" | "LOW";

export type CategoryFlag =
  | "financial_risk"
  | "privacy_risk"
  | "employment_risk"
  | "ip_risk"
  | "freedom_risk";

// Agent 1 output
export interface ParsedClause {
  id: number;
  text: string;
  type: ClauseType;
  section: string | null;
}

export interface GroundingSource {
  uri: string;
  title: string;
}

// Agent 2 output (extends Agent 1)
export interface AnalyzedClause extends ParsedClause {
  severity: Severity;
  risk_summary: string;
  legal_reasoning: string;
  category_flags: CategoryFlag[];
  sources?: GroundingSource[]; // Google Search grounding citations
}

// Agent 3 output (advocate fields merged onto HIGH clauses)
export interface AdvocatedClause extends AnalyzedClause {
  what_it_costs_you: string;
  push_back: string;
  red_flag_label: string;
}

// Final clause — may or may not have advocate fields
export type FinalClause = AnalyzedClause | AdvocatedClause;

export function isAdvocated(c: FinalClause): c is AdvocatedClause {
  return "push_back" in c;
}

// API request/response shapes
export interface AnalyzeRequest {
  text?: string;
  pdfBase64?: string;
  fileName?: string;
  userRole?: "employee" | "freelancer" | "founder" | "other";
  userId?: string;
  userName?: string;
}

export interface AnalyzeResponse {
  clauses: FinalClause[];
  riskScore: number;
  counts: { high: number; medium: number; low: number };
  error?: never;
}

export interface AnalyzeError {
  error: string;
  clauses?: never;
}

export type AnalyzeResult = AnalyzeResponse | AnalyzeError;

// User profile (stored in localStorage)
export interface UserProfile {
  name: string;
  email: string;
  role: "employee" | "freelancer" | "founder" | "other";
}
