import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { LogIn, LogOut, Plus, ShieldCheck, Sparkles } from "lucide-react";
import type { ReactNode } from "react";

import { getSupabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/use-session";
import { DEMO_MODE, SAFE_TEST_EMAIL } from "@/lib/env";

export function AppShell({ children }: { children: ReactNode }) {
  const { email, fixtureMode, loading, signedIn } = useSession();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function signOut() {
    const supabase = getSupabase();
    await queryClient.cancelQueries();
    queryClient.clear();
    if (supabase) await supabase.auth.signOut();
    void navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="min-h-screen bg-background">
      {DEMO_MODE || fixtureMode ? (
        <div className="border-b border-amber-200/70 bg-amber-50 px-4 py-2 text-amber-950">
          <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center text-xs">
            <span className="inline-flex items-center gap-1.5 font-semibold">
              <ShieldCheck className="h-3.5 w-3.5" /> Safe demo environment
            </span>
            <span className="hidden text-amber-400 sm:inline">•</span>
            <span>
              {fixtureMode ? "Synthetic Snapfresh portfolio data" : "Live workflow backend"}
            </span>
            <span className="hidden text-amber-400 sm:inline">•</span>
            <span>
              Email delivery locked to <strong>{SAFE_TEST_EMAIL}</strong>
            </span>
          </div>
        </div>
      ) : null}
      <header className="sticky top-0 z-20 border-b border-border bg-card/85 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-4 px-6 py-3">
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <Sparkles className="h-4 w-4" />
            </span>
            <span>
              <span className="block text-sm font-semibold leading-tight tracking-tight text-foreground">
                Knoxx
              </span>
              <span className="block text-[11px] leading-tight text-muted-foreground">
                Outbound Intelligence
              </span>
            </span>
          </Link>
          <nav className="flex items-center gap-1 text-sm">
            <Link
              to="/dashboard"
              activeProps={{ className: "bg-secondary text-foreground" }}
              className="rounded-md px-2.5 py-1.5 text-muted-foreground hover:bg-secondary"
            >
              Pipeline
            </Link>
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <Link
              to="/research/new"
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" /> New research run
            </Link>
            <div className="hidden items-center gap-2 rounded-lg border border-border bg-background px-3 py-1.5 sm:flex">
              <span
                className={`h-2 w-2 rounded-full ${signedIn ? "bg-emerald-500" : "bg-amber-500"}`}
              />
              <div className="text-left">
                <p className="text-xs font-medium leading-tight text-foreground">
                  {loading ? "Checking session…" : fixtureMode ? "Portfolio preview" : email}
                </p>
                <p className="text-[10px] leading-tight text-muted-foreground">
                  {signedIn ? "Authenticated workspace" : "Synthetic read-only session"}
                </p>
              </div>
            </div>
            {signedIn ? (
              <button
                onClick={() => void signOut()}
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-sm text-muted-foreground hover:bg-secondary"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            ) : fixtureMode ? (
              <Link
                to="/auth"
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-sm text-muted-foreground hover:bg-secondary"
              >
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline">Sign in</span>
              </Link>
            ) : null}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-[1400px] px-6 py-8">{children}</main>
    </div>
  );
}
