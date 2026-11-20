import { spawnSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { parseManifest } from '../src/schema.ts';

// Verdrahtung des CLI (AK-3, AK-9): echte Dateien, echter Prozess, Exit-Code wie in der CI.

const REPO_ROOT = join(import.meta.dirname, '..', '..', '..');
const CLI = join(import.meta.dirname, '..', 'src', 'cli.ts');
const SHA = 'f'.repeat(40);

const run = (cwd: string, args: string[], env: Record<string, string> = {}) =>
  spawnSync('node', [CLI, ...args], { cwd, encoding: 'utf8', env: { ...process.env, ...env } });

let project = '';

/** Ein Projekt-Repo, das alle CWK-Dateien im Stand des Arbeitsverzeichnisses enthält. */
beforeAll(() => {
  project = mkdtempSync(join(tmpdir(), 'cwk-cli-'));
  const manifest = parseManifest(readFileSync(join(REPO_ROOT, 'cwk', 'manifest.json'), 'utf8'));
  for (const file of manifest.files) {
    mkdirSync(dirname(join(project, file.target)), { recursive: true });
    const text = readFileSync(join(REPO_ROOT, file.source), 'utf8').replaceAll('@CWK_REF', `@${SHA}`);
    writeFileSync(join(project, file.target), text);
  }
  writeFileSync(join(project, 'cwk.json'), JSON.stringify({ cwk: SHA }));
});

afterAll(() => rmSync(project, { recursive: true, force: true }));

describe('cwk CLI', () => {
  it('check --self ist in werkstatt grün', () => {
    const result = run(REPO_ROOT, ['check', '--self']);
    expect(result.stderr).toBe('');
    expect(result.status).toBe(0);
  });

  it('check ist für ein vollständiges Projekt grün und rot nach einer Änderung', () => {
    expect(run(project, ['check', '--source', REPO_ROOT]).status).toBe(0);
    const copy = mkdtempSync(join(tmpdir(), 'cwk-cli-'));
    cpSync(project, copy, { recursive: true });
    writeFileSync(join(copy, 'CONSTITUTION.md'), '# Constitution\n');
    const result = run(copy, ['check', '--source', REPO_ROOT]);
    rmSync(copy, { recursive: true, force: true });
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('CONSTITUTION.md: weicht vom CWK-Stand ab (Modus exact)');
  });

  it('check ist rot ohne cwk.json', () => {
    const result = run(tmpdir(), ['check', '--source', REPO_ROOT]);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('cwk.json fehlt');
  });

  it('ci-ok liest NEEDS und cwk.json', () => {
    const skipped = JSON.stringify({ rules: { result: 'success' }, code: { result: 'skipped' } });
    expect(run(project, ['ci-ok'], { NEEDS: skipped }).status).toBe(1);
    writeFileSync(join(project, 'cwk.json'), JSON.stringify({ cwk: SHA, code: false }));
    expect(run(project, ['ci-ok'], { NEEDS: skipped }).status).toBe(0);
  });

  it('kennt nur die eigenen Befehle', () => {
    expect(run(project, ['unbekannt']).status).toBe(2);
  });
});
