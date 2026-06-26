const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.join(__dirname, "..");
const required = [
  "agents.md",
  "README.md",
  "Makefile",
  "server.js",
  "scripts/agent-reach-core.js",
  "scripts/agent-reach-cli.js",
  "public/index.html",
  "public/styles.css",
  "public/app.js"
];

let failed = false;
for (const rel of required) {
  const abs = path.join(root, rel);
  if (!fs.existsSync(abs)) {
    console.error(`Missing ${rel}`);
    failed = true;
  }
}

for (const rel of ["server.js", "scripts/agent-reach-core.js", "scripts/agent-reach-cli.js", "scripts/check.js", "scripts/package.js"]) {
  const abs = path.join(root, rel);
  if (!fs.existsSync(abs)) continue;
  new vm.Script(fs.readFileSync(abs, "utf8"), { filename: rel });
}

const html = fs.readFileSync(path.join(root, "public/index.html"), "utf8");
for (const token of ["app.js", "styles.css", "Agent Reach"]) {
  if (!html.includes(token)) {
    console.error(`HTML missing ${token}`);
    failed = true;
  }
}

if (failed) process.exit(1);
console.log("Static checks passed.");
