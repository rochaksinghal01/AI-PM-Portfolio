# Miro-ready architecture diagrams

Open a Miro board, select **Tools, Media and Integrations → Mermaid Diagrams**, paste one block at a time, and choose **Add to board**. Keep this file as the version-controlled source of truth.

## 1. End-to-end system architecture

```mermaid
flowchart LR
  classDef human fill:#FFF4D6,stroke:#B98422,color:#392D17
  classDef app fill:#E9F1EA,stroke:#4B7659,color:#1C3825
  classDef orchestration fill:#EEEAF8,stroke:#6657A4,color:#30275A
  classDef provider fill:#E7F2F5,stroke:#3F7381,color:#173841
  classDef data fill:#F2F2EC,stroke:#767A71,color:#2D302A
  classDef safety fill:#FBE8E6,stroke:#A9534D,color:#4B211E

  User[Sales operator]:::human --> UI[Lovable React app]:::app
  UI --> Auth[Supabase Auth]:::app
  UI --> Edge[Protected Edge Functions]:::app
  Edge --> DB[(Supabase Postgres + RLS)]:::data
  Edge --> Orchestrator[WF01 Account intake]:::orchestration

  Orchestrator --> Evidence[WF02 Evidence + Fit Agent]:::orchestration
  Evidence --> Firecrawl[Firecrawl web and PDF extraction]:::provider
  Evidence --> AccountAgent[GPT-5.6 Terra Account Agent]:::provider
  AccountAgent --> Catalog[Knoxx catalogue lookup tool]:::data
  Evidence --> Rules[Deterministic scoring and quantity ranges]:::safety

  Rules --> Committee[WF04 Buying Committee Agent]:::orchestration
  Committee --> Apollo[Apollo search then enrichment]:::provider
  Committee --> ContactAgent[GPT-5.6 Terra Ranking Agent]:::provider

  ContactAgent --> Outreach[WF05 Outreach Strategy Agent]:::orchestration
  Outreach --> CopyModel[GPT-5.6 Luna copy generation]:::provider
  Outreach --> Approval{Human approval gate}:::human
  Approval -->|Approved| SafeSend[Allowlisted Gmail adapter]:::safety
  Approval -->|Rejected| Drafts[Return to drafts]:::data

  SafeSend --> Events[WF06 Engagement controller]:::orchestration
  CTA[Tracked CTA]:::provider --> Events
  Replies[Gmail replies / booking webhook]:::provider --> Events
  Events --> StopRules[Deterministic account stop rules]:::safety
  StopRules --> DB
  DB --> UI

  Evidence -. evaluation dataset .-> Eval[Native n8n Evaluations]:::orchestration
  Committee -. evaluation dataset .-> Eval
  Outreach -. evaluation dataset .-> Eval
  Eval --> Judge[Gemini 3.6 Flash independent judge]:::provider
  Eval --> Metrics[(Schema, evidence, ranking, safety metrics)]:::data
```

## 2. Target-state research and qualification architecture

> Portfolio target state, not the current demo workflow. The demo keeps one research agent plus deterministic scoring; the intended product adds an independent production critic before the policy gate.

```mermaid
flowchart LR
  classDef input fill:#E7F2F5,stroke:#3F7381,color:#173841
  classDef agent fill:#EEEAF8,stroke:#6657A4,color:#30275A
  classDef tool fill:#F2F2EC,stroke:#767A71,color:#2D302A
  classDef safety fill:#FBE8E6,stroke:#A9534D,color:#4B211E
  classDef human fill:#FFF4D6,stroke:#B98422,color:#392D17
  classDef output fill:#E9F1EA,stroke:#4B7659,color:#1C3825

  Evidence[Bounded website and PDF evidence]:::input --> Research[Agent 1: Research and Opportunity Mapping]:::agent
  SalesNotes[Sales context and account notes]:::input --> Research
  Research --> Catalog[(Live Knoxx catalogue, synonyms and pack rules)]:::tool
  Research --> Draft[Structured research draft]:::output

  Draft --> Critic[Agent 2: Research Critic and Qualification]:::agent
  Evidence --> Critic
  Catalog --> Critic
  Policy[(Versioned sales rubric, regions, capacity and approved claims)]:::tool --> Critic
  Outcomes[(Reviewed historical outcomes)]:::tool --> Critic

  Critic -->|revise research; max one retry| Research
  Critic --> ReviewResult[Validated matches, rejected claims, missing evidence and proceed/review/stop recommendation]:::output
  ReviewResult --> Integrity[Evidence integrity validator]:::safety
  Integrity --> Forecast[Deterministic demand range calculator]:::safety
  Forecast --> Gate[Versioned qualification policy gate]:::safety

  Gate -->|qualified| Committee[Buying Committee workflow]:::output
  Gate -->|borderline or conflicting| Human{Sales review}:::human
  Gate -->|hard disqualifier| Stop[Disqualify with reason codes]:::output
  Human -->|approve| Committee
  Human -->|reject| Stop

  Feedback[Sales overrides and downstream outcomes]:::input --> Eval[(Frozen evaluation suite)]:::tool
  Eval --> Promotion{Prompt, model and rule promotion gate}:::human
  Promotion -. approved version only .-> Research
  Promotion -. approved version only .-> Critic
  Promotion -. approved version only .-> Policy
```

