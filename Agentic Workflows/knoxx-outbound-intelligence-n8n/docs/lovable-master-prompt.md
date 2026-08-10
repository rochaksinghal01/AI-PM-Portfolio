# Lovable master build prompt

Paste this prompt into Lovable as one request. It is intentionally explicit about the existing backend so Lovable does not create a second Supabase project.

---

Build and refine the frontend for **Knoxx Outbound Intelligence**, an evidence-backed account research, ingredient qualification and safe outreach application for food-ingredient sales teams.

## Non-negotiable backend rule

**Use the existing Supabase project only. Do not create, provision, connect, migrate, rename, fork or suggest a new Supabase project.**

- Existing project reference: `sbbqtvhyfdxywkanwldb`
- Existing project URL: `https://sbbqtvhyfdxywkanwldb.supabase.co`
- The repository already contains the schema, RLS policies, Edge Functions and React application.
- Before editing, inspect the existing files and preserve their architecture.
- If the Supabase integration wizard offers to create or connect another project, stop and continue by editing source code only.
- Never run generated schema migrations against a different project.

Use exactly these browser environment variables:

```text
VITE_SUPABASE_URL=https://sbbqtvhyfdxywkanwldb.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<the existing active publishable key>
VITE_DEMO_MODE=true
VITE_SAFE_TEST_EMAIL=rochak.singhal@gmail.com
```

The publishable key is the only backend key allowed in browser code. Never request, copy, log or expose a service-role key, database password, n8n secret, Gmail credential, Firecrawl key, Apollo key, OpenAI key, Gemini key, tracking signing secret or outreach-event secret. Never put secrets in React code, local storage, screenshots, console logs or the public repository.

## Existing runtime interfaces

Use `@supabase/supabase-js` and the authenticated user's session. All privileged writes go through these existing Edge Functions; do not call n8n webhooks from the browser.

### 1. Start account research

```text
POST /functions/v1/start-account-research
Authorization: Bearer <Supabase user access token>
Content-Type: application/json
```

Request:

```json
{
  "website_url": "https://snapfresh.com.au",
  "company_name": "Snapfresh",
  "notes": "Optional sales context"
}
```

Response (`202`):

```json
{
  "run_id": "uuid",
  "account_id": "uuid",
  "status": "queued | running | failed_partial"
}
```

The function canonicalizes the domain, checks aliases/existing accounts, creates an immutable run and starts WF01. Do not duplicate this logic in the client.

### 2. Approve a draft sequence

```text
POST /functions/v1/approve-sequence
Authorization: Bearer <Supabase user access token>
Content-Type: application/json
```

Request:

```json
{
  "sequence_id": "uuid",
  "approved": true,
  "messages": [
    { "id": "uuid", "subject": "Edited subject", "body": "Edited body" }
  ]
}
```

Only draft messages may be edited. The server verifies account ownership and calls the safe-send n8n webhook. The browser cannot choose the delivered recipient.

### 3. Record a manual demo event

```text
POST /functions/v1/outreach-event
Authorization: Bearer <Supabase user access token>
Content-Type: application/json
```

Request:

```json
{
  "account_id": "uuid",
  "contact_id": "optional uuid",
  "message_id": "optional uuid",
  "event_type": "cta_click | positive_reply | meeting_booked | manual_engaged | opportunity_created | negative_reply | negative_org_reply | unsubscribe | hard_bounce | out_of_office",
  "provider": "manual_demo",
  "idempotency_key": "stable unique string",
  "payload": {}
}
```

The Edge Function—not the UI—owns idempotency, intent changes, suppression and organization-wide stop rules.

### Public tracked CTA

The UI may render already-signed tracking URLs stored/returned by the server. It must never generate signatures. The `track` and `tracking-link` functions are server/n8n concerns, not ordinary browser actions.

## Existing data model and RLS

Do not change table names or invent a parallel schema. Use the current authenticated-user read policies.

- Account/run: `accounts`, `account_aliases`, `research_runs`
- Evidence: `research_sources`, `account_findings`, `dishes`, `recipe_ingredients`
- Opportunity: `knoxx_catalog_items`, `ingredient_matches`, `quantity_forecasts`, `qualification_rules`, `account_scores`
- Committee: `contacts`, `contact_rankings`, `historical_outcomes`
- Outreach: `outreach_sequences`, `outreach_messages`
- Engagement/safety: `engagement_events`, `suppression_entries`, `audit_log`
- Pipeline read model: `account_pipeline_public`

Every query must run with the logged-in user's Supabase session so existing RLS remains effective. Do not add client-side ownership filters as a substitute for RLS; UI filters are for presentation only.

