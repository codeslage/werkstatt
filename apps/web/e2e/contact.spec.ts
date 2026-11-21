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
