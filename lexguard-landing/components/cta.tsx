"use client";

import Link from "next/link";

export function CTA() {
  return (
    <section className="grid-bg-dark py-32 border-t border-[#ffffff]/10 bg-[#0e0e0e] text-[#f5f4f0] relative overflow-hidden">
      {/* Strip */}
      <div className="absolute top-0 left-0 right-0 border-b border-[#ffffff]/10 px-6 py-2 flex items-center gap-3">
        <span className="section-idx" style={{ color: "var(--ink-4)" }}>[4/5]</span>
        <span className="section-idx" style={{ color: "var(--ink-4)" }}>— Terminal Access</span>
      </div>

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10 mt-10">
        <div className="font-mono text-[10px] text-[#5b48e8] tracking-widest mb-6">
          SYSTEM READY
        </div>
        
        <h2 className="font-space text-4xl md:text-6xl font-bold tracking-tight mb-6">
          Stop signing blind.
        </h2>
        
        <p className="text-[15px] text-[#9b9b9b] mb-10 max-w-lg mx-auto">
          The engine is live. Upload a PDF or paste text. Get a full risk analysis and pushback scripts in under 10 seconds. Free for the hackathon duration.
        </p>

        <Link
          href="/app"
          className="inline-flex items-center gap-2 bg-[#f5f4f0] text-[#0e0e0e] font-bold text-[13px] px-8 py-4 rounded-sm hover:bg-white transition-colors"
        >
          Initialize Engine
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 10L10 2M10 2H4M10 2V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </Link>
        
        <div className="mt-8 font-mono text-[10px] text-[#6b6b6b]">
          $ ./start_analysis.sh --mode=deep --privacy=local
        </div>
      </div>
      
      {/* ASCII overlay in background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none font-mono text-[8px] whitespace-pre text-[#f5f4f0] leading-none">
{`████████████████████████████████████████████████████████████████████████
████████████████████████████████████████████████████████████████████████
████████████████████████████████████████████████████████████████████████
████████████████████████████████████████████████████████████████████████
████████████████████████████████████████████████████████████████████████`}
      </div>
    </section>
  );
}
