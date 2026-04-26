# User Journey Map

## What This Prompt Does
Produces a complete, structured customer journey map across five stages (Awareness → Consideration → Onboarding → Retention → Loyalty) with real customer voice quotes in every cell, region/persona-specific context, four prioritised recommendations tied to metrics, and a 12-word journey snapshot. Output is clean Markdown, ready to paste into Notion, Confluence, or a deck.

## When to Use
- Discovery and problem framing before a major feature build
- OKR planning — identify where users drop off and set retention goals
- Cross-functional alignment (product, design, marketing, CS) on user pain points
- Presenting user empathy to leadership without needing a full research readout
- Identifying "HMW" (How Might We) opportunities for a design sprint

## Inputs Required
1. Product name and a one-line description
2. Goal — engagement / adoption / revenue / retention / other
3. Core problem you're trying to solve
4. Region/persona — market, segment, and key traits

---

## Prompt

```
You are a senior journey-mapping assistant.

First, ask ONLY these four questions in ONE line, then wait for my reply:
1) Product (name + 1-line description)
2) Goal (engagement / adoption / revenue / retention / other)
3) Core problem
4) Region/persona (market, segment, traits)

After I answer, produce the following — strictly in Markdown, ≤280 words total:

---

## Customer Journey Map

Stages: Awareness | Consideration | Onboarding | Retention | Loyalty

For each stage, fill all five rows. Rules:
- Max 2 bullets per cell, each ≤7 words
- Include ONE short customer-voice quote in the Experience row per stage
- Include ONE short customer-voice quote in the Pain Points row per stage
  (e.g., "Too many steps", "Feels risky", "Can't find it")

Rows:
- Customer actions — concrete action verbs
- Touchpoints — exact channels or surfaces (e.g., Google Ad, in-app tooltip, CS email)
- Experience — 1 feeling word + 1 direct customer quote
- Pain points — specific friction + 1 direct customer quote
- Opportunities (HMW) — 1 "How might we…" statement per stage

Render as this exact table:

| Row \ Stage | Awareness | Consideration | Onboarding | Retention | Loyalty |
|---|---|---|---|---|---|
| Customer actions | ... | ... | ... | ... | ... |
| Touchpoints | ... | ... | ... | ... | ... |
| Experience | [feeling] "quote" | [feeling] "quote" | [feeling] "quote" | [feeling] "quote" | [feeling] "quote" |
| Pain points | [friction] "quote" | [friction] "quote" | [friction] "quote" | [friction] "quote" | [friction] "quote" |
| Opportunities (HMW) | ... | ... | ... | ... | ... |

---

## Top 4 Recommendations (prioritised)

Tie each recommendation to my stated goal and a single measurable metric.

Format exactly:
1) **[Action verb + what]** to fix [pain at stage] ⇒ **[Metric]** (Effort: S/M/L)
2) ...
3) ...
4) ...

---

## Journey Snapshot (≤12 words)

One sentence: from core problem → first moment of value → habit formed.

---

Rules:
- Be region/persona-specific — use local channels, norms, and language cues
- No fluff, no extra sections, no explanations outside the structure
- Prefer strong verbs, concrete nouns, and plain English throughout
```

---

## Example Output (Partial)

| Row \ Stage | Awareness | Onboarding |
|---|---|---|
| Customer actions | Googles "CX analytics tool" | Sets up first dashboard |
| Touchpoints | Google Search, G2 reviews | In-app onboarding checklist |
| Experience | Curious "Is this better than what I have?" | Confused "Where do I even start?" |
| Pain points | Too many similar options "They all look the same" | Setup takes too long "I don't have 30 mins for this" |
| Opportunities (HMW) | HMW make our differentiation obvious in 5 seconds | HMW get users to first insight in under 3 minutes |

**Top Recommendations:**
1. **Add ROI calculator on landing page** to fix indecision at Consideration ⇒ **Trial signup rate** (Effort: S)

---

## Tips
- The **HMW row** is your design sprint input — run it directly as workshop prompts.
- The **Effort S/M/L tag** on recommendations helps engineering quickly flag what's feasible this sprint.
- For a **B2B product**, add a second persona row for the economic buyer vs. the end user — their journeys diverge at Consideration.
- Export to Notion: paste the Markdown table directly — it renders perfectly.
