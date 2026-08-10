import { useMemo, useState } from 'react';
import { api, backendConnected } from './lib/api.js';
import { applyEngagementEvent, canonicalizeWebsite, formatKg } from './lib/engine.js';
import { buildDemoAccount, demoAccounts } from './data/demoData.js';

const STORAGE_KEY = 'knoxx-outbound-demo-v1';
const tabs = ['Overview', 'Evidence', 'Ingredient match', 'Buying committee', 'Outreach'];

function readAccounts() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : demoAccounts;
  } catch {
    return demoAccounts;
  }
}

function saveAccounts(accounts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
}

const Icon = ({ name }) => {
  const paths = {
    home: 'M3 11.5 12 4l9 7.5M5 10v10h14V10M9 20v-6h6v6',
    target: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Zm0-5a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0-3a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z',
    users: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm13 10v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
    send: 'm22 2-7 20-4-9-9-4 20-7ZM11 13 22 2',
    chart: 'M4 19V9m6 10V5m6 14v-7m6 7V2',
    settings: 'M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z',
    external: 'M14 3h7v7m0-7L10 14M5 5h5M5 5v14h14v-5',
    search: 'm21 21-4.35-4.35M19 11a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z',
    spark: 'm12 3 1.3 4.2L17 9l-3.7 1.8L12 15l-1.3-4.2L7 9l3.7-1.8L12 3Zm6 11 .7 2.3L21 17l-2.3.7L18 20l-.7-2.3L15 17l2.3-.7L18 14Z',
    check: 'm5 12 4 4L19 6',
    chevron: 'm9 18 6-6-6-6',
    link: 'M10 13a5 5 0 0 0 7.1.1l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1M14 11a5 5 0 0 0-7.1-.1l-2 2A5 5 0 0 0 12 20l1.1-1.1',
    clock: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Zm0-16v6l4 2',
  };
  return <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={paths[name]} /></svg>;
};

function Badge({ children, tone = 'neutral' }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

function Shell({ children, onNew }) {
  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand"><div className="brand-mark">K</div><div><strong>Knoxx</strong><span>Outbound Intelligence</span></div></div>
        <nav>
          <button className="nav-item active"><Icon name="home" />Pipeline</button>
          <button className="nav-item"><Icon name="target" />Accounts</button>
          <button className="nav-item"><Icon name="users" />Contacts</button>
          <button className="nav-item"><Icon name="send" />Outreach</button>
          <button className="nav-item"><Icon name="chart" />Insights</button>
        </nav>
        <div className="sidebar-foot">
          <button className="nav-item"><Icon name="settings" />Rules &amp; catalogue</button>
          <div className="demo-notice"><span className="pulse" />Safe demo mode<strong>External sends are allowlisted</strong></div>
          <div className="profile"><div className="avatar">RS</div><div><strong>Rochak Singhal</strong><span>Sales operator</span></div></div>
        </div>
      </aside>
      <main className="main">
        <header className="topbar">
          <div className="crumb">Workspace <span>/</span> Outbound pipeline</div>
          <div className="top-actions"><div className="connection"><span className={backendConnected ? 'dot-live' : 'dot-demo'} />{backendConnected ? 'Backend connected' : 'Fixture mode'}</div><button className="button primary" onClick={onNew}><Icon name="spark" />Research account</button></div>
        </header>
        {children}
      </main>
    </div>
  );
}

