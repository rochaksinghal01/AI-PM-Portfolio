import { Check, CircleDashed, Loader2, X } from "lucide-react";

import { RUN_STAGES } from "@/lib/types";
import { cn } from "@/lib/utils";

const ORDER: string[] = RUN_STAGES.map((s) => s.key);

function normalize(status: string | null | undefined): string {
  if (status === "running") return "researching";
  if (status === "complete") return "draft_ready";
  return status ?? "accepted";
}

export function StageTracker({ status }: { status: string | null | undefined }) {
  const current = normalize(status);
  const failed = current === "failed_partial";
  const index = failed ? ORDER.length : ORDER.indexOf(current);

  return (
    <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
      {RUN_STAGES.map((stage, i) => {
        const done = index > i;
        const active = index === i;
        return (
          <li
            key={stage.key}
            className={cn(
              "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm",
              done && "border-success/30 bg-success-soft text-success",
              active && "border-primary/40 bg-accent text-accent-foreground",
              !done && !active && "border-border bg-card text-muted-foreground",
            )}
          >
            {done ? (
              <Check className="h-4 w-4" />
            ) : active ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CircleDashed className="h-4 w-4" />
            )}
            <span className="font-medium">{stage.label}</span>
          </li>
        );
      })}
      {failed ? (
        <li className="flex items-center gap-2 rounded-lg border border-destructive/40 bg-danger-soft px-3 py-2 text-sm text-destructive sm:col-span-2 lg:col-span-4">
          <X className="h-4 w-4" />
          <span className="font-medium">
            Failed partial — the run stopped early; collected data is still shown.
          </span>
        </li>
      ) : null}
    </ol>
  );
}
