#!/usr/bin/env python3
"""
Lead cleaning / enrichment / prioritization pipeline.

Reference implementation of the n8n workflow in leads_workflow.json.
Every stage is wrapped so a single bad row (malformed CSV, bad email,
enrichment API failure, LLM failure) is FLAGGED and the run continues.
Nothing is silently dropped.

Usage:
    python3 pipeline.py leads_sample.csv

Env vars:
    OPENROUTER_API_KEY   - if unset, LLM step runs in MOCK mode (clearly logged)
    OPENROUTER_MODEL      - default below; OpenRouter's free-model list changes
                            often, verify current slug at openrouter.ai/models
    DATABASE_URL          - if set (postgres://...), writes to Postgres instead
                            of the local leads.db SQLite file
    ENRICH_API_TIMEOUT    - seconds, default 5
"""

import csv
import io
import json
import os
import re
import sqlite3
import sys
import time
import urllib.request
import urllib.error
from datetime import datetime, timezone

OPENROUTER_MODEL = os.environ.get("OPENROUTER_MODEL", "meta-llama/llama-3.2-3b-instruct:free")
OPENROUTER_API_KEY = os.environ.get("OPENROUTER_API_KEY")
DATABASE_URL = os.environ.get("DATABASE_URL")  # postgres://user:pass@host:port/db
ENRICH_TIMEOUT = float(os.environ.get("ENRICH_API_TIMEOUT", "5"))
ENRICH_API_ENABLED = os.environ.get("ENRICH_API_ENABLED", "true").lower() not in ("false", "0", "no")

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
EXPECTED_HEADER = ["lead_id", "name", "email", "company", "raw_notes", "source"]


# ---------------------------------------------------------------------------
# 1. INGEST — tolerant CSV reader. Ragged rows are repaired/padded, not dropped.
# ---------------------------------------------------------------------------

def ingest(path):
    """Returns a list of dicts, each with an extra _ingest_flags list."""
    rows = []
    with open(path, newline="", encoding="utf-8-sig", errors="replace") as f:
        raw_reader = csv.reader(f)
        try:
            header = next(raw_reader)
        except StopIteration:
            return rows

        header = [h.strip() for h in header]
        n_expected = len(header)

        for line_no, fields in enumerate(raw_reader, start=2):
            flags = []
            if not fields or all(f.strip() == "" for f in fields):
                continue  # a genuinely blank line, not a lead — safe to skip

            if len(fields) < n_expected:
                # too few columns (e.g. a trailing comma got eaten) — pad, flag
                fields = fields + [""] * (n_expected - len(fields))
                flags.append(f"structural: expected {n_expected} columns, got fewer at line {line_no}")
            elif len(fields) > n_expected:
                # too many columns — most likely an unescaped comma inside
                # raw_notes. Best-effort repair: keep the first N-1 fields as-is
                # and re-join everything from the raw_notes position onward.
                notes_idx = header.index("raw_notes") if "raw_notes" in header else n_expected - 2
                head = fields[:notes_idx]
                tail_source = fields[-1] if len(header) - notes_idx - 1 == 1 else None
                merged_notes = ",".join(fields[notes_idx: len(fields) - (1 if tail_source is not None else 0)])
                repaired = head + [merged_notes]
                if tail_source is not None:
                    repaired.append(tail_source)
                fields = repaired[:n_expected] if len(repaired) >= n_expected else repaired + [""] * (n_expected - len(repaired))
                flags.append(f"structural: expected {n_expected} columns, got more at line {line_no} (auto-merged extra commas into raw_notes)")

            row = dict(zip(header, fields))
            for col in EXPECTED_HEADER:
                row.setdefault(col, "")
            row["_line_no"] = line_no
            row["_ingest_flags"] = flags
            rows.append(row)

    return rows


# ---------------------------------------------------------------------------
# 2. CLEAN / VALIDATE
# ---------------------------------------------------------------------------

def clean_and_validate(row, seen_emails):
    flags = list(row.get("_ingest_flags", []))

    lead_id = (row.get("lead_id") or "").strip()
    name = (row.get("name") or "").strip()
    email = (row.get("email") or "").strip().lower()
    company = (row.get("company") or "").strip()
    raw_notes = (row.get("raw_notes") or "").strip()
    source = (row.get("source") or "").strip().lower() or "unknown"

    if not lead_id:
        flags.append("missing lead_id")
    email_valid = bool(EMAIL_RE.match(email))
    if not email:
        flags.append("missing email")
    elif not email_valid:
        flags.append(f"malformed email: '{email}'")

    if not company:
        flags.append("missing company")
    if not raw_notes:
        flags.append("empty raw_notes")

    if email_valid:
        if email in seen_emails:
            flags.append(f"possible duplicate of {seen_emails[email]} (same email)")
        else:
            seen_emails[email] = lead_id or f"line {row.get('_line_no')}"

    return {
        "lead_id": lead_id or f"UNKNOWN-{row.get('_line_no')}",
        "name": name or None,
        "email": email or None,
        "email_valid": email_valid,
        "company": company or None,
        "raw_notes": raw_notes or None,
        "source": source,
        "flags": flags,
    }


