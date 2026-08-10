import { adminClient, authenticatedUser } from "../_shared/client.ts";
import { corsHeaders, json, normalizeWebsite } from "../_shared/http.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  try {
    const user = await authenticatedUser(req);
    const body = await req.json();
    const { domain, websiteUrl } = normalizeWebsite(body.website_url);
    const db = adminClient();

    const { data: alias } = await db.from("account_aliases").select(
      "account_id",
    ).eq("alias_domain", domain).maybeSingle();
    let accountId = alias?.account_id as string | undefined;
    let lifecycle = accountId ? "existing" : "new";

    if (accountId) {
      const { data: aliasedAccount } = await db.from("accounts").select(
        "owner_id",
      ).eq("id", accountId).single();
      if (aliasedAccount?.owner_id !== user.id) {
        throw new Error("This domain is already owned by another workspace");
      }
    }

    if (!accountId) {
      const { data: existing } = await db.from("accounts").select(
        "id, owner_id",
      ).eq("canonical_domain", domain).maybeSingle();
      if (existing && existing.owner_id !== user.id) {
        throw new Error("This domain is already owned by another workspace");
      }
      accountId = existing?.id;
      lifecycle = accountId ? "existing" : "new";
    }

    if (!accountId) {
      const { data: created, error } = await db.from("accounts").insert({
        canonical_domain: domain,
        website_url: websiteUrl,
        name: body.company_name || null,
        lifecycle: "new",
        stage: "researching",
        owner_id: user.id,
      }).select("id").single();
      if (error) throw error;
      accountId = created.id;
    } else {
      const { error } = await db.from("accounts").update({
        stage: "researching",
      }).eq("id", accountId).eq("owner_id", user.id);
      if (error) throw error;
    }

    const { data: run, error: runError } = await db.from("research_runs")
      .insert({
        account_id: accountId,
        requested_by: user.id,
        status: "queued",
        input: {
          website_url: websiteUrl,
          company_name: body.company_name || null,
          notes: body.notes || null,
          lifecycle,
        },
        provider_versions: { workflow: "knoxx-wf01-v1" },
      }).select("id").single();
    if (runError) throw runError;

    const webhook = Deno.env.get("N8N_ACCOUNT_RESEARCH_WEBHOOK");
    const secret = Deno.env.get("N8N_WEBHOOK_SECRET");
    if (!webhook || !secret) {
      return json({
        run_id: run.id,
        account_id: accountId,
        status: "queued",
        warning: "n8n is not configured",
      }, 202);
    }

    const response = await fetch(webhook, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Workflow-Secret": secret,
      },
      body: JSON.stringify({
        run_id: run.id,
        account_id: accountId,
        website_url: websiteUrl,
        domain,
        lifecycle,
        company_name: body.company_name || null,
        notes: body.notes || null,
      }),
    });
    if (!response.ok) {
      await db.from("research_runs").update({
        status: "failed_partial",
        error_summary: `n8n accepted record but returned ${response.status}`,
      }).eq("id", run.id);
      return json({
        run_id: run.id,
        account_id: accountId,
        status: "failed_partial",
      }, 202);
    }
    await db.from("research_runs").update({
      status: "running",
      started_at: new Date().toISOString(),
    }).eq("id", run.id);
    return json(
      { run_id: run.id, account_id: accountId, status: "running" },
      202,
    );
  } catch (error) {
    return json({
      error: error instanceof Error ? error.message : "Unknown error",
    }, 400);
  }
});
