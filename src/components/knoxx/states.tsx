import { AlertTriangle, Inbox, Loader2, Lock } from "lucide-react";
import type { ReactNode } from "react";

import { ApiError } from "@/lib/api";
import { cn } from "@/lib/utils";

function Frame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-card/60 px-6 py-10 text-center",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function LoadingState({ label = "Loading" }: { label?: string }) {
  return (
    <Frame>
      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      <p className="text-sm text-muted-foreground">{label}…</p>
    </Frame>
  );
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <Frame>
      <Inbox className="h-5 w-5 text-muted-foreground" />
      <p className="text-sm font-medium text-foreground">{title}</p>
      {hint ? <p className="max-w-md text-sm text-muted-foreground">{hint}</p> : null}
    </Frame>
  );
}

export function PartialFailureState({ summary }: { summary?: string | null }) {
  return (
    <div className="flex gap-3 rounded-lg border border-destructive/30 bg-danger-soft px-4 py-3">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
      <div className="text-sm">
        <p className="font-medium text-destructive">Partial failure — needs review</p>
        <p className="mt-1 text-foreground/80">
          {summary ??
            "This run finished with missing evidence. Everything below is what was collected; treat gaps as unknown, not as zero."}
        </p>
      </div>
    </div>
  );
}

export function ErrorState({ error, retry }: { error: unknown; retry?: () => void }) {
  const isPermission = error instanceof ApiError && error.kind === "permission";
  const message =
    error instanceof Error ? error.message : "Something went wrong loading this section.";
  return (
    <Frame className="border-destructive/30 bg-danger-soft">
      {isPermission ? (
        <Lock className="h-5 w-5 text-destructive" />
      ) : (
        <AlertTriangle className="h-5 w-5 text-destructive" />
      )}
      <p className="text-sm font-medium text-destructive">
        {isPermission ? "You do not have access to this data" : "Could not load this section"}
      </p>
      <p className="max-w-md text-sm text-foreground/80">{message}</p>
      {retry ? (
        <button
          onClick={retry}
          className="mt-1 rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium hover:bg-secondary"
        >
          Try again
        </button>
      ) : null}
    </Frame>
  );
}

export function Section({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-foreground">{title}</h2>
          {description ? (
            <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {actions}
      </div>
      {children}
    </section>
  );
}
