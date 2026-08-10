# Knoxx Outbound Intelligence — workflow and interview guide

This document is the plain-language explanation of the complete system. Use it to prepare for the interview, debug the demo and answer architecture questions without reading raw workflow JSON.

## The thirty-second explanation

A salesperson submits one company domain. The system reuses the account if it already exists, creates a new immutable research run, gathers public website/PDF evidence, asks a bounded AI agent to interpret that evidence, and uses deterministic code to estimate ingredient demand and score the account. If the account is viable, it searches and enriches a small buying committee, ranks the contacts, drafts a four-touch sequence and waits for human approval. Demo mode forces every email to an owned test inbox. Clicks raise intent; a positive reply or booking pauses every other contact at the organization.

The architecture is deliberately hybrid:

- **AI interprets ambiguous language:** dishes, scale signals, title relevance, pain hypotheses and message framing.
- **Code owns facts that must be reproducible:** domains, formulas, weighted scores, approval, recipient, schedule, suppression, idempotency and stage transitions.

## End-to-end data flow

```text
React/Lovable
  → Supabase start-account-research
  → WF01 intake
  → WF02 evidence + fit
  → WF04 buying committee
  → WF05 draft + approval + safe Gmail
  → WF06 engagement + stop rules
  → Supabase/Postgres
  → React/Lovable report and pipeline
```

Each workflow has a production branch. WF02, WF04, WF05 and WF06 also have an evaluation branch using frozen fixtures, so prompt/model changes can be tested without spending retrieval or enrichment credits.

---

# WF01 — Account Intake Orchestrator

## Purpose

Turn an untrusted website input into one canonical account and one new research run, then hand the run to WF02.

| Node | Input | What it does | Output / database | Failure behaviour | Why this design |
|---|---|---|---|---|---|
| Account Research Webhook | `run_id`, `account_id`, website, domain, notes and `X-Workflow-Secret` from the Edge Function | Receives the already-created run. This webhook is not exposed directly to the browser. | One n8n item | Missing/incorrect secret is rejected in the next node | Edge Function handles the authenticated user; n8n handles orchestration credentials. |
| Validate & Canonicalize | Webhook body/headers | Checks required UUIDs and secret, accepts domain or HTTP(S) input, removes `www`, tracking parameters and unsafe URL forms. | Canonical `website_url`, `domain`, metadata | Invalid URL/domain/secret stops before writes | Identity is deterministic. An LLM must never decide whether two domains are the same account. |
| Mark Run Running | Canonical account/run | Updates the existing `research_runs` row to `running`, stores start time/provider version and sets account stage to `researching`. | Updated run/account | Postgres error stops handoff; run remains inspectable | The state is persisted before expensive provider work. |
| Start Evidence & Fit | Validated payload | POSTs the run to the private WF02 production webhook. | WF02 accepted/returned payload | HTTP failure is allowed through so WF01 can return a partial status | A downstream failure does not erase the accepted account/run. |
| Return Intake Status | WF02 response or error + first validated item | Returns `run_id`, `account_id`, `researching` or `failed_partial`, and next workflow. | API-readable status | Uses `.first()` rather than paired `.item`, avoiding n8n item-link ambiguity | Intake returns a stable contract even when an HTTP node changes item lineage. |

## Existing-account behaviour

The authenticated Edge Function performs the initial account lookup before WF01:

1. Normalize the domain.
2. Check `account_aliases`.
3. Check `accounts.canonical_domain`.
4. Confirm the account belongs to the authenticated user/workspace.
5. Reuse the account or create it.
6. Always insert a new `research_run`.

That means “existing account” is not a failure. The UI should show previous owner/runs/outcomes and then add the new run to the history.

---

# WF02 — Account Intelligence & Fit Agent

## Purpose

Gather evidence, interpret the company’s food/product needs, map possible Knoxx ingredients, estimate ranges and make an explainable qualification recommendation.

## Retrieval and input path

