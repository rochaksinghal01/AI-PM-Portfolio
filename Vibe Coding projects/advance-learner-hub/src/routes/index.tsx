import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { learnersQueryOptions, type Learner } from "@/lib/learners";
import { SiteHeader } from "@/components/SiteHeader";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Search,
  Users,
  MapPin,
  Briefcase,
  TrendingUp,
  ChevronDown,
  ArrowRight,
  X,
  Inbox,
  RefreshCw,
} from "lucide-react";

export const Route = createFileRoute("/")({
  loader: ({ context: { queryClient } }) => queryClient.ensureQueryData(learnersQueryOptions()),
  component: DirectoryPage,
});

const PAGE_SIZE = 12;

function DirectoryPage() {
  const { data } = useSuspenseQuery(learnersQueryOptions());
  const queryClient = useQueryClient();
  const learners = data.learners;

  const uniqueCohorts = useMemo(
    () => Array.from(new Set(learners.map((l) => l.cohort).filter(Boolean))).sort(),
    [learners],
  );
  const uniqueRoles = useMemo(
    () => Array.from(new Set(learners.map((l) => l.currentRole).filter(Boolean))).sort(),
    [learners],
  );
  const uniqueCities = useMemo(
    () => Array.from(new Set(learners.map((l) => l.city).filter(Boolean))).sort(),
    [learners],
  );
  const expRange = useMemo<[number, number]>(() => {
    const xs = learners.map((l) => l.yearsExperience);
    if (!xs.length) return [0, 0];
    return [Math.floor(Math.min(...xs)), Math.ceil(Math.max(...xs))];
  }, [learners]);

  const [query, setQuery] = useState("");
  const [cohorts, setCohorts] = useState<string[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [exp, setExp] = useState<[number, number]>(expRange);
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ["learners"] });
    setRefreshing(false);
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return learners.filter((l) => {
      if (q) {
        const hay = `${l.fullName} ${l.email} ${l.companyName}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (cohorts.length && !cohorts.includes(l.cohort)) return false;
      if (roles.length && !roles.includes(l.currentRole)) return false;
      if (cities.length && !cities.includes(l.city)) return false;
      if (l.yearsExperience < exp[0] || l.yearsExperience > exp[1]) return false;
      return true;
    });
  }, [learners, query, cohorts, roles, cities, exp]);

  const stats = useMemo(() => {
    const roleCount = new Map<string, number>();
    learners.forEach((l) => roleCount.set(l.currentRole, (roleCount.get(l.currentRole) ?? 0) + 1));
    const top3 = [...roleCount.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3);
    const avg = learners.length
      ? learners.reduce((s, l) => s + l.yearsExperience, 0) / learners.length
      : 0;
    return {
      total: learners.length,
      cities: new Set(learners.map((l) => l.city)).size,
      top3,
      avg: avg.toFixed(1),
    };
  }, [learners]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageRows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const resetAll = () => {
    setQuery(""); setCohorts([]); setRoles([]); setCities([]); setExp(expRange); setPage(1);
  };
  const activeFilters = cohorts.length + roles.length + cities.length + (query ? 1 : 0) +
    (exp[0] !== expRange[0] || exp[1] !== expRange[1] ? 1 : 0);

  const fetchedAgo = useMemo(() => {
    const d = new Date(data.fetchedAt);
    return d.toLocaleTimeString(undefined, { timeStyle: "short" });
  }, [data.fetchedAt]);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        {/* Hero */}
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl text-foreground md:text-5xl">
              Learner Directory
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Browse, filter, and review every learner in the Advance AI Program.
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
              className="gap-2"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <span className="text-[11px] text-muted-foreground">
              {data.source === "sheet" ? "Live from Google Sheet" : "Sample data (sheet not configured)"} · synced {fetchedAgo}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          <StatCard icon={<Users className="h-4 w-4" />} label="Total learners" value={stats.total} />
          <StatCard icon={<MapPin className="h-4 w-4" />} label="Unique cities" value={stats.cities} />
          <StatCard
            icon={<Briefcase className="h-4 w-4" />}
            label="Top roles"
            value={
              <div className="space-y-0.5 text-sm font-medium leading-tight">
                {stats.top3.map(([r, c]) => (
                  <div key={r} className="flex items-center justify-between gap-2">
                    <span className="truncate">{r}</span>
                    <span className="text-xs text-muted-foreground">{c}</span>
                  </div>
                ))}
              </div>
            }
          />
          <StatCard
            icon={<TrendingUp className="h-4 w-4" />}
            label="Avg. experience"
            value={<>{stats.avg} <span className="text-base text-muted-foreground">yrs</span></>}
          />
        </div>

        {/* Sticky filter bar */}
        <div className="sticky top-[65px] z-30 mt-8 -mx-4 border-y border-border bg-background/90 px-4 py-3 backdrop-blur md:-mx-8 md:px-8">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-[220px] flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or company…"
                className="h-9 pl-9"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              />
            </div>

            <MultiFilter label="Cohort" options={uniqueCohorts} selected={cohorts}
              onChange={(v) => { setCohorts(v); setPage(1); }} />
            <MultiFilter label="Role" options={uniqueRoles} selected={roles}
              onChange={(v) => { setRoles(v); setPage(1); }} />
            <MultiFilter label="City" options={uniqueCities} selected={cities}
              onChange={(v) => { setCities(v); setPage(1); }} />

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 gap-1.5">
                  Experience
                  <span className="text-muted-foreground">
                    {exp[0]}–{exp[1]}y
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-72">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-medium">Years of experience</span>
                  <span className="text-xs text-muted-foreground">{exp[0]} – {exp[1]} yrs</span>
                </div>
                <Slider
                  min={expRange[0]}
                  max={expRange[1]}
                  step={1}
                  value={exp}
                  onValueChange={(v) => { setExp([v[0], v[1]] as [number, number]); setPage(1); }}
                />
              </PopoverContent>
            </Popover>

            {activeFilters > 0 && (
              <Button variant="ghost" size="sm" onClick={resetAll} className="h-9 gap-1 text-muted-foreground">
                <X className="h-3.5 w-3.5" /> Clear ({activeFilters})
              </Button>
            )}

            <div className="ml-auto text-xs text-muted-foreground">
              {filtered.length} of {learners.length}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <Th>Full name</Th>
                  <Th>Cohort</Th>
                  <Th>Current role</Th>
                  <Th>Company</Th>
                  <Th className="text-right">Years</Th>
                  <Th>City</Th>
                  <Th className="text-right">Action</Th>
                </tr>
              </thead>
              <tbody>
                {pageRows.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-16">
                      <EmptyState onReset={resetAll} />
                    </td>
                  </tr>
                )}
                {pageRows.map((l) => (
                  <LearnerRow key={l.id} l={l} />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {filtered.length > 0 && (
          <div className="mt-5 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Page {safePage} of {totalPages}
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={safePage === 1}
                onClick={() => setPage((p) => p - 1)}>Previous</Button>
              <Button variant="outline" size="sm" disabled={safePage === totalPages}
                onClick={() => setPage((p) => p + 1)}>Next</Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <th className={`px-5 py-3 font-medium ${className}`}>{children}</th>;
}

function LearnerRow({ l }: { l: Learner }) {
  const initials = l.fullName.split(" ").map((p) => p[0]).slice(0, 2).join("");
  return (
    <tr className="border-t border-border transition-colors hover:bg-muted/40">
      <td className="px-5 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
            {initials}
          </div>
          <div>
            <div className="font-medium text-foreground">{l.fullName}</div>
            <div className="text-xs text-muted-foreground">{l.email}</div>
          </div>
        </div>
      </td>
      <td className="px-5 py-3">
        <Badge variant="secondary" className="font-normal">{l.cohort}</Badge>
      </td>
      <td className="px-5 py-3">{l.currentRole}</td>
      <td className="px-5 py-3 text-muted-foreground">{l.companyName}</td>
      <td className="px-5 py-3 text-right tabular-nums">{l.yearsExperience}</td>
      <td className="px-5 py-3 text-muted-foreground">{l.city}</td>
      <td className="px-5 py-3 text-right">
        <Link
          to="/learners/$id"
          params={{ id: l.id }}
          className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-primary hover:bg-accent"
        >
          View profile <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </td>
    </tr>
  );
}

function StatCard({
  icon, label, value,
}: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-accent text-accent-foreground">
          {icon}
        </span>
        {label}
      </div>
      <div className="mt-2 font-display text-3xl text-foreground">{value}</div>
    </div>
  );
}

function MultiFilter({
  label, options, selected, onChange,
}: { label: string; options: string[]; selected: string[]; onChange: (v: string[]) => void }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 gap-1.5">
          {label}
          {selected.length > 0 && (
            <span className="rounded bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
              {selected.length}
            </span>
          )}
          <ChevronDown className="h-3.5 w-3.5 opacity-60" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2">
        <div className="max-h-64 space-y-0.5 overflow-y-auto">
          {options.map((opt) => {
            const checked = selected.includes(opt);
            return (
              <label key={opt}
                className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent">
                <Checkbox
                  checked={checked}
                  onCheckedChange={(c) => {
                    onChange(c ? [...selected, opt] : selected.filter((v) => v !== opt));
                  }}
                />
                <span className="truncate">{opt}</span>
              </label>
            );
          })}
        </div>
        {selected.length > 0 && (
          <button onClick={() => onChange([])}
            className="mt-1 w-full rounded-md px-2 py-1.5 text-left text-xs text-muted-foreground hover:bg-muted">
            Clear {label}
          </button>
        )}
      </PopoverContent>
    </Popover>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="mx-auto flex max-w-sm flex-col items-center text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Inbox className="h-5 w-5" />
      </div>
      <h3 className="mt-3 text-sm font-semibold">No learners match this filter</h3>
      <p className="mt-1 text-xs text-muted-foreground">
        Try adjusting your search or clearing some filters.
      </p>
      <Button variant="outline" size="sm" className="mt-4" onClick={onReset}>
        Clear all filters
      </Button>
    </div>
  );
}
