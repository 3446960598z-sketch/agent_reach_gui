const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const root = path.join(__dirname, "..");
const outDir = path.join(root, "dist");
const outFile = path.join(outDir, "agent-reach-gui.tar.gz");
const include = [
  "agents.md",
  ".gitignore",
  "README.md",
  "Makefile",
  "package.json",
  "server.js",
  "scripts/agent-reach-core.js",
  "scripts/agent-reach-cli.js",
  "scripts/check.js",
  "scripts/package.js",
  "public/index.html",
  "public/styles.css",
  "public/app.js"
];

fs.mkdirSync(outDir, { recursive: true });

const chunks = [];
for (const rel of include) {
  addFile(chunks, rel, fs.readFileSync(path.join(root, rel)));
}
chunks.push(Buffer.alloc(1024));

fs.writeFileSync(outFile, zlib.gzipSync(Buffer.concat(chunks)));
console.log(outFile);

function addFile(chunks, name, data) {
  const header = Buffer.alloc(512);
  write(header, 0, name, 100);
  write(header, 100, "0000644", 8);
  write(header, 108, "0000000", 8);
  write(header, 116, "0000000", 8);
  write(header, 124, oct(data.length, 11), 12);
  write(header, 136, oct(Math.floor(Date.now() / 1000), 11), 12);
  header.fill(" ", 148, 156);
  header[156] = "0".charCodeAt(0);
  write(header, 257, "ustar", 6);
  write(header, 263, "00", 2);
  const checksum = [...header].reduce((sum, value) => sum + value, 0);
  write(header, 148, oct(checksum, 6), 8);
  chunks.push(header, data);
  const padding = (512 - (data.length % 512)) % 512;
  if (padding) chunks.push(Buffer.alloc(padding));
}

function write(buffer, offset, value, length) {
  buffer.write(String(value).slice(0, length), offset, length, "ascii");
}

function oct(value, width) {
  return value.toString(8).padStart(width, "0") + "\0";
}
