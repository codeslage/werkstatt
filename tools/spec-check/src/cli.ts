import { readdirSync, readFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import { checkDocument, type DocumentKind } from './check.ts';

const REPO_ROOT = join(import.meta.dirname, '..', '..', '..');
const KINDS = new Map<string, DocumentKind>([
  ['spec.md', 'spec'],
  ['plan.md', 'plan'],
]);

/** Die Artikelnummern aus den Überschriften der Constitution („## I. …“). */
function constitutionNumerals(): string[] {
  const text = readFileSync(join(REPO_ROOT, 'CONSTITUTION.md'), 'utf8');
  return [...text.matchAll(/^## ([IVXL]+)\. /gm)].map((match) => match[1] ?? '');
}

/** Alle spec.md und plan.md unterhalb von dir, ohne die Vorlagen. */
function documents(dir: string): string[] {
  return readdirSync(dir, { recursive: true, encoding: 'utf8' })
    .filter((path) => KINDS.has(basename(path)) && !path.split(/[\\/]/).includes('_vorlagen'))
    .map((path) => join(dir, path));
}

function main(): void {
  const dir = process.argv[2];
  if (dir === undefined) {
    console.error('Aufruf: cli.ts <specs-Ordner>');
    process.exit(2);
  }
  const numerals = constitutionNumerals();
  if (numerals.length === 0) {
    console.error('spec-check: keine Artikel in CONSTITUTION.md gefunden, Abbruch.');
    process.exit(2);
  }
  const errors = documents(dir).flatMap((path) =>
    checkDocument(KINDS.get(basename(path)) ?? 'spec', readFileSync(path, 'utf8'), numerals).map(
      (error) => `${path}: ${error}`,
    ),
  );
  for (const error of errors) console.error(error);
  process.exit(errors.length === 0 ? 0 : 1);
}

main();
