import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { CONTACT_ADDRESS } from '../src/site/contact.ts';

// T-17, T-18 (AK-12, AK-11): Impressum und Datenschutzerklärung haben fertigen Text. Die Pflichtangaben prüft
// der Inhaber (manuell, Protokoll); hier wird geprüft, was sich automatisch prüfen lässt. Die Adresse steht als
// Text, der Mail-Link bleibt der Kontaktseite vorbehalten (contact.spec.ts, AK-3).

// Der Test-Build liest die Platzhalter aus .env.example (playwright.config.ts); genau die muss das Impressum zeigen.
const placeholders = readFileSync(new URL('../.env.example', import.meta.url), 'utf8')
  .split('\n')
  .filter((line) => line.startsWith('IMPRESSUM_'))
  .map((line) => line.slice(line.indexOf('=') + 1));

test('Impressum zeigt die Angaben aus .env.example und die Rollenadresse', async ({ page }) => {
  await page.goto('/impressum/');
  const main = page.locator('main');
  expect(placeholders).toHaveLength(3);
  for (const value of placeholders) await expect(main.locator('address')).toContainText(value);
  await expect(main).toContainText(`Mail: ${CONTACT_ADDRESS}`);
  await expect(main).not.toContainText('[');
});

test('Datenschutzerklärung nennt Hosting, Besuchsmessung, Mail und Terminbuchung', async ({ page }) => {
  await page.goto('/datenschutz/');
  const main = page.locator('main');
  for (const heading of ['Hosting', 'Besuchsmessung', 'Kontakt per Mail', 'Terminbuchung', 'Cookies']) {
    await expect(main.getByRole('heading', { name: heading })).toHaveCount(1);
  }
  await expect(main).toContainText('Cloudflare Pages');
  await expect(main).toContainText('Cloudflare Web Analytics');
  await expect(main).toContainText('Google');
  await expect(main).toContainText(CONTACT_ADDRESS);
  await expect(main.locator('a[href="/impressum/"]')).toHaveCount(1);
  await expect(main).not.toContainText('[');
});
