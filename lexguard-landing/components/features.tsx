"use client";

const FEATURES = [
  {
    id: "f1",
    title: "100% Client-Side Privacy",
    code: `const worker = new Worker('pdf-parser.js');
// Data never hits our database.
// Processing stays in your session.
const result = await worker.postMessage(file);`,
    desc: "We don't want your contract. We don't store it. We don't train on it. The PDF parsing happens in your browser, and only the raw text is sent to the Gemini API.",
  },
  {
    id: "f2",
    title: "Multi-Agent System",
    code: `pipeline = [
  Agent(role="Parser"),
  Agent(role="Risk_Scorer"),
  Agent(role="Advocate")
]
results = pipeline.execute(contract_text)`,
    desc: "Single-prompt LLMs fail at contract review because they hallucinate or summarize too broadly. We use three distinct agents that check each other's work.",
  },
  {
    id: "f3",
    title: "Actionable Pushback",
    code: `> Risk: Non-compete radius is 50 miles.
> Industry Standard: 10-15 miles.
> Action Generated:
"Given the remote nature of this role,
could we limit the non-compete radius
to 10 miles from the regional office?"`,
    desc: "Spotting the trap is only half the battle. LexGuard gives you the exact, professional sentence to email back to HR or the opposing counsel.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 border-t border-[#0e0e0e]/10 bg-[#f5f4f0]">
      {/* Strip */}
      <div className="border-b border-[#0e0e0e]/10 px-6 py-2 flex items-center gap-3 mb-16">
        <span className="section-idx">[3/5]</span>
        <span className="section-idx">— System architecture</span>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8">
          {FEATURES.map((f, i) => (
            <div key={f.id} className="relative group">
              {/* Mono header */}
              <div className="font-mono text-[10px] text-[#0e0e0e] tracking-widest border-b border-[#0e0e0e]/20 pb-2 mb-4 flex justify-between">
                <span>MODULE_{i + 1}</span>
                <span className="text-[#0e0e0e]/40">Active</span>
              </div>
              
              <h3 className="font-space text-xl font-bold text-[#0e0e0e] mb-4">
                {f.title}
              </h3>
              
              {/* Fake code block */}
              <div className="bg-[#0e0e0e] rounded-sm p-4 mb-4 transform transition-transform duration-300 group-hover:-translate-y-1">
                <div className="flex gap-1 mb-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#3a3a3a]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#3a3a3a]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#3a3a3a]" />
                </div>
                <pre className="font-mono text-[10px] text-[#9b9b9b] whitespace-pre-wrap leading-relaxed">
                  {f.code}
                </pre>
              </div>

              <p className="text-[13px] text-[#3a3a3a] leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
