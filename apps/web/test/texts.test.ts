import { describe, expect, it } from 'vitest';
import { hasPlaceholder, PAGES } from '../src/site/pages.ts';

// T-08 (Spec A6, AK-8, AK-11): Titel, Beschreibungen und Beschriftungen aller Seiten sind fertiger Text.
// Die Prüfung des ganzen Builds auf Platzhalter folgt mit T-23.

describe('Texte der Seitenliste', () => {
  for (const page of PAGES) {
    it(`${page.path} hat keinen Platzhalter in Titel, Beschreibung und Beschriftung`, () => {
      expect(hasPlaceholder(page.title), page.title).toBe(false);
      expect(hasPlaceholder(page.description), page.description).toBe(false);
      expect(hasPlaceholder(page.label), page.label).toBe(false);
    });
  }
});
