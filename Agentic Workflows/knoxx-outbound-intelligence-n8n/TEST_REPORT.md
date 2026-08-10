# Verification report

Last local verification: 10 August 2026.

## Verified locally

| Area | Result | Coverage |
|---|---|---|
| Backend and workflow contracts | Pass | 34 tests covering RLS, ownership, idempotency, signed tracking, stop rules, agent/model routing, evaluation nodes, recipient safety, Firecrawl polling, partial-crawl preservation, WF01 URL normalization and valid graph connections |
| Frontend decision engine | Pass | 6 tests covering domain canonicalization, qualification, quantity uncertainty and engagement behavior |
| n8n exports | Pass | Five valid JSON workflow graphs; three bounded AI Agents and native evaluation branches on every nondeterministic workflow |
| Supabase Edge Functions | Pass | Five functions type-checked with Deno |
| Frontend production build | Pass | Vite production bundle generated successfully |
| Dependency audit | Pass | Zero known vulnerabilities at the configured audit level |
| Repository secret scan | Pass | No API keys, bearer tokens or real prospect addresses found in tracked project material |
| Interview presentation | Pass | Native 15-slide PowerPoint regenerated after CPO review; archive integrity valid and title preview rendered successfully |

Verification command completed on 10 August 2026 with **40/40 tests passing** (34 backend/workflow + 6 frontend), five workflow graphs validated, five Edge Functions type-checked, a successful Vite production build and zero dependency vulnerabilities at the configured audit level.

Run the same suite from this directory with `npm run verify`.

## Safety state

- Every n8n export is inactive.
- The Gmail node is disabled even inside the inactive workflow.
- `DEMO_MODE=true` and `SAFE_TEST_EMAIL` are mandatory gates before send.
- Tracking links require an HMAC signature.
- Suppression and account-level stop rules are reapplied immediately before delivery.
- Evaluation fixtures, catalogue data and historical outcomes are synthetic.

## Verified in the connected Supabase/n8n demo

- WF01–WF06 were reported successful in the published n8n workflows after node/schema/metric fixes.
- Supabase contains one Snapfresh account and two immutable research runs.
- Three stored synthetic demo committee contacts are ranked 90, 82 and 74.
- One four-touch sequence and four messages are stored.
- A tracked CTA click is persisted and did not stop the account.
- A Gmail `positive_reply` is persisted; the sequence is paused, the replying contact is `replied`, and the other contacts are paused.
- `tracking-link`, `track` and `outreach-event` are active.
- `start-account-research` and `approve-sequence` were deployed with JWT verification on 10 August 2026, completing the frontend Edge Function contract.
- All 22 public tables reported by Supabase have RLS enabled.
- Migration `002_security_performance_hardening.sql` removes browser execution from the RLS event-trigger helper, pins the update trigger search path, makes audit/evaluation tables explicitly server-only and adds worker/foreign-key indexes.
- Migration `003_rls_policy_performance.sql` preserves the same ownership rules while evaluating `auth.uid()` once per statement for better performance at scale.
- Post-migration Supabase advisors report no function-search-path, browser-executable-definer or RLS initialization-plan warnings. The remaining security warning is the manual leaked-password-protection setting; no-policy notices for `audit_log` and `evaluation_runs` are intentional because browser privileges are explicitly revoked.

## Live checks still required

These checks require project credentials and deployed services and are not represented as completed:

1. Complete one live Firecrawl golden-account run that persists `research_sources`, `account_findings`, `ingredient_matches` and `quantity_forecasts`. The newest run is currently `running`; an older run is `failed_partial` with score 0.
2. Capture the final n8n Evaluation dashboard screenshots and verify each saved dataset meets the documented hard gates.
3. Exercise RLS with a second user/workspace, not only the owner account.
4. Exercise duplicate click, booking, bounce, unsubscribe, organization-wide negative reply and out-of-office events end to end.
5. Publish the frontend and Miro board, replace the presentation URL placeholders and capture final live screenshots.
6. Enable leaked-password protection in the Supabase Authentication dashboard.
7. Configure `VITE_SUPABASE_PUBLISHABLE_KEY` in the published Lovable environment and verify authentication plus protected Edge Function calls. The 10 August production audit found the correct project URL but an empty publishable key, so the site is currently in fixture mode.
8. Replace the public Google Slides deck with the revised 15-slide PowerPoint; the supplied Slides URL currently exports the earlier 14-slide version.
