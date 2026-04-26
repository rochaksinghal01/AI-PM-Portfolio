# LLMOps Dashboard — Full-Stack Production Build (Claude Code)

## What This Prompt Does
Generates a production-ready, full-stack LLMOps observability system — including a middleware proxy layer, metrics engine, database schema, and multi-audience dashboard UI. Tracks and visualises LLM usage, quality, and cost metrics in real time for any OpenAI or Gemini-powered application. Architecture is provider-agnostic and extensible.

## When to Use
- Building internal AI observability tooling for your product
- Adding LLMOps monitoring to an existing LLM-powered application
- Demonstrating AI engineering depth in a technical interview or case study
- Creating a reusable middleware layer before choosing a vendor (Langfuse, Helicone, etc.)
- Hackathons or internal tools sprints where you need a working dashboard fast

## Inputs Required
The generated system will ask the user for:
1. Application name, use case, and industry/domain
2. LLM Provider API key (OpenAI or Gemini)

**Tech Stack Used:** Python (FastAPI) · React + Recharts · PostgreSQL/SQLite · Async workers · Official LLM provider SDKs

---

## Prompt

```
You are a senior LLM platform engineer and product architect.

Your task is to design and generate a production-ready Live LLMOps Dashboard that works for any LLM-powered application.

---

1. GOAL

Build a web-based LLMOps observability dashboard that automatically tracks and visualises LLM usage and quality metrics in real time.

The dashboard must serve three audiences simultaneously:
1. Product Managers
2. Business / Leadership
3. Technical / Data Science teams

---

2. USER INPUTS (MINIMAL SETUP)

The system should ask the user only for:

A. Application context:
   - App name
   - Use case (chatbot, search, agent, summarization, etc.)
   - Industry/domain

B. LLM Provider API key:
   - OpenAI (ChatGPT)
   - Google Gemini
   - Design in a provider-agnostic way — new providers should be addable without major refactoring

---

3. API KEY VALIDATION (MANDATORY)

Before enabling the dashboard:
- Validate the API key by making a lightweight test call to the provider
- Clearly show one of:
  - ✅ Valid & connected
  - ❌ Invalid / quota exceeded / permission error
- Block dashboard activation entirely if validation fails

---

4. ARCHITECTURE (MUST BE IMPLEMENTED)

Generate the full system with these components:

A. LLM MIDDLEWARE LAYER
Acts as a transparent proxy between the user's application and the LLM provider.
Intercepts and logs every request and response.

Captures per request:
- Prompt text
- Response text
- Token counts (input tokens, output tokens)
- Latency (ms)
- Model name
- Temperature and other params
- Timestamp
- User ID / session ID (if available)

B. METRICS ENGINE
Compute all metrics automatically from the logged data:

Core Metrics (all personas):
- Response time: P50, P95
- Token usage (input vs. output)
- Cost estimation (using provider pricing tables)
- Error rate

Product Metrics:
- Prompt intent clusters (group similar prompts)
- Top user questions (by frequency)
- Sample prompts and outputs
- Drop-off patterns (sessions that end abruptly)
- Regeneration rate (% of responses where user re-prompts immediately)

Quality Metrics (proxy-based — be transparent about methodology):
- Hallucination rate (heuristics):
  - Self-consistency checks (ask same question multiple times, compare)
  - Retrieval overlap (for RAG applications)
  - Rule-based factual checks
- Accuracy (when ground truth is available)
- Confidence score (logprob-based where available, or proxy method)
- Toxicity / safety flags

Business Metrics:
- Cost per query
- Cost per user/session
- Daily and monthly spend
- Model cost comparison (if multiple models in use)
- ROI proxy (usage volume vs. success signal events)

C. DATABASE SCHEMA
Design a clean schema covering:
- requests table (all per-request fields above)
- sessions table
- metrics_computed table (aggregated metrics with timestamp)
- quality_scores table
- cost_log table

D. DASHBOARD UI
Three clearly separated audience views:

Product Manager View:
- Top prompts (table, sortable)
- Sample LLM outputs (expandable)
- Hallucination trend (line chart)
- Accuracy trend (line chart)
- Feature-level usage breakdown

Business View:
- Spend over time (area chart)
- Cost per request (KPI card + trend)
- Model-wise cost split (pie chart)
- Usage growth (line chart)
- Anomaly alerts (if spend spikes)

Technical / DS View:
- Latency percentiles P50/P95/P99 (bar chart)
- Token distribution (histogram)
- Error logs (filterable table)
- Prompt diffs (side-by-side comparison)
- Raw traces (full request/response log)

---

5. LIVE AUTO-POPULATION

Metrics must auto-update as users send prompts through the middleware:
- No manual refresh required
- Support streaming responses (chunk-level logging)
- Near real-time updates with <5 second lag
- Use websockets or server-sent events for live chart updates

---

6. TECH STACK

Unless I specify otherwise, use:
- Backend: Python (FastAPI)
- Frontend: React + Recharts (or Chart.js)
- Database: PostgreSQL (primary) / SQLite (dev/local)
- Background jobs: Async workers (FastAPI background tasks or Celery)
- LLM SDKs: Official provider SDKs (openai, google-generativeai)
- Ensure all provider-specific logic is behind a clean abstract interface

---

7. DELIVERABLES

Generate:
1. High-level architecture diagram (textual/ASCII)
2. Database schema (SQL DDL)
3. Middleware proxy logic (complete, working code)
4. Metric computation logic (functions + formulas)
5. Dashboard UI layout (React components or wireframe)
6. Instructions to run locally (step-by-step)
7. Extensibility notes — how to add a new LLM provider or a new metric

---

8. CONSTRAINTS

- No hard-coding for a single model or provider
- Clean separation of concerns (middleware / metrics / UI are independent layers)
- Production-ready code quality — typed, documented at function level, error-handled
- Secure handling of API keys (environment variables, never logged or exposed in UI)
- All proxy/heuristic metrics must be clearly explained — no silent magic
```

