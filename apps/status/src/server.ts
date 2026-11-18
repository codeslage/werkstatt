import { createServer, type IncomingMessage, type Server, type ServerResponse } from 'node:http';
import { checkHealth, type SeedQuery } from './health.ts';
import { createLogger, type Logger } from './log.ts';

export interface StatusDeps {
  version: string;
  query: SeedQuery;
  /** Ziel für Log-Zeilen; in der App die Standardausgabe. */
  log: (line: string) => void;
}

const escapeHtml = (text: string) => text.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);

function send(response: ServerResponse, status: number, type: string, body: string) {
  response.writeHead(status, { 'content-type': `${type}; charset=utf-8` });
  response.end(body);
}

function home(version: string) {
  return (
    `<!doctype html><html lang="de"><head><meta charset="utf-8"><title>codeslage status</title></head>` +
    `<body><h1>Hello codeslage</h1><p>Version ${escapeHtml(version)}</p></body></html>`
  );
}

async function route(request: IncomingMessage, response: ServerResponse, deps: StatusDeps, logger: Logger) {
  const path = new URL(request.url ?? '/', 'http://localhost').pathname;
  if (path !== '/' && path !== '/health') return send(response, 404, 'text/plain', 'Not found');
  if (request.method !== 'GET') return send(response, 405, 'text/plain', 'Method not allowed');
  if (path === '/') return send(response, 200, 'text/html', home(deps.version));

  const result = await checkHealth(deps.query, deps.version, (cause) =>
    logger('warn', 'DB-Prüfung fehlgeschlagen', { cause }),
  );
  send(response, result.httpStatus, 'application/json', JSON.stringify(result.body));
}

/** HTTP-Server der Test-App: GET / und GET /health (Plan 04-fundament, Datenmodell). */
export function createStatusServer(deps: StatusDeps): Server {
  const logger = createLogger(deps.log);
  return createServer((request, response) => {
    route(request, response, deps, logger)
      .catch((error: unknown) => {
        logger('error', 'Anfrage fehlgeschlagen', { cause: error instanceof Error ? error.message : String(error) });
        if (!response.headersSent) send(response, 500, 'text/plain', 'Internal error');
      })
      .finally(() => {
        const status = response.statusCode;
        logger(status >= 500 ? 'warn' : 'info', 'Anfrage', { method: request.method, path: request.url, status });
      });
  });
}
