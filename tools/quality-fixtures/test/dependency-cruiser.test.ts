import { spawnSync } from 'node:child_process';
import { copyFileSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it } from 'vitest';

// Paketwurzel über den Haupteinstieg (src/main/index.mjs) finden; „package.json“ ist nicht exportiert.
const DEPCRUISE = join(
  fileURLToPath(import.meta.resolve('dependency-cruiser')),
  '..',
  '..',
  '..',
  'bin',
  'dependency-cruiser.mjs',
);
// Die Fixtures nutzen die echte Repo-Konfiguration: Wird sie gelockert, werden diese Tests rot.
const REPO_CONFIG = join(import.meta.dirname, '..', '..', '..', '.dependency-cruiser.json');
const tempDirs: string[] = [];

afterEach(() => {
  for (const dir of tempDirs.splice(0)) rmSync(dir, { recursive: true, force: true });
});

/** Legt Dateien in einem Wegwerf-Projekt an: Pfad → Inhalt. */
function project(files: Record<string, string>): string {
  const dir = mkdtempSync(join(tmpdir(), 'depcruise-'));
  tempDirs.push(dir);
  copyFileSync(REPO_CONFIG, join(dir, '.dependency-cruiser.json'));
  for (const [path, content] of Object.entries(files)) {
    mkdirSync(dirname(join(dir, path)), { recursive: true });
    writeFileSync(join(dir, path), content);
  }
  return dir;
}

interface CruiseResult {
  exitCode: number | null;
  rules: string[];
}

// Wie das Skript `pnpm depcruise`: ganzes Repo („.“) und Ausgabe „err“. Nur „err“ liefert bei
// Verstößen einen Exit-Code ungleich 0 (mit „json“ endet dependency-cruiser auch bei Verstößen mit 0).
function cruise(dir: string): CruiseResult {
  const args = [DEPCRUISE, '--config', '.dependency-cruiser.json', '--output-type', 'err', '.'];
  const result = spawnSync(process.execPath, args, { cwd: dir, encoding: 'utf8' });
  const rules = [...result.stdout.matchAll(/error (\S+):/g)].map((match) => match[1] ?? '');
  return { exitCode: result.status, rules };
}

const importFrom = (target: string): string => `import { c } from '${target}';\nexport const a = c;\n`;
const cycle = (folder: string): Record<string, string> => ({
  [`${folder}/a.ts`]: "import { b } from './b.ts';\nexport const a = b;\n",
  [`${folder}/b.ts`]: "import { a } from './a.ts';\nexport const b = a;\n",
});

describe('dependency-cruiser prüft Modulgrenzen (AK-18)', () => {
  it.each(['packages/x', 'apps/y'])('meldet einen Zyklus in %s', (folder) => {
    const result = cruise(project(cycle(folder)));
    expect(result.exitCode).not.toBe(0);
    expect(result.rules).toContain('no-circular');
  });

  it.each(['apps', 'tools', 'infra'])('meldet einen Import von packages nach %s', (target) => {
    const dir = project({
      'packages/x/a.ts': importFrom(`../../${target}/y/c.ts`),
      [`${target}/y/c.ts`]: 'export const c = 1;\n',
    });
    const result = cruise(dir);
    expect(result.exitCode).not.toBe(0);
    expect(result.rules).toContain('packages-nicht-nach-oben');
  });

  it.each([
    ['apps/y', 'tools/t'],
    ['tools/t', 'apps/y'],
    ['infra/tests', 'tools/t'],
    ['tools/t', 'tools/u'],
  ])('meldet einen Import von %s nach %s', (from, to) => {
    const dir = project({
      [`${from}/a.ts`]: importFrom(`../../${to}/c.ts`),
      [`${to}/c.ts`]: 'export const c = 1;\n',
    });
    const result = cruise(dir);
    expect(result.exitCode).not.toBe(0);
    expect(result.rules).toContain('nur-nach-packages');
  });

  it.each([
    [
      'apps → packages',
      { 'apps/y/a.ts': importFrom('../../packages/x/c.ts'), 'packages/x/c.ts': 'export const c = 1;\n' },
    ],
    [
      'innerhalb eines Pakets',
      { 'tools/t/src/a.ts': importFrom('./c.ts'), 'tools/t/src/c.ts': 'export const c = 1;\n' },
    ],
  ])('lässt erlaubte Richtung durch: %s', (_name, files) => {
    expect(cruise(project(files))).toEqual({ exitCode: 0, rules: [] });
  });
});