## Required product experience

### Authentication

- Add a simple email/password or magic-link login using Supabase Auth.
- Do not show the account pipeline until a session exists.
- Show a clear sign-out action and authenticated-user identity.

### Pipeline home

- Cards for accounts researched, qualified accounts, estimated opportunity and active sequences.
- Account table with company/domain, latest score/tier, current stage, latest run status and update time.
- Make `failed_partial`, `review`, `suppressed` and `engaged` visually distinct.
- Subscribe or poll for run-stage changes; do not hold the original HTTP request open.

### New research run

- Require one website/domain; company name and notes are optional.
- Show a confirmation when the canonical domain already exists: “This account already exists. A new research run will be added to its history.”
- Call only `start-account-research`.
- On `202`, navigate immediately to the account/run progress view.
- Stages: accepted, queued, researching, evidence collected, scored, contacts enriched, draft ready, failed partial.

### Account intelligence report

- Overview: company, parent, segment, service-area fit and scale signals.
- Clearly label every finding as `observed`, `inferred` or `hypothesis`.
- Evidence tab: URL, source type, retrieval time, retained passage and source key.
- Dishes/products and ingredients must link back to evidence.
- Ingredient match: Knoxx item, match reason/confidence, formula inputs and low/base/high weekly/monthly/annual quantities.
- Show `insufficient_evidence` instead of zero or invented precision.
- Qualification: total, tier, each rubric component, risk penalty, reasons and rule version.

### Buying committee

- Rank 3–5 contacts by stored ranking; show title, persona, component scores, explanation, email status and activation eligibility.
- Clearly badge synthetic/demo contacts and synthetic history.
- Do not reveal a full real prospect email in the portfolio UI; mask it.
- The UI cannot enrich contacts or call Apollo directly.

### Outreach approval

- Show the four touches on days 0, 3, 7 and 12.
- Allow subject/body editing only while sequence/message status is `draft`.
- Display evidence/approved-claim context separately from the email body.
- Add a final confirmation modal explaining: human approval is recorded; demo delivery is forced to `SAFE_TEST_EMAIL`; intended recipient remains context only.
- Call only `approve-sequence` with `approved: true`.
- Never add a “send to intended recipient” switch.

### Engagement timeline

- Render click, reply, booking, bounce, opt-out and manual events chronologically.
- Explain that a raw click raises intent but does not stop outreach.
- Highlight that positive reply/meeting/opportunity pauses every other contact at the account.
- Let the reviewer simulate only `manual_demo` events through `outreach-event`.

## Visual direction

- Keep the existing high-quality React dashboard style: warm neutral canvas, navy text, restrained violet/green/amber status colors, generous whitespace and compact evidence cards.
- Optimize for an interview demo on a 1440px laptop; preserve responsive layouts for tablet.
- Use plain language and visible auditability, not generic “AI magic” styling.
- Add empty, loading, partial-failure and permission-error states for every data section.
- Preserve the existing fixture mode. When environment variables are absent, the app must remain safe and reproducible with visibly synthetic Snapfresh fixtures.

## Implementation constraints

- Preserve existing `frontend/src/lib/api.js`, deterministic engine functions and tests unless a change is required for the authenticated live-data path.
- Never calculate fit score or volume differently in the browser; display persisted server results.
- Never write directly to protected workflow tables from the browser.
- Never infer success merely because an Edge Function returned `202`; render the persisted run status.
- Do not add LinkedIn/WhatsApp automation, CRM sync, lookalike generation or real-prospect sending.

## Acceptance tests

1. Search the entire codebase: the only Supabase project reference is `sbbqtvhyfdxywkanwldb` and there is no second Supabase URL/config.
2. No service-role/provider secret appears in the browser bundle, source, logs or screenshots.
3. An unauthenticated user cannot read accounts or invoke protected start/approve actions.
4. Entering `snapfresh.com.au` calls `start-account-research` and returns a run ID without waiting for the crawl.
5. Re-entering the same domain shows existing-account context and creates a new run, not another account.
6. A partial crawl/run renders completed data plus a visible review/error state.
7. Evidence labels and source links are visible; missing quantity inputs render `insufficient_evidence`.
8. Draft editing is allowed; approval is explicit; there is no browser option to bypass the safe recipient.
9. A click raises intent without pausing; a positive reply or booking pauses the account sequence and other contacts after refresh.
10. The application builds successfully and existing unit/contract tests remain green.

At the end, provide a concise list of files changed, tests run and any missing environment/deployment value. Do not create or connect any new backend.

