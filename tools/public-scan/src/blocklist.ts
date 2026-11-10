import { existsSync, readFileSync } from 'node:fs';

const BLOCKLIST_RULE_ID = 'codeslage-blocklist';

/**
 * Liest die vertrauliche Sperrliste: in der CI aus der Umgebungsvariable
 * PUBLIC_BLOCKLIST (GitHub Secret), lokal aus der gitignorierten Datei.
 * Eine Zeile = ein Begriff; leere Zeilen und Kommentare (#) zählen nicht.
 */
export function readBlocklist(env: NodeJS.ProcessEnv, localFile: string): string[] {
  const raw = env.PUBLIC_BLOCKLIST ?? (existsSync(localFile) ? readFileSync(localFile, 'utf8') : '');
  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line !== '' && !line.startsWith('#'));
}

function escapeRegex(term: string): string {
  return term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Baut die gitleaks-Regel für die Sperrliste als TOML-Abschnitt. */
export function blocklistRule(terms: string[]): string {
  const pattern = terms.map(escapeRegex).join('|');
  return [
    '[[rules]]',
    `id = "${BLOCKLIST_RULE_ID}"`,
    'description = "Begriff aus der vertraulichen Sperrliste"',
    `regex = '''(?i)(?:${pattern})'''`,
  ].join('\n');
}
