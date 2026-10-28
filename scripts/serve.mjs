import { createServer } from 'node:http';
import { readFile, realpath } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, sep, extname } from 'node:path';

const root = await realpath(fileURLToPath(new URL('../', import.meta.url)));
const port = Number(process.env.PORT || 4173);
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT must be between 1 and 65535');
const publicFiles = new Set(['index.html', 'sobre-mi.html', 'styles.css', 'app.js', 'content.js', 'carousel-motion.js', 'page-effects.js']);
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.jpg': 'image/jpeg', '.pdf': 'application/pdf', '.otf': 'font/otf', '.ttf': 'font/ttf', '.png': 'image/png' };

const server = createServer(async (request, response) => {
  const send = (status, message) => {
    response.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end(request.method === 'HEAD' ? undefined : message);
  };
  if (!['GET', 'HEAD'].includes(request.method)) {
    response.setHeader('Allow', 'GET, HEAD');
    return send(405, 'Método no permitido');
  }
  let path;
  try { path = decodeURIComponent(new URL(request.url, 'http://localhost').pathname).slice(1) || 'index.html'; }
  catch { return send(400, 'Solicitud no válida'); }

  // Serve only presentation files. Never expose repository metadata or scripts.
  if (!publicFiles.has(path) && !/^assets\/[a-zA-Z0-9-]+\.(jpg|png|pdf|otf|ttf)$/.test(path)) return send(404, 'Archivo no encontrado');
  try {
    const target = await realpath(resolve(root, path));
    if (!target.startsWith(root + sep)) return send(404, 'Archivo no encontrado');
    const bytes = await readFile(target);
    response.writeHead(200, {
      'Content-Type': mime[extname(target)] || 'application/octet-stream',
      'Content-Length': bytes.length,
      'Cache-Control': 'no-cache',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    });
    response.end(request.method === 'HEAD' ? undefined : bytes);
  } catch { send(404, 'Archivo no encontrado'); }
});

server.on('error', error => {
  console.error(`No se pudo iniciar el servidor: ${error.message}`);
  process.exitCode = 1;
});
server.listen(port, '127.0.0.1', () => console.log(`Portfolio: http://localhost:${port}`));
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.close());
