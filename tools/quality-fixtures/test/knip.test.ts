import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

const KNIP = join(import.meta.dirname, '..', 'node_modules', 'knip', 'bin', 'knip.js');
// Die Fixtures nutzen die echte Repo-Konfiguration: Wird sie gelockert, werden diese Tests rot.
const REPO_KNIP_CONFIG = JSON.parse(readFileSync(join(import.meta.dirname, '..', '..', '..', 'knip.json'), 'utf8'));
const tempDirs: string[] = [];

afterEach(() => {
  for (const dir of tempDirs.splice(0)) rmSync(dir, { recursive: true, force: true });
});

type Violation = 'files' | 'exports' | 'dependencies';

/** Kleines Projekt, das sauber ist, solange keine Verletzung eingebaut wird. */
function project(violation?: Violation): string {
  const dir = mkdtempSync(join(tmpdir(), 'knip-'));
  tempDirs.push(dir);
  mkdirSync(join(dir, 'src'));
  const dependencies = violation === 'dependencies' ? { 'left-pad': '1.3.0' } : {};
  writeFileSync(
    join(dir, 'package.json'),
    JSON.stringify({ name: 'fixture', private: true, type: 'module', dependencies }),
  );
  writeFileSync(
    join(dir, 'knip.json'),
    JSON.stringify({ ...REPO_KNIP_CONFIG, entry: ['src/index.ts'], project: ['src/**/*.ts'] }),
  );
  writeFileSync(join(dir, 'src', 'index.ts'), "import { used } from './used.ts';\nconsole.log(used);\n");
  const extraExport = violation === 'exports' ? 'export const unusedExport = 2;\n' : '';
  writeFileSync(join(dir, 'src', 'used.ts'), `export const used = 1;\n${extraExport}`);
  if (violation === 'files') writeFileSync(join(dir, 'src', 'orphan.ts'), 'export const orphan = 3;\n');
  spawnSync('git', ['init', '-q'], { cwd: dir });
  return dir;
}

interface KnipResult {
  exitCode: number | null;
  found: Record<Violation, string[]>;
}

function knip(dir: string): KnipResult {
  const result = spawnSync(process.execPath, [KNIP, '--reporter', 'json', '--no-progress'], {
    cwd: dir,
    encoding: 'utf8',
  });
  const issues: Record<Violation, { name: string }[]>[] = JSON.parse(result.stdout || '{"issues":[]}').issues;
  const names = (key: Violation) => issues.flatMap((issue) => issue[key].map((entry) => entry.name));
  return {
    exitCode: result.status,
    found: { files: names('files'), exports: names('exports'), dependencies: names('dependencies') },
  };
}

describe('knip findet ungenutzten Code (AK-18)', () => {
  it.each([
    ['files', 'src/orphan.ts'],
    ['exports', 'unusedExport'],
    ['dependencies', 'left-pad'],
  ] as const)('meldet ungenutzte %s', (violation, name) => {
    const result = knip(project(violation));
    expect(result.exitCode).toBe(1);
    expect(result.found[violation]).toContain(name);
  });

  it('lässt ein sauberes Projekt durch', () => {
    expect(knip(project()).exitCode).toBe(0);
  });
});
