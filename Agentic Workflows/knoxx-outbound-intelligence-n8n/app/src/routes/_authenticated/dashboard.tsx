import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Activity, Building2, CheckCircle2, Coins } from "lucide-react";

import {
  EngagedBadge,
  RunStatusBadge,
  StageBadge,
  SuppressedBadge,
  TierBadge,
} from "@/components/knoxx/badges";
import { EmptyState, ErrorState, LoadingState, Section } from "@/components/knoxx/states";
import { fetchPipeline } from "@/lib/api";
import { getSupabase } from "@/integrations/supabase/client";
import { quantity, relativeTime } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
  head: () => ({
    meta: [
      { title: "Account pipeline — Knoxx Outbound Intelligence" },
      {
        name: "description",
        content:
          "Track researched accounts, qualification tiers, estimated ingredient opportunity and active outreach sequences in one auditable pipeline.",
      },
      { property: "og:title", content: "Account pipeline — Knoxx Outbound Intelligence" },
      {
        property: "og:description",
        content: "Researched accounts, qualification tiers and active outreach sequences.",
      },
    ],
  }),
});

function Kpi({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: typeof Building2;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4" />
        <span className="text-sm font-medium">{label}</span>
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-foreground">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

function Dashboard() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["pipeline"],
    queryFn: fetchPipeline,
    refetchInterval: 20_000,
  });

  // Run-stage changes arrive over realtime; polling above is the fallback.
  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;
    const channel = supabase
      .channel("research_runs_pipeline")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "research_runs" },
        () => void queryClient.invalidateQueries({ queryKey: ["pipeline"] }),
      )
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const rows = query.data ?? [];
  const qualified = rows.filter((r) => ["qualified", "A", "B"].includes(String(r.tier))).length;
  const opportunity = rows.reduce((sum, r) => sum + (r.estimated_opportunity ?? 0), 0);
  const sequences = rows.reduce((sum, r) => sum + (r.active_sequences ?? 0), 0);
  const anyOpportunity = rows.some((r) => r.estimated_opportunity !== null);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">Account pipeline</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Everything here is persisted server-side. Scores and volumes are shown exactly as the
          engine stored them — nothing is recalculated in your browser.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi
          icon={Building2}
          label="Accounts researched"
          value={String(rows.length)}
          hint="Accounts with at least one research run"
        />
        <Kpi
          icon={CheckCircle2}
          label="Qualified accounts"
          value={String(qualified)}
          hint="Qualified on the stored rubric"
        />
        <Kpi
          icon={Coins}
          label="Estimated annual demand"
          value={anyOpportunity ? quantity(opportunity, "kg") : "insufficient_evidence"}
          hint="Sum of persisted base-case ingredient forecasts"
        />
        <Kpi
          icon={Activity}
          label="Active sequences"
          value={String(sequences)}
          hint="Approved sequences currently running"
        />
      </div>

      <Section
        title="Accounts"
        description="Stage and run status update automatically as workflows progress."
      >
        {query.isLoading ? (
          <LoadingState label="Loading pipeline" />
        ) : query.isError ? (
          <ErrorState error={query.error} retry={() => void query.refetch()} />
        ) : rows.length === 0 ? (
          <EmptyState
            title="No accounts yet"
            hint="Start a research run with a company website to build the first evidence-backed profile."
          />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border bg-card">
            <table className="w-full min-w-[880px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Company</th>
                  <th className="px-4 py-3 font-medium">Score / tier</th>
                  <th className="px-4 py-3 font-medium">Stage</th>
                  <th className="px-4 py-3 font-medium">Latest run</th>
                  <th className="px-4 py-3 font-medium">Flags</th>
                  <th className="px-4 py-3 font-medium">Updated</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row.account_id}
                    className="border-b border-border/70 last:border-0 hover:bg-secondary/50"
                  >
                    <td className="px-4 py-3">
                      <Link
                        to="/accounts/$accountId"
                        params={{ accountId: row.account_id }}
                        className="font-medium text-foreground hover:underline"
                      >
                        {row.company_name}
                      </Link>
                      <p className="text-xs text-muted-foreground">{row.domain}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium tabular-nums">
                          {row.score ?? "insufficient_evidence"}
                        </span>
                        <TierBadge tier={row.tier} />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <StageBadge stage={row.stage} />
                    </td>
                    <td className="px-4 py-3">
                      <RunStatusBadge status={row.latest_run_status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        {row.suppressed ? <SuppressedBadge /> : null}
                        {row.engaged ? <EngagedBadge /> : null}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {relativeTime(row.updated_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>
    </div>
  );
}
