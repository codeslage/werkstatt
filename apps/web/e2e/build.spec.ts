import { readdirSync, readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { hasPlaceholder } from '../src/site/pages.ts';

// T-23 (Spec A6, AK-11, AK-12): Keine Seite des gesamten Builds enthält einen Platzhalter.
// Platzhalter heißt wie in T-08 Text in eckigen Klammern (`hasPlaceholder`). Die Musterwerte `IMPRESSUM_*`
// aus .env.example sind Absicht: Der Test-Build braucht keine echten Angaben, der Deploy setzt sie aus dem
// GitHub-Environment „production“ (T-24).

// Geprüft werden die Dateien in `dist/` selbst, nicht ein laufender Server. Die Liste entsteht erst im Test,
// weil Playwright `dist/` über den webServer baut, nachdem die Specs geladen sind.
const dist = new URL('../dist/', import.meta.url);
const toPath = (file: string) => `/${file.replace(/index\.html$/, '')}`;

test('keine Seite des Builds enthält einen Platzhalter', async ({ page }) => {
  const htmlFiles = readdirSync(dist, { recursive: true, encoding: 'utf8' }).filter((file) => file.endsWith('.html'));
  expect(htmlFiles.length).toBeGreaterThan(5);
  for (const file of htmlFiles) {
    await page.setContent(readFileSync(new URL(file, dist), 'utf8'));
    const description = (await page.locator('meta[name="description"]').getAttribute('content')) ?? '';
    const attributes = await page
      .locator('[alt], [aria-label], [title]')
      .evaluateAll((nodes) =>
        nodes.flatMap((node) => ['alt', 'aria-label', 'title'].map((name) => node.getAttribute(name) ?? '')),
      );
    const texts = [await page.title(), description, await page.locator('body').innerText(), ...attributes];
    for (const text of texts) expect.soft(hasPlaceholder(text), `${toPath(file)}: ${text}`).toBe(false);
  }
});
