# LexGuard — Architecture (As Shipped)

> Updated post-build to reflect actual state. Original planning notes preserved at the bottom.

---

## Tagline
"Every contract is written by their lawyer. This is yours."

## One-Line Problem
Contract signers (employees, freelancers, founders) have zero power to understand or fight back against legal language designed by the other party's lawyers.

---

## What We Actually Built

### Stack (Shipped)
- **Next.js 16 App Router + TypeScript** (strict mode) — not vanilla HTML/JS as originally planned
- **Gemini 2.5 Flash** via Google AI Studio API
- **Firebase Firestore** — analysis history storage (Google Cloud backend)
- **Google Cloud Run** — containerised Next.js (`output: "standalone"`) via Dockerfile
- **Firebase Admin SDK** — server-side Firestore writes via service account
- **Jest + ts-jest** — 56 unit tests across 5 test suites
- **Vercel** — secondary deployment mirror (uselexguard.vercel.app)

### Deployed
- **Primary:** `https://lexguard-515196401129.europe-west1.run.app/app` (Google Cloud Run)
- **Mirror:** `https://uselexguard.vercel.app`
- **GitHub:** `https://github.com/MrCyberNaut/LexGuard`

---

## Architecture

### 3-Agent Sequential Pipeline

```
User Input (text or PDF)
        │
        ▼
┌─────────────────────┐
│  Agent 1 — Parser   │  Extracts + classifies clauses → ParsedClause[]
└─────────────────────┘
        │
        ▼
┌──────────────────────────┐
│  Agent 2 — Risk Analyzer │  Scores severity + legal reasoning → AnalyzedClause[]
└──────────────────────────┘
        │ (HIGH clauses only)
        ▼
┌──────────────────────────┐
│  Agent 3 — Advocate      │  Generates pushback + negotiation scripts → AdvocatedClause[]
└──────────────────────────┘
        │
        ▼
   Dashboard + Firestore save
```

### Agent 1 — Parser
- Input: raw contract text (string)
- Output: `ParsedClause[]` — `{ id, text, type, section }`
- Types: `IP_Transfer | NDA | Non_Compete | Termination | Liability | Arbitration | Data_Privacy | Payment | Auto_Renewal | Other`
- Validator: `validateParserOutput()` in `lib/agents/parser.ts`

### Agent 2 — Risk Analyzer
- Input: `ParsedClause[]`
- Output: `AnalyzedClause[]` — adds `{ severity, risk_summary, legal_reasoning, category_flags }`
- Severity: `HIGH | MEDIUM | LOW`
- Flags: `financial_risk | privacy_risk | employment_risk | ip_risk | freedom_risk`
- Validator: `validateAnalyzerOutput()` in `lib/agents/analyzer.ts`
- Legal anchors hard-coded in prompt (no invented statutes)

### Agent 3 — Advocate
- Input: HIGH clauses only (`AnalyzedClause[]`) + user role
- Output: `AdvocatedClause[]` — adds `{ what_it_costs_you, push_back, red_flag_label }`
- Role-aware: `buildAdvocatePrompt(userRole?)` injects situation context for employee / freelancer / founder / other
- Validator: `validateAdvocateOutput()` in `lib/agents/advocate.ts`

---

## Risk Score Formula

```ts
// lib/risk-score.ts
HIGH × 30 + MEDIUM × 10 + LOW × 2, capped at 100
```

Thresholds: `critical (≥70) | elevated (45–69) | moderate (20–44) | low (<20)`

---

## Type Hierarchy

```
ParsedClause
  └─ AnalyzedClause (+ severity, risk_summary, legal_reasoning, category_flags)
       └─ AdvocatedClause (+ what_it_costs_you, push_back, red_flag_label)
            = FinalClause (union alias used in dashboard)
```

Type guard: `isAdvocated(clause)` checks for `push_back` field presence.

---

## Key Features Shipped

### Split-Pane Contract View
- Left: original contract text with active clause highlighted
- Right: clause cards (red/yellow/green left border by severity)
- Click a card → highlights corresponding text in left pane + scrolls to it
- Whitespace-tolerant regex matching for clause text lookup
- Component: `components/tool/contract-pane.tsx`

### Staged Loading
1. "Extracting clauses..." (Agent 1)
2. "Analyzing risk..." (Agent 2)
3. "Building your defense..." (Agent 3)
4. Dashboard renders

### Plain-English Toggle
- Each clause card has "explain simply" / "show legal text" toggle
- Simple mode shows `risk_summary` (one plain sentence)
- Legal mode shows `legal_reasoning` (full legal analysis with statute citations)
- Component: `components/tool/clause-card.tsx`

### History Sidebar
- Tab UI: Analyze | History
- History tab fetches `/api/history?userId=email` from Firestore
- Shows filename, date, risk score per past analysis
- Click → re-opens full results in dashboard
- Backend: `lib/history.ts` + `app/api/history/route.ts`

