/**
 * Browser-only environment access.
 *
 * The publishable (anon) key is the ONLY backend key permitted in browser code.
 * Never add a service-role key, database password, or provider secret here.
 */

const read = (key: string): string =>
  ((import.meta.env as Record<string, string | undefined>)[key] ?? "").trim();

export const SUPABASE_URL = read("VITE_SUPABASE_URL");
export const SUPABASE_PUBLISHABLE_KEY = read("VITE_SUPABASE_PUBLISHABLE_KEY");
export const SAFE_TEST_EMAIL = read("VITE_SAFE_TEST_EMAIL") || "safe-test@example.com";
export const DEMO_MODE = read("VITE_DEMO_MODE") !== "false";

/** True only when a real, complete browser configuration is present. */
export const isLiveConfigured = (): boolean =>
  SUPABASE_URL.length > 0 && SUPABASE_PUBLISHABLE_KEY.length > 0;

/**
 * When the backend is not configured the app must still be safe and
 * reproducible: it falls back to visibly synthetic Snapfresh fixtures.
 */
export const isFixtureMode = (): boolean => !isLiveConfigured();
