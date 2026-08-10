import { getSupabase, requireSupabase } from "@/integrations/supabase/client";
import { fixturePipeline, fixtureReport } from "@/lib/fixtures";
import { isFixtureMode } from "@/lib/env";
import type {
  AccountReport,
  EventType,
  OutreachMessage,
  PipelineRow,
  ResearchRun,
} from "@/lib/types";

type DbRow = Record<string, unknown> & {
  id?: unknown;
  account_id?: unknown;
  run_id?: unknown;
  status?: unknown;
  state?: unknown;
  created_at?: unknown;
  started_at?: unknown;
  completed_at?: unknown;
  error_summary?: unknown;
  source_url?: unknown;
  source_type?: unknown;
  retrieved_at?: unknown;
  excerpt?: unknown;
  finding_type?: unknown;
  label?: unknown;
  value?: unknown;
  evidence_strength?: unknown;
  source_ids?: unknown;
  name?: unknown;
  canonical_name?: unknown;
  raw_name?: unknown;
  description?: unknown;
  source_id?: unknown;
  dish_id?: unknown;
  recipe_ingredient_id?: unknown;
  catalog_item_id?: unknown;
  explanation?: unknown;
  match_score?: unknown;
  ingredient_match_id?: unknown;
  formula_inputs?: unknown;
  low_weekly_kg?: unknown;
  base_weekly_kg?: unknown;
  high_weekly_kg?: unknown;
  low_monthly_kg?: unknown;
  base_monthly_kg?: unknown;
  high_monthly_kg?: unknown;
  low_annual_kg?: unknown;
  base_annual_kg?: unknown;
  high_annual_kg?: unknown;
  total?: unknown;
  tier?: unknown;
  product_applicability?: unknown;
  evidence_specificity?: unknown;
  scale_fit?: unknown;
  supply_feasibility?: unknown;
  risk_penalty?: unknown;
  reasons?: unknown;
  rule_version?: unknown;
  full_name?: unknown;
  title?: unknown;
  persona?: unknown;
  work_email?: unknown;
  email_status?: unknown;
  synthetic?: unknown;
  contact_id?: unknown;
  rank?: unknown;
  role_relevance?: unknown;
  decision_authority?: unknown;
  pain_alignment?: unknown;
  historical_performance?: unknown;
  data_confidence?: unknown;
  reason?: unknown;
  segment?: unknown;
  outcome?: unknown;
  occurred_at?: unknown;
  primary_contact_id?: unknown;
  cadence_days?: unknown;
  sequence_id?: unknown;
  touch_number?: unknown;
  subject?: unknown;
  body?: unknown;
  intended_recipient?: unknown;
  message_id?: unknown;
  event_type?: unknown;
  provider?: unknown;
  payload?: unknown;
};

/**
 * Read/write surface for Knoxx Outbound Intelligence.
 *
 * Rules enforced here:
 *  - Reads run through the authenticated user's session so existing RLS applies.
 *    UI filters are presentation only, never a substitute for RLS.
 *  - Privileged writes go exclusively to the three Edge Functions.
 *  - The browser never scores, never forecasts volume and never signs a
 *    tracking URL. Persisted server values are surfaced verbatim.
 */

