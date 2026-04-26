# AI Prompt Library for Product Managers

A collection of 10 production-ready prompts covering the full PM workflow — from market sizing and user research through roadmapping, persona building, and LLMOps observability. Each prompt is self-contained, reusable, and works with any major AI model (Claude, ChatGPT, Gemini).

---

## Prompt Index

### Strategy & Discovery

| # | Prompt | What It Does | Time Saved |
|---|---|---|---|
| 01 | [Market Size (TAM/SAM/SOM)](./01-market-size-tam-sam-som.md) | Step-by-step market sizing with executive summary | 4–6 hrs → 15 min |
| 02 | [Feature & Competitive Analysis](./02-feature-competitive-analysis.md) | Auto-identifies competitors, builds feature matrix, recommends gaps to fill | 3–5 hrs → 10 min |
| 03 | [User Research & Bias Detection](./03-user-research-bias-detection.md) | Generates interview/survey questions, audits for bias, delivers ready-to-use guide | 2–4 hrs → 20 min |

### Prioritisation & Planning

| # | Prompt | What It Does | Frameworks Covered |
|---|---|---|---|
| 04 | [Feature Prioritisation](./04-feature-prioritisation.md) | Scores and ranks features using your chosen framework, outputs a Now/Next/Later roadmap | RICE, MoSCoW, Kano, Impact vs Effort, Triangulate |
| 08 | [Product Roadmap Generator](./08-product-roadmap.md) | Full roadmap with milestones, ASCII Gantt swimlanes, dependency register, and launch checklist | Alpha/Beta/UAT/GA gates |

### User Understanding & Narrative

| # | Prompt | What It Does | Output Format |
|---|---|---|---|
| 05 | [Persona Storybook](./05-persona-storybook.md) | Cinematic 250–400 word user story with regional authenticity | Prose narrative |
| 06 | [Customer Persona Builder](./06-customer-persona-builder.md) | Visual 1920×1080 persona card + structured JSON | PNG image + JSON |
| 07 | [User Journey Map](./07-user-journey-map.md) | 5-stage journey map with customer voice quotes and HMW opportunities | Markdown table |

### AI / LLMOps

| # | Prompt | What It Does | Build Type |
|---|---|---|---|
| 09 | [LLMOps Dashboard — Frontend](./09-llmops-dashboard-frontend-lovable.md) | High-fidelity clickable prototype for PM/business/engineering audiences | Lovable prototype |
| 10 | [LLMOps Dashboard — Full-Stack](./10-llmops-dashboard-fullstack-claude.md) | Production-ready middleware + metrics engine + React dashboard | FastAPI + React |

---

## How to Use Any Prompt

1. Open the `.md` file for the prompt you need
2. Copy the text inside the ` ```prompt``` ` code block
3. Paste it into Claude, ChatGPT, or Gemini
4. Answer the AI's questions — each prompt tells you exactly what inputs it needs
5. Use the output directly in your PRD, deck, or planning doc

---

## Prompt Design Principles

Every prompt in this library is built to:

- **Minimise your input** — the AI asks only what it needs, nothing more
- **Confirm before proceeding** — no assumptions are made silently
- **Be audience-aware** — outputs adapt to executives, engineers, or designers
- **Deliver structured output** — tables, markdown, JSON, or images that paste directly into tools
- **Stay honest** — simulated data is labelled as simulated; proxy metrics are explained

---

## Tool Compatibility

| Prompt | Claude | ChatGPT | Gemini | Lovable | Claude Code |
|---|---|---|---|---|---|
| 01–04 | ✅ | ✅ | ✅ | — | — |
| 05–07 | ✅ | ✅ | ✅ | — | — |
| 08 | ✅ | ✅ | ✅ | — | — |
| 09 | — | — | — | ✅ | — |
| 10 | — | — | — | — | ✅ |
