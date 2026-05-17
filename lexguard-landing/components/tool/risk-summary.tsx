"use client";

import { riskLevel } from "@/lib/risk-score";

interface Props {
  score: number;
  counts: { high: number; medium: number; low: number };
  fileName: string;
  onNewAnalysis: () => void;
}

const RISK_LABELS = {
  critical: { label: "Critical", color: "var(--risk-red)" },
  elevated: { label: "Elevated", color: "var(--risk-amber)" },
  moderate: { label: "Moderate", color: "var(--risk-amber)" },
  low: { label: "Low", color: "var(--risk-green)" },
} as const;

export function RiskSummary({ score, counts, fileName, onNewAnalysis }: Props) {
  const level = riskLevel(score);
  const { label, color } = RISK_LABELS[level];

  return (
    <div
      className="flex-shrink-0 border-b px-6 py-4"
      style={{
        background: "var(--void-2)",
        borderColor: "rgba(255,255,255,0.07)",
      }}
    >
      <div className="flex items-center justify-between gap-6 flex-wrap">
        {/* Left — file + score */}
        <div className="flex items-center gap-6">
          {/* File label */}
          <div>
            <p className="section-idx mb-0.5" style={{ color: "var(--ink-4)" }}>
              [2/3] — Results
            </p>
            <p className="mono-label" style={{ color: "var(--paper-3)" }}>
              {fileName}
            </p>
          </div>

          <div
            className="w-px h-8 flex-shrink-0"
            style={{ background: "rgba(255,255,255,0.08)" }}
          />

          {/* Risk score */}
          <div className="flex items-baseline gap-1.5">
            <span
              className="font-display font-bold tabular-nums"
              style={{ fontSize: "28px", color: "var(--paper)", lineHeight: 1 }}
            >
              {score}
            </span>
            <span className="body-small" style={{ color: "var(--ink-3)" }}>
              / 100
            </span>
          </div>

          {/* Risk level badge */}
          <span
            className="tag"
            style={{ color, borderColor: color, opacity: 0.9 }}
          >
            {label}
          </span>
        </div>

        {/* Center — counts */}
        <div className="flex items-center gap-6">
          <CountBadge n={counts.high} label="High" color="var(--risk-red)" />
          <CountBadge n={counts.medium} label="Medium" color="var(--risk-amber)" />
          <CountBadge n={counts.low} label="Low" color="var(--risk-green)" />
        </div>

        {/* Right — action */}
        <button
          onClick={onNewAnalysis}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-medium transition-colors"
          style={{
            border: "1px solid rgba(255,255,255,0.12)",
            color: "var(--paper-3)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.25)";
            (e.currentTarget as HTMLElement).style.color = "var(--paper)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)";
            (e.currentTarget as HTMLElement).style.color = "var(--paper-3)";
          }}
        >
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <path d="M1 5.5H10M10 5.5L7 2.5M10 5.5L7 8.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          New analysis
        </button>
      </div>
    </div>
  );
}

function CountBadge({ n, label, color }: { n: number; label: string; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ background: color }}
      />
      <span
        className="font-display font-semibold tabular-nums"
        style={{ color: "var(--paper)", fontSize: "16px" }}
      >
        {n}
      </span>
      <span className="mono-label" style={{ color: "var(--ink-3)" }}>
        {label}
      </span>
    </div>
  );
}
