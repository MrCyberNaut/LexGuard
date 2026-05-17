# LexGuard — AI Contract Intelligence

> Every contract is written by their lawyer. This is yours.

Built at **Google × Scaler PromptWars 2026** (Problem Statement 01).

---

## What it does

Upload any contract → 3 sequential AI agents tear it apart → red/yellow/green risk dashboard with exact pushback language for every high-risk clause.

---

## Routing

Single Next.js application. Marketing site and the tool are both here.

| Route | What it is |
| --- | --- |
| `/` | Landing page (marketing + waitlist) |
| `/app` | The LexGuard tool — upload, analysis, results |
| `/api/analyze` | POST — runs the 3-agent Gemini pipeline server-side |

### User flow

```text
/ (landing)
  └─ "Analyze a contract" →
       /app
         ├─ (no profile) → onboarding form (name/email/role) → localStorage
         └─ (has profile) → upload panel
               └─ POST /api/analyze
                     └─ results dashboard
```

---

## Project structure

```text
lexguard-landing/
├── app/
│   ├── page.tsx                  # / — landing page
│   ├── layout.tsx                # Root layout (fonts, metadata)
│   ├── globals.css               # Design tokens + typography system
│   ├── app/
│   │   ├── page.tsx              # /app — the tool (all view states)
│   │   └── layout.tsx            # Tool layout (full-height dark, no landing nav)
│   └── api/
│       └── analyze/
│           └── route.ts          # POST /api/analyze — 3-agent pipeline
│
├── components/
│   ├── hero.tsx                  # Landing sections
│   ├── problem.tsx
│   ├── how-it-works.tsx
│   ├── product-preview.tsx
│   ├── features.tsx
│   ├── cta.tsx
│   ├── testimonials.tsx
│   └── tool/
│       ├── sidebar.tsx           # Left sidebar (nav + user info)
│       ├── user-onboarding.tsx   # Name/email/role → localStorage
│       ├── upload-panel.tsx      # Paste text + PDF + analyze button
│       ├── loading-screen.tsx    # 3-agent progress (stage labels + bar)
│       ├── dashboard.tsx         # Results layout (summary + clause list)
│       ├── clause-card.tsx       # Clause card (expand/collapse, copy pushback)
│       └── risk-summary.tsx      # Top bar (score, counts, file name)
│
├── lib/
│   ├── types.ts                  # All shared TypeScript types
│   ├── gemini.ts                 # Gemini API client (server-only)
│   ├── risk-score.ts             # computeRiskScore, countBySeverity, sortBySeverity
│   ├── demo-data.ts              # Pre-baked Uber ToS analysis (10 clauses)
│   └── agents/
│       ├── parser.ts             # Agent 1: system prompt + validator
│       ├── analyzer.ts           # Agent 2: system prompt + validator
│       └── advocate.ts           # Agent 3: system prompt + validator
│
├── public/
│   └── hero-justice.png
│
├── .env.local                    # GEMINI_API_KEY (server-only, never in bundle)
└── package.json
```

---

## Design system

Tokens live in `app/globals.css`. Never hardcode hex values in components — use CSS variables.

### Colors

| Token | Value | Use |
| --- | --- | --- |
| `--ink` | `#0e0e0e` | Primary text (light sections) |
| `--ink-3` | `#6b6b6b` | Captions |
| `--ink-4` | `#9b9b9b` | Mono labels |
| `--paper` | `#f5f4f0` | Landing bg / primary text on dark |
| `--paper-2` | `#edece8` | Secondary text on dark |
| `--paper-3` | `#e2e0d9` | Tertiary on dark |
| `--void` | `#080808` | Tool main bg |
| `--void-2` | `#111110` | Sidebar / raised surfaces |
| `--void-3` | `#1c1c1a` | Cards in dark sections |
| `--accent` | `#5b48e8` | Primary action |
| `--accent-2` | `#7c6cf0` | Hover |
| `--risk-red` | `#d93a2b` | HIGH severity |
| `--risk-amber` | `#c47a16` | MEDIUM severity |
| `--risk-green` | `#1a7a4a` | LOW severity |

### Typography classes (from globals.css)

| Class | Description |
| --- | --- |
| `.heading-1` | Space Grotesk 700, 36–60px clamp |
| `.heading-2` | Space Grotesk 700, 28–40px clamp |
| `.heading-3` | Space Grotesk 700, 20px |
| `.body-large` | Inter 400, 16px |
| `.body-base` | Inter 400, 14px |
| `.body-small` | Inter 400, 13px |
| `.mono-label` | Mono 10px, uppercase, letter-spacing |
| `.mono-code` | Mono 12px, for clause text / code |
| `.section-idx` | Mono 11px, e.g. `[1/3] — Upload` |
| `.tag` | Mono 11px, 1px border, 2px radius |

### Backgrounds

- `.grid-bg` — blueprint grid for light (paper) sections
- `.grid-bg-dark` — same for dark (void) sections

---

## Agent pipeline

All agents run server-side. API key never reaches the client.

```text
POST /api/analyze
  { text?: string, pdfBase64?: string }

  → Agent 1 (Parser)    ParsedClause[]
  → Agent 2 (Analyzer)  AnalyzedClause[]      + severity, risk_summary, legal_reasoning
  → Agent 3 (Advocate)  AdvocatedClause[]     HIGH only: + what_it_costs_you, push_back, red_flag_label

  returns { clauses, riskScore, counts }
```

Output validation runs after each agent (`lib/agents/*.ts`). Malformed JSON → 500 with the specific error.

---

## Environment variables

```bash
# .env.local
GEMINI_API_KEY=AIza...              # Required — aistudio.google.com → Get API Key
NEXT_PUBLIC_SUPABASE_URL=...        # Optional — waitlist only
NEXT_PUBLIC_SUPABASE_ANON_KEY=...   # Optional — waitlist only
```

`GEMINI_API_KEY` is **server-only**. It is never included in the client bundle.

---

## Getting started

```bash
cd lexguard-landing
npm install
# add GEMINI_API_KEY to .env.local
npm run dev
```

- Landing: `http://localhost:3000`
- Tool: `http://localhost:3000/app`
- API: `POST http://localhost:3000/api/analyze`

---

## Deploy (Vercel)

```bash
vercel --prod
```

Set in Vercel dashboard:

- `GEMINI_API_KEY`
- `NEXT_PUBLIC_SUPABASE_URL` (if using waitlist)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (if using waitlist)

---

## Stack

- Next.js 16 (App Router) + React 19
- TypeScript strict
- Tailwind CSS v4 (PostCSS, no config file needed)
- Framer Motion 12 (landing animations)
- Gemini 2.5 Flash (Google AI Studio)
- Supabase (waitlist, optional)
- Lucide React (icons)
