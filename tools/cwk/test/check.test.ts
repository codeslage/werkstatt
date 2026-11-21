import { describe, expect, it } from 'vitest';
import { checkProject, type CheckInput } from '../src/check.ts';
import type { ManifestFile } from '../src/schema.ts';

// AK-9: Jede CWK-Datei entspricht dem gepinnten Stand (exakt bzw. außerhalb des Projektblocks),
// Workflow-Verweise zeigen genau auf diesen Stand, und der Stand wird nicht zurückgestuft.

const SHA = '1'.repeat(40);
const OLD = '0'.repeat(40);

const CONSTITUTION =
  '# Constitution\n\n## I. Spec zuerst\n\nKein Vorhaben ohne Spec.\n\n## II. Tests\n\nTests beweisen.\n';
const CLAUDE = [
  '# CLAUDE.md',
  '',
  'Regeln für jede Sitzung.',
  '',
  '<!-- cwk:project:start -->',
  '<!-- cwk:project:end -->',
  '',
].join('\n');
const CI = [
  'jobs:',
  '  rules:',
  '    uses: codeslage/werkstatt/.github/workflows/cwk-rules.yml@CWK_REF',
  '  code:',
  '    uses: codeslage/werkstatt/.github/workflows/cwk-code.yml@CWK_REF',
  '  # cwk:project:start',
  '  # cwk:project:end',
  '',
].join('\n');
const ESLINT = 'export default [];\n';

const FILES: ManifestFile[] = [
  { source: 'CONSTITUTION.md', target: 'CONSTITUTION.md', part: 'rules', mode: 'exact' },
  { source: 'cwk/files/CLAUDE.md', target: 'CLAUDE.md', part: 'rules', mode: 'extendable' },
  { source: 'cwk/files/ci.yml', target: '.github/workflows/ci.yml', part: 'rules', mode: 'extendable' },
  { source: 'packages/config/eslint.config.js', target: 'eslint.config.js', part: 'code', mode: 'exact' },
];
const SOURCE: Record<string, string> = {
  'CONSTITUTION.md': CONSTITUTION,
  'cwk/files/CLAUDE.md': CLAUDE,
  'cwk/files/ci.yml': CI,
  'packages/config/eslint.config.js': ESLINT,
};
const pinned = (text: string) => text.replaceAll('@CWK_REF', `@${SHA}`);

function input(project: Record<string, string | undefined> = {}, extra: Partial<CheckInput> = {}): CheckInput {
  const target: Record<string, string | undefined> = {
    'CONSTITUTION.md': CONSTITUTION,
    'CLAUDE.md': CLAUDE,
    '.github/workflows/ci.yml': pinned(CI),
    'eslint.config.js': ESLINT,
    ...project,
  };
  return {
    manifest: { files: FILES },
    config: { cwk: SHA, code: true, docs: 'public' },
    readSource: (path) => SOURCE[path],
    readTarget: (path) => target[path],
    workflows: Object.entries(target)
      .filter(([path, text]) => path.startsWith('.github/workflows/') && text !== undefined)
      .map(([path, text]) => ({ path, text: text ?? '' })),
    isAncestor: () => true,
    ...extra,
  };
}

