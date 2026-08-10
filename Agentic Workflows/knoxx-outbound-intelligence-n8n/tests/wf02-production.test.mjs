import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const workflow = JSON.parse(fs.readFileSync(
  path.join(root, 'n8n-workflows', 'WF02-account-intelligence-fit.json'),
  'utf8',
));

const codeFor = (name) => workflow.nodes.find((node) => node.name === name).parameters.jsCode;
const runCode = (name, json, references = {}) => {
  const selectNode = (nodeName) => ({ item: { json: references[nodeName] } });
  return new Function('$json', '$', codeFor(name))(json, selectNode);
};

const productionInput = {
  run_id: '00000000-0000-4000-8000-000000000001',
  account_id: '00000000-0000-4000-8000-000000000002',
  website_url: 'https://example.com/',
  company_name: 'Example Foods',
  evaluation_mode: false,
};

test('captures an asynchronous Firecrawl job without losing account context', () => {
  const [item] = runCode('Capture Crawl Job', { id: 'crawl-123' }, {
    'Validate Production Input': productionInput,
  });
  assert.equal(item.json.run_id, productionInput.run_id);
  assert.equal(item.json.crawl_id, 'crawl-123');
  assert.equal(item.json.crawl_status_url, 'https://api.firecrawl.dev/v2/crawl/crawl-123');
  assert.equal(item.json.poll_attempt, 0);
});

test('keeps polling while Firecrawl is scraping and terminates on completion', () => {
  const pollingContext = {
    ...productionInput,
    crawl_id: 'crawl-123',
    crawl_status_url: 'https://api.firecrawl.dev/v2/crawl/crawl-123',
    poll_attempt: 0,
  };
  const [scraping] = runCode('Assess Crawl Status', { status: 'scraping', completed: 2, total: 5 }, {
    'Wait Before Crawl Poll': pollingContext,
  });
  assert.equal(scraping.json.poll_attempt, 1);
  assert.equal(scraping.json.crawl_complete, false);
  assert.equal(scraping.json.crawl_terminal_failure, false);

  const [completed] = runCode('Assess Crawl Status', {
    status: 'completed',
    completed: 5,
    total: 5,
    data: [{ markdown: '# Menu', metadata: { sourceURL: 'https://example.com/menu', title: 'Menu' } }],
  }, { 'Wait Before Crawl Poll': scraping.json });
  assert.equal(completed.json.poll_attempt, 2);
  assert.equal(completed.json.crawl_complete, true);
  assert.equal(completed.json.crawl_terminal_failure, false);
});

test('normalizes completed pages and preserves a recoverable partial failure', () => {
  const completedContext = {
    ...productionInput,
    crawl_id: 'crawl-123',
    crawl_status: 'completed',
    crawl_response: {
      status: 'completed',
      completed: 1,
      total: 1,
      data: [{ markdown: '# Menu', metadata: { sourceURL: 'https://example.com/menu', title: 'Menu' } }],
    },
  };
  const [normalized] = runCode('Normalize & Bound Evidence', completedContext, {
    'Validate Production Input': productionInput,
  });
  assert.equal(normalized.json.evidence.pages.length, 1);
  assert.equal(normalized.json.evidence.pages[0].source_key, 'src_1');
  assert.equal(normalized.json.evidence.crawl_partial, false);

  const [partial] = runCode('Normalize & Bound Evidence', {
    ...productionInput,
    crawl_status: 'failed',
    crawl_terminal_failure: true,
    crawl_error: 'provider unavailable',
    crawl_response: {},
  }, { 'Validate Production Input': productionInput });
  assert.equal(partial.json.evidence.pages.length, 0);
  assert.equal(partial.json.evidence.crawl_partial, true);
  assert.equal(partial.json.evidence.crawl_error, 'provider unavailable');
});
