import type { EvidenceLabel, RunStatus } from "@/lib/types";

export const INSUFFICIENT = "insufficient_evidence";

/**
 * Never invent precision. A missing/NaN input renders as `insufficient_evidence`,
 * never as 0.
 */
export function quantity(value: number | null | undefined, unit?: string | null): string {
  if (value === null || value === undefined || Number.isNaN(value)) return INSUFFICIENT;
  const formatted = new Intl.NumberFormat("en-AU", { maximumFractionDigits: 0 }).format(value);
  return unit ? `${formatted} ${unit}` : formatted;
}

export function currency(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return INSUFFICIENT;
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Portfolio UI must never reveal a full real prospect email.
 * Synthetic/demo addresses are shown in full so reviewers can see the fixture.
 */
export function maskEmail(email: string | null | undefined, isSynthetic = false): string {
  if (!email) return INSUFFICIENT;
  if (isSynthetic) return email;
  const [local = "", domain = ""] = email.split("@");
  if (!domain || !local) return "•••••";
  const keepLocal = local.slice(0, 1);
  const [host = "", ...rest] = domain.split(".");
  const keepHost = host.slice(0, 1);
  const tld = rest.length ? `.${rest.join(".")}` : "";
  return `${keepLocal}${"•".repeat(Math.max(3, local.length - 1))}@${keepHost}${"•".repeat(
    Math.max(3, host.length - 1),
  )}${tld}`;
}

export function relativeTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "—";
  const diff = Date.now() - then;
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

export function absoluteTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-AU", { dateStyle: "medium", timeStyle: "short" });
}

export const EVIDENCE_LABEL_COPY: Record<EvidenceLabel, string> = {
  observed: "Observed — taken directly from a retained source passage",
  inferred: "Inferred — derived from observed evidence, not stated outright",
  hypothesis: "Hypothesis — a working assumption awaiting evidence",
};

export const RUN_STATUS_COPY: Record<string, string> = {
  accepted: "Accepted",
  queued: "Queued",
  running: "Researching",
  researching: "Researching",
  evidence_collected: "Evidence collected",
  scored: "Scored",
  contacts_enriched: "Contacts enriched",
  draft_ready: "Draft ready",
  complete: "Complete",
  failed_partial: "Partial failure",
};

export function runStatusLabel(status: RunStatus | string | null | undefined): string {
  if (!status) return "Unknown";
  return RUN_STATUS_COPY[status] ?? status;
}

/** Stable idempotency key for manual demo events. */
export function demoIdempotencyKey(parts: (string | null | undefined)[]): string {
  return ["manual_demo", ...parts.filter(Boolean)].join(":");
}
