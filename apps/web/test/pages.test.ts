import { describe, expect, it } from 'vitest';
import { hasPlaceholder, PAGES } from '../src/site/pages.ts';

// Plan 06, Datenmodell: eine Quelle für Navigation und Tests. AK-1 (alle Seiten), AK-8 (eigener Titel und Beschreibung).

const REQUIRED_PATHS = ['/', '/leistungen/', '/projekte/', '/ueber-mich/', '/kontakt/', '/impressum/', '/datenschutz/'];

describe('PAGES', () => {
  it('enthält alle Seiten aus AK-1', () => {
    expect(PAGES.map((page) => page.path)).toEqual(expect.arrayContaining(REQUIRED_PATHS));
  });

  it('hat eindeutige Pfade und Titel', () => {
    const paths = PAGES.map((page) => page.path);
    const titles = PAGES.map((page) => page.title);
    expect(new Set(paths).size).toBe(paths.length);
    expect(new Set(titles).size).toBe(titles.length);
  });

  it('hat eindeutige, kurze Beschriftungen für Navigation und Überschrift', () => {
    const labels = PAGES.map((page) => page.label);
    expect(new Set(labels).size).toBe(labels.length);
    for (const page of PAGES) expect(page.label.length, page.path).toBeLessThanOrEqual(30);
  });

  it('hat für jede Seite eine Beschreibung mit 50 bis 160 Zeichen', () => {
    for (const page of PAGES) {
      expect(page.description.length, page.path).toBeGreaterThanOrEqual(50);
      expect(page.description.length, page.path).toBeLessThanOrEqual(160);
    }
  });

  it('führt die Hauptseiten in der Navigation und Impressum und Datenschutz im Footer', () => {
    const inMain = PAGES.filter((page) => page.nav === 'main').map((page) => page.path);
    const inFooter = PAGES.filter((page) => page.nav === 'footer').map((page) => page.path);
    expect(inMain).toEqual(['/leistungen/', '/projekte/', '/ueber-mich/', '/kontakt/']);
    expect(inFooter).toEqual(['/impressum/', '/datenschutz/']);
  });
});

describe('hasPlaceholder', () => {
  it('erkennt Platzhalter in eckigen Klammern', () => {
    expect(hasPlaceholder('[Titel Startseite]')).toBe(true);
    expect(hasPlaceholder('Leistungen – [Beschreibung]')).toBe(true);
  });

  it('lässt fertigen Text durch', () => {
    expect(hasPlaceholder('Leistungen')).toBe(false);
    expect(hasPlaceholder('KI-Automatisierung für Startups')).toBe(false);
  });
});
