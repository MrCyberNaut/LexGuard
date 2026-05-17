"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { UserProfile, AnalyzeResponse } from "@/lib/types";
import type { AnalysisRecord } from "@/lib/history";
import { riskLevel } from "@/lib/risk-score";

interface SidebarProps {
  user: UserProfile | null;
  onClear?: () => void;
  onLoadHistory?: (result: AnalyzeResponse, fileName: string) => void;
}

export function Sidebar({ user, onClear, onLoadHistory }: SidebarProps) {
  const [tab, setTab] = useState<"analyze" | "history">("analyze");
  const [history, setHistory] = useState<AnalysisRecord[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tab === "history" && user?.email) {
      setLoading(true);
      fetch(`/api/history?userId=${encodeURIComponent(user.email)}`)
        .then((r) => r.json())
        .then((d) => setHistory(d.analyses ?? []))
        .catch(() => setHistory([]))
        .finally(() => setLoading(false));
    }
  }, [tab, user?.email]);

  return (
    <aside
      className="w-56 flex-shrink-0 flex flex-col border-r"
      style={{ background: "var(--void-2)", borderColor: "rgba(255,255,255,0.07)" }}
    >
      {/* Logo */}
      <div
        className="px-5 py-4 border-b flex items-center justify-between"
        style={{ borderColor: "rgba(255,255,255,0.07)" }}
      >
        <Link href="/" className="flex items-center gap-2.5">
          <div
            className="w-6 h-6 rounded-sm flex items-center justify-center"
            style={{ background: "var(--accent)" }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 1L10 3.5V8.5L6 11L2 8.5V3.5L6 1Z" stroke="white" strokeWidth="1.2" fill="none" />
              <path d="M6 4V8M4 6H8" stroke="white" strokeWidth="1" strokeLinecap="round" />
            </svg>
          </div>
          <span className="text-sm font-semibold tracking-tight" style={{ color: "var(--paper)" }}>
            LexGuard
          </span>
        </Link>
      </div>

      {/* Nav tabs */}
      <nav className="flex-1 flex flex-col overflow-hidden">
        <div className="px-3 py-4 space-y-0.5 flex-shrink-0">
          <SidebarItem
            icon="analyze"
            label="Analyze"
            active={tab === "analyze"}
            onClick={() => setTab("analyze")}
          />
          <SidebarItem
            icon="history"
            label="History"
            active={tab === "history"}
            onClick={() => setTab("history")}
          />
        </div>

        {/* History panel */}
        {tab === "history" && (
          <div className="flex-1 overflow-y-auto px-3 pb-3">
            {loading ? (
              <p className="mono-label px-2" style={{ color: "var(--ink-4)" }}>Loading...</p>
            ) : history.length === 0 ? (
              <p className="mono-label px-2 leading-relaxed" style={{ color: "var(--ink-4)" }}>
                No analyses yet. Upload a contract to get started.
              </p>
            ) : (
              <div className="space-y-1.5">
                {history.map((item) => (
                  <HistoryItem
                    key={item.id}
                    item={item}
                    onClick={() => {
                      if (onLoadHistory) {
                        onLoadHistory(
                          { clauses: item.clauses, riskScore: item.riskScore, counts: item.counts },
                          item.fileName
                        );
                        setTab("analyze");
                      }
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Status + user */}
      <div className="px-5 py-3 border-t flex-shrink-0" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
        <div className="flex items-center gap-2 mb-3">
          <span
            className="inline-block w-1.5 h-1.5 rounded-full"
            style={{ background: "var(--risk-green)", animation: "pulse-dot 2s ease-in-out infinite" }}
          />
          <span className="mono-label" style={{ color: "var(--paper-3)" }}>gemini-2.5-flash</span>
        </div>
        {user && (
          <div className="space-y-1">
            <p className="mono-label" style={{ color: "var(--paper-2)" }}>{user.name}</p>
            <p className="mono-label" style={{ color: "var(--paper-3)", fontSize: "10px" }}>{user.email}</p>
            <button
              onClick={onClear}
              className="mono-label mt-2 transition-colors"
              style={{ color: "var(--ink-4)" }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "var(--paper-3)")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "var(--ink-4)")}
            >
              sign out ↑
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}

function HistoryItem({ item, onClick }: { item: AnalysisRecord; onClick: () => void }) {
  const level = riskLevel(item.riskScore);
  const color = level === "critical" ? "var(--risk-red)" : level === "elevated" ? "var(--risk-amber)" : "var(--risk-green)";
  const date = new Date(item.analyzedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" });

  return (
    <button
      onClick={onClick}
      className="w-full text-left px-2 py-2 rounded-sm transition-colors"
      style={{ background: "transparent" }}
      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)")}
      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
    >
      <div className="flex items-center justify-between mb-0.5">
        <span className="mono-label truncate max-w-[110px]" style={{ color: "var(--paper-3)" }}>
          {item.fileName}
        </span>
        <span className="mono-label" style={{ color, fontSize: "10px" }}>{item.riskScore}</span>
      </div>
      <span className="mono-label" style={{ color: "var(--ink-4)", fontSize: "10px" }}>{date}</span>
    </button>
  );
}

function SidebarItem({
  icon, label, active, onClick,
}: {
  icon: string; label: string; active?: boolean; onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-2.5 px-2 py-1.5 rounded-sm cursor-pointer transition-colors"
      style={{
        background: active ? "rgba(255,255,255,0.06)" : "transparent",
        color: active ? "var(--paper)" : "var(--paper-3)",
      }}
    >
      {icon === "analyze" ? (
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
          <rect x="1" y="1" width="11" height="11" rx="1" stroke="currentColor" strokeWidth="1" />
          <path d="M3.5 9L5.5 6.5L7 8L9.5 4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
          <circle cx="6.5" cy="6.5" r="5.5" stroke="currentColor" strokeWidth="1" />
          <path d="M6.5 3.5V6.5L8.5 8.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        </svg>
      )}
      <span className="body-small font-medium">{label}</span>
    </div>
  );
}
