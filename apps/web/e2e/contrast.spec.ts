import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { PAGES } from '../src/site/pages.ts';

// AK-18: Die Seite folgt der Hell-/Dunkel-Einstellung des Geräts; in beiden Darstellungen erreichen Texte und
// Links mindestens den Kontrast nach WCAG AA. Hintergrundfarben aus specs/06-webseite/gestaltung.md.

const SCHEMES = [
  { scheme: 'light', background: 'rgb(255, 255, 255)' },
  { scheme: 'dark', background: 'rgb(13, 17, 23)' },
] as const;
const PATHS = [...PAGES.map((page) => page.path), '/gibt-es-nicht/'];

for (const { scheme, background } of SCHEMES) {
  for (const path of PATHS) {
    test(`${path} in ${scheme}: Hintergrund passt, Kontrast nach WCAG AA`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: scheme });
      await page.goto(path);
      const body = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
      expect(body).toBe(background);
      const result = await new AxeBuilder({ page }).withRules(['color-contrast']).analyze();
      expect(result.violations).toEqual([]);
    });
  }
}
