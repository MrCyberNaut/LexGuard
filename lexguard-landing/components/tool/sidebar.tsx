"use client";

import Link from "next/link";
import type { UserProfile } from "@/lib/types";

interface SidebarProps {
  user: UserProfile | null;
  onClear?: () => void;
}

export function Sidebar({ user, onClear }: SidebarProps) {
  return (
    <aside
      className="w-56 flex-shrink-0 flex flex-col border-r"
      style={{
        background: "var(--void-2)",
        borderColor: "rgba(255,255,255,0.07)",
      }}
    >
      {/* Logo */}
      <div
        className="px-5 py-4 border-b flex items-center justify-between"
        style={{ borderColor: "rgba(255,255,255,0.07)" }}
      >
        <Link href="/" className="flex items-center gap-2.5">
          <div
            className="w-6 h-6 rounded-sm flex items-center justify-center text-white"
            style={{ background: "var(--accent)" }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M6 1L10 3.5V8.5L6 11L2 8.5V3.5L6 1Z"
                stroke="white"
                strokeWidth="1.2"
                fill="none"
              />
              <path d="M6 4V8M4 6H8" stroke="white" strokeWidth="1" strokeLinecap="round" />
            </svg>
          </div>
          <span
            className="text-sm font-semibold tracking-tight"
            style={{ color: "var(--paper)" }}
          >
            LexGuard
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <SidebarItem icon="analyze" label="Analyze" active />
        <SidebarItem icon="history" label="History" disabled />
      </nav>

      {/* Status */}
      <div
        className="px-5 py-3 border-t"
        style={{ borderColor: "rgba(255,255,255,0.07)" }}
      >
        <div className="flex items-center gap-2 mb-3">
          <span
            className="inline-block w-1.5 h-1.5 rounded-full"
            style={{
              background: "var(--risk-green)",
              animation: "pulse-dot 2s ease-in-out infinite",
            }}
          />
          <span className="mono-label" style={{ color: "var(--paper-3)" }}>
            gemini-2.5-flash
          </span>
        </div>

        {user && (
          <div className="space-y-1">
            <p className="mono-label" style={{ color: "var(--paper-2)" }}>
              {user.name}
            </p>
            <p className="mono-label" style={{ color: "var(--paper-3)", fontSize: "10px" }}>
              {user.email}
            </p>
            <button
              onClick={onClear}
              className="mono-label mt-2 transition-colors"
              style={{ color: "var(--ink-4)" }}
              onMouseEnter={(e) =>
                ((e.target as HTMLElement).style.color = "var(--paper-3)")
              }
              onMouseLeave={(e) =>
                ((e.target as HTMLElement).style.color = "var(--ink-4)")
              }
            >
              sign out ↑
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}

function SidebarItem({
  icon,
  label,
  active,
  disabled,
}: {
  icon: string;
  label: string;
  active?: boolean;
  disabled?: boolean;
}) {
  const color = disabled
    ? "var(--ink-3)"
    : active
    ? "var(--paper)"
    : "var(--paper-3)";
  const bg = active ? "rgba(255,255,255,0.06)" : "transparent";

  return (
    <div
      className="flex items-center gap-2.5 px-2 py-1.5 rounded-sm cursor-pointer transition-colors"
      style={{
        background: bg,
        color,
        opacity: disabled ? 0.4 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
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
