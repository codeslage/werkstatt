import { expect, test } from '@playwright/test';
import { BEACON_TEST_TOKEN } from '../playwright.config.ts';

// AK-4: Mit Token ist der Beacon von Cloudflare Web Analytics die einzige fremde Quelle. Die Anfrage an ihn
// fängt Playwright ab, der Test geht nicht ins Internet (Tasks, T-05).

const BEACON_ORIGIN = 'https://static.cloudflareinsights.com';

test('der Beacon ist die einzige fremde Quelle und trägt das Token', async ({ page, context, baseURL }) => {
  await page.route(`${BEACON_ORIGIN}/**`, (route) => route.fulfill({ contentType: 'text/javascript', body: '' }));
  const foreign = new Set<string>();
  page.on('request', (request) => {
    const origin = new URL(request.url()).origin;
    if (origin !== baseURL) foreign.add(origin);
  });
  await page.goto('/', { waitUntil: 'networkidle' });
  expect([...foreign]).toEqual([BEACON_ORIGIN]);
  const config = await page.locator(`script[src^="${BEACON_ORIGIN}/"]`).getAttribute('data-cf-beacon');
  expect(JSON.parse(config ?? '{}')).toEqual({ token: BEACON_TEST_TOKEN });
  expect(await context.cookies()).toEqual([]);
});
