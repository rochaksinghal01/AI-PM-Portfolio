import { adminClient, authenticatedUser } from "../_shared/client.ts";
import { corsHeaders, json } from "../_shared/http.ts";

const accountStops = new Set([
  "positive_reply",
  "meeting_booked",
  "manual_engaged",
  "opportunity_created",
]);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  try {
    const expected = Deno.env.get("OUTREACH_EVENT_SECRET");
    const event = await req.json();
    const internal = Boolean(
      expected && req.headers.get("X-Outreach-Secret") === expected,
    );
    let authenticatedUserId: string | null = null;
    if (!internal) {
      const user = await authenticatedUser(req);
      authenticatedUserId = user.id;
      if (event.provider !== "manual_demo") {
        return json({
          error: "Only manual demo events may use user authentication",
        }, 403);
      }
    }
    if (!event.account_id || !event.event_type || !event.idempotency_key) {
      return json({
        error: "account_id, event_type and idempotency_key are required",
      }, 400);
    }
    const allowed = new Set([
      "cta_click",
      "positive_reply",
      "negative_reply",
      "negative_org_reply",
      "meeting_booked",
      "manual_engaged",
      "opportunity_created",
      "unsubscribe",
      "hard_bounce",
      "out_of_office",
    ]);
    if (!allowed.has(event.event_type)) {
      return json({ error: "Unsupported event type" }, 400);
    }
    const db = adminClient();
    if (authenticatedUserId) {
      const { data: account } = await db.from("accounts").select("owner_id").eq(
        "id",
        event.account_id,
      ).single();
      if (account?.owner_id !== authenticatedUserId) {
        return json({ error: "Forbidden" }, 403);
      }
    }
    const { data: inserted, error } = await db.from("engagement_events").upsert(
      {
        account_id: event.account_id,
        contact_id: event.contact_id || null,
        message_id: event.message_id || null,
        event_type: event.event_type,
        provider: event.provider || "n8n",
        idempotency_key: event.idempotency_key,
        payload: event.payload || {},
        occurred_at: event.occurred_at || new Date().toISOString(),
      },
      { onConflict: "idempotency_key", ignoreDuplicates: true },
    ).select("id").maybeSingle();
    if (error) throw error;
    if (!inserted) return json({ status: "duplicate_ignored" });

    if (event.event_type === "cta_click") {
      await db.rpc("increment_account_intent", {
        target_account_id: event.account_id,
        increment_by: 10,
      });
    } else if (accountStops.has(event.event_type)) {
      const stage = event.event_type === "meeting_booked"
        ? "meeting_booked"
        : event.event_type === "opportunity_created"
        ? "opportunity"
        : "engaged";
      await db.from("accounts").update({ stage }).eq("id", event.account_id);
      await db.from("outreach_sequences").update({ status: "paused" }).eq(
        "account_id",
        event.account_id,
      ).in("status", ["approved", "active"]);
      if (event.contact_id) {
        await db.from("contacts").update({ state: "paused" }).eq(
          "account_id",
          event.account_id,
        ).in("state", ["queued", "active", "shortlisted"]).neq(
          "id",
          event.contact_id,
        );
      } else {
        await db.from("contacts").update({ state: "paused" }).eq(
          "account_id",
          event.account_id,
        ).in("state", ["queued", "active", "shortlisted"]);
      }
      if (event.contact_id) {
        await db.from("contacts").update({ state: "replied" }).eq(
          "id",
          event.contact_id,
        );
      }
    } else if (["unsubscribe", "hard_bounce"].includes(event.event_type)) {
      if (event.contact_id) {
        await db.from("contacts").update({
          state: event.event_type === "unsubscribe" ? "opted_out" : "bounced",
        }).eq("id", event.contact_id);
        await db.from("suppression_entries").insert({
          account_id: event.account_id,
          contact_id: event.contact_id,
          scope: "contact",
          reason: event.event_type,
          source_event_id: inserted.id,
        });
      }
      await db.from("outreach_sequences").update({ status: "paused" }).eq(
        "account_id",
        event.account_id,
      ).in("status", ["approved", "active"]);
      await db.from("accounts").update({ stage: "review" }).eq(
        "id",
        event.account_id,
      );
    } else if (event.event_type === "negative_reply") {
      if (event.contact_id) {
        await db.from("contacts").update({ state: "suppressed" }).eq(
          "id",
          event.contact_id,
        );
        await db.from("suppression_entries").insert({
          account_id: event.account_id,
          contact_id: event.contact_id,
          scope: "contact",
          reason: "negative_reply",
          source_event_id: inserted.id,
        });
      }
    } else if (event.event_type === "out_of_office") {
      if (event.contact_id) {
        const returnDate = event.payload?.return_date || null;
        await db.from("contacts").update({
          state: "paused",
          paused_until: returnDate,
        }).eq("id", event.contact_id);
      }
    } else if (event.event_type === "negative_org_reply") {
      await db.from("accounts").update({ stage: "suppressed" }).eq(
        "id",
        event.account_id,
      );
      await db.from("outreach_sequences").update({ status: "stopped" }).eq(
        "account_id",
        event.account_id,
      );
      await db.from("suppression_entries").insert({
        account_id: event.account_id,
        scope: "account",
        reason: "negative_org_reply",
        source_event_id: inserted.id,
      });
    }
    return json({ status: "processed", event_id: inserted.id });
  } catch (error) {
    return json({
      error: error instanceof Error ? error.message : "Unknown error",
    }, 400);
  }
});