function Pipeline({ accounts, onSelect, onNew }) {
  const qualified = accounts.filter((account) => account.score?.tier === 'qualified').length;
  const active = accounts.filter((account) => ['active_outreach', 'approved'].includes(account.stage)).length;
  const potential = accounts.reduce((sum, account) => sum + (account.ingredientMatches || []).reduce((total, match) => total + (match.forecast?.base?.annual || 0), 0), 0);
  return (
    <div className="page">
      <section className="page-heading"><div><p className="eyebrow">ACCOUNT WORKSPACE</p><h1>Outbound pipeline</h1><p>Research, qualify and engage food manufacturers with evidence you can inspect.</p></div><button className="button secondary" onClick={onNew}>+ New research run</button></section>
      <section className="metric-grid">
        <div className="metric-card"><div className="metric-icon lilac"><Icon name="target" /></div><span>Accounts researched</span><strong>{accounts.length}</strong><small>One account per workflow run</small></div>
        <div className="metric-card"><div className="metric-icon green"><Icon name="check" /></div><span>Qualified accounts</span><strong>{qualified}</strong><small>{accounts.length ? Math.round((qualified / accounts.length) * 100) : 0}% of researched accounts</small></div>
        <div className="metric-card"><div className="metric-icon amber"><Icon name="chart" /></div><span>Estimated annual demand</span><strong>{potential ? `${Math.round(potential / 1000)}t` : '—'}</strong><small>Base case · synthetic assumptions</small></div>
        <div className="metric-card"><div className="metric-icon blue"><Icon name="send" /></div><span>Active sequences</span><strong>{active}</strong><small>All external sends remain allowlisted</small></div>
      </section>
      <section className="panel accounts-panel">
        <div className="panel-head"><div><h2>Account pipeline</h2><p>Evidence-backed research runs and their current sales stage.</p></div><div className="filters"><button className="filter active">All</button><button className="filter">Qualified</button><button className="filter">Review</button></div></div>
        <div className="account-table">
          <div className="table-row table-header"><span>Account</span><span>Fit score</span><span>Stage</span><span>Ingredient opportunity</span><span>Last updated</span><span /></div>
          {accounts.map((account) => (
            <button className="table-row account-row" key={account.id} onClick={() => onSelect(account.id)}>
              <span className="account-cell"><span className="company-logo">{account.name.slice(0, 2).toUpperCase()}</span><span><strong>{account.name}</strong><small>{account.domain}</small></span></span>
              <span><span className={`score-pill ${account.score?.tier || 'review'}`}>{account.score?.total || '—'}</span><small className="score-label">{account.score?.tier || 'pending'}</small></span>
              <span><Badge tone={account.stage === 'draft_ready' ? 'purple' : account.stage === 'review' ? 'amber' : 'neutral'}>{String(account.stage).replaceAll('_', ' ')}</Badge></span>
              <span><strong>{account.ingredientMatches?.length || '—'} categories</strong><small>{account.ingredientMatches ? 'Matched from recipe evidence' : 'Research requires review'}</small></span>
              <span><strong>{new Date(account.updatedAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}</strong><small>Run {account.runId?.slice(-8)}</small></span>
              <span><Icon name="chevron" /></span>
            </button>
          ))}
        </div>
      </section>
      <section className="principle-strip"><Icon name="spark" /><div><strong>Built for honest AI research</strong><span>Every claim is labeled observed, inferred or hypothesis. Quantity outputs remain ranges with visible assumptions.</span></div><button onClick={() => onSelect('acc_snapfresh')}>View golden account <span>→</span></button></section>
    </div>
  );
}

function ScoreRing({ score }) {
  const value = score?.total || 0;
  return <div className="score-ring" style={{ '--score': value }}><div><strong>{value}</strong><span>/ 100</span></div></div>;
}

function Overview({ account }) {
  return (
    <div className="detail-grid">
      <div className="detail-main">
        <section className="panel summary-panel"><div className="section-title"><div><p className="eyebrow">AI ACCOUNT BRIEF</p><h2>Why this account matters</h2></div><Badge tone="green">Evidence grounded</Badge></div><p className="summary-copy">{account.summary}</p><div className="signal-grid">{account.scaleSignals?.map((signal) => <div className="signal" key={signal.label}><strong>{signal.value}</strong><span>{signal.label}</span><Badge tone={signal.evidenceType === 'observed' ? 'blue' : 'amber'}>{signal.evidenceType}</Badge></div>)}</div></section>
        <section className="panel"><div className="section-title"><div><h2>Likely commercial pains</h2><p>Separated by evidence strength to prevent unsupported claims.</p></div></div><div className="finding-list">{account.findings?.map((finding) => <div className="finding" key={finding.label}><div className={`finding-icon ${finding.type}`}><Icon name={finding.type === 'hypothesis' ? 'spark' : 'check'} /></div><div><div className="finding-head"><strong>{finding.label}</strong><Badge tone={finding.type === 'inferred' ? 'purple' : 'amber'}>{finding.type}</Badge></div><p>{finding.text}</p><small>{finding.sourceIds.length} linked source{finding.sourceIds.length > 1 ? 's' : ''}</small></div></div>)}</div></section>
        <section className="panel"><div className="section-title"><div><h2>Detected dishes and products</h2><p>Inputs used for ingredient matching.</p></div></div><div className="dish-list">{account.dishes?.map((dish) => <div className="dish" key={dish.name}><div><strong>{dish.name}</strong><small>Source: {dish.sourceId}</small></div><div className="chips">{dish.ingredients.slice(0, 5).map((item) => <span key={item}>{item}</span>)}</div></div>)}</div></section>
      </div>
      <aside className="detail-side">
        <section className="panel fit-card"><p className="eyebrow">QUALIFICATION</p><ScoreRing score={account.score} /><Badge tone={account.score?.tier === 'qualified' ? 'green' : 'amber'}>{account.score?.tier}</Badge><div className="score-breakdown">{[
          ['Product applicability', account.score?.productApplicability, 40],
          ['Evidence specificity', account.score?.evidenceSpecificity, 25],
          ['Scale fit', account.score?.scaleFit, 20],
          ['Supply feasibility', account.score?.supplyFeasibility, 15],
        ].map(([label, value, max]) => <div key={label}><span>{label}<b>{value ?? '—'} / {max}</b></span><i><em style={{ width: `${((value || 0) / max) * 100}%` }} /></i></div>)}<div className="risk"><span>Risk penalty</span><b>{account.score?.riskPenalty ?? '—'}</b></div></div></section>
        <section className="panel service-card"><div className="section-title"><h3>Supply-area fit</h3><Badge tone="amber">Validate</Badge></div><p>{account.serviceFit?.explanation || 'Service-area evidence is not available yet.'}</p></section>
        <section className="panel metadata"><h3>Account record</h3><dl><div><dt>Canonical domain</dt><dd>{account.domain}</dd></div><div><dt>Parent company</dt><dd>{account.parentCompany || 'Not resolved'}</dd></div><div><dt>Lifecycle</dt><dd>{account.lifecycle || 'new'}</dd></div><div><dt>Segment</dt><dd>{account.category?.replaceAll('_', ' ')}</dd></div></dl></section>
      </aside>
    </div>
  );
}

function Evidence({ account }) {
  return <section className="panel full-panel"><div className="section-title"><div><p className="eyebrow">AUDIT TRAIL</p><h2>Research evidence</h2><p>Source passages retained with retrieval dates for sales verification.</p></div><Badge tone="blue">{account.sources?.length || 0} sources</Badge></div><div className="source-list">{account.sources?.map((source, index) => <article className="source" key={source.id}><div className="source-index">{String(index + 1).padStart(2, '0')}</div><div><div className="source-head"><strong>{source.title}</strong><a href={source.url} target="_blank" rel="noreferrer"><Icon name="external" /></a></div><p>“{source.excerpt}”</p><small>{source.url} · Retrieved {source.retrievedAt}</small></div></article>)}</div></section>;
}

function IngredientMatches({ account }) {
  return <section className="panel full-panel"><div className="section-title"><div><p className="eyebrow">RECIPE-TO-CATALOGUE ENGINE</p><h2>Ingredient opportunities</h2><p>Low, base and high estimates are planning ranges—not purchase claims.</p></div><Badge tone="purple">Synthetic Knoxx catalogue</Badge></div><div className="match-list">{account.ingredientMatches?.map((match) => <article className="match-card" key={match.id}><div className="match-top"><div><span className="category-label">{match.category}</span><h3>{match.ingredient}</h3><p>Matched to <strong>{match.knoxxProduct}</strong></p></div><div className="match-percent"><strong>{match.match}%</strong><span>match</span></div></div><div className="forecast-row"><div><span>Weekly base</span><strong>{formatKg(match.forecast?.base?.weekly)}</strong></div><div><span>Monthly base</span><strong>{formatKg(match.forecast?.base?.monthly)}</strong></div><div><span>Annual range</span><strong>{match.forecast?.low ? `${formatKg(match.forecast.low.annual)} – ${formatKg(match.forecast.high.annual)}` : 'Insufficient evidence'}</strong></div><div><span>Confidence</span><Badge tone={match.confidence === 'high' ? 'green' : match.confidence === 'medium' ? 'amber' : 'neutral'}>{match.confidence}</Badge></div></div><div className="assumption"><Icon name="spark" /><span><strong>Assumption:</strong> {match.assumptions}</span></div></article>)}</div></section>;
}

function BuyingCommittee({ account }) {
  return <section className="panel full-panel"><div className="section-title"><div><p className="eyebrow">BUYING COMMITTEE AGENT</p><h2>Ranked contacts</h2><p>Fictitious demo personas. Apollo will replace these records after credentials are connected.</p></div><Badge tone="amber">Synthetic history</Badge></div><div className="contact-list">{account.contacts?.map((contact, index) => <article className="contact-card" key={contact.id}><div className="contact-rank">#{index + 1}</div><div className="contact-avatar">{contact.name.split(' ').map((part) => part[0]).join('')}</div><div className="contact-info"><h3>{contact.name} {contact.demo && <span>DEMO</span>}</h3><p>{contact.title}</p><small>{contact.persona} · {contact.intendedEmail || 'No verified email'}</small></div><div className="contact-reason">{contact.reason}</div><div className="contact-score"><strong>{contact.score}</strong><span>potential</span></div><Badge tone={contact.state === 'active' ? 'green' : contact.state === 'queued' ? 'purple' : 'neutral'}>{contact.state}</Badge></article>)}</div></section>;
}

function Outreach({ account, onApprove, onActivate, onEvent }) {
  return <div className="outreach-layout"><section className="panel full-panel"><div className="section-title"><div><p className="eyebrow">SAFE OUTREACH</p><h2>Four-touch sequence</h2><p>Intended prospect is retained for context; delivery is forced to the configured test inbox.</p></div><Badge tone={account.sequenceStatus === 'active' ? 'green' : 'purple'}>{account.sequenceStatus}</Badge></div><div className="safety-banner"><span className="shield">✓</span><div><strong>External delivery blocked</strong><p>DEMO_MODE overrides every recipient with SAFE_TEST_EMAIL.</p></div></div><div className="sequence-list">{account.sequence?.map((message, index) => <article className="message" key={message.id}><div className="timeline"><span>{index + 1}</span>{index < account.sequence.length - 1 && <i />}</div><div className="message-card"><div className="message-meta"><Badge tone="neutral">Day {message.day}</Badge><span>{message.channel}</span><span>To: {account.contacts?.[0]?.intendedEmail || 'unavailable'}</span><Badge tone={message.status === 'draft' ? 'amber' : 'neutral'}>{message.status}</Badge></div><h3>{message.subject}</h3><p>{message.body}</p></div></article>)}</div><div className="approval-bar"><div><strong>Human approval gate</strong><span>Review claims, audience and CTA before activation.</span></div>{account.sequenceStatus === 'draft' && <button className="button primary" onClick={onApprove}><Icon name="check" />Approve sequence</button>}{account.sequenceStatus === 'approved' && <button className="button primary" onClick={onActivate}><Icon name="send" />Activate safe demo</button>}{account.sequenceStatus === 'active' && <Badge tone="green">Sequence active</Badge>}{account.sequenceStatus === 'paused' && <Badge tone="amber">Paused by stop rule</Badge>}</div></section><aside className="event-console panel"><h3>Event simulator</h3><p>Exercise the account-level controller without contacting a real prospect.</p><button onClick={() => onEvent('cta_click')}><Icon name="link" /><span><strong>CTA click</strong><small>Raises intent; does not stop</small></span></button><button onClick={() => onEvent('positive_reply')}><Icon name="send" /><span><strong>Positive reply</strong><small>Pauses the organization</small></span></button><button onClick={() => onEvent('meeting_booked')}><Icon name="clock" /><span><strong>Meeting booked</strong><small>Moves to booked stage</small></span></button><div className="event-log"><strong>Latest events</strong>{account.events?.length ? account.events.slice(-4).reverse().map((event) => <span key={event.at}>{event.type.replaceAll('_', ' ')}<small>{new Date(event.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small></span>) : <p>No events recorded.</p>}</div></aside></div>;
}

function AccountDetail({ account, onBack, onUpdate }) {
  const [tab, setTab] = useState('Overview');
  const update = async (patch) => onUpdate({ ...account, ...patch, updatedAt: new Date().toISOString() });
  const approve = async () => {
    if (backendConnected && account.sequenceId) {
      await api.approveSequence({ sequence_id: account.sequenceId, approved: true });
    }
    await update({ stage: 'approved', sequenceStatus: 'approved' });
  };
  const event = async (type) => {
    const next = applyEngagementEvent(account, type);
    onUpdate(next);
    if (backendConnected) await api.recordEvent({ account_id: account.id, event_type: type, idempotency_key: `${account.id}-${type}-${Date.now()}` });
  };
  return <div className="page detail-page"><button className="back" onClick={onBack}>← Account pipeline</button><section className="account-hero"><div className="company-logo large">{account.name.slice(0, 2).toUpperCase()}</div><div><div className="hero-title"><h1>{account.name}</h1><Badge tone={account.stage === 'draft_ready' ? 'purple' : account.stage === 'meeting_booked' ? 'green' : 'amber'}>{account.stage.replaceAll('_', ' ')}</Badge></div><p>{account.domain} · {account.parentCompany || 'Independent account'}</p></div><div className="hero-actions"><button className="button secondary" onClick={() => window.open(account.website || `https://${account.domain}`, '_blank', 'noopener,noreferrer')}><Icon name="external" />Open website</button><button className="button primary" onClick={() => setTab('Outreach')}>Review outreach</button></div></section><nav className="tabs">{tabs.map((item) => <button key={item} className={tab === item ? 'active' : ''} onClick={() => setTab(item)}>{item}{item === 'Ingredient match' && <span>{account.ingredientMatches?.length || 0}</span>}{item === 'Buying committee' && <span>{account.contacts?.length || 0}</span>}</button>)}</nav>{tab === 'Overview' && <Overview account={account} />}{tab === 'Evidence' && <Evidence account={account} />}{tab === 'Ingredient match' && <IngredientMatches account={account} />}{tab === 'Buying committee' && <BuyingCommittee account={account} />}{tab === 'Outreach' && <Outreach account={account} onApprove={approve} onActivate={() => update({ stage: 'active_outreach', sequenceStatus: 'active' })} onEvent={event} />}</div>;
}

function ResearchModal({ onClose, onCreated }) {
  const [form, setForm] = useState({ website: 'https://snapfresh.com.au', companyName: '', notes: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [step, setStep] = useState(0);
  const steps = ['Canonicalizing domain', 'Creating account record', 'Starting evidence workflow'];
  const submit = async (event) => {
    event.preventDefault(); setError('');
    try {
      const normalized = canonicalizeWebsite(form.website);
      setBusy(true);
      for (let index = 0; index < steps.length; index += 1) { setStep(index + 1); await new Promise((resolve) => setTimeout(resolve, 350)); }
      let created;
      if (backendConnected) {
        const result = await api.startResearch({ website_url: normalized.canonicalUrl, company_name: form.companyName || null, notes: form.notes || null });
        created = { ...buildDemoAccount({ ...form, website: normalized.canonicalUrl }), id: result.account_id, runId: result.run_id, stage: result.status };
      } else {
        created = buildDemoAccount({ ...form, website: normalized.canonicalUrl });
      }
      onCreated(created);
    } catch (reason) { setError(reason.message); setBusy(false); }
  };
  return <div className="modal-backdrop" onMouseDown={onClose}><div className="modal" onMouseDown={(event) => event.stopPropagation()}><button className="modal-close" onClick={onClose}>×</button><p className="eyebrow">NEW WORKFLOW RUN</p><h2>Research one account</h2><p>Each run keeps its own evidence, assumptions, contacts and outreach state.</p><form onSubmit={submit}><label>Company website<input value={form.website} onChange={(event) => setForm({ ...form, website: event.target.value })} placeholder="https://company.com" autoFocus /></label><label>Company name <span>optional</span><input value={form.companyName} onChange={(event) => setForm({ ...form, companyName: event.target.value })} placeholder="Resolved from the website when blank" /></label><label>Sales context <span>optional</span><textarea value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} placeholder="What should the research agent pay attention to?" /></label>{error && <div className="form-error">{error}</div>}{busy ? <div className="run-progress">{steps.map((item, index) => <div className={step > index ? 'done' : step === index ? 'current' : ''} key={item}><span>{step > index ? '✓' : index + 1}</span>{item}</div>)}</div> : <button className="button primary wide"><Icon name="spark" />Start account research</button>}</form><div className="modal-note"><span className="pulse" />Fixture mode returns the Snapfresh golden account. Connected mode invokes the protected Supabase Edge Function.</div></div></div>;
}

export default function App() {
  const [accounts, setAccounts] = useState(readAccounts);
  const [selectedId, setSelectedId] = useState(() => new URLSearchParams(window.location.hash.replace(/^#/, '')).get('account'));
  const [showNew, setShowNew] = useState(false);
  const selected = useMemo(() => accounts.find((account) => account.id === selectedId), [accounts, selectedId]);
  const persist = (next) => { setAccounts(next); saveAccounts(next); };
  const updateAccount = (updated) => persist(accounts.map((account) => account.id === updated.id ? updated : account));
  const createAccount = (created) => {
    const existing = accounts.findIndex((account) => account.domain === created.domain);
    let selected = created;
    const next = existing >= 0
      ? accounts.map((account, index) => {
        if (index !== existing) return account;
        selected = { ...account, ...created, id: account.id, researchRuns: [{ runId: created.runId, createdAt: created.updatedAt }, ...(account.researchRuns || [{ runId: account.runId, createdAt: account.updatedAt }])] };
        return selected;
      })
      : [{ ...created, researchRuns: [{ runId: created.runId, createdAt: created.updatedAt }] }, ...accounts];
    persist(next); setShowNew(false); setSelectedId(selected.id);
  };
  return <Shell onNew={() => setShowNew(true)}>{selected ? <AccountDetail account={selected} onBack={() => setSelectedId(null)} onUpdate={updateAccount} /> : <Pipeline accounts={accounts} onSelect={setSelectedId} onNew={() => setShowNew(true)} />}{showNew && <ResearchModal onClose={() => setShowNew(false)} onCreated={createAccount} />}</Shell>;
}
