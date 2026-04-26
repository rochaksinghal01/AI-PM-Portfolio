# Customer Persona Builder

## What This Prompt Does
Generates one or two detailed user personas — as a visual 1920×1080 PNG card and a structured JSON block — from just two inputs. Each persona covers demographics, psychographics, tech proficiency, product-specific behaviour, and outcome-oriented "what they want" statements. Inclusive, stereotype-free, and immediately usable in decks, PRDs, or research briefs.

## When to Use
- Discovery and strategy phases — get aligned on who you're building for
- PRD persona section — replace placeholder text with a real, structured persona
- Stakeholder presentations — visual format communicates faster than text paragraphs
- Design handoffs — give designers a grounded reference for decisions
- Sales and GTM decks — show the buyer you understand your customer

## Inputs Required
1. Product name and a one-line description of what it does
2. Whether you want one persona or two (primary + secondary)

---

## Prompt

```
You are a visual persona designer.

Ask me only these two questions in one line, then proceed without further questions:
1. What is the product (name + 1-line what it does)?
2. Do you want one persona or two (primary + secondary)?

After my reply, generate an image (1920×1080 PNG) with a clean poster layout:
- Title: "CASE STUDY — USER PERSONA"
- Subtle paper texture background
- Two rounded persona cards (left = Primary, right = Secondary)
- If I choose "one", centre a single large card
- Small product logo placeholder top-right
- Modern typography, clear section headers, high contrast
- Friendly, diverse face placeholders — no real people
- Language: respectful and stereotype-free

For each persona card, fill these sections with crisp, specific bullets tailored to the product's market. Invent realistic details when missing:

1. Name (label: "<Product> User") + 1-line "A day in one sentence" with the product

2. Demographics:
   - Age range
   - Location (city/region)
   - Occupation
   - Income band (₹/$ as appropriate)
   - Relationship/household if relevant
   - Digital literacy level

3. Psychographic:
   - Pains (top 3)
   - Gains (top 3)
   - Motivations
   - Values
   - Fears

4. Tech Proficiency:
   - Devices used
   - OS preference
   - App habits
   - Social media usage
   - Internet constraints (data caps, latency)
   - Accessibility needs if any

5. Product-Specific:
   - Current solutions/alternatives
   - Usage scenarios and frequency
   - Purchase drivers
   - Satisfaction level
   - Switching barriers
   - Success metric they care about

6. What they want:
   3–5 crisp outcome-oriented statements (e.g., "set-and-forget automation," "transparent pricing")

Visual formatting rules:
- Use section labels exactly as listed above
- Each bullet ≤ 12 words; 4–6 bullets per section
- Highlight Pains with a pain icon/bold label; Gains with a gain icon/bold label
- If two personas, make Secondary clearly distinct — different goals, context, constraints

Output:
- Primary deliverable: the 1920×1080 PNG persona card(s)
- Also output a compact, copyable JSON block below the image with all fields:
  Keys: name, life_with_product, demographics, psychographic {pains, gains, motivations, values, fears}, tech_proficiency, product_specific, wants
- If any info is unknown, infer plausibly from the product description and note assumptions under "assumptions" in the JSON

Accessibility & ethics:
- Avoid stereotypes; use inclusive language
- No sensitive attributes unless essential and respectful
- Use generic/AI-generated headshots, never identifiable real people

Begin now by asking only:
"Product (name + 1-liner)? One persona or two (primary + secondary)?"
```

---

## JSON Output Structure

```json
{
  "name": "Meera — Sentisum User",
  "life_with_product": "Checks the anomalies dashboard before her 9am standup every day.",
  "demographics": {
    "age_range": "28–35",
    "location": "Bengaluru, India",
    "occupation": "CX Team Lead",
    "income_band": "₹12–18 LPA",
    "digital_literacy": "High"
  },
  "psychographic": {
    "pains": ["Too many alerts, no context", "RCA takes hours", "Hard to show impact to leadership"],
    "gains": ["Faster triage", "Clear escalation path", "Stakeholder-ready summaries"],
    "motivations": "Prove CX impact with data",
    "values": "Efficiency, visibility, team trust",
    "fears": "Missing a critical trend; being blamed for delayed response"
  },
  "tech_proficiency": {
    "devices": "MacBook Pro, iPhone",
    "app_habits": "Slack, Linear, Notion daily",
    "social_media": "LinkedIn, occasional Twitter"
  },
  "product_specific": {
    "current_alternatives": "Manual Looker dashboards + Slack pings",
    "usage_frequency": "Daily",
    "success_metric": "Time-to-resolution on anomaly alerts"
  },
  "wants": ["One-click RCA", "Auto-prioritised alert feed", "Weekly digest for leadership"],
  "assumptions": ["Income band estimated based on Bengaluru CX lead market rate"]
}
```

---

## Tips
- Use **two personas** when your product has meaningfully different user types (e.g., the person who buys vs. the person who uses daily).
- The JSON output is immediately usable in PRD templates, Notion databases, or design tool components.
- If the AI's inferred details don't match your market knowledge, simply say: "Update [field] to [value]" and it will regenerate.
