// cspell:ignore Fehlre mistkae
import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

const REPO = join(import.meta.dirname, '..', '..', '..');
const CSPELL = join(REPO, 'node_modules', 'cspell', 'bin.mjs');
// Die Fixtures nutzen die echte Repo-Konfiguration: Wird sie gelockert, werden diese Tests rot.
const REPO_CONFIG = join(REPO, 'cspell.config.yaml');
const tempDirs: string[] = [];

afterEach(() => {
  for (const dir of tempDirs.splice(0)) rmSync(dir, { recursive: true, force: true });
});

interface SpellResult {
  exitCode: number | null;
  output: string;
}

function spellcheck(text: string): SpellResult {
  const dir = mkdtempSync(join(tmpdir(), 'cspell-'));
  tempDirs.push(dir);
  writeFileSync(join(dir, 'text.md'), text);
  const result = spawnSync(
    process.execPath,
    [CSPELL, '--config', REPO_CONFIG, '--no-progress', '--no-summary', 'text.md'],
    {
      cwd: dir,
      encoding: 'utf8',
    },
  );
  return { exitCode: result.status, output: result.stdout + result.stderr };
}

describe('cspell prüft die Rechtschreibung (Deutsch und Englisch)', () => {
  it.each([
    ['Deutsch', 'Die Prüfung findet einen Fehlre im Text.\n', 'Fehlre'],
    ['Englisch', 'The check finds a mistkae in the text.\n', 'mistkae'],
  ])('meldet einen Tippfehler auf %s', (_language, text, word) => {
    const result = spellcheck(text);
    expect(result.exitCode).toBe(1);
    expect(result.output).toContain(word);
  });

  it('lässt korrektes Deutsch mit Umlauten und ß und korrektes Englisch durch', () => {
    const text = 'Die Größe der Straße ändert sich nicht. Übergabe am Freitag.\nThe server returns a valid response.\n';
    const result = spellcheck(text);
    expect(result.output).toBe('');
    expect(result.exitCode).toBe(0);
  });
});
