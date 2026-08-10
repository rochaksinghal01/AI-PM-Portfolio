import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const workflowDir = path.join(root, 'n8n-workflows');
const load = (name) => JSON.parse(fs.readFileSync(path.join(workflowDir, name), 'utf8'));
const workflows = {
  intake: load('WF01-account-intake-orchestrator.json'),
  research: load('WF02-account-intelligence-fit.json'),
  committee: load('WF04-buying-committee.json'),
  outreach: load('WF05-outreach-strategy-safe-send.json'),
  engagement: load('WF06-engagement-controller.json'),
};

const node = (workflow, name) => workflow.nodes.find((candidate) => candidate.name === name);

test('all workflow exports remain inactive until credentials and evaluations are complete', () => {
  for (const workflow of Object.values(workflows)) assert.equal(workflow.active, false);
});

test('research, committee and outreach use bounded AI agents with output parsers', () => {
  for (const workflow of [workflows.research, workflows.committee, workflows.outreach]) {
    assert.ok(workflow.nodes.some((item) => item.type === '@n8n/n8n-nodes-langchain.agent'));
    assert.ok(workflow.nodes.some((item) => item.type === '@n8n/n8n-nodes-langchain.outputParserStructured'));
    assert.ok(workflow.nodes.some((item) => item.type === 'n8n-nodes-base.evaluationTrigger'));
    assert.ok(workflow.nodes.some((item) => item.type === 'n8n-nodes-base.evaluation'));
  }
});

test('every embedded manual JSON schema is valid JSON', () => {
  for (const workflow of Object.values(workflows)) {
    for (const item of workflow.nodes) {
      if (typeof item.parameters?.inputSchema === 'string') {
        assert.doesNotThrow(
          () => JSON.parse(item.parameters.inputSchema),
          `${workflow.name}: invalid schema in ${item.name}`,
        );
      }
    }
  }
});

test('model routing matches the documented defaults', () => {
  assert.equal(node(workflows.research, 'GPT 5.6 Terra Research Model').parameters.model.value, 'gpt-5.6-terra');
  assert.equal(node(workflows.committee, 'GPT 5.6 Terra Committee Model').parameters.model.value, 'gpt-5.6-terra');
  assert.equal(node(workflows.outreach, 'GPT 5.6 Luna Outreach Model').parameters.model.value, 'gpt-5.6-luna');
  assert.equal(node(workflows.engagement, 'GPT 5.6 Luna Classifier Model').parameters.model.value, 'gpt-5.6-luna');
});

test('Gemini is an independent judge on every nondeterministic decision workflow', () => {
  for (const workflow of [workflows.research, workflows.committee, workflows.outreach, workflows.engagement]) {
    const judge = workflow.nodes.find((item) => item.name === 'Gemini 3.6 Independent Judge');
    assert.equal(judge.parameters.modelName, 'models/gemini-3.6-flash');
  }
});

test('Gmail cannot send until the explicitly reviewed node is enabled', () => {
  const gmail = node(workflows.outreach, 'Gmail Safe Send');
  assert.equal(gmail.disabled, true);
  const safetyCode = node(workflows.outreach, 'Hard Demo Safety Gate').parameters.jsCode;
  assert.match(safetyCode, /DEMO_MODE/);
  assert.match(safetyCode, /SAFE_TEST_EMAIL/);
  const overrideCode = node(workflows.outreach, 'Override Recipient & CTA').parameters.jsCode;
  assert.match(overrideCode, /delivered_recipient:\$vars\.SAFE_TEST_EMAIL/);
  assert.match(overrideCode, /body_html/);
  assert.match(overrideCode, /escapeHtml/);
  assert.equal(gmail.parameters.message, '={{ $json.body_html }}');
  const recordQuery = node(workflows.outreach, 'Record Safe Send').parameters.query;
  assert.match(recordQuery, /gmail_message_id is not null/);
  assert.match(recordQuery, /delivery_not_confirmed/);
});

