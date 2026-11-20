import { expect, test } from '@playwright/test';
import { PAGES } from '../src/site/pages.ts';

// AK-17: codeslage hat ein Logo; es erscheint auf jeder Seite und dient als Symbol im Browser-Tab.
// Zeichen als Bild, Wortmarke als echter Text (specs/06-webseite/gestaltung.md).

// Alle Seiten aus PAGES und die Fehlerseite (über einen unbekannten Pfad).
const PATHS = [...PAGES.map((page) => page.path), '/gibt-es-nicht/'];

for (const path of PATHS) {
  test(`${path} zeigt Zeichen und Wortmarke im Header`, async ({ page: browser }) => {
    await browser.goto(path);
    const home = browser.getByTestId('home-link');
    await expect(home.locator('img[src="/logo-zeichen.svg"]')).toBeVisible();
    await expect(home).toHaveText('codeslage_');
    // Grundlinie der Schrift auf der Unterkante der Kachel (gestaltung.md), auf 1 px genau.
    const offset = await home.evaluate((link) => {
      const tile = link.querySelector('img')?.getBoundingClientRect();
      const text = link.querySelector('.brand-slage')?.getBoundingClientRect();
      const svgUnits = 44;
      const tileBottom = (tile?.top ?? 0) + ((tile?.height ?? 0) * 37) / svgUnits;
      const probe = document.createElement('span');
      probe.style.cssText = 'display:inline-block;width:0;height:0;vertical-align:baseline';
      link.querySelector('.brand-slage')?.append(probe);
      const baseline = probe.getBoundingClientRect().top;
      probe.remove();
      return text ? Math.abs(baseline - tileBottom) : Number.POSITIVE_INFINITY;
    });
    expect(offset).toBeLessThanOrEqual(1);
  });
}

test('Logo, Favicon und Touch-Icon werden ausgeliefert', async ({ page, request }) => {
  await page.goto('/');
  const icon = await page.locator('link[rel="icon"]').getAttribute('href');
  const touch = await page.locator('link[rel="apple-touch-icon"]').getAttribute('href');
  for (const [href, type] of [
    [icon, 'image/svg+xml'],
    [touch, 'image/png'],
    ['/logo-zeichen.svg', 'image/svg+xml'],
  ] as const) {
    const response = await request.get(href ?? '');
    expect(response.status(), href ?? '').toBe(200);
    expect(response.headers()['content-type'], href ?? '').toContain(type);
  }
});
