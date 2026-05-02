import { CallEvaluationResult, DashboardKPIs, TranscriptLine } from '@/types/callEvaluation';

export const TEAMS = [
  { id: 'cx_team', name: 'Customer Experience Team' },
  { id: 'billing_team', name: 'Billing & Finance Team' },
  { id: 'product_team', name: 'Product Team' },
  { id: 'fraud_team', name: 'Fraud & Security Team' },
  { id: 'technical_support', name: 'Technical Support' },
  { id: 'operations', name: 'Operations Team' },
  { id: 'leadership', name: 'Leadership Team' },
];

export const ROOT_CAUSES = [
  'product_defect',
  'unclear_documentation',
  'agent_error',
  'system_failure',
  'policy_gap',
  'process_inefficiency',
  'communication_breakdown',
  'training_gap',
  'third_party_failure',
  'customer_misunderstanding',
  'technical_limitation',
  'pricing_confusion',
  'sop_non_compliance',
  'integration_failure',
  'data_quality_issue',
];

export const BPOS = [
  { id: 'bpo_1', name: 'BPO 1 - TechServe' },
  { id: 'bpo_2', name: 'BPO 2 - GlobalConnect' },
  { id: 'bpo_3', name: 'BPO 3 - CustomerFirst' },
];

export const PRIMARY_TOPICS = [
  'billing_dispute',
  'refund_request',
  'product_bug',
  'feature_request',
  'account_access',
  'payment_failure',
  'unauthorized_charge',
  'service_downtime',
  'data_privacy',
  'cancellation_request',
  'upgrade_inquiry',
  'integration_issue',
  'documentation_gap',
  'agent_behavior_complaint',
  'policy_clarification',
  'return_exchange',
  'delivery_delay',
  'promotional_offer',
  'contract_terms',
  'technical_error',
];

export const mockEvaluatedCalls: (CallEvaluationResult & { id: string; evaluatedAt: string })[] = [
  {
    id: 'CALL001',
    evaluatedAt: '2025-01-15T10:45:00Z',
    call_metadata: {
      call_id: 'CALL001',
      call_type: 'inbound',
      customer_type: 'existing',
      start_time: '2025-01-15T10:30:00Z',
      end_time: '2025-01-15T10:38:45Z',
      duration_seconds: 525,
      language_detected: 'english',
      customer_drop_off: false,
    },
    classification_and_tagging: {
      primary_topic: 'unauthorized_charge',
      primary_topic_score: 0.89,
      secondary_topics: [{ topic: 'billing_dispute', score: 0.35 }],
      topic_analysis: {
        first_complaint: 'unauthorized_charge',
        recurrence_counts: { unauthorized_charge: 6, billing_dispute: 3 },
        duration_tokens: { unauthorized_charge: 380, billing_dispute: 145 },
        total_customer_utterances: 12,
        total_conversation_tokens: 525,
      },
      primary_intent: 'dispute_charge',
      primary_intent_confidence: 0.92,
      intent_breakdown: { clarity_score: 1.0, token_density_score: 0.8 },
      secondary_intent: 'request_refund',
      secondary_intent_confidence: 0.68,
      team_assignments: [
        { team_id: 'fraud_team', team_name: 'Fraud & Security Team', role: 'primary_owner', reason: 'RAG mapping for unauthorized_charge', rag_confidence: 1.0 },
        { team_id: 'billing_team', team_name: 'Billing & Finance Team', role: 'secondary_owner', reason: 'Refund processing involvement', rag_confidence: 1.0 },
      ],
      escalation_triggered: true,
      escalation_reason: 'Unauthorized charge triggers automatic leadership notification',
      escalation_conditions_evaluated: [{ condition: 'always', result: true, extracted_value: 'fraud issue' }],
      root_causes: [{ cause: 'third_party_failure', confidence: 0.85, evidence: 'Customer stated unauthorized charge from unknown merchant', impact_level: 'high' }],
      contributing_factors: ['Customer unaware of transaction source'],
      real_time_insights: [
        {
          insight_id: 'INS001',
          insight_type: 'fraud_alert',
          title: 'Unauthorized Charge Detected',
          description: 'Customer reports $49.99 unauthorized charge',
          urgency: 'high',
          detected_at: '2025-01-15T10:30:45Z',
          affected_teams: ['fraud_team', 'billing_team'],
          action_required: true,
          recommended_actions: ['Initiate fraud investigation', 'Monitor similar charges'],
          data_points: { merchant_name: 'Merchant XYZ', amount: 49.99 },
        },
      ],
      team_views: {
        cx_team_view: { agent_performance_score: 99.3, empathy_score: 14.85 },
        product_team_view: { bugs_reported: [], feature_requests: [] },
        operations_team_view: { sop_compliance_status: 'pass' },
        leadership_view: { critical_issues: ['unauthorized_charge_detected'] },
      },
    },
    dimension_1_understanding_accuracy_compliance: {
      problem_capture: { label: 'clear', customer_intent: 'Dispute unauthorized charge', agent_interpretation: 'Customer wants to dispute $49.99 charge', confidence: 0.95 },
      information_accuracy: { label: 'correct', misinformation_segments: [], confidence: 0.98 },
      compliance: { label: 'pass', violations: [], confidence: 1.0 },
      product_service_mapping: { label: 'correct', mapped_product: 'Credit Card Dispute Resolution', confidence: 0.92 },
      routing_alignment: { label: 'correct', correct_team: 'fraud_department', chosen_team: 'fraud_department', confidence: 1.0 },
      score: 34.65,
      alerts: [],
    },
    dimension_2_communication_clarity: {
      greeting: { label: 'present', tone: 'warm', confidence: 1.0 },
      language_alignment: { customer_language: 'english', agent_language: 'english', label: 'aligned', confidence: 1.0 },
      speech_clarity: { label: 'clear', issues: [], confidence: 0.98 },
      listening: { interruptions: 0, forced_repetitions: 0, label: 'good' },
      explanation_structure: { label: 'structured', confidence: 0.9 },
      agent_noise: { label: 'none', confidence: 1.0 },
      score: 19.8,
      alerts: [],
    },
    dimension_3_responsiveness_efficiency: {
      response_latency: { average_turn_delay_sec: 2, max_turn_delay_sec: 4, delay_flags: [] },
      hold_handling: { justification_present: 'yes', hold_duration_sec: 28, label: 'appropriate', confidence: 1.0 },
      verification_timing: { label: 'appropriate', confidence: 1.0 },
      dead_air: { total_duration_sec: 0, largest_gap_sec: 0, label: 'acceptable' },
      efficiency_notes: 'Excellent pace with proper hold protocol',
      score: 15.0,
      alerts: [],
    },
    dimension_4_emotional_intelligence: {
      customer_emotion_start: 'frustrated',
      customer_emotion_end: 'satisfied',
      emotion_shift: 'improved',
      empathy_markers: { detected: true, phrases: ['I understand your concern', 'I apologize for the inconvenience'] },
      agent_patience_level: { label: 'high', confidence: 0.95 },
      escalation_intent_detected: false,
      deescalation_attempts: 0,
      score: 14.85,
      alerts: [],
    },
    dimension_5_resolution_closure: {
      solution_correctness: { label: 'correct', confidence: 0.98 },
      next_steps_clarity: { label: 'clear', eta_provided: true, confidence: 1.0 },
      customer_confirmation: { label: 'confirmed', phrases: ['yes, that sounds good', 'thank you'] },
      closure_quality: { label: 'proper', confidence: 1.0 },
      handover_quality: { label: 'correct', team: 'fraud_department' },
      score: 15.0,
      alerts: [],
    },
    weighted_overall_score: 99.3,
    global_alerts: [],
    summary: {
      strengths: ['Perfect verification and compliance adherence', 'Strong empathy with positive emotional outcome', 'Clear resolution with proper fraud escalation'],
      improvements: [],
      critical_issues: [],
      one_line_summary: 'Outstanding fraud dispute handling with perfect compliance, empathy, and resolution clarity.',
    },
  },
];

