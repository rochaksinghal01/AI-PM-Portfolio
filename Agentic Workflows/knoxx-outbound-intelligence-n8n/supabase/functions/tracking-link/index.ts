import { corsHeaders, json } from "../_shared/http.ts";

const encoder = new TextEncoder();

async function hmacHex(value: string, secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(value),
  );
  return [...new Uint8Array(signature)].map((byte) =>
    byte.toString(16).padStart(2, "0")
  ).join("");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  const internalSecret = Deno.env.get("OUTREACH_EVENT_SECRET");
  if (
    !internalSecret || req.headers.get("X-Outreach-Secret") !== internalSecret
  ) return json({ error: "Unauthorized" }, 401);
  const signingSecret = Deno.env.get("TRACKING_SIGNING_SECRET");
  const trackingBase = Deno.env.get("TRACKING_BASE_URL");
  if (!signingSecret || !trackingBase) {
    return json({ error: "Tracking is not configured" }, 503);
  }
  const { tracking_token } = await req.json();
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      .test(tracking_token || "")
  ) return json({ error: "Invalid tracking token" }, 400);
  const signature = await hmacHex(tracking_token, signingSecret);
  return json({
    url: `${
      trackingBase.replace(/\/$/, "")
    }/${tracking_token}?sig=${signature}`,
  });
});
