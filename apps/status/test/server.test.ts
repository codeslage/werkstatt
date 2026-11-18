import type { AddressInfo } from 'node:net';
import { afterEach, describe, expect, it } from 'vitest';
import { createStatusServer } from '../src/server.ts';

// Plan 04-fundament: GET / (HTML mit Version), GET /health (JSON), Logs strukturiert ohne Secrets.

const VERSION = 'abc1234';
const servers: { close: () => void }[] = [];

async function start(query: () => Promise<unknown[]>) {
  const lines: string[] = [];
  const server = createStatusServer({ version: VERSION, query, log: (line) => lines.push(line) });
  servers.push(server);
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address() as AddressInfo;
  return { base: `http://127.0.0.1:${port}`, lines };
}

afterEach(() => {
  for (const server of servers.splice(0)) server.close();
});

describe('apps/status', () => {
  it('GET / liefert HTML mit Version', async () => {
    const { base } = await start(async () => [{ message: 'Hello codeslage' }]);
    const response = await fetch(`${base}/`);
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toMatch(/^text\/html/);
    const html = await response.text();
    expect(html).toContain('Hello codeslage');
    expect(html).toContain(VERSION);
  });

  it('GET /health liefert 200 als JSON', async () => {
    const { base } = await start(async () => [{ message: 'Hello codeslage' }]);
    const response = await fetch(`${base}/health`);
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toMatch(/^application\/json/);
    expect(await response.json()).toEqual({ status: 'ok', version: VERSION, db: 'ok' });
  });

  it('GET /health liefert 503, wenn die DB fehlt', async () => {
    const { base } = await start(async () => {
      throw new Error('connect ECONNREFUSED');
    });
    const response = await fetch(`${base}/health`);
    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ status: 'error', db: 'unreachable' });
  });

  it('unbekannte Pfade und Methoden: 404 bzw. 405', async () => {
    const { base } = await start(async () => []);
    expect((await fetch(`${base}/gibt-es-nicht`)).status).toBe(404);
    expect((await fetch(`${base}/health`, { method: 'POST' })).status).toBe(405);
  });

  it('protokolliert jede Anfrage als JSON-Zeile, Fehlergrund inklusive', async () => {
    const { base, lines } = await start(async () => {
      throw new Error('connect ECONNREFUSED');
    });
    await fetch(`${base}/health`);
    const entries = lines.map((line) => JSON.parse(line) as Record<string, unknown>);
    expect(entries).toContainEqual(expect.objectContaining({ level: 'warn', path: '/health', status: 503 }));
    expect(entries.every((entry) => typeof entry.time === 'string' && typeof entry.msg === 'string')).toBe(true);
  });
});