| Node | Simple explanation | Output / failure |
|---|---|---|
| Production Webhook | Receives one company/run from WF01. | Production item. |
| Evaluation Trigger | Runs a saved case from `evaluation-data/account-research.csv`. It deliberately bypasses Firecrawl. | Repeatable test item with expected tier/claims. |
| Validate Production Input | Checks IDs, website and secret, and marks `evaluation_mode=false`. | Stops bad payloads before provider cost. |
| Build Evaluation Evidence | Turns the frozen evaluation row into the same evidence shape used in production. | Agent cannot tell whether evidence came from a live crawl or fixture. |
| Firecrawl Website & PDFs | Submits an asynchronous crawl with bounded pages/depth and PDF parsing. | Returns job ID; 401 is credential, 429 is rate/concurrency, 5xx is transient. |
| Capture Crawl Job | Retains job ID, attempt count and original run context. | A missing job ID becomes a bounded partial-crawl error. |
| Crawl Started? | Branches based on whether a usable job was accepted. | Failed starts can still produce `failed_partial`. |
| Wait Before Crawl Poll | Pauses briefly before status polling. | Avoids hammering Firecrawl. Production scale should use queue/webhook dispatch, not thousands of long waits. |
| Get Crawl Status | Fetches current asynchronous crawl state. | Retryable provider error remains inspectable. |
| Assess Crawl Status | Normalizes provider-specific states into running, complete, failed or timed out. | Prevents an endless poll loop. |
| Crawl Complete? | Sends completed crawl data to normalization. | Otherwise polls or exits partial. |
| Crawl Failed or Timed Out? | Separates permanent failure from work still in progress. | Keeps completed checkpoints and review reason. |
| Normalize & Bound Evidence | Keeps at most 25 pages and 18,000 characters/page; stores source key, URL, title, type and passage. | Oversized/untrusted web content is reduced before the model. |
| Prepare Agent Input | Combines account context, evidence, catalogue/rule context and task instructions. | One bounded prompt payload. |

## Account Intelligence Fit Agent

The agent is not “browsing the internet.” Firecrawl already did retrieval. Its work is to transform supplied evidence into structured business judgments:

- company/parent/segment;
- dishes or manufactured products explicitly evidenced;
- ingredient requirements contained in those dishes/products;
- operating locations, service area and scale signals;
- possible commercial pains, labeled as observed, inferred or hypothesis;
- catalogue candidates after calling the catalogue lookup tool;
- volume inputs only when evidenced or based on a visible assumption;
- material risks and missing information.

It does **not** calculate the final forecast, score or tier. It does **not** find contacts, draft outreach, approve or send.

| Connected node | Role |
|---|---|
| GPT 5.6 Terra Research Model | Balanced reasoning for multi-source synthesis and tool use. Medium effort is the production baseline. |
| Knoxx Catalogue Lookup | Returns approved synthetic catalogue items/aliases. Adding a catalogue item changes available matches without rewriting the prompt or formula. |
| Account Research Output Schema | Requires known fields, enums and nullable quantity inputs. Syntactic JSON validity is necessary but not sufficient. |

## Deterministic fit and persistence

| Node | What it owns | Why not an agent? |
|---|---|---|
| Deterministic Guardrail Score & Forecast | Checks source keys/catalogue IDs, rejects unsupported values, computes meals × share × kg/meal ranges, applies 40/25/20/15 minus risk, and assigns tier. | Arithmetic and business thresholds must be repeatable, testable and versioned. |
| Check If Evaluating | Routes evaluation cases away from production writes/provider handoffs. | Tests should not pollute CRM data or start later workflows. |
| LLM Judge Correctness | Scores semantic support/relevance using a separate model provider. | Helpful for meaning that string comparisons miss, but cannot override hard failures. |
| Gemini 3.6 Independent Judge | Cross-provider judge to reduce correlated producer/judge errors. | Used in evaluation/sampling, not every normal run. |
| Deterministic Research Metrics | Citation coverage, schema validity, tier match and unsupported-claim checks. | Primary release gates remain objective. |
| Persist Research & Score | Writes sources/findings/dishes/matches/forecasts/score and updates stages transactionally. | Postgres is the source of truth. |
| Start Buying Committee Workflow | Sends eligible/reviewable research to WF04. | Disqualified or insufficient accounts can stop before Apollo spend. |

