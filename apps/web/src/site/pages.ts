// Eine Quelle für alle Seiten: Navigation, Footer, Seitentitel und Tests lesen hier (Plan 06, Datenmodell).
// Texte in eckigen Klammern sind Platzhalter und gehen nie live (Spec A6, Tasks T-08 und T-23).

type NavPlace = 'main' | 'footer' | 'none';

export interface Page {
  readonly path: string;
  readonly title: string;
  readonly description: string;
  readonly nav: NavPlace;
}

export const PAGES: readonly Page[] = [
  {
    path: '/',
    title: '[Titel Startseite]',
    description: '[Beschreibung der Startseite für Suchmaschinen, 50 bis 160 Zeichen]',
    nav: 'none',
  },
  {
    path: '/leistungen/',
    title: '[Titel Leistungen]',
    description: '[Beschreibung der Seite Leistungen für Suchmaschinen, 50 bis 160 Zeichen]',
    nav: 'main',
  },
  {
    path: '/projekte/',
    title: '[Titel Projekte]',
    description: '[Beschreibung der Seite Projekte für Suchmaschinen, 50 bis 160 Zeichen]',
    nav: 'main',
  },
  {
    path: '/ueber-mich/',
    title: '[Titel Über mich]',
    description: '[Beschreibung der Seite Über mich für Suchmaschinen, 50 bis 160 Zeichen]',
    nav: 'main',
  },
  {
    path: '/kontakt/',
    title: '[Titel Kontakt]',
    description: '[Beschreibung der Seite Kontakt für Suchmaschinen, 50 bis 160 Zeichen]',
    nav: 'main',
  },
  {
    path: '/impressum/',
    title: '[Titel Impressum]',
    description: '[Beschreibung der Seite Impressum für Suchmaschinen, 50 bis 160 Zeichen]',
    nav: 'footer',
  },
  {
    path: '/datenschutz/',
    title: '[Titel Datenschutz]',
    description: '[Beschreibung der Seite Datenschutz für Suchmaschinen, 50 bis 160 Zeichen]',
    nav: 'footer',
  },
];

const PLACEHOLDER = /\[[^\]]+\]/;

export function hasPlaceholder(text: string): boolean {
  return PLACEHOLDER.test(text);
}
