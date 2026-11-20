import { expect, test } from '@playwright/test';
import { PAGES } from '../src/site/pages.ts';

// AK-4: keine Cookies, kein Speicher im Browser, keine Dienste Dritter. Der Test-Build hat kein Beacon-Token,
// also darf keine einzige Anfrage den eigenen Ursprung verlassen; der Beacon wird live geprüft (T-22, T-26).

for (const page of PAGES) {
  test(`${page.path} setzt keine Cookies, speichert nichts und lädt nur vom eigenen Ursprung`, async ({
    page: browser,
    context,
    baseURL,
  }) => {
    const foreign: string[] = [];
    browser.on('request', (request) => {
      if (new URL(request.url()).origin !== baseURL) foreign.push(request.url());
    });
    await browser.goto(page.path, { waitUntil: 'networkidle' });
    expect(foreign).toEqual([]);
    expect(await context.cookies()).toEqual([]);
    const stored = await browser.evaluate(() => localStorage.length + sessionStorage.length);
    expect(stored).toBe(0);
  });
}
