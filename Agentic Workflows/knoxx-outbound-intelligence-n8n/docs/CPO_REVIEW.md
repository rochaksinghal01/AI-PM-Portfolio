# CPO review — Knoxx Outbound Intelligence

## Verdict

**Approve a controlled pilot; do not approve a production rollout yet.**

This is a strong AI PM case study because it starts with account qualification, not content generation; uses agents only for ambiguous judgment; retains evidence and immutable runs; and keeps scoring, approval, delivery and stop rules deterministic. The live click/reply/organization-pause loop is meaningful proof.

The product is not production-ready because live Firecrawl evidence persistence is incomplete, core sales policy is still synthetic, and workspace-isolation/load/compliance checks remain.

## What was already strong

- The user can investigate one account per run and retain multiple immutable runs.
- The product decision is explainable: evidence → opportunity → fit → committee → safe activation.
- `observed`, `inferred` and `hypothesis` prevent plausible reasoning from masquerading as fact.
- Quantity is a visible range or `insufficient_evidence`, never fake precision.
- Apollo spend is controlled by searching first and enriching only one or two people.
- Human approval and a final recipient override protect the sending boundary.
- Clicks do not stop outreach; confirmed engagement stops the organization.
- Evaluation combines structured contracts, deterministic hard metrics and an independent judge.

## What I changed and why

1. **Added the user, job and outcome before the architecture.** A CPO needs to know whose decision improves and how success is measured before reviewing the stack.
2. **Changed the north star from activity to decision quality.** “Sales-accepted qualified accounts per research hour” is healthier than emails sent or accounts crawled.
3. **Added pilot metrics and guardrails.** Speed, precision, trust and unit economics make the next investment decision measurable; zero unintended sends and unsupported claims protect trust.
4. **Strengthened synthetic/live labels.** The three contacts and catalogue are explicitly synthetic. The deck does not claim fixture research is live Firecrawl proof.
5. **Changed the close to a product decision.** The recommendation is a 25-account assisted pilot, with explicit production blockers, rather than a vague claim that the system is finished.
6. **Hardened the database.** Browser execution was removed from an RLS event-trigger helper, function search paths were pinned, server-only tables were made explicit, foreign-key indexes were added and RLS identity checks were optimized.

## What I would ask the team to do next

1. Finish and prove one live Firecrawl → evidence → match → forecast → score run.
2. Review 25 accounts side-by-side with sales and record accept/reject reasons.
3. Establish baselines for research time, qualified-account precision, unsupported claims and cost per accepted account.
4. Replace synthetic qualification/catalogue assumptions with versioned, approved business rules.
5. Complete second-user RLS, load/chaos, monitoring, retention and lawful-basis/compliance checks.

## CPO scorecard

| Dimension | Assessment |
|---|---|
| Problem clarity | Strong |
| User value | Strong, now measurable |
| AI/product boundary | Excellent |
| Explainability | Excellent |
| Safety | Strong demo boundary |
| Live proof | Strong downstream; incomplete research persistence |
| Scalability design | Credible target architecture; not load-proven |
| Production readiness | Not yet |