# ---------------------------------------------------------------------------
# 3. ENRICH — domain from email (+ optional free, no-key validation API)
# ---------------------------------------------------------------------------

def guess_domain_from_company(company):
    if not company:
        return None
    slug = re.sub(r"[^a-z0-9]", "", company.lower())
    return f"{slug}.com" if slug else None


def enrich(lead):
    flags = []
    domain = None
    domain_source = None

    if lead["email_valid"]:
        domain = lead["email"].split("@", 1)[1]
        domain_source = "email"
    else:
        domain = guess_domain_from_company(lead["company"])
        domain_source = "inferred_from_company_name" if domain else None
        if domain:
            flags.append(f"domain guessed from company name (low confidence): {domain}")
        else:
            flags.append("could not derive domain: no valid email and no company name")

    enrichment = {
        "domain": domain,
        "domain_source": domain_source,
        "domain_deliverable": None,
        "domain_is_disposable": None,
    }

    # Optional "go further" step: free, no-API-key domain/email check via disify.com.
    # Wrapped so a network failure or bad response never breaks the row.
    if domain and ENRICH_API_ENABLED:
        try:
            url = f"https://www.disify.com/api/email/{lead['email'] or domain}"
            req = urllib.request.Request(url, headers={"User-Agent": "leads-pipeline/1.0"})
            with urllib.request.urlopen(req, timeout=ENRICH_TIMEOUT) as resp:
                data = json.loads(resp.read().decode("utf-8"))
            enrichment["domain_is_disposable"] = data.get("disposable")
            enrichment["domain_deliverable"] = data.get("dns") if "dns" in data else data.get("format")
        except Exception as e:  # noqa: BLE001 - deliberately broad, this is optional enrichment
            flags.append(f"enrichment API failed (non-fatal): {type(e).__name__}: {e}")

    return enrichment, flags


# ---------------------------------------------------------------------------
# 4. PRIORITIZE — one LLM call per lead via OpenRouter
# ---------------------------------------------------------------------------

PROMPT_TEMPLATE = """You triage inbound sales leads. Read the notes below and respond with ONLY a JSON \
object, no other text: {{"priority": "high|medium|low", "summary": "one sentence, <20 words"}}

Guidance: "high" = clear buying intent, urgency, or budget/timeline mentioned. \
"low" = explicitly not interested, browsing only, or notes are empty/gibberish. \
"medium" = anything else / genuinely ambiguous.

Lead notes: \"\"\"{notes}\"\"\"
"""


def call_llm_mock(notes):
    """Deterministic offline stand-in used when OPENROUTER_API_KEY is not set.
    Clearly logged as MOCK — swap in a real key to hit the real model."""
    if not notes:
        return {"priority": "low", "summary": "No notes provided to assess."}
    low = notes.lower()
    common_words = {"the", "a", "to", "for", "and", "is", "are", "our", "your", "we", "want", "wants",
                     "need", "needs", "please", "would", "will", "this", "that", "with", "interested",
                     "quote", "order", "call", "callback", "demo", "budget", "price", "pricing", "team",
                     "next", "week", "month", "quarter", "on", "in", "of", "not", "just", "asked", "spoke"}
    words = set(re.findall(r"[a-z']+", low))
    if not (words & common_words) or len(set(low.replace(" ", ""))) < 6:
        return {"priority": "low", "summary": "Notes appear to be gibberish / unreadable — treated as low priority."}
    urgent_kw = ["urgent", "asap", "this quarter", "by friday", "budget approved", "next week", "500 unit", "procurement"]
    negative_kw = ["not interested", "just browsing", "revisit next year", "low priority"]
    if any(k in low for k in negative_kw):
        return {"priority": "low", "summary": "Lead has signaled low interest or is only browsing."}
    if any(k in low for k in urgent_kw):
        return {"priority": "high", "summary": "Notes show urgency, budget, or a concrete near-term ask."}
    return {"priority": "medium", "summary": "General interest without a clear urgency signal."}


