# Knoxx Outbound Intelligence — interview-ready guide

Read this document first. It is the concise version of the full node-by-node guide in `workflow-interview-guide.md`.

## 1. The 30-second answer

Knoxx Outbound Intelligence helps a salesperson decide whether a food company is worth pursuing. A user enters one company domain. The system gathers public evidence, identifies dishes and ingredient opportunities, estimates demand as a range, applies an explainable fit score, finds and ranks the likely buying committee, drafts a four-touch sequence and waits for human approval. Demo mode forces delivery to an owned test inbox. A click raises intent; a positive reply or booking pauses outreach to everyone else at that company.

The core design principle is:

> **AI interprets ambiguity. Code controls identity, arithmetic, authorization, state and safety.**

## 2. The user, job and success measure

**Primary user:** salesperson or business-development manager.

**Job to be done:** “Tell me if this account is worth my time, show me why, identify who matters, recommend a safe next action and tell me when to stop.”

**North-star candidate:** sales-accepted qualified accounts per research hour.

For a pilot, measure:

- Median research minutes per reviewed account.
- Precision of accounts marked qualified and accepted by sales.
- Citation coverage and unsupported-claim rate.
- Cost per started, completed and sales-accepted account.
- Approved sequences, positive replies and meetings as downstream outcomes.

Never optimize raw emails sent. That rewards activity, not better account decisions.

## 3. The architecture in plain English

```text
Sales user
  → React/Lovable frontend
  → protected Supabase Edge Function
  → Postgres account + immutable research run
  → n8n workflow orchestration
  → Firecrawl / AI / Apollo / Gmail
  → Postgres checkpoints and events
  → frontend report and pipeline
```

Responsibilities are separated:

- **Frontend:** login, input, progress, report, review and approval.
- **Edge Functions:** authenticate the user and protect privileged APIs.
- **Postgres/Supabase:** source of truth for accounts, runs, evidence, scores, contacts, messages and events.
- **n8n:** orchestration, provider credentials, agents, retries and evaluation branches.
- **Firecrawl:** retrieves website/PDF evidence; it does not make the qualification decision.
- **AI agents:** interpret bounded evidence or candidates and return structured proposals.
- **Deterministic nodes:** calculate scores/quantities, validate IDs and enforce state/safety.
- **Apollo:** searches people first; enrichment is limited to the top one or two in the demo.
- **Gmail:** safe delivery only after approval and recipient override.

## 4. What each workflow does

### WF01 — intake and identity

1. Receives the authenticated account/run request.
2. Validates the private webhook secret and input.
3. Converts a bare domain or URL into one canonical domain.
4. Reuses an existing account but always creates/continues a new immutable run.
5. Marks the account `researching` and starts WF02.

**Why no agent?** Account identity, UUID validation and duplicate detection must be exact and reproducible.

### WF02 — evidence, opportunity and fit

1. Submits an asynchronous Firecrawl job for relevant website/PDF pages.
2. Polls with a bound, then stores URL/title/passage/source type.
3. Gives only bounded evidence to the Account Intelligence Agent.
4. The agent extracts company/parent, dishes, scale, service-area signals, pain hypotheses and catalogue candidates.
5. A parser enforces the JSON contract.
6. Code rejects unknown sources/catalogue IDs, calculates low/base/high demand and applies the versioned fit rubric.
7. Results persist before WF04 begins.

**What the agent actually produces:** evidence-backed inputs and explanations. It may propose recipe/ingredient overlap, but it does not invent exact recipes and does not calculate the final demand or fit tier.

**Why keep deterministic guardrails?** A critic agent can recommend `proceed`, `review` or `re-research`, but it cannot guarantee arithmetic, authorization or a stable sales threshold. Requirements can still change through versioned catalogue/rule data and prompt versions.

### WF04 — buying committee

1. Stops disqualified accounts before enrichment spend.
2. Searches Apollo by company domain, title families and seniority.
3. Bounds the candidate list and enriches at most one or two people in demo mode.
4. The agent scores role relevance, authority and pain alignment from only those candidates.
5. Code recomputes the weighted total and order.
6. Stores 3–5 contacts when available and begins the draft workflow.

Contact score:

`40% role relevance + 25% authority + 20% pain alignment + 10% synthetic history + 5% data confidence`

The model cannot invent a person, title, email or Apollo ID.

### WF05 — outreach, approval and safe send

1. Selects one supported pain/value proposition for the chosen persona.
2. The agent drafts four concise emails for days 0, 3, 7 and 12.
3. Code checks approved claims, CTA placeholder, unsubscribe, sender identity and length.
4. The sequence is stored as `draft` and shown for human editing/approval.
5. Immediately before Gmail, code checks suppression/state again, creates a signed CTA and replaces the intended recipient with `SAFE_TEST_EMAIL`.
6. Gmail sends only when demo gates pass.

The agent can draft. It cannot approve, schedule, select the delivered recipient or send.

### WF06 — engagement and stopping

