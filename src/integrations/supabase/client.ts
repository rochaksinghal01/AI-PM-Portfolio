import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL, isLiveConfigured } from "@/lib/env";

/**
 * Single Supabase client for the EXISTING project (sbbqtvhyfdxywkanwldb).
 * Uses the publishable key plus the logged-in user's session, so every read
 * and every Edge Function call runs under the project's existing RLS.
 */
let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!isLiveConfigured()) return null;
  if (!client) {
    client = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }
  return client;
}

/** Throws when live mode is required but not configured. */
export function requireSupabase(): SupabaseClient {
  const supabase = getSupabase();
  if (!supabase) {
    throw new Error(
      "Supabase is not configured. Add VITE_SUPABASE_PUBLISHABLE_KEY to run against live data.",
    );
  }
  return supabase;
}
