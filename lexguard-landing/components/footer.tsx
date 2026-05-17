"use client";

export function Footer() {
  return (
    <footer className="bg-[#0e0e0e] border-t border-[#ffffff]/10 py-8">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        
        <div className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <rect width="20" height="20" rx="3" fill="#f5f4f0" />
            <path
              d="M6 10l3 3 5-5"
              stroke="#0e0e0e"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-[12px] font-bold text-[#f5f4f0]">
            LexGuard
          </span>
        </div>

        <div className="flex items-center gap-6">
          <div className="font-mono text-[10px] text-[#6b6b6b]">
            BUILT FOR: GOOGLE × SCALER PROMPTWARS
          </div>
          <div className="font-mono text-[10px] text-[#6b6b6b]">
            MODEL: GEMINI-2.5-FLASH
          </div>
        </div>

      </div>
    </footer>
  );
}
