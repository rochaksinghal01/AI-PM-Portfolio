import { useState } from "react";
import { ChevronDown, ChevronUp, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScoreBadge } from "./ScoreBadge";

interface DimensionCardProps {
  title: string;
  description: string;
  score: number;
  maxScore: number;
  data: any;
  delay?: number;
}

export function DimensionCard({ title, description, score, maxScore, data, delay = 0 }: DimensionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const percentage = (score / maxScore) * 100;

  const getStatusIcon = (label: string) => {
    const positiveLabels = ["clear", "correct", "pass", "present", "aligned", "good", "appropriate", "acceptable", "proper", "confirmed", "improved", "high"];
    const negativeLabels = ["missing", "incorrect", "fail", "unclear", "misaligned", "poor", "worsened", "low"];
    
    if (positiveLabels.includes(label?.toLowerCase())) {
      return <CheckCircle2 className="h-4 w-4 text-success" />;
    }
    if (negativeLabels.includes(label?.toLowerCase())) {
      return <XCircle className="h-4 w-4 text-destructive" />;
    }
    return <AlertTriangle className="h-4 w-4 text-warning" />;
  };

  const renderSubfactors = () => {
    const entries = Object.entries(data).filter(
      ([key]) => !["score", "alerts"].includes(key)
    );

    return (
      <div className="mt-4 pt-4 border-t border-border space-y-3">
        {entries.map(([key, value]: [string, any]) => {
          const label = typeof value === "object" ? value.label || value.tone : value;
          const confidence = typeof value === "object" ? value.confidence : null;
          
          return (
            <div key={key} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {typeof label === "string" && getStatusIcon(label)}
                <span className="text-sm text-foreground capitalize">
                  {key.replace(/_/g, " ")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {typeof label === "string" && (
                  <span className="text-sm text-muted-foreground capitalize">{label}</span>
                )}
                {confidence !== null && (
                  <span className="text-xs text-muted-foreground">
                    ({(confidence * 100).toFixed(0)}%)
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div
      className="dimension-card animate-slide-up"
      style={{ animationDelay: `${delay}s` }}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h4 className="text-base font-semibold text-foreground">{title}</h4>
            <ScoreBadge score={percentage} size="sm" />
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <button className="p-1 hover:bg-secondary rounded-md transition-colors">
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          )}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>Score</span>
          <span>{score.toFixed(2)} / {maxScore}</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              percentage >= 90 ? "bg-success" :
              percentage >= 80 ? "bg-emerald-500" :
              percentage >= 70 ? "bg-warning" :
              "bg-destructive"
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && renderSubfactors()}

      {/* Alerts */}
      {data.alerts && data.alerts.length > 0 && (
        <div className="mt-4 space-y-2">
          {data.alerts.map((alert: string, i: number) => (
            <div key={i} className="alert-badge alert-warning w-full justify-start">
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>{alert}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
