# Model decisions

Model selection is configuration, not product logic. The workflow exports contain the recommended August 2026 defaults, while n8n credentials and variables allow a controlled replacement after evaluation.

## Routing matrix

| Stage | Default | Why | Reasoning | Hard gate |
|---|---|---|---|---|
| Evidence collection | Firecrawl extract/crawl; no LLM | Retrieval should preserve URLs, passages and timestamps before interpretation | N/A | Page count, domain allowlist, payload and crawl-depth limits |
| Account Intelligence & Fit Agent | `gpt-5.6-terra` | Best balance for multi-source synthesis, tool use and strict structured output without paying frontier-model cost for every account | Medium | JSON schema, known source keys, evidence labels, deterministic quantity and score |
| Buying Committee Agent | `gpt-5.6-terra` | Needs organization reasoning and reliable tool use across title variants, but receives a small bounded Apollo candidate set | Medium | Deterministic weighted rerank, 3–5 contacts, explanation and work-email status |
| Outreach Strategy Agent | `gpt-5.6-luna` | Copy generation is high-volume and bounded by already-selected evidence, persona and approved claims | Low | Four touches, required CTA/unsubscribe, forbidden-claim scan, human approval |
| Reply classifier | `gpt-5.6-luna` | Narrow classification into a fixed event taxonomy | Low | Confidence threshold; ambiguous replies become `manual_review`; LLM never mutates state |
| Independent evaluator | `gemini-3.6-flash` | A different provider reduces correlated producer/judge errors and is fast enough for dataset runs | Default | Deterministic metrics remain primary; judge score cannot bypass safety failures |
| Escalation-only adjudication | `gpt-5.6-sol` | Reserved for failed/ambiguous evaluation cases, not normal production traffic | High | Human review required after adjudication |

The current OpenAI model guide describes Terra as the balanced choice, Luna for cost-sensitive/high-volume work, and Sol for the hardest tasks. The Google model catalogue positions Gemini 3.6 Flash as its speed/intelligence balance with tool and structured-output support. See [OpenAI models](https://developers.openai.com/api/docs/models), [OpenAI latest-model guide](https://developers.openai.com/api/docs/guides/latest-model), and [Gemini models](https://ai.google.dev/gemini-api/docs/models).

## Why not one model everywhere?

- Extraction, judgment, calculation and state mutation have different failure modes.
- A single provider as producer and judge can reward its own stylistic errors.
- Deterministic calculations are cheaper, testable and auditable.
- Stronger models are reserved for tasks where additional reasoning measurably improves golden-case results.

## Promotion criteria

A replacement model is promoted only if it passes all safety gates and improves the weighted evaluation score without breaching the agreed latency/cost budget.

| Metric | Minimum |
|---|---:|
| Valid structured output | 99% |
| Finding citation coverage | 95% |
| Unsupported factual claim rate | 0% on golden cases |
| Qualification tier agreement | 90% |
| Contact top-three persona agreement | 85% |
| Outreach compliance checks | 100% |
| Account stop-rule tests | 100% |

Log model ID, prompt version, latency, token usage and evaluation dataset version on every evaluated run. Never silently fall back from a failed structured response to unvalidated prose.

## Cost and latency controls

- Bound crawl input before the model: 25 pages and 18,000 characters per page in the interview build.
- Cache retrieval by content hash; reruns can reuse unchanged evidence.
- Enrich only the top candidates after Apollo search.
- Generate outreach only for the first 1–2 activated contacts.
- Retry malformed structured output once; then preserve a `failed_partial` result for review.
- Run the independent judge in evaluation mode and on sampled production runs, not on every ordinary run.

