create extension if not exists pgcrypto;

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists accounts (
  id uuid primary key default gen_random_uuid(),
  canonical_domain text not null unique,
  website_url text not null,
  name text,
  parent_company text,
  category_id uuid references categories(id),
  lifecycle text not null default 'new' check (lifecycle in ('new','existing')),
  stage text not null default 'new' check (stage in ('new','researching','researched','qualified','review','disqualified','contacts_enriched','draft_ready','approved','active_outreach','engaged','meeting_booked','opportunity','failed_partial','suppressed','archived')),
  intent_score integer not null default 0 check (intent_score between 0 and 100),
  owner_id uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists account_aliases (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references accounts(id) on delete cascade,
  alias_domain text not null unique,
  alias_name text,
  created_at timestamptz not null default now()
);

create table if not exists research_runs (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references accounts(id) on delete cascade,
  requested_by uuid references auth.users(id),
  status text not null default 'queued' check (status in ('queued','running','completed','failed_partial','failed')),
  input jsonb not null default '{}'::jsonb,
  provider_versions jsonb not null default '{}'::jsonb,
  error_summary text,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists research_sources (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null references research_runs(id) on delete cascade,
  source_url text not null,
  title text,
  source_type text not null default 'web' check (source_type in ('web','pdf','catalogue','api','manual')),
  excerpt text,
  content_hash text,
  retrieved_at timestamptz not null default now(),
  unique(run_id, source_url)
);

create table if not exists account_findings (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null references research_runs(id) on delete cascade,
  finding_type text not null,
  label text not null,
  value jsonb not null,
  evidence_strength text not null check (evidence_strength in ('observed','inferred','hypothesis')),
  confidence text not null check (confidence in ('high','medium','low')),
  source_ids uuid[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists dishes (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null references research_runs(id) on delete cascade,
  name text not null,
  description text,
  source_id uuid references research_sources(id),
  created_at timestamptz not null default now()
);

create table if not exists recipe_ingredients (
  id uuid primary key default gen_random_uuid(),
  dish_id uuid not null references dishes(id) on delete cascade,
  raw_name text not null,
  canonical_name text,
  estimated_kg_per_meal numeric,
  confidence text check (confidence in ('high','medium','low')),
  assumptions text
);

create table if not exists knoxx_catalog_items (
  id uuid primary key default gen_random_uuid(),
  sku text not null unique,
  name text not null,
  category text not null,
  canonical_ingredients text[] not null default '{}',
  synonyms text[] not null default '{}',
  pack_size_kg numeric,
  moq_kg numeric,
  service_regions text[] not null default '{}',
  certifications text[] not null default '{}',
  priority integer not null default 3 check (priority between 1 and 5),
  synthetic boolean not null default true,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists ingredient_matches (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null references research_runs(id) on delete cascade,
  recipe_ingredient_id uuid references recipe_ingredients(id) on delete set null,
  catalog_item_id uuid not null references knoxx_catalog_items(id),
  match_score integer not null check (match_score between 0 and 100),
  confidence text not null check (confidence in ('high','medium','low')),
  explanation text not null,
  source_ids uuid[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists quantity_forecasts (
  id uuid primary key default gen_random_uuid(),
  ingredient_match_id uuid not null unique references ingredient_matches(id) on delete cascade,
  status text not null check (status in ('estimated','insufficient_evidence')),
  low_weekly_kg numeric,
  base_weekly_kg numeric,
  high_weekly_kg numeric,
  low_monthly_kg numeric,
  base_monthly_kg numeric,
  high_monthly_kg numeric,
  low_annual_kg numeric,
  base_annual_kg numeric,
  high_annual_kg numeric,
  formula_inputs jsonb not null default '{}'::jsonb,
  assumptions text,
  confidence text check (confidence in ('high','medium','low')),
  created_at timestamptz not null default now()
);

create table if not exists qualification_rules (
  id uuid primary key default gen_random_uuid(),
  version integer not null unique,
  active boolean not null default false,
  rules jsonb not null,
  synthetic boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists account_scores (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null unique references research_runs(id) on delete cascade,
  product_applicability integer not null check (product_applicability between 0 and 40),
  evidence_specificity integer not null check (evidence_specificity between 0 and 25),
  scale_fit integer not null check (scale_fit between 0 and 20),
  supply_feasibility integer not null check (supply_feasibility between 0 and 15),
  risk_penalty integer not null check (risk_penalty between -30 and 0),
  total integer not null check (total between 0 and 100),
  tier text not null check (tier in ('qualified','review','disqualified')),
  reasons jsonb not null default '[]'::jsonb,
  rule_version integer not null,
  created_at timestamptz not null default now()
);

create table if not exists contacts (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references accounts(id) on delete cascade,
  apollo_person_id text,
  full_name text not null,
  title text,
  persona text,
  work_email text,
  email_status text check (email_status in ('verified','unverified','unavailable')),
  linkedin_url text,
  state text not null default 'shortlisted' check (state in ('shortlisted','queued','active','replied','bounced','opted_out','paused','suppressed')),
  paused_until timestamptz,
  synthetic boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(account_id, apollo_person_id)
);

create table if not exists contact_rankings (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null references research_runs(id) on delete cascade,
  contact_id uuid not null references contacts(id) on delete cascade,
  rank integer not null,
  role_relevance integer not null,
  decision_authority integer not null,
  pain_alignment integer not null,
  historical_performance integer not null,
  data_confidence integer not null,
  total integer not null check (total between 0 and 100),
  reason text not null,
  unique(run_id, contact_id)
);

create table if not exists historical_outcomes (
  id uuid primary key default gen_random_uuid(),
  segment text not null,
  persona text not null,
  outcome text not null,
  outcome_weight numeric not null,
  synthetic boolean not null default true,
  occurred_at date not null
);

create table if not exists outreach_sequences (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references accounts(id) on delete cascade,
  run_id uuid not null references research_runs(id) on delete cascade,
  primary_contact_id uuid references contacts(id),
  status text not null default 'draft' check (status in ('draft','approved','active','paused','completed','stopped')),
  cadence_days integer[] not null default '{0,3,7,12}',
  approved_by uuid references auth.users(id),
  approved_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists outreach_messages (
  id uuid primary key default gen_random_uuid(),
  sequence_id uuid not null references outreach_sequences(id) on delete cascade,
  contact_id uuid not null references contacts(id),
  touch_number integer not null check (touch_number between 1 and 4),
  scheduled_for timestamptz,
  intended_recipient text,
  delivered_recipient text,
  subject text not null,
  body text not null,
  status text not null default 'draft' check (status in ('draft','scheduled','sent','failed','cancelled')),
  gmail_message_id text,
  tracking_token uuid not null default gen_random_uuid() unique,
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  unique(sequence_id, touch_number)
);

create table if not exists engagement_events (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references accounts(id) on delete cascade,
  contact_id uuid references contacts(id),
  message_id uuid references outreach_messages(id),
  event_type text not null check (event_type in ('cta_click','positive_reply','negative_reply','negative_org_reply','meeting_booked','manual_engaged','opportunity_created','unsubscribe','hard_bounce','out_of_office')),
  provider text,
  idempotency_key text not null unique,
  payload jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now()
);

create table if not exists suppression_entries (
  id uuid primary key default gen_random_uuid(),
  account_id uuid references accounts(id) on delete cascade,
  contact_id uuid references contacts(id) on delete cascade,
  scope text not null check (scope in ('contact','account','domain')),
  reason text not null,
  source_event_id uuid references engagement_events(id),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists evaluation_runs (
  id uuid primary key default gen_random_uuid(),
  workflow_name text not null,
  workflow_version text not null,
  dataset_case text not null,
  producer_model text not null,
  judge_model text,
  metrics jsonb not null,
  passed boolean not null,
  latency_ms integer,
  token_usage jsonb,
  created_at timestamptz not null default now()
);

create table if not exists audit_log (
  id bigint generated always as identity primary key,
  actor_id uuid references auth.users(id),
  entity_type text not null,
  entity_id text not null,
  action text not null,
  before_state jsonb,
  after_state jsonb,
  created_at timestamptz not null default now()
);

create index if not exists research_runs_account_id_idx on research_runs(account_id, created_at desc);
create index if not exists findings_run_id_idx on account_findings(run_id, finding_type);
create index if not exists contacts_account_id_idx on contacts(account_id, state);
create index if not exists events_account_id_idx on engagement_events(account_id, occurred_at desc);
create index if not exists messages_sequence_id_idx on outreach_messages(sequence_id, touch_number);

create or replace function set_updated_at() returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function increment_account_intent(target_account_id uuid, increment_by integer)
returns void
language sql
security definer
set search_path = public
as $$
  update accounts
  set intent_score = least(100, greatest(0, intent_score + increment_by))
  where id = target_account_id;
$$;

revoke all on function increment_account_intent(uuid, integer) from public, anon, authenticated;
grant execute on function increment_account_intent(uuid, integer) to service_role;

drop trigger if exists accounts_updated_at on accounts;
create trigger accounts_updated_at before update on accounts for each row execute function set_updated_at();
drop trigger if exists contacts_updated_at on contacts;
create trigger contacts_updated_at before update on contacts for each row execute function set_updated_at();

alter table categories enable row level security;
alter table accounts enable row level security;
alter table account_aliases enable row level security;
alter table research_runs enable row level security;
alter table research_sources enable row level security;
alter table account_findings enable row level security;
alter table dishes enable row level security;
alter table recipe_ingredients enable row level security;
alter table knoxx_catalog_items enable row level security;
alter table ingredient_matches enable row level security;
alter table quantity_forecasts enable row level security;
alter table qualification_rules enable row level security;
alter table account_scores enable row level security;
alter table contacts enable row level security;
alter table contact_rankings enable row level security;
alter table historical_outcomes enable row level security;
alter table outreach_sequences enable row level security;
alter table outreach_messages enable row level security;
alter table engagement_events enable row level security;
alter table suppression_entries enable row level security;
alter table evaluation_runs enable row level security;
alter table audit_log enable row level security;

create policy "authenticated users can read categories" on categories for select to authenticated using (true);
create policy "authenticated users can read catalogue" on knoxx_catalog_items for select to authenticated using (true);
create policy "authenticated users can read qualification rules" on qualification_rules for select to authenticated using (true);
create policy "authenticated users can read synthetic outcomes" on historical_outcomes for select to authenticated using (true);
create policy "owners can read accounts" on accounts for select to authenticated using (owner_id = auth.uid());
create policy "owners can update accounts" on accounts for update to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "requesters can read runs" on research_runs for select to authenticated using (requested_by = auth.uid());
create policy "owners can read aliases" on account_aliases for select to authenticated using (
  exists (select 1 from accounts a where a.id = account_aliases.account_id and a.owner_id = auth.uid())
);
create policy "requesters can read sources" on research_sources for select to authenticated using (
  exists (select 1 from research_runs r where r.id = research_sources.run_id and r.requested_by = auth.uid())
);
create policy "requesters can read findings" on account_findings for select to authenticated using (
  exists (select 1 from research_runs r where r.id = account_findings.run_id and r.requested_by = auth.uid())
);
create policy "requesters can read dishes" on dishes for select to authenticated using (
  exists (select 1 from research_runs r where r.id = dishes.run_id and r.requested_by = auth.uid())
);
create policy "requesters can read recipe ingredients" on recipe_ingredients for select to authenticated using (
  exists (
    select 1 from dishes d
    join research_runs r on r.id = d.run_id
    where d.id = recipe_ingredients.dish_id and r.requested_by = auth.uid()
  )
);
create policy "requesters can read ingredient matches" on ingredient_matches for select to authenticated using (
  exists (select 1 from research_runs r where r.id = ingredient_matches.run_id and r.requested_by = auth.uid())
);
create policy "requesters can read forecasts" on quantity_forecasts for select to authenticated using (
  exists (
    select 1 from ingredient_matches m
    join research_runs r on r.id = m.run_id
    where m.id = quantity_forecasts.ingredient_match_id and r.requested_by = auth.uid()
  )
);
create policy "requesters can read scores" on account_scores for select to authenticated using (
  exists (select 1 from research_runs r where r.id = account_scores.run_id and r.requested_by = auth.uid())
);
create policy "owners can read contacts" on contacts for select to authenticated using (
  exists (select 1 from accounts a where a.id = contacts.account_id and a.owner_id = auth.uid())
);
create policy "requesters can read rankings" on contact_rankings for select to authenticated using (
  exists (select 1 from research_runs r where r.id = contact_rankings.run_id and r.requested_by = auth.uid())
);
create policy "owners can read sequences" on outreach_sequences for select to authenticated using (
  exists (select 1 from accounts a where a.id = outreach_sequences.account_id and a.owner_id = auth.uid())
);
create policy "owners can read messages" on outreach_messages for select to authenticated using (
  exists (
    select 1 from outreach_sequences s
    join accounts a on a.id = s.account_id
    where s.id = outreach_messages.sequence_id and a.owner_id = auth.uid()
  )
);
create policy "owners can read engagement" on engagement_events for select to authenticated using (
  exists (select 1 from accounts a where a.id = engagement_events.account_id and a.owner_id = auth.uid())
);
create policy "owners can read suppressions" on suppression_entries for select to authenticated using (
  account_id is not null and exists (
    select 1 from accounts a where a.id = suppression_entries.account_id and a.owner_id = auth.uid()
  )
);

create or replace view account_pipeline_public
with (security_invoker = true) as
select
  a.id,
  a.name,
  a.canonical_domain,
  a.parent_company,
  a.lifecycle,
  a.stage,
  a.intent_score,
  a.updated_at,
  s.total as fit_score,
  s.tier as fit_tier,
  r.id as latest_run_id,
  r.status as latest_run_status
from accounts a
left join lateral (
  select * from research_runs rr where rr.account_id = a.id order by rr.created_at desc limit 1
) r on true
left join account_scores s on s.run_id = r.id;

grant select on categories, accounts, account_aliases, research_runs, research_sources,
  account_findings, dishes, recipe_ingredients, knoxx_catalog_items, ingredient_matches,
  quantity_forecasts, qualification_rules, account_scores, contacts, contact_rankings,
  historical_outcomes, outreach_sequences, outreach_messages, engagement_events,
  suppression_entries, account_pipeline_public to authenticated;
