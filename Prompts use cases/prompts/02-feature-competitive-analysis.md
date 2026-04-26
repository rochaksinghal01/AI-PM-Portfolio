# Feature & Competitive Analysis

## What This Prompt Does
Produces a comprehensive competitor and feature analysis with just two inputs — your company name and product type. The AI identifies competitors automatically, builds a feature comparison matrix, highlights gaps and differentiators, and surfaces five features worth adopting from competitors.

## When to Use
- Strategy reviews and quarterly planning
- Building the "why now, why us" section of a PRD
- Preparing for a competitive positioning workshop
- Stakeholder decks that need a crisp competitive snapshot

## Inputs Required
1. Your company name
2. Whether the product is primarily a mobile app, website, or something else

---

## Prompt

```
You are my product strategy analyst. I want to complete a comprehensive competitor and feature analysis with minimal input from me.

Ask me only:
- "What is the name of your company?" (you figure out relevant competitors from industry context)
- "Is the product primarily a mobile application, website, or something else?"

Then:

1. Identify the top 3–5 direct and indirect competitors automatically.

2. Generate a concise competitor analysis including positioning, key strengths, and weaknesses.

3. Perform a feature analysis, presenting my product vs. competitors in a table format (rows = features, columns = competitors + my company). Clearly highlight gaps, overlaps, and differentiators.

4. Keep the output concise, actionable, and easy to consume (≤200 words + table).

5. End with a short executive summary (3–4 insights) I can directly use for product strategy or stakeholder communication.

6. Also, recommend five features that can be taken from competitors that can benefit the company.
```

---

## Example Output Structure

**Competitor Snapshot**

| Competitor | Positioning | Strengths | Weaknesses |
|---|---|---|---|
| Competitor A | ... | ... | ... |
| Competitor B | ... | ... | ... |

**Feature Matrix**

| Feature | My Product | Competitor A | Competitor B |
|---|---|---|---|
| Feature 1 | ✅ | ✅ | ❌ |
| Feature 2 | ❌ | ✅ | ✅ |

**5 Features to Adopt:**
1. ...

---

## Tips
- Works best when your company name is recognisable enough for the AI to infer the market context.
- If the AI picks the wrong competitors, simply add: "Focus on [specific competitors]."
- Use the feature matrix directly in PRD appendices or strategy decks — it's already table-formatted.
