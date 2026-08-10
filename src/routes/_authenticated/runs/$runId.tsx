import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { ArrowRight } from "lucide-react";

import { RunStatusBadge } from "@/components/knoxx/badges";
import { StageTracker } from "@/components/knoxx/stage-tracker";
import { ErrorState, LoadingState, PartialFailureState, Section } from "@/components/knoxx/states";
import { fetchRun } from "@/lib/api";
import { getSupabase } from "@/integrations/supabase/client";
import { absoluteTime } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/runs/$runId")({
  component: RunView,
  head: () => ({
    meta: [
      { title: "Research run progress — Knoxx Outbound Intelligence" },
      {
        name: "description",
        content:
          "Follow a research run through evidence collection, scoring, contact enrichment and draft readiness, with the persisted status shown at every stage.",
      },
      { property: "og:title", content: "Research run progress — Knoxx Outbound Intelligence" },
      {
        property: "og:description",
        content: "Stage-by-stage progress for an evidence-backed account research run.",
      },
    ],
  }),
});

function RunView() {
  const { runId } = useParams({ from: "/_authenticated/runs/$runId" });
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["run", runId],
    queryFn: () => fetchRun(runId),
    refetchInterval: 5_000,
  });

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;
    const channel = supabase
      .channel(`research_run_${runId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "research_runs", filter: `id=eq.${runId}` },
        () => void queryClient.invalidateQueries({ queryKey: ["run", runId] }),
      )
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [runId, queryClient]);

  if (query.isLoading) return <LoadingState label="Loading run" />;
  if (query.isError) return <ErrorState error={query.error} retry={() => void query.refetch()} />;

  const run = query.data;
  if (!run) return <ErrorState error={new Error("This run is not visible to you.")} />;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Research run</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Accepted {absoluteTime(run.created_at)} · updated {absoluteTime(run.updated_at)}
          </p>
        </div>
        <RunStatusBadge status={run.status} />
      </div>

      {run.status === "failed_partial" ? <PartialFailureState summary={run.error_summary} /> : null}

      <Section
        title="Stages"
        description="Status is read back from the database — an accepted request is not the same as a finished run."
      >
        <StageTracker status={run.status} />
      </Section>

      <Link
        to="/accounts/$accountId"
        params={{ accountId: run.account_id }}
        className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        Open account intelligence report <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
