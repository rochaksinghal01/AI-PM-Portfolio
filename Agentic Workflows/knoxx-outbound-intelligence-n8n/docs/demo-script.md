# Ten-minute reviewer walkthrough

## 1. Frame the decision (one minute)

The product does not “send AI emails.” It converts public account evidence into an inspectable sales decision while keeping calculations, approval and state mutations outside the agents.

Show `architecture-clean.png` and call out the four trust boundaries: retrieval, model judgment, deterministic controls and human approval. Use the Miro source only if the interviewer asks for an editable board.

## 2. Start one account run (one minute)

Open the pipeline and select **Research account**. Enter `https://snapfresh.com.au`. Explain that a repeated domain creates a new immutable run on the existing account rather than a duplicate account.

## 3. Inspect the account report (two minutes)

Open Snapfresh and show:

- Observed scale signals and their sources.
- Pain statements labeled inferred or hypothesis.
- Detected dishes and ingredient evidence.
- Qualification component scores and explicit risk penalty.

Switch to Kitchen Food Company to explain why missing recipe/scale inputs produce lower confidence rather than fabricated quantities. Mention Leggo’s parent resolution and vertical-integration penalty.

## 4. Explain ingredient demand (one minute)

Open **Ingredient match**. Show the synthetic catalogue label, match percentage and low/base/high weekly, monthly and annual ranges. Call out `insufficient_evidence` for pasta where production share is unknown.

## 5. Review the buying committee (one minute)

Open **Buying committee**. Explain that Apollo search creates a candidate set, enrichment is limited to the top candidates, and the agent proposes component scores. The workflow recomputes the 40/25/20/10/5 weighted total deterministically. Fixture contacts are visibly fictitious.

## 6. Demonstrate approval and safe send (two minutes)

Open **Outreach**. Review the four touches and evidence-backed claim. Approve the sequence, then activate the safe demo. Explain that the n8n Gmail node remains disabled in source control and, after review, replaces every intended recipient with `SAFE_TEST_EMAIL` immediately before delivery.

## 7. Exercise stop rules (one minute)

- Click **CTA click**: intent rises, but the sequence continues because scanners can click links.
- Click **Positive reply**: all other contacts and active sequences pause.
- Reset and click **Meeting booked**: the account moves to `meeting_booked` and all other contacts pause.

Mention duplicate webhook idempotency, contact suppression and organization-wide negative reply handling.

## 8. Close with evaluation (one minute)

Open the n8n Evaluations tab for WF02, WF04, WF05 and WF06. Show the frozen Data Tables and deterministic metrics next to the independent Gemini judge. Explain that a judge can add semantic evaluation but cannot override failed citation, safety, recipient or stop-rule checks.

## Failure cases to demonstrate if asked

- Firecrawl returns partial pages: preserve `failed_partial`, evidence obtained so far and a review flag.
- Model returns malformed JSON: retry once, then preserve the failed run.
- Apollo returns no match: keep the account qualified but route contacts to review.
- Unverified email: rank the person but mark activation ineligible.
- Forbidden claim: fail outreach validation before approval.
- Duplicate booking webhook: unique key prevents a second state change.
- Suppressed contact: final send query returns no eligible message.
