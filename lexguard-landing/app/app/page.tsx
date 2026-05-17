"use client";

import { useState, useEffect, useCallback } from "react";
import { Sidebar } from "@/components/tool/sidebar";
import { UserOnboarding } from "@/components/tool/user-onboarding";
import { UploadPanel } from "@/components/tool/upload-panel";
import { LoadingScreen } from "@/components/tool/loading-screen";
import { Dashboard } from "@/components/tool/dashboard";
import type { UserProfile, AnalyzeResponse } from "@/lib/types";

type View = "onboarding" | "upload" | "loading" | "results";

interface LoadingState {
  stage: string;
  sub: string;
  progress: number;
}

export default function AppPage() {
  const [view, setView] = useState<View>("upload");
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<LoadingState>({
    stage: "",
    sub: "",
    progress: 0,
  });
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");

  // Restore user from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("lexguard_user");
      if (stored) {
        const profile = JSON.parse(stored) as UserProfile;
        setUser(profile);
        setView("upload");
      } else {
        setView("onboarding");
      }
    } catch {
      setView("onboarding");
    }
  }, []);

  const handleUserComplete = useCallback((profile: UserProfile) => {
    setUser(profile);
    setView("upload");
  }, []);

  const handleClearUser = useCallback(() => {
    localStorage.removeItem("lexguard_user");
    setUser(null);
    setView("onboarding");
    setResult(null);
    setError("");
  }, []);

  const handleLoading = useCallback((stage: string, sub: string, progress: number) => {
    setLoading({ stage, sub, progress });
    setView("loading");
    setError("");
  }, []);

  const handleResult = useCallback((data: AnalyzeResponse, name: string) => {
    setResult(data);
    setFileName(name);
    setView("results");
    setError("");
  }, []);

  const handleError = useCallback((msg: string) => {
    setError(msg);
    setView("upload");
  }, []);

  const handleNewAnalysis = useCallback(() => {
    setResult(null);
    setFileName("");
    setError("");
    setView("upload");
  }, []);

  return (
    <div className="flex flex-1 overflow-hidden" style={{ height: "100dvh" }}>
      {/* Sidebar — hidden during onboarding */}
      {view !== "onboarding" && (
        <Sidebar user={user} onClear={handleClearUser} />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Error banner */}
        {error && (
          <div
            className="px-6 py-2.5 flex items-center gap-3 flex-shrink-0"
            style={{
              background: "rgba(217,58,43,0.08)",
              borderBottom: "1px solid rgba(217,58,43,0.2)",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: "var(--risk-red)" }}
            />
            <p className="body-small" style={{ color: "var(--risk-red)" }}>
              {error}
            </p>
            <button
              onClick={() => setError("")}
              className="ml-auto mono-label"
              style={{ color: "var(--ink-3)" }}
            >
              dismiss
            </button>
          </div>
        )}

        {/* Views */}
        {view === "onboarding" && (
          <UserOnboarding onComplete={handleUserComplete} />
        )}

        {view === "upload" && (
          <UploadPanel
            onResult={handleResult}
            onLoading={handleLoading}
            onError={handleError}
            userRole={user?.role}
          />
        )}

        {view === "loading" && (
          <LoadingScreen
            stage={loading.stage}
            sub={loading.sub}
            progress={loading.progress}
          />
        )}

        {view === "results" && result && (
          <Dashboard
            result={result}
            fileName={fileName}
            onNewAnalysis={handleNewAnalysis}
          />
        )}
      </div>
    </div>
  );
}
