import { ScoreBadge } from "./ScoreBadge";
import { 
  AlertTriangle, 
  TrendingUp, 
  Tag, 
  Target,
  ShieldAlert,
  Heart
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CallSummaryCardProps {
  data: any;
}

export function CallSummaryCard({ data }: CallSummaryCardProps) {
  const { classification_and_tagging, weighted_overall_score, summary, dimension_4_emotional_intelligence } = data;
  
  const hasAlerts = classification_and_tagging.real_time_insights?.some(
    (i: any) => i.urgency === "high" || i.urgency === "critical"
  );

  return (
    <div className="dashboard-card animate-slide-up">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Call Summary</h3>
          <p className="text-sm text-muted-foreground mt-1">{data.call_metadata.call_id}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground mb-1">Overall Score</p>
          <ScoreBadge score={weighted_overall_score} size="lg" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Tag className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wider">Primary Topic</span>
          </div>
          <p className="text-sm font-medium text-foreground capitalize">
            {classification_and_tagging.primary_topic.replace(/_/g, " ")}
          </p>
          <p className="text-xs text-muted-foreground">
            Confidence: {(classification_and_tagging.primary_topic_score * 100).toFixed(0)}%
          </p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Target className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wider">Intent</span>
          </div>
          <p className="text-sm font-medium text-foreground capitalize">
            {classification_and_tagging.primary_intent.replace(/_/g, " ")}
          </p>
          <p className="text-xs text-muted-foreground">
            Confidence: {(classification_and_tagging.primary_intent_confidence * 100).toFixed(0)}%
          </p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wider">Root Cause</span>
          </div>
          <p className="text-sm font-medium text-foreground capitalize">
            {classification_and_tagging.root_causes[0]?.cause.replace(/_/g, " ") || "N/A"}
          </p>
          <p className="text-xs text-muted-foreground">
            Impact: {classification_and_tagging.root_causes[0]?.impact_level || "N/A"}
          </p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Heart className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wider">Emotion Shift</span>
          </div>
          <p className="text-sm font-medium text-foreground capitalize">
            {dimension_4_emotional_intelligence.emotion_shift}
          </p>
          <p className="text-xs text-muted-foreground">
            {dimension_4_emotional_intelligence.customer_emotion_start} → {dimension_4_emotional_intelligence.customer_emotion_end}
          </p>
        </div>
      </div>

      {/* Alerts */}
      {hasAlerts && (
        <div className="space-y-2 mb-6">
          {classification_and_tagging.real_time_insights
            ?.filter((i: any) => i.urgency === "high" || i.urgency === "critical")
            .map((insight: any) => (
              <div
                key={insight.insight_id}
                className={cn(
                  "alert-badge w-full justify-start",
                  insight.urgency === "critical" ? "alert-critical" : "alert-warning"
                )}
              >
                <ShieldAlert className="h-3.5 w-3.5" />
                <span>{insight.title}</span>
              </div>
            ))}
        </div>
      )}

      {/* Summary */}
      <div className="pt-4 border-t border-border">
        <p className="text-sm text-foreground leading-relaxed">{summary.one_line_summary}</p>
        
        {summary.strengths.length > 0 && (
          <div className="mt-4">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Strengths</p>
            <div className="flex flex-wrap gap-2">
              {summary.strengths.map((strength: string, i: number) => (
                <span key={i} className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-success/10 text-success text-xs">
                  <TrendingUp className="h-3 w-3" />
                  {strength}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
