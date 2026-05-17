"use client";

import { useState, useEffect, useRef } from "react";

interface Clause {
  id: number;
  section: string;
  title: string;
  severity: "HIGH" | "MEDIUM" | "LOW";
  text: string;
  translation: string;
  economicImpact: string;
  pushback: string;
}

interface ContractData {
  id: string;
  name: string;
  fileName: string;
  riskScore: number;
  description: string;
  clauses: Clause[];
  fullTextParts: { text: string; clauseId?: number }[];
}

const CONTRACTS: ContractData[] = [
  {
    id: "employment",
    name: "Employment Agreement",
    fileName: "techcorp_employment_final.pdf",
    riskScore: 87,
    description: "Standard high-growth tech employment contract containing aggressive IP, non-compete, and arbitration clauses.",
    clauses: [
      {
        id: 1,
        section: "Section 3 — IP Assignment",
        title: "2-Year Post-Employment IP Grab",
        severity: "HIGH",
        text: "Employee agrees that any and all inventions, discoveries, improvements, works of authorship, software, algorithms, business methods, and ideas that Employee conceives, develops, or contributes to during the term of employment, or within 2 years after termination, shall be the sole and exclusive property of the Company. This includes work created on Employee's personal time using personal equipment if it relates in any way to the Company's business.",
        translation: "The company claims ownership of everything you write, make, or think of—even on personal time, on personal hardware, and for a full 2 years after you quit.",
        economicImpact: "Prevents you from building side projects, launching a startup on your own weekends, or owning any personal code you write after leaving.",
        pushback: "Could we amend Section 3 to delete the 2-year post-termination tail, and restrict IP assignment exclusively to work created during normal working hours that directly utilizes TechCorp's proprietary resources and relates solely to my core responsibilities?"
      },
      {
        id: 2,
        section: "Section 5 — Non-Compete Covenant",
        title: "36-Month Worldwide Non-Compete",
        severity: "HIGH",
        text: "During employment and for a period of 36 months following termination for any reason, Employee shall not, directly or indirectly, engage in, own, manage, operate, control, consult for, or provide services to any business that competes with the Company in any market where the Company operates or plans to operate globally.",
        translation: "You are legally banned from working for any competitor in your industry worldwide for 3 full years after leaving your job.",
        economicImpact: "Locks you out of your career and specialized domain. Forces you to either change industries entirely or remain economically locked to TechCorp.",
        pushback: "Can we reduce the post-employment non-compete duration to 6 months, restrict the geographic boundary to a 25-mile radius of the headquarters, and limit the scope of 'competitor' solely to companies in our immediate enterprise niche?"
      },
      {
        id: 3,
        section: "Section 7 — Mandatory Arbitration",
        title: "Forced Arbitration & Class Waiver",
        severity: "HIGH",
        text: "Any and all disputes arising out of or relating to this Agreement, Employee's employment, or termination—including claims of discrimination, harassment, wrongful termination, and wage violations—shall be resolved exclusively through binding individual arbitration. Employee waives the right to a jury trial and the right to participate in any class action.",
        translation: "You surrender your constitutional right to sue TechCorp in public court for wage theft, abuse, or discrimination. All disputes are settled behind closed doors.",
        economicImpact: "Private arbitration statistically favors the corporate employer. It strips away public accountability and prevents employees from joining forces.",
        pushback: "Could we carve out statutory labor, wage-and-hour, and harassment claims from the mandatory arbitration clause, or at least eliminate the class action waiver to allow collective mediation?"
      }
    ],
    fullTextParts: [
      { text: "EMPLOYMENT AGREEMENT\n\nThis Agreement is entered into as of the date of signing between TechCorp Inc. ('Company') and the undersigned ('Employee').\n\n1. POSITION AND DUTIES\nEmployee agrees to perform all duties assigned by the Company, at the Company's sole discretion.\n\n2. COMPENSATION\nEmployee will receive a base salary as specified in the offer letter. Bonus payments are entirely discretionary.\n\n3. INTELLECTUAL PROPERTY ASSIGNMENT\n" },
      { text: "Employee agrees that any and all inventions, discoveries, improvements, works of authorship, software, algorithms, business methods, and ideas that Employee conceives, develops, or contributes to during the term of employment, or within 2 years after termination, shall be the sole and exclusive property of the Company. This includes work created on Employee's personal time using personal equipment if it relates in any way to the Company's business.", clauseId: 1 },
      { text: "\n\n4. NON-DISCLOSURE AGREEMENT\nEmployee agrees to keep all proprietary information strictly confidential. This obligation survives termination indefinitely.\n\n5. NON-COMPETE COVENANT\n" },
      { text: "During employment and for a period of 36 months following termination for any reason, Employee shall not, directly or indirectly, engage in, own, manage, operate, control, consult for, or provide services to any business that competes with the Company in any market where the Company operates or plans to operate globally.", clauseId: 2 },
      { text: "\n\n6. NON-SOLICITATION\nFor a period of 24 months post-employment, Employee shall not solicit, recruit, or hire any current or former employees.\n\n7. MANDATORY ARBITRATION\n" },
      { text: "Any and all disputes arising out of or relating to this Agreement, Employee's employment, or termination—including claims of discrimination, harassment, wrongful termination, and wage violations—shall be resolved exclusively through binding individual arbitration. Employee waives the right to a jury trial and the right to participate in any class action.", clauseId: 3 },
      { text: "\n\n8. GOVERNING LAW\nThis Agreement shall be governed by Delaware law.\n\nBY SIGNING BELOW, EMPLOYEE ACKNOWLEDGES READING AND UNDERSTANDING THIS AGREEMENT." }
    ]
  },
  {
    id: "freelance",
    name: "Freelance Contract",
    fileName: "indie_contractor_service_v2.txt",
    riskScore: 68,
    description: "Standard freelance services agreement with heavy liability shifts, unilateral indemnity, and immediate termination rules.",
    clauses: [
      {
        id: 4,
        section: "Section 6 — Indemnification",
        title: "Unilateral Third-Party Indemnity",
        severity: "HIGH",
        text: "Contractor agrees to indemnify, defend, and hold harmless Client from any and all claims, damages, losses, and expenses (including attorney's fees) arising out of or in connection with Contractor's services, whether or not caused by Contractor's negligence.",
        translation: "You must pay for all of the client's legal fees and damages for any lawsuit related to your work, even if the client's own actions caused it.",
        economicImpact: "If a third party sues the client over the website or design, you are on the hook to defend them, potentially costing you tens of thousands of dollars.",
        pushback: "Let's make this indemnification mutual, and restrict my liability solely to direct claims arising from my proven gross negligence or willful misconduct, excluding client-caused issues."
      },
      {
        id: 5,
        section: "Section 7 — Limitation of Liability",
        title: "Highly Skewed Liability Cap",
        severity: "MEDIUM",
        text: "Notwithstanding any other provision, Client's total liability to Contractor for any reason shall not exceed the fees paid in the 30 days preceding the claim. Client shall not be liable for any indirect, incidental, or consequential damages.",
        translation: "If the client breaches the contract, they only owe you a maximum of 30 days of fees. Meanwhile, your liability to them is completely unlimited.",
        economicImpact: "If they suddenly cancel a $10,000 project or refuse to pay for completed work, your legal recourse is capped at a tiny fraction of what you're owed.",
        pushback: "Could we make the limitation of liability mutual, capping both parties' liability to the total contract fees actually paid under this Agreement?"
      },
      {
        id: 6,
        section: "Section 8 — Termination",
        title: "24-Hour Notice & Forfeited Pay",
        severity: "HIGH",
        text: "Client may terminate this Agreement at any time, for any reason, with 24 hours notice. Client shall owe payment only for work formally accepted prior to termination, as determined by Client.",
        translation: "The client can fire you overnight and refuse to pay for your work-in-progress if they claim they haven't 'formally accepted' it.",
        economicImpact: "You could build 90% of a software project, get terminated on a whim, and receive $0 because formal acceptance is at their sole discretion.",
        pushback: "Can we extend the termination notice period to 14 days and include a clause stating that the Client shall compensate the Contractor pro-rata for all hours worked and milestones in progress up to the termination date?"
      }
    ],
    fullTextParts: [
      { text: "INDEPENDENT CONTRACTOR SERVICE AGREEMENT\n\nThis Agreement is entered into between Acme Solutions ('Client') and the undersigned specialist ('Contractor').\n\n1. SCOPE OF SERVICES\nContractor shall deliver design, software development, and consultancy services as outlined in Exhibit A.\n\n2. INTELLECTUAL PROPERTY TRANSFER\nUpon full payment of fees, Contractor assigns all rights in the final deliverables to Client.\n\n3. FEES AND BILLING\nContractor shall invoice Client monthly. Net 30 payment terms.\n\n6. INDEMNIFICATION\n" },
      { text: "Contractor agrees to indemnify, defend, and hold harmless Client from any and all claims, damages, losses, and expenses (including attorney's fees) arising out of or in connection with Contractor's services, whether or not caused by Contractor's negligence.", clauseId: 4 },
      { text: "\n\n7. LIMITATION OF LIABILITY FOR CLIENT\n" },
      { text: "Notwithstanding any other provision, Client's total liability to Contractor for any reason shall not exceed the fees paid in the 30 days preceding the claim. Client shall not be liable for any indirect, incidental, or consequential damages.", clauseId: 5 },
      { text: "\n\n8. TERMINATION\n" },
      { text: "Client may terminate this Agreement at any time, for any reason, with 24 hours notice. Client shall owe payment only for work formally accepted prior to termination, as determined by Client.", clauseId: 6 },
      { text: "\n\n9. DISPUTE RESOLUTION\nAny disputes shall be resolved through binding arbitration in Client's home jurisdiction." }
    ]
  },
  {
    id: "saas",
    name: "SaaS Platform Terms",
    fileName: "rideshare_terms_of_service.pdf",
    riskScore: 42,
    description: "Platform-to-consumer terms of service containing broad personal tracking licenses and dynamic pricing multipliers.",
    clauses: [
      {
        id: 7,
        section: "Section 3 — Data Collection",
        title: "Permanent Background Location Tracking",
        severity: "HIGH",
        text: "You grant the Company an irrevocable, worldwide, royalty-free license to collect, store, process, and use your location data, device information, and usage patterns. We may share this data with third-party advertising partners and retain your data indefinitely, including after account deletion.",
        translation: "The platform tracks your real-time physical coordinates, shares them with advertisers, and retains this profile forever, even if you delete the app.",
        economicImpact: "Your movement patterns, frequently visited locations, and personal habits are compiled into a corporate database with zero privacy guarantees.",
        pushback: "You cannot negotiate platform terms of service, but we recommend toggling off 'Always Allow' background location access in your device settings and opting out of personalized advertising."
      },
      {
        id: 8,
        section: "Section 5 — Liability Limit",
        title: "12-Month Platform Liability Cap",
        severity: "MEDIUM",
        text: "To the maximum extent permitted by law, the Company's liability to you for any claim arising from use of the Services shall not exceed the amount you paid to the Company in the 12 months preceding the claim.",
        translation: "If the platform breaks or causes you financial loss, the maximum you can ever recover from them is what you spent with them in the last year.",
        economicImpact: "Limits your legal compensation to negligible levels even in cases of severe platform glitches, fraud, or billing errors.",
        pushback: "This is a standard unilateral platform cap. Users should verify billing transactions promptly to capture disputes within standard consumer windows."
      }
    ],
    fullTextParts: [
      { text: "PLATFORM TERMS OF SERVICE\n\nRideShare Platform Inc. — User Terms of Service\n\nLast Updated: January 1, 2025\n\nPLEASE READ THESE TERMS CAREFULLY. BY ACCESSING OUR SERVICES YOU AGREE TO BE BOUND BY THESE TERMS.\n\n1. ACCEPTANCE OF TERMS\nWe reserve the right to modify these Terms at any time without advance notice.\n\n2. BINDING ARBITRATION AND CLASS ACTION WAIVER\nYou agree that any dispute, claim, or controversy shall be resolved through binding individual arbitration.\n\n3. DATA COLLECTION AND USE\n" },
      { text: "You grant the Company an irrevocable, worldwide, royalty-free license to collect, store, process, and use your location data, device information, and usage patterns. We may share this data with third-party advertising partners and retain your data indefinitely, including after account deletion.", clauseId: 7 },
      { text: "\n\n4. PRICING AND SURGE MULTIPLIERS\nThe Company reserves the right to set, modify, and apply surge pricing multipliers at any time based on demand.\n\n5. LIMITATION OF LIABILITY\n" },
      { text: "To the maximum extent permitted by law, the Company's liability to you for any claim arising from use of the Services shall not exceed the amount you paid to the Company in the 12 months preceding the claim.", clauseId: 8 },
      { text: "\n\n6. TERMINATION\nThe Company may suspend or terminate your account at any time, for any reason, without notice.\n\nBY USING THE SERVICES, YOU AGREE TO THESE TERMS." }
    ]
  }
];

