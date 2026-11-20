import { expect, test } from '@playwright/test';
import { PAGES } from '../src/site/pages.ts';

// AK-8: eigener Titel und Beschreibung je Seite, Sprache Deutsch, keine toten internen Links, eigene 404-Seite.

for (const page of PAGES) {
  test(`${page.path} hat Sprache, Titel, Beschreibung und Canonical`, async ({ page: browser }) => {
    await browser.goto(page.path);
    await expect(browser.locator('html')).toHaveAttribute('lang', 'de');
    await expect(browser).toHaveTitle(page.title);
    await expect(browser.locator('meta[name="description"]')).toHaveAttribute('content', page.description);
    await expect(browser.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://codeslage.de${page.path}`);
  });
}

test('alle internen Links liefern 200', async ({ page: browser, request }) => {
  const targets = new Set<string>();
  for (const page of PAGES) {
    await browser.goto(page.path);
    const hrefs = await browser
      .locator('a[href^="/"], link[href^="/"]')
      .evaluateAll((elements) => elements.map((element) => element.getAttribute('href') ?? ''));
    for (const href of hrefs) targets.add(href);
  }
  for (const target of targets) expect((await request.get(target)).status(), target).toBe(200);
});

test('ein unbekannter Pfad zeigt die eigene 404-Seite', async ({ page: browser }) => {
  const response = await browser.goto('/gibt-es-nicht/');
  expect(response?.status()).toBe(404);
  await expect(browser.getByTestId('not-found')).toBeVisible();
});
