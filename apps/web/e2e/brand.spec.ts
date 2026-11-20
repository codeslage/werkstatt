import { expect, test } from '@playwright/test';
import { PAGES } from '../src/site/pages.ts';

// AK-17: codeslage hat ein Logo; es erscheint auf jeder Seite und dient als Symbol im Browser-Tab.
// Zeichen als Bild, Wortmarke als echter Text (specs/06-webseite/gestaltung.md).

for (const page of PAGES) {
  test(`${page.path} zeigt Zeichen und Wortmarke im Header`, async ({ page: browser }) => {
    await browser.goto(page.path);
    const home = browser.getByTestId('home-link');
    await expect(home.locator('img[src="/logo-zeichen.svg"]')).toBeVisible();
    await expect(home).toHaveText('codeslage_');
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
