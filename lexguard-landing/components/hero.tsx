"use client";

import { useEffect, useRef, useState } from "react";

// ASCII art — legal document motif
const ASCII_ART = `
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
░  CONTRACT  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
░            ░  ████████████████████████████████████████████████░░░░░░░░░
░  Page 1/18 ░  ████████████████████████████████████████████████░░░░░░░░░
░            ░  ████████████████████████████████████████████████░░░░░░░░░
░            ░  ██████████████▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓████████████████░░░░░░░░░
░░░░░░░░░░░░░░  ██ § 4.2(b) Intellectual Property Assignment. ██░░░░░░░░░
                ██ All inventions, discoveries, works of       ██░░░░░░░░░
  ▲ RISK HIGH   ██ authorship made by Employee during the      ██░░░░░░░░░
                ██ term—including on personal time—shall be    ██░░░░░░░░░
  → Push back   ██ considered work-for-hire and shall vest     ██░░░░░░░░░
                ██ irrevocably in Company.                     ██░░░░░░░░░
                ██                                             ██░░░░░░░░░
                ████████████████████████████████████████████████░░░░░░░░░
`.trim();

const TYPED_PHRASES = [
  "Employment contract, 18 pages.",
  "Freelance NDA. 3 red flags.",
  "Non-compete. 2-year national scope.",
  "SaaS terms. Auto-renewal buried p.14.",
];

