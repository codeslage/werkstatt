import { join } from 'node:path';
import * as prettier from 'prettier';
import { describe, expect, it } from 'vitest';

const REPO_ROOT = join(import.meta.dirname, '..', '..', '..');

// Geprüft wird mit der echten Repo-Konfiguration: Fehlt oder ändert sie sich, werden diese Tests rot.
async function isFormatted(file: string, source: string): Promise<boolean> {
  const filepath = join(REPO_ROOT, file);
  const config = await prettier.resolveConfig(filepath, { editorconfig: true });
  if (config === null) throw new Error('Keine Prettier-Konfiguration im Repo gefunden');
  return prettier.check(source, { ...config, filepath });
}

const cases: [string, string, string][] = [
  ['beispiel.ts', "const x = { a: 'eins', b: [1, 2] };\n", 'const   x={a:"eins",b:[1,2]}\n'],
  ['beispiel.json', '{ "a": 1, "b": [1, 2] }\n', '{"a":1,\n"b":[1,2]}\n'],
  ['beispiel.yaml', 'liste:\n  - eins\n  - zwei\n', 'liste:\n    -   eins\n    -   zwei\n'],
  ['beispiel.md', '# Titel\n\n- Punkt eins\n- Punkt zwei\n', '#   Titel\n* Punkt eins\n*   Punkt zwei\n'],
];

describe('Prettier prüft die Formatierung (AK-30)', () => {
  it.each(cases)('%s: richtig formatiert geht durch', async (file, formatted) => {
    expect(await isFormatted(file, formatted)).toBe(true);
  });

  it.each(cases)('%s: falsch formatiert wird gemeldet', async (file, _formatted, unformatted) => {
    expect(await isFormatted(file, unformatted)).toBe(false);
  });
});
