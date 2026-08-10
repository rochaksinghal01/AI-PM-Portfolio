import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (...parts) => fs.readFileSync(path.join(root, ...parts), 'utf8');

const migration = read('supabase', 'migrations', '001_initial_schema.sql');
const startResearch = read('supabase', 'functions', 'start-account-research', 'index.ts');
const approve = read('supabase', 'functions', 'approve-sequence', 'index.ts');
const events = read('supabase', 'functions', 'outreach-event', 'index.ts');
const track = read('supabase', 'functions', 'track', 'index.ts');
const trackingLink = read('supabase', 'functions', 'tracking-link', 'index.ts');
const engagementWorkflow = read('n8n-workflows', 'WF06-engagement-controller.json');

test('every exposed table has RLS enabled', () => {
  const tables = [...migration.matchAll(/create table if not exists (\w+)/g)].map((match) => match[1]);
  for (const table of tables) assert.match(migration, new RegExp(`alter table ${table} enable row level security`), `${table} lacks RLS`);
});

test('pipeline view uses caller RLS instead of definer privileges', () => {
  assert.match(migration, /account_pipeline_public\s+with \(security_invoker = true\)/);
});

test('privileged intent function is service-role only', () => {
  assert.match(migration, /revoke all on function increment_account_intent\(uuid, integer\) from public, anon, authenticated/);
  assert.match(migration, /grant execute on function increment_account_intent\(uuid, integer\) to service_role/);
});

test('account reuse and sequence approval verify ownership', () => {
  assert.match(startResearch, /existing\.owner_id !== user\.id/);
  assert.match(startResearch, /aliasedAccount\?\.owner_id !== user\.id/);
  assert.match(approve, /ownerId !== user\.id/);
});

test('n8n and Edge Function agree on the internal event header', () => {
  assert.match(events, /X-Outreach-Secret/);
  assert.match(engagementWorkflow, /X-Outreach-Secret/);
});

test('event application is idempotent and click intent increments only after insert', () => {
  assert.match(events, /onConflict: ["']idempotency_key["'], ignoreDuplicates: true/);
  assert.match(events, /if \(!inserted\) return json\(\{ status: ["']duplicate_ignored["'] \}\)/);
  assert.match(track, /if \(inserted\)\s*\{\s*await db\.rpc\(["']increment_account_intent["']/);
});

test('tracked meeting links are HMAC signed and verified before logging', () => {
  assert.match(trackingLink, /crypto\.subtle\.sign\(\s*["']HMAC["']/);
  assert.match(trackingLink, /TRACKING_SIGNING_SECRET/);
  assert.match(track, /crypto\.subtle\.verify\(\s*["']HMAC["']/);
  assert.match(track, /!signature/);
});

test('account and contact stop rules remain deterministic', () => {
  for (const event of ['positive_reply', 'meeting_booked', 'manual_engaged', 'opportunity_created']) assert.match(events, new RegExp(event));
  assert.match(events, /negative_org_reply/);
  assert.match(events, /out_of_office/);
  assert.match(events, /paused_until/);
});

test('manual browser events require authenticated ownership and cannot impersonate providers', () => {
  assert.match(events, /event\.provider !== ["']manual_demo["']/);
  assert.match(events, /account\?\.owner_id !== authenticatedUserId/);
});
