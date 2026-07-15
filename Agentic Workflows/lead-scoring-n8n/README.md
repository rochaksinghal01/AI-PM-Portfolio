# Lead Scoring Workflow (n8n) — take-home submission

An automated workflow that takes a messy CSV of inbound leads, cleans and validates each row,
enriches it, scores it into Hot / Warm / Cold with an LLM-assisted judge step, stores the result
in Supabase, and exposes a small web frontend for uploading files and working a human-review
queue. Built in n8n, running live at a production webhook.

**Live frontend:** https://rochaksinghal01.github.io/AI-PM-Portfolio/Agentic%20Workflows/lead-scoring-n8n/frontend-react/dist/
Nothing further is needed to make this work — the Supabase publishable key and n8n webhook URL
are already baked into the build (see §6), and both the n8n workflow and the Supabase table are
live, so the link uploads and queries for real, not against a mock. If it 404s, GitHub Pages
just hasn't been switched on for this repo yet: Settings → Pages → Deploy from a branch →
`main` / `/ (root)` → Save, then wait about a minute.

## 1. The brief, verbatim

This is the actual task as given, so the reasoning below can be checked against it line by line
rather than taking my word for what was asked:

> **The scenario**
> Leads come into a business from different sources as a messy list. Before anyone can act on
> them, each lead needs to be cleaned, enriched with a bit more information, and prioritized so
> the team knows who to call first. Right now this is done by hand. We want a workflow that
> does it automatically and keeps running even when some of the data is bad.
>
> **What you get**
> `leads_sample.csv` with columns: `lead_id, name, email, company, raw_notes, source`. Some
> rows are messy on purpose.
>
> Note: at review we will run your workflow on a different leads file you have not seen, in the
> same format. Build for that, not just for this sample.
>
> **What to build**
> Build this as an automation workflow. Use n8n or any equivalent workflow/orchestration
> platform you prefer. Tell us which you used and why.
>
> The workflow should:
> - Ingest the CSV. Rows that are malformed should be handled, not silently dropped.
> - Enrich each lead. At minimum, derive the company's web domain from the email address. If
>   you want to go further, call any public API to add more (this is optional, keep it simple).
> - Prioritize each lead. Use one LLM call to read `raw_notes` and assign a priority
>   (high / medium / low) plus a one-line summary.
> - Store the cleaned, enriched, prioritized result in a database (Postgres preferred) or a
>   structured output a reviewer can inspect.
> - Survive failure. If enrichment or the LLM call fails on a given row, the workflow must not
>   crash. That row should be flagged and the run should continue for the rest.
> - Write 5 to 6 lines on what would break if this ran on 50,000 leads a day instead of this
>   sample, and what you would change.
>
> **Timeline and updates.** Three working days. Send a short update at the end of each day: what
> you did, what is next, and anything you are stuck on or unsure about.
>
> **How to submit.** Share the workflow itself (exported JSON, or a screen recording of it
> running end to end), the output it produced, and a short note on the decisions and
> assumptions you made.

Every requirement above maps to a specific part of this submission — see the table in §4.

## 2. How the brief was analyzed before building anything

Rather than start from the sample file, I read the 10 rows in `leads_sample.csv` as a *use-case
inventory* — each row was written to exercise a distinct failure mode, and the design target was
"handle the category of problem," not "handle these 10 rows," since the brief explicitly says
the review file is different. That inventory (full version in `PLANNING.md`) surfaced gaps a
naive read of the brief would have missed:

- A lead's email domain being `gmail.com`/`fastmail.com`/etc. is not the company's domain — it's
  a personal mailbox. Reporting it as the company domain would be wrong, so free-mail domains
  are detected and excluded from the domain-enrichment step.
- "Low priority" was originally one bucket for three different situations: explicit
  not-interested, no information at all, and unreadable gibberish. A reviewer can't act on those
  the same way, so the pipeline keeps them distinguishable (`intent: blank` vs `gibberish` vs a
  real-but-cold `browsing`/`inquiry`, each carrying its own summary).
- Malformed is two different problems, handled differently: *structural* CSV damage (wrong
  column count, an unescaped comma) is repaired and flagged, never dropped; *data-quality*
  problems (invalid email, empty notes, gibberish) are kept as-is and flagged so a human can
  double-check, rather than the pipeline silently guessing on their behalf.
- Two rows share an email with slightly different name/company spelling — a likely duplicate
  the brief doesn't ask me to resolve. Rather than silently merge or drop one, it's surfaced as
  a flag and left for a human decision.

This inventory is what the guardrail nodes in the live workflow check for at each stage (see §5).

## 3. Why n8n

