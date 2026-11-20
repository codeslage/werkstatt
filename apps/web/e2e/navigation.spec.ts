import { expect, test } from '@playwright/test';
import { PAGES } from '../src/site/pages.ts';

// AK-1: Jede Seite ist erreichbar; von jeder Seite führt die Navigation zu jeder Hauptseite,
// Impressum und Datenschutz sind mit einem Klick erreichbar.

const linked = PAGES.filter((page) => page.nav !== 'none').map((page) => page.path);

for (const page of PAGES) {
  test(`${page.path} ist erreichbar und verlinkt alle Haupt- und Footer-Seiten`, async ({ page: browser }) => {
    const response = await browser.goto(page.path);
    expect(response?.status()).toBe(200);
    const hrefs = await browser
      .locator('header a, footer a')
      .evaluateAll((links) => links.map((link) => link.getAttribute('href')));
    expect(hrefs).toEqual(expect.arrayContaining(['/', ...linked]));
  });
}
