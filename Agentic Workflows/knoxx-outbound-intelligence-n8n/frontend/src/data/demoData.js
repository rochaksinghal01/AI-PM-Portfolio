import { estimateQuantity, scoreAccount } from '../lib/engine.js';

const snapfreshScore = scoreAccount({
  productApplicability: 37,
  evidenceSpecificity: 22,
  scaleFit: 18,
  supplyFeasibility: 13,
  riskPenalty: -4,
});

const tomatoForecast = estimateQuantity({ mealsAnnual: 12_000_000, applicableShare: 0.18, kgPerMeal: 0.08 });
const riceForecast = estimateQuantity({ mealsAnnual: 12_000_000, applicableShare: 0.14, kgPerMeal: 0.16 });
const onionForecast = estimateQuantity({ mealsAnnual: 12_000_000, applicableShare: 0.28, kgPerMeal: 0.018 });

export const demoAccounts = [
  {
    id: 'acc_snapfresh',
    runId: 'run_20260807_snapfresh',
    name: 'Snapfresh',
    domain: 'snapfresh.com.au',
    website: 'https://snapfresh.com.au',
    parentCompany: 'dnata catering Australia',
    lifecycle: 'new',
    category: 'ready_meals',
    stage: 'draft_ready',
    sequenceStatus: 'draft',
    intentScore: 34,
    updatedAt: '2026-08-07T10:25:00+10:00',
    score: snapfreshScore,
    summary: 'Large Australian prepared-meals manufacturer with public recipe evidence and strong applicability across tomato, rice, dehydrated vegetable and seasoning categories.',
    serviceFit: {
      status: 'review',
      explanation: 'Australian manufacturing footprint is evidenced. Knoxx service coverage is synthetic and must be validated by sales before production outreach.',
    },
    scaleSignals: [
      { value: '12M', label: 'meals produced annually', sourceId: 'src_1', evidenceType: 'observed' },
      { value: '20M', label: 'stated annual capacity', sourceId: 'src_1', evidenceType: 'observed' },
      { value: 'Australia', label: 'operating market', sourceId: 'src_2', evidenceType: 'observed' },
    ],
    dishes: [
      { name: 'Mild beef curry with jasmine rice', ingredients: ['beef', 'jasmine rice', 'tomato pulp', 'onion', 'garlic', 'thickener'], sourceId: 'src_3' },
      { name: 'Chicken penne napolitana', ingredients: ['chicken', 'penne pasta', 'tomato', 'onion', 'garlic', 'herbs'], sourceId: 'src_3' },
      { name: 'Lamb kofta with tomato rice', ingredients: ['lamb', 'rice', 'tomato', 'onion', 'spices'], sourceId: 'src_3' },
    ],
    findings: [
      { label: 'Supply consistency', type: 'inferred', text: 'High meal volumes make ingredient availability and batch consistency commercially important.', sourceIds: ['src_1', 'src_3'] },
      { label: 'Preparation efficiency', type: 'hypothesis', text: 'Pre-processed tomatoes and dehydrated aromatics may reduce kitchen preparation time and waste.', sourceIds: ['src_3'] },
      { label: 'Cost predictability', type: 'hypothesis', text: 'Bulk formats could improve cost predictability for frequently repeated meal components.', sourceIds: ['src_1', 'src_3'] },
    ],
    sources: [
      { id: 'src_1', title: 'Snapfresh — Our capabilities', url: 'https://snapfresh.com.au/about-us/', retrievedAt: '2026-08-07', excerpt: 'Public company material states 12 million meals annually and capacity for 20 million.' },
      { id: 'src_2', title: 'Snapfresh — Locations and sectors', url: 'https://snapfresh.com.au/', retrievedAt: '2026-08-07', excerpt: 'The company describes an Australian prepared-meals manufacturing operation.' },
      { id: 'src_3', title: 'Public product catalogue PDF', url: 'https://snapfresh.com.au/', retrievedAt: '2026-08-07', excerpt: 'Catalogue recipes include jasmine rice, tomato pulp, onion, garlic, pasta and seasonings.' },
    ],
    ingredientMatches: [
      { id: 'm1', ingredient: 'Tomato pulp / tomato base', knoxxProduct: 'Processed tomato pulp, 20 kg aseptic', category: 'Processed tomatoes', match: 94, confidence: 'high', forecast: tomatoForecast, assumptions: '18% of meals; 80 g tomato input per applicable meal.', sourceIds: ['src_1', 'src_3'] },
      { id: 'm2', ingredient: 'Jasmine and long-grain rice', knoxxProduct: 'Bulk food-service rice, 25 kg', category: 'Rice', match: 91, confidence: 'medium', forecast: riceForecast, assumptions: '14% of meals; 160 g uncooked/cooked-equivalent planning factor.', sourceIds: ['src_1', 'src_3'] },
      { id: 'm3', ingredient: 'Onion and garlic', knoxxProduct: 'Dehydrated onion and garlic blend, 10 kg', category: 'Dehydrated vegetables', match: 86, confidence: 'medium', forecast: onionForecast, assumptions: '28% of meals; 18 g fresh-equivalent aromatics per applicable meal.', sourceIds: ['src_1', 'src_3'] },
      { id: 'm4', ingredient: 'Penne pasta', knoxxProduct: 'Italian penne rigate, 10 kg', category: 'Italian pasta', match: 82, confidence: 'low', forecast: { status: 'insufficient_evidence', low: null, base: null, high: null }, assumptions: 'Menu evidence exists, but production share is unavailable.', sourceIds: ['src_3'] },
    ],
    contacts: [
      { id: 'c1', name: 'Alex Morgan', title: 'Head of Procurement', persona: 'Economic buyer', score: 91, state: 'active', emailStatus: 'verified', intendedEmail: 'a•••@snapfresh.com.au', reason: 'Owns supplier evaluation and commercial negotiations; strongest fit for cost and resilience messaging.', demo: true },
      { id: 'c2', name: 'Priya Shah', title: 'Director, Product Development', persona: 'Technical champion', score: 86, state: 'queued', emailStatus: 'verified', intendedEmail: 'p•••@snapfresh.com.au', reason: 'Likely influence over recipe specifications, substitutions and new product development.', demo: true },
      { id: 'c3', name: 'Jordan Lee', title: 'General Manager, Operations', persona: 'Operational approver', score: 78, state: 'shortlisted', emailStatus: 'unverified', intendedEmail: null, reason: 'Relevant to preparation efficiency, throughput and supplier reliability.', demo: true },
      { id: 'c4', name: 'Sam Taylor', title: 'Supply Chain Manager', persona: 'Champion', score: 76, state: 'shortlisted', emailStatus: 'verified', intendedEmail: 's•••@snapfresh.com.au', reason: 'Day-to-day owner of continuity and lead-time risk.', demo: true },
      { id: 'c5', name: 'Casey Nguyen', title: 'Executive Chef, Manufacturing', persona: 'Technical evaluator', score: 69, state: 'shortlisted', emailStatus: 'unavailable', intendedEmail: null, reason: 'Can validate ingredient functionality, consistency and kitchen impact.', demo: true },
    ],
    sequence: [
      { id: 'msg_1', day: 0, channel: 'email', status: 'draft', subject: 'A supply idea for Snapfresh’s high-volume meal lines', body: 'Hi Alex,\n\nSnapfresh’s public catalogue shows recurring use of tomato bases, rice, onion and garlic across several prepared meals. With the scale you publish, consistency and prep efficiency may matter as much as unit cost.\n\nKnoxx supplies these ingredients in bulk food-manufacturing formats. Would a 20-minute comparison of specifications, lead times and indicative volume bands be useful?\n\nBook a short review: {{tracked_meeting_link}}\n\nRegards,\nKnoxx Foods\n\nTo stop these messages, reply unsubscribe.' },
      { id: 'msg_2', day: 3, channel: 'email', status: 'scheduled', subject: 'Tomato, rice and aromatics — one supplier review', body: 'Hi Alex,\n\nFollowing up with the practical angle: our initial evidence-backed model found the strongest overlap in processed tomatoes, rice and dehydrated aromatics. The estimates are ranges, not purchase claims, and we can validate them against your actual specifications.\n\nWould next week suit a short supplier-fit review?\n\n{{tracked_meeting_link}}' },
      { id: 'msg_3', day: 7, channel: 'email', status: 'scheduled', subject: 'Reducing prep and supply variability', body: 'Hi Alex,\n\nIf reducing prep steps or supply variability is on the roadmap, dehydrated onion/garlic and consistent tomato formats may be worth benchmarking on one meal line first.\n\nHappy to share the assumptions behind the match and adjust them with your team.' },
      { id: 'msg_4', day: 12, channel: 'email', status: 'scheduled', subject: 'Close the loop?', body: 'Hi Alex,\n\nI’ll close the loop after this note. If a bulk-ingredient comparison becomes useful, I can share the match by product category and the exact evidence behind it.\n\n{{tracked_meeting_link}}' },
    ],
    events: [],
  },
  {
    id: 'acc_kfc', runId: 'run_kfc', name: 'Kitchen Food Company', domain: 'kitchenfoodcompany.com', stage: 'review', category: 'ready_meals', updatedAt: '2026-08-06T15:20:00+10:00', score: { total: 68, tier: 'review' }, summary: 'Strong scale signals, but limited public recipe detail lowers quantity confidence.', contacts: [], events: []
  },
  {
    id: 'acc_legg', runId: 'run_legg', name: "Leggo’s", domain: 'leggos.com.au', parentCompany: 'Simplot Australia', stage: 'review', category: 'sauces_condiments', updatedAt: '2026-08-05T12:10:00+10:00', score: { total: 61, tier: 'review' }, summary: 'High product overlap offset by parent-company vertical integration risk.', contacts: [], events: []
  },
];

export function buildDemoAccount({ website, companyName, notes }) {
  const domain = new URL(website).hostname.replace(/^www\./, '');
  if (domain === 'snapfresh.com.au') return JSON.parse(JSON.stringify(demoAccounts[0]));
  return {
    ...JSON.parse(JSON.stringify(demoAccounts[1])),
    id: `acc_${Date.now()}`,
    runId: `run_${Date.now()}`,
    name: companyName || domain.split('.')[0].replace(/(^|\s)\S/g, (letter) => letter.toUpperCase()),
    domain,
    website,
    stage: 'researching',
    updatedAt: new Date().toISOString(),
    summary: notes || 'Research run created. External providers are not connected in local demo mode.',
  };
}
