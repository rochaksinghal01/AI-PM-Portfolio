# Gamma master prompt

Paste the instruction below into Gamma, then upload or paste `interview-deck-gamma.md` as the source content. The project already includes a finished PowerPoint, so use Gamma only if you want an alternate visual treatment.

---

Create a polished 15-slide technical-interview presentation titled **Knoxx Outbound Intelligence** using the supplied Markdown as the only content source.

Audience: a CPO, Head of Product and senior engineering interviewer evaluating an AI Product Manager.

Story: this is an account-prioritization and evidence system, not an email-generation demo. Lead with the sales user, job to be done and measurable pilot outcomes. Then answer the four required questions: architecture, prompt engineering/model choice, live data/actionability, and trade-offs/scaling. End with a CPO decision to approve a controlled 25-account pilot—not a production launch.

Visual direction:

- 16:9 presentation.
- Premium enterprise product style.
- Deep navy, warm white, restrained orange and violet accents.
- Generous whitespace, short headlines and compact evidence cards.
- Use diagrams/tables only where they clarify a decision.
- Use `architecture-clean.png` on the architecture slide without redrawing or altering its meaning.
- Keep slide text concise enough for a 10-minute presentation.

Content rules:

- Preserve the exact distinction between **live proof**, **synthetic demo data** and **golden fixture output**.
- Do not claim that live Firecrawl evidence persistence is complete.
- Keep the current honest limitation: newest run `running`, older run `failed_partial`, live evidence/ingredient rows incomplete.
- Do not invent business impact, customer proof, savings, prices, rate limits, costs, URLs, metrics or provider capabilities.
- Preserve official source links in speaker notes or a final source area.
- Use `architecture-clean.png` as the architecture source of truth. Do not require a Miro link. Use `https://knoxx-insight-quest.lovable.app` as the live demo URL.
- Keep the presenter name exactly as written in the source.
- Clearly label the catalogue, contacts and historical outcomes synthetic.
- Do not remove human approval, safe-recipient override, RLS, idempotency or organization-wide stop rules.

Required slide sequence:

1. Title.
2. Problem and product decision.
3. User, job to be done, north star, pilot metrics and guardrails.
4. Assumptions versus questions sales must answer.
5. Architecture walkthrough with the supplied architecture image and a link to the version-controlled SVG source.
6. Raw domain to completed database state.
7. AI versus deterministic decision boundaries.
8. Prompt anatomy and product-fit prompt choices.
9. Model selection by stage.
10. Evaluation architecture and release gates.
11. Live Supabase data and downstream stop-rule proof.
12. Accuracy/actionability versus hypotheses and current gap.
13. Bottlenecks at 1,000 domains.
14. Enterprise target architecture and unit-economics story.
15. CPO verdict: controlled 25-account pilot and production blockers.

For every slide, prefer one clear decision or claim. Return the finished deck and list any content you shortened; do not silently change factual meaning.
