import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Lock, ShieldCheck } from "lucide-react";

import { EmptyState, Section } from "@/components/knoxx/states";
import { approveSequence } from "@/lib/api";
import { SAFE_TEST_EMAIL, isFixtureMode } from "@/lib/env";
import { maskEmail } from "@/lib/format";
import type { AccountReport, OutreachMessage } from "@/lib/types";

const TOUCH_DAYS = [0, 3, 7, 12];

export function OutreachApproval({ report }: { report: AccountReport }) {
  const queryClient = useQueryClient();
  const sequence = report.sequences[0];
  const [edits, setEdits] = useState<Record<string, { subject: string; body: string }>>({});
  const [confirming, setConfirming] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messages = useMemo(() => {
    if (!sequence) return [];
    return report.messages
      .filter((m) => m.sequence_id === sequence.id)
      .sort((a, b) => a.day_offset - b.day_offset);
  }, [report.messages, sequence]);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!sequence) return;
      if (isFixtureMode()) {
        throw new Error(
          "Fixture mode: approve-sequence cannot be called without a backend key. Nothing was sent.",
        );
      }
      await approveSequence({
        sequence_id: sequence.id,
        messages: messages
          .filter((m) => m.status === "draft")
          .map((m) => ({
            id: m.id,
            subject: edits[m.id]?.subject ?? m.subject,
            body: edits[m.id]?.body ?? m.body,
          })),
      });
    },
    onSuccess: () => {
      setDone(true);
      setConfirming(false);
      void queryClient.invalidateQueries({ queryKey: ["report", report.account.id] });
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : "Approval failed.");
      setConfirming(false);
    },
  });

  if (!sequence) {
    return (
      <EmptyState
        title="No sequence drafted yet"
        hint="A four-touch draft appears here once the run reaches draft ready."
      />
    );
  }

  const editable = sequence.status === "draft";

  return (
    <div className="space-y-6">
      <Section
        title="Four-touch sequence"
        description="Touches land on days 0, 3, 7 and 12. Editing is only possible while a message is still a draft."
      >
        <div className="space-y-4">
          {TOUCH_DAYS.map((day) => {
            const message = messages.find((m) => m.day_offset === day);
            if (!message) {
              return (
                <div
                  key={day}
                  className="rounded-xl border border-dashed border-border bg-card/60 px-4 py-4 text-sm text-muted-foreground"
                >
                  Day {day} — no draft stored for this touch.
                </div>
              );
            }
            return (
              <TouchCard
                key={message.id}
                message={message}
                editable={editable && message.status === "draft"}
                value={edits[message.id]}
                onChange={(next) => setEdits((prev) => ({ ...prev, [message.id]: next }))}
              />
            );
          })}
        </div>
      </Section>

      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-start gap-2">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Safe-send is enforced by the server</p>
            <p className="mt-1">
              Delivery in this demo always goes to <strong>{SAFE_TEST_EMAIL}</strong>. The intended
              recipient is context only, and there is deliberately no control anywhere in this UI to
              change it.
            </p>
          </div>
        </div>
        {done ? (
          <p className="mt-4 rounded-md border border-success/30 bg-success-soft px-3 py-2 text-sm text-success">
            Approval recorded. The server verified ownership and handed the sequence to the
            safe-send workflow.
          </p>
        ) : (
          <button
            disabled={!editable || mutation.isPending}
            onClick={() => setConfirming(true)}
            className="mt-4 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
          >
            {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {editable ? "Approve sequence" : `Sequence is ${sequence.status}`}
          </button>
        )}
        {error ? (
          <p className="mt-3 rounded-md border border-destructive/30 bg-danger-soft px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        ) : null}
      </div>

      {confirming ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 px-4">
          <div className="w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-lg">
            <h3 className="text-base font-semibold text-foreground">Confirm human approval</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>• Your approval is recorded in the audit log against your user.</li>
              <li>
                • Demo delivery is forced to <strong>{SAFE_TEST_EMAIL}</strong> by the server.
              </li>
              <li>
                • The intended recipient stays context only — nothing is sent to a real prospect.
              </li>
              <li>• Only messages still in draft are submitted with your edits.</li>
            </ul>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setConfirming(false)}
                className="rounded-md border border-border px-3 py-2 text-sm hover:bg-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => mutation.mutate()}
                className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Approve and hand to safe send
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function TouchCard({
  message,
  editable,
  value,
  onChange,
}: {
  message: OutreachMessage;
  editable: boolean;
  value?: { subject: string; body: string } | undefined;
  onChange: (next: { subject: string; body: string }) => void;
}) {
  const subject = value?.subject ?? message.subject;
  const body = value?.body ?? message.body;

  return (
    <div className="grid gap-4 rounded-xl border border-border bg-card p-5 lg:grid-cols-[1.6fr_1fr]">
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs">
          <span className="rounded-full bg-secondary px-2 py-0.5 font-medium text-secondary-foreground">
            Day {message.day_offset}
          </span>
          <span className="text-muted-foreground">status: {message.status}</span>
          {!editable ? (
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              <Lock className="h-3 w-3" /> locked
            </span>
          ) : null}
        </div>
        <input
          value={subject}
          readOnly={!editable}
          onChange={(e) => onChange({ subject: e.target.value, body })}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-ring read-only:bg-muted read-only:text-muted-foreground"
        />
        <textarea
          value={body}
          readOnly={!editable}
          rows={7}
          onChange={(e) => onChange({ subject, body: e.target.value })}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm leading-relaxed outline-none focus:ring-2 focus:ring-ring read-only:bg-muted read-only:text-muted-foreground"
        />
      </div>
      <aside className="space-y-3 rounded-lg border border-border bg-secondary/40 p-4 text-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Evidence context
        </p>
        {message.approved_claims?.length ? (
          <ul className="space-y-1.5 text-muted-foreground">
            {message.approved_claims.map((claim) => (
              <li key={claim}>• {claim}</li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">No approved claims attached to this touch.</p>
        )}
        <p className="text-xs text-muted-foreground">
          Intended recipient (context only): {maskEmail(message.intended_recipient)}
        </p>
      </aside>
    </div>
  );
}
