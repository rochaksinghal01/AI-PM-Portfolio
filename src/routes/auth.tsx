import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, ShieldCheck } from "lucide-react";

import { getSupabase } from "@/integrations/supabase/client";
import { isFixtureMode } from "@/lib/env";

export const Route = createFileRoute("/auth")({
  ssr: false,
  component: AuthPage,
  head: () => ({
    meta: [
      { title: "Sign in — Knoxx Outbound Intelligence" },
      {
        name: "description",
        content:
          "Sign in to Knoxx Outbound Intelligence to review evidence-backed account research, ingredient qualification and safe outreach approvals.",
      },
      { property: "og:title", content: "Sign in — Knoxx Outbound Intelligence" },
      {
        property: "og:description",
        content: "Evidence-backed account research and safe outreach for food-ingredient teams.",
      },
    ],
  }),
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"password" | "magic">("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fixture = isFixtureMode();

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;
    void supabase.auth.getSession().then(({ data }) => {
      if (data.session) void navigate({ to: "/dashboard", replace: true });
    });
  }, [navigate]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    const supabase = getSupabase();
    if (!supabase) {
      setError(
        "No backend key is configured in this environment, so sign-in is unavailable. The app is running on synthetic fixtures.",
      );
      return;
    }
    setBusy(true);
    try {
      if (mode === "magic") {
        const { error: err } = await supabase.auth.signInWithOtp({
          email,
          options: { emailRedirectTo: window.location.origin + "/dashboard" },
        });
        if (err) throw err;
        setMessage("Check your inbox for a sign-in link.");
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
        void navigate({ to: "/dashboard", replace: true });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <p className="text-sm font-semibold tracking-tight text-foreground">Knoxx</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
            Outbound Intelligence
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Evidence-backed account research, ingredient qualification and safe outreach. Sign in to
            see the pipeline.
          </p>
        </div>

        <form
          onSubmit={submit}
          className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm"
        >
          <div className="flex gap-1 rounded-lg bg-secondary p-1 text-sm">
            {(["password", "magic"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`flex-1 rounded-md px-3 py-1.5 font-medium ${
                  mode === m ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                }`}
              >
                {m === "password" ? "Email + password" : "Magic link"}
              </button>
            ))}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              Work email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              placeholder="you@company.com"
            />
          </div>

          {mode === "password" ? (
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          ) : null}

          {error ? (
            <p className="rounded-md border border-destructive/30 bg-danger-soft px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          ) : null}
          {message ? (
            <p className="rounded-md border border-success/30 bg-success-soft px-3 py-2 text-sm text-success">
              {message}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={busy}
            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {mode === "password" ? "Sign in" : "Send magic link"}
          </button>

          <p className="flex items-start gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            Reads run under your own session, so the project&apos;s row-level security decides what
            you can see. Outreach delivery in this demo is always forced to the safe test address.
          </p>
        </form>

        {fixture ? (
          <p className="mt-4 rounded-md border border-warning/40 bg-warning-soft px-3 py-2 text-xs text-warning-foreground">
            This environment has no backend key, so the app is running on visibly synthetic
            Snapfresh fixtures.{" "}
            <a className="underline" href="/dashboard">
              Open the demo pipeline
            </a>
            .
          </p>
        ) : null}
      </div>
    </div>
  );
}
