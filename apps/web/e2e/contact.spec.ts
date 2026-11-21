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

for (const page of PAGES) {
  test(`${page.path}: kein Formular, Mail-Links nur auf der Kontaktseite`, async ({ page: browser }) => {
    await browser.goto(page.path);
    await expect(browser.locator('form')).toHaveCount(0);
    if (page.path !== '/kontakt/') await expect(browser.locator('a[href^="mailto:"]')).toHaveCount(0);
  });
}