## Why a critic agent may be added later

A Research Sufficiency Critic can decide `proceed`, `review`, or `re-research` from the research package and current sales policy. That is useful when requirements evolve. It should remain advisory:

- code still validates citations, formulas and allowed values;
- code still applies score thresholds;
- the critic cannot turn missing evidence into a fact;
- its decision and policy version are evaluated and logged.

This provides flexible judgment without making safety and financial logic opaque.

---

# WF04 — Buying Committee Agent

## Purpose

Use qualified/reviewed account research to identify 3–5 credible stakeholders while spending enrichment credits only on the best candidates.

| Node | What happens | Key boundary |
|---|---|---|
| Production Webhook | Receives account, run, research, score and pain context. | Protected with workflow secret. |
| Evaluation Trigger / Build Committee Evaluation Input | Supplies frozen Apollo-like people and an expected top persona. | Costs no Apollo credits. |
| Validate Research Result | Confirms account/run IDs, domain and viable research object. | Bad upstream shape stops here. |
| Eligible for Committee? | Applies minimum tier/review eligibility. | Deterministic cost gate. |
| Return Ineligible Account | Returns the reason without calling Apollo. | Disqualified accounts do not consume credits. |
| Apollo People Search | Searches broadly by organization domain, titles and seniority. | Search and enrichment are separate. |
| Bound Apollo Candidates | Keeps a small candidate list and only allowed fields. | Reduces agent prompt size and blocks invented IDs. |
| Apollo Enrich Top Candidates | Enriches at most the configured top one or two in the demo. | Credit budget is explicit; free-plan 403 can fall back to synthetic fixture data for the portfolio demo. |
| Normalize Apollo Results | Converts provider results/errors into one stable contact schema. | Provider changes remain localized. |
| Prepare Committee Agent Input | Supplies candidates, detected pains, company context and small synthetic historical priors. | The agent may rank only supplied candidates. |
| Buying Committee Agent | Returns component scores and explains likely buying role. | It cannot invent a person, title, email or Apollo ID. Work email affects activation, not role relevance. |
| Historical Persona Outcomes | Provides synthetic persona outcomes as a 10% tie-breaker. | Clearly labeled synthetic; never overrules role relevance. |
| Committee Output Schema | Requires bounded candidates, explanations and review state. | Bad JSON cannot silently persist. |
| Deterministic Contact Rerank | Applies 40% role relevance, 25% authority, 20% pain alignment, 10% history, 5% data confidence. | Final order is reproducible. |
| Evaluation nodes | Test schema, top-persona match, contact count and invention rate. | A judge score cannot excuse an invented contact. |
| Persist Contacts & Rankings | Upserts contacts/rankings and updates account stage. | Keeps intended identities server-side. |
| Start Outreach Draft Workflow | Sends only selected research/contact context to WF05. | Outreach starts with the top 1–2 only. |

---

# WF05 — Outreach Strategy Agent and Safe Send

## Purpose

Draft an evidence-backed four-touch email sequence, require human approval and guarantee that demo delivery reaches only the configured test inbox.

## Draft branch

| Node | What happens | Safety property |
|---|---|---|
| Draft Production Webhook | Receives account research and ranked contacts from WF04. | Protected server-to-server call. |
| Evaluation Trigger / Build Outreach Evaluation Input | Supplies a frozen persona, pain, claim and expected compliance. | Repeatable and free of sending/provider cost. |
| Validate Draft Request | Requires account/run/research/contact context and selects an eligible ranked contact. | No contact means no draft. |
| Prepare Outreach Agent Input | Provides one persona, evidence-backed pain options, approved claims, sender identity and cadence. | The agent cannot browse or add customer proof. |
| Outreach Strategy Agent | Chooses one pain/value proposition and drafts days 0/3/7/12. | Draft only—cannot approve, schedule, select recipient or send. |
| GPT 5.6 Luna Outreach Model | Cost-efficient model for bounded copy generation. | Low reasoning and strict output reduce cost/variance. |
| Approved Claims Checker | Returns only sales-approved claim categories. | Blocks invented savings, delivery, certification or price. |
| Outreach Output Schema | Requires selected pain/claim, source keys and exactly four messages. | Syntactic contract. |
| Outreach Safety Guardrail | Checks four touches, CTA placeholder, unsubscribe/sender identity, length and forbidden claims. | Deterministic compliance checks. |
| Evaluation nodes | Measure four-touch count, CTA/unsubscribe coverage, schema and semantic relevance. | Release gate. |
| Persist Draft Sequence | Writes one sequence and four draft messages; updates account to `draft_ready`. | Nothing is sent here. |

