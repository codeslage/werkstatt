import { expect, test } from '@playwright/test';
import { PAGES } from '../src/site/pages.ts';

// AK-3: Jeder Kontakt-Aufruf führt zur Kontaktseite; dort steht die Rollenadresse als Text, und genau ein Link
// öffnet eine Mail an sie. Es gibt auf keiner Seite ein Formular.

const ADDRESS = 'kontakt@codeslage.de';

test('die Kontaktseite zeigt die Adresse und genau einen Mail-Link', async ({ page }) => {
  await page.goto('/kontakt/');
  await expect(page.locator('main')).toContainText(ADDRESS);
  const mailLinks = page.locator('a[href^="mailto:"]');
  await expect(mailLinks).toHaveCount(1);
  expect(await mailLinks.getAttribute('href')).toMatch(new RegExp(`^mailto:${ADDRESS}(\\?|$)`));
});

test('die Kontaktseite verlinkt die Buchungsseite für ein Erstgespräch, ohne sie einzubetten', async ({ page }) => {
  await page.goto('/kontakt/');
  const booking = page.getByRole('link', { name: 'Erstgespräch buchen' });
  await expect(booking).toHaveAttribute('href', 'https://calendar.app.google/AoVREVhD3FnqSuMN7');
  await expect(page.locator('iframe')).toHaveCount(0);
});

// Alle Seiten aus PAGES und die Fehlerseite (über einen unbekannten Pfad).
const PATHS = [...PAGES.map((page) => page.path), '/gibt-es-nicht/'];
// Kontakt-Aufrufe erkennt der Test an ihrem Text; „Mail schreiben“ ist der mailto-Link auf der Kontaktseite selbst.
const CONTACT_TEXT = /kontakt|schreib mir/i;

for (const path of PATHS) {
  test(`${path}: kein Formular, Kontakt-Links nur zur Kontaktseite, mailto nur dort`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator('form')).toHaveCount(0);
    if (path !== '/kontakt/') await expect(page.locator('a[href^="mailto:"]')).toHaveCount(0);
    const contactLinks = await page
      .locator('a')
      .filter({ hasText: CONTACT_TEXT })
      .evaluateAll((links) => links.map((link) => link.getAttribute('href')));
    expect(contactLinks.length).toBeGreaterThan(0);
    for (const href of contactLinks) expect(href).toBe('/kontakt/');
  });
}

// T-13: Die Startseite ruft oben und am Ende mit „Schreib mir“ zur Kontaktseite auf.
test('die Startseite ruft mit „Schreib mir“ zur Kontaktseite auf', async ({ page }) => {
  await page.goto('/');
  const calls = page.locator('main').getByRole('link', { name: 'Schreib mir', exact: true });
  await expect(calls).toHaveCount(2);
  for (const href of await calls.evaluateAll((links) => links.map((link) => link.getAttribute('href'))))
    expect(href).toBe('/kontakt/');
});
