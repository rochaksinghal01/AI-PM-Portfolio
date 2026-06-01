# ConsultFlow AI — Agentic Consulting Deck Automation

> An end-to-end AI system that automates the consulting analyst lifecycle — from client discovery through research, QA, storyline generation, and Google Slides delivery.

**🔗 Live Demo:** [tanstack-start-app.rochak-singhal.workers.dev](https://tanstack-start-app.rochak-singhal.workers.dev)

---

## What It Does

Consulting analysts spend 60–70% of their time on repetitive work: research, structuring narratives, formatting decks. ConsultFlow AI replaces that with a 5-gate agentic pipeline where the AI does the heavy lifting and the analyst retains approval control at every stage.

Submit a client brief → AI researches → AI writes QA → AI generates storyline → Google Slides deck delivered to Drive. Every output is scored automatically for quality before it reaches the analyst.

---

## The 5-Gate Pipeline

```
[Gate 1] Discovery & Requirements
        ↓  Analyst fills in: client name, deck type, engagement goal
[Gate 2] AI Research Agent
        ↓  Gemini generates: market context, key findings, recommendations, risks
        ↓  Analyst reviews → Approve or Request Revision
[Gate 3] QA Review
        ↓  Gemini self-audits the research for gaps, accuracy, completeness
        ↓  Analyst reviews → Approve or Request Revision
[Gate 4] Storyline Generation
        ↓  Gemini creates SCR narrative with slide-by-slide structure
        ↓  Analyst reviews → Approve or Request Revision
[Gate 5] Google Slides Delivery
        ↓  Approved storyline → formatted deck created via Google Slides API
        ↓  Delivered directly to Google Drive
```

Each gate writes its output to Supabase. The frontend polls for status changes and auto-switches tabs as each stage completes.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | TanStack Start (SSR) on Cloudflare Workers |
| Database & Auth | Supabase (PostgreSQL + Row Level Security) |
| AI Model | Google Gemini 2.5 Flash |
| Automation | n8n (self-hosted on Railway) |
| Deck Output | Google Slides API + QuickChart.io |
| Eval Storage | Supabase `eval_logs` table |

---

## Eval System — What We Measure and Why

Every AI-generated output is scored automatically after each gate. This runs in parallel (non-blocking) so it never slows down the pipeline.

### Metrics per stage

| Metric | What it measures |
|---|---|
| **Score (0–10)** | Overall quality of the output |
| **Completeness** | Did the AI cover all required sections? (market context, findings, recommendations, risks) |
| **Groundedness** | Are claims supported by sources and business context? |
| **Latency (ms)** | How long the AI took to generate the output |
| **Pass/Fail** | Score ≥ 7 = pass. Below threshold = flagged for review |

### Why this matters

In agentic systems you can't manually review every output. The eval layer gives:

1. **Confidence** — consistent quality across all engagements, not just the ones you check
2. **Visibility** — which stages underperform so you can fix the prompt, not guess
3. **Auditability** — a full log of every AI decision and its quality score
4. **Improvement loop** — eval trends over time show whether prompt changes actually helped

The `/evals` dashboard surfaces this in real time — per-engagement score rings, pass rates, and expandable judge reasoning for every gate.

---

## Agentic Architecture

```
Frontend (TanStack/Cloudflare)
        │
        ├─ POST /webhook/discovery  ──→  n8n WF01
        ├─ GET  /engagements        ←──  Supabase polling
        └─ POST approve/decline     ──→  n8n WF02–05

n8n Workflow chain:
WF01 Discovery → writes requirements_json to Supabase
WF02 Research  → Gemini prompt → writes research_brief → triggers WF03
WF03 Storyline → Gemini prompt → writes storyline_json → triggers WF05 on approval
WF04 QA        → Gemini self-audit → writes quality_report
WF05 Delivery  → Google Slides API → creates deck → writes Google Drive link

Parallel eval branch on WF02, WF03, WF04:
Each workflow → [Update Supabase] + [Eval Score Node → Insert eval_logs]
```

---

## n8n Workflows

The `/n8n-workflows` folder contains all 6 workflow JSON files — importable directly into any n8n instance:

| File | Purpose |
|---|---|
| `wf00-rag.json` | RAG context retrieval (client knowledge base) |
| `wf01-discovery.json` | Intake form → requirements stored in Supabase |
| `wf02-research.json` | AI research agent + eval scoring |
| `wf03-storyline.json` | Storyline generator + eval scoring |
| `wf04-qa.json` | QA self-audit + eval scoring |
| `wf05-google-slide.json` | Google Slides deck creation and delivery |

---

## Key Product Decisions

**Why human-in-the-loop gates?**
Consulting outputs need to be defensible. An analyst approving each stage means the AI accelerates the work without removing accountability.

**Why heuristic evals over LLM-as-judge?**
For a demo-stage system: faster, free, and deterministic. LLM judge is the next iteration once the baseline is established.

**Why n8n over direct API calls?**
Visual workflow editor makes the agentic logic inspectable and modifiable without code changes. Each node is an observable unit — easier to debug and demo.

**Why Supabase over a custom backend?**
Auth, database, RLS, and real-time subscriptions in one hosted service. Lets the frontend stay thin and stateless on Cloudflare Workers.

---

## Post-Demo Roadmap

- [ ] Google OAuth — per-user Drive access so decks land in each user's own folder
- [ ] RAG pipeline — users upload client docs, past decks, brand guidelines as AI context
- [ ] Supabase Edge Functions — replace n8n with serverless functions
- [ ] LLM-as-judge evals — Gemini grading Gemini with structured rubrics
- [ ] Multi-tenant RLS — each user sees only their own engagements
- [ ] Hallucination detection and adversarial input testing

---

## Screenshots

> *(Add screenshots here after capturing: Dashboard, Research tab, Evals dashboard, Google Slide output)*

---

## Built By

**Rochak Singhal** — AI Product Manager  
[LinkedIn](https://linkedin.com/in/rochak-singhal) · [Portfolio](https://github.com/rochaksinghal01/AI-PM-Portfolio)