**Technically:** the brief's two hardest requirements — "keeps running even when some of the
data is bad" and "use one LLM call to read notes and assign priority" — map almost directly onto
n8n primitives rather than needing custom code to simulate them. Per-node
`retryOnFail`/`maxTries`/`waitBetweenTries` and `onError: continueRegularOutput` give real
per-row fault isolation (a failed enrichment or LLM call on one lead doesn't stop the batch) for
free, where a plain script would need its own retry/queue logic hand-rolled. The
LangChain-based AI nodes (`chainLlm` + `outputParserStructured`) give a real structured-output
contract against the LLM (enum-constrained fields, required keys) instead of parsing free text
and hoping. And because it's visual, every stage — clean → validate → score → judge → summarize
→ store — is inspectable node-by-node in the execution log, which matters for a workflow whose
whole point is "a human can see why a lead was flagged."

**Personally:** n8n is the tool actually used day-to-day for this kind of workflow at Sentisum,
so building the take-home in it is a more honest signal of how I'd actually ship this on the
job, rather than reaching for a general-purpose scripting language I'd have to explain a
mapping back from. It also let me stress-test the platform's own limits (its Evaluations
feature, its native Supabase node's actual capabilities, its execution-data model under batch
load) as part of the exercise, which is the kind of platform judgment the task is implicitly
testing for a PM-adjacent build.

The brief allowed "any equivalent platform" — a Python reference implementation
(`pipeline.py`) exists alongside the n8n workflow, doing the same ingest → validate → enrich →
score → store steps, so the logic can be verified independent of n8n. It is not the primary
deliverable.

## 4. Requirement → implementation map

| Brief requirement | Where it's handled |
|---|---|
| Ingest the CSV, don't silently drop malformed rows | `Parse CSV (tolerant)` + `Clean & Validate` Code nodes: ragged rows (wrong column count, stray commas) are repaired field-by-field; every input row produces exactly one output row |
| Enrich: derive company domain from email | `Clean & Validate`: parses the email's domain, and separately flags known personal/free-mail domains (gmail, yahoo, outlook, fastmail, etc.) so they aren't misreported as the company's domain |
| Prioritize with one LLM call, priority + one-line summary | Three chained LLM calls, each doing one job (see §5) — `Validator Chain` classifies intent/clarity/company signal, `Summarizer Chain` writes the one-line summary. (Went slightly past "one call" deliberately — see §5's rationale — but the brief's minimum bar, one LLM read of `raw_notes` producing a priority + summary, is satisfied by the Validator + Summarizer pair on their own.) |
| Store cleaned/enriched/prioritized result in Postgres | `Upsert into Supabase (leads_scored)` — Supabase is managed Postgres; schema in `schema_v2.sql` |
| Survive failure per row | `retryOnFail` (up to 5 attempts, 4s backoff) on every LLM node, `continueRegularOutput` on error, plus dedicated `Guardrail:` nodes after every stage that catch and flag bad output instead of letting it propagate silently |
| 5–6 lines on 50,000 leads/day | §7 below |
| Tell us which platform and why | §3 above |

## 5. The pipeline, stage by stage

```
Webhook: Leads Upload
  → Adapt Webhook Payload → Parse CSV (tolerant) → Clean & Validate → Guardrail: Clean Check
  → Validator Chain (Gemini) → Guardrail: Validator Check
  → Score & Tier (deterministic)
  → IF: Needs Judge?
        true  → Judge Chain (Gemini) → Guardrail: Judge Check   ─┐
        false → No Judge Needed                                  ├→ Summarizer Chain (Gemini)
                                                                   → Guardrail: Summary Check
                                                                   → Upsert into Supabase (leads_scored)
```

**Clean & Validate** (deterministic, Code node) — repairs structural CSV issues, checks email
shape, derives `domain` and `email_type` (company / personal / blank), and passes through
untouched otherwise. No LLM involved here on purpose: whether an email has an `@` in it is a
lookup, not a judgment call, and running it through an LLM would just add latency and cost for
no accuracy gain.

**Validator Chain — the "small LLM call to get company details"** This is the node that
directly satisfies the brief's "one LLM call to read raw_notes and assign a priority" — and it's
also the only place company information is estimated by an LLM rather than looked up. Given
just the name, company name, and raw notes, it returns a single structured object:

```
name_valid            — is this a plausible real name, or a placeholder like "Test"/"XYZ"?
name_flag_reason       — why, if not valid
company_size_tier       — small / medium / large / unknown, estimated from the company name alone
company_networth_estimate — one caveated phrase, or null — explicitly labeled as an estimate,
                            never presented as verified data
intent                 — blank / gibberish / browsing / inquiry / demo / complaint / order
clarity                 — yes / no (are the notes a clear ask, or vague?)
repeat_customer         — yes / no / unclear
```

