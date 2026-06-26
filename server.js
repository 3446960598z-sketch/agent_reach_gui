const http = require("http");
const fs = require("fs");
const path = require("path");
const { runCapability, listCapabilities } = require("./scripts/agent-reach-core");

const root = __dirname;
const publicDir = path.join(root, "public");
const port = Number(process.env.PORT || 4173);

const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8"
};

function send(res, status, body, type = "application/json; charset=utf-8") {
  res.writeHead(status, {
    "Content-Type": type,
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff"
  });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", chunk => {
      data += chunk;
      if (data.length > 1_000_000) {
        reject(new Error("Request body too large"));
        req.destroy();
      }
    });
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);

    if (url.pathname === "/api/capabilities" && req.method === "GET") {
      send(res, 200, JSON.stringify({ capabilities: listCapabilities() }, null, 2));
      return;
    }

    if (url.pathname === "/api/run" && req.method === "POST") {
      const payload = JSON.parse(await readBody(req) || "{}");
      const result = await runCapability(payload.id, payload.params || {}, { timeoutMs: 120000 });
      send(res, result.ok ? 200 : 500, JSON.stringify(result, null, 2));
      return;
    }

    const requested = url.pathname === "/" ? "/index.html" : url.pathname;
    const filePath = path.normalize(path.join(publicDir, requested));
    if (!filePath.startsWith(publicDir)) {
      send(res, 403, "Forbidden", "text/plain; charset=utf-8");
      return;
    }

    fs.readFile(filePath, (err, data) => {
      if (err) {
        send(res, 404, "Not found", "text/plain; charset=utf-8");
        return;
      }
      send(res, 200, data, mime[path.extname(filePath)] || "application/octet-stream");
    });
  } catch (error) {
    send(res, 500, JSON.stringify({ ok: false, error: error.message }, null, 2));
  }
});

server.listen(port, () => {
  console.log(`Agent Reach GUI listening at http://localhost:${port}`);
});
