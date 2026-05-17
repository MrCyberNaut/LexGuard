"use client";

import { useRef, useEffect } from "react";

// SVG pipeline animation — 3 agents connected by animated lines
function PipelineSVG() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const paths = svgRef.current?.querySelectorAll<SVGPathElement>(".pipeline-line");
    paths?.forEach((p) => {
      const len = p.getTotalLength();
      p.style.strokeDasharray = String(len);
      p.style.strokeDashoffset = String(len);
    });
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 640 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-2xl mx-auto"
      style={{ overflow: "visible" }}
    >
      <defs>
        <marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="rgba(91,72,232,0.7)" />
        </marker>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Agent 1 — Parser */}
      <rect x="10" y="60" width="140" height="60" rx="4" fill="#f5f4f0" stroke="#0e0e0e" strokeWidth="1.5" />
      <text x="80" y="84" textAnchor="middle" fontFamily="ui-monospace" fontSize="9" fill="#6b6b6b" letterSpacing="0.06em">AGENT 01</text>
      <text x="80" y="102" textAnchor="middle" fontFamily="var(--font-space-grotesk,sans-serif)" fontSize="13" fontWeight="600" fill="#0e0e0e">Parser</text>
      <text x="80" y="115" textAnchor="middle" fontFamily="ui-monospace" fontSize="9" fill="#9b9b9b">clause extraction</text>

      {/* Agent 2 — Risk */}
      <rect x="250" y="60" width="140" height="60" rx="4" fill="#f5f4f0" stroke="#0e0e0e" strokeWidth="1.5" />
      <text x="320" y="84" textAnchor="middle" fontFamily="ui-monospace" fontSize="9" fill="#6b6b6b" letterSpacing="0.06em">AGENT 02</text>
      <text x="320" y="102" textAnchor="middle" fontFamily="var(--font-space-grotesk,sans-serif)" fontSize="13" fontWeight="600" fill="#0e0e0e">Risk Analyzer</text>
      <text x="320" y="115" textAnchor="middle" fontFamily="ui-monospace" fontSize="9" fill="#9b9b9b">severity scoring</text>

      {/* Agent 3 — Advocate */}
      <rect x="490" y="60" width="140" height="60" rx="4" fill="#0e0e0e" stroke="#0e0e0e" strokeWidth="1.5" />
      <text x="560" y="84" textAnchor="middle" fontFamily="ui-monospace" fontSize="9" fill="#5b48e8" letterSpacing="0.06em">AGENT 03</text>
      <text x="560" y="102" textAnchor="middle" fontFamily="var(--font-space-grotesk,sans-serif)" fontSize="13" fontWeight="600" fill="#f5f4f0">Advocate</text>
      <text x="560" y="115" textAnchor="middle" fontFamily="ui-monospace" fontSize="9" fill="#6b6b6b">pushback language</text>

      {/* Connector 1 */}
      <path
        className="pipeline-line"
        d="M 150 90 L 250 90"
        stroke="rgba(91,72,232,0.6)"
        strokeWidth="1.5"
        markerEnd="url(#arrow)"
        style={{
          animation: "draw 1s cubic-bezier(0.16,1,0.3,1) 0.3s forwards",
          strokeDasharray: 100,
          strokeDashoffset: 100,
        }}
      />

      {/* Connector 2 */}
      <path
        className="pipeline-line"
        d="M 390 90 L 490 90"
        stroke="rgba(91,72,232,0.6)"
        strokeWidth="1.5"
        markerEnd="url(#arrow)"
        style={{
          animation: "draw 1s cubic-bezier(0.16,1,0.3,1) 0.7s forwards",
          strokeDasharray: 100,
          strokeDashoffset: 100,
        }}
      />

      {/* Data labels */}
      <text x="200" y="80" textAnchor="middle" fontFamily="ui-monospace" fontSize="8" fill="#9b9b9b">JSON[]</text>
      <text x="440" y="80" textAnchor="middle" fontFamily="ui-monospace" fontSize="8" fill="#9b9b9b">HIGH[]</text>

      {/* Progress bar underneath */}
      <rect x="10" y="148" width="620" height="3" rx="1.5" fill="#edece8" />
      <rect x="10" y="148" width="310" height="3" rx="1.5" fill="#5b48e8">
        <animate attributeName="width" from="0" to="620" dur="2.5s" fill="freeze" calcMode="spline" keySplines="0.16 1 0.3 1" begin="0.5s" />
      </rect>
    </svg>
  );
}

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="border-t border-[#0e0e0e]/10"
      style={{ background: "var(--paper)" }}
    >
      {/* Section header strip */}
      <div className="border-b border-[#0e0e0e]/10 px-6 py-2 flex items-center gap-3">
        <span className="section-idx">[1/5]</span>
        <span className="section-idx">— How it works</span>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-[1fr_2fr] gap-16 items-start">
          {/* Left */}
          <div>
            <h2
              style={{
                fontFamily: "var(--font-space-grotesk)",
                fontSize: "32px",
                fontWeight: 700,
                lineHeight: 1.1,
                letterSpacing: "-0.025em",
                color: "var(--ink)",
                marginBottom: "16px",
              }}
            >
              Three agents.
              <br />
              One job.
              <br />
              Under ten seconds.
            </h2>
            <p style={{ fontSize: "14px", color: "var(--ink-3)", lineHeight: 1.65, maxWidth: "280px" }}>
              No monolith. Each agent has a single responsibility. Clean
              handoffs. Reliable output every time.
            </p>
          </div>

          {/* Right — pipeline */}
          <div>
            <PipelineSVG />

            <div className="grid grid-cols-3 gap-4 mt-8">
              {[
                {
                  n: "01",
                  label: "Upload",
                  detail: "Paste text or drop a PDF. Never stored. All analysis happens in the session.",
                  color: "var(--ink)",
                },
                {
                  n: "02",
                  label: "Analyze",
                  detail: "Parser extracts every clause. Risk Analyzer scores HIGH / MEDIUM / LOW with legal reasoning.",
                  color: "var(--ink)",
                },
                {
                  n: "03",
                  label: "Defend",
                  detail: "Advocate writes the exact sentence to say to HR. Copy-paste ready.",
                  color: "var(--accent)",
                },
              ].map((step) => (
                <div
                  key={step.n}
                  style={{
                    borderTop: `2px solid ${step.color}`,
                    paddingTop: "12px",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "10px",
                      color: step.color,
                      marginBottom: "6px",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {step.n}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-space-grotesk)",
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "var(--ink)",
                      marginBottom: "6px",
                    }}
                  >
                    {step.label}
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--ink-3)", lineHeight: 1.5 }}>
                    {step.detail}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
