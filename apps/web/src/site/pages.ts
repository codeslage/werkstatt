// Eine Quelle für alle Seiten: Navigation, Footer, Seitentitel und Tests lesen hier (Plan 06, Datenmodell).
// Texte in eckigen Klammern wären Platzhalter und gehen nie live (Spec A6, Tasks T-08 und T-23).
// Alle sichtbaren Texte hier sind Text-PR: Merge erst nach Freigabe des Inhabers (Plan 06, Frage 9).

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
    label: 'Start',
    title: 'codeslage – KI-getriebene Entwicklung für Startups',
    description:
      'Prototypen, Infrastruktur und KI-Automatisierung für Startups in frühen Phasen: spec-driven, offen dokumentiert, ein Mensch gibt frei.',
    nav: 'none',
  },
  {
    path: '/leistungen/',
    label: 'Leistungen',
    title: 'Leistungen – codeslage',
    description:
      'Prototyp und MVP, Infrastruktur und CI, KI-Entwicklung im Team und KI-Automatisierung: was codeslage für frühe Startups im DACH-Raum macht.',
    nav: 'main',
  },
  {
    path: '/projekte/',
    label: 'Projekte',
    title: 'Projekte – codeslage',
    description:
      'Woran codeslage arbeitet: das offene Repo werkstatt und die Case Study „Wir bauen erst, wenn wir es brauchen“ mit echten Soll/Ist-Zahlen.',
    nav: 'main',
  },
  {
    path: '/projekte/wir-bauen-erst-wenn-wir-es-brauchen/',
    label: 'Case Study',
    title: 'Wir bauen erst, wenn wir es brauchen – codeslage',
    description:
      'Case Study zu Phase 1: Claude schätzte 50 Stunden für das technische Fundament, gebraucht hat es gut 14 – ohne eigenen Server, mit 0 € zusätzlichen laufenden Kosten.',
    nav: 'none',
  },
  {
    path: '/ueber-mich/',
    label: 'Über mich',
    title: 'Über mich – codeslage',
    description:
      'Wer hinter codeslage steht und wie gearbeitet wird: spec-driven mit KI, offen dokumentiert, und jeden Entwurf gibt ein Mensch frei.',
    nav: 'main',
  },
  {
    path: '/kontakt/',
    label: 'Kontakt',
    title: 'Kontakt – codeslage',
    description:
      'Schreib eine Mail an kontakt@codeslage.de: kurz, was du vorhast und wo du gerade stehst. Ein Formular gibt es bewusst nicht.',
    nav: 'main',
  },
  {
    path: '/impressum/',
    label: 'Impressum',
    title: 'Impressum – codeslage',
    description:
      'Anbieterkennzeichnung von codeslage: wer für diese Webseite verantwortlich ist und wie du codeslage erreichst.',
    nav: 'footer',
  },
  {
    path: '/datenschutz/',
    label: 'Datenschutz',
    title: 'Datenschutz – codeslage',
    description:
      'Was beim Besuch von codeslage.de passiert: keine Cookies, eine cookielose Besuchsmessung und Hosting bei Cloudflare, verständlich erklärt.',
    nav: 'footer',
  },
];

const PLACEHOLDER = /\[[^\]]+\]/;

export function hasPlaceholder(text: string): boolean {
  return PLACEHOLDER.test(text);
}
