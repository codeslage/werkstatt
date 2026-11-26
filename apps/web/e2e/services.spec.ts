import { expect, test } from '@playwright/test';

// T-14 (AK-11, AK-1): Leistungen nach specs/06-webseite/leistungen.md – vier Bereiche, KI-Automatisierung als
// „im Aufbau“, Ablauf, Pilotprojekte mit Preisen auf Anfrage, nirgends „kostenlos“, Abgrenzung, Kontakt-Aufruf.

const AREAS = ['Prototyp und MVP', 'Infrastruktur und CI', 'KI-Entwicklung einführen', 'KI-Automatisierung'];

test('Leistungen zeigt die vier Bereiche und die Rahmenbedingungen', async ({ page }) => {
  await page.goto('/leistungen/');
  const main = page.locator('main');
  for (const area of AREAS) await expect(main.getByRole('heading', { level: 2, name: area })).toBeVisible();
  await expect(main.getByRole('heading', { level: 2, name: /KI-Automatisierung/ })).toContainText('im Aufbau');
  for (const section of ['So läuft es ab', 'Pilotprojekte und Preise', 'Nicht im Angebot']) {
    await expect(main.getByRole('heading', { level: 2, name: section })).toBeVisible();
  }
  await expect(main).toContainText('auf Anfrage');
  await expect(main).not.toContainText(/kostenlos/i);
  await expect(main).not.toContainText('[');
  await expect(main.getByRole('link', { name: 'Schreib mir' })).toHaveAttribute('href', '/kontakt/');
});
