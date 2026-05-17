"use client";

import { useEffect, useRef } from "react";

interface Props {
  text: string;
  activeClauseText: string | null;
}

export function ContractPane({ text, activeClauseText }: Props) {
  const highlightRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (highlightRef.current) {
      highlightRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [activeClauseText]);

  const segments = buildSegments(text, activeClauseText);

  return (
    <div
      className="flex flex-col h-full overflow-hidden"
      style={{ borderRight: "1px solid rgba(255,255,255,0.06)" }}
    >
      {/* Pane header */}
      <div
        className="flex-shrink-0 px-5 py-3 flex items-center gap-2"
        style={{
          background: "var(--void-2)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <span className="section-idx" style={{ color: "var(--ink-4)" }}>
          Original contract
        </span>
        {activeClauseText && (
          <span
            className="mono-label px-1.5 py-0.5 rounded-sm"
            style={{ background: "rgba(91,72,232,0.12)", color: "var(--accent-2)" }}
          >
            clause highlighted
          </span>
        )}
      </div>

      {/* Scrollable text */}
      <div className="flex-1 overflow-y-auto px-5 py-5">
        <p
          className="leading-relaxed whitespace-pre-wrap"
          style={{ color: "var(--ink-3)", fontSize: "12px", fontFamily: "var(--font-mono)" }}
        >
          {segments.map((seg, i) =>
            seg.highlight ? (
              <mark
                key={i}
                ref={i === segments.findIndex((s) => s.highlight) ? highlightRef : undefined}
                style={{
                  background: "rgba(91,72,232,0.25)",
                  color: "var(--paper)",
                  borderRadius: "2px",
                  padding: "1px 0",
                  outline: "1px solid rgba(91,72,232,0.4)",
                }}
              >
                {seg.text}
              </mark>
            ) : (
              <span key={i}>{seg.text}</span>
            )
          )}
        </p>
      </div>
    </div>
  );
}

function buildSegments(
  text: string,
  activeClauseText: string | null
): Array<{ text: string; highlight: boolean }> {
  if (!activeClauseText) return [{ text, highlight: false }];

  // Normalize whitespace for matching — clauses can have extra spaces from PDF extraction
  const normalize = (s: string) => s.replace(/\s+/g, " ").trim();
  const needle = normalize(activeClauseText);

  // Try exact match first, then normalized match
  let idx = text.indexOf(activeClauseText);
  let matchLen = activeClauseText.length;

  if (idx === -1) {
    // Build a regex from the normalized needle that tolerates variable whitespace
    const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/ /g, "\\s+");
    const m = new RegExp(escaped, "i").exec(text);
    if (m) {
      idx = m.index;
      matchLen = m[0].length;
    }
  }

  if (idx === -1) return [{ text, highlight: false }];

  return [
    { text: text.slice(0, idx), highlight: false },
    { text: text.slice(idx, idx + matchLen), highlight: true },
    { text: text.slice(idx + matchLen), highlight: false },
  ];
}
