# Lead Scoring Workflow — Planning Doc (v2)

Nothing gets rebuilt or pushed until this is signed off. This replaces the ad-hoc approach from
v1 — that jumped to building before the use cases were actually enumerated, which is the real
complaint, not just the README's writing quality.

## 1. Problem, restated

Inbound leads arrive as a messy list from multiple sources. Before anyone can act on them, each
lead needs to be cleaned, enriched, and prioritized so the team calls the right person first.
The deliverable is a workflow — not a one-off script — that keeps running when individual rows
are bad. The grading file is different from the sample, so the design target is "handles the
category of problem," not "handles these 10 rows."

**Success criteria, concretely:**
- Every row in the input produces exactly one output row. Never fewer (dropped), never crashes
  (run stops early).
- A human can look at the output and immediately tell which rows need manual review, and why.
- Priority reflects actual buying signal in the notes, not just data completeness — a lead with
  a broken email but a hot note is still a hot lead.
- The workflow is legible to a reviewer without them having to ask me what a field means.

## 2. Use-case inventory (from the 10 sample rows)

Each row exercises a distinct scenario. Listing them as use cases, not just "flags," because the
point is to design for the scenario, not patch the symptom.

| Row | Scenario | What it actually tests |
|---|---|---|
| L001 | Clear ask + deadline ("quote by Friday") | Baseline high-intent detection |
| L002 | Budget approved + close-this-quarter, via referral | High intent stated explicitly; does source (referral) matter? |
| L003 | Invalid email (no `@`), vague ask ("sometime") | Enrichment fallback when email is unusable; low-confidence domain guess |
| L004 | Empty notes | Nothing to reason about — must default sensibly, not hallucinate a priority |
| L005 | Same email as L001, different name/company spelling, "following up" | Duplicate detection; also loses cross-row context (this row literally references L001's quote and nothing in a per-row pipeline knows that) |
| L006 | Missing company, email domain is `fastmail.com` | **New finding, not handled in v1:** `fastmail.com` is a free/personal webmail domain, not a company. My current domain-derivation logic would report "fastmail.com" as the lead's company domain, which is wrong. Same problem applies to gmail.com, yahoo.com, outlook.com, hotmail.com, icloud.com, proton.me, etc. |
| L007 | Explicit "not interested... revisit next year" | Low priority, but a different kind of low than L004 or L008 — this is a nurture-later lead, not a dead one. Worth distinguishing from "no signal" low. |
| L008 | Gibberish notes | LLM/agent must recognize unreadable input and not confidently assign a priority to noise |
| L009 | Long, detailed, multi-vendor enterprise note, source = event | Tests whether the model extracts the real signal from a dense paragraph without losing it in the length; also the only non-web/referral source in the sample — does source change anything today? (No — it's currently ignored entirely.) |
| L010 | Malformed email (`rohan@@mesh.com`), clear near-term ask ("demo next week") | Confirms a broken email must not suppress a genuinely hot lead's priority — data-quality flag and priority score have to stay decoupled |

## 3. Gaps this surfaces in the v1 design

Being direct about what's actually wrong, not just what's cosmetically incomplete:

1. **Personal/free email domains get misreported as company domains.** L006 exposes this
   directly. Fix: maintain a small denylist of common free-mail domains (gmail, yahoo, outlook,
   hotmail, icloud, proton, fastmail, aol, mail, zoho...) and when the email's domain matches
   one, do **not** report it as the company domain — flag `domain_source: personal_email`
   instead and fall back to the company-name guess (or leave domain null if company is also
   missing).
2. **Lead source is captured but never used.** `source` (web/referral/event) is stored but has
   zero influence on anything. A PM call to make explicitly rather than leave implicit: should
   referral/event leads get a mild priority boost, or is that scope creep beyond "read the notes
   and prioritize"? I lean toward *not* baking this into the score — the brief asks specifically
   for notes-driven prioritization — but it should at least be visible to the reviewer as a
   considered-and-rejected option, not silently absent.
3. **No cross-row context.** L005 literally follow-ups on L001. A per-row pipeline can't know
   that without a lookup step keyed on email/company before scoring. Worth doing (it's cheap: a
   pre-pass that groups by email and passes prior-row summaries into the same-email lead's
   prompt) — flagging as a decision point rather than assuming it's out of scope.
4. **"Low priority" is currently one bucket for three different situations**: explicit
   not-interested (L007), no information at all (L004), and unreadable input (L008). A reviewer
   looking at three "low"s with no distinction can't tell which ones are worth a nurture
   sequence vs. which are just noise. Proposing the summary field carry that distinction in
   plain language (it already does, loosely) but want to confirm that's sufficient rather than
   adding a fourth priority tier.
5. **Duplicate/lead_id collision policy was never made explicit.** Today's upsert is "last write
   wins" on `lead_id` conflict. If the grading file has legitimate re-submissions of the same
   lead_id with updated info, that's correct. If it has accidental duplicate lead_ids for
   different people, silently overwriting is wrong. Need to decide which the grading file is
   more likely to contain, or handle both by keeping history instead of overwriting.

## 4. Anticipated edge cases beyond the sample (grading file is unseen)

- CSV with genuinely ragged rows (handled) vs. extra header columns entirely (not yet handled —
  what if the grading file has an extra `phone` or `region` column?). Current parser assumes a
  fixed 6-column header; it should instead read whatever header row it's given and adapt.
- Non-English notes.
- Extremely long notes that risk hitting model context/token limits.
- Raw notes containing HTML/script fragments — should be treated as inert text, never
  rendered or executed anywhere downstream.
- Fully duplicate rows (identical in every field, not just same email).
- `source` values outside {web, referral, event} — already tolerated (lowercased, falls back to
  "unknown"), no change needed.

## 5. Architecture (per your call: AI Agent + tools, not a plain LLM chain)

- **Agent** receives `lead_id`, `name`, `company`, `raw_notes`, `source`, and the already-cleaned
  email/domain fields (structural cleaning stays a deterministic pre-step — no reason to make an
  LLM decide whether an email has an `@` in it).
- **Tool 1 — domain/email check (disify)**: agent calls this itself when it decides enrichment
  data would change its confidence, rather than it always running first. Personal-email-domain
  detection (gap #1 above) happens as a deterministic pre-step before the agent even runs, since
  that's a lookup, not a judgment call.
- **Output**: structured parser enforcing `{priority: high|medium|low, summary: string,
  confidence: low|medium|high}` — adding `confidence` as a new field so gibberish (L008) and
  genuinely-clear-but-low-priority (L007) don't look identical in the output table.
- Deterministic ingestion/cleaning stays in Code nodes (fast, free, testable) — only the
  judgment call (reading notes, deciding priority, deciding whether enrichment is worth calling)
  goes through the agent.

## 6. What I need a decision on before building

1. Source-as-signal (§3.2): leave it recorded-but-unused, or fold it into the prompt as context
   the agent can weigh?
2. Cross-row context for repeat leads (§3.3): worth building, or explicitly out of scope for
   this exercise?
3. Duplicate `lead_id` policy (§3.5): last-write-wins (current), reject/flag instead, or version
   history?
4. Adding `confidence` as a fourth output field (§3.4) — agree, or handle the low/low/low
   ambiguity a different way?

Once these four are settled, I'll rebuild the workflow against this doc, validate it row-by-row
against the table in §2 (not just "it ran without errors"), and only then push to GitHub.