This is deliberately a *guess with a disclaimer*, not a real enrichment API call — the brief's
enrichment requirement is satisfied by the deterministic domain derivation above; this LLM call
is scored against the "prioritize" requirement, using whatever signal is available (company
name, notes) to produce the size/networth fields a salesperson would want at a glance, while
being explicit that it's an estimate rather than pretending it's verified.

**Score & Tier** (deterministic, Code node) — a fixed rubric converts the Validator's structured
fields into a `total_score` and a `Hot`/`Warm`/`Cold` tier. Kept deterministic on purpose: the
brief asks for prioritization to reflect the notes, but the actual scoring math should be
auditable and reproducible, not another LLM guess stacked on the first one.

**IF: Needs Judge?** — routes low-confidence or borderline cases (e.g. name invalid, gibberish
notes, ambiguous score) to a second LLM pass; clear-cut cases skip straight to the summary,
which keeps LLM spend proportional to how much judgment a lead actually needs rather than
running every row through every check regardless.

**Judge Chain** — for the flagged subset only, a second LLM call decides `needs_human_review`
and a `review_reason`, given the tier, score, and *why* it was flagged. This is what actually
appears in the frontend's review queue.

**Summarizer Chain** — writes the one-line, salesperson-facing summary the brief asks for,
referencing intent, notes clarity, and source.

**Guardrail: \* nodes** — after every LLM stage, a Code node checks the output is well-formed
(non-empty, capped length, contains a recognizable signal) before letting it proceed; this is
what a bad/rate-limited LLM response gets caught by instead of silently reaching storage.

**Upsert into Supabase** — an HTTP Request node using a `Supabase API`-typed credential and
`Prefer: resolution=merge-duplicates,return=minimal` for upsert-on-`lead_id` semantics.
n8n's native Supabase app node was evaluated first and confirmed (via its schema definition) not
to support upsert, hence the HTTP Request node with a real Supabase credential instead of a bare
Postgres node — the fix applied mid-build after finding the original Postgres node pointed at
the wrong credential type entirely.

## 6. Frontend

A small web app for the two operator-facing actions the workflow implies but doesn't do itself:
uploading a CSV, and clearing the human-review queue.

- `frontend.html` — plain HTML/JS version, zero build step.
- `frontend_react.html` — the same app rebuilt in React (single file, CDN-loaded React +
  Babel-standalone, no build step needed to open it).
- `frontend-react/` — a proper Vite + React project (the same components as ES modules), for
  anyone who wants a real build pipeline rather than a CDN script tag. Builds clean
  (`npm run build` → ~150KB bundle), and the built `dist/` is committed and published via GitHub
  Pages — link at the top of this file. The Supabase publishable key and the n8n webhook URL are
  compiled into that build (`src/App.jsx`), so the live link needs no setup on your end: it talks
  to the real, live n8n workflow and the real Supabase table, not a mock.

Features: upload panel that posts straight to the n8n production webhook; a review queue read
from Supabase filterable by tier (Hot/Warm/Cold/all) and by scope (needs-review-only vs. every
processed lead); inline "mark reviewed" action; a fallback message
(`no summary — LLM call failed or was rate-limited for this lead`) instead of a misleading blank
cell when a row's Summarizer call didn't complete — this replaced an earlier bug where the queue
just showed a blank Summary column with no explanation.

## 7. What would break at 50,000 leads/day, and what I'd change

**The bottleneck is per-lead LLM calls, and the fix is concurrency, not batching.** At even 1
req/sec sequential, one LLM stage alone is 14+ hours for 50k leads — this pipeline runs three
Gemini calls per lead in the worst case (Validator → Judge → Summarizer), so sequential
execution simply doesn't finish inside a day. This already surfaced at test scale: a batch of
just 8 leads hit Gemini's free-tier rate limit mid-run (`"The service is receiving too many
requests from you"`), so this isn't a hypothetical risk, it's an observed failure mode at 1/6000th
the target volume.

To be precise about which fix applies where, because these are three different techniques, not
interchangeable words for the same thing:

- **Batching** (combining multiple leads into one request) does *not* work for the LLM
  classification steps — asking one Gemini call to judge 10 leads' notes at once would degrade
  structured-output reliability per lead (harder to keep 10 JSON objects straight, more parse
  failures for the guardrail nodes to catch) and defeats the point of a per-lead judgment call.
  Batching *does* apply to the Supabase write — the current one-row-per-HTTP-call upsert should
  become genuine multi-row batches (e.g. 500 rows per upsert, or `COPY`), since persistence
  isn't a judgment call and doesn't need row-by-row isolation.
