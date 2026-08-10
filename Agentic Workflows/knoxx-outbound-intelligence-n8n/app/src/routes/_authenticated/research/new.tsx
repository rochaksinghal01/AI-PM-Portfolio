import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Info, Loader2 } from "lucide-react";

import { canonicalDomain, findExistingAccount, startAccountResearch } from "@/lib/api";
import { isFixtureMode } from "@/lib/env";

export const Route = createFileRoute("/_authenticated/research/new")({
  component: NewRun,
  head: () => ({
    meta: [
      { title: "New research run — Knoxx Outbound Intelligence" },
      {
        name: "description",
        content:
          "Start an evidence-backed research run from a company website. The crawl runs in the background and reports its persisted status.",
      },
      { property: "og:title", content: "New research run — Knoxx Outbound Intelligence" },
      {
        property: "og:description",
        content: "Start an evidence-backed account research run from a company website.",
      },
    ],
  }),
});

function NewRun() {
  const navigate = useNavigate();
  const [website, setWebsite] = useState("");
  const [company, setCompany] = useState("");
  const [notes, setNotes] = useState("");
  const [existing, setExisting] = useState<{ id: string; company_name: string } | null>(null);
  const [checking, setChecking] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function checkExisting(value: string) {
    setExisting(null);
    const canonical = canonicalDomain(value);
    if (!canonical.includes(".")) return;
    setChecking(true);
    try {
      setExisting(await findExistingAccount(canonical));
    } catch {
      /* pre-check is advisory only; the Edge Function is authoritative */
    } finally {
      setChecking(false);
    }
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    if (isFixtureMode()) {
      setError(
        "Fixture mode: no backend key is configured, so start-account-research cannot be called. Sign in against the live project to queue a real run.",
      );
      return;
    }
    setBusy(true);
    try {
      const res = await startAccountResearch({
        website_url: website.trim(),
        ...(company.trim() ? { company_name: company.trim() } : {}),
        ...(notes.trim() ? { notes: notes.trim() } : {}),
      });
      // 202 only means "accepted". The run view renders the persisted status.
      void navigate({ to: "/runs/$runId", params: { runId: res.run_id } });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start the research run.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">New research run</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          One website is enough. The crawl, scoring and contact work happen server-side; this page
          hands off as soon as the run is accepted.
        </p>
      </div>

      <form onSubmit={submit} className="space-y-5 rounded-xl border border-border bg-card p-6">
        <div className="space-y-1.5">
          <label htmlFor="website" className="text-sm font-medium text-foreground">
            Company website or domain <span className="text-destructive">*</span>
          </label>
          <input
            id="website"
            required
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            onBlur={(e) => void checkExisting(e.target.value)}
            placeholder="snapfresh.com.au"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          {checking ? (
            <p className="text-xs text-muted-foreground">Checking existing accounts…</p>
          ) : null}
        </div>

        {existing ? (
          <div className="flex gap-2 rounded-md border border-info/30 bg-info-soft px-3 py-2.5 text-sm">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-info" />
            <p className="text-foreground/85">
              This account already exists. A new research run will be added to its history.
              <br />
              <span className="text-muted-foreground">Matched: {existing.company_name}</span>
            </p>
          </div>
        ) : null}

        <div className="space-y-1.5">
          <label htmlFor="company" className="text-sm font-medium text-foreground">
            Company name <span className="text-muted-foreground">(optional)</span>
          </label>
          <input
            id="company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="notes" className="text-sm font-medium text-foreground">
            Sales context <span className="text-muted-foreground">(optional)</span>
          </label>
          <textarea
            id="notes"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Anything the researcher should know — prior conversations, a specific line of business."
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {error ? (
          <p className="rounded-md border border-destructive/30 bg-danger-soft px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={busy || website.trim().length === 0}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Queue research run
        </button>
        <p className="text-xs text-muted-foreground">
          The domain is canonicalised server-side, so `https://www.` prefixes and trailing paths all
          resolve to the same account.
        </p>
      </form>
    </div>
  );
}