1. Normalizes click, reply, booking, bounce, unsubscribe and manual events.
2. Uses a unique idempotency key so repeated webhooks do not repeat state changes.
3. Applies deterministic transitions.
4. A click raises intent but does not stop the account because security scanners can click.
5. A positive reply, booking, manual engagement or opportunity pauses every other contact at the organization.
6. Unsubscribe/bounce suppresses the contact and pauses the account for review.

This is a bounded classification chain, not an autonomous agent, because the taxonomy is fixed and no tool exploration is needed.

## 5. The fit and demand logic

### Quantity

For each matched ingredient:

`estimated meals × applicable dish share × ingredient kg per meal`

The system returns weekly, monthly and annual low/base/high ranges. Every input and assumption remains visible. If required evidence is absent, output is `insufficient_evidence`—not a guessed number.

### Fit

- Product applicability: 0–40.
- Evidence specificity: 0–25.
- Scale suitability: 0–20.
- Supply feasibility: 0–15.
- Risk penalty: 0 to −30.

Tiers:

- 75+: qualified.
- 55–74: sales review.
- Below 55: disqualified.

The model explains the evidence and risks. Code calculates the final score and tier so the same inputs always produce the same result.

## 6. Prompt engineering answer

A strong prompt has ten parts:

1. **Role:** one bounded responsibility.
2. **Objective:** the decision the output supports.
3. **Context:** account, catalogue, rules and notes.
4. **Evidence boundary:** use only known sources.
5. **Procedure:** an ordered analysis sequence.
6. **Tools:** when lookup is mandatory.
7. **Guardrails:** what cannot be invented or acted on.
8. **Schema:** types, enums, nullable unknowns and bounded arrays.
9. **Examples:** one supported and one insufficient-evidence output.
10. **Self-check:** source keys, IDs, hypotheses and nulls.

The key phrase for the interview is:

> “I constrained the model’s decision surface, not merely its writing style.”

Why the research prompt is structured this way:

- Only retrieved evidence is supplied, reducing irrelevant output and prompt injection.
- Every material claim has a source key, confidence and evidence label.
- Pain remains a hypothesis unless the company states it.
- Catalogue lookup is mandatory, so catalogue changes are data changes, not prompt rewrites.
- Unknown quantity inputs are nullable, preventing false precision.
- The agent does not own the final score.

## 7. Model selection answer

| Stage | Default | Reason |
|---|---|---|
| Retrieval | Firecrawl, no LLM | Preserve sources before interpretation |
| Account research | GPT-5.6 Terra | Balanced multi-source reasoning and tool use |
| Buying committee | GPT-5.6 Terra | Title and organization reasoning on bounded candidates |
| Outreach | GPT-5.6 Luna | Lower-cost constrained drafting |
| Reply classification | GPT-5.6 Luna | Narrow fixed taxonomy |
| Independent judge | Gemini 3.6 Flash | Cross-provider semantic evaluation |
| Escalation | GPT-5.6 Sol | Ambiguous/high-value cases only |

Model selection is configuration, not permanent product logic. Promote a model only if it passes the golden dataset, safety gates, latency budget and cost budget. Do not use the most expensive model everywhere.

## 8. How evaluations work

Every nondeterministic workflow has a production path and a fixture evaluation path.

Three layers protect quality:

1. **Structured parser:** required fields and correct types.
2. **Deterministic metrics:** citations, valid IDs, expected tier/persona, four touches, approved claims and safety.
3. **Independent judge:** semantic support and relevance from another provider.

The judge cannot override a failed hard gate. A fluent answer with an invented source still fails.

Promotion targets include:

- 99% schema validity.
- 95% citation coverage.
- Zero unsupported claims on golden cases.
- 100% outreach compliance.
- 100% stop-rule tests.

## 9. What is genuinely live

Live Supabase/n8n proof includes:

- One Snapfresh account with multiple immutable research runs.
- Three **synthetic demo** contacts ranked 90, 82 and 74.
- One stored four-touch sequence.
- Safe Gmail delivery to the owned test inbox.
- A tracked CTA click that did not stop the organization.
- A real Gmail positive reply.
- Sequence paused, replying contact marked `replied`, other contacts paused.
- RLS on all 22 public tables and server-side provider credentials.

Honest limitation:

> The newest live research run remains `running`; an older run is `failed_partial`; live evidence and ingredient-match rows are incomplete. The frontend research report is a golden expected-output fixture, not live Firecrawl proof.

Do not hide this. Explain that the downstream safety loop is proven and the next milestone is checkpointed crawl persistence.

## 10. The 1,000-domain answer

Do not run 1,000 synchronous workflows.

