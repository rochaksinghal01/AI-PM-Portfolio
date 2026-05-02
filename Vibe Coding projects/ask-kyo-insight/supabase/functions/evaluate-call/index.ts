import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `You are a Call Quality Analyzer AI. Your task is to evaluate customer service call transcripts against defined quality dimensions and output structured JSON. You must NOT generate creative content, make assumptions, or hallucinate data. Use ONLY the provided options and data sources.

PREDEFINED WORD LISTS:
Tonality: warm, neutral, robotic, professional, empathetic, indifferent, impatient, rushed, dismissive, condescending
Emotions: neutral, irritated, angry, frustrated, confused, happy, satisfied, disappointed, anxious, relieved
Clarity Issues: mumbling, too_fast, too_slow, accent_barrier, technical_jargon, incomplete_sentences, rambling, background_noise
Compliance Violations: misleading_commitment, wrong_eligibility, incorrect_timeline, unauthorized_promise, policy_breach, verification_skipped, data_privacy_breach

PRIMARY TOPICS (20 options): billing_dispute, refund_request, product_bug, feature_request, account_access, payment_failure, unauthorized_charge, service_downtime, data_privacy, cancellation_request, upgrade_inquiry, integration_issue, documentation_gap, agent_behavior_complaint, policy_clarification, return_exchange, delivery_delay, promotional_offer, contract_terms, technical_error

CUSTOMER INTENTS (15 options): resolve_issue, get_information, request_refund, escalate_complaint, cancel_service, upgrade_service, provide_feedback, verify_transaction, reset_password, update_account, dispute_charge, track_status, understand_policy, report_bug, request_callback

ROOT CAUSE CATEGORIES (15 options): product_defect, unclear_documentation, agent_error, system_failure, policy_gap, process_inefficiency, communication_breakdown, training_gap, third_party_failure, customer_misunderstanding, technical_limitation, pricing_confusion, sop_non_compliance, integration_failure, data_quality_issue

Evaluate the transcript and return a complete JSON with:
- call_metadata
- classification_and_tagging (primary_topic, intent, team_assignments, root_causes, real_time_insights)
- dimension_1_understanding_accuracy_compliance (score out of 35)
- dimension_2_communication_clarity (score out of 20)
- dimension_3_responsiveness_efficiency (score out of 15)
- dimension_4_emotional_intelligence (score out of 15)
- dimension_5_resolution_closure (score out of 15)
- weighted_overall_score (0-100)
- summary with strengths, improvements, critical_issues, one_line_summary

All scores should be calculated based on the formulas provided. Be precise and do not hallucinate.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { transcript, callType, customerType } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const userPrompt = `Evaluate this call transcript:

Call Type: ${callType}
Customer Type: ${customerType}

Transcript:
${transcript}

Return ONLY valid JSON matching the complete evaluation schema. Include all dimensions, scores, and insights.`;

    console.log("Sending request to Lovable AI Gateway...");
    
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (status === 402) {
        return new Response(
          JSON.stringify({ error: "Usage limit reached. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI Gateway error:", status, errorText);
      throw new Error(`AI Gateway error: ${status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error("No content in AI response");
    }

    // Extract JSON from the response
    let jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
    let jsonStr = jsonMatch ? jsonMatch[1] : content;
    
    // Try to parse the JSON
    let evaluation;
    try {
      evaluation = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", parseError);
      // Try to find JSON object in the content
      const jsonStart = content.indexOf('{');
      const jsonEnd = content.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd !== -1) {
        jsonStr = content.slice(jsonStart, jsonEnd + 1);
        evaluation = JSON.parse(jsonStr);
      } else {
        throw new Error("Could not extract valid JSON from AI response");
      }
    }

    // Add call_id and timestamps if not present
    if (!evaluation.call_metadata) {
      evaluation.call_metadata = {};
    }
    evaluation.call_metadata.call_id = `CALL${Date.now()}`;
    evaluation.call_metadata.call_type = callType;
    evaluation.call_metadata.customer_type = customerType;

    console.log("Evaluation completed successfully");

    return new Response(JSON.stringify(evaluation), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in evaluate-call function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
