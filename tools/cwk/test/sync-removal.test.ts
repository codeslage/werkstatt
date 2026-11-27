import { afterEach, describe, expect, it } from 'vitest';
import { BLOCK, cleanup, exists as existsIn, manifest, OLD, OUTDATED, read, setup, sync } from './sync-fixtures.ts';

// T-48 (AK-7): `cwk sync` löscht CWK-Dateien, die der neue Stand gestrichen oder umbenannt hat, und nur diese.

afterEach(cleanup);

const rules = (target: string) => ({ source: `alt/${target}`, target, part: 'rules', mode: 'exact' }) as const;
const exists = (path: string) => existsIn('demo', path);
const added = (lines: string[]) =>
  lines
    .find((line) => line.includes(' add -- '))
    ?.split(' -- ')[1]
    ?.split(' ') ?? [];

describe('cwk sync: gestrichene CWK-Dateien (AK-7, T-48)', () => {
  const only = [['gh api /repos/codeslage/demo', { stdout: 'public\n' }] as const];
  const repo = { kind: 'repo', name: 'demo' } as const;
  it('löscht eine Datei, die im neuen Manifest fehlt, und nimmt die Löschung in den Commit', () => {
    const { lines, deps } = setup({ demo: { main: { ...OUTDATED, 'docs/alt.md': 'alt\n' } } }, only);
    deps.readManifest = (sha) => (sha === OLD ? { files: [...manifest.files, rules('docs/alt.md')] } : undefined);
    expect(sync(repo, deps).errors).toEqual([]);
    expect(exists('docs/alt.md')).toBe(false);
    expect(added(lines())).toContain('docs/alt.md');
  });

  // Review PR-3b, Befund 2: Der Projektblock der alten Datei geht nicht verloren.
  it('löscht bei einer Umbenennung das alte Ziel und schreibt das neue mit dem Projektblock', () => {
    const before = { ...OUTDATED, 'CLAUDE-alt.md': `# Basis alt\n${BLOCK('Eigene Regel\n')}` };
    delete (before as Record<string, string>)['CLAUDE.md'];
    const { deps } = setup({ demo: { main: before } }, only);
    const renamed = manifest.files.map((file) =>
      file.target === 'CLAUDE.md' ? { ...file, target: 'CLAUDE-alt.md' } : file,
    );
    deps.readManifest = () => ({ files: renamed });
    sync(repo, deps);
    expect(exists('CLAUDE-alt.md')).toBe(false);
    expect(read('demo', 'CLAUDE.md')).toBe(`# Basis neu\n${BLOCK('Eigene Regel\n')}`);
  });

  // Review PR-3b, Befund 1: Ein offener Sync-PR kann schon auf einem späteren Stand stehen als main.
  it('löscht eine Datei, die erst ein Zwischenstand auf dem offenen cwk/sync gebracht hat', () => {
    const MID = 'c'.repeat(40);
    const branch = { ...OUTDATED, 'cwk.json': `{ "cwk": "${MID}", "code": true }\n`, 'docs/zwischen.md': 'z\n' };
    const { lines, deps } = setup({ demo: { main: OUTDATED, branch, pr: 5 } }, only);
    deps.readManifest = (sha) => (sha === MID ? { files: [...manifest.files, rules('docs/zwischen.md')] } : manifest);
    expect(sync(repo, deps).errors).toEqual([]);
    expect(exists('docs/zwischen.md')).toBe(false);
    expect(added(lines())).toContain('docs/zwischen.md');
  });
});

describe('cwk sync: was nicht gelöscht wird (AK-7, T-48)', () => {
  const only = [['gh api /repos/codeslage/demo', { stdout: 'public\n' }] as const];
  const repo = { kind: 'repo', name: 'demo' } as const;

  it('lässt Dateien des Projekts außerhalb des bisherigen Manifests stehen', () => {
    const { lines, deps } = setup({ demo: { main: { ...OUTDATED, 'notes.md': 'eigen\n' } } }, only);
    sync(repo, deps);
    expect(exists('notes.md')).toBe(true);
    expect(added(lines())).not.toContain('notes.md');
  });

  it('fasst ohne Code die Ziele des bisherigen Code-Teils nicht an', () => {
    const noCode = { ...OUTDATED, 'cwk.json': `{ "cwk": "${OLD}", "code": false }\n`, 'alt.config.js': 'eigen\n' };
    const { deps } = setup({ demo: { main: noCode } }, only);
    const oldCode = { source: 'alt.config.js', target: 'alt.config.js', part: 'code', mode: 'exact' } as const;
    deps.readManifest = () => ({ files: [...manifest.files, oldCode] });
    sync(repo, deps);
    expect(exists('alt.config.js')).toBe(true);
  });

  it('ist rot, wenn das Manifest im bisherigen Stand nicht lesbar ist', () => {
    const { lines, deps } = setup({ demo: { main: OUTDATED } }, only);
    deps.readManifest = () => undefined;
    expect(sync(repo, deps).errors).toEqual([
      `demo: cwk/manifest.json im bisherigen Stand ${OLD.slice(0, 7)} nicht lesbar`,
    ]);
    expect(lines().some((line) => / push /.test(line))).toBe(false);
  });
});
