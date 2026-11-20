import { expect, test } from '@playwright/test';
import { hasPlaceholder } from '../src/site/pages.ts';

// T-08 (Spec A6, AK-11): Navigation, Footer und Fehlerseite haben fertigen Text. Ausgenommen ist nur die
// Wortmarke im Header, sie kommt mit T-10.

test('Navigation und Footer ohne Platzhalter', async ({ page }) => {
  await page.goto('/');
  const nav = await page.locator('header nav').innerText();
  const footer = await page.locator('footer').innerText();
  expect(hasPlaceholder(nav), nav).toBe(false);
  expect(hasPlaceholder(footer), footer).toBe(false);
});

test('Fehlerseite ohne Platzhalter in Titel, Beschreibung und Inhalt', async ({ page }) => {
  await page.goto('/gibt-es-nicht/');
  const title = await page.title();
  const description = (await page.locator('meta[name="description"]').getAttribute('content')) ?? '';
  const content = await page.locator('main').innerText();
  for (const text of [title, description, content]) expect(hasPlaceholder(text), text).toBe(false);
});