---

## Architecture Overview

```
User Application
      │
      ▼
┌─────────────────────┐
│  LLM Middleware      │  ← Proxy layer: logs every request/response
│  (FastAPI)           │
└────────┬────────────┘
         │ logs to DB           │ proxies to LLM
         ▼                      ▼
┌────────────────┐    ┌──────────────────┐
│  PostgreSQL     │    │  OpenAI / Gemini  │
│  (requests,     │    │  (actual LLM API) │
│   metrics,      │    └──────────────────┘
│   cost_log)     │
└────────┬────────┘
         │
         ▼
┌─────────────────────┐
│  Metrics Engine      │  ← Computes P50/P95, cost, hallucination proxy
│  (async workers)     │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│  React Dashboard     │  ← PM / Business / Engineering views
│  (live via SSE)      │
└─────────────────────┘
```

---

## Key Metrics by Audience

| Metric | PM | Business | Engineering |
|---|---|---|---|
| Top prompts | ✅ | — | — |
| Hallucination trend | ✅ | — | ✅ |
| Spend over time | — | ✅ | — |
| Cost per query | — | ✅ | ✅ |
| P95 latency | — | — | ✅ |
| Token distribution | ✅ | ✅ | ✅ |
| Error rate | — | ✅ | ✅ |
| Raw traces | — | — | ✅ |

---

## Tips
- Run this prompt in **Claude Code** — it generates complete, runnable files, not just scaffolding.
- Start with **SQLite** locally, then swap to PostgreSQL for any shared or hosted deployment.
- The **middleware proxy** is the most valuable output — once it's running, all metrics flow automatically.
- Add a **cost alert webhook** (e.g., to Slack) as a first extension — it's the metric leadership cares most about.
- For RAG applications, add a `retrieved_chunks` field to the requests table to enable retrieval overlap scoring.
