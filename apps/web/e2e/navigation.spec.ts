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

// AK-16 (T-15): Die Case Study liegt als Unterseite von „Projekte“ und ist von dort verlinkt.
const CASE_STUDY = '/projekte/wir-bauen-erst-wenn-wir-es-brauchen/';

test('Projekte verlinkt die Case Study, und sie ist erreichbar', async ({ page }) => {
  await page.goto('/projekte/');
  const link = page.locator('main').getByRole('link', { name: /Wir bauen erst, wenn wir es brauchen/ });
  await expect(link).toHaveAttribute('href', CASE_STUDY);
  const response = await page.goto(CASE_STUDY);
  expect(response?.status()).toBe(200);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Wir bauen erst, wenn wir es brauchen');
});

// T-13: Die Startseite hat einen Kernsatz statt „Start“, nennt die vier Leistungen wie /leistungen/
// und verlinkt die Case Study.
test('die Startseite zeigt den Kernsatz, die vier Leistungen und den Teaser der Case Study', async ({ page }) => {
  await page.goto('/leistungen/');
  const services = await page.locator('main h2').allTextContents();

  await page.goto('/');
  const main = page.locator('main');
  await expect(page.getByRole('heading', { level: 1 })).not.toHaveText('Start');
  const teasers = await main.locator('h3').allTextContents();
  expect(teasers).toHaveLength(4);
  expect(services.slice(0, 4).map(normalize)).toEqual(teasers.map(normalize));
  await expect(main.getByRole('link', { name: /Alle Leistungen/ })).toHaveAttribute('href', '/leistungen/');
  await expect(main.getByRole('link', { name: /Projekte ansehen/ })).toHaveAttribute('href', '/projekte/');
  await expect(main.getByRole('link', { name: /Wir bauen erst, wenn wir es brauchen/ })).toHaveAttribute(
    'href',
    CASE_STUDY,
  );
});

function normalize(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}
