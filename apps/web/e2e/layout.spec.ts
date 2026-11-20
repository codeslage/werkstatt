import { expect, test } from '@playwright/test';
import { PAGES } from '../src/site/pages.ts';

// AK-7: Jede Seite ist bei 375 px und am Desktop ohne waagerechtes Scrollen nutzbar.

const VIEWPORTS = [
  { width: 375, height: 812 },
  { width: 1280, height: 800 },
];

for (const viewport of VIEWPORTS) {
  for (const page of PAGES) {
    test(`${page.path} bei ${viewport.width} px ohne waagerechtes Scrollen`, async ({ page: browser }) => {
      await browser.setViewportSize(viewport);
      await browser.goto(page.path);
      const overflow = await browser.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }
}