export function Hero() {
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Typewriter effect
  useEffect(() => {
    const target = TYPED_PHRASES[phraseIdx];
    if (!isDeleting && displayed === target) {
      timeoutRef.current = setTimeout(() => setIsDeleting(true), 2200);
    } else if (isDeleting && displayed === "") {
      setIsDeleting(false);
      setPhraseIdx((i) => (i + 1) % TYPED_PHRASES.length);
    } else {
      timeoutRef.current = setTimeout(
        () => {
          setDisplayed(isDeleting ? displayed.slice(0, -1) : target.slice(0, displayed.length + 1));
        },
        isDeleting ? 28 : 52
      );
    }
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [displayed, isDeleting, phraseIdx]);

  return (
    <section className="grid-bg h-screen pt-14 flex flex-col overflow-hidden" id="hero">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float-gentle {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float-delay-1 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes float-delay-2 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        .float-statue {
          animation: float-gentle 8s ease-in-out infinite;
        }
        .float-tag-1 {
          animation: float-delay-1 6s ease-in-out infinite;
        }
        .float-tag-2 {
          animation: float-delay-2 7s ease-in-out infinite;
        }
      `}} />
      {/* Top strip */}
      <div className="border-b border-[#0e0e0e]/10 px-6 py-2 flex items-center justify-between">
        <span className="section-idx">[0/5] — LexGuard Contract Intelligence</span>
        <div className="flex items-center gap-2">
          <span
            className="inline-block w-1.5 h-1.5 rounded-full bg-[#1a7a4a]"
            style={{ animation: "pulse-dot 2s ease-in-out infinite" }}
          />
          <span className="section-idx">gemini-2.5-flash · live</span>
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto w-full px-6 grid md:grid-cols-[4.5fr_5.5fr] gap-0 h-full overflow-hidden">
        {/* Left — copy */}
        <div className="border-r border-[#0e0e0e]/10 py-6 pr-8 flex flex-col justify-center h-full">
          {/* Eyebrow */}
          <div className="flex items-center gap-2 mb-4 fade-up">
            <span className="tag text-[#6b6b6b] border-[#0e0e0e]/20">
              built at google × scaler promptwars
            </span>
          </div>

          {/* Headline */}
          <h1
            className="fade-up delay-1"
            style={{
              fontFamily: "var(--font-space-grotesk)",
              fontSize: "clamp(32px, 4.2vw, 48px)",
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              color: "var(--ink)",
              marginBottom: "16px",
            }}
          >
            Every contract is
            <br />
            written by{" "}
            <em
              style={{
                fontStyle: "italic",
                fontWeight: 400,
                color: "var(--ink-3)",
              }}
            >
              their
            </em>{" "}
            lawyer.
          </h1>

          {/* Sub */}
          <p
            className="fade-up delay-2"
            style={{
              fontSize: "14px",
              color: "var(--ink-2)",
              lineHeight: 1.5,
              maxWidth: "420px",
              marginBottom: "20px",
            }}
          >
            Three AI agents tear open employment contracts, freelance deals,
            NDAs, and SaaS terms. Every risk explained in plain English.
            Exact pushback language included.
          </p>

          {/* Typewriter terminal */}
          <div
            className="fade-up delay-3"
            style={{
              background: "var(--void)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "4px",
              padding: "10px 14px",
              marginBottom: "20px",
              maxWidth: "400px",
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#d93a2b", display: "inline-block" }} />
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#c47a16", display: "inline-block" }} />
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#1a7a4a", display: "inline-block" }} />
              <span className="section-idx ml-2 text-[#9b9b9b]">lexguard ~</span>
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "13px", color: "#e2e0d9" }}>
              <span style={{ color: "#5b48e8" }}>$</span> analyze{" "}
              <span style={{ color: "#9b9b9b" }}>{displayed}</span>
              <span className="cursor" />
            </div>
          </div>

          {/* CTAs */}
          <div className="fade-up delay-4 flex items-center gap-3 flex-wrap">
            <a
              href="/app"
              style={{
                background: "var(--ink)",
                color: "var(--paper)",
                fontSize: "13px",
                fontWeight: 600,
                padding: "11px 22px",
                borderRadius: "3px",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                letterSpacing: "-0.01em",
                textDecoration: "none",
                transition: "background 0.15s",
              }}
            >
              Analyze a contract
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 10L10 2M10 2H4M10 2V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </a>
            <a
              href="#how-it-works"
              style={{
                fontSize: "13px",
                color: "var(--ink-3)",
                textDecoration: "none",
                borderBottom: "1px solid var(--ink-4)",
                paddingBottom: "1px",
                letterSpacing: "-0.01em",
              }}
            >
              See how it works
            </a>
          </div>

          {/* Mini stats */}
          <div className="fade-up delay-5 flex items-center gap-6 mt-6 pt-4 border-t border-[#0e0e0e]/10">
            {[
              { n: "3", label: "AI agents" },
              { n: "<10s", label: "analysis time" },
              { n: "100%", label: "client-side privacy" },
            ].map((s) => (
              <div key={s.n}>
                <div
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    fontSize: "18px",
                    fontWeight: 700,
                    color: "var(--ink)",
                    lineHeight: 1,
                    marginBottom: "2px",
                  }}
                >
                  {s.n}
                </div>
                <div className="section-idx text-[11px]">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Lady Justice Image */}
        <div className="w-full h-full relative flex items-center justify-center pointer-events-none overflow-hidden" style={{ marginTop: "-20px" }}>
          {/* Large soft paper glow behind the statue (blends it seamlessly into background) */}
          <div 
            className="fade-up delay-2"
            style={{
              position: "absolute",
              bottom: "15%",
              left: "50%",
              transform: "translateX(-50%)",
              width: "450px",
              height: "350px", 
              background: "radial-gradient(circle at bottom, rgba(245,244,240,0.92) 0%, rgba(245,244,240,0.5) 45%, rgba(245,244,240,0) 80%)",
              filter: "blur(40px)",
              zIndex: 0,
            }} 
          />
          
          <div 
            className="fade-up delay-3 relative z-10 w-[85%] max-w-[500px] h-[80%] drop-shadow-2xl"
            style={{
              marginLeft: "-3%",
              WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 75%, rgba(0,0,0,0) 98%)",
              maskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 75%, rgba(0,0,0,0) 98%)",
            }}
          >
            <div className="float-statue w-full h-full">
              <img 
                src="/hero-justice-transparent.png" 
                alt="Statue of Lady Justice holding scales" 
                style={{
                   width: "100%",
                   height: "100%",
                   objectFit: "contain",
                }}
              />
            </div>
          </div>

          {/* Floating UI tags over the statue to maintain the tech/legal feel */}
          <div 
            className="fade-up delay-4"
            style={{
              position: "absolute",
              top: "20%", 
              left: "10%", 
              zIndex: 20,
            }}
          >
            <div 
              className="float-tag-1"
              style={{
                background: "#f5f4f0",
                border: "1px solid rgba(14,14,14,0.1)",
                padding: "6px 12px",
                borderRadius: "4px",
                boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transform: "rotate(-2deg)",
              }}
            >
               <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#d93a2b", animation: "pulse-dot 1.5s ease-in-out infinite" }} />
               <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "#d93a2b", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>Liability Shift</span>
            </div>
          </div>

          <div 
            className="fade-up delay-5"
            style={{
              position: "absolute",
              top: "60%", 
              right: "12%", 
              zIndex: 20,
            }}
          >
            <div 
              className="float-tag-2"
              style={{
                background: "#f5f4f0",
                border: "1px solid rgba(14,14,14,0.1)",
                padding: "6px 12px",
                borderRadius: "4px",
                boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transform: "rotate(3deg)",
              }}
            >
               <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#c47a16", animation: "pulse-dot 1.5s ease-in-out infinite" }} />
               <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "#c47a16", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>Non-Compete</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
