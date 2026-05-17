"use client";

import { useState, useRef, useCallback } from "react";
import { DEMO_CLAUSES, DEMO_META } from "@/lib/demo-data";
import { computeRiskScore, countBySeverity, sortBySeverity } from "@/lib/risk-score";
import type { AnalyzeResponse } from "@/lib/types";

interface Props {
  onResult: (result: AnalyzeResponse, fileName: string) => void;
  onLoading: (stage: string, sub: string, progress: number) => void;
  onError: (msg: string) => void;
  userRole?: "employee" | "freelancer" | "founder" | "other";
}

export function UploadPanel({ onResult, onLoading, onError, userRole }: Props) {
  const [text, setText] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDemo = useCallback(() => {
    const sorted = sortBySeverity(DEMO_CLAUSES);
    onResult(
      {
        clauses: sorted,
        riskScore: computeRiskScore(sorted),
        counts: countBySeverity(sorted),
      },
      DEMO_META.fileName
    );
  }, [onResult]);

  async function handleAnalyze() {
    if (!text.trim() && !pdfFile) {
      onError("Paste contract text or upload a PDF.");
      return;
    }

    onLoading("Extracting clauses...", "Agent 1 — parsing legal structure", 10);

    try {
      const body: Record<string, string | undefined> = {};

      if (pdfFile) {
        const b64 = await fileToBase64(pdfFile);
        body.pdfBase64 = b64;
        body.fileName = pdfFile.name;
      } else {
        body.text = text;
      }
      if (userRole) body.userRole = userRole;

      onLoading("Extracting clauses...", "Agent 1 — parsing legal structure", 15);
      // Simulate stage transitions while API is running
      const stageTimer1 = setTimeout(() =>
        onLoading("Analyzing risk...", "Agent 2 — evaluating clause severity", 40), 4000);
      const stageTimer2 = setTimeout(() =>
        onLoading("Building your defense...", "Agent 3 — generating pushback language", 72), 10000);

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      clearTimeout(stageTimer1);
      clearTimeout(stageTimer2);

      onLoading("Analysis complete.", "Rendering results...", 100);

      if (!res.ok) {
        const err = (await res.json()) as { error?: string };
        throw new Error(err.error ?? `HTTP ${res.status}`);
      }

      const data = (await res.json()) as AnalyzeResponse;
      await new Promise((r) => setTimeout(r, 350)); // let the 100% state render briefly

      onResult(data, pdfFile?.name ?? "contract.txt");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Analysis failed.";
      onError(msg);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file?.type === "application/pdf") setPdfFile(file);
  }

  return (
    <div
      className="flex-1 grid-bg-dark overflow-y-auto"
      style={{ background: "var(--void)" }}
    >
      <div className="max-w-2xl mx-auto px-6 py-10">
        {/* Header strip */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="section-idx mb-1" style={{ color: "var(--ink-4)" }}>
              [1/3] — Upload
            </p>
            <h2 className="heading-3" style={{ color: "var(--paper)" }}>
              Paste or upload your contract
            </h2>
          </div>
          <button
            onClick={handleDemo}
            className="flex items-center gap-2 px-3 py-1.5 rounded-sm text-xs font-medium transition-colors"
            style={{
              border: "1px dashed rgba(255,255,255,0.2)",
              color: "var(--paper-3)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--accent)";
              (e.currentTarget as HTMLElement).style.color = "var(--accent-2)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.2)";
              (e.currentTarget as HTMLElement).style.color = "var(--paper-3)";
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full inline-block"
              style={{ background: "var(--accent)" }}
            />
            Try demo contract
          </button>
        </div>

        {/* Text area */}
        <div className="mb-4">
          <label className="mono-label block mb-2" style={{ color: "var(--ink-4)" }}>
            Contract text
          </label>
          <textarea
            rows={14}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={"Paste your employment contract, freelance NDA, SaaS terms, or any\nlegal document here. The longer the better — we catch everything."}
            className="w-full px-4 py-3 rounded-sm text-sm leading-relaxed resize-none outline-none transition-colors font-mono"
            style={{
              background: "var(--void-2)",
              border: "1px solid rgba(255,255,255,0.07)",
              color: "var(--paper-2)",
              fontSize: "12.5px",
            }}
            onFocus={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.15)")}
            onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.07)")}
          />
        </div>

        {/* PDF drop zone */}
        <div className="mb-6">
          <label className="mono-label block mb-2" style={{ color: "var(--ink-4)" }}>
            Or upload PDF
          </label>
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className="flex flex-col items-center justify-center py-6 rounded-sm cursor-pointer transition-all"
            style={{
              border: `1px dashed ${isDragging ? "var(--accent)" : "rgba(255,255,255,0.12)"}`,
              background: isDragging ? "rgba(91,72,232,0.05)" : "transparent",
            }}
          >
            {pdfFile ? (
              <div className="flex items-center gap-2">
                <span style={{ color: "var(--risk-green)" }}>✓</span>
                <span className="mono-label" style={{ color: "var(--paper-2)" }}>
                  {pdfFile.name}
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); setPdfFile(null); }}
                  className="mono-label ml-2"
                  style={{ color: "var(--ink-3)" }}
                >
                  ✕
                </button>
              </div>
            ) : (
              <>
                <svg
                  width="20" height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  className="mb-2"
                  style={{ color: "var(--ink-3)" }}
                >
                  <path
                    d="M10 13V4M10 4L7 7M10 4L13 7"
                    stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"
                  />
                  <path
                    d="M3 14v2a1 1 0 001 1h12a1 1 0 001-1v-2"
                    stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"
                  />
                </svg>
                <p className="mono-label" style={{ color: "var(--ink-3)" }}>
                  drag PDF or{" "}
                  <span style={{ color: "var(--accent-2)" }}>browse</span>
                </p>
              </>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) setPdfFile(f);
            }}
          />
        </div>

        {/* Analyze button */}
        <button
          onClick={handleAnalyze}
          className="w-full py-3 rounded-sm font-bold text-sm transition-opacity hover:opacity-90 flex items-center justify-center gap-2"
          style={{ background: "var(--paper)", color: "var(--void)" }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="1" y="1" width="12" height="12" rx="1" stroke="currentColor" strokeWidth="1.2" />
            <path d="M3.5 10L6 7L8 9L10.5 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Analyze contract
        </button>

        {/* Trust note */}
        <p className="mono-label text-center mt-4" style={{ color: "var(--ink-4)" }}>
          processed server-side · contract text is not stored
        </p>
      </div>
    </div>
  );
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
