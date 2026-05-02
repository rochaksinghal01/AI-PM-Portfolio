import Papa from "papaparse";
import { createServerFn } from "@tanstack/react-start";
import { queryOptions } from "@tanstack/react-query";
import fallback from "@/data/learners.json";

export type Learner = {
  id: string;
  timestamp: string;
  cohort: string;
  fullName: string;
  mobile: string;
  email: string;
  currentRole: string;
  companyName: string;
  linkedin: string;
  yearsExperience: number;
  resumeLink: string;
  source: string;
  city: string;
};

// 👉 Paste your "Publish to web" CSV URL here.
// File → Share → Publish to web → choose CSV → Publish.
// Looks like: https://docs.google.com/spreadsheets/d/e/XXXX/pub?gid=0&single=true&output=csv
const PUBLISHED_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQMUxPh_WfwJ-OTTP9ll6yZPUF0gGQXbPkIbeWrOQcEwZ_xJCCvpVpEPh5FWjXpkfwuSPSOAt3ANB6J/pub?output=csv";

const slug = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// Map common header variants → our Learner field names.
const HEADER_MAP: Record<string, keyof Learner> = {
  "timestamp": "timestamp",
  "cohort": "cohort",
  "full name": "fullName",
  "name": "fullName",
  "mobile": "mobile",
  "phone": "mobile",
  "mobile number": "mobile",
  "email": "email",
  "email address": "email",
  "current role": "currentRole",
  "role": "currentRole",
  "company name": "companyName",
  "company": "companyName",
  "linkedin": "linkedin",
  "linkedin profile": "linkedin",
  "linkedin url": "linkedin",
  "total years of experience": "yearsExperience",
  "years of experience": "yearsExperience",
  "experience": "yearsExperience",
  "resume link": "resumeLink",
  "resume": "resumeLink",
  "how did you hear about us?": "source",
  "how did you hear about us": "source",
  "source": "source",
  "city of residence": "city",
  "city": "city",
};

function rowToLearner(row: Record<string, string>, idx: number): Learner | null {
  const out: Partial<Learner> = {};
  for (const [rawKey, val] of Object.entries(row)) {
    const key = HEADER_MAP[rawKey.toLowerCase().trim()];
    if (!key) continue;
    if (key === "yearsExperience") {
      const n = parseFloat(String(val).replace(/[^0-9.]/g, ""));
      out.yearsExperience = isNaN(n) ? 0 : n;
    } else {
      (out as Record<string, string>)[key] = String(val ?? "").trim();
    }
  }
  if (!out.fullName && !out.email) return null;
  out.id = slug(`${out.fullName ?? ""}-${out.email ?? idx}`) || `row-${idx}`;
  out.timestamp ??= "";
  out.cohort ??= "";
  out.mobile ??= "";
  out.email ??= "";
  out.currentRole ??= "";
  out.companyName ??= "";
  out.linkedin ??= "";
  out.resumeLink ??= "";
  out.source ??= "";
  out.city ??= "";
  out.yearsExperience ??= 0;
  return out as Learner;
}

export const fetchLearners = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ learners: Learner[]; source: "sheet" | "fallback"; fetchedAt: string }> => {
    const fetchedAt = new Date().toISOString();
    if (!PUBLISHED_CSV_URL) {
      return { learners: fallback as Learner[], source: "fallback", fetchedAt };
    }
    try {
      const res = await fetch(PUBLISHED_CSV_URL, { headers: { "cache-control": "no-cache" } });
      if (!res.ok) throw new Error(`Sheet fetch failed: ${res.status}`);
      const csv = await res.text();
      const parsed = Papa.parse<Record<string, string>>(csv, {
        header: true,
        skipEmptyLines: true,
      });
      const learners = parsed.data
        .map((row, i) => rowToLearner(row, i))
        .filter((l): l is Learner => l !== null);
      if (!learners.length) throw new Error("Sheet returned no rows");
      return { learners, source: "sheet", fetchedAt };
    } catch (err) {
      console.error("[learners] sheet fetch failed, using fallback:", err);
      return { learners: fallback as Learner[], source: "fallback", fetchedAt };
    }
  },
);

export const learnersQueryOptions = () =>
  queryOptions({
    queryKey: ["learners"],
    queryFn: () => fetchLearners(),
    staleTime: 60_000,
  });

export const getInitials = (name: string) =>
  name.split(" ").map((p) => p[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