export function ProductPreview() {
  const [activeTab, setActiveTab] = useState<string>("employment");
  const [selectedClauseId, setSelectedClauseId] = useState<number | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisProgress, setAnalysisProgress] = useState<number>(0);
  const [analysisStage, setAnalysisStage] = useState<string>("");
  const [analysisLog, setAnalysisLog] = useState<string>("");
  const [copiedIndex, setCopiedIndex] = useState<boolean>(false);
  const contract = CONTRACTS.find((c) => c.id === activeTab) || CONTRACTS[0];

  // Simulation timeline for active contract change
  useEffect(() => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setSelectedClauseId(null);

    const stages = [
      { text: "Parsing document structure...", log: "Agent 1 — parsing PDF layout & DOM elements", progress: 25 },
      { text: "Extracting legal clauses...", log: "Agent 2 — isolating core sections and definitions", progress: 60 },
      { text: "Evaluating risk severity...", log: "Agent 3 — benchmarking against local labor codes & statutory laws", progress: 90 },
      { text: "Analysis complete.", log: "LexGuard Vault — fully calibrated", progress: 100 }
    ];

    let current = 0;
    setAnalysisStage(stages[0].text);
    setAnalysisLog(stages[0].log);

    const interval = setInterval(() => {
      current++;
      if (current < stages.length) {
        setAnalysisStage(stages[current].text);
        setAnalysisLog(stages[current].log);
        setAnalysisProgress(stages[current].progress);
      } else {
        clearInterval(interval);
        setIsAnalyzing(false);
        // Default select the first clause when analysis finishes
        setSelectedClauseId(contract.clauses[0]?.id || null);
      }
    }, 350);

    return () => clearInterval(interval);
  }, [activeTab, contract]);

  const selectedClause = contract.clauses.find((cl) => cl.id === selectedClauseId) || contract.clauses[0];

  const handleCopyScript = () => {
    if (!selectedClause) return;
    navigator.clipboard.writeText(selectedClause.pushback);
    setCopiedIndex(true);
    setTimeout(() => setCopiedIndex(false), 2000);
  };

  const getSeverityStyle = (severity: "HIGH" | "MEDIUM" | "LOW") => {
    if (severity === "HIGH") return { text: "text-[#d93a2b]", bg: "bg-[#d93a2b]/10", border: "border-[#d93a2b]/30", solid: "#d93a2b" };
    if (severity === "MEDIUM") return { text: "text-[#c47a16]", bg: "bg-[#c47a16]/10", border: "border-[#c47a16]/30", solid: "#c47a16" };
    return { text: "text-[#1a7a4a]", bg: "bg-[#1a7a4a]/10", border: "border-[#1a7a4a]/30", solid: "#1a7a4a" };
  };

  const getRiskMeterColor = (score: number) => {
    if (score >= 80) return "#d93a2b";
    if (score >= 60) return "#c47a16";
    return "#eab308";
  };

  return (
    <section id="preview" className="grid-bg py-24 border-t border-[#0e0e0e]/10">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0e0e0e] text-[#f5f4f0] rounded-sm mb-4">
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#1a7a4a",
                display: "inline-block",
                animation: "pulse-dot 2s ease-in-out infinite"
              }}
            />
            <span className="font-mono text-[10px] tracking-widest uppercase">Interactive Sandbox Playground</span>
          </div>
          <h2
            className="mb-3"
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
          <p className="max-w-xl mx-auto text-sm text-[#6b6b6b] font-space">
            Test drive our active contract auditor. Choose a sample agreement below and explore how LexGuard flags exploitative clauses and compiles precise negotiation scripts.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap justify-center gap-2 mb-8 max-w-2xl mx-auto">
          {CONTRACTS.map((c) => {
            const isActive = activeTab === c.id;
            return (
              <button
                key={c.id}
                onClick={() => {
                  if (!isAnalyzing) setActiveTab(c.id);
                }}
                disabled={isAnalyzing}
                className={`px-4 py-2.5 rounded-sm font-space text-xs font-bold transition-all border flex items-center gap-2 ${
                  isActive
                    ? "bg-[#0e0e0e] border-[#0e0e0e] text-[#f5f4f0] shadow-md scale-105"
                    : "bg-[#edece8] border-[#0e0e0e]/10 text-[#6b6b6b] hover:bg-[#e4e3df]"
                }`}
              >
                {c.id === "employment" && "💼"}
                {c.id === "freelance" && "🎨"}
                {c.id === "saas" && "☁️"}
                {c.name}
              </button>
            );
          })}
        </div>

        {/* The Live Interactive Sandbox UI */}
        <div
          className="relative max-w-5xl mx-auto rounded-md overflow-hidden bg-[#f5f4f0] border border-[#0e0e0e]/20 transition-all duration-300"
          style={{ boxShadow: "0 20px 50px rgba(0,0,0,0.06)" }}
        >
          {/* Mock Browser Top bar */}
          <div className="h-11 bg-[#edece8] border-b border-[#0e0e0e]/10 flex items-center px-4 justify-between">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#d93a2b]" />
              <div className="w-3 h-3 rounded-full bg-[#c47a16]" />
              <div className="w-3 h-3 rounded-full bg-[#1a7a4a]" />
            </div>
            
            {/* Dynamic URL / Filename */}
            <div className="px-6 py-1 bg-[#f5f4f0] border border-[#0e0e0e]/10 rounded text-[11px] font-mono text-[#6b6b6b] flex items-center gap-2 max-w-[280px] truncate shadow-sm">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="text-[#999999]">
                <path d="M3 2H2v6h6V7m-1-5h2m-1-1v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              {contract.fileName}
            </div>

            <div className="w-16" />
          </div>

          {/* Core Content Sandbox */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_380px] h-[520px] relative">
            
            {/* Left: Interactive Document View */}
            <div className="p-6 md:p-8 overflow-y-auto bg-white flex flex-col relative border-r border-[#0e0e0e]/10">
              {isAnalyzing ? (
                /* Sleek Loading Overlay */
                <div className="absolute inset-0 bg-white/90 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center p-8 transition-opacity duration-300">
                  <div className="w-full max-w-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-mono text-xs font-bold text-[#0e0e0e] uppercase tracking-wide">
                        {analysisStage}
                      </span>
                      <span className="font-mono text-xs text-[#6b6b6b] font-bold">
                        {analysisProgress}%
                      </span>
                    </div>
                    {/* Progress Bar */}
                    <div className="h-1.5 w-full bg-[#edece8] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#0e0e0e] rounded-full transition-all duration-300"
                        style={{ width: `${analysisProgress}%` }}
                      />
                    </div>
                    {/* Log details */}
                    <p className="font-mono text-[9px] text-[#999999] mt-2 truncate">
                      {analysisLog}
                    </p>
                  </div>
                </div>
              ) : null}

              {/* Real Contract Text Content with dynamic clickable highlights */}
              <div className="font-serif text-[13px] text-[#333333] leading-relaxed whitespace-pre-wrap select-text">
                {contract.fullTextParts.map((part, idx) => {
                  if (part.clauseId !== undefined) {
                    const clauseObj = contract.clauses.find((c) => c.id === part.clauseId);
                    if (!clauseObj) return <span key={idx}>{part.text}</span>;
                    const sevStyle = getSeverityStyle(clauseObj.severity);
                    const isSelected = selectedClauseId === part.clauseId;

                    return (
                      <span
                        key={idx}
                        onClick={() => setSelectedClauseId(part.clauseId || null)}
                        className={`inline cursor-pointer px-1 rounded-sm border-b-2 transition-all font-bold ${sevStyle.bg} ${sevStyle.text} ${
                          isSelected
                            ? "border-b-4 ring-2 ring-offset-1 ring-black/10 scale-105"
                            : "border-dotted hover:border-solid hover:scale-[1.01]"
                        }`}
                        style={{
                          borderBottomColor: sevStyle.solid,
                        }}
                      >
                        {part.text}
                      </span>
                    );
                  }
                  return <span key={idx}>{part.text}</span>;
                })}
              </div>
            </div>

            {/* Right: Dynamic Interactive Dashboard Analytics */}
            <div className="bg-[#edece8] p-5 flex flex-col gap-4 overflow-y-auto border-t md:border-t-0 border-[#0e0e0e]/10">
              
              {/* Header metrics */}
              <div className="bg-white border border-[#0e0e0e]/10 p-4 rounded-sm shadow-sm flex items-center justify-between">
                <div>
                  <h4 className="font-mono text-[10px] text-[#6b6b6b] tracking-wider uppercase font-bold mb-1">
                    Contract Severity
                  </h4>
                  <p className="font-space text-lg font-bold text-[#0e0e0e] leading-none">
                    {contract.riskScore >= 80 ? "Critical Risk" : contract.riskScore >= 60 ? "Elevated Risk" : "Moderate Risk"}
                  </p>
                </div>

                {/* Gorgeous circular SVG Risk Gauge */}
                <div className="relative w-14 h-14 flex items-center justify-center">
                  <svg className="w-14 h-14 transform -rotate-90">
                    <circle
                      cx="28"
                      cy="28"
                      r="24"
                      stroke="rgba(14,14,14,0.06)"
                      strokeWidth="4.5"
                      fill="transparent"
                    />
                    <circle
                      cx="28"
                      cy="28"
                      r="24"
                      stroke={getRiskMeterColor(contract.riskScore)}
                      strokeWidth="4.5"
                      fill="transparent"
                      strokeDasharray={2 * Math.PI * 24}
                      strokeDashoffset={isAnalyzing ? 2 * Math.PI * 24 : 2 * Math.PI * 24 * (1 - contract.riskScore / 100)}
                      style={{
                        transition: "stroke-dashoffset 0.8s ease-out, stroke 0.8s ease-out",
                      }}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute font-space text-[12px] font-extrabold text-[#0e0e0e]">
                    {isAnalyzing ? "..." : `${contract.riskScore}`}
                  </span>
                </div>
              </div>

              {/* Identified Red Flags tab list */}
              <div className="flex flex-col gap-1.5">
                <p className="font-mono text-[9px] text-[#6b6b6b] uppercase tracking-widest font-bold mb-1">
                  Red Flags Found ({contract.clauses.length})
                </p>
                {contract.clauses.map((c) => {
                  const isSelected = selectedClauseId === c.id;
                  const sevStyle = getSeverityStyle(c.severity);
                  return (
                    <button
                      key={c.id}
                      onClick={() => setSelectedClauseId(c.id)}
                      className={`w-full p-2.5 text-left rounded-sm border transition-all flex items-center justify-between text-xs ${
                        isSelected
                          ? "bg-white border-[#0e0e0e] shadow-sm font-bold scale-[1.02]"
                          : "bg-white/50 hover:bg-white border-transparent text-[#6b6b6b]"
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span
                          className="w-1.5 h-1.5 rounded-full inline-block flex-shrink-0"
                          style={{ background: sevStyle.solid }}
                        />
                        <span className="truncate font-space">{c.title}</span>
                      </div>
                      <span className="font-mono text-[8px] text-[#999999] flex-shrink-0 ml-2">
                        {c.section.split(" ")[0] || "Sec"}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Active Selected Clause Audit Panel */}
              {selectedClause && (
                <div className="flex-1 bg-white border border-[#0e0e0e]/15 p-4 rounded-sm shadow-md flex flex-col justify-between transition-all duration-300">
                  <div>
                    {/* Header line info */}
                    <div className="flex items-center justify-between mb-3 border-b border-[#0e0e0e]/05 pb-2">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ background: getSeverityStyle(selectedClause.severity).solid }}
                        />
                        <span className={`font-mono text-[9px] font-bold tracking-wider uppercase ${getSeverityStyle(selectedClause.severity).text}`}>
                          {selectedClause.severity} RISK
                        </span>
                      </div>
                      <span className="font-mono text-[9px] text-[#999999]">{selectedClause.section}</span>
                    </div>

                    {/* Explainer translation */}
                    <h5 className="font-space font-bold text-[#0e0e0e] text-[13px] leading-snug mb-1">
                      {selectedClause.title}
                    </h5>
                    <p className="text-[11px] text-[#333333] leading-relaxed mb-3">
                      <strong className="text-black font-space">What it means:</strong> {selectedClause.translation}
                    </p>

                    {/* Economic impact cost */}
                    <p className="text-[11px] text-[#6b6b6b] leading-relaxed mb-4 border-l-2 border-black/10 pl-2 italic">
                      <strong className="text-black not-italic font-space">Economic impact:</strong> {selectedClause.economicImpact}
                    </p>
                  </div>

                  {/* Copy-pasteable script box */}
                  <div className="bg-[#1a7a4a]/08 border border-[#1a7a4a]/15 p-3 rounded-sm relative group/btn">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[8px] text-[#1a7a4a] font-bold tracking-wider">
                        DEFENSE COGNITIVE SCRIPT
                      </span>
                      <button
                        onClick={handleCopyScript}
                        className="text-[9px] text-[#1a7a4a] hover:underline font-mono flex items-center gap-1"
                      >
                        {copiedIndex ? (
                          <>
                            <span className="text-[#1a7a4a]">✓</span>
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                            <span>Copy Script</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="text-[10px] text-[#1a7a4a] italic leading-relaxed select-text font-serif">
                      &quot;{selectedClause.pushback}&quot;
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
