# Lead Scoring — n8n Workflow

> An agentic lead-intake pipeline that ingests a messy CSV of inbound leads, enriches each one with a derived company domain, prioritizes it with a single LLM call reading the raw notes, and writes a clean, flagged, database-ready record — without ever dropping a row, even when the data or an API call fails.

## What It Does
- Ingests a CSV of raw leads and tolerates structural malformation (ragged rows, extra/missing columns) by repairing and flagging instead of dropping
- Enriches each lead by deriving the company domain from its email (with a low-confidence company-name fallback when the email is missing or invalid), plus an optional free domain/email validity check
- Prioritizes each lead with one LLM call over `raw_notes`, returning `high / medium / low` plus a one-line summary
- Flags — never drops — rows with bad emails, missing fields, duplicate leads, or a failed enrichment/LLM call, so the run always completes
- Writes the final record to Postgres (Supabase-compatible) with an `ON CONFLICT` upsert

## How to Import
1. Import `Lead_Scoring_Workflow.json` into your n8n instance
2. Set `OPENROUTER_API_KEY` (and optionally `OPENROUTER_MODEL`) as an n8n environment variable — verify the current free-model slug at openrouter.ai/models, they change often
3. Run `schema.sql` once against your Postgres/Supabase database
4. Wire up the Postgres credential (Supabase's connection-pooler string drops in unmodified — it's managed Postgres)
5. Point the "Read CSV File" node at your leads file and run

A runnable Python reference implementation (`pipeline.py`) with identical logic is included — useful for testing the enrichment/prioritization/flagging behavior directly:
```
python3 pipeline.py sample_data/leads_sample.csv output/
```
It defaults to a clearly-logged mock heuristic for the LLM step when no `OPENROUTER_API_KEY` is set, so it runs out of the box with no credentials.

## Sample Output
`sample_output/` contains three runs against the CSVs in `sample_data/`:
- `leads_output_clean_demo.csv` — enrichment disabled, showing the ok/flagged split from data-quality issues alone (bad emails, missing fields, a duplicate lead)
- `leads_output_resilience_demo.csv` — enrichment enabled in a network-restricted sandbox, showing every row correctly flagged (not crashed) when the enrichment API is unreachable
- `leads_output_ragged_csv_demo.csv` — a hand-built CSV with malformed row structure (too many/few columns), showing 0 rows dropped

## Decisions & Assumptions
- **Duplicates aren't merged.** Two leads sharing an email but different name/company spelling get a soft `possible duplicate` flag, not an automatic merge — which record wins felt like a business call, not a pipeline one.
- **Malformed structure vs. bad data are handled differently.** Ragged CSV rows are repaired (padded/merged) and flagged; bad data (invalid email, empty notes) is left as-is and flagged for human review rather than silently fixed.
- **LLM calls and enrichment calls are wrapped per-row**, not per-run — one row's API failure flags that row and the run continues for the rest.

## At 50,000 leads/day
Per-row sequential API calls become the bottleneck — two network calls per lead at even 1 req/sec is 14+ hours for the LLM step alone, so this needs batching/concurrency and likely a queue-based worker setup rather than n8n's default in-memory execution. Free-tier LLM rate limits won't survive that volume — a paid tier with a cheaper default model and escalation-only-when-ambiguous would be needed. Single-row Postgres inserts should become batched upserts (`COPY` or multi-row `INSERT`). And flagged-row review, fine to eyeball at 10 rows, needs a dashboard with counts by failure reason rather than a table a human scrolls.

## Tech Stack
n8n · OpenRouter (LLM) · Postgres / Supabase · Python (reference implementation) · disify.com (free domain/email validation)

---
**Built by Rochak Singhal** — [Portfolio](https://github.com/rochaksinghal01/AI-PM-Portfolio)
