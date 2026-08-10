import { cn } from "@/lib/utils";
import { EVIDENCE_LABEL_COPY, runStatusLabel } from "@/lib/format";
import type { EvidenceLabel } from "@/lib/types";

const base =
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap";

export function EvidenceBadge({ label }: { label: EvidenceLabel }) {
  const tone =
    label === "observed"
      ? "border-success/30 bg-success-soft text-success"
      : label === "inferred"
        ? "border-info/30 bg-info-soft text-info"
        : "border-warning/40 bg-warning-soft text-warning-foreground";
  return (
    <span className={cn(base, tone)} title={EVIDENCE_LABEL_COPY[label]}>
      {label}
    </span>
  );
}

export function RunStatusBadge({ status }: { status: string | null | undefined }) {
  const tone =
    status === "failed_partial"
      ? "border-destructive/40 bg-danger-soft text-destructive"
      : status === "draft_ready" || status === "complete"
        ? "border-success/30 bg-success-soft text-success"
        : "border-info/30 bg-info-soft text-info";
  return <span className={cn(base, tone)}>{runStatusLabel(status)}</span>;
}

export function StageBadge({ stage }: { stage: string | null | undefined }) {
  const tone =
    stage === "review"
      ? "border-warning/40 bg-warning-soft text-warning-foreground"
      : "border-border bg-secondary text-secondary-foreground";
  return <span className={cn(base, tone)}>{stage ?? "—"}</span>;
}

export function SuppressedBadge() {
  return (
    <span className={cn(base, "border-destructive/40 bg-danger-soft text-destructive")}>
      suppressed
    </span>
  );
}

export function EngagedBadge() {
  return (
    <span className={cn(base, "border-success/30 bg-success-soft text-success")}>engaged</span>
  );
}

export function SyntheticBadge({ what = "synthetic" }: { what?: string }) {
  return (
    <span className={cn(base, "border-warning/50 bg-warning-soft text-warning-foreground")}>
      {what}
    </span>
  );
}

export function TierBadge({ tier }: { tier: string | null | undefined }) {
  if (!tier) return <span className="text-muted-foreground">—</span>;
  return (
    <span className={cn(base, "border-primary/30 bg-accent text-accent-foreground")}>
      Tier {tier}
    </span>
  );
}
