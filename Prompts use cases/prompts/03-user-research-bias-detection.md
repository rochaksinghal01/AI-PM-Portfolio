# User Research & Bias Detection

## What This Prompt Does
Acts as your user research strategist. It generates tailored research questions (interviews, FGDs, or surveys), then audits those questions for hidden bias and rewrites them to be neutral and actionable. Delivers a ready-to-use interview guide or downloadable survey document.

## When to Use
- Before building a new feature — validate the problem first
- Planning a discovery sprint or user research round
- Preparing interview scripts for UX research
- Creating surveys for NPS deep-dives or JTBD mapping

## Inputs Required
1. Your product and what it does
2. Research format preference — interviews, focused group discussions (FGDs), or surveys

---

## Prompt

```
You are my user research strategist. I want to discover my users' pain points, jobs to be done, desired gains, and what they truly want from my product.

Begin by asking me only: "What is your product, and what does it do?"

After I share this, validate my answer by briefly summarising from your own understanding:
- Who the target customer is
- What their typical user journey looks like
- How they are likely to experience my product

Then confirm with me if your understanding matches mine.

Next, ask me: "What format of user research do you want to pursue—interviews, focused group discussions, or surveys?"

Based on my choice, generate 8–10 tailored research questions that I can ask my users to uncover their:
- Pain points
- Motivations
- Jobs-to-be-done
- Barriers
- Unmet needs

After drafting these questions, analyse them for hidden biases (leading, assumptive, or overly complex framing). Explain clearly where bias exists, and then refine/tweak the questions to ensure they are neutral and unbiased, while still actionable.

Once the questions are finalised, ask me if I'd like you to generate a ready-to-use interview guide or sample survey.

If an interview guide is chosen, structure it with sections (intro, warm-up, core JTBD/pain point questions, wrap-up), and include short examples that clarify what kind of answers I might hear.

If a survey is chosen, format it with multiple-choice or Likert-scale options wherever possible (instead of only open text), while keeping a balance between qualitative depth and quantitative ease.

In the final deliverable, provide a clean, professional guide/survey document that I can directly use with my end-users, and enrich it with a few illustrative examples or sample responses to help me better understand and interpret potential user feedback.

Throughout the process, ensure the output is concise, actionable, and easy to consume (≤200 words per section), while giving me the option of receiving the final material in either text summary, table, or downloadable file format.
```

---

## Example Interview Guide Structure

```
Section 1 — Introduction (2 min)
  "Thanks for joining. This session is about understanding your experience with X. There are no right or wrong answers."

Section 2 — Warm-Up (3 min)
  Q1: "Can you walk me through how you currently handle [task]?"

Section 3 — Core JTBD / Pain Points (15 min)
  Q2: "What's the most frustrating part of [current workflow]?"
  Q3: "When was the last time [task] didn't go as expected? What happened?"

Section 4 — Wrap-Up (5 min)
  Q8: "If you could change one thing about [product/process], what would it be?"
```

---

## Tips
- The bias audit is the most valuable part — let the AI rewrite your questions before running any research.
- For surveys, Likert scales on pain points give you quantifiable data you can later prioritise by RICE.
- Save the final guide as a team artifact — it becomes the research protocol for your sprint.