1. Intake returns `202 Accepted + run_id` in under a second.
2. Durable queues separate retrieval, extraction, scoring, contacts and drafting.
3. Provider-specific worker pools enforce Firecrawl, LLM and Apollo concurrency/rate budgets.
4. Every stage uses `run_id:stage:input_version` as its idempotency key.
5. Transient failures retry with exponential backoff, jitter and `Retry-After`.
6. Permanent/exhausted failures preserve checkpoints and enter a review/dead-letter queue.
7. Evidence is cached by content hash and freshness; catalogue/rule changes trigger targeted reprocessing.
8. Postgres uses short transactions, pooling, indexes and append-only events.
9. Monitor queue age, stage latency, stuck runs, 429s, schema/citation quality, Apollo credits and cost per accepted account.

Capacity illustration:

- 1,000 jobs in 8 hours = about 2.1 jobs/minute.
- At 3 worker-minutes per job = about 6.3 average concurrent workers.
- Provision roughly 10–15 for variance, then cap each provider separately.
- Queue bursts; never launch 1,000 simultaneous provider calls.

Cost story:

`cost/account = crawl + model input/output + successful enrichments + email/event/storage`

The useful metric is cost per sales-accepted qualified account. Stop downstream spend on disqualified accounts, reuse fresh evidence and enrich only top candidates.

## 11. Assumptions you must say aloud

The demo uses synthetic catalogue items, service regions, qualification rules, contacts and historical outcomes. Before production, sales must answer:

- What makes an account unquestionably valuable?
- What are the hard disqualifiers?
- Which products, MOQ, capacity, regions and claims are approved?
- What volume/revenue threshold matters?
- Who champions, technically approves, economically buys and blocks?
- Which persona/pain/CTA combinations are approved?
- Which events stop one contact versus the whole organization?
- Who reviews drafts and owns an engaged account?

## 12. Tough interview questions

### Why n8n?

It accelerated provider orchestration, credentials, visible debugging and evaluation branches. Postgres remains the source of truth, so workflows can later move to queue workers without changing the product contract.

### Why agents instead of ordinary LLM calls?

Research and committee tasks benefit from bounded tool lookup and multi-step judgment. Reply classification is a chain because it has a fixed taxonomy. “Agent” is chosen based on task uncertainty, not as a marketing label.

### Why not let an agent decide qualification?

Sales policy must be versioned, reproducible and auditable. A critic can recommend proceed/review/re-research; code still owns evidence requirements, formula and tier.

### What happens when Knoxx adds catalogue items?

Catalogue and aliases are database data. A new catalogue version invalidates the match/score stage and triggers targeted reprocessing; prompts need not hard-code every ingredient.

### What happens when an account changes its menu?

A content-hash/freshness check creates a new immutable run. Previous results remain for comparison. New evidence can change ingredient matches and eligibility without overwriting history.

### How do you prevent hallucinations?

Bounded sources, known source keys, evidence labels, required catalogue lookup, nullable unknowns, strict schemas, semantic validation, deterministic arithmetic and golden evaluations.

### Why does a click not stop outreach?

Security scanners can click links. It raises intent only. A positive reply, booking, manual engagement or opportunity stops the organization.

### Biggest current limitation?

The live Firecrawl-to-evidence persistence path is incomplete. I would finish checkpointing and run a 25-account assisted pilot before claiming production readiness.

### What would a CPO approve?

A controlled pilot, because the product logic and downstream safety loop are credible. Not production, until live evidence persistence, sales policy, RLS/load/monitoring and compliance gates are proven.

## 13. Ten-minute presentation flow

**0:00–0:45 — Problem and decision**  
“This is an account-prioritization system, not an email generator.” State the user, job and north star.

**0:45–2:00 — Architecture**  
Show frontend → Edge Functions → Postgres/n8n → providers. Explain the AI/code/human boundaries.

**2:00–3:00 — Intake**  
Submit a domain. Explain canonical identity, existing-account reuse and immutable runs.

**3:00–4:45 — Research and fit**  
Show sources, evidence labels, ingredient match, quantity range and score breakdown. State the live persistence limitation honestly.

**4:45–5:45 — Prompt and models**  
Explain the ten-part prompt and why models propose while code calculates.

**5:45–6:45 — Committee**  
Show bounded candidates, search-before-enrich and deterministic weighted order.

**6:45–8:00 — Outreach safety**  
Show four drafts, approval, intended vs delivered recipient and signed CTA.

**8:00–9:00 — Engagement proof**  
Show click, Gmail reply and organization-wide pause.

**9:00–10:00 — Scale and decision**  
Explain accept/queue/checkpoint/backpressure/cache. Recommend a 25-account assisted pilot.

## 14. Final memory card

- **Problem:** research is slow, fragmented and untraceable.
- **Decision:** qualify before enrichment and outreach.
- **Unit:** one company per run; multiple immutable runs per account.
- **Pattern:** AI judgment inside deterministic controls.
- **Safety:** human approval + recipient override + account stop rules.
- **Proof:** stored committee/sequence, click, Gmail reply and organization pause.
- **Gap:** live research evidence persistence is incomplete.
- **Next:** 25-account pilot measuring speed, precision, trust and economics.
- **Scale:** accept, queue, checkpoint, backpressure, cache and observe.

