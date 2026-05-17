"use client";

import { useEffect, useRef } from "react";

export function ProductPreview() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("draw-path");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const paths = containerRef.current?.querySelectorAll(".animate-stroke");
    paths?.forEach((p) => {
      const len = (p as SVGPathElement).getTotalLength();
      (p as SVGPathElement).style.strokeDasharray = String(len);
      (p as SVGPathElement).style.strokeDashoffset = String(len);
      observer.observe(p);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section id="preview" className="grid-bg py-24 border-t border-[#0e0e0e]/10">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0e0e0e] text-[#f5f4f0] rounded-sm mb-4">
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#1a7a4a", display: "inline-block", animation: "pulse-dot 2s ease-in-out infinite" }} />
            <span className="font-mono text-[10px] tracking-widest uppercase">Live Demo Environment</span>
          </div>
          <h2
            style={{
              fontFamily: "var(--font-space-grotesk)",
              fontSize: "32px",
              fontWeight: 700,
              letterSpacing: "-0.025em",
              color: "var(--ink)",
            }}
          >
            See exactly what they didn&apos;t want you to.
          </h2>
        </div>

        {/* The UI Mock */}
        <div
          ref={containerRef}
          className="relative max-w-4xl mx-auto rounded-md overflow-hidden bg-[#f5f4f0] border border-[#0e0e0e]/20"
          style={{ boxShadow: "0 20px 40px rgba(0,0,0,0.05)" }}
        >
          {/* Top bar */}
          <div className="h-10 bg-[#edece8] border-b border-[#0e0e0e]/10 flex items-center px-4 gap-4">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#d93a2b]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#c47a16]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#1a7a4a]" />
            </div>
            <div className="flex-1 flex justify-center">
              <div className="px-4 py-1 bg-[#f5f4f0] border border-[#0e0e0e]/10 rounded text-[10px] font-mono text-[#6b6b6b] flex items-center gap-2">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5h6m-3-3v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                upload_contract_v2_final.pdf
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="grid grid-cols-[1fr_300px] h-[400px]">
            {/* Left: Document View */}
            <div className="p-8 border-r border-[#0e0e0e]/10 relative overflow-hidden">
              {/* Text skeleton */}
              <div className="space-y-4 opacity-40">
                <div className="h-4 bg-[#0e0e0e]/20 rounded w-3/4" />
                <div className="h-4 bg-[#0e0e0e]/20 rounded w-full" />
                <div className="h-4 bg-[#0e0e0e]/20 rounded w-5/6" />
                <div className="h-4 bg-[#0e0e0e]/20 rounded w-full" />
                <div className="h-4 bg-[#0e0e0e]/20 rounded w-4/5" />
              </div>

              {/* Highlight box drawn in SVG */}
              <svg className="absolute top-24 left-6 w-[80%] height-[80px]" viewBox="0 0 400 80" fill="none">
                <rect x="2" y="2" width="396" height="76" rx="4" fill="rgba(217,58,43,0.1)" />
                <rect className="animate-stroke" x="2" y="2" width="396" height="76" rx="4" stroke="#d93a2b" strokeWidth="2" strokeDasharray="1000" strokeDashoffset="1000" />
              </svg>
              
              {/* Text skeleton inside highlight */}
              <div className="space-y-4 opacity-80 mt-12 pl-4 border-l-2 border-[#d93a2b]">
                <div className="h-4 bg-[#0e0e0e]/80 rounded w-[90%]" />
                <div className="h-4 bg-[#0e0e0e]/80 rounded w-[95%]" />
              </div>
              
              <div className="space-y-4 opacity-40 mt-12">
                <div className="h-4 bg-[#0e0e0e]/20 rounded w-3/4" />
                <div className="h-4 bg-[#0e0e0e]/20 rounded w-full" />
              </div>
            </div>

            {/* Right: Sidebar / Analysis */}
            <div className="bg-[#edece8] p-4 flex flex-col gap-4 relative">
               {/* SVG Connector line from highlight to sidebar */}
              <svg className="absolute top-[100px] -left-[50px] w-[50px] h-[20px]" viewBox="0 0 50 20" fill="none" style={{ zIndex: 10 }}>
                 <path className="animate-stroke" d="M 0 10 L 50 10" stroke="#d93a2b" strokeWidth="2" strokeDasharray="60" strokeDashoffset="60" />
                 <circle cx="50" cy="10" r="3" fill="#d93a2b" />
              </svg>

              <div className="bg-[#f5f4f0] border border-[#0e0e0e]/10 p-4 rounded-sm shadow-sm relative">
                <div className="flex items-center justify-between mb-3">
                   <div className="flex items-center gap-1.5">
                     <div className="w-2 h-2 rounded-full bg-[#d93a2b] animate-pulse" />
                     <span className="font-mono text-[9px] text-[#d93a2b] tracking-wider">HIGH RISK</span>
                   </div>
                   <span className="font-mono text-[9px] text-[#0e0e0e]/40">Sec 4.2</span>
                </div>
                <h4 className="font-space font-bold text-[#0e0e0e] text-[13px] leading-snug mb-2">Non-Solicitation Overreach</h4>
                <p className="text-[11px] text-[#6b6b6b] leading-relaxed mb-4">
                  Prevents you from working with ANY client of the company for 24 months, even those you had before joining.
                </p>
                <div className="bg-[#1a7a4a]/10 border border-[#1a7a4a]/20 p-2 rounded-sm">
                  <div className="font-mono text-[8px] text-[#1a7a4a] mb-1 tracking-wider">PUSHBACK SCRIPT</div>
                  <div className="text-[10px] text-[#1a7a4a] italic leading-tight">
                    &quot;Could we limit the non-solicit to only clients I directly interacted with during my employment?&quot;
                  </div>
                </div>
              </div>

              {/* Blurred items below */}
              <div className="bg-[#f5f4f0]/50 border border-[#0e0e0e]/05 p-4 rounded-sm">
                 <div className="h-3 bg-[#0e0e0e]/10 rounded w-1/3 mb-2" />
                 <div className="h-2 bg-[#0e0e0e]/10 rounded w-full mb-1" />
                 <div className="h-2 bg-[#0e0e0e]/10 rounded w-4/5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
