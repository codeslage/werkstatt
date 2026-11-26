import { beforeAll, describe, expect, it } from 'vitest';

// Live-Prüfungen der Webseite (Plan 06): AK-2 Weiterleitungen und Erreichbarkeit, AK-9 Sicherheits-Header,
// AK-4 der Beacon ist die einzige fremde Quelle. Läuft erst ab dem Livegang (T-26, deploy-web.yml und drift.yml),
// bis dahin in keinem Workflow.

const DOMAIN = 'codeslage.de';
const ORIGIN = `https://${DOMAIN}`;
const BEACON = 'https://static.cloudflareinsights.com/beacon.min.js';
const PATH = '/leistungen/?quelle=test';

const head = (url: string) => fetch(url, { method: 'HEAD', redirect: 'manual' });

describe(`Weiterleitungen auf ${ORIGIN} (AK-2)`, () => {
  it.each([
    ['HTTP → HTTPS', `http://${DOMAIN}${PATH}`],
    ['www → Hauptdomain', `https://www.${DOMAIN}${PATH}`],
  ])('%s: 301, Pfad und Query bleiben', async (_, url) => {
    const response = await head(url);
    expect(response.status).toBe(301);
    expect(response.headers.get('location')).toBe(`${ORIGIN}${PATH}`);
  });

  it('http://www landet über höchstens zwei 301 auf der Hauptdomain', async () => {
    const first = await head(`http://www.${DOMAIN}${PATH}`);
    expect(first.status).toBe(301);
    const location = first.headers.get('location') ?? '';
    if (location === `${ORIGIN}${PATH}`) return;
    expect(location).toBe(`https://www.${DOMAIN}${PATH}`);
    const second = await head(location);
    expect(second.status).toBe(301);
    expect(second.headers.get('location')).toBe(`${ORIGIN}${PATH}`);
  });
});

describe(`${ORIGIN} liefert aus (AK-2, AK-9, AK-4)`, () => {
  let response: Response;
  let html: string;

  beforeAll(async () => {
    response = await fetch(`${ORIGIN}/`, { redirect: 'manual' });
    html = await response.text();
  });

  const header = (name: string) => response.headers.get(name) ?? '';

  it('Startseite liefert 200', () => {
    expect(response.status).toBe(200);
  });

  it('Sicherheits-Header sind gesetzt (AK-9)', () => {
    expect(header('strict-transport-security')).toMatch(/max-age=\d{7,}/);
    expect(header('content-security-policy')).toContain("frame-ancestors 'none'");
    expect(header('x-content-type-options')).toBe('nosniff');
    expect(header('referrer-policy')).not.toBe('');
    expect(header('permissions-policy')).not.toBe('');
  });

  it('CSP erlaubt Skripte nur vom eigenen Ursprung und vom Beacon-Host', () => {
    const scriptSrc = /script-src ([^;]+)/.exec(header('content-security-policy'))?.[1]?.trim().split(/\s+/);
    expect(scriptSrc).toEqual(["'self'", new URL(BEACON).origin]);
  });

  // Geladen werden nur src- und <link>-Ziele; Links im Text (z. B. GitHub) sind keine Quellen.
  it('der Beacon ist die einzige fremde Quelle im HTML (AK-4)', () => {
    const loaded = /<(?:[a-z]+\s[^>]*?\bsrc|link\s[^>]*?\bhref)="(https?:\/\/[^"]+)"/g;
    const sources = [...html.matchAll(loaded)].map(([, url = '']) => url);
    const foreign = sources.filter((url) => new URL(url).hostname !== DOMAIN);
    expect(foreign).toEqual([BEACON]);
  });
});
