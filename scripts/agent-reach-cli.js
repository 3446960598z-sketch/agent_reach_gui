#!/usr/bin/env node
const { listCapabilities, commandFor, runCapability } = require("./agent-reach-core");

const [, , action, id, ...rest] = process.argv;

function parseArgs(items) {
  const params = {};
  for (let i = 0; i < items.length; i += 1) {
    const key = items[i];
    if (!key.startsWith("--")) continue;
    params[key.slice(2)] = items[i + 1] || "";
    i += 1;
  }
  return params;
}

function help() {
  const groups = {};
  for (const cap of listCapabilities()) {
    groups[cap.category] ||= [];
    groups[cap.category].push(cap);
  }
  console.log("Agent Reach GUI command surface");
  console.log("");
  console.log("Usage:");
  console.log("  node scripts/agent-reach-cli.js run <capability-id> --query \"...\"");
  console.log("  node scripts/agent-reach-cli.js command <capability-id> --url \"...\"");
  console.log("");
  for (const [group, caps] of Object.entries(groups)) {
    console.log(group.toUpperCase());
    for (const cap of caps) {
      const params = cap.params.length ? ` (${cap.params.join(", ")})` : "";
      console.log(`  ${cap.id}${params} - ${cap.title}`);
    }
    console.log("");
  }
}

async function main() {
  if (!action || action === "help") {
    help();
    return;
  }
  if (!id) throw new Error("Missing capability id");
  const params = parseArgs(rest);
  if (action === "command") {
    console.log(commandFor(id, params).display);
    return;
  }
  if (action === "run") {
    const result = await runCapability(id, params);
    console.log(result.command);
    if (result.stdout) process.stdout.write(result.stdout);
    if (result.stderr) process.stderr.write(result.stderr);
    process.exitCode = result.ok ? 0 : 1;
    return;
  }
  throw new Error(`Unknown action: ${action}`);
}

main().catch(error => {
  console.error(error.message);
  process.exit(1);
});
