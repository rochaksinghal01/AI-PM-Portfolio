# Product Roadmap Generator

## What This Prompt Does
Generates a complete, delivery-ready product roadmap in Markdown — with milestone gates (Alpha/Beta/UAT/GA), an ASCII Gantt swimlane chart across Engineering, Design, QA, and Marketing, a dependency and risk register, and a launch checklist. Timeline is precise to any fixed dates you provide.

## When to Use
- Quarterly planning — align the whole team on what ships when
- PRD appendix — attach a roadmap to your product spec
- Engineering kickoff — give the team a clear lane-level view
- Leadership reviews — a one-page roadmap beats a 20-slide deck
- Stakeholder alignment — surfaces dependencies and risks before they become incidents

## Inputs Required
1. Product name + the single feature being built
2. Total duration (e.g., 12 weeks, 6 months, 4 quarters)
3. Time scale for the roadmap (weeks / months / quarters)
4. Any fixed dates (partner demos, conference launches, board reviews)

---

## Prompt

```
You are a senior product/program planner.

First, ask me these questions in one message:
1) Product name + the single feature we're building
2) Total duration (e.g., 12 weeks, 6 months, 4 quarters)
3) Time scale for the roadmap (weeks / months / quarters)
4) Any fixed dates (e.g., partner demo, conference, board review)

Then wait for my reply.

After I answer, produce a detailed roadmap in Markdown:

---

=== ROADMAP OVERVIEW ===

- **Objective**: 1-line outcome for the feature
- **Duration & Scale**: <total> at <weeks/months/quarters>
- **We are here**: marker at current period

---

=== MILESTONES & GATES ===

Place each milestone on the timeline with entry and exit criteria:

- **◆ Alpha (internal dogfood)**
  Entry: core flow clickable; mock data OK
  Exit: P0 functional path works; crash-free >97%; basic logs in place

- **◆ Beta (limited external)**
  Entry: real data; auth/payments/integrations behind feature flags
  Exit: P0/P1 bugs fixed; D7 retention ≥ target; error rate within SLO

- **◆ UAT (release candidate)**
  Entry: feature-complete; performance tests done
  Exit: 0 open P0s; ≤2 P1s with workarounds; sign-offs from PM, Eng, QA, Design

- **★ GA (public launch)**
  Entry: launch checklist ready (runbooks, oncall rotation, analytics events, docs)
  Exit: deployment complete; rollback plan tested; comms executed

---

=== SWIMLANES (ASCII Gantt) ===

Use the chosen time scale across columns.
- Use █ for active work periods
- Use ░ for buffer/slack
- Put dependencies in (parentheses)

Header format (adapt to my scale):
| Team/Period | P1 | P2 | P3 | P4 | P5 | P6 |

Include exactly these swimlane rows:

| Engineering — Frontend | ... | ... | ... | ... | ... | ... |
| Engineering — Backend  | ... | ... | ... | ... | ... | ... |
| Design                 | ... | ... | ... | ... | ... | ... |
| Testing (QA)           | ... | ... | ... | ... | ... | ... |
| Marketing              | ... | ... | ... | ... | ... | ... |

Populate each row with 5–10 concrete, shippable work chunks. Examples to adapt:

- FE: scaffolding, UI kit, state management, feature views, a11y audit, telemetry, experiments
- BE: schema design, APIs, services, auth, rate limits, observability, feature flags
- Design: user research, user flows, wireframes, hi-fi mockups, prototypes, UX copy, design QA
- QA: test plan, environment setup, contract tests, regression suite, performance testing, UAT, release sign-off
- Marketing: messaging framework, feature naming, website copy, pre-launch campaigns, launch ops, CS enablement

---

=== TABLE RENDER ===

1. A header table showing all periods with milestone markers (◆ Alpha, ★ GA) placed at their exact periods.

2. A swimlane table:

| Team/Period | P1 | P2 | P3 | P4 | ... |
|-------------|----|----|----|----|-----|
| Eng—FE      | ███ (Design v1) | ███ | ░ buffer | ... |
| Eng—BE      | ... | ... | ... | ... |
| Design      | ... | ... | ... | ... |
| QA          | ... | ... | ... | ... |
| Marketing   | ... | ... | ... | ... |

Use █ for work blocks and ░ for buffer. Add notes in parentheses for key outputs or dependencies.

---

=== DEPENDENCIES & RISKS ===

List 5–8 cross-team dependencies (e.g., FE blocked on API v1 from BE).
For each risk, provide:
- Risk description
- Mitigation
- Whether a buffer period or feature flag covers it

---

=== METRICS & CHECKLISTS ===

**Instrumentation**
- Key events to track
- Dashboards to create
- Alerts to set up

**Quality Bars**
- Performance SLOs (latency, error rate)
- Accessibility standard (WCAG level)
- Security checks required

**Launch Checklist**
- [ ] Docs published
- [ ] Runbook written
- [ ] Rollback plan tested
- [ ] Comms sent (internal + external)
- [ ] Support team briefed

Keep the entire output scannable. Reflect any fixed dates precisely on the timeline. No extra commentary outside the structure.
```

---

## Example Swimlane (6-Month Feature)

| Team/Period | M1 | M2 | M3 | M4 | M5 | M6 |
|---|---|---|---|---|---|---|
| Eng—FE | ███ scaffolding | ███ UI kit + state | ███ feature views | ░ buffer | ███ a11y + telemetry | ░ |
| Eng—BE | ███ schema + APIs | ███ services | ███ auth + flags | ███ rate limits | ░ buffer | ███ observability |
| Design | ███ research + flows | ███ wireframes | ███ hi-fi + prototype | ███ UX copy + QA | ░ | ░ |
| QA | ░ test plan | ███ env setup | ███ contract tests | ███ regression | ███ perf + UAT | ███ sign-off |
| Marketing | ███ messaging | ░ | ███ website copy | ███ pre-launch | ███ launch ops | ███ CS enablement |

**Milestones:** ◆ Alpha: End M2 · ◆ Beta: End M4 · ◆ UAT: Mid M5 · ★ GA: End M6

---

## Tips
- Give the AI your **fixed dates first** — it will anchor the Gantt to them and work backwards.
- The **buffer rows (░)** are not wasted time — they are where scope creep and regressions get absorbed. Don't cut them.
- Use the **launch checklist** as a literal checklist in Linear or Notion — create tasks directly from it.
- For **quarterly roadmaps**, use Q1/Q2/Q3/Q4 as the time scale, and place milestones within quarters.