export class ApiError extends Error {
  constructor(
    message: string,
    readonly kind: "permission" | "network" | "server" | "config" = "server",
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function wrap(error: { message: string; code?: string } | null): void {
  if (!error) return;
  const permission =
    error.code === "42501" || /row-level security|permission denied|JWT/i.test(error.message ?? "");
  throw new ApiError(error.message, permission ? "permission" : "server");
}

/** Canonical domain used for the "account already exists" pre-check. */
export function canonicalDomain(input: string): string {
  let value = input.trim().toLowerCase();
  value = value.replace(/^https?:\/\//, "");
  value = value.replace(/^www\./, "");
  const slash = value.indexOf("/");
  if (slash >= 0) value = value.slice(0, slash);
  return value.replace(/\.$/, "");
}

async function accessToken(): Promise<string> {
  const supabase = requireSupabase();
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new ApiError("You need to sign in to perform this action.", "permission");
  return token;
}

async function callFunction<T>(name: string, body: unknown): Promise<T> {
  const token = await accessToken();
  const { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } = await import("@/lib/env");
  const response = await fetch(`${SUPABASE_URL}/functions/v1/${name}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      apikey: SUPABASE_PUBLISHABLE_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const text = await response.text();
  let parsed = {} as T;
  if (text) {
    try {
      parsed = JSON.parse(text) as T;
    } catch {
      throw new ApiError(`${name} returned an invalid response.`, "server");
    }
  }
  if (!response.ok) {
    const message =
      (parsed as { error?: string; message?: string }).error ??
      (parsed as { message?: string }).message ??
      `${name} failed with ${response.status}`;
    throw new ApiError(
      message,
      response.status === 401 || response.status === 403 ? "permission" : "server",
    );
  }
  return parsed;
}

/* ------------------------------------------------------------------ reads */

export async function fetchPipeline(): Promise<PipelineRow[]> {
  if (isFixtureMode()) return fixturePipeline;
  const supabase = requireSupabase();
  const [pipelineRes, runRes, matchRes, forecastRes, sequenceRes, suppressionRes] =
    await Promise.all([
      supabase
        .from("account_pipeline_public")
        .select("*")
        .order("updated_at", { ascending: false }),
      supabase.from("research_runs").select("id, account_id"),
      supabase.from("ingredient_matches").select("id, run_id"),
      supabase.from("quantity_forecasts").select("ingredient_match_id, base_annual_kg"),
      supabase.from("outreach_sequences").select("account_id, status"),
      supabase.from("suppression_entries").select("account_id").eq("active", true),
    ]);
  [pipelineRes, runRes, matchRes, forecastRes, sequenceRes, suppressionRes].forEach((result) =>
    wrap(result.error),
  );

  const accountByRun = new Map(
    (runRes.data ?? []).map((run) => [run.id as string, run.account_id as string]),
  );
  const accountByMatch = new Map(
    (matchRes.data ?? []).map((match) => [
      match.id as string,
      accountByRun.get(match.run_id as string),
    ]),
  );
  const annualByAccount = new Map<string, number>();
  for (const forecast of forecastRes.data ?? []) {
    const accountId = accountByMatch.get(forecast.ingredient_match_id as string);
    if (!accountId || forecast.base_annual_kg == null) continue;
    annualByAccount.set(
      accountId,
      (annualByAccount.get(accountId) ?? 0) + Number(forecast.base_annual_kg),
    );
  }
  const activeByAccount = new Map<string, number>();
  for (const sequence of sequenceRes.data ?? []) {
    if (!["approved", "active", "active_outreach"].includes(sequence.status as string)) continue;
    const accountId = sequence.account_id as string;
    activeByAccount.set(accountId, (activeByAccount.get(accountId) ?? 0) + 1);
  }
  const suppressed = new Set(
    (suppressionRes.data ?? []).map((entry) => entry.account_id as string).filter(Boolean),
  );

  return (pipelineRes.data ?? []).map((row) => ({
    account_id: row.id as string,
    company_name: row.name as string,
    domain: row.canonical_domain as string,
    score: row.fit_score as number | null,
    tier: row.fit_tier as string | null,
    stage: row.stage as string | null,
    latest_run_status: row.latest_run_status as PipelineRow["latest_run_status"],
    suppressed: suppressed.has(row.id as string) || row.stage === "suppressed",
    engaged: ["engaged", "meeting_booked", "opportunity"].includes(row.stage as string),
    updated_at: row.updated_at as string | null,
    estimated_opportunity: annualByAccount.get(row.id as string) ?? null,
    active_sequences: activeByAccount.get(row.id as string) ?? 0,
  }));
}

export async function findExistingAccount(
  domain: string,
): Promise<{ id: string; company_name: string } | null> {
  const canonical = canonicalDomain(domain);
  if (!canonical) return null;
  if (isFixtureMode()) {
    const hit = fixturePipeline.find((row) => row.domain === canonical);
    return hit ? { id: hit.account_id, company_name: hit.company_name } : null;
  }
  const supabase = requireSupabase();
  const direct = await supabase
    .from("accounts")
    .select("id, name")
    .eq("canonical_domain", canonical)
    .maybeSingle();
  if (direct.data)
    return { id: direct.data.id as string, company_name: direct.data.name as string };
  const alias = await supabase
    .from("account_aliases")
    .select("account_id")
    .eq("alias_domain", canonical)
    .maybeSingle();
  if (!alias.data) return null;
  const account = await supabase
    .from("accounts")
    .select("id, name")
    .eq("id", (alias.data as { account_id: string }).account_id)
    .maybeSingle();
  return account.data
    ? { id: account.data.id as string, company_name: account.data.name as string }
    : null;
}

export async function fetchRun(runId: string): Promise<ResearchRun | null> {
  if (isFixtureMode())
    return fixtureReport.runs.find((r) => r.id === runId) ?? fixtureReport.runs[0] ?? null;
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("research_runs")
    .select("*")
    .eq("id", runId)
    .maybeSingle();
  wrap(error);
  if (!data) return null;
  return {
    id: data.id as string,
    account_id: data.account_id as string,
    status: data.status as ResearchRun["status"],
    stage: data.status as string,
    error_summary: data.error_summary as string | null,
    created_at: data.created_at as string | null,
    updated_at: (data.completed_at ?? data.started_at ?? data.created_at) as string | null,
  };
}

async function table<T>(name: string, column: string, value: string | boolean): Promise<T[]> {
  const supabase = requireSupabase();
  const { data, error } = await supabase.from(name).select("*").eq(column, value);
  wrap(error);
  return (data ?? []) as T[];
}

async function tableIn<T>(name: string, column: string, values: string[]): Promise<T[]> {
  if (!values.length) return [];
  const supabase = requireSupabase();
  const { data, error } = await supabase.from(name).select("*").in(column, values);
  wrap(error);
  return (data ?? []) as T[];
}

function findingText(value: unknown, fallback: string): string {
  if (typeof value === "string") return value;
  if (value && typeof value === "object") {
    const candidate = value as Record<string, unknown>;
    for (const key of ["statement", "text", "explanation", "value"]) {
      if (typeof candidate[key] === "string") return candidate[key] as string;
    }
    return JSON.stringify(value);
  }
  return fallback;
}

export async function fetchAccountReport(accountId: string): Promise<AccountReport> {
  if (isFixtureMode()) return fixtureReport;
  const supabase = requireSupabase();

  const accountRes = await supabase.from("accounts").select("*").eq("id", accountId).maybeSingle();
  wrap(accountRes.error);
  if (!accountRes.data)
    throw new ApiError("Account not found or not visible to you.", "permission");

  const [rawRuns, rawContacts, rawSequences, rawEvents, rawSuppressions] = await Promise.all([
    table<DbRow>("research_runs", "account_id", accountId),
    table<DbRow>("contacts", "account_id", accountId),
    table<DbRow>("outreach_sequences", "account_id", accountId),
    table<DbRow>("engagement_events", "account_id", accountId),
    table<DbRow>("suppression_entries", "account_id", accountId),
  ]);
  const runIds = rawRuns.map((run) => run.id as string);
  const [rawSources, rawFindings, rawDishes, rawMatches, rawScores, rawRankings] =
    await Promise.all([
      tableIn<DbRow>("research_sources", "run_id", runIds),
      tableIn<DbRow>("account_findings", "run_id", runIds),
      tableIn<DbRow>("dishes", "run_id", runIds),
      tableIn<DbRow>("ingredient_matches", "run_id", runIds),
      tableIn<DbRow>("account_scores", "run_id", runIds),
      tableIn<DbRow>("contact_rankings", "run_id", runIds),
    ]);

  const dishIds = rawDishes.map((dish) => dish.id as string);
  const matchIds = rawMatches.map((match) => match.id as string);
  const catalogIds = rawMatches.map((match) => match.catalog_item_id as string).filter(Boolean);
  const sequenceIds = rawSequences.map((sequence) => sequence.id as string);
  const [rawIngredients, rawForecasts, rawCatalog, rawMessages, rawHistory] = await Promise.all([
    tableIn<DbRow>("recipe_ingredients", "dish_id", dishIds),
    tableIn<DbRow>("quantity_forecasts", "ingredient_match_id", matchIds),
    tableIn<DbRow>("knoxx_catalog_items", "id", catalogIds),
    tableIn<DbRow>("outreach_messages", "sequence_id", sequenceIds),
    table<DbRow>("historical_outcomes", "synthetic", true),
  ]);

  const ingredientsById = new Map(rawIngredients.map((item) => [item.id as string, item]));
  const catalogById = new Map(rawCatalog.map((item) => [item.id as string, item]));
  const sequenceById = new Map(rawSequences.map((item) => [item.id as string, item]));

  const runs: AccountReport["runs"] = rawRuns.map((run) => ({
    id: run.id as string,
    account_id: run.account_id as string,
    status: run.status as ResearchRun["status"],
    stage: run.status as string,
    error_summary: run.error_summary as string | null,
    created_at: run.created_at as string | null,
    updated_at: (run.completed_at ?? run.started_at ?? run.created_at) as string | null,
  }));
  const sources: AccountReport["sources"] = rawSources.map((source) => ({
    id: source.id as string,
    account_id: accountId,
    url: source.source_url as string,
    source_type: source.source_type as string | null,
    retrieved_at: source.retrieved_at as string | null,
    retained_passage: source.excerpt as string | null,
    source_key: source.id as string,
  }));
  const findings: AccountReport["findings"] = rawFindings.map((finding) => ({
    id: finding.id as string,
    account_id: accountId,
    category: (finding.finding_type ?? finding.label) as string | null,
    statement: findingText(finding.value, String(finding.label ?? "insufficient_evidence")),
    label: finding.evidence_strength as AccountReport["findings"][number]["label"],
    source_id: Array.isArray(finding.source_ids)
      ? ((finding.source_ids[0] as string | undefined) ?? null)
      : null,
  }));
  const dishes: AccountReport["dishes"] = rawDishes.map((dish) => ({
    id: dish.id as string,
    account_id: accountId,
    name: dish.name as string,
    description: dish.description as string | null,
    source_id: dish.source_id as string | null,
  }));
  const ingredients: AccountReport["ingredients"] = rawIngredients.map((ingredient) => ({
    id: ingredient.id as string,
    dish_id: ingredient.dish_id as string,
    ingredient_name: (ingredient.canonical_name ?? ingredient.raw_name) as string,
    role: null,
    source_id: null,
  }));
  const matches: AccountReport["matches"] = rawMatches.map((match) => {
    const ingredient = ingredientsById.get(match.recipe_ingredient_id as string);
    const catalog = catalogById.get(match.catalog_item_id as string);
    return {
      id: match.id as string,
      account_id: accountId,
      catalog_item_id: match.catalog_item_id as string | null,
      knoxx_item_name: (catalog?.name ?? catalog?.canonical_name ?? null) as string | null,
      match_reason: match.explanation as string | null,
      confidence: match.match_score == null ? null : Number(match.match_score),
      ingredient_name: (ingredient?.canonical_name ?? ingredient?.raw_name ?? null) as
        string | null,
    };
  });
  const forecasts: AccountReport["forecasts"] = rawForecasts.map((forecast) => ({
    id: forecast.id as string,
    account_id: accountId,
    ingredient_match_id: forecast.ingredient_match_id as string | null,
    formula_inputs: forecast.formula_inputs as Record<string, unknown> | null,
    weekly_low: forecast.low_weekly_kg == null ? null : Number(forecast.low_weekly_kg),
    weekly_base: forecast.base_weekly_kg == null ? null : Number(forecast.base_weekly_kg),
    weekly_high: forecast.high_weekly_kg == null ? null : Number(forecast.high_weekly_kg),
    monthly_low: forecast.low_monthly_kg == null ? null : Number(forecast.low_monthly_kg),
    monthly_base: forecast.base_monthly_kg == null ? null : Number(forecast.base_monthly_kg),
    monthly_high: forecast.high_monthly_kg == null ? null : Number(forecast.high_monthly_kg),
    annual_low: forecast.low_annual_kg == null ? null : Number(forecast.low_annual_kg),
    annual_base: forecast.base_annual_kg == null ? null : Number(forecast.base_annual_kg),
    annual_high: forecast.high_annual_kg == null ? null : Number(forecast.high_annual_kg),
    unit: "kg",
  }));
  const scores: AccountReport["score"][] = rawScores
    .sort((a, b) => String(b.created_at ?? "").localeCompare(String(a.created_at ?? "")))
    .map((score) => ({
      id: score.id as string,
      account_id: accountId,
      total: score.total as number | null,
      tier: score.tier as string | null,
      components: {
        product_applicability: Number(score.product_applicability ?? 0),
        evidence_specificity: Number(score.evidence_specificity ?? 0),
        scale_fit: Number(score.scale_fit ?? 0),
        supply_feasibility: Number(score.supply_feasibility ?? 0),
      },
      risk_penalty: score.risk_penalty as number | null,
      reasons: Array.isArray(score.reasons) ? (score.reasons as string[]) : null,
      rule_version: score.rule_version == null ? null : String(score.rule_version),
    }));
  const contacts: AccountReport["contacts"] = rawContacts.map((contact) => ({
    id: contact.id as string,
    account_id: accountId,
    full_name: contact.full_name as string,
    title: contact.title as string | null,
    persona: contact.persona as string | null,
    email: contact.work_email as string | null,
    email_status: contact.email_status as string | null,
    is_synthetic: contact.synthetic as boolean | null,
    activation_eligible:
      contact.email_status === "verified" &&
      !["bounced", "opted_out", "suppressed", "paused"].includes(String(contact.state)),
  }));
  const rankings: AccountReport["rankings"] = rawRankings.map((ranking) => ({
    id: ranking.id as string,
    contact_id: ranking.contact_id as string,
    account_id: accountId,
    rank: ranking.rank as number | null,
    components: {
      role_relevance: Number(ranking.role_relevance ?? 0),
      decision_authority: Number(ranking.decision_authority ?? 0),
      pain_alignment: Number(ranking.pain_alignment ?? 0),
      historical_performance: Number(ranking.historical_performance ?? 0),
      data_confidence: Number(ranking.data_confidence ?? 0),
    },
    explanation: ranking.reason as string | null,
  }));
  const history: AccountReport["history"] = rawHistory.map((item) => ({
    id: item.id as string,
    account_id: accountId,
    contact_id: null,
    summary: `${String(item.segment ?? "segment")} · ${String(item.persona ?? "persona")}`,
    outcome: item.outcome as string | null,
    is_synthetic: item.synthetic as boolean | null,
    occurred_at: item.occurred_at as string | null,
  }));
  const sequences: AccountReport["sequences"] = rawSequences.map((sequence) => ({
    id: sequence.id as string,
    account_id: accountId,
    contact_id: sequence.primary_contact_id as string | null,
    status: sequence.status as string,
    cadence_days: sequence.cadence_days as number[] | null,
    created_at: sequence.created_at as string | null,
  }));
  const messages: OutreachMessage[] = rawMessages.map((message) => {
    const sequence = sequenceById.get(message.sequence_id as string);
    const cadence = Array.isArray(sequence?.cadence_days)
      ? (sequence.cadence_days as number[])
      : [0, 3, 7, 12];
    const touch = Number(message.touch_number ?? 1);
    return {
      id: message.id as string,
      sequence_id: message.sequence_id as string,
      day_offset: cadence[touch - 1] ?? 0,
      subject: message.subject as string,
      body: message.body as string,
      status: message.status as string,
      approved_claims: null,
      evidence_refs: null,
      intended_recipient: message.intended_recipient as string | null,
    };
  });
  const events: AccountReport["events"] = rawEvents.map((event) => ({
    id: event.id as string,
    account_id: accountId,
    contact_id: event.contact_id as string | null,
    message_id: event.message_id as string | null,
    event_type: event.event_type as AccountReport["events"][number]["event_type"],
    provider: event.provider as string | null,
    created_at: event.occurred_at as string | null,
    payload: event.payload as Record<string, unknown> | null,
  }));
  const suppressions = rawSuppressions as unknown as AccountReport["suppressions"];

  const rawAccount = accountRes.data;
  const account: AccountReport["account"] = {
    id: rawAccount.id as string,
    company_name: rawAccount.name as string,
    domain: rawAccount.canonical_domain as string,
    parent_company: rawAccount.parent_company as string | null,
    segment: null,
    service_area: null,
    service_area_fit: null,
    scale_signals: null,
    created_at: rawAccount.created_at as string | null,
    updated_at: rawAccount.updated_at as string | null,
  };

  return {
    account,
    runs: [...runs].sort((a, b) => (b.created_at ?? "").localeCompare(a.created_at ?? "")),
    sources,
    findings,
    dishes,
    ingredients,
    matches,
    forecasts,
    score: scores[0] ?? null,
    contacts,
    rankings,
    history,
    sequences,
    messages,
    events: [...events].sort((a, b) => (a.created_at ?? "").localeCompare(b.created_at ?? "")),
    suppressions,
  };
}

/* -------------------------------------------------------- edge functions */

export interface StartResearchResponse {
  run_id: string;
  account_id: string;
  status: "queued" | "running" | "failed_partial";
}

export function startAccountResearch(input: {
  website_url: string;
  company_name?: string;
  notes?: string;
}): Promise<StartResearchResponse> {
  const body: Record<string, string> = { website_url: input.website_url };
  if (input.company_name) body["company_name"] = input.company_name;
  if (input.notes) body["notes"] = input.notes;
  return callFunction<StartResearchResponse>("start-account-research", body);
}

export function approveSequence(input: {
  sequence_id: string;
  messages: { id: string; subject: string; body: string }[];
}): Promise<{ ok?: boolean }> {
  return callFunction("approve-sequence", {
    sequence_id: input.sequence_id,
    approved: true,
    messages: input.messages,
  });
}

export function recordOutreachEvent(input: {
  account_id: string;
  contact_id?: string;
  message_id?: string;
  event_type: EventType;
  idempotency_key: string;
}): Promise<{ ok?: boolean }> {
  const body: Record<string, unknown> = {
    account_id: input.account_id,
    event_type: input.event_type,
    provider: "manual_demo",
    idempotency_key: input.idempotency_key,
    payload: {},
  };
  if (input.contact_id) body["contact_id"] = input.contact_id;
  if (input.message_id) body["message_id"] = input.message_id;
  return callFunction("outreach-event", body);
}

/* ------------------------------------------------------------------- auth */

export async function currentSessionEmail(): Promise<string | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user?.email ?? null;
}