### User Role Onboarding
- Collected at signup: employee / freelancer / founder / other
- Passed through: localStorage → UploadPanel → API body → `buildAdvocatePrompt(userRole)`
- Affects: Advocate Agent's prioritization and pushback language

### Firebase Firestore History
- Fire-and-forget save on every successful analysis (non-blocking)
- Stored per userId (email), with filename, score, timestamp, full clause array
- `lib/firebase.ts` — Admin SDK init with `FIREBASE_SERVICE_ACCOUNT_KEY` env var
- `lib/history.ts` — `saveAnalysis()` + `getUserHistory()`

---

## Test Suite (56 tests, 5 suites)

| File | What It Tests |
|------|---------------|
| `__tests__/risk-score.test.ts` | `computeRiskScore`, `countBySeverity`, `sortBySeverity`, `riskLevel` |
| `__tests__/types.test.ts` | `isAdvocated` type guard |
| `__tests__/agents-parser.test.ts` | `validateParserOutput` — 9 cases incl. edge cases |
| `__tests__/agents-analyzer.test.ts` | `validateAnalyzerOutput` — 11 cases |
| `__tests__/agents-advocate.test.ts` | `validateAdvocateOutput` + `buildAdvocatePrompt` — 14 cases |

Run: `npm test`

---

## Key File Map

```
lib/
  types.ts              — all TypeScript types + isAdvocated guard
  risk-score.ts         — computeRiskScore, countBySeverity, sortBySeverity, riskLevel
  firebase.ts           — Firebase Admin SDK init
  history.ts            — saveAnalysis(), getUserHistory()
  agents/
    parser.ts           — PARSER_SYSTEM_PROMPT + validateParserOutput()
    analyzer.ts         — ANALYZER_SYSTEM_PROMPT + validateAnalyzerOutput()
    advocate.ts         — buildAdvocatePrompt() + validateAdvocateOutput()

app/
  api/analyze/route.ts  — main analysis endpoint (calls all 3 agents)
  api/history/route.ts  — GET /api/history?userId=
  app/page.tsx          — main tool page (auth-gated)

components/tool/
  upload-panel.tsx      — text/PDF input + role passing
  dashboard.tsx         — clause card list + split-pane layout
  clause-card.tsx       — individual card with expand, toggle, active state
  contract-pane.tsx     — original text pane with highlight
  sidebar.tsx           — Analyze/History tabs

docs/test-contracts/    — 3 pre-baked test contracts for demo
```

---

## Google Cloud Services Used

| Service | Usage |
|---------|-------|
| **Google AI Studio / Gemini 2.5 Flash** | All 3 agent API calls |
| **Google Cloud Run** | Production deployment (containerised Next.js) |
| **Firebase Firestore** | Analysis history storage |
| **Firebase Admin SDK** | Server-side Firestore writes |

---

## Deferred (Not Built)

- [ ] Google Search grounding on HIGH clauses (limits latency — selective use)
- [ ] Situation selector wired to Advocate Agent (UI exists, not connected)
- [ ] Negotiation email drafts per clause
- [ ] "They said no →" fallback branching
- [ ] Firebase Functions proxy to hide API key in production
- [ ] Firebase App Hosting (requires Blaze billing plan)

---

## Anti-Hallucination Design

- Each agent receives **full clause text** (never summaries) to prevent context loss
- Agent 3 receives: original clause + full risk analysis from Agent 2 + user role
- Legal anchors hard-coded in system prompts — model is told to cite only from the list
- `legal_reasoning` field requires statute/doctrine citation or explicit "jurisdiction-dependent — consult local counsel"

---

## Original Planning Notes

> Original design called for: vanilla HTML/JS + Tailwind, Firebase Hosting, direct Gemini API from frontend.
> Actual build used: Next.js 16 App Router + TypeScript, Cloud Run, Firebase Admin SDK (server-side).
> The pipeline, agent prompts, risk score formula, and MOAT analysis from the original doc remain valid.
> See git history for the original `LEXGUARD_ARCHITECTURE.md` content.

### MOAT (from competitive research)
Every existing tool (Harvey, Spellbook, Ironclad, Kira, LegalOn) does summaries + risk scores.
No tool generates situation-aware pushback with real legal citations, ranked by user leverage, with ready-to-send negotiation language. That is the product gap LexGuard fills.

### Pitch Framework
- Open with story: "Last year, a friend signed a freelance contract. 6 months later the company owned everything she'd built — including her side projects."
- Demo within 90 seconds (use test-contracts/employment-aggressive.txt for reliable HIGH hits)
- Explain the Advocate Agent as the architectural differentiator
- Close: "What makes this different is it doesn't just flag risks — it tells you exactly what to say."
