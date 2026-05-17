"use client";

// Isometric layer diagram — CSS 3D transforms
function LayerStack() {
  const layers = [
    {
      label: "LAYER 01 — CONTRACT",
      sub: "raw text / PDF",
      color: "#f5f4f0",
      border: "#0e0e0e",
      textColor: "#0e0e0e",
      z: 0,
    },
    {
      label: "LAYER 02 — CLAUSES",
      sub: "structured JSON[]",
      color: "#edece8",
      border: "#3a3a3a",
      textColor: "#3a3a3a",
      z: 1,
    },
    {
      label: "LAYER 03 — RISKS",
      sub: "scored & categorized",
      color: "#d93a2b",
      border: "#d93a2b",
      textColor: "#f5f4f0",
      z: 2,
    },
    {
      label: "LAYER 04 — DEFENSE",
      sub: "pushback language",
      color: "#0e0e0e",
      border: "#0e0e0e",
      textColor: "#5b48e8",
      z: 3,
    },
  ];

  return (
    <div
      style={{
        perspective: "900px",
        perspectiveOrigin: "50% 40%",
        height: "320px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ position: "relative", width: "400px", height: "240px", transformStyle: "preserve-3d" }}>
        {layers.map((layer, i) => (
          <div
            key={layer.label}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              height: "52px",
              bottom: `${i * 64}px`,
              background: layer.color,
              border: `1.5px solid ${layer.border}`,
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 16px",
              transform: `rotateX(20deg) translateZ(0px)`,
              boxShadow: `0 ${(i + 1) * 4}px ${(i + 1) * 12}px rgba(0,0,0,0.12)`,
              animation: `fade-up 0.5s cubic-bezier(0.16,1,0.3,1) ${i * 0.1 + 0.3}s both`,
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "ui-monospace",
                  fontSize: "9px",
                  letterSpacing: "0.08em",
                  color: layer.textColor,
                  opacity: 0.7,
                  marginBottom: "3px",
                }}
              >
                {layer.label}
              </div>
              <div
                style={{
                  fontFamily: "ui-monospace",
                  fontSize: "11px",
                  color: layer.textColor,
                }}
              >
                {layer.sub}
              </div>
            </div>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M4 8h8M9 5l3 3-3 3"
                stroke={layer.textColor}
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
}

const PROBLEMS = [
  {
    stat: "1 in 3",
    label: "employees sign away IP they built at home.",
    detail:
      "\"Inventions\" clauses routinely cover weekend side projects. Most signers never notice. The clause is always on page 11.",
    law: "17 U.S.C. §101",
  },
  {
    stat: "30M",
    label: "US workers are bound by unenforceable non-competes.",
    detail:
      "California Labor Code §925 voids them for CA workers. The FTC 2024 rule targets them nationally. But only if you know to ask.",
    law: "Cal. Lab. Code §925",
  },
  {
    stat: "95%",
    label: "of people skip the fine print on purpose.",
    detail:
      "The other side knows. The worst clauses are buried on page 14, written to be ignored. That's not an accident.",
    law: "EFAA 2022",
  },
];

export function Problem() {
  return (
    <section
      id="why"
      style={{ background: "var(--void)", color: "var(--paper)" }}
      className="border-t border-[#ffffff]/05"
    >
      <div className="border-b border-[#ffffff]/05 px-6 py-2 flex items-center gap-3">
        <span className="section-idx" style={{ color: "var(--ink-3)" }}>[2/5]</span>
        <span className="section-idx" style={{ color: "var(--ink-3)" }}>— The problem</span>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-[2fr_3fr] gap-16 items-start">
          {/* Left */}
          <div>
            <h2
              style={{
                fontFamily: "var(--font-space-grotesk)",
                fontSize: "32px",
                fontWeight: 700,
                lineHeight: 1.1,
                letterSpacing: "-0.025em",
                color: "var(--paper)",
                marginBottom: "16px",
              }}
            >
              The contract was designed
              <br />
              to make you miss things.
            </h2>
            <p
              style={{
                fontSize: "14px",
                color: "var(--ink-4)",
                lineHeight: 1.65,
              }}
            >
              Not malice. Incentives. The drafter is paid to protect the other
              side. You are not protected unless you make them.
            </p>

            {/* Layer diagram */}
            <div className="mt-12">
              <div
                style={{
                  fontFamily: "ui-monospace",
                  fontSize: "9px",
                  letterSpacing: "0.1em",
                  color: "var(--ink-4)",
                  marginBottom: "16px",
                }}
              >
                WHAT LEXGUARD EXTRACTS FROM YOUR CONTRACT
              </div>
              <LayerStack />
            </div>
          </div>

          {/* Right — stat cards */}
          <div className="space-y-0">
            {PROBLEMS.map((p, i) => (
              <div
                key={p.stat}
                style={{
                  borderTop: i === 0 ? "1px solid rgba(255,255,255,0.1)" : "none",
                  borderBottom: "1px solid rgba(255,255,255,0.1)",
                  padding: "24px 0",
                }}
              >
                <div className="grid grid-cols-[120px_1fr] gap-6">
                  <div
                    style={{
                      fontFamily: "var(--font-space-grotesk)",
                      fontSize: "40px",
                      fontWeight: 700,
                      lineHeight: 1,
                      color: "var(--paper)",
                      letterSpacing: "-0.03em",
                    }}
                  >
                    {p.stat}
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "15px",
                        fontWeight: 500,
                        color: "var(--paper)",
                        marginBottom: "6px",
                        lineHeight: 1.35,
                      }}
                    >
                      {p.label}
                    </div>
                    <p style={{ fontSize: "13px", color: "var(--ink-4)", lineHeight: 1.6, marginBottom: "8px" }}>
                      {p.detail}
                    </p>
                    <span
                      style={{
                        fontFamily: "ui-monospace",
                        fontSize: "10px",
                        color: "var(--accent-2)",
                        letterSpacing: "0.05em",
                      }}
                    >
                      → {p.law}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
