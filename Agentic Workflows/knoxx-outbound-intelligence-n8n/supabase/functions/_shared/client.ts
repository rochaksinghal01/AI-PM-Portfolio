import { createClient } from "npm:@supabase/supabase-js@2";

export function adminClient() {
  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) {
    throw new Error("Supabase server credentials are not configured");
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function authenticatedUser(req: Request) {
  const authorization = req.headers.get("Authorization");
  if (!authorization) throw new Error("Missing Authorization header");
  const url = Deno.env.get("SUPABASE_URL")!;
  const publishable = Deno.env.get("SUPABASE_ANON_KEY")!;
  const scoped = createClient(url, publishable, {
    global: { headers: { Authorization: authorization } },
  });
  const { data, error } = await scoped.auth.getUser();
  if (error || !data.user) throw new Error("Invalid user session");
  return data.user;
}
