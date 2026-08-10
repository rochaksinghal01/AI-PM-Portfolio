export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-workflow-secret, x-outreach-secret",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

export function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

export function normalizeWebsite(value: unknown) {
  const raw = String(value || "").trim();
  if (!raw) throw new Error("website_url is required");
  const candidate = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  const url = new URL(candidate);
  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("website_url must use HTTP(S)");
  }
  const domain = url.hostname.toLowerCase().replace(/^www\./, "");
  if (!domain.includes(".") || domain === "localhost") {
    throw new Error("website_url must be a public domain");
  }
  return { domain, websiteUrl: `https://${domain}` };
}
