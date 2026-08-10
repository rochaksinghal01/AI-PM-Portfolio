-- Security and high-value query hardening for the existing Knoxx project.
-- This migration is intentionally idempotent so it is safe on local and hosted Supabase.

alter function public.set_updated_at() set search_path = pg_catalog;

-- Supabase's RLS event-trigger helper is owner-only infrastructure.  Event
-- triggers execute as their owner, so browser roles never need direct access.
do $$
begin
  if to_regprocedure('public.rls_auto_enable()') is not null then
    execute 'revoke execute on function public.rls_auto_enable() from public, anon, authenticated';
  end if;
end
$$;

-- These operational tables are intentionally server-only.  RLS already has no
-- browser policies; the explicit revoke makes that boundary unambiguous.
revoke all on table public.audit_log from anon, authenticated;
revoke all on table public.evaluation_runs from anon, authenticated;

comment on table public.audit_log is
  'Server-only immutable audit trail. Browser roles have no privileges or RLS policies.';
comment on table public.evaluation_runs is
  'Server-only evaluation history. Browser roles have no privileges or RLS policies.';

-- Foreign-key and worker lookup indexes used by the asynchronous pipeline.
create index if not exists accounts_category_id_idx on public.accounts(category_id);
create index if not exists accounts_owner_id_idx on public.accounts(owner_id);
create index if not exists account_aliases_account_id_idx on public.account_aliases(account_id);
create index if not exists research_runs_requested_by_idx on public.research_runs(requested_by, created_at desc);
create index if not exists dishes_run_id_idx on public.dishes(run_id);
create index if not exists dishes_source_id_idx on public.dishes(source_id);
create index if not exists recipe_ingredients_dish_id_idx on public.recipe_ingredients(dish_id);
create index if not exists ingredient_matches_run_id_idx on public.ingredient_matches(run_id);
create index if not exists ingredient_matches_recipe_ingredient_id_idx on public.ingredient_matches(recipe_ingredient_id);
create index if not exists ingredient_matches_catalog_item_id_idx on public.ingredient_matches(catalog_item_id);
create index if not exists contact_rankings_contact_id_idx on public.contact_rankings(contact_id);
create index if not exists outreach_sequences_account_id_idx on public.outreach_sequences(account_id, created_at desc);
create index if not exists outreach_sequences_run_id_idx on public.outreach_sequences(run_id);
create index if not exists outreach_sequences_primary_contact_id_idx on public.outreach_sequences(primary_contact_id);
create index if not exists outreach_sequences_approved_by_idx on public.outreach_sequences(approved_by);
create index if not exists outreach_messages_contact_id_idx on public.outreach_messages(contact_id);
create index if not exists engagement_events_contact_id_idx on public.engagement_events(contact_id);
create index if not exists engagement_events_message_id_idx on public.engagement_events(message_id);
create index if not exists suppression_entries_account_id_idx on public.suppression_entries(account_id);
create index if not exists suppression_entries_contact_id_idx on public.suppression_entries(contact_id);
create index if not exists suppression_entries_source_event_id_idx on public.suppression_entries(source_event_id);
create index if not exists audit_log_actor_id_idx on public.audit_log(actor_id);
