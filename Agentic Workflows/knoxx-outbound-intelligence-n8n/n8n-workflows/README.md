# n8n workflow activation

All exports are inactive by design. Import them in the order in the project README, replace placeholder IDs, validate, and execute their evaluation paths before activation.

## Instance variables

```text
DEMO_MODE=true
DEMO_FIRST_TOUCH_ONLY=true
SAFE_TEST_EMAIL=your-own-test-inbox@example.com
MEETING_URL=https://calendar.example.com/demo
TRACKING_BASE_URL=https://YOUR_PROJECT.supabase.co/functions/v1/track
TRACKING_SIGNING_SECRET=generate-a-third-independent-long-random-value
SUPABASE_FUNCTIONS_URL=https://YOUR_PROJECT.supabase.co/functions/v1
OUTREACH_EVENT_SECRET=generate-a-long-random-value
N8N_WEBHOOK_SECRET=generate-a-different-long-random-value
KNOXX_WF02_WEBHOOK_URL=<production webhook URL for WF02>
KNOXX_WF04_WEBHOOK_URL=<production webhook URL for WF04>
KNOXX_WF05_WEBHOOK_URL=<production webhook URL for WF05 draft path>
```

## Credentials

- Supabase Postgres: pooled connection with TLS; server-side only.
- Firecrawl: HTTP Header Auth, `Authorization: Bearer …`.
- Apollo: HTTP Header Auth, `X-Api-Key: …`.
- OpenAI API: n8n OpenAI credential.
- Google Gemini API: n8n Gemini credential used by evaluation nodes.
- Gmail OAuth: a test sender account only during the interview build.

Never paste secrets into node parameters, pinned data, workflow names or repository JSON.

## Evaluation setup

Create four n8n Data Tables from the CSVs in `evaluation-data/` and replace each `REPLACE_WITH_*_EVAL_DATA_TABLE_ID` value. Evaluation Trigger branches do not call Firecrawl or Apollo; they use frozen fixtures so regressions are repeatable.

Run evaluations after any prompt, model, scoring, catalogue or data-contract change. Required gates are in `MODEL_DECISIONS.md`.

## Activation checklist

- [ ] `DEMO_MODE` is exactly `true`.
- [ ] `DEMO_FIRST_TOUCH_ONLY` is `true` for a one-email live demo; switch it to `false` only when intentionally demonstrating the full compressed cadence.
- [ ] `SAFE_TEST_EMAIL` is owned by the reviewer.
- [ ] No real contact appears in pinned data.
- [ ] All workflow JSON validates in n8n.
- [ ] Every native evaluation dataset passes hard gates.
- [ ] Gmail test sends arrive only in `SAFE_TEST_EMAIL`.
- [ ] Duplicate events are idempotent.
- [ ] Click does not pause the account.
- [ ] Positive reply and booking pause all remaining contacts.
- [ ] Suppression prevents queueing and sending.
- [ ] Unsigned or modified tracking links redirect without logging intent.
