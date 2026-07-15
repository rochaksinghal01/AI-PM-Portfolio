-- Supabase / Postgres schema for the v2 lead scoring pipeline.
-- Run this once in the Supabase SQL editor (Project > SQL Editor > New query),
-- or via: psql "$SUPABASE_DB_URL" -f schema_v2.sql

CREATE TABLE IF NOT EXISTS leads_scored (
    lead_id                    TEXT PRIMARY KEY,
    name                       TEXT,
    name_valid                 BOOLEAN,
    email                      TEXT,
    email_type                 TEXT,      -- company | personal | blank
    domain                     TEXT,
    company                    TEXT,
    company_size_tier          TEXT,       -- small | medium | large | unknown
    company_networth_estimate  TEXT,       -- LLM estimate, explicitly unverified
    raw_notes                  TEXT,
    source                     TEXT,       -- referral | event | web
    intent                     TEXT,       -- blank..order ladder
    clarity                    TEXT,       -- yes | no
    repeat_customer            TEXT,       -- yes | no | unclear
    total_score                INTEGER,
    tier                       TEXT,       -- Hot | Warm | Cold
    status                     TEXT,       -- ok | flagged | pending_review
    needs_human_review         BOOLEAN,
    review_reason              TEXT,
    summary                    TEXT,
    processed_at               TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_leads_scored_status ON leads_scored (status);
CREATE INDEX IF NOT EXISTS idx_leads_scored_tier   ON leads_scored (tier);
CREATE INDEX IF NOT EXISTS idx_leads_scored_review ON leads_scored (needs_human_review) WHERE needs_human_review = true;

-- Wide-open policies so the review-queue frontend (using the publishable/anon key,
-- which is meant to be safe in a browser) can read and resolve rows.
-- This is fine for this assignment's demo scope. Before any real production use,
-- replace these with policies scoped to an authenticated user/role.
ALTER TABLE leads_scored ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon read for demo" ON leads_scored;
CREATE POLICY "anon read for demo" ON leads_scored
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "anon update for review demo" ON leads_scored;
CREATE POLICY "anon update for review demo" ON leads_scored
    FOR UPDATE USING (true) WITH CHECK (true);
