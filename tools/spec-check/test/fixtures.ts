// Ein gültiges Dokument, aus dem die Tests gezielt einzelne Pflichtteile entfernen.

const ARTICLES = [
  'I Spec zuerst',
  'II Tests beweisen die Spec',
  'III Kleine Schritte',
  'IV Fragen statt raten',
  'V Keine zerstörerischen Aktionen',
  'VI Secrets nie ins Repo',
  'VII Sicher als Standard',
  'VIII Datenschutz & EU',
  'IX Mensch im Loop',
  'X Reproduzierbar',
  'XI Einfach vor vollständig',
  'XII Offen dokumentieren',
  'XIII Wiederverwendbar',
  'XIV Messen statt schätzen',
  'XV Kein unnötiger Code',
  'XVI Fehler sind sichtbar',
];

/** Die römischen Ziffern, so wie der Spec-Check sie aus der Constitution liest. */
export const NUMERALS = ARTICLES.map((article) => article.split(' ')[0] ?? '');

const checkRows = ARTICLES.map((article) => `| ${article} | ✅ | begründet |`).join('\n');

export const validSpec = `# 99 – Beispiel: Spec

> Status: **Entwurf**
> Stand: 2026-11-10
> Bezug: \`CONSTITUTION.md\` (v1.1.0)

## Akzeptanzkriterien

| ID | Kriterium | Nachweis |
|---|---|---|
| AK-1 | Etwas funktioniert | automatisiert |

## Constitution-Check

| Artikel | Bewertung | Anmerkung |
|---|---|---|
${checkRows}

## Offene Fragen
`;

/** Ein Plan braucht keine AK-Tabelle, sonst dieselben Pflichtteile. */
export const validPlan = validSpec.replace(/## Akzeptanzkriterien[\s\S]*?(?=## Constitution-Check)/, '## Schritte\n\n### Schritt 1\n\n');

export const withRow = (text: string, article: string, row: string): string =>
  text.replace(new RegExp(`^\\| ${article} \\|.*$`, 'm'), row);