### Target-state decision ownership

| Decision | Owner |
|---|---|
| Interpret company pages, menus and catalogues | Agent 1 |
| Extract dishes and propose ingredient opportunities | Agent 1 |
| Challenge citations, assumptions and commercial plausibility | Agent 2 |
| Recommend `proceed`, `sales_review`, `stop` or `revise_research` | Agent 2 |
| Verify source keys and required fields | Deterministic integrity validator |
| Calculate low/base/high demand | Deterministic forecast calculator |
| Enforce geography, capacity, suppression and score thresholds | Versioned deterministic policy gate |
| Resolve borderline or conflicting evidence | Sales reviewer |

The system becomes smarter through reviewed outcomes, expanded golden cases and controlled prompt/model/rule promotion. It does not silently retrain or rewrite qualification policy from live outcomes.

## 3. Demo agent boundaries and ownership

> This is the currently implemented interview demo.

```mermaid
flowchart TB
  Input[Canonical account + bounded evidence]

  subgraph A1[Agent 1: Account Intelligence and Fit]
    Extract[Extract company, dishes, scale, geography and pains]
    Tool1[Tool: approved Knoxx catalogue lookup]
    Output1[Structured findings + formula inputs + source keys]
    Extract --> Tool1 --> Output1
  end

  subgraph D1[Deterministic controls]
    Validate1[JSON schema and citation guardrail]
    Quantity[Low / base / high quantity calculator]
    Score[Fixed qualification score]
  end

  subgraph A2[Agent 2: Buying Committee]
    ApolloCandidates[Apollo candidates]
    Tool2[Tool: synthetic historical persona outcomes]
    Rank[Explainable 3–5 contact ranking]
    ApolloCandidates --> Tool2 --> Rank
  end

  subgraph A3[Agent 3: Outreach Strategy]
    Pains[Evidence-backed pain by persona]
    Tool3[Tool: approved claims and forbidden claims]
    Sequence[Four-touch sequence + tracked CTA]
    Pains --> Tool3 --> Sequence
  end

  subgraph D2[Side-effect controls]
    Review{Human approval}
    Allowlist[Recipient allowlist override]
    Stops[Account and contact stop-state machine]
  end

  Input --> A1 --> D1 --> A2 --> A3 --> D2
```

## 4. Account and contact state machines

```mermaid
stateDiagram-v2
  [*] --> New
  New --> Researching: start run
  Researching --> Researched: evidence collected
  Researching --> FailedPartial: provider or parser failure
  Researched --> Qualified: score >= 75
  Researched --> Review: score 55–74 or weak evidence
  Researched --> Disqualified: score < 55
  Qualified --> ContactsEnriched
  Review --> ContactsEnriched: human accepts
  ContactsEnriched --> DraftReady
  DraftReady --> Approved: human approval
  Approved --> ActiveOutreach
  ActiveOutreach --> ActiveOutreach: CTA click raises intent only
  ActiveOutreach --> Engaged: positive reply / manual engagement
  ActiveOutreach --> MeetingBooked: booking webhook
  Engaged --> MeetingBooked
  MeetingBooked --> Opportunity
  ActiveOutreach --> Suppressed: negative organization reply
  FailedPartial --> Researching: retry
  Disqualified --> Archived
  Suppressed --> [*]
  Opportunity --> [*]
```

```mermaid
stateDiagram-v2
  [*] --> Shortlisted
  Shortlisted --> Queued: selected as active contact
  Queued --> Active: approved sequence starts
  Active --> Replied: reply detected
  Active --> Bounced: hard bounce
  Active --> OptedOut: unsubscribe
  Active --> Paused: another contact engages
  Queued --> Paused: account-level stop
  Shortlisted --> Suppressed: suppression match
  Replied --> [*]
  Bounced --> [*]
  OptedOut --> [*]
  Paused --> [*]
  Suppressed --> [*]
```

## 5. Evaluation architecture

```mermaid
flowchart LR
  Dataset[(n8n Data Table: golden cases)] --> EvalTrigger[Evaluation Trigger]
  EvalTrigger --> Producer[Production agent path]
  Producer --> Guardrail[Deterministic validation]
  Guardrail --> Branch{Check if evaluating}
  Branch -->|No| Persist[Persist production result]
  Branch -->|Yes| Judge[Gemini 3.6 Flash judge]
  Judge --> Native[Evaluation: correctness]
  Guardrail --> Metrics[Evaluation: custom metrics]
  Metrics --> Dashboard[n8n Evaluations tab]
  Native --> Dashboard

  Cases[Snapfresh / sparse site / parent company / no Apollo match / unsupported claims / stop events] --> Dataset
```
