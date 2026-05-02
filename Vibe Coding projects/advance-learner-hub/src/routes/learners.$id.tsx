import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { learnersQueryOptions } from "@/lib/learners";
import { SiteHeader } from "@/components/SiteHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft, Mail, Phone, Linkedin, FileText,
  Briefcase, Building2, Clock, MapPin, Megaphone, CalendarClock,
} from "lucide-react";

export const Route = createFileRoute("/learners/$id")({
  loader: async ({ params, context: { queryClient } }) => {
    const data = await queryClient.ensureQueryData(learnersQueryOptions());
    const learner = data.learners.find((l) => l.id === params.id);
    if (!learner) throw notFound();
    return { id: params.id };
  },
  component: LearnerDetail,
  errorComponent: ({ error }) => (
    <div className="p-10 text-center text-sm text-destructive">{error.message}</div>
  ),
  notFoundComponent: () => (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="font-display text-4xl">Learner not found</h1>
        <Link to="/" className="mt-4 inline-block text-sm text-primary underline">
          Back to directory
        </Link>
      </div>
    </div>
  ),
});

function LearnerDetail() {
  const { id } = Route.useLoaderData();
  const { data } = useSuspenseQuery(learnersQueryOptions());
  const l = data.learners.find((x) => x.id === id);
  if (!l) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="mx-auto max-w-2xl px-4 py-20 text-center">
          <h1 className="font-display text-4xl">Learner not found</h1>
          <Link to="/" className="mt-4 inline-block text-sm text-primary underline">
            Back to directory
          </Link>
        </div>
      </div>
    );
  }
  const initials = l.fullName.split(" ").map((p: string) => p[0]).slice(0, 2).join("");
  const ts = l.timestamp ? new Date(l.timestamp) : null;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-8 md:px-8">
        <Link to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to directory
        </Link>

        {/* Header */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent-foreground text-2xl font-semibold text-primary-foreground">
              {initials}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                {l.cohort && <Badge variant="secondary" className="font-normal">{l.cohort}</Badge>}
              </div>
              <h1 className="mt-2 font-display text-4xl leading-tight text-foreground md:text-5xl">
                {l.fullName}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                {l.currentRole && (
                  <span className="inline-flex items-center gap-1.5">
                    <Briefcase className="h-3.5 w-3.5" /> {l.currentRole}
                  </span>
                )}
                {l.companyName && (
                  <span className="inline-flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5" /> {l.companyName}
                  </span>
                )}
                {l.city && (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" /> {l.city}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Two columns */}
        <div className="mt-6 grid gap-6 md:grid-cols-5">
          {/* Snapshot */}
          <section className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] md:col-span-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Professional Snapshot
            </h2>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field icon={<Briefcase className="h-4 w-4" />} label="Current Role" value={l.currentRole || "—"} />
              <Field icon={<Building2 className="h-4 w-4" />} label="Company" value={l.companyName || "—"} />
              <Field icon={<Clock className="h-4 w-4" />} label="Total experience" value={`${l.yearsExperience} years`} />
              <Field icon={<Megaphone className="h-4 w-4" />} label="Heard about us via" value={l.source || "—"} />
            </dl>
          </section>

          {/* Contact */}
          <section className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] md:col-span-2">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Contact & Links
            </h2>
            <div className="mt-4 space-y-3">
              {l.email && (
                <a href={`mailto:${l.email}`}
                  className="group flex items-center gap-3 rounded-lg border border-border px-3 py-2.5 transition-colors hover:bg-accent">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate text-sm">{l.email}</span>
                </a>
              )}
              {l.mobile && (
                <a href={`tel:${l.mobile.replace(/\s/g, "")}`}
                  className="group flex items-center gap-3 rounded-lg border border-border px-3 py-2.5 transition-colors hover:bg-accent">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{l.mobile}</span>
                </a>
              )}
              <div className="flex flex-col gap-2 pt-1 sm:flex-row">
                {l.linkedin && (
                  <Button asChild variant="default" size="sm" className="flex-1">
                    <a href={l.linkedin} target="_blank" rel="noreferrer">
                      <Linkedin className="h-4 w-4" /> LinkedIn
                    </a>
                  </Button>
                )}
                {l.resumeLink && (
                  <Button asChild variant="outline" size="sm" className="flex-1">
                    <a href={l.resumeLink} target="_blank" rel="noreferrer">
                      <FileText className="h-4 w-4" /> Resume
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* Meta */}
        {ts && !isNaN(ts.getTime()) && (
          <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
            <CalendarClock className="h-3.5 w-3.5" />
            Submitted {ts.toLocaleDateString(undefined, { dateStyle: "medium" })} at{" "}
            {ts.toLocaleTimeString(undefined, { timeStyle: "short" })}
          </div>
        )}
      </main>
    </div>
  );
}

function Field({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <dt className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground">
        {icon} {label}
      </dt>
      <dd className="mt-1 text-sm font-medium text-foreground">{value}</dd>
    </div>
  );
}
