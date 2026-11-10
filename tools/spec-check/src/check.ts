// Prüft die Pflichtteile einer spec.md oder plan.md (Constitution Artikel I, governance.md „Prüfung“).

export type DocumentKind = 'spec' | 'plan';

const RATINGS = new Set(['✅', '⚠️', '–']);

interface CheckRow {
  numeral: string;
  rating: string;
  note: string;
}

/** Text des Abschnitts unter einer Überschrift zweiter Ebene, bis zur nächsten. */
function section(text: string, heading: string): string | undefined {
  const lines = text.split(/\r?\n/);
  const start = lines.findIndex((line) => line.trim() === `## ${heading}`);
  if (start === -1) return undefined;
  const end = lines.findIndex((line, i) => i > start && line.startsWith('## '));
  return lines.slice(start + 1, end === -1 ? undefined : end).join('\n');
}

function constitutionRows(body: string): CheckRow[] {
  return body
    .split('\n')
    .filter((line) => line.startsWith('|'))
    .map((line) => line.split('|').slice(1, -1).map((cell) => cell.trim()))
    .filter((cells) => /^[IVXL]+\s/.test(cells[0] ?? ''))
    .map(([article = '', rating = '', note = '']) => ({ numeral: article.split(/\s/)[0] ?? '', rating, note }));
}

function headerErrors(kind: DocumentKind, text: string): string[] {
  const errors: string[] = [];
  if (!/^> Status: \*\*[^*]+\*\*/m.test(text)) errors.push('status-fehlt');
  if (!/`CONSTITUTION\.md` \(v\d+\.\d+\.\d+\)/.test(text)) errors.push('constitution-bezug-fehlt');
  const hasAkTable = /^\| *ID *\| *Kriterium *\|/m.test(text) && /^\| *AK-\d+ *\|/m.test(text);
  if (kind === 'spec' && !hasAkTable) errors.push('ak-tabelle-fehlt');
  return errors;
}

function rowErrors(rows: CheckRow[], numerals: string[]): string[] {
  const missing = numerals.filter((numeral) => !rows.some((row) => row.numeral === numeral));
  const invalid = rows.filter((row) => !RATINGS.has(row.rating));
  const withoutNote = rows.filter((row) => row.rating === '⚠️' && row.note === '');
  return [
    ...missing.map((numeral) => `artikel-fehlt: ${numeral}`),
    ...invalid.map((row) => `bewertung-ungueltig: ${row.numeral}`),
    ...withoutNote.map((row) => `anmerkung-fehlt: ${row.numeral}`),
  ];
}

/** Liefert die Fehler eines Dokuments; eine leere Liste heißt: vollständig. */
export function checkDocument(kind: DocumentKind, text: string, numerals: string[]): string[] {
  const body = section(text, 'Constitution-Check');
  const checkErrors = body === undefined ? ['constitution-check-fehlt'] : rowErrors(constitutionRows(body), numerals);
  return [...headerErrors(kind, text), ...checkErrors];
}
