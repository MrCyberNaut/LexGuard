"use client";

import { useState } from "react";
import type { FinalClause } from "@/lib/types";
import { isAdvocated } from "@/lib/types";

interface Props {
  clause: FinalClause;
  index: number;
  isActive?: boolean;
  onSelect?: (id: number) => void;
}

const SEVERITY_STYLES = {
  HIGH: {
    border: "var(--risk-red)",
    badge: { bg: "rgba(217,58,43,0.12)", color: "var(--risk-red)" },
    label: "High Risk",
  },
  MEDIUM: {
    border: "var(--risk-amber)",
    badge: { bg: "rgba(196,122,22,0.12)", color: "var(--risk-amber)" },
    label: "Medium Risk",
  },
  LOW: {
    border: "var(--risk-green)",
    badge: { bg: "rgba(26,122,74,0.12)", color: "var(--risk-green)" },
    label: "Low Risk",
  },
} as const;

export function ClauseCard({ clause, index, isActive, onSelect }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [simplified, setSimplified] = useState(false);
  const sev = SEVERITY_STYLES[clause.severity];
  const hasAdvocate = isAdvocated(clause);
  const preview = clause.text.length > 200 ? clause.text.slice(0, 200) + "…" : clause.text;

  function copy(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }

  return (
    <div
      className="rounded-sm overflow-hidden transition-all"
      style={{
        background: "var(--void-2)",
        border: `1px solid ${isActive ? "rgba(91,72,232,0.35)" : "rgba(255,255,255,0.06)"}`,
        borderLeft: `3px solid ${sev.border}`,
        animationDelay: `${index * 30}ms`,
        boxShadow: isActive ? "0 0 0 1px rgba(91,72,232,0.2)" : undefined,
      }}
    >
      {/* Card header — always visible */}
      <button
        className="w-full text-left px-4 py-3.5 flex items-start gap-3"
        onClick={() => {
          setExpanded((p) => !p);
          onSelect?.(clause.id);
        }}
      >
        {/* Index */}
        <span
          className="mono-label flex-shrink-0 mt-0.5 w-5"
          style={{ color: "var(--ink-4)" }}
        >
          {String(clause.id).padStart(2, "0")}
        </span>

        <div className="flex-1 min-w-0">
          {/* Tags row */}
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <span
              className="mono-label px-1.5 py-0.5 rounded-sm"
              style={sev.badge}
            >
              {sev.label}
            </span>
            <span
              className="mono-label px-1.5 py-0.5 rounded-sm"
              style={{
                background: "rgba(255,255,255,0.05)",
                color: "var(--ink-3)",
              }}
            >
              {clause.type.replace(/_/g, " ")}
            </span>
            {hasAdvocate && clause.red_flag_label && (
              <span
                className="mono-label px-1.5 py-0.5 rounded-sm font-bold"
                style={{ background: "rgba(217,58,43,0.08)", color: "var(--risk-red)" }}
              >
                {clause.red_flag_label}
              </span>
            )}
          </div>

          {/* Risk summary */}
          <p className="body-small font-medium mb-1" style={{ color: "var(--paper-2)" }}>
            {clause.risk_summary}
          </p>

          {/* Clause preview */}
          {!expanded && (
            <p
              className="mono-code leading-relaxed"
              style={{ color: "var(--ink-3)", fontSize: "11px" }}
            >
              {preview}
            </p>
          )}
        </div>

        {/* Chevron */}
        <svg
          width="12" height="12"
          viewBox="0 0 12 12"
          fill="none"
          className="flex-shrink-0 mt-1 transition-transform duration-200"
          style={{
            color: "var(--ink-4)",
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div
          className="px-4 pb-4 pt-1 space-y-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          {/* What it costs you */}
          {hasAdvocate && clause.what_it_costs_you && (
            <div>
              <p
                className="mono-label mb-1.5"
                style={{ color: "var(--risk-red)" }}
              >
                What this costs you
              </p>
              <p className="body-small leading-relaxed" style={{ color: "var(--paper-3)" }}>
                {clause.what_it_costs_you}
              </p>
            </div>
          )}

          {/* Push back */}
          {hasAdvocate && clause.push_back && (
            <div
              className="rounded-sm px-4 py-3"
              style={{
                background: "rgba(91,72,232,0.06)",
                border: "1px solid rgba(91,72,232,0.15)",
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="mono-label" style={{ color: "var(--accent-2)" }}>
                  How to push back
                </p>
                <button
                  onClick={() => copy(clause.push_back)}
                  className="mono-label flex items-center gap-1 transition-colors"
                  style={{ color: copied ? "var(--risk-green)" : "var(--ink-3)" }}
                >
                  {copied ? "Copied" : "Copy"}
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <rect x="3.5" y="1" width="5.5" height="6.5" rx="0.5" stroke="currentColor" strokeWidth="0.8" />
                    <path d="M1 3.5H2.5V9H8V7.5" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
              <p className="body-small leading-relaxed" style={{ color: "var(--paper-2)" }}>
                {clause.push_back}
              </p>
            </div>
          )}

          {/* Legal reasoning with plain-English toggle */}
          {clause.legal_reasoning && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <p className="mono-label" style={{ color: "var(--ink-4)" }}>
                  {simplified ? "Plain English" : "Legal basis"}
                </p>
                <button
                  onClick={() => setSimplified((p) => !p)}
                  className="mono-label px-1.5 py-0.5 rounded-sm transition-colors"
                  style={{
                    background: simplified ? "rgba(91,72,232,0.12)" : "rgba(255,255,255,0.04)",
                    color: simplified ? "var(--accent-2)" : "var(--ink-3)",
                    fontSize: "10px",
                  }}
                >
                  {simplified ? "show legal text" : "explain simply"}
                </button>
              </div>
              <p
                className="mono-code leading-relaxed"
                style={{ color: "var(--ink-3)", fontSize: "11.5px" }}
              >
                {simplified ? clause.risk_summary : clause.legal_reasoning}
              </p>
            </div>
          )}

          {/* Full clause text */}
          <div>
            <p className="mono-label mb-1.5" style={{ color: "var(--ink-4)" }}>
              Original clause
            </p>
            <p
              className="mono-code leading-relaxed"
              style={{
                color: "var(--ink-3)",
                fontSize: "11px",
                borderLeft: "2px solid rgba(255,255,255,0.06)",
                paddingLeft: "12px",
              }}
            >
              {clause.text}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
