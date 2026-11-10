import { spawnSync } from 'node:child_process';
import { copyFileSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

// Paketwurzel über den Haupteinstieg (src/main/index.mjs) finden; „package.json“ ist nicht exportiert.
const DEPCRUISE = join(fileURLToPath(import.meta.resolve('dependency-cruiser')), '..', '..', '..', 'bin', 'dependency-cruiser.mjs');
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

// Ausgabe „err“ wie im Skript `pnpm depcruise`: Nur sie liefert bei Verstößen einen Exit-Code ungleich 0
// (mit „json“ endet dependency-cruiser auch bei Verstößen mit 0).
function cruise(dir: string, targets: string[]): CruiseResult {
  const args = [DEPCRUISE, '--config', '.dependency-cruiser.json', '--output-type', 'err', ...targets];
  const result = spawnSync(process.execPath, args, { cwd: dir, encoding: 'utf8' });
  const rules = [...result.stdout.matchAll(/error (\S+):/g)].map((match) => match[1] ?? '');
  return { exitCode: result.status, rules };
}

describe('dependency-cruiser prüft Modulgrenzen (AK-18)', () => {
  it('meldet einen Zyklus', () => {
    const dir = project({
      'packages/x/a.ts': "import { b } from './b.ts';\nexport const a = b;\n",
      'packages/x/b.ts': "import { a } from './a.ts';\nexport const b = a;\n",
    });
    const result = cruise(dir, ['packages']);
    expect(result.exitCode).not.toBe(0);
    expect(result.rules).toContain('no-circular');
  });

  it.each(['apps', 'tools', 'infra'])('meldet einen Import von packages nach %s', (target) => {
    const dir = project({
      'packages/x/a.ts': `import { c } from '../../${target}/y/c.ts';\nexport const a = c;\n`,
      [`${target}/y/c.ts`]: 'export const c = 1;\n',
    });
    const result = cruise(dir, ['packages', target]);
    expect(result.exitCode).not.toBe(0);
    expect(result.rules).toContain('packages-nicht-nach-oben');
  });

  it('lässt erlaubte Richtungen durch (apps → packages)', () => {
    const dir = project({
      'apps/y/c.ts': "import { a } from '../../packages/x/a.ts';\nexport const c = a;\n",
      'packages/x/a.ts': 'export const a = 1;\n',
    });
    expect(cruise(dir, ['apps', 'packages'])).toEqual({ exitCode: 0, rules: [] });
  });
});