test('approval query excludes suppressed and paused contacts immediately before send', () => {
  const loader = node(workflows.outreach, 'Load Eligible Approved Messages');
  const query = loader.parameters.query.toLowerCase();
  assert.match(query, /suppression_entries/);
  assert.match(query, /opted_out/);
  assert.match(query, /paused/);
  assert.match(query, /touch_number=1/);
  assert.match(loader.parameters.options.queryReplacement, /DEMO_FIRST_TOUCH_ONLY/);
});

test('draft persistence carries the intended recipient into message inserts', () => {
  const query = node(workflows.outreach, 'Persist Draft Sequence').parameters.query.toLowerCase();
  assert.match(query, /select id,work_email from contacts/);
  assert.match(query, /c\.work_email/);
});

test('disqualified accounts stop before Apollo enrichment', () => {
  const validateTargets = workflows.committee.connections['Validate Research Result'].main[0];
  assert.deepEqual(validateTargets.map((connection) => connection.node), ['Eligible for Committee?']);
  const gate = workflows.committee.connections['Eligible for Committee?'].main;
  assert.equal(gate[0][0].node, 'Apollo People Search');
  assert.equal(gate[1][0].node, 'Return Ineligible Account');
});

test('Apollo search uses the current bounded organization-domain filter', () => {
  const body = node(workflows.committee, 'Apollo People Search').parameters.body;
  assert.match(body, /q_organization_domains_list/);
  assert.match(body, /per_page:12/);
});

test('Apollo demo enrichment is capped at two people without phone or personal email', () => {
  const body = node(workflows.committee, 'Apollo Enrich Top Candidates').parameters.body;
  assert.match(body, /enrichment_details\.slice\(0,2\)/);
  assert.match(body, /reveal_personal_emails:false/);
  assert.match(body, /reveal_phone_number:false/);
});

test('frontend intake acknowledges immediately while research continues asynchronously', () => {
  assert.equal(node(workflows.intake, 'Account Research Webhook').parameters.responseMode, 'onReceived');
  assert.equal(node(workflows.research, 'Production Webhook').parameters.responseMode, 'onReceived');
});

