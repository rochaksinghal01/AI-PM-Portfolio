import { createFileRoute, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { EvidenceBadge, TierBadge } from "@/components/knoxx/badges";
import { OutreachApproval } from "@/components/knoxx/outreach-approval";
import { EmptyState, ErrorState, LoadingState, Section } from "@/components/knoxx/states";
import { fetchAccountReport } from "@/lib/api";
import { absoluteTime } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/accounts/$accountId")({
  component: AccountReportPage,
  head: () => ({
    meta: [
      { title: "Account intelligence report — Knoxx Outbound Intelligence" },
      {
        name: "description",
        content:
          "Evidence-backed company profile, ingredient qualification, buying committee and safe outreach approval for a single researched account.",
      },
      { property: "og:title", content: "Account intelligence report — Knoxx" },
      {
        property: "og:description",
        content: "Evidence, qualification, committee and outreach for one researched account.",
      },
    ],
  }),
});

const TABS = ["Profile", "Qualification", "Committee", "Outreach"] as const;

function AccountReportPage() {
  const { accountId } = useParams({ from: "/_authenticated/accounts/$accountId" });
  const [tab, setTab] = useState<(typeof TABS)[number]>("Profile");
  const query = useQuery({
    queryKey: ["report", accountId],
    queryFn: () => fetchAccountReport(accountId),
  });

  if (query.isLoading) return <LoadingState label="Loading account report" />;
  if (query.isError) return <ErrorState error={query.error} retry={() => void query.refetch()} />;
  const report = query.data;
  if (!report) return <ErrorState error={new Error("This account is not visible to you.")} />;

  const { account, score, findings, sources, contacts } = report;
  const sourceById = new Map(sources.map((s) => [s.id, s]));

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            {account.company_name}
          </h1>
          <TierBadge tier={score?.tier ?? null} />
        </div>
        <p className="text-sm text-muted-foreground">
          {account.domain} · last researched {absoluteTime(account.updated_at)}
        </p>
      </header>

      <div className="flex gap-1 overflow-x-auto rounded-lg bg-secondary p-1 text-sm">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-md px-3 py-1.5 font-medium ${
              tab === t ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Profile" ? (
        <Section
          title="Company profile"
          description="Every statement carries its evidence label and retained source, or reads insufficient_evidence."
        >
          {findings.length === 0 ? (
            <EmptyState
              title="No evidence collected"
              hint="Nothing is inferred in your browser, so this profile stays empty until the run stores findings."
            />
          ) : (
            <ul className="space-y-3">
              {findings.map((item) => {
                const source = item.source_id ? sourceById.get(item.source_id) : undefined;
                return (
                  <li key={item.id} className="rounded-xl border border-border bg-card p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-medium text-foreground">
                        {item.category ?? "finding"}
                      </p>
                      <EvidenceBadge label={item.label} />
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{item.statement}</p>
                    {source ? (
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="mt-2 inline-block text-xs text-info underline"
                      >
                        {source.url}
                      </a>
                    ) : (
                      <p className="mt-2 text-xs text-muted-foreground">insufficient_evidence</p>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </Section>
      ) : null}

      {tab === "Qualification" ? (
        <Section
          title="Ingredient qualification"
          description="Scores are rendered exactly as stored — no browser-side recalculation."
        >
          {!score ? (
            <EmptyState
              title="Not scored yet"
              hint="Qualification appears once the run scores the account."
            />
          ) : (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <Stat label="Total" value={score.total?.toString() ?? "insufficient_evidence"} />
                <Stat label="Tier" value={score.tier ?? "insufficient_evidence"} />
                <Stat
                  label="Risk penalty"
                  value={score.risk_penalty?.toString() ?? "insufficient_evidence"}
                />
              </div>
              {score.reasons?.length ? (
                <ul className="space-y-1.5 rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
                  {score.reasons.map((reason) => (
                    <li key={reason}>• {reason}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          )}
        </Section>
      ) : null}

      {tab === "Committee" ? (
        <Section title="Buying committee" description="Contacts stored against this account.">
          {contacts.length === 0 ? (
            <EmptyState
              title="No contacts stored"
              hint="Contact enrichment has not produced results yet."
            />
          ) : (
            <ul className="space-y-2">
              {contacts.map((contact) => (
                <li
                  key={contact.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-card p-4"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{contact.full_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {contact.title ?? "insufficient_evidence"} ·{" "}
                      {contact.email_status ?? "unverified"}
                    </p>
                  </div>
                  {contact.is_synthetic ? (
                    <span className="rounded-full border border-warning/40 bg-warning-soft px-2 py-0.5 text-xs text-warning-foreground">
                      synthetic
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </Section>
      ) : null}

      {tab === "Outreach" ? <OutreachApproval report={report} /> : null}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-2 text-lg font-semibold text-foreground">{value}</p>
    </div>
  );
}
