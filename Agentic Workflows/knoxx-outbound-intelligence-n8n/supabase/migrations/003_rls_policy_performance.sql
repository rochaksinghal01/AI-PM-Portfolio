-- Preserve the exact ownership rules while allowing Postgres to evaluate the
-- authenticated user once per statement instead of once per row.

alter policy "owners can read accounts" on public.accounts
  using (owner_id = (select auth.uid()));

alter policy "owners can update accounts" on public.accounts
  using (owner_id = (select auth.uid()))
  with check (owner_id = (select auth.uid()));

alter policy "requesters can read runs" on public.research_runs
  using (requested_by = (select auth.uid()));

alter policy "owners can read aliases" on public.account_aliases
  using (exists (
    select 1 from public.accounts a
    where a.id = account_aliases.account_id
      and a.owner_id = (select auth.uid())
  ));

alter policy "requesters can read sources" on public.research_sources
  using (exists (
    select 1 from public.research_runs r
    where r.id = research_sources.run_id
      and r.requested_by = (select auth.uid())
  ));

alter policy "requesters can read findings" on public.account_findings
  using (exists (
    select 1 from public.research_runs r
    where r.id = account_findings.run_id
      and r.requested_by = (select auth.uid())
  ));

alter policy "requesters can read dishes" on public.dishes
  using (exists (
    select 1 from public.research_runs r
    where r.id = dishes.run_id
      and r.requested_by = (select auth.uid())
  ));

alter policy "requesters can read recipe ingredients" on public.recipe_ingredients
  using (exists (
    select 1
    from public.dishes d
    join public.research_runs r on r.id = d.run_id
    where d.id = recipe_ingredients.dish_id
      and r.requested_by = (select auth.uid())
  ));

alter policy "requesters can read ingredient matches" on public.ingredient_matches
  using (exists (
    select 1 from public.research_runs r
    where r.id = ingredient_matches.run_id
      and r.requested_by = (select auth.uid())
  ));

alter policy "requesters can read forecasts" on public.quantity_forecasts
  using (exists (
    select 1
    from public.ingredient_matches m
    join public.research_runs r on r.id = m.run_id
    where m.id = quantity_forecasts.ingredient_match_id
      and r.requested_by = (select auth.uid())
  ));

alter policy "requesters can read scores" on public.account_scores
  using (exists (
    select 1 from public.research_runs r
    where r.id = account_scores.run_id
      and r.requested_by = (select auth.uid())
  ));

alter policy "owners can read contacts" on public.contacts
  using (exists (
    select 1 from public.accounts a
    where a.id = contacts.account_id
      and a.owner_id = (select auth.uid())
  ));

alter policy "requesters can read rankings" on public.contact_rankings
  using (exists (
    select 1 from public.research_runs r
    where r.id = contact_rankings.run_id
      and r.requested_by = (select auth.uid())
  ));

alter policy "owners can read sequences" on public.outreach_sequences
  using (exists (
    select 1 from public.accounts a
    where a.id = outreach_sequences.account_id
      and a.owner_id = (select auth.uid())
  ));

alter policy "owners can read messages" on public.outreach_messages
  using (exists (
    select 1
    from public.outreach_sequences s
    join public.accounts a on a.id = s.account_id
    where s.id = outreach_messages.sequence_id
      and a.owner_id = (select auth.uid())
  ));

alter policy "owners can read engagement" on public.engagement_events
  using (exists (
    select 1 from public.accounts a
    where a.id = engagement_events.account_id
      and a.owner_id = (select auth.uid())
  ));

alter policy "owners can read suppressions" on public.suppression_entries
  using (
    account_id is not null
    and exists (
      select 1 from public.accounts a
      where a.id = suppression_entries.account_id
        and a.owner_id = (select auth.uid())
    )
  );
