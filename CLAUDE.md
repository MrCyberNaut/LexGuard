# CLAUDE.md — Google x Scaler PromptWars

## Project Context

Arnav is competing **solo** in the **Google x Scaler PromptWars** hackathon on **2026-05-18** (10am–7pm, 9 hours).

- **Format:** Secret challenge revealed on-site. 2-3 hours to build. Live demo to panel of judges. Winners announced same day.
- **Tool:** Google Antigravity or Google AI Studio
- **Design tool:** Google Stitch (stitch.withgoogle.com)
- **Organizer:** Google for Developers × Hack2Skill

---

## Judging Criteria

1. How well the solution solves the problem
2. Quality and elegance of AI prompts (architectural elegance)
3. Live pitch

---

## What You Know Going In

### Winning Formula (from 12+ real AI hackathon winners)

- **Reframe first.** Don't just solve the prompt — find the real problem underneath.
- **Demo-first.** Sketch the "wow" moment before writing a single prompt. Build toward it.
- **One sentence pain.** Every winner's problem fits one sentence that makes people nod.
- **Pipeline architecture.** Sequential agents, one job each, clean handoffs. No monolith prompt.
- **Verifiable metric.** 100% accuracy, N tests shipped, N languages. Not "powerful AI."
- **Domain depth > generalist breadth.** Know the user's world. Your prompts will be richer.

### On-Day Workflow

**10:00–10:30** — Read challenge → write 3 reframings → pick sharpest  
**10:30–11:30** — Architecture + planner agent, system prompts drafted  
**11:30–14:30** — Core build, happy path end-to-end first  
**14:30–15:00** — Step back, cut dead weight  
**15:00–17:00** — Polish, edge cases, "wow" layer  
**17:00–18:00** — Pitch prep, 3-min script  
**18:00–19:00** — Buffer + final dry run  

**Rule:** Decide MVP by 11:30. No new features after 15:00 — only polish.

### First 10 Minutes After Challenge Reveal

1. Read → write 3 reframings of the problem
2. Pick highest impact × simplest demo
3. Sketch demo moment before first prompt
4. Break into 2-3 agent roles
5. Start Antigravity with planner → review plan → execute

### Antigravity Prompting Pattern

```
You are a [role] agent.
Your task is [specific job].
You receive [input format].
You output [structured format].
Constraints: [list real constraints].
```

Multi-agent split: **planner → builder → validator**

### Google Stitch (UI Design)

Use before Antigravity. Prompt formula: `[what + who] + [optional reference] + [layout + vibe]`

Vibe descriptors that work: "Clean minimal" / "Enterprise dark mode like Linear" / "Warm consumer-grade like Duolingo" / "Data-dense like Bloomberg but modern"

Export HTML/Tailwind → paste into Antigravity for wiring.

### 3-Min Pitch

1. Open with problem as a **story** (not a stat)
2. Demo within **90 seconds**
3. Explain one **elegant prompt/architectural choice**
4. Close: "What makes this different is X — here's why it matters for [real use case]"

---

## LexGuard — Active Build (Problem Statement 01)

### What We're Building
AI contract intelligence platform. Upload contract → 3-agent pipeline → source-backed risk dashboard with negotiation scripts.

**Tagline:** "Every contract is written by their lawyer. This is yours."

### Problem Statement Alignment
- Clause extraction + classification ✓
- Severity-based risk scoring ✓
- Explainable AI insights (citations required) ✓
- Adversarial legal reasoning (Advocate Agent) ✓
- Compare against legal/industry standards (grounded search) ✓

### Critical Rule: No Hallucinated Legal Claims
Every pushback statement MUST cite a real source:
- Actual law name + section (e.g., California Labor Code §925)
- Real regulation (FTC non-compete guidance, GDPR Article 6, NLRA §7)
- Use Gemini's grounding with Google Search — it returns cited URLs
- Never generate legal claims without a grounded source
- The `legal_basis` field in every HIGH clause response is MANDATORY

### Architecture (Locked)
3 sequential agents via Gemini 2.5 Flash:
1. **Parser Agent** — extracts + classifies clauses into JSON
2. **Risk Analyzer Agent** — severity scores with legal reasoning + source citations
3. **Advocate Agent** — situation-aware pushback + ready-to-send email + fallback position

### Anti-Hallucination Strategy
- Each agent receives FULL clause text (not summaries) — no context loss
- Advocate Agent receives: original clause + risk analysis + user situation
- Gemini grounding with Google Search enabled on Risk Analyzer + Advocate
- `legal_basis` field required: cites specific law/regulation supporting each claim
- Situation selector (first-job employee / senior / freelancer / vendor) anchors advice to user reality

### MOAT
No existing tool (Harvey, Spellbook, Ironclad, Kira, LegalOn) generates:
- Source-backed pushback with real legal citations
- Situation-aware priority ranking (first-job vs senior vs freelancer)
- Ready-to-send negotiation email per clause
- "They said no →" fallback position

### Git + Deployment
- Repo: `d:\Projects\hackathon\google_sclaer_promptwars` (git init done, `main` branch only)
- Deploy: Firebase hosting (free tier)
- Budget: ~$5 GCP credits available for Cloud Run if needed
- Single branch: `main` — this is the submission branch

### Key Files
- `LEXGUARD_ARCHITECTURE.md` — full system prompts + Antigravity brief + Stitch UI prompt
- `hack_recon_v2.html` — Hackathon intel bot
- `CLAUDE.md` — This file

### Obsidian Log
`D:/Obsidian/AI-Memory/Sessions/promptwars-eve-prep-live.md`

---

## Rules for Claude in This Project

- Arnav is **solo**. All suggestions must be executable by one person in the time available.
- **Scope aggressively small.** One thing done brilliantly > ambitious half-broken project.
- **Never generate hallucinated legal claims.** Always tie to real law, regulation, or standard.
- Arnav explicitly asked to be corrected with proof and logic — do this freely and confidently.
- Default to Google-stack tools: Antigravity, AI Studio, Stitch, Gemini, Firebase, Cloud Run.
- Keep responses concise — he's time-pressured.
- All features must map back to the Problem Statement 01 evaluation criteria.
