# LexGuard — Architecture Notes (Locked at 11:30)

## One Sentence
"Every contract is written by their lawyer. This is yours."

## Reframe
Reframe 2+3: Power asymmetry + urgency-first. Not a summarizer — an adversarial advocate that fights for the signer.

## Demo Moment
Upload a real employment/freelance contract → dashboard populates with red/yellow/green per clause → click any red → see "What they're claiming", "What this costs you", "What to say to push back."

## Verifiable Metric
"Identified 7 high-risk clauses in a real Uber ToS in 8 seconds."

## Stack
- Gemini 2.5 Flash (handles PDFs natively, no OCR)
- Google AI Studio API
- HTML + Tailwind CSS + vanilla JS (fastest to ship)
- Firebase hosting

## Pipeline (3 Agents)

### Agent 1 — Parser Agent
```
You are a contract clause extraction agent.
Your task is to break a legal contract into individual clauses.
You receive the full text of a legal document.
You output a JSON array where each item has:
  - id: sequential number
  - text: the original clause text (verbatim)
  - type: one of [IP_Transfer, NDA, Non_Compete, Termination, Liability, Arbitration, Data_Privacy, Payment, Auto_Renewal, Other]
  - section: the section heading if present
Constraints:
  - Extract every clause, not just risky ones
  - Keep clause text verbatim
  - Group multi-sentence clauses if they form one legal concept
  - Output valid JSON only, no commentary
```

### Agent 2 — Risk Analyzer Agent
```
You are a contract risk analysis agent protecting the signing party.
Your task is to evaluate each clause for risk to the person SIGNING.
You receive a JSON array of contract clauses.
You output the same array with these fields added:
  - severity: "HIGH" | "MEDIUM" | "LOW"
  - risk_summary: one sentence in plain English, no legal jargon
  - legal_reasoning: why this is risky, what standard practice looks like (2-3 sentences)
  - category_flags: array of ["financial_risk", "privacy_risk", "employment_risk", "ip_risk", "freedom_risk"]
Constraints:
  - HIGH = significant financial loss, restricted freedom, or valuable rights transfer
  - MEDIUM = one-sided but common; worth knowing
  - LOW = standard clause
  - Score from the signer's perspective, not the drafter's
  - Output valid JSON only
```

### Agent 3 — Advocate Agent
```
You are a contract negotiation advocate who fights for the signing party.
Your task is to generate specific, actionable pushback for HIGH severity clauses.
You receive a JSON array of HIGH severity clauses.
You output the same array with these fields added:
  - what_they_claim: "The company is claiming..." (1 sentence, plain English)
  - what_it_costs_you: "If you sign this, you lose..." (1-2 sentences, concrete impact)
  - push_back: exact language to use in negotiation ("Ask them to change this to...")
  - red_flag_label: punchy UI label (e.g., "Unlimited IP Grab", "No Exit Clause", "Perpetual Data Rights")
Constraints:
  - Be specific — "ask for a 12-month cap" not "negotiate the terms"
  - push_back must be a sentence the user can actually say or put in an email
  - Output valid JSON only
```

## Antigravity Brief
Build a single-page web app called LexGuard.

Stack: HTML, Tailwind CSS, vanilla JS. Call Gemini 2.5 Flash API directly from frontend.

Flow:
1. User uploads a PDF or pastes contract text
2. App runs 3 sequential Gemini API calls (Parser → Risk Analyzer → Advocate)
3. Show a loading state with "Analyzing clauses..." progress
4. Render a dashboard of clause cards with colored left border:
   RED = HIGH risk, YELLOW = MEDIUM, GREEN = LOW
5. Each card shows: risk label pill, clause type, first line of text, severity badge
6. Click any card → expand to show:
   - "What they're claiming"
   - "What this costs you"
   - "How to push back" (only on RED cards)
7. Show a summary bar at top: X high risk · Y medium · Z low

Design: Enterprise dark mode like Linear. Sidebar with LexGuard logo + tagline
"Every contract is written by their lawyer. This is yours."

## Stitch UI Prompt
"A legal contract analysis dashboard. Dark sidebar with 'LexGuard' branding and
tagline. Main area shows contract clauses as a vertical list of cards. Each card
has a colored left border (red/yellow/green), a risk label pill at top right,
the clause type as a small tag, and first line of clause text. One expanded red
card shows three sections: 'What they're claiming', 'What this costs you',
'How to push back' with a specific negotiation script. Summary bar at top shows
3 count badges. Enterprise dark mode like Linear or Vercel. Clean, high contrast."

