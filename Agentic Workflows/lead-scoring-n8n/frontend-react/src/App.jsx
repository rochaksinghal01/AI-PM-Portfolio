import { useState, useEffect, useCallback } from 'react';

// ---- Configuration ---------------------------------------------------------
// Safe to keep the Supabase PUBLISHABLE key here -- that's what it's for.
// Never put the secret key in frontend code. Override via .env (VITE_*) if needed.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://fcbkjasbexttbivcgveq.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_OEaf0d91p9b7OxmCht05Rg_nUkyo_8P';
const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || 'https://rochal10.app.n8n.cloud/webhook/leads-upload';
// -----------------------------------------------------------------------------

function supaHeaders(extra = {}) {
  return {
    apikey: SUPABASE_PUBLISHABLE_KEY,
    Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
    ...extra,
  };
}

function UploadPanel({ onUploaded }) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState({ text: '', kind: '' });
  const [busy, setBusy] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      setStatus({ text: 'Choose a CSV file first.', kind: 'err' });
      return;
    }
    setBusy(true);
    setStatus({ text: 'Reading file...', kind: '' });
    try {
      const text = await file.text();
      setStatus({ text: 'Sending to n8n...', kind: '' });
      const res = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csv: text }),
      });
      if (!res.ok) throw new Error(`n8n responded ${res.status}: ${await res.text()}`);
      setStatus({ text: `Sent. n8n responded ${res.status} — check the execution log, then refresh the queue below.`, kind: 'ok' });
      onUploaded();
    } catch (e) {
      setStatus({ text: `Failed: ${e.message}. If this is a CORS error, check the Webhook node's Allowed Origins.`, kind: 'err' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="card">
      <h2>1. Upload leads CSV</h2>
      <div className="toolbar">
        <input type="file" accept=".csv" onChange={(e) => setFile(e.target.files[0])} />
        <button disabled={busy} onClick={handleUpload}>Send to n8n</button>
      </div>
      {status.text && (
        <div className={`status-msg ${status.kind === 'ok' ? 'status-ok' : status.kind === 'err' ? 'status-err' : ''}`}>
          {status.text}
        </div>
      )}
      <div className="note">Posts to the n8n production webhook. The workflow must be active.</div>
    </div>
  );
}

function ReviewQueue({ refreshKey }) {
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState({ text: '', kind: '' });
  const [tierFilter, setTierFilter] = useState('all');
  const [scopeFilter, setScopeFilter] = useState('needsReview');

  const load = useCallback(async () => {
    setStatus({ text: 'Loading...', kind: '' });
    try {
      const params = new URLSearchParams();
      params.set('order', 'processed_at.desc');
      params.set('select', 'lead_id,name,company,tier,total_score,review_reason,summary,status,needs_human_review');
      if (scopeFilter === 'needsReview') params.set('needs_human_review', 'eq.true');
      if (tierFilter !== 'all') params.set('tier', `eq.${tierFilter}`);
      const url = `${SUPABASE_URL}/rest/v1/leads_scored?${params.toString()}`;
      const res = await fetch(url, { headers: supaHeaders() });
      if (!res.ok) throw new Error(`Supabase responded ${res.status}: ${await res.text()}`);
      const data = await res.json();
      setRows(data);
      setStatus({ text: `Loaded ${data.length} row(s).`, kind: 'ok' });
    } catch (e) {
      setStatus({ text: `Failed: ${e.message}. If this is a 401/permission error, check RLS on leads_scored.`, kind: 'err' });
    }
  }, [tierFilter, scopeFilter]);

  useEffect(() => {
    load();
  }, [load, refreshKey]);

  const resolve = async (leadId) => {
    try {
      const url = `${SUPABASE_URL}/rest/v1/leads_scored?lead_id=eq.${encodeURIComponent(leadId)}`;
      const res = await fetch(url, {
        method: 'PATCH',
        headers: supaHeaders({ 'Content-Type': 'application/json', Prefer: 'return=minimal' }),
        body: JSON.stringify({ needs_human_review: false, status: 'ok' }),
      });
      if (!res.ok) throw new Error(`Supabase responded ${res.status}: ${await res.text()}`);
      load();
    } catch (e) {
      alert(`Could not resolve ${leadId}: ${e.message}`);
    }
  };

  return (
    <div className="card">
      <h2>2. Human review queue</h2>
      <div className="toolbar">
        <button className="secondary" onClick={load}>Refresh</button>
        <label>Tier</label>
        <select value={tierFilter} onChange={(e) => setTierFilter(e.target.value)}>
          <option value="all">All tiers</option>
          <option value="Hot">Hot</option>
          <option value="Warm">Warm</option>
          <option value="Cold">Cold</option>
        </select>
        <label>Scope</label>
        <select value={scopeFilter} onChange={(e) => setScopeFilter(e.target.value)}>
          <option value="needsReview">Needs review only</option>
          <option value="all">All processed leads</option>
        </select>
      </div>
      {status.text && (
        <div className={`status-msg ${status.kind === 'ok' ? 'status-ok' : status.kind === 'err' ? 'status-err' : ''}`}>
          {status.text}
        </div>
      )}
      {rows.length === 0 ? (
        <div className="empty">Nothing matches this filter.</div>
      ) : (
        <table>
          <colgroup>
            <col style={{ width: '14%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '20%' }} />
            <col style={{ width: '32%' }} />
            <col style={{ width: '12%' }} />
          </colgroup>
          <thead>
            <tr><th>Lead</th><th>Company</th><th>Tier</th><th>Reason</th><th>Summary</th><th></th></tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.lead_id}>
                <td>{r.lead_id}<br /><span className="muted">{r.name || ''}</span></td>
                <td>{r.company || '-'}</td>
                <td><span className={`tier tier-${r.tier}`}>{r.tier} ({r.total_score})</span></td>
                <td>{r.review_reason || '-'}</td>
                <td>{r.summary || <span className="muted">(no summary — LLM call failed or was rate-limited for this lead)</span>}</td>
                <td>
                  {r.needs_human_review ? (
                    <button className="secondary" onClick={() => resolve(r.lead_id)}>Mark reviewed</button>
                  ) : (
                    <span className="resolved">resolved</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default function App() {
  const [refreshKey, setRefreshKey] = useState(0);
  return (
    <div className="app">
      <h1>Lead Scoring — Upload &amp; Review</h1>
      <div className="sub">Upload a leads CSV to n8n, review anything flagged for a human, filter by tier.</div>
      <UploadPanel onUploaded={() => setRefreshKey((k) => k + 1)} />
      <ReviewQueue refreshKey={refreshKey} />
    </div>
  );
}
