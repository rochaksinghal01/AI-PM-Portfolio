import { adminClient } from "../_shared/client.ts";

const encoder = new TextEncoder();

async function signatureValid(value: string, supplied: string, secret: string) {
  if (!/^[0-9a-f]{64}$/i.test(supplied)) return false;
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"],
  );
  const bytes = new Uint8Array(
    supplied.match(/.{2}/g)!.map((pair) => Number.parseInt(pair, 16)),
  );
  return crypto.subtle.verify("HMAC", key, bytes, encoder.encode(value));
}

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const tail = url.pathname.split("/").filter(Boolean).at(-1);
  const token = url.searchParams.get("token") ||
    (tail && tail !== "track" ? tail : null);
  const signature = url.searchParams.get("sig");
  const fallback = Deno.env.get("MEETING_URL") || "https://calendar.google.com";
  const signingSecret = Deno.env.get("TRACKING_SIGNING_SECRET");
  if (
    !token || !signature || !signingSecret ||
    !(await signatureValid(token, signature, signingSecret))
  ) return Response.redirect(fallback, 302);
  try {
    const db = adminClient();
    const { data: message } = await db.from("outreach_messages").select(
      "id,contact_id,outreach_sequences(account_id)",
    ).eq("tracking_token", token).single();
    const accountId =
      (message?.outreach_sequences as { account_id?: string } | null)
        ?.account_id;
    if (message && accountId) {
      const { data: inserted } = await db.from("engagement_events").upsert({
        account_id: accountId,
        contact_id: message.contact_id,
        message_id: message.id,
        event_type: "cta_click",
        provider: "signed_redirect",
        idempotency_key: `click:${message.id}:${
          Math.floor(Date.now() / 60000)
        }`,
        payload: { user_agent: req.headers.get("user-agent") },
      }, { onConflict: "idempotency_key", ignoreDuplicates: true }).select("id")
        .maybeSingle();
      if (inserted) {
        await db.rpc("increment_account_intent", {
          target_account_id: accountId,
          increment_by: 10,
        });
      }
    }
  } catch (error) {
    console.error(
      "tracking error",
      error instanceof Error ? error.message : error,
    );
  }
  return Response.redirect(fallback, 302);
});
