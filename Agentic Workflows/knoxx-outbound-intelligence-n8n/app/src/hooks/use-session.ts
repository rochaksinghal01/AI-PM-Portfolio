import { useEffect, useState } from "react";

import { getSupabase } from "@/integrations/supabase/client";
import { isFixtureMode } from "@/lib/env";

export interface SessionState {
  loading: boolean;
  email: string | null;
  signedIn: boolean;
  /** True when the app runs on synthetic fixtures because env vars are absent. */
  fixtureMode: boolean;
}

export function useSession(): SessionState {
  const fixtureMode = isFixtureMode();
  const [state, setState] = useState<SessionState>({
    loading: !fixtureMode,
    email: null,
    signedIn: false,
    fixtureMode,
  });

  useEffect(() => {
    if (fixtureMode) {
      setState({ loading: false, email: null, signedIn: false, fixtureMode: true });
      return;
    }
    const supabase = getSupabase();
    if (!supabase) return;

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setState({
        loading: false,
        email: session?.user?.email ?? null,
        signedIn: Boolean(session),
        fixtureMode: false,
      });
    });

    void supabase.auth.getSession().then(({ data }) => {
      setState({
        loading: false,
        email: data.session?.user?.email ?? null,
        signedIn: Boolean(data.session),
        fixtureMode: false,
      });
    });

    return () => sub.subscription.unsubscribe();
  }, [fixtureMode]);

  return state;
}