## Approval and safe-send branch

| Node | What happens | Safety property |
|---|---|---|
| Approved Sequence Webhook | Receives a server-side approval handoff for a specific sequence. | UI approval is verified by the Edge Function first. |
| Hard Demo Safety Gate | Requires `DEMO_MODE=true`, safe inbox and valid sequence context. | No hidden production switch. |
| Load Eligible Approved Messages | Loads only approved, due, non-suppressed messages/contacts. | Database state is checked again at send time. |
| Create Signed Tracking Link | Calls the Supabase signing function with a server secret and tracking token. | Browser/agent never holds the signing key. |
| Override Recipient & CTA | Replaces intended recipient with `SAFE_TEST_EMAIL`, replaces the placeholder with the signed link and builds safe HTML. | Last-mile recipient enforcement immediately before Gmail. |
| Wait Until Scheduled Touch | Waits for `scheduled_for` in the demo. | At scale replace with a due-message dispatcher. |
| Gmail Safe Send | Sends the prepared HTML to `delivered_recipient`. | Gmail credential exists only in n8n. |
| Record Safe Send | Marks message sent and records provider metadata. | Auditable distinction between intended and delivered recipient. |

---

# WF06 — Engagement and Pipeline Controller

## Purpose

Normalize engagement events, classify Gmail replies and apply deterministic account/contact state changes exactly once.

## Normalized event path

| Node | What happens | Result |
|---|---|---|
| Normalized Event Webhook | Receives click, booking, bounce, opt-out or normalized reply from a trusted provider/n8n call. | Event candidate. |
| Validate Normalized Event | Checks account, type, idempotency key, supported taxonomy and secret. | Bad/duplicate input cannot create arbitrary state. |
| Apply Deterministic Event | Calls `outreach-event`, which inserts idempotently and applies the state table. | Click +10 intent only; positive reply/booking pauses account; unsubscribe/bounce suppresses contact and pauses for review. |

## Gmail reply path

| Node | What happens | Boundary |
|---|---|---|
| Gmail Reply Trigger | Watches replies to the owned test sender account. | Gmail OAuth stays in n8n. |
| Extract Bounded Reply | Removes quoted history/signatures and truncates content. | Reduces sensitive/irrelevant input. |
| Resolve Reply Contact | Matches thread/sender metadata to a sent message/contact/account. | Unknown replies cannot mutate an arbitrary account. |
| Prepare Reply Classifier Input | Supplies bounded reply and fixed event taxonomy. | No open-ended agent actions. |
| Reply Classification Chain | Classifies positive, negative, organization-wide negative, OOO, unsubscribe or manual review. | Classification only. |
| GPT 5.6 Luna Classifier Model | Economical low-latency model for a narrow schema. | Low-confidence/ambiguous replies do not auto-apply. |
| Reply Classification Schema | Requires class, confidence, rationale and optional OOO date. | Stable contract. |
| Classifier Confidence Guardrail | Verifies confidence threshold and deterministic unsubscribe cues. | Safety rule can force manual review. |
| Evaluation nodes | Measure expected class, schema and safe auto-apply decision. | Regression gate. |
| Can Apply Automatically? | Branches on confidence/safety. | AI never directly changes state. |
| Apply Classified Event | Calls the deterministic Edge Function with a stable idempotency key. | Exactly-once state transition. |
| Queue Manual Reply Review | Stores uncertain replies for a human. | Ambiguity is visible, not guessed. |

