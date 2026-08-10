import test from 'node:test';
import assert from 'node:assert/strict';
import { applyEngagementEvent, canonicalizeWebsite, estimateQuantity, scoreAccount } from './engine.js';

test('canonicalizes company domains and strips paths', () => {
  assert.deepEqual(canonicalizeWebsite('www.snapfresh.com.au/menu?ref=demo'), {
    canonicalUrl: 'https://snapfresh.com.au',
    domain: 'snapfresh.com.au',
  });
});

test('scores account with explicit risk penalty', () => {
  const result = scoreAccount({
    productApplicability: 37,
    evidenceSpecificity: 22,
    scaleFit: 18,
    supplyFeasibility: 13,
    riskPenalty: -4,
  });
  assert.equal(result.total, 86);
  assert.equal(result.tier, 'qualified');
});

test('quantity output is a range and not a false point estimate', () => {
  const result = estimateQuantity({ mealsAnnual: 12_000_000, applicableShare: 0.18, kgPerMeal: 0.08 });
  assert.equal(result.base.annual, 172_800);
  assert.ok(result.low.annual < result.base.annual);
  assert.ok(result.high.annual > result.base.annual);
});

test('quantity calculation refuses missing evidence', () => {
  assert.equal(estimateQuantity({ mealsAnnual: null, applicableShare: 0.2, kgPerMeal: 0.1 }).status, 'insufficient_evidence');
});

test('click raises intent without stopping the sequence', () => {
  const account = { stage: 'active_outreach', sequenceStatus: 'active', intentScore: 20, contacts: [] };
  const next = applyEngagementEvent(account, 'cta_click');
  assert.equal(next.stage, 'active_outreach');
  assert.equal(next.sequenceStatus, 'active');
  assert.equal(next.intentScore, 30);
});

test('meeting booking pauses every active contact', () => {
  const account = { stage: 'active_outreach', sequenceStatus: 'active', contacts: [{ state: 'active' }, { state: 'queued' }] };
  const next = applyEngagementEvent(account, 'meeting_booked');
  assert.equal(next.stage, 'meeting_booked');
  assert.equal(next.sequenceStatus, 'paused');
  assert.deepEqual(next.contacts.map((contact) => contact.state), ['paused', 'paused']);
});
