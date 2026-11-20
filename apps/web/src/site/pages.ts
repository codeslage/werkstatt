// Eine Quelle für alle Seiten: Navigation, Footer, Seitentitel und Tests lesen hier (Plan 06, Datenmodell).
// Texte in eckigen Klammern sind Platzhalter und gehen nie live (Spec A6, Tasks T-08 und T-23).

type NavPlace = 'main' | 'footer' | 'none';

export interface Page {
  readonly path: string;
  /** kurz, für Navigation, Footer und Überschrift */
  readonly label: string;
  /** vollständiger Seitentitel im Browser-Tab und in Suchmaschinen */
  readonly title: string;
  readonly description: string;
  readonly nav: NavPlace;
}

export const PAGES: readonly Page[] = [
  {
    path: '/',
    label: '[Start]',
    title: '[Titel Startseite]',
    description: '[Beschreibung der Startseite für Suchmaschinen, 50 bis 160 Zeichen]',
    nav: 'none',
  },
  {
    path: '/leistungen/',
    label: '[Leistungen]',
    title: '[Titel Leistungen]',
    description: '[Beschreibung der Seite Leistungen für Suchmaschinen, 50 bis 160 Zeichen]',
    nav: 'main',
  },
  {
    path: '/projekte/',
    label: '[Projekte]',
    title: '[Titel Projekte]',
    description: '[Beschreibung der Seite Projekte für Suchmaschinen, 50 bis 160 Zeichen]',
    nav: 'main',
  },
  {
    path: '/ueber-mich/',
    label: '[Über mich]',
    title: '[Titel Über mich]',
    description: '[Beschreibung der Seite Über mich für Suchmaschinen, 50 bis 160 Zeichen]',
    nav: 'main',
  },
  {
    path: '/kontakt/',
    label: '[Kontakt]',
    title: '[Titel Kontakt]',
    description: '[Beschreibung der Seite Kontakt für Suchmaschinen, 50 bis 160 Zeichen]',
    nav: 'main',
  },
  {
    path: '/impressum/',
    label: '[Impressum]',
    title: '[Titel Impressum]',
    description: '[Beschreibung der Seite Impressum für Suchmaschinen, 50 bis 160 Zeichen]',
    nav: 'footer',
  },
  {
    path: '/datenschutz/',
    label: '[Datenschutz]',
    title: '[Titel Datenschutz]',
    description: '[Beschreibung der Seite Datenschutz für Suchmaschinen, 50 bis 160 Zeichen]',
    nav: 'footer',
  },
];

const PLACEHOLDER = /\[[^\]]+\]/;

export function hasPlaceholder(text: string): boolean {
  return PLACEHOLDER.test(text);
}