## Demo Contract
Use Uber driver agreement or Upwork freelancer ToS — both public, both have brutal IP clauses + one-sided arbitration. Guaranteed 5+ HIGH hits.

## Build Timeline
- Now–12:00 → Stitch UI exported
- 12:00–13:30 → Antigravity, wire all 3 agents, happy path end-to-end
- 13:30–14:00 → Test with real contract, verify red flags fire
- 14:00–14:30 → Polish dashboard

## Source-Based Advocacy — Anti-Hallucination Design

### Why This Matters
Hallucinated legal advice is worse than no advice. Problem Statement explicitly scores on:
- Legal Reasoning Quality — cites must be accurate
- Explainability — sources prove the claim, not just assert it
- Practical Applicability — wrong legal advice harms real users

### Technical Solution: Gemini Grounding with Google Search
Google AI Studio natively supports grounding — Gemini cites real URLs when generating responses.
Enable `google_search_retrieval` in the API call for Risk Analyzer + Advocate agents.

Result: "This non-compete is unenforceable in California (Labor Code §925 — source: leginfo.legislature.ca.gov)"
Not: "This clause seems risky and you should push back."

### Legal Knowledge Anchors (pre-loaded context)
Pass this grounding context to Risk Analyzer + Advocate:

```
Key legal standards to reference when relevant:
- Non-competes: FTC Rule (2024, blocked but signals trend), California Labor Code §925, Minnesota Stat. §181.988
- IP ownership: Work-for-hire doctrine (17 U.S.C. §101), employee invention laws by state
- Arbitration: FAA, EFAA (2022) — bars arbitration for sexual harassment/assault claims
- Data collection: GDPR Article 6 (lawful basis), CCPA §1798.100
- Non-disparagement: NLRA §7 protects concerted activity; broad clauses may be overbroad
- Notice periods: At-will employment default (US), statutory minimums by country
- Auto-renewal: FTC Negative Option Rule, state ROSCA equivalents

Always cite the specific law, section, and jurisdiction. If uncertain about jurisdiction, say so.
```

### Context Preservation (Anti-Hallucination Memory)
- Agent 2 (Risk Analyzer) receives: full original clause text + clause type from Agent 1
- Agent 3 (Advocate) receives: full original clause text + full risk analysis from Agent 2 + user situation
- Never pass summaries between agents — always pass full structured JSON
- Each agent prompt explicitly says: "Do not invent legal standards. Only cite what you know is real."

---

## MOAT (Confirmed via Competitive Research)

### The Gap
Every existing tool (Harvey, Spellbook, Ironclad, Kira, LegalOn) does summaries + risk scores.
ZERO tools do: clause → your situation → ranked fight-list → ready-to-send email → "what if they say no" branching.

### The 3 Unique Things LexGuard Does
1. **Situation-aware pushback** — asks if you're a first-job employee, senior hire, freelancer, or vendor. Adjusts which clauses to fight and how hard.
2. **Ready-to-send email drafts** — one tap copies the counter-email to send to HR/client.
3. **"They said no →" branching** — fallback position if they reject your first ask.

### MOAT Implementation
- Add "Your Situation" selector on upload screen: [ First Job ] [ Senior Employee ] [ Freelancer ] [ Vendor ]
- Pass situation to Advocate Agent — reprioritizes clauses by leverage
- Generate ready-to-send email per HIGH clause

### Updated Advocate Agent (add to existing prompt)
```
You also receive: user_situation: one of [first_job_employee, senior_employee, freelancer, vendor]

Additional output fields:
  - priority_rank: 1 (fight hardest) to 3 (accept if needed) — based on user's leverage
  - negotiation_email: ready-to-send 3-sentence email to HR/client requesting the change
  - fallback_position: if they reject your ask, what's the minimum acceptable change?
```

### Pitch Line This Unlocks
"Every other tool tells you what's risky. LexGuard tells you what to say — and what to say next if they push back."

---

## Pitch Framework
- Open with story: "Last year, a friend signed a freelance contract. 6 months later the company owned everything she'd built — including her side projects."
- Demo within 90 seconds
- Explain the advocate agent as the elegant architectural choice
- Close: "What makes this different is it doesn't just flag risks — it tells you exactly what to say."