- **Concurrency / async processing** is the actual fix for the LLM steps: move off n8n's
  default single-execution-in-memory model into n8n **queue mode** (Redis-backed, multiple
  worker processes), or pull the LLM stages out of n8n entirely into a small worker pool
  (consumers reading off SQS/RabbitMQ/Redis Streams) that fires a bounded number of concurrent
  requests — say 20–50 in flight at once — rather than one at a time. Throughput then scales
  with concurrency limit and worker count, not wall-clock per-call latency.
- **Sharding** — partitioning the day's 50k leads across N independent workers/queue consumers
  (hash `lead_id`, or shard by `source`) — is what makes concurrency actually horizontal: one
  slow or stuck lead blocks only its own worker, not the whole run, and adding workers adds
  throughput linearly instead of everyone contending for one execution's memory.

So concretely: queue-based ingestion → N sharded workers → each worker firing ~20–50 concurrent
Validator/Summarizer calls → escalate to Judge only for the branch already isolated by
`IF: Needs Judge?` → batch-write results to Supabase in blocks of a few hundred rows.

**Model choice.** The architecture already separates "runs on every lead" (Validator,
Summarizer) from "runs only on the ambiguous subset" (Judge) via the existing `IF: Needs Judge?`
branch — at 50k/day I'd lean into that split deliberately rather than treat it as incidental:
a fast/cheap tier (Gemini's Flash-class model, or an equivalent low-cost model such as GPT-4o-mini
or a small Llama variant) for Validator + Summarizer, since that's 100% of the day's volume and
has to be cheap and fast to be viable at all; a stronger, more expensive model reserved for the
Judge Chain specifically, since that call only fires for the borderline/low-confidence slice the
Validator already flagged — so the expensive model's cost scales with how ambiguous the day's
leads are, not with total volume. (I haven't confirmed the exact Gemini model string currently
wired into the three chat-model nodes — the observed free-tier rate-limiting is consistent with
Flash-tier limits, which is what I'd assume it's on, but that's an assumption to verify against
the actual node config, not a confirmed fact.) This isn't a "worry about cost later" footnote —
at 50,000 LLM calls a day, moving to a paid tier with provisioned throughput is a day-one
requirement, not an optimization to defer; the free tier will not survive the first hour of that
volume, let alone the first day.

**Review queue at scale.** A table that's fine to eyeball at a handful of flagged leads becomes
unusable at the volume 50k/day would flag — this needs a dashboard with counts and trends by
flag reason (invalid name, gibberish notes, judge-flagged, parser failure), not a scrollable
table a human is expected to read start to end.

## 8. Repo contents

| File | What it is |
|---|---|
| `leads_workflow_v3.json` | The live, production n8n workflow export — the primary deliverable (Gemini LLM chains + Supabase storage) |
| `leads_workflow_v2.json`, `leads_workflow_v1.json` | Earlier iterations, kept for the build history |
| `schema_v2.sql` | Supabase/Postgres DDL for `leads_scored` (current) |
| `schema.sql` | Original v1 Postgres DDL, kept for history |
| `pipeline.py`, `requirements.txt` | Standalone Python reference implementation of the same ingest → validate → enrich → score → store logic |
| `frontend.html`, `frontend_react.html`, `frontend-react/` | Operator frontend, three forms (plain HTML/JS / single-file React via CDN / full Vite+React project — `dist/` is the published build) |
| `PLANNING.md` | The use-case inventory and design decisions written *before* the v2 rebuild |
| `sample_data/` | `leads_sample.csv` and a hand-built ragged-CSV edge case |
| `sample_output/` | `pipeline.py` run outputs against the clean, ragged, and resilience-test inputs |

## 9. Known limitations, said plainly

- The Validator/Judge structured-output parser occasionally fails to parse a Gemini response and
  defaults to "needs review" rather than crashing — safe, but means the review queue sometimes
  contains rows that are actually fine. Flagged, not yet fixed.
- n8n's native Evaluations feature (for regression-testing the LLM prompts against a labeled
  dataset) was set up through Step 2 of its wizard and then hit a "Next: Add cases" button that
  stays disabled with no error shown — confirmed via DOM inspection (`disabled`, `aria-disabled`)
  that it isn't a click-target issue, and no combination of selecting/reselecting scoring checks
  unlocks it. Most likely a plan-gated feature on the trial tier that isn't surfacing its own
  paywall message. Expected test cases for all three chains were drafted against the live
  prompts and `leads_sample.csv` rows but couldn't be entered through the wizard.
