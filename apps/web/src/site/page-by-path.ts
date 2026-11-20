import { PAGES, type Page } from './pages.ts';

/** Die Seite zu einem Pfad aus PAGES; fehlt sie, bricht der Build mit klarer Meldung ab (XVI). */
export function pageByPath(path: string): Page {
  const page = PAGES.find((candidate) => candidate.path === path);
  if (!page) throw new Error(`Seite ${path} fehlt in PAGES (src/site/pages.ts)`);
  return page;
}
