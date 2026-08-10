import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { AppShell } from "@/components/knoxx/app-shell";
import { getSupabase } from "@/integrations/supabase/client";
import { isFixtureMode } from "@/lib/env";

export const Route = createFileRoute("/_authenticated")({
  // Session lives in browser storage, so this subtree is gated client-side only.
  ssr: false,
  beforeLoad: async () => {
    // Fixture mode has no backend at all; it renders visibly synthetic data.
    if (isFixtureMode()) return;
    const supabase = getSupabase();
    if (!supabase) return;
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth" });
  },
  component: () => (
    <AppShell>
      <Outlet />
    </AppShell>
  ),
});
