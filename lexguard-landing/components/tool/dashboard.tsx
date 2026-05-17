"use client";

import { RiskSummary } from "@/components/tool/risk-summary";
import { ClauseCard } from "@/components/tool/clause-card";
import type { AnalyzeResponse } from "@/lib/types";

interface Props {
  result: AnalyzeResponse;
  fileName: string;
  onNewAnalysis: () => void;
}

export function Dashboard({ result, fileName, onNewAnalysis }: Props) {
  const { clauses, riskScore, counts } = result;

  return (
    <div
      className="flex-1 flex flex-col overflow-hidden"
      style={{ background: "var(--void)" }}
    >
      {/* Summary bar */}
      <RiskSummary
        score={riskScore}
        counts={counts}
        fileName={fileName}
        onNewAnalysis={onNewAnalysis}
      />

      {/* Clause list */}
      <div className="flex-1 overflow-y-auto grid-bg-dark">
        <div className="max-w-3xl mx-auto px-6 py-6 space-y-2.5">
          {/* Category breakdown */}
          {counts.high > 0 && (
            <div className="mb-4">
              <p className="mono-label mb-3" style={{ color: "var(--ink-4)" }}>
                High risk · {counts.high} clause{counts.high !== 1 ? "s" : ""}
              </p>
              {clauses
                .filter((c) => c.severity === "HIGH")
                .map((c, i) => (
                  <div key={c.id} className="mb-2.5">
                    <ClauseCard clause={c} index={i} />
                  </div>
                ))}
            </div>
          )}

          {counts.medium > 0 && (
            <div className="mb-4">
              <p className="mono-label mb-3 mt-2" style={{ color: "var(--ink-4)" }}>
                Medium risk · {counts.medium} clause{counts.medium !== 1 ? "s" : ""}
              </p>
              {clauses
                .filter((c) => c.severity === "MEDIUM")
                .map((c, i) => (
                  <div key={c.id} className="mb-2.5">
                    <ClauseCard clause={c} index={i} />
                  </div>
                ))}
            </div>
          )}

          {counts.low > 0 && (
            <div className="mb-4">
              <p className="mono-label mb-3 mt-2" style={{ color: "var(--ink-4)" }}>
                Low risk · {counts.low} clause{counts.low !== 1 ? "s" : ""}
              </p>
              {clauses
                .filter((c) => c.severity === "LOW")
                .map((c, i) => (
                  <div key={c.id} className="mb-2.5">
                    <ClauseCard clause={c} index={i} />
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
