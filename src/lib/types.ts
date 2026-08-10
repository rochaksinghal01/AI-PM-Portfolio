export type EvidenceLabel = "observed" | "inferred" | "hypothesis";

export type RunStatus =
  | "accepted"
  | "queued"
  | "researching"
  | "evidence_collected"
  | "scored"
  | "contacts_enriched"
  | "draft_ready"
  | "failed_partial"
  | "running"
  | "complete";

export const RUN_STAGES: { key: RunStatus; label: string }[] = [
  { key: "accepted", label: "Accepted" },
  { key: "queued", label: "Queued" },
  { key: "researching", label: "Researching" },
  { key: "evidence_collected", label: "Evidence collected" },
  { key: "scored", label: "Scored" },
  { key: "contacts_enriched", label: "Contacts enriched" },
  { key: "draft_ready", label: "Draft ready" },
];

export type EventType =
  | "cta_click"
  | "positive_reply"
  | "meeting_booked"
  | "manual_engaged"
  | "opportunity_created"
  | "negative_reply"
  | "negative_org_reply"
  | "unsubscribe"
  | "hard_bounce"
  | "out_of_office";

export interface PipelineRow {
  account_id: string;
  company_name: string;
  domain: string;
  score: number | null;
  tier: string | null;
  stage: string | null;
  latest_run_status: RunStatus | null;
  suppressed: boolean | null;
  engaged: boolean | null;
  updated_at: string | null;
  estimated_opportunity: number | null;
  active_sequences: number | null;
}

export interface AccountRecord {
  id: string;
  company_name: string;
  domain: string;
  parent_company: string | null;
  segment: string | null;
  service_area: string | null;
  service_area_fit: string | null;
  scale_signals: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface ResearchRun {
  id: string;
  account_id: string;
  status: RunStatus;
  stage: string | null;
  error_summary: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface ResearchSource {
  id: string;
  account_id: string;
  url: string;
  source_type: string | null;
  retrieved_at: string | null;
  retained_passage: string | null;
  source_key: string | null;
}

export interface AccountFinding {
  id: string;
  account_id: string;
  category: string | null;
  statement: string;
  label: EvidenceLabel;
  source_id: string | null;
}

export interface Dish {
  id: string;
  account_id: string;
  name: string;
  description: string | null;
  source_id: string | null;
}

export interface RecipeIngredient {
  id: string;
  dish_id: string;
  ingredient_name: string;
  role: string | null;
  source_id: string | null;
}

export interface IngredientMatch {
  id: string;
  account_id: string;
  catalog_item_id: string | null;
  knoxx_item_name: string | null;
  match_reason: string | null;
  confidence: number | null;
  ingredient_name: string | null;
}

export interface QuantityForecast {
  id: string;
  account_id: string;
  ingredient_match_id: string | null;
  formula_inputs: Record<string, unknown> | null;
  weekly_low: number | null;
  weekly_base: number | null;
  weekly_high: number | null;
  monthly_low: number | null;
  monthly_base: number | null;
  monthly_high: number | null;
  annual_low: number | null;
  annual_base: number | null;
  annual_high: number | null;
  unit: string | null;
}

export interface AccountScore {
  id: string;
  account_id: string;
  total: number | null;
  tier: string | null;
  components: Record<string, number> | null;
  risk_penalty: number | null;
  reasons: string[] | null;
  rule_version: string | null;
}

export interface ContactRow {
  id: string;
  account_id: string;
  full_name: string;
  title: string | null;
  persona: string | null;
  email: string | null;
  email_status: string | null;
  is_synthetic: boolean | null;
  activation_eligible: boolean | null;
}

export interface ContactRanking {
  id: string;
  contact_id: string;
  account_id: string;
  rank: number | null;
  components: Record<string, number> | null;
  explanation: string | null;
}

export interface HistoricalOutcome {
  id: string;
  account_id: string;
  contact_id: string | null;
  summary: string | null;
  outcome: string | null;
  is_synthetic: boolean | null;
  occurred_at: string | null;
}

export interface OutreachSequence {
  id: string;
  account_id: string;
  contact_id: string | null;
  status: string;
  cadence_days?: number[] | null;
  created_at: string | null;
}

export interface OutreachMessage {
  id: string;
  sequence_id: string;
  day_offset: number;
  subject: string;
  body: string;
  status: string;
  approved_claims: string[] | null;
  evidence_refs: string[] | null;
  intended_recipient: string | null;
}

export interface EngagementEvent {
  id: string;
  account_id: string;
  contact_id: string | null;
  message_id: string | null;
  event_type: EventType;
  provider: string | null;
  created_at: string | null;
  payload: Record<string, unknown> | null;
}

export interface SuppressionEntry {
  id: string;
  account_id: string | null;
  contact_id: string | null;
  scope: string | null;
  reason: string | null;
  created_at: string | null;
}

export interface AccountReport {
  account: AccountRecord;
  runs: ResearchRun[];
  sources: ResearchSource[];
  findings: AccountFinding[];
  dishes: Dish[];
  ingredients: RecipeIngredient[];
  matches: IngredientMatch[];
  forecasts: QuantityForecast[];
  score: AccountScore | null;
  contacts: ContactRow[];
  rankings: ContactRanking[];
  history: HistoricalOutcome[];
  sequences: OutreachSequence[];
  messages: OutreachMessage[];
  events: EngagementEvent[];
  suppressions: SuppressionEntry[];
}
