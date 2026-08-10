import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const workflowDir = path.join(root, 'n8n-workflows');
const files = fs.readdirSync(workflowDir).filter((name) => name.endsWith('.json')).sort();
let failures = 0;

for (const file of files) {
  const fullPath = path.join(workflowDir, file);
  let workflow;
  try {
    workflow = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
  } catch (error) {
    console.error(`${file}: invalid JSON: ${error.message}`);
    failures += 1;
    continue;
  }

  const names = new Set(workflow.nodes.map((node) => node.name));
  const ids = new Set();
  for (const node of workflow.nodes) {
    if (ids.has(node.id)) {
      console.error(`${file}: duplicate node id ${node.id}`);
      failures += 1;
    }
    ids.add(node.id);
    if (node.parameters?.jsCode) {
      try {
        new Function(node.parameters.jsCode);
      } catch (error) {
        console.error(`${file}: ${node.name} has invalid JavaScript: ${error.message}`);
        failures += 1;
      }
    }
  }

  for (const [source, groups] of Object.entries(workflow.connections || {})) {
    if (!names.has(source)) {
      console.error(`${file}: connection source not found: ${source}`);
      failures += 1;
    }
    for (const outputs of Object.values(groups)) {
      for (const branch of outputs) {
        for (const connection of branch) {
          if (!names.has(connection.node)) {
            console.error(`${file}: connection target not found: ${connection.node}`);
            failures += 1;
          }
        }
      }
    }
  }

  const agents = workflow.nodes.filter((node) => node.type === '@n8n/n8n-nodes-langchain.agent').length;
  const evaluations = workflow.nodes.filter((node) => node.type === 'n8n-nodes-base.evaluation').length;
  console.log(`${file}: ${workflow.nodes.length} nodes, ${agents} agent(s), ${evaluations} evaluation node(s)`);
}

if (failures) {
  console.error(`Workflow validation failed with ${failures} issue(s).`);
  process.exit(1);
}
console.log(`Validated ${files.length} workflow exports.`);