## OOO resume path

An hourly schedule finds contacts paused with a past `paused_until`, returns them to an eligible state and records the transition. It does not resume an account that was suppressed or paused for another reason.

## Stop-rule truth table

| Event | Contact effect | Account/sequence effect |
|---|---|---|
| CTA click | None | Intent increases; continue outreach |
| Positive reply / manual engaged | Replying contact `replied`; other active/queued contacts `paused` | Account `engaged`; sequences paused |
| Meeting booked | Same pause behaviour | Account `meeting_booked`; sequences paused |
| Opportunity created | Same pause behaviour | Account `opportunity`; sequences paused |
| Negative reply | Contact suppressed | Account may continue via another contact |
| Negative organization reply | All organization outreach suppressed | Account `suppressed`; sequences stopped |
| Unsubscribe / hard bounce | Contact opted out/bounced + suppression entry | Sequence paused; account `review` |
| Out of office | Contact paused until return date | Account does not automatically stop |

---

# Snapfresh walkthrough

1. A user submits `snapfresh.com.au`.
2. The Edge Function resolves the canonical domain and reuses the existing Snapfresh account.
3. It inserts a new `research_run`, then WF01 marks it running and starts WF02.
4. In the intended research path, public capability/menu/PDF evidence supports dishes, scale and ingredient candidates; missing recipe proportions remain assumptions or null.
5. The deterministic engine calculates ranges and the fit rubric only from validated inputs.
6. WF04 produced three stored demo candidates: procurement score 90, culinary/NPD 82, operations 74.
7. WF05 persisted one four-touch sequence. Demo mode delivered only to the owned test inbox.
8. A tracked click was recorded without stopping the sequence.
9. A real Gmail positive reply was classified and persisted.
10. The sequence moved to `paused`, the replying contact moved to `replied`, and the other two moved to `paused`.

**Important truth for the interview:** the live contact/outreach/event loop is proven. The latest live research run is still `running`, while an older run is `failed_partial`; evidence and ingredient rows are not yet live proof. The fixture UI is a golden expected-output demonstration, not a claim that Firecrawl persistence is complete.

---

# Debugging checklist

## WF01 / webhooks

- Use JSON body and `Content-Type: application/json`.
- Website may be a bare domain or absolute HTTP(S) URL after the normalization fix.
- Confirm Edge Function secret and n8n `N8N_WEBHOOK_SECRET` match; do not reuse tracking/event secrets.
- Confirm the production webhook is published; a test webhook requires “listen for test event.”
- Inspect `research_runs.status`, `error_summary`, `started_at` and n8n execution ID.

## Firecrawl

- 401: credential header must be named `Authorization`; value is `Bearer fc-...`.
- 429: rate or concurrency limit; honor `Retry-After` and do not hammer retry.
- Crawl returns a job ID first; poll the status endpoint before reading pages.
- Bound paths/pages/depth; validate PDF and website source URLs.
- Preserve partial evidence and mark `failed_partial` instead of fabricating a full result.

## Structured AI output

- JSON parser error: validate the schema itself before blaming the model.
- Schema-valid but wrong: deterministic semantic validation must check source keys, catalogue IDs, ranges and counts.
- Metric `undefined`: evaluation metrics often receive judge output instead of the producer item; reference the correct node with `.first().json` and provide numeric defaults.
- Run the frozen evaluation branch after every prompt/model/schema change.

## Apollo

- 401: API key/header.
- 403: endpoint unavailable on the current plan; the free plan may not allow bulk enrichment.
- Search first; enrich only top one or two.
- Never interpret “no email” as “not a relevant decision maker.”
- Monitor endpoint-specific rate limits and credits.

## Postgres/Supabase

- Use pooled TLS credentials in n8n; Supabase URL is not a Postgres host.
- A missing column means workflow SQL and migration version have drifted; inspect the schema before editing the query.
- Public tables must have RLS; service-role keys never go to the frontend.
- Duplicate webhook tests should leave one event because `idempotency_key` is unique.

