"use client";

import { useState, useCallback } from "react";
import { RiskSummary } from "@/components/tool/risk-summary";
import { ClauseCard } from "@/components/tool/clause-card";
import { ContractPane } from "@/components/tool/contract-pane";
import type { AnalyzeResponse, FinalClause } from "@/lib/types";

interface Props {
  result: AnalyzeResponse;
  fileName: string;
  originalText?: string;
  onNewAnalysis: () => void;
}

export function Dashboard({ result, fileName, originalText, onNewAnalysis }: Props) {
  const { clauses, riskScore, counts } = result;
  const [activeClauseId, setActiveClauseId] = useState<number | null>(null);

  const handleSelect = useCallback((id: number) => {
    setActiveClauseId((prev) => (prev === id ? null : id));
  }, []);

  const activeClause = clauses.find((c) => c.id === activeClauseId) ?? null;
  const showSplit = Boolean(originalText);

  const clauseList = (
    <div className="flex-1 overflow-y-auto grid-bg-dark">
      <div className="max-w-3xl mx-auto px-6 py-6 space-y-2.5">
        <ClauseGroup
          label="High risk"
          count={counts.high}
          clauses={clauses.filter((c) => c.severity === "HIGH")}
          activeClauseId={activeClauseId}
          onSelect={handleSelect}
        />
        <ClauseGroup
          label="Medium risk"
          count={counts.medium}
          clauses={clauses.filter((c) => c.severity === "MEDIUM")}
          activeClauseId={activeClauseId}
          onSelect={handleSelect}
        />
        <ClauseGroup
          label="Low risk"
          count={counts.low}
          clauses={clauses.filter((c) => c.severity === "LOW")}
          activeClauseId={activeClauseId}
          onSelect={handleSelect}
        />
      </div>
    </div>
  );

  return (
    <div
      className="flex-1 flex flex-col overflow-hidden"
      style={{ background: "var(--void)" }}
    >
      <RiskSummary
        score={riskScore}
        counts={counts}
        fileName={fileName}
        onNewAnalysis={onNewAnalysis}
      />

      {showSplit ? (
        <div className="flex-1 flex overflow-hidden">
          {/* Left — original contract text */}
          <div className="w-1/2 flex flex-col overflow-hidden">
            <ContractPane
              text={originalText!}
              activeClauseText={activeClause?.text ?? null}
            />
          </div>

          {/* Right — clause cards */}
          <div className="w-1/2 flex flex-col overflow-hidden">
            {clauseList}
          </div>
        </div>
      ) : (
        clauseList
      )}
    </div>
  );
}

function ClauseGroup({
  label,
  count,
  clauses,
  activeClauseId,
  onSelect,
}: {
  label: string;
  count: number;
  clauses: FinalClause[];
  activeClauseId: number | null;
  onSelect: (id: number) => void;
}) {
  if (count === 0) return null;
  return (
    <div className="mb-4">
      <p className="mono-label mb-3" style={{ color: "var(--ink-4)" }}>
        {label} · {count} clause{count !== 1 ? "s" : ""}
      </p>
      {clauses.map((c, i) => (
        <div key={c.id} className="mb-2.5">
          <ClauseCard
            clause={c}
            index={i}
            isActive={c.id === activeClauseId}
            onSelect={onSelect}
          />
        </div>
      ))}
    </div>
  );
}
