# Knoxx Outbound Intelligence — next tasks

This is the handoff list to resume after WF01 is green.

## Workflow implementation

- [x] Complete WF01 production test: raw domain/URL normalization, existing-account handling, immutable research run, Supabase persistence and WF02 handoff.
- [x] Confirm WF01 reaches `running`/`researching` in the live database.
- [ ] Harden the live Firecrawl-to-research persistence path: the newest run remains `running`, the older run is `failed_partial`, and evidence/ingredient rows are empty.

## Task 1 — interview presentation

Create a Gamma-ready PPT outline and final presentation answering the four case-study questions. Completed as `docs/interview-deck-gamma.md` and `docs/Knoxx-Outbound-Intelligence-Interview.pptx`.

### 1. Architecture walkthrough

- Clean end-to-end diagram from raw domain to saved database rows and outreach events.
- Link to the editable Miro board.
- Explain Supabase, n8n, Firecrawl, AI agents, deterministic controls, Apollo, Gmail and tracking responsibilities.
- Show synchronous intake versus asynchronous research and the account/contact state machines.

### 2. Prompt engineering and model selection

- Teach the prompt structure: role, objective, context, evidence boundary, ordered procedure, tools, guardrails, expected schema, examples and final self-check.
- Show the Account Intelligence & Fit prompt and explain why evidence labels and deterministic scoring are separated.
- Include model selection at every stage: research/extraction, committee ranking, outreach drafting, reply classification and independent evaluation.
- Explain quality, latency, cost and fallback trade-offs.

### 3. Live data

- Add the live Lovable demo URL.
- Show real demo rows from accounts, research runs, findings, scores, contacts, sequences, messages and engagement events.
- Assess what was accurate, what was inferred, what remained a hypothesis and what requires sales validation.
- Demonstrate the positive-reply stop rule and safe-test recipient boundary.

### 4. Trade-offs and scaling

- Give a crisp, plain-language version of the README's 1,000-domain answer.
- Cover provider rate limits, crawl quality/staleness, LLM errors, Apollo credit consumption, throughput, retries and cost.
- Explain immediate acceptance with a run ID, durable queues, bounded workers, caching, idempotency, checkpoints, dead-letter review and observability.
- Include the measurable cost-per-qualified-account story rather than an invented cost promise.

### Discovery and assumptions slide

- State what the demo assumes about ICP, catalogue, service regions, demand formula, approved claims, personas and cadence.
- Show the questions each stage must answer: account identity, product need, ingredient opportunity, volume, supply feasibility, qualification, buying committee, messaging and stop conditions.
- Include the unanswered sales-discovery questions that must be resolved before production.

### Presentation inputs still needed

- [ ] Final Miro share URL (manual publication; connector unavailable).
- [x] Final Lovable URL: `https://knoxx-insight-quest.lovable.app`.
- [ ] Configure the production `VITE_SUPABASE_PUBLISHABLE_KEY`, republish and run an authenticated live-data smoke test; current deployment is fixture-only.
- [x] Deck uses Rochak Singhal and is optimized for a ten-minute walkthrough; adjust only if the actual interview format differs.
- [ ] Final screenshots after live frontend publication.
- [x] Publish the revised presentation at `https://docs.google.com/presentation/d/1rv1xUF5RiuSoF6CzxqHfBlhyvNNfFVDlW1JK5qAW9HM/edit`.

## Task 2 — Lovable implementation prompt

- [x] Write one detailed Lovable build prompt for the existing React/Supabase application.
- [x] Explicitly prohibit Lovable from creating or connecting a new Supabase project.
- [x] Require the existing project ref: `sbbqtvhyfdxywkanwldb`.
- [x] Use only the existing publishable browser key; never expose service-role, n8n, Gmail, Firecrawl, Apollo or model secrets.
- [x] Document every allowed frontend-to-Edge-Function interface and payload.
- [x] Route privileged actions through the existing Supabase Edge Functions.
- [x] Map the UI to the existing database schema, stages, RLS and safe-demo behaviour.
- [x] Include login, new/existing account warning, research progress, account report, evidence citations, score, contacts, draft approval and engagement timeline.
- [x] Include explicit acceptance tests that detect accidental creation of a second backend.
- [x] Deploy the previously missing `start-account-research` and `approve-sequence` Edge Functions to the existing Supabase project.

## Task 3 — interview knowledge guide

- [x] Create an end-to-end plain-language document explaining every node and decision in WF01, WF02, WF04, WF05 and WF06.
- [x] For each step, document input, action, output, failure behaviour, why it is AI or deterministic, model/provider choice and database tables affected.
- [x] Add an end-to-end example following one Snapfresh run.
- [x] Add common debugging checks for credentials, webhooks, Firecrawl polling, malformed structured output, Postgres persistence, safe sending and reply processing.
- [x] Add likely interview questions and concise model answers covering architecture, agent boundaries, evaluations, data quality, safety, compliance, observability, cost and scale.
- [x] Add a one-page interview cheat sheet and a ten-minute demo narration.
- [x] Add a concise interview-first reading guide and an independent CPO review with a controlled-pilot recommendation.

## Final portfolio handoff

- [x] Update README links to Miro-ready source, presentation and knowledge guide; leave manual publishing URL placeholders.
- [x] Generate polished architecture SVG/PNG; retain current product screenshots until live frontend publication.
- [x] Run the complete verification suite and record results in `TEST_REPORT.md` (40/40 tests, build and audit pass on 10 August 2026).
- [x] Review repository for credential patterns and real prospect data; the only real address intentionally retained is the user-owned safe demo inbox.
- [x] Add and deploy Supabase hardening: owner-only RLS helper, pinned function search path, explicit server-only audit/evaluation tables, high-value foreign-key indexes and statement-cached RLS identity checks.
- [ ] Enable Supabase leaked-password protection in Authentication settings (manual dashboard control).
- [ ] Commit on a feature branch and prepare a draft PR after review.