## Tracking and Gmail

- `tracking-link` requires the server `X-Outreach-Secret`; the browser must not call it.
- A “function not found” means the slug is missing or URL path differs from deployment.
- Demo send must show `delivered_recipient = SAFE_TEST_EMAIL` immediately before Gmail.
- HTML email should send `body_html`, not the raw text containing escaped `\n`.
- Reply trigger must watch the same Gmail credential/thread used for the test send.

---

# Likely interview questions and model answers

## Why n8n instead of writing a backend service?

n8n made provider orchestration, credential handling, retries, human-visible debugging and evaluation branches fast to build for the case study. Postgres and Edge Functions remain the product source of truth, so orchestration can later move to workers/services without changing the data model or UI contract.

## Why use agents at all?

Menus, titles and commercial context are semi-structured. An agent is useful when it must interpret bounded evidence and call a bounded catalogue/history tool. It is not useful for arithmetic, identity, authorization, state or sending. Those remain code.

## Why not use an agent as the final qualifier?

Sales policy changes, but the result still needs to be explainable and reproducible. Versioned database rules plus deterministic score code let sales change weights/thresholds safely. A critic agent can recommend review or re-research, but it cannot override missing evidence or the final rubric.

## How do new catalogue items or changed account menus affect eligibility?

Catalogue items and aliases are data, not hard-coded prompt text. A new catalogue/rule version invalidates the relevant cached match/score stage and creates a new run or targeted reprocessing. If a company adds products, a freshness/content-hash check triggers new evidence extraction; old runs remain immutable for comparison.

## How do you prevent hallucinations?

Bounded evidence, mandatory source keys, observed/inferred/hypothesis labels, tool-gated catalogue IDs, nullable unknowns, strict schema, deterministic semantic validation and golden evaluations. Unsupported claims fail or go to review instead of being converted into polished prose.

## Why ranges instead of exact demand?

Public evidence rarely contains exact production shares or recipe dosages. The system exposes formula inputs and returns low/base/high ranges. Missing inputs produce `insufficient_evidence`; the purpose is account prioritization, not inventory planning.

## Why is a click not a stop signal?

Email security scanners can click links automatically. A click increases intent, but confirmed human signals—positive reply, booking, manual engagement or opportunity—pause the whole organization.

## How do evaluations work?

Frozen fixtures exercise the same agent/schema/guardrail code without provider spend. Deterministic metrics are hard gates; an independent cross-provider judge covers semantic quality. Prompt/model changes are promoted only when they meet citation, unsupported-claim, ranking, compliance and stop-rule thresholds.

## Why use a different model as judge?

The producer and judge can share blind spots. A different provider lowers correlated error. It still does not replace objective checks or human sampling.

## What about prompt injection from websites?

Firecrawl output is untrusted data. It is bounded and supplied as evidence, not instructions. The system prompt says to ignore commands in sources, tools are allowlisted and cannot send, and output must cite known source keys. Deterministic validation rejects unknown IDs/actions.

## What is production-ready vs. demo-ready?

Demo-ready proves the loop safely with synthetic business data and an allowlisted inbox. Production-ready additionally needs async queues, load/chaos tests, provider budgets, workspace isolation, consent/lawful-basis records, sender authentication, data retention, monitoring, backups and a completed live evidence persistence proof.

## How would you process 1,000 domains?

Return `202 + run_id` immediately, deduplicate by workspace/canonical domain/input version, queue each expensive stage, use bounded provider-specific workers, persist checkpoints, retry transient errors with backoff, send exhausted jobs to review, reuse fresh evidence and measure cost per qualified account.

## What would you monitor?

Queue depth/oldest age, stage p50/p95 latency, stuck runs, crawl completion/429 rate, schema validity, citation coverage, partial-failure rate, Apollo credits, cache hits, messages due vs. sent, duplicate event rate and cost per started/completed/qualified account.

## What is the biggest current limitation?

The live outreach/event loop is proven, but the live Firecrawl-to-evidence persistence path is not yet complete. The correct next step is async crawl/checkpoint hardening and a live golden-account pass—not hiding the gap behind fixture data.

