export type CallType = 'inbound' | 'outbound';
export type CustomerType = 'new' | 'existing';

export interface CallMetadata {
  call_id: string;
  call_type: CallType;
  customer_type: CustomerType;
  start_time: string;
  end_time: string;
  duration_seconds: number;
  language_detected: string;
  customer_drop_off: boolean;
}

export interface TopicAnalysis {
  first_complaint: string;
  recurrence_counts: Record<string, number>;
  duration_tokens: Record<string, number>;
  total_customer_utterances: number;
  total_conversation_tokens: number;
}

export interface TeamAssignment {
  team_id: string;
  team_name: string;
  role: 'primary_owner' | 'secondary_owner' | 'notify';
  reason: string;
  rag_confidence: number;
}

export interface RootCause {
  cause: string;
  confidence: number;
  evidence: string;
  impact_level: 'high' | 'medium' | 'low';
}

export interface RealTimeInsight {
  insight_id: string;
  insight_type: string;
  title: string;
  description: string;
  urgency: 'high' | 'medium' | 'low' | 'critical';
  detected_at: string;
  affected_teams: string[];
  action_required: boolean;
  recommended_actions: string[];
  data_points: Record<string, any>;
}

export interface DimensionScore {
  score: number;
  alerts: string[];
}

export interface Dimension1 extends DimensionScore {
  problem_capture: { label: string; customer_intent: string; agent_interpretation: string; confidence: number };
  information_accuracy: { label: string; misinformation_segments: string[]; confidence: number };
  compliance: { label: string; violations: string[]; confidence: number };
  product_service_mapping: { label: string; mapped_product: string; confidence: number };
  routing_alignment: { label: string; correct_team: string; chosen_team: string; confidence: number };
}

export interface Dimension2 extends DimensionScore {
  greeting: { label: string; tone: string; confidence: number };
  language_alignment: { customer_language: string; agent_language: string; label: string; confidence: number };
  speech_clarity: { label: string; issues: string[]; confidence: number };
  listening: { interruptions: number; forced_repetitions: number; label: string };
  explanation_structure: { label: string; confidence: number };
  agent_noise: { label: string; confidence: number };
}

export interface Dimension3 extends DimensionScore {
  response_latency: { average_turn_delay_sec: number; max_turn_delay_sec: number; delay_flags: string[] };
  hold_handling: { justification_present: string; hold_duration_sec: number; label: string; confidence: number };
  verification_timing: { label: string; confidence: number };
  dead_air: { total_duration_sec: number; largest_gap_sec: number; label: string };
  efficiency_notes: string;
}

export interface Dimension4 extends DimensionScore {
  customer_emotion_start: string;
  customer_emotion_end: string;
  emotion_shift: 'improved' | 'unchanged' | 'worsened';
  empathy_markers: { detected: boolean; phrases: string[] };
  agent_patience_level: { label: string; confidence: number };
  escalation_intent_detected: boolean;
  deescalation_attempts: number;
}

export interface Dimension5 extends DimensionScore {
  solution_correctness: { label: string; confidence: number };
  next_steps_clarity: { label: string; eta_provided: boolean; confidence: number };
  customer_confirmation: { label: string; phrases: string[] };
  closure_quality: { label: string; confidence: number };
  handover_quality: { label: string; team: string };
}

export interface ClassificationAndTagging {
  primary_topic: string;
  primary_topic_score: number;
  secondary_topics: { topic: string; score: number }[];
  topic_analysis: TopicAnalysis;
  primary_intent: string;
  primary_intent_confidence: number;
  intent_breakdown: { clarity_score: number; token_density_score: number };
  secondary_intent: string;
  secondary_intent_confidence: number;
  team_assignments: TeamAssignment[];
  escalation_triggered: boolean;
  escalation_reason: string;
  escalation_conditions_evaluated: { condition: string; result: boolean; extracted_value: any }[];
  root_causes: RootCause[];
  contributing_factors: string[];
  real_time_insights: RealTimeInsight[];
  team_views: {
    cx_team_view: any;
    product_team_view: any;
    operations_team_view: any;
    leadership_view: any;
  };
}

export interface CallEvaluationResult {
  call_metadata: CallMetadata;
  classification_and_tagging: ClassificationAndTagging;
  dimension_1_understanding_accuracy_compliance: Dimension1;
  dimension_2_communication_clarity: Dimension2;
  dimension_3_responsiveness_efficiency: Dimension3;
  dimension_4_emotional_intelligence: Dimension4;
  dimension_5_resolution_closure: Dimension5;
  weighted_overall_score: number;
  global_alerts: string[];
  summary: {
    strengths: string[];
    improvements: string[];
    critical_issues: string[];
    one_line_summary: string;
  };
}

export interface TranscriptLine {
  timestamp: string;
  speaker: 'Agent' | 'Customer';
  text: string;
  highlights?: {
    type: 'compliance' | 'empathy' | 'emotion' | 'error';
    reason: string;
  }[];
}

export interface DashboardFilters {
  dateRange: { start: Date | null; end: Date | null };
  bpos: string[];
  teams: string[];
  rootCauses: string[];
}

export interface DashboardKPIs {
  totalCalls: number;
  totalIssues: number;
  complianceFailures: number;
  incorrectSolutions: number;
  escalationsTriggered: number;
  averageScore: number;
  emotionShiftPositive: number;
  emotionShiftNegative: number;
}
