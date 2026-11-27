import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { parseManifest } from '../src/schema.ts';

// AK-1, AK-9: Das echte Manifest in werkstatt ist gültig, jede Quelle existiert, jedes Ziel kommt einmal vor.

const REPO_ROOT = join(import.meta.dirname, '..', '..', '..');
const manifest = parseManifest(readFileSync(join(REPO_ROOT, 'cwk', 'manifest.json'), 'utf8'));
const targets = manifest.files.map((file) => file.target);

describe('cwk/manifest.json (AK-1, AK-9)', () => {
  it('ist gültig und hat Regel- und Code-Teil', () => {
    expect(new Set(manifest.files.map((file) => file.part))).toEqual(new Set(['rules', 'code']));
  });

  it.each(manifest.files.map((file) => [file.source]))('Quelle %s existiert', (source) => {
    expect(existsSync(join(REPO_ROOT, source))).toBe(true);
  });

  it('enthält die Grundlagen des Regel-Teils', () => {
    expect(targets).toEqual(
      expect.arrayContaining([
        'CONSTITUTION.md',
        'CLAUDE.md',
        'CODEOWNERS',
        '.github/workflows/ci.yml',
        'docs/prozess/sdd-ablauf.md',
        'specs/_vorlagen/spec.md',
        '.claude/commands/sdd-implement.md',
        '.claude/agents/code-reviewer.md',
      ]),
    );
  });

  // Plan 05, T-20: Eine Änderung an diesen Dateien prüft den Sync je Teil, ohne einen Prozess zu berühren.
  it('hat je Teil eine Probe-Datei für den Sync-Test (T-20)', () => {
    const probes = manifest.files.filter((file) => file.target.startsWith('.cwk/'));
    expect(probes.map(({ target, part, mode }) => ({ target, part, mode }))).toEqual([
      { target: '.cwk/probe.md', part: 'rules', mode: 'exact' },
      { target: '.cwk/probe-code.md', part: 'code', mode: 'exact' },
    ]);
  });

  it('jede ergänzbare Quelle hat genau einen Projektblock', () => {
    for (const file of manifest.files.filter((entry) => entry.mode === 'extendable')) {
      const text = readFileSync(join(REPO_ROOT, file.source), 'utf8');
      expect(text.match(/cwk:project:start/g), file.source).toHaveLength(1);
      expect(text.match(/cwk:project:end/g), file.source).toHaveLength(1);
    }
  });

  it('CODEOWNERS macht das Team maintainers zum Code-Owner aller Dateien, exakt', () => {
    const codeowners = manifest.files.find((file) => file.target === 'CODEOWNERS');
    expect(codeowners?.mode).toBe('exact');
    expect(readFileSync(join(REPO_ROOT, codeowners?.source ?? ''), 'utf8')).toBe('* @codeslage/maintainers\n');
  });

  it('die ci.yml der Projekte ruft beide Workflows mit Platzhalter auf', () => {
    const ci = readFileSync(join(REPO_ROOT, 'cwk', 'files', '.github', 'workflows', 'ci.yml'), 'utf8');
    expect(ci).toContain('uses: codeslage/werkstatt/.github/workflows/cwk-rules.yml@CWK_REF');
    expect(ci).toContain('uses: codeslage/werkstatt/.github/workflows/cwk-code.yml@CWK_REF');
    expect(ci).toMatch(/^ {2}ci-ok:\n {4}name: ci-ok\n {4}if: always\(\)$/m);
  });
});
