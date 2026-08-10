# Lovable live connection fix

Paste the instruction below into the existing Lovable project. Do not start a new project.

---

Audit and fix the production connection for the existing **Knoxx Outbound Intelligence** application at `https://knoxx-insight-quest.lovable.app`.

## Non-negotiable backend boundary

- Keep the existing Supabase project: `sbbqtvhyfdxywkanwldb`.
- Do not create, provision, fork or connect another Supabase project.
- Do not change the database schema or Edge Function names.
- Never put a service-role key, database password, n8n secret or provider credential in browser code.

## Current verified problem

The deployed production bundle currently contains:

```text
VITE_SUPABASE_URL=https://sbbqtvhyfdxywkanwldb.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=
VITE_DEMO_MODE=true
VITE_SAFE_TEST_EMAIL=rochak.singhal@gmail.com
```

Because the publishable key is empty, the app correctly enters fixture mode, displays “no backend key configured,” cannot establish a Supabase session and cannot invoke live Edge Functions.

## Required deployment configuration

Configure the existing project's production environment with:

```text
VITE_SUPABASE_URL=https://sbbqtvhyfdxywkanwldb.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<existing Supabase publishable browser key>
VITE_DEMO_MODE=true
VITE_SAFE_TEST_EMAIL=rochak.singhal@gmail.com
```

The publishable key must come from the existing Supabase project's API Keys page. It is a browser key, not a secret/service-role key. Trigger a fresh production deployment after setting it.

## Runtime checks

1. `isLiveConfigured()` becomes true only when both existing URL and publishable key exist.
2. A signed-out visitor is routed to the existing auth screen.
3. Show **Sign in** when no session exists; do not show a functional **Sign out** action beside “Not signed in.”
4. Email/password or magic-link authentication uses the existing Supabase Auth project.
5. The dashboard reads existing RLS-protected rows using the authenticated session.
6. Starting research invokes only `start-account-research` and then navigates to the returned `run_id`.
7. Approving a draft invokes only `approve-sequence`; the browser cannot choose the delivered recipient.
8. If the manual-event UI is present, it invokes only `outreach-event` with provider `manual_demo`.
9. Never call n8n, Firecrawl, Apollo, Gmail or model APIs directly from the browser.
10. Preserve fixture fallback for local/portfolio use, but production with the configured key must clearly show **Live data mode**.

## Metadata polish

Replace the generic root metadata:

```text
Lovable App
Lovable Generated Project
```

with:

```text
Title: Knoxx Outbound Intelligence
Description: Evidence-backed account research, ingredient qualification and safe outreach for food-ingredient sales teams.
```

Update Open Graph/Twitter title and description as well. Keep the route-specific account/research titles.

## Acceptance test

After republishing, report:

- The production deployment ID.
- Confirmation that the production publishable key is present without printing the key.
- A screenshot showing a signed-in user and **Live data mode**.
- One authenticated `start-account-research` response containing `account_id`, `run_id` and status.
- Confirmation that the Supabase URL contains only project ref `sbbqtvhyfdxywkanwldb`.
- Confirmation that no service-role/provider secret exists in the browser bundle.
- Files changed and tests/build run.