---

# One-page interview cheat sheet

## Story

**Problem:** research is slow and untraceable.  
**Decision:** qualify before enriching/outreach.  
**Unit:** one account per run; multiple immutable runs per account.  
**Pattern:** AI judgment inside deterministic controls.  
**Safety:** human approval + final recipient override + account stop rules.  
**Proof:** ranked contacts, four messages, click, Gmail reply, organization pause.  
**Gap:** live evidence/ingredient rows still need crawl persistence hardening.  
**Scale:** accept, queue, checkpoint, backpressure, cache, measure.

## Model routing

- Terra: research and committee reasoning.
- Luna: outreach and reply classification.
- Gemini Flash: independent evaluation.
- Sol: escalation only.
- No model: formulas, scores, identity, state, suppression and sending rules.

## Four numbers

- Fit: `40 + 25 + 20 + 15 − risk`.
- Contact: `40% + 25% + 20% + 10% + 5%`.
- Cadence: days `0, 3, 7, 12`.
- Scale: `1,000 / 480 minutes ≈ 2.1 jobs/minute`; at 3 worker-minutes/job ≈ 6.3 average concurrency.

## Never claim

- That a hypothesis is observed.
- That a quantity range is a purchase forecast.
- That the fixture research is live Firecrawl proof.
- That the agent approves or sends.
- That a click proves human interest.
- That the demo is production-ready.

---

# Ten-minute demo narration

**0:00–0:45 — Frame the problem**  
“I designed this as an account-decision system, not an email generator. One domain becomes an evidence-backed qualification, committee and controlled sequence.”

**0:45–2:00 — Architecture**  
Show the diagram. Explain React → protected Edge Functions → Postgres/n8n → providers. Point out that credentials never enter the browser and Postgres is the source of truth.

**2:00–3:00 — Intake**  
Submit Snapfresh. Explain canonical-domain deduplication, existing-account visibility and new immutable run. Mention immediate async `run_id` as the production target.

**3:00–5:00 — Account report**  
Show dishes, source passages, evidence labels, ingredient matches, formula inputs and the score breakdown. Say explicitly that unknown inputs become `insufficient_evidence`.

**5:00–6:15 — Prompt and agent boundary**  
Show the product-fit prompt anatomy. Explain that the agent interprets; code calculates and decides the tier. Mention catalogue lookup and future sufficiency critic.

**6:15–7:15 — Buying committee**  
Show ranked contacts and component scores. Explain search vs. enrichment, top 1–2 credit control and synthetic history as a small tie-breaker.

**7:15–8:20 — Outreach safety**  
Show four messages and human approval. Point at intended vs. delivered recipient, signed CTA and safe test inbox. The model can draft only.

**8:20–9:10 — Engagement proof**  
Show click followed by Gmail positive reply. Explain click does not stop; reply pauses the sequence and other contacts. Show the persisted rows.

**9:10–10:00 — Scale and honesty**  
Explain queue/backpressure/cache/idempotency and cost per qualified account. Close with the real gap: live crawl persistence needs hardening, while the downstream control loop is proven.

---

# Reference sources

- [OpenAI models](https://developers.openai.com/api/docs/models)
- [OpenAI latest-model guidance](https://developers.openai.com/api/docs/guides/latest-model)
- [Gemini models](https://ai.google.dev/gemini-api/docs/models)
- [Gemini structured outputs](https://ai.google.dev/gemini-api/docs/structured-output)
- [Firecrawl crawl](https://docs.firecrawl.dev/api-reference/endpoint/crawl-post)
- [Firecrawl errors and retry guidance](https://docs.firecrawl.dev/api-reference/errors)
- [Apollo API rate limits](https://docs.apollo.io/reference/rate-limits)
- [Apollo API pricing and credits](https://docs.apollo.io/docs/api-pricing)
- [Supabase Queues](https://supabase.com/docs/guides/queues)
- [n8n queue mode](https://docs.n8n.io/hosting/scaling/queue-mode/)

