import { cn } from "@/lib/utils";

interface ScoreBadgeProps {
  score: number;
  size?: "sm" | "md" | "lg";
}

export function ScoreBadge({ score, size = "md" }: ScoreBadgeProps) {
  const getScoreClass = () => {
    if (score >= 90) return "score-excellent";
    if (score >= 80) return "score-good";
    if (score >= 70) return "score-average";
    return "score-poor";
  };

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
    lg: "text-lg px-4 py-1.5 font-bold",
  };

  return (
    <span className={cn("score-badge", getScoreClass(), sizeClasses[size])}>
      {score.toFixed(1)}
    </span>
  );
}
