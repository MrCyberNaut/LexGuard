"use client";

interface Props {
  stage: string;
  sub: string;
  progress: number;
}

export function LoadingScreen({ stage, sub, progress }: Props) {
  return (
    <div
      className="flex-1 grid-bg-dark flex flex-col items-center justify-center"
      style={{ background: "var(--void)" }}
    >
      <div className="w-full max-w-sm px-6 text-center">
        {/* Agent diagram */}
        <div className="flex items-center justify-center gap-3 mb-10">
          {[
            { n: "01", label: "Parser", done: progress >= 40 },
            { n: "02", label: "Analyzer", done: progress >= 75 },
            { n: "03", label: "Advocate", done: progress >= 95 },
          ].map((agent, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="flex flex-col items-center gap-1">
                <div
                  className="w-9 h-9 rounded-sm flex items-center justify-center text-xs font-mono font-bold transition-all duration-500"
                  style={{
                    background: agent.done ? "var(--accent)" : "var(--void-3)",
                    border: `1px solid ${agent.done ? "var(--accent)" : "rgba(255,255,255,0.1)"}`,
                    color: agent.done ? "white" : "var(--ink-3)",
                  }}
                >
                  {agent.done ? (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    agent.n
                  )}
                </div>
                <span
                  className="mono-label"
                  style={{
                    color: agent.done ? "var(--paper-3)" : "var(--ink-4)",
                    fontSize: "9px",
                  }}
                >
                  {agent.label}
                </span>
              </div>
              {i < 2 && (
                <div
                  className="w-6 h-px mb-4 transition-all duration-700"
                  style={{
                    background: agent.done ? "var(--accent)" : "rgba(255,255,255,0.1)",
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Stage text */}
        <h3
          className="heading-3 mb-2 transition-all duration-300"
          style={{ color: "var(--paper)" }}
        >
          {stage}
        </h3>
        <p className="body-small mb-8" style={{ color: "var(--ink-3)" }}>
          {sub}
        </p>

        {/* Progress bar */}
        <div
          className="h-px w-full rounded-full overflow-hidden"
          style={{ background: "rgba(255,255,255,0.08)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${progress}%`,
              background: "var(--accent)",
            }}
          />
        </div>
        <p
          className="mono-label mt-2 text-right"
          style={{ color: "var(--ink-4)" }}
        >
          {progress}%
        </p>
      </div>
    </div>
  );
}
