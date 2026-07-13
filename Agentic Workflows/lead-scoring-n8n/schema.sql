-- Postgres / Supabase schema for the leads pipeline.
-- Supabase is just managed Postgres, so this runs unmodified in the Supabase
-- SQL editor, or via `psql $DATABASE_URL -f schema.sql`.

CREATE TABLE IF NOT EXISTS leads_enriched (
    lead_id              TEXT PRIMARY KEY,
    name                 TEXT,
    email                TEXT,
    email_valid          BOOLEAN,
    company              TEXT,
    domain               TEXT,
    domain_source        TEXT,           -- 'email' | 'inferred_from_company_name'
    domain_is_disposable BOOLEAN,
    raw_notes            TEXT,
    source               TEXT,
    priority             TEXT,           -- 'high' | 'medium' | 'low' | 'unknown'
    summary              TEXT,
    status               TEXT NOT NULL,  -- 'ok' | 'flagged'
    flags                TEXT,           -- ' | '-joined human-readable reasons
    processed_at         TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_leads_enriched_status   ON leads_enriched (status);
CREATE INDEX IF NOT EXISTS idx_leads_enriched_priority ON leads_enriched (priority);