describe('cwk check: Abgleich der Dateien (AK-9)', () => {
  it('ist grün, wenn alles dem gepinnten Stand entspricht', () => {
    expect(checkProject(input())).toEqual([]);
  });

  it('meldet einen gelöschten Artikel in einer exakten Datei', () => {
    const changed = CONSTITUTION.replace('## II. Tests\n\nTests beweisen.\n', '');
    expect(checkProject(input({ 'CONSTITUTION.md': changed }))).toEqual([
      'CONSTITUTION.md: weicht vom CWK-Stand ab (Modus exact)',
    ]);
  });

  it('meldet einen umformulierten Satz außerhalb des Projektblocks', () => {
    const changed = CLAUDE.replace('Regeln für jede Sitzung.', 'Regeln für manche Sitzungen.');
    expect(checkProject(input({ 'CLAUDE.md': changed }))).toEqual([
      'CLAUDE.md: weicht außerhalb des Projektblocks vom CWK-Stand ab',
    ]);
  });

  it('meldet einen entfernten CI-Baustein', () => {
    const changed = pinned(CI).replace(/ {2}code:\n.*\n/, '');
    expect(checkProject(input({ '.github/workflows/ci.yml': changed }))).toEqual([
      '.github/workflows/ci.yml: weicht außerhalb des Projektblocks vom CWK-Stand ab',
    ]);
  });

  it('erhält Ergänzungen im Projektblock (Markdown und YAML)', () => {
    const md = CLAUDE.replace('<!-- cwk:project:end -->', '## Eigene Regeln\n\nNur hier.\n<!-- cwk:project:end -->');
    const yml = pinned(CI).replace('  # cwk:project:end', '  e2e:\n    runs-on: ubuntu-latest\n  # cwk:project:end');
    expect(checkProject(input({ 'CLAUDE.md': md, '.github/workflows/ci.yml': yml }))).toEqual([]);
  });

  it('meldet einen fehlenden oder doppelten Projektblock', () => {
    const without = CLAUDE.replace('<!-- cwk:project:start -->\n<!-- cwk:project:end -->\n', '');
    const twice = `${CLAUDE}<!-- cwk:project:start -->\n<!-- cwk:project:end -->\n`;
    expect(checkProject(input({ 'CLAUDE.md': without }))).toEqual([
      'CLAUDE.md: weicht außerhalb des Projektblocks vom CWK-Stand ab',
    ]);
    expect(checkProject(input({ 'CLAUDE.md': twice }))).toEqual([
      'CLAUDE.md: Projektblock höchstens einmal, Start vor Ende',
    ]);
  });

  it('meldet fehlende Dateien und prüft den Code-Teil nur bei Repos mit Code', () => {
    expect(checkProject(input({ 'eslint.config.js': undefined }))).toEqual(['eslint.config.js: fehlt']);
    const noCode = { config: { cwk: SHA, code: false, docs: 'none' as const } };
    expect(checkProject(input({ 'eslint.config.js': undefined }, noCode))).toEqual([]);
  });

  it('meldet eine Quelle, die es im CWK-Stand nicht gibt', () => {
    expect(
      checkProject(input({}, { readSource: (path) => (path === 'CONSTITUTION.md' ? undefined : SOURCE[path]) })),
    ).toEqual(['CONSTITUTION.md: Quelle CONSTITUTION.md fehlt im CWK-Stand']);
  });
});

describe('cwk check: Pins und Rückstufung (AK-9)', () => {
  it('meldet einen Workflow-Verweis, der nicht auf cwk.json zeigt', () => {
    const fork = '  x:\n    uses: codeslage/werkstatt/.github/workflows/cwk-code.yml@main\n';
    const other = { path: '.github/workflows/extra.yml', text: fork };
    expect(checkProject(input({}, { workflows: [...input().workflows, other] }))).toEqual([
      '.github/workflows/extra.yml: Verweis auf codeslage/werkstatt mit @main statt @' + SHA,
    ]);
  });

  it('erkennt Verweise unabhängig von Groß- und Kleinschreibung', () => {
    const other = { path: '.github/workflows/x.yml', text: 'uses: Codeslage/Werkstatt/.github/workflows/a.yml@main\n' };
    expect(checkProject(input({}, { workflows: [...input().workflows, other] }))).toEqual([
      '.github/workflows/x.yml: Verweis auf codeslage/werkstatt mit @main statt @' + SHA,
    ]);
  });

  it('meldet einen Stand, der kein Nachfolger des Basis-Branches ist', () => {
    const ancestorCalls: [string, string][] = [];
    const isAncestor = (older: string, newer: string) => {
      ancestorCalls.push([older, newer]);
      return false;
    };
    expect(checkProject(input({}, { baseCwk: OLD, isAncestor }))).toEqual([
      `cwk.json: Stand ${SHA} ist kein Nachfolger von ${OLD} auf dem Basis-Branch (Rückstufung)`,
    ]);
    expect(ancestorCalls).toEqual([[OLD, SHA]]);
  });

  it('akzeptiert einen neueren oder gleichen Stand', () => {
    expect(checkProject(input({}, { baseCwk: OLD }))).toEqual([]);
    expect(checkProject(input({}, { baseCwk: SHA, isAncestor: () => false }))).toEqual([]);
  });
});
