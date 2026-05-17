"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[#f5f4f0]/90 backdrop-blur-md border-b border-[#0e0e0e]/10" : ""
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Wordmark */}
        <Link href="/" className="flex items-center group">
          <img 
            src="/logo.png" 
            alt="LexGuard Logo" 
            className="h-8 w-auto object-contain flex-shrink-0" 
          />
        </Link>

        {/* Center links */}
        <div className="hidden md:flex items-center gap-6">
          {["How it works", "Features", "Try it"].map((label) => (
            <a
              key={label}
              href={`#${label.toLowerCase().replace(/ /g, "-")}`}
              className="text-[13px] text-[#6b6b6b] hover:text-[#0e0e0e] transition-colors tracking-tight"
            >
              {label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <a
          href="/app"
          className="flex items-center gap-1.5 bg-[#0e0e0e] text-[#f5f4f0] text-[12px] font-semibold px-4 py-2 rounded-sm hover:bg-[#3a3a3a] transition-colors tracking-tight"
        >
          Open app
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 8L8 2M8 2H3M8 2V7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </a>
      </div>
    </nav>
  );
}
