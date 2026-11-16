import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('../', import.meta.url)));
const port = Number(process.env.PORT ?? 8080);
const host = process.env.HOST ?? '127.0.0.1';

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

function safePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0]);
  const path = decoded === '/' ? '/index.html' : decoded;
  const full = resolve(join(root, normalize(path)));
  if (full !== root && !full.startsWith(root + sep)) return null;
  return full;
}

const server = createServer(async (request, response) => {
  const path = safePath(request.url ?? '/');
  if (!path) {
    response.writeHead(403, { 'content-type': 'text/plain; charset=utf-8' });
    response.end('403');
    return;
  }

  try {
    const info = await stat(path);
    if (!info.isFile()) throw new Error('not a file');
    const body = await readFile(path);
    response.writeHead(200, {
      'content-type': mime[extname(path).toLowerCase()] ?? 'application/octet-stream',
      'cache-control': 'no-store',
      'x-content-type-options': 'nosniff',
    });
    response.end(body);
  } catch {
    response.writeHead(404, { 'content-type': 'text/html; charset=utf-8' });
    response.end(`<!doctype html><meta charset="utf-8"><h1>404</h1><p>${path}</p>`);
  }
});

server.listen(port, host, () => {
  console.log(`\n  MASTERS OF THE UNIVERSE // 16 BIT`);
  console.log(`  http://${host}:${port}\n`);
});
