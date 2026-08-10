import { adminClient, authenticatedUser } from "../_shared/client.ts";
import { corsHeaders, json } from "../_shared/http.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  try {
    const user = await authenticatedUser(req);
    const { sequence_id, approved, messages } = await req.json();
    if (!sequence_id || approved !== true) {
      return json({ error: "sequence_id and approved=true are required" }, 400);
    }
    const db = adminClient();
    const { data: sequence, error } = await db.from("outreach_sequences")
      .select("id,account_id,status,accounts(owner_id)").eq("id", sequence_id)
      .single();
    if (error) throw error;
    const ownerId = (sequence.accounts as { owner_id?: string } | null)
      ?.owner_id;
    if (ownerId !== user.id) return json({ error: "Forbidden" }, 403);
    if (sequence.status !== "draft") {
      return json({ error: `Sequence is already ${sequence.status}` }, 409);
    }
    if (Array.isArray(messages)) {
      for (const message of messages) {
        const { error: messageError } = await db.from("outreach_messages")
          .update({ subject: message.subject, body: message.body }).eq(
            "id",
            message.id,
          ).eq("sequence_id", sequence_id).eq("status", "draft");
        if (messageError) throw messageError;
      }
    }
    await db.from("outreach_sequences").update({
      status: "approved",
      approved_by: user.id,
      approved_at: new Date().toISOString(),
    }).eq("id", sequence_id);
    await db.from("accounts").update({ stage: "approved" }).eq(
      "id",
      sequence.account_id,
    ).eq("owner_id", user.id);

    const webhook = Deno.env.get("N8N_SEQUENCE_WEBHOOK");
    const secret = Deno.env.get("N8N_WEBHOOK_SECRET");
    if (webhook && secret) {
      await fetch(webhook, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Workflow-Secret": secret,
        },
        body: JSON.stringify({ sequence_id, account_id: sequence.account_id }),
      });
    }
    return json({ sequence_id, status: "approved" });
  } catch (error) {
    return json({
      error: error instanceof Error ? error.message : "Unknown error",
    }, 400);
  }
});