export const mockDashboardKPIs: DashboardKPIs = {
  totalCalls: 1247,
  totalIssues: 342,
  complianceFailures: 18,
  incorrectSolutions: 23,
  escalationsTriggered: 89,
  averageScore: 87.4,
  emotionShiftPositive: 68,
  emotionShiftNegative: 12,
};

export const parseTranscript = (text: string): TranscriptLine[] => {
  const lines = text.trim().split('\n');
  const parsed: TranscriptLine[] = [];
  
  for (const line of lines) {
    const match = line.match(/^\[(\d{2}:\d{2}:\d{2})\]\s*(Agent|Customer):\s*(.+)$/i);
    if (match) {
      parsed.push({
        timestamp: match[1],
        speaker: match[2] as 'Agent' | 'Customer',
        text: match[3],
      });
    }
  }
  
  return parsed;
};

export const validateTranscriptFormat = (text: string): { valid: boolean; error?: string } => {
  if (!text.trim()) {
    return { valid: false, error: 'Please enter a call transcript' };
  }
  
  const lines = text.trim().split('\n').filter(l => l.trim());
  if (lines.length === 0) {
    return { valid: false, error: 'Transcript appears to be empty' };
  }
  
  const validLinePattern = /^\[(\d{2}:\d{2}:\d{2})\]\s*(Agent|Customer):\s*.+$/i;
  const invalidLines: number[] = [];
  
  lines.forEach((line, idx) => {
    if (!validLinePattern.test(line.trim())) {
      invalidLines.push(idx + 1);
    }
  });
  
  if (invalidLines.length > 0) {
    return {
      valid: false,
      error: `Invalid format on line(s): ${invalidLines.slice(0, 3).join(', ')}${invalidLines.length > 3 ? '...' : ''}. Expected format: [HH:MM:SS] Speaker: Text`,
    };
  }
  
  return { valid: true };
};