test('WF01 accepts a raw domain or full URL and canonicalizes both safely', () => {
  const code = node(workflows.intake, 'Validate & Canonicalize').parameters.jsCode;
  assert.doesNotMatch(code, /new URL\(/);
  const execute = new Function('$json', '$vars', code);
  const base = {
    run_id: '00000000-0000-4000-8000-000000000001',
    account_id: '00000000-0000-4000-8000-000000000002',
  };
  const vars = { N8N_WEBHOOK_SECRET: 'test-secret' };
  const headers = { 'x-workflow-secret': 'test-secret' };

  const [rawDomain] = execute({ headers, body: { ...base, website_url: 'snapfresh.com.au' } }, vars);
  assert.equal(rawDomain.json.domain, 'snapfresh.com.au');
  assert.equal(rawDomain.json.website_url, 'https://snapfresh.com.au/');

  const [trackedUrl] = execute({
    headers,
    body: { ...base, website_url: '  “https://www.snapfresh.com.au/menu?utm_source=test&menu=1”  ' },
  }, vars);
  assert.equal(trackedUrl.json.domain, 'snapfresh.com.au');
  assert.equal(trackedUrl.json.website_url, 'https://snapfresh.com.au/menu?menu=1');

  assert.throws(
    () => execute({ headers, body: { ...base, website_url: 'ftp://snapfresh.com.au' } }, vars),
    /Unsupported URL scheme/,
  );
});

test('WF01 does not depend on paired-item metadata after its Postgres node', () => {
  const handoffBody = node(workflows.intake, 'Start Evidence & Fit').parameters.body;
  const returnCode = node(workflows.intake, 'Return Intake Status').parameters.jsCode;
  assert.match(handoffBody, /Validate & Canonicalize'\)\.first\(\)\.json/);
  assert.match(returnCode, /Validate & Canonicalize'\)\.first\(\)\.json/);
  assert.doesNotMatch(handoffBody, /Validate & Canonicalize'\)\.item/);
  assert.doesNotMatch(returnCode, /Validate & Canonicalize'\)\.item/);
});

test('production research polls asynchronous Firecrawl jobs before normalization', () => {
  const startTargets = workflows.research.connections['Firecrawl Website & PDFs'].main[0];
  assert.deepEqual(startTargets.map((connection) => connection.node), ['Capture Crawl Job']);
  assert.match(node(workflows.research, 'Get Crawl Status').parameters.url, /crawl_status_url/);

  const completionBranches = workflows.research.connections['Crawl Complete?'].main;
  assert.equal(completionBranches[0][0].node, 'Normalize & Bound Evidence');
  assert.equal(completionBranches[1][0].node, 'Crawl Failed or Timed Out?');

  const terminalBranches = workflows.research.connections['Crawl Failed or Timed Out?'].main;
  assert.equal(terminalBranches[0][0].node, 'Normalize & Bound Evidence');
  assert.equal(terminalBranches[1][0].node, 'Wait Before Crawl Poll');

  const normalization = node(workflows.research, 'Normalize & Bound Evidence').parameters.jsCode;
  assert.match(normalization, /crawl_response/);
  assert.match(normalization, /crawl_partial/);
});

test('research evaluation metrics reference the pre-judge deterministic result', () => {
  const metrics = node(workflows.research, 'Deterministic Research Metrics').parameters.metrics.assignments;
  for (const metric of metrics) assert.match(metric.value, /Deterministic Guardrail Score & Forecast/);
});

test('committee and outreach evaluation metrics reference their pre-judge deterministic results', () => {
  const committeeMetrics = node(workflows.committee, 'Deterministic Committee Metrics').parameters.metrics.assignments;
  for (const metric of committeeMetrics) assert.match(metric.value, /Deterministic Contact Rerank/);

  const outreachMetrics = node(workflows.outreach, 'Deterministic Outreach Metrics').parameters.metrics.assignments;
  for (const metric of outreachMetrics) assert.match(metric.value, /Outreach Safety Guardrail/);
  assert.doesNotMatch(
    outreachMetrics.find((metric) => metric.name === 'cta_coverage').value,
    /\{\{TRACKED_MEETING_LINK\}\}/,
  );
});

test('reply evaluation metrics reference the pre-judge classifier guardrail', () => {
  const replyMetrics = node(workflows.engagement, 'Deterministic Reply Metrics').parameters.metrics.assignments;
  for (const metric of replyMetrics) assert.match(metric.value, /Classifier Confidence Guardrail/);
});

test('missing crawl evidence cannot be treated as a valid qualified account', () => {
  const guardrail = node(workflows.research, 'Deterministic Guardrail Score & Forecast').parameters.jsCode;
  assert.match(guardrail, /No research evidence pages were available/);
  assert.match(guardrail, /product_applicability:0/);
  assert.match(guardrail, /risk_penalty:-30/);
});

test('reply classification is a bounded chain rather than an unnecessary agent', () => {
  assert.equal(node(workflows.engagement, 'Reply Classification Chain').type, '@n8n/n8n-nodes-langchain.chainLlm');
  assert.equal(workflows.engagement.nodes.filter((item) => item.type === '@n8n/n8n-nodes-langchain.agent').length, 0);
  assert.match(node(workflows.engagement, 'Classifier Confidence Guardrail').parameters.jsCode, /confidence>=0\.8/);
  const extractor = node(workflows.engagement, 'Extract Bounded Reply').parameters.jsCode;
  assert.match(extractor, /\$json\.From/);
  assert.match(extractor, /12000/);
});

test('credentials and real addresses are not embedded in exports', () => {
  const text = JSON.stringify(workflows);
  assert.doesNotMatch(text, /sk-[A-Za-z0-9]/);
  assert.doesNotMatch(text, /@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/);
});

test('every connection points to an existing node', () => {
  for (const workflow of Object.values(workflows)) {
    const names = new Set(workflow.nodes.map((item) => item.name));
    for (const [source, groups] of Object.entries(workflow.connections)) {
      assert.ok(names.has(source), `${workflow.name}: missing source ${source}`);
      for (const outputs of Object.values(groups)) {
        for (const branch of outputs) {
          for (const connection of branch) assert.ok(names.has(connection.node), `${workflow.name}: missing target ${connection.node}`);
        }
      }
    }
  }
});