def call_llm_openrouter(notes, retries=2):
    prompt = PROMPT_TEMPLATE.format(notes=notes or "(no notes provided)")
    body = json.dumps({
        "model": OPENROUTER_MODEL,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0,
    }).encode("utf-8")

    last_err = None
    for attempt in range(retries + 1):
        try:
            req = urllib.request.Request(
                "https://openrouter.ai/api/v1/chat/completions",
                data=body,
                headers={
                    "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                    "Content-Type": "application/json",
                },
                method="POST",
            )
            with urllib.request.urlopen(req, timeout=20) as resp:
                data = json.loads(resp.read().decode("utf-8"))
            content = data["choices"][0]["message"]["content"].strip()
            # models sometimes wrap JSON in ```json fences despite instructions
            content = re.sub(r"^```(json)?|```$", "", content, flags=re.MULTILINE).strip()
            parsed = json.loads(content)
            priority = str(parsed.get("priority", "")).lower().strip()
            if priority not in ("high", "medium", "low"):
                raise ValueError(f"unexpected priority value: {priority!r}")
            return {"priority": priority, "summary": str(parsed.get("summary", ""))[:300]}
        except Exception as e:  # noqa: BLE001
            last_err = e
            if attempt < retries:
                time.sleep(1.5 * (attempt + 1))
    raise RuntimeError(f"OpenRouter call failed after {retries + 1} attempts: {last_err}")


def prioritize(lead):
    flags = []
    if OPENROUTER_API_KEY:
        try:
            result = call_llm_openrouter(lead["raw_notes"])
            return result, flags
        except Exception as e:  # noqa: BLE001
            flags.append(f"LLM call failed, row flagged not dropped: {e}")
            return {"priority": "unknown", "summary": "LLM enrichment failed for this row."}, flags
    else:
        # Mock mode is a run-level configuration fact (printed once in the
        # summary), not a per-row data-quality problem — don't flag every row.
        result = call_llm_mock(lead["raw_notes"])
        return result, flags


# ---------------------------------------------------------------------------
# 5. STORE
# ---------------------------------------------------------------------------

POSTGRES_DDL = """
CREATE TABLE IF NOT EXISTS leads_enriched (
    lead_id             TEXT PRIMARY KEY,
    name                TEXT,
    email               TEXT,
    email_valid         BOOLEAN,
    company             TEXT,
    domain              TEXT,
    domain_source       TEXT,
    domain_is_disposable BOOLEAN,
    raw_notes           TEXT,
    source              TEXT,
    priority            TEXT,
    summary             TEXT,
    status              TEXT,          -- 'ok' | 'flagged'
    flags               TEXT,          -- newline-joined list, human readable
    processed_at        TIMESTAMPTZ DEFAULT now()
);
"""

SQLITE_DDL = """
CREATE TABLE IF NOT EXISTS leads_enriched (
    lead_id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT,
    email_valid INTEGER,
    company TEXT,
    domain TEXT,
    domain_source TEXT,
    domain_is_disposable TEXT,
    raw_notes TEXT,
    source TEXT,
    priority TEXT,
    summary TEXT,
    status TEXT,
    flags TEXT,
    processed_at TEXT
);
"""


def store_sqlite(db_path, records):
    conn = sqlite3.connect(db_path)
    conn.execute(SQLITE_DDL)
    for r in records:
        conn.execute(
            """INSERT INTO leads_enriched
               (lead_id, name, email, email_valid, company, domain, domain_source,
                domain_is_disposable, raw_notes, source, priority, summary, status, flags, processed_at)
               VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
               ON CONFLICT(lead_id) DO UPDATE SET
                 name=excluded.name, email=excluded.email, email_valid=excluded.email_valid,
                 company=excluded.company, domain=excluded.domain, domain_source=excluded.domain_source,
                 domain_is_disposable=excluded.domain_is_disposable, raw_notes=excluded.raw_notes,
                 source=excluded.source, priority=excluded.priority, summary=excluded.summary,
                 status=excluded.status, flags=excluded.flags, processed_at=excluded.processed_at
            """,
            (
                r["lead_id"], r["name"], r["email"], int(r["email_valid"]), r["company"],
                r["domain"], r["domain_source"], str(r["domain_is_disposable"]), r["raw_notes"],
                r["source"], r["priority"], r["summary"], r["status"], r["flags"], r["processed_at"],
            ),
        )
    conn.commit()
    conn.close()


def store_postgres(database_url, records):
    import psycopg2  # imported lazily so the script runs without it installed
    conn = psycopg2.connect(database_url)
    cur = conn.cursor()
    cur.execute(POSTGRES_DDL)
    for r in records:
        cur.execute(
            """INSERT INTO leads_enriched
               (lead_id, name, email, email_valid, company, domain, domain_source,
                domain_is_disposable, raw_notes, source, priority, summary, status, flags)
               VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
               ON CONFLICT (lead_id) DO UPDATE SET
                 name=EXCLUDED.name, email=EXCLUDED.email, email_valid=EXCLUDED.email_valid,
                 company=EXCLUDED.company, domain=EXCLUDED.domain, domain_source=EXCLUDED.domain_source,
                 domain_is_disposable=EXCLUDED.domain_is_disposable, raw_notes=EXCLUDED.raw_notes,
                 source=EXCLUDED.source, priority=EXCLUDED.priority, summary=EXCLUDED.summary,
                 status=EXCLUDED.status, flags=EXCLUDED.flags
            """,
            (
                r["lead_id"], r["name"], r["email"], r["email_valid"], r["company"],
                r["domain"], r["domain_source"], r["domain_is_disposable"], r["raw_notes"],
                r["source"], r["priority"], r["summary"], r["status"], r["flags"],
            ),
        )
    conn.commit()
    cur.close()
    conn.close()


