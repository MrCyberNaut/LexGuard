"use client";

import { useState } from "react";
import type { UserProfile } from "@/lib/types";

interface Props {
  onComplete: (profile: UserProfile) => void;
}

const ROLES: { value: UserProfile["role"]; label: string }[] = [
  { value: "employee", label: "Employee" },
  { value: "freelancer", label: "Freelancer" },
  { value: "founder", label: "Founder / Director" },
  { value: "other", label: "Other" },
];

export function UserOnboarding({ onComplete }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserProfile["role"]>("employee");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { setError("Enter your name"); return; }
    if (!email.trim() || !email.includes("@")) { setError("Enter a valid email"); return; }
    const profile: UserProfile = { name: name.trim(), email: email.trim().toLowerCase(), role };
    localStorage.setItem("lexguard_user", JSON.stringify(profile));
    onComplete(profile);
  }

  return (
    <div
      className="flex-1 grid-bg-dark flex items-center justify-center px-6"
      style={{ background: "var(--void)" }}
    >
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="mb-8">
          <p className="section-idx mb-3" style={{ color: "var(--ink-4)" }}>
            [0/1] — Access
          </p>
          <h1 className="heading-2" style={{ color: "var(--paper)" }}>
            Who&apos;s reviewing?
          </h1>
          <p className="body-base mt-2" style={{ color: "var(--ink-3)" }}>
            Your role helps us prioritize which clauses matter most to you.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="mono-label block mb-1.5" style={{ color: "var(--ink-4)" }}>
              Full name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(""); }}
              placeholder="Arnav Sawant"
              className="w-full px-3 py-2.5 rounded-sm text-sm transition-colors outline-none"
              style={{
                background: "var(--void-3)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "var(--paper)",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
            />
          </div>

          {/* Email */}
          <div>
            <label className="mono-label block mb-1.5" style={{ color: "var(--ink-4)" }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              placeholder="you@company.com"
              className="w-full px-3 py-2.5 rounded-sm text-sm transition-colors outline-none"
              style={{
                background: "var(--void-3)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "var(--paper)",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
            />
          </div>

          {/* Role */}
          <div>
            <label className="mono-label block mb-2" style={{ color: "var(--ink-4)" }}>
              I&apos;m reviewing this as a
            </label>
            <div className="grid grid-cols-2 gap-2">
              {ROLES.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setRole(r.value)}
                  className="px-3 py-2 rounded-sm text-left transition-all"
                  style={{
                    background: role === r.value ? "var(--accent)" : "var(--void-3)",
                    border: `1px solid ${role === r.value ? "var(--accent)" : "rgba(255,255,255,0.08)"}`,
                    color: role === r.value ? "white" : "var(--paper-3)",
                    fontSize: "12px",
                    fontWeight: role === r.value ? 600 : 400,
                  }}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="mono-label" style={{ color: "var(--risk-red)" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-2.5 rounded-sm font-semibold text-sm transition-opacity hover:opacity-90"
            style={{ background: "var(--paper)", color: "var(--void)" }}
          >
            Start analyzing →
          </button>
        </form>

        <p className="mono-label mt-4 text-center" style={{ color: "var(--ink-4)" }}>
          stored locally · never sent to any server
        </p>
      </div>
    </div>
  );
}
