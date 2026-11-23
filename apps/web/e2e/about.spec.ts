import { expect, test } from '@playwright/test';

// T-16 (AK-11, AK-6): „Über mich“ mit Foto in passender Größe, ohne Platzhalter, mit Link zum Repo.

test('Über mich zeigt Foto, Text und den Link zum Repo', async ({ page }) => {
  await page.goto('/ueber-mich/');
  const photo = page.getByRole('img', { name: 'Christopher Menslage' });
  await expect(photo).toBeVisible();
  const size = await photo.evaluate((img: HTMLImageElement) => ({
    width: img.naturalWidth,
    height: img.naturalHeight,
  }));
  expect(size.width).toBeLessThanOrEqual(400);
  expect(size.height).toBeLessThanOrEqual(400);
  await expect(page.locator('main')).not.toContainText('[');
  await expect(page.locator('main a[href="https://github.com/codeslage/werkstatt"]')).toHaveCount(1);
});