# ---------------------------------------------------------------------------
# MAIN
# ---------------------------------------------------------------------------

def run(csv_path, out_dir):
    rows = ingest(csv_path)
    seen_emails = {}
    records = []

    for row in rows:
        # Each row is fully isolated: an exception anywhere below is caught,
        # the row is flagged 'flagged', and the loop moves on.
        try:
            lead = clean_and_validate(row, seen_emails)
            enrichment, enrich_flags = enrich(lead)
            priority_result, priority_flags = prioritize(lead)

            all_flags = lead["flags"] + enrich_flags + priority_flags
            status = "flagged" if all_flags else "ok"

            records.append({
                "lead_id": lead["lead_id"],
                "name": lead["name"],
                "email": lead["email"],
                "email_valid": lead["email_valid"],
                "company": lead["company"],
                "domain": enrichment["domain"],
                "domain_source": enrichment["domain_source"],
                "domain_is_disposable": enrichment["domain_is_disposable"],
                "raw_notes": lead["raw_notes"],
                "source": lead["source"],
                "priority": priority_result["priority"],
                "summary": priority_result["summary"],
                "status": status,
                "flags": " | ".join(all_flags),
                "processed_at": datetime.now(timezone.utc).isoformat(),
            })
        except Exception as e:  # noqa: BLE001 - last-resort safety net, row must not crash the run
            records.append({
                "lead_id": row.get("lead_id") or f"UNKNOWN-{row.get('_line_no')}",
                "name": row.get("name"),
                "email": row.get("email"),
                "email_valid": False,
                "company": row.get("company"),
                "domain": None,
                "domain_source": None,
                "domain_is_disposable": None,
                "raw_notes": row.get("raw_notes"),
                "source": row.get("source") or "unknown",
                "priority": "unknown",
                "summary": "Row processing failed unexpectedly.",
                "status": "flagged",
                "flags": f"UNHANDLED ERROR: {type(e).__name__}: {e}",
                "processed_at": datetime.now(timezone.utc).isoformat(),
            })

    os.makedirs(out_dir, exist_ok=True)

    if DATABASE_URL:
        store_postgres(DATABASE_URL, records)
        db_note = f"written to Postgres at {DATABASE_URL.split('@')[-1]}"
    else:
        # SQLite needs real file-locking support; some mounted/network output
        # folders (FUSE, etc.) don't provide it, so build the DB in a local
        # temp dir first and copy the finished file into out_dir.
        import shutil
        import tempfile
        db_path = os.path.join(out_dir, "leads.db")
        with tempfile.TemporaryDirectory() as tmp:
            tmp_db = os.path.join(tmp, "leads.db")
            store_sqlite(tmp_db, records)
            shutil.copyfile(tmp_db, db_path)
        db_note = f"written to local SQLite: {db_path} (Postgres DDL in schema.sql — swap via DATABASE_URL)"

    out_csv = os.path.join(out_dir, "leads_output.csv")
    with open(out_csv, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=list(records[0].keys()) if records else [])
        writer.writeheader()
        writer.writerows(records)

    out_json = os.path.join(out_dir, "leads_output.json")
    with open(out_json, "w", encoding="utf-8") as f:
        json.dump(records, f, indent=2)

    n_ok = sum(1 for r in records if r["status"] == "ok")
    n_flagged = sum(1 for r in records if r["status"] == "flagged")

    print(f"Processed {len(records)} rows from {csv_path}")
    print(f"  ok: {n_ok}   flagged: {n_flagged}")
    print(f"  {db_note}")
    print(f"  CSV : {out_csv}")
    print(f"  JSON: {out_json}")
    if not OPENROUTER_API_KEY:
        print("  NOTE: OPENROUTER_API_KEY not set — priority/summary came from the MOCK heuristic, not a real LLM.")

    return records


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 pipeline.py <leads.csv> [out_dir]")
        sys.exit(1)
    csv_arg = sys.argv[1]
    out_dir_arg = sys.argv[2] if len(sys.argv) > 2 else os.path.join(os.path.dirname(os.path.abspath(csv_arg)), "output")
    run(csv_arg, out_dir_arg)
