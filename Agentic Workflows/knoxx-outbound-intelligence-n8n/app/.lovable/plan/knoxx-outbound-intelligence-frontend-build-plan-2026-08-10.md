# Knoxx Outbound Intelligence — Frontend Build Plan

This project is an empty TanStack Start starter. Nothing from the described repo (schema, Edge Functions, `frontend/src/lib/api.js`, fixtures) exists here — verified by listing the tree and searching for "supabase" (zero matches). So this is a fresh frontend build against your **existing** Supabase project.

## Backend rule compliance

- Lovable Cloud stays **off**. No project is created, connected, migrated or forked.
- One hand-written client in `src/integrations/supabase/client.ts` reads `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`, pointing only at `sbbqtvhyfdxywkanwldb`.
- No migrations, no SQL, no table creation. All reads go through the logged-in session so your existing RLS applies. All privileged writes go through your three Edge Functions.
- Browser bundle carries the publishable key only. No service-role or provider secret anywhere.
- Needed from you: the publishable key for `sbbqtvhyfdxywkanwldb` (paste it and I'll put it in `.env` alongside `VITE_DEMO_MODE=true` and `VITE_SAFE_TEST_EMAIL=rochak.singhal@gmail.com`).

## What gets built

**Data layer** (`src/lib/api.ts`)
- Typed read helpers for the named tables only: `accounts`, `account_aliases`, `research_runs`, `research_sources`, `account_findings`, `dishes`, `recipe_ingredients`, `knoxx_catalog_items`, `ingredient_matches`, `quantity_forecasts`, `qualification_rules`, `account_scores`, `contacts`, `contact_rankings`, `historical_outcomes`, `outreach_sequences`, `outreach_messages`, `engagement_events`, `suppression_entries`, `audit_log`, `account_pipeline_public`.
- Three function invocations: `start-account-research`, `approve-sequence`, `outreach-event`, each with the user's bearer token.
- No scoring, no volume math, no signature generation in the browser — persisted server values are displayed verbatim.
- `src/lib/fixtures.ts`: visibly synthetic Snapfresh dataset used when env vars are missing or `VITE_DEMO_MODE` fixture fallback applies. Same shape as live data, badged "SYNTHETIC" in the UI.

**Routes**
- `/auth` — email/password + magic link via Supabase Auth (public).
- `/` — pipeline home: four KPI cards (accounts researched, qualified, estimated opportunity, active sequences) and the account table (company/domain, score/tier, stage, latest run status, updated). Distinct treatments for `failed_partial`, `review`, `suppressed`, `engaged`. Realtime subscription on `research_runs` with a polling fallback.
- `/research/new` — domain required, name/notes optional; pre-check on `account_aliases`/`accounts` shows "This account already exists. A new research run will be added to its history."; on `202` navigates straight to the run view.
- `/accounts/$accountId` — tabbed report: Overview, Evidence, Dishes & Ingredients, Ingredient Match, Qualification, Committee, Outreach, Timeline.
- `/accounts/$accountId/runs/$runId` — stage tracker: accepted → queued → researching → evidence collected → scored → contacts enriched → draft ready → failed partial; renders persisted status, never assumes success from `202`.

**Report details**
- Every finding carries an `observed` / `inferred` / `hypothesis` badge.
- Evidence rows: URL, source type, retrieval time, retained passage, source key. Dishes and ingredients link back to their evidence row.
- Ingredient match: Knoxx item, reason/confidence, formula inputs, low/base/high across weekly/monthly/annual. Missing inputs render `insufficient_evidence`, never 0.
- Qualification: total, tier, per-rubric components, risk penalty, reasons, rule version.

**Committee**
- 3–5 contacts ordered by `contact_rankings`; title, persona, component scores, explanation, email status, activation eligibility. Synthetic contacts and synthetic history badged. Real emails masked (`r••••@d•••.com`). No enrichment controls.

**Outreach approval**
- Four touches on days 0/3/7/12. Subject/body editable only while status is `draft`. Evidence/approved-claim panel sits beside, not inside, the body.
- Confirmation modal states: human approval is recorded; demo delivery is forced to the safe test address; intended recipient is context only. Calls `approve-sequence` with `approved: true`. No recipient override exists anywhere in the UI.

**Engagement timeline**
- Chronological clicks, replies, bookings, bounces, opt-outs, manual events, with plain-language notes: a click raises intent but does not stop outreach; a positive reply / meeting / opportunity pauses every other contact at the account.
- Simulator restricted to `provider: "manual_demo"` with a stable idempotency key.

**States and visuals**
- Every data section ships empty, loading (skeleton), partial-failure and permission-error states.
- Warm neutral canvas, navy text, restrained violet/green/amber status tokens, generous whitespace, compact evidence cards — all as semantic tokens in `src/styles.css`. Tuned for 1440px, responsive down to tablet.

## Technical notes

- Reads use TanStack Query with route loaders priming the cache; nothing blocks on the crawl.
- Auth gate via a `_authenticated` layout; the pipeline is unreachable without a session. Header shows the signed-in email and a sign-out action.
- Because the backend is external (not Lovable Cloud), server-side helpers and generated types are unavailable — the client runs browser-side with the publishable key under your RLS, which is the intended model here.
- No test suite exists to preserve; I'll add contract tests for `api.ts` request shapes (URL, headers, body) plus the `insufficient_evidence` and masking helpers, run with vitest.
- I'll close with the file list, test results, and any env value still missing.

## Out of scope, explicitly

No new Supabase project, no migrations, no n8n calls from the browser, no signature generation, no LinkedIn/WhatsApp automation, no CRM sync, no lookalike generation, no real-prospect sending.
