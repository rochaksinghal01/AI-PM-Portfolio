const ACCOUNT_WIDE_STOP_EVENTS = new Set([
  'positive_reply',
  'meeting_booked',
  'manual_engaged',
  'opportunity_created',
]);

export function canonicalizeWebsite(value) {
  const raw = String(value || '').trim();
  if (!raw) throw new Error('Website URL is required.');
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  const url = new URL(withProtocol);
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Only HTTP(S) websites are supported.');
  const hostname = url.hostname.toLowerCase().replace(/^www\./, '');
  if (!hostname.includes('.') || hostname === 'localhost') throw new Error('Enter a public company website.');
  return { canonicalUrl: `https://${hostname}`, domain: hostname };
}

export function scoreAccount(parts) {
  const clamp = (value, max) => Math.max(0, Math.min(max, Number(value) || 0));
  const productApplicability = clamp(parts.productApplicability, 40);
  const evidenceSpecificity = clamp(parts.evidenceSpecificity, 25);
  const scaleFit = clamp(parts.scaleFit, 20);
  const supplyFeasibility = clamp(parts.supplyFeasibility, 15);
  const riskPenalty = Math.max(-30, Math.min(0, Number(parts.riskPenalty) || 0));
  const total = Math.max(0, Math.min(100, productApplicability + evidenceSpecificity + scaleFit + supplyFeasibility + riskPenalty));
  return {
    productApplicability,
    evidenceSpecificity,
    scaleFit,
    supplyFeasibility,
    riskPenalty,
    total,
    tier: total >= 75 ? 'qualified' : total >= 55 ? 'review' : 'disqualified',
  };
}

export function estimateQuantity({ mealsAnnual, applicableShare, kgPerMeal, uncertainty = 0.25 }) {
  const inputs = [mealsAnnual, applicableShare, kgPerMeal].map(Number);
  if (inputs.some((value) => !Number.isFinite(value) || value <= 0)) {
    return { status: 'insufficient_evidence', low: null, base: null, high: null };
  }
  const annual = mealsAnnual * applicableShare * kgPerMeal;
  const period = (value) => ({
    weekly: Math.round(value / 52),
    monthly: Math.round(value / 12),
    annual: Math.round(value),
  });
  return {
    status: 'estimated',
    low: period(annual * (1 - uncertainty)),
    base: period(annual),
    high: period(annual * (1 + uncertainty)),
  };
}

export function applyEngagementEvent(account, eventType) {
  const next = JSON.parse(JSON.stringify(account));
  next.events = [...(next.events || []), { type: eventType, at: new Date().toISOString() }];

  if (eventType === 'cta_click') {
    next.intentScore = Math.min(100, (next.intentScore || 0) + 10);
    return next;
  }
  if (ACCOUNT_WIDE_STOP_EVENTS.has(eventType)) {
    next.stage = eventType === 'meeting_booked' ? 'meeting_booked' : eventType === 'opportunity_created' ? 'opportunity' : 'engaged';
    next.sequenceStatus = 'paused';
    next.contacts = next.contacts.map((contact) => ({
      ...contact,
      state: contact.state === 'replied' ? 'replied' : 'paused',
    }));
    return next;
  }
  if (eventType === 'unsubscribe' || eventType === 'hard_bounce') {
    next.stage = 'review';
    next.sequenceStatus = 'paused';
  }
  if (eventType === 'negative_org_reply') {
    next.stage = 'suppressed';
    next.sequenceStatus = 'stopped';
  }
  return next;
}

export function formatKg(value) {
  if (value == null) return 'Not enough evidence';
  return new Intl.NumberFormat('en-AU', { maximumFractionDigits: 0 }).format(value) + ' kg';
}
