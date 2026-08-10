# Product planning

## Product boundary

One run investigates exactly one canonical company domain. Repeated submissions create immutable research runs on the existing account. The account, not an email address, is the unit of qualification and suppression.

The interview build researches the account, produces evidence-backed ingredient opportunity ranges, ranks a buying committee, drafts outreach, and demonstrates engagement state changes. `DEMO_MODE=true` means every outbound delivery is replaced with `SAFE_TEST_EMAIL`; real-prospect delivery, automatic LinkedIn/WhatsApp, phone enrichment, CRM sync and lookalike generation are deferred.

## Sales discovery guide

These questions should be answered in a 45–60 minute workshop before synthetic defaults become production rules.

### ICP and qualification

1. What three characteristics make an account unquestionably worth pursuing?
2. What are the hard disqualifiers: geography, MOQ, certifications, payment terms, size or existing supply contracts?
3. Is the primary motion cost reduction, supplier replacement, second-source resilience, faster supply or new-product development?
4. What minimum estimated ingredient volume or revenue makes outreach worthwhile?
5. How should vertically integrated companies be treated?
6. Should subsidiaries be qualified independently or rolled into the parent account?

### Catalogue and supply capability

7. Which Knoxx products should sales prioritize, and which currently have limited capacity?
8. What specifications, pack sizes, MOQs, prices, margins, certifications and lead times can be shared?
9. Which regions can Knoxx reliably serve, and what delivery-time limits apply?
10. What substitutions or ingredient variants are acceptable?
11. Which claims are approved: cheaper, faster, more reliable, local, higher quality or lower preparation effort?
12. Which claims require evidence or legal approval before outreach?

### Demand estimation

13. How does sales currently translate meals or product output into ingredient demand?
14. Is weekly, monthly or annual volume most useful?
15. What uncertainty range requires manual review?
16. Should volume, margin opportunity or strategic value dominate qualification?

### Buying committee

17. Which roles discover, evaluate, approve and purchase bulk ingredients?
18. Who is typically the champion, technical approver, economic buyer and blocker?
19. Which titles have historically produced replies, meetings and wins?
20. When should procurement precede R&D/NPD, and when should that order reverse?
21. How many people at one organization may be contacted concurrently?
22. What signals justify switching to another stakeholder?

### Messaging and pipeline

23. Which pains repeatedly resonate with each persona?
24. What proof points, case studies and references are approved?
25. What is the preferred CTA: sample, price comparison, supplier review or discovery meeting?
26. What cadence and maximum attempts are acceptable?
27. Which events stop one contact versus the entire organization?
28. What are the exact CRM stages and exit criteria?
29. Who owns approval and follow-up after engagement?
30. Which pilot metrics define success: time saved, precision, replies, meetings or pipeline value?

## Agent contracts

### Account Intelligence & Fit Agent

Input: canonical account, bounded evidence pages and synthetic catalogue tool. Output: company resolution, dishes, ingredients, scale and service signals, pain hypotheses, catalogue candidates and formula inputs. It cannot calculate final quantity, score the account, choose a contact or send anything.

Every finding contains `evidence_strength` (`observed`, `inferred`, `hypothesis`), `confidence`, and source keys. Unknown inputs remain null.

### Buying Committee Agent

Input: research result, Apollo candidates and synthetic historical persona outcomes. Output: 3–5 explained candidates. A deterministic weighted calculation produces final ranking:

`0.40 role relevance + 0.25 authority + 0.20 pain alignment + 0.10 history + 0.05 data confidence`

### Outreach Strategy Agent

Input: one approved contact, cited account pains, approved claims and CTA. Output: touches on business days 0, 3, 7 and 12. It can draft but cannot approve, choose the delivery recipient or send.

### Engagement controller

This is a deterministic state machine, not an agent. The reply classifier may propose an event type; only the controller applies idempotent stop rules.

## Deterministic decisions

### Quantity

For each matched ingredient:

`annual kg = annual meals × applicable dish share × kg per meal`

Low/base/high use 0.75/1.00/1.25 multipliers in the demo. Weekly is annual/52 and monthly is annual/12. Any missing or non-positive input returns `insufficient_evidence`.

### Qualification

- Product applicability: 0–40
- Evidence specificity: 0–25
- Scale/volume suitability: 0–20
- Supply-area feasibility: 0–15
- Risk penalty: 0 to −30

`75+ qualified`, `55–74 review`, `<55 disqualified`.

### Stop rules

- CTA click: increase intent only; scanners can create false clicks.
- Positive reply, meeting, manual engagement or opportunity: pause all other contacts at the account.
- Contact unsubscribe or hard bounce: suppress contact and pause account for review.
- Organization-wide negative reply: suppress account.
- Out of office: pause contact until detected return date.
- Duplicate webhook: no state change because `idempotency_key` is unique.

## Evaluation strategy

n8n’s native Evaluation Trigger and Evaluation nodes are included in each AI workflow. Production and evaluation inputs converge before the agent. Evaluation mode records:

- Schema validity and citation coverage.
- Unsupported source keys.
- Qualification-tier agreement.
- Contact count, deterministic rank agreement and verified-email gating.
- Four-touch cadence, CTA, unsubscribe, unsupported claims and safe-recipient enforcement.
- Classifier accuracy while requiring ambiguous replies to route to manual review.

Golden cases live in `evaluation-data/`. The native n8n dataset is created from the CSV files after import.

## Assumptions to validate

- The Knoxx catalogue, service regions, rules and historical outcomes are synthetic.
- Snapfresh is the golden account; Kitchen Food Company exercises incomplete evidence; Leggo’s exercises parent resolution and vertical-integration risk.
- Only verified work emails can be activated.
- Australia is the initial compliance context; production requires reviewed lawful basis, sender identity, authentication and suppression/unsubscribe handling.
- A real CRM becomes the source of truth only after the interview build.

## Remaining interview-preparation tasks

- [ ] Rehearse question 4: how the system accepts and processes 1,000+ account requests, identifies prior account ownership/activity, recovers partial failures and controls provider cost. The complete answer and cost equation are in the README under “Interview question 4 — scaling to 1,000+ account requests.”
- [ ] Replace illustrative capacity assumptions with observed p50/p95 timings and provider usage from the pilot run.
- [ ] Record cost per started, completed and qualified account before proposing a production budget.
