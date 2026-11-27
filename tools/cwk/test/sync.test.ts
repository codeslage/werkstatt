import { afterEach, describe, expect, it } from 'vitest';
import { BLOCK, clones, cleanup, CURRENT, NEW, OLD, OUTDATED, read, setup, sync } from './sync-fixtures.ts';

// AK-7, AK-25, AK-27: `cwk sync` bringt den neuesten CWK-Stand per PR auf Branch `cwk/sync` in jedes Repo der
// Soll-Menge. Ohne Force-Push, Projektblock und fremde Commits bleiben, ohne Änderung kein PR.

afterEach(cleanup);

describe('cwk sync: Soll-Menge (AK-7)', () => {
  const installation = [
    { name: 'cwk-sample', visibility: 'public', archived: false },
    { name: 'werkstatt', visibility: 'public', archived: false },
    { name: 'alt', visibility: 'public', archived: true },
    { name: 'platform', visibility: 'private', archived: false },
  ];
  const listing = [
    [
      'gh api /installation/repositories',
      { stdout: installation.map((repo) => JSON.stringify(repo)).join('\n') + '\n' },
    ] as const,
  ];

  it('nimmt mit dem Token der Lese-App alle öffentlichen Projekt-Repos, ohne werkstatt und Archiv', () => {
    const { calls, lines, deps } = setup({ 'cwk-sample': { main: OUTDATED } }, listing);
    const result = sync({ kind: 'public', readToken: 'lese-token' }, deps);
    expect(result.errors).toEqual([]);
    expect(calls.find((call) => call.line.startsWith('gh api /installation/repositories'))?.env).toEqual({
      GH_TOKEN: 'lese-token',
    });
    expect(clones(lines())).toEqual(['cwk-sample']);
  });

  it('nimmt mit --private alle privaten Repos aus dem gh-Login', () => {
    const repos = { platform: { main: CURRENT }, internal: { main: CURRENT } };
    const privateList = [
      [
        'gh repo list codeslage --visibility private',
        { stdout: JSON.stringify([{ name: 'platform' }, { name: 'internal' }]) },
      ] as const,
    ];
    const { lines, deps } = setup(repos, privateList);
    expect(sync({ kind: 'private' }, deps).errors).toEqual([]);
    expect(clones(lines())).toEqual(['platform', 'internal']);
  });

  it('nimmt mit --repo genau ein Repo, aber nie werkstatt', () => {
    const repoInfo = [['gh api /repos/codeslage/internal --jq .visibility', { stdout: 'private\n' }] as const];
    const { lines, deps } = setup({ internal: { main: CURRENT } }, repoInfo);
    expect(sync({ kind: 'repo', name: 'internal' }, deps).errors).toEqual([]);
    expect(clones(lines())).toEqual(['internal']);
    expect(sync({ kind: 'repo', name: 'werkstatt' }, deps).errors).toEqual([
      'werkstatt: ist die CWK-Quelle, kein Ziel für den Sync',
    ]);
    // GitHub unterscheidet bei Repo-Namen nicht nach Groß- und Kleinschreibung (Review PR-3a, Befund 4).
    expect(sync({ kind: 'repo', name: 'Werkstatt' }, deps).errors).toEqual([
      'werkstatt: ist die CWK-Quelle, kein Ziel für den Sync',
    ]);
  });
});

describe('cwk sync: Soll-Menge, Fehlerfälle (AK-7)', () => {
  it('lehnt eine Antwort in unerwarteter Form ab (Artikel VII)', () => {
    const broken = [['gh api /installation/repositories', { stdout: '{"name": 1}\n' }] as const];
    const { deps } = setup({}, broken);
    expect(sync({ kind: 'public', readToken: 'x' }, deps).errors).toEqual([
      'Soll-Menge: unerwartete Antwort von GitHub',
    ]);
  });

  it('meldet ein Repo ohne cwk.json als nicht angebunden und synchronisiert die übrigen', () => {
    const twoPublic = [
      [
        'gh api /installation/repositories',
        {
          stdout:
            '{"name":"neu","visibility":"public","archived":false}\n{"name":"cwk-sample","visibility":"public","archived":false}\n',
        },
      ] as const,
    ];
    const { lines, deps } = setup({ neu: { main: { 'README.md': '' } }, 'cwk-sample': { main: OUTDATED } }, twoPublic);
    const result = sync({ kind: 'public', readToken: 'x' }, deps);
    expect(result.errors).toEqual(['neu: nicht angebunden, cwk.json fehlt']);
    expect(lines().some((line) => line.startsWith('gh pr create -R codeslage/cwk-sample'))).toBe(true);
  });
});

describe('cwk sync: Dateien je Teil (AK-7, AK-27)', () => {
  const only = (name: string) => [['gh api /repos/codeslage/' + name, { stdout: 'public\n' }] as const];

  it('schreibt mit Code alle CWK-Dateien im neuen Stand und setzt cwk.json und Pins auf ihn', () => {
    const { lines, deps } = setup({ demo: { main: OUTDATED } }, only('demo'));
    sync({ kind: 'repo', name: 'demo' }, deps);
    expect(read('demo', 'CONSTITUTION.md')).toBe('Constitution neu\n');
    expect(read('demo', 'eslint.config.js')).toBe('eslint neu\n');
    expect(read('demo', '.github/workflows/ci.yml')).toContain(`cwk-rules.yml@${NEW}`);
    expect(read('demo', 'cwk.json')).toBe(`{ "cwk": "${NEW}", "code": true }\n`);
    const add = lines().find((line) => line.includes(' add -- '));
    expect(add?.split(' -- ')[1]?.split(' ').sort()).toEqual(
      ['.github/workflows/ci.yml', 'CLAUDE.md', 'CONSTITUTION.md', 'cwk.json', 'eslint.config.js'].sort(),
    );
  });

  it('lässt ohne Code den Code-Teil weg', () => {
    const noCode = { ...OUTDATED, 'cwk.json': `{ "cwk": "${OLD}", "code": false }\n` };
    delete (noCode as Record<string, string>)['eslint.config.js'];
    const { lines, deps } = setup({ demo: { main: noCode } }, only('demo'));
    sync({ kind: 'repo', name: 'demo' }, deps);
    expect(lines().find((line) => line.includes(' add -- '))).not.toContain('eslint.config.js');
    expect(() => read('demo', 'eslint.config.js')).toThrow();
  });
});

describe('cwk sync: Branch und PR (AK-8, AK-25)', () => {
  const only = [['gh api /repos/codeslage/demo', { stdout: 'public\n' }] as const];
  const repo = { kind: 'repo', name: 'demo' } as const;
  const noForce = (lines: string[]) =>
    expect(lines.filter((line) => /--force|push -f|reset --hard|checkout -q -B/.test(line))).toEqual([]);

  it('legt den Branch neu an, committet, pusht ohne Force und öffnet einen PR mit altem und neuem Stand', () => {
    const { calls, lines, deps } = setup({ demo: { main: OUTDATED } }, only);
    const result = sync(repo, deps);
    expect(result).toEqual({ errors: [], notes: ['demo: Sync-PR angelegt'] });
    const order = lines();
    expect(order.some((line) => line.endsWith(' checkout -q -b cwk/sync'))).toBe(true);
    expect(order.some((line) => line.endsWith(' push -q origin cwk/sync'))).toBe(true);
    noForce(order);
    const create = calls.find((call) =>
      call.line.startsWith('gh pr create -R codeslage/demo --base main --head cwk/sync'),
    );
    expect(create?.line).toContain(OLD.slice(0, 7));
    expect(create?.line).toContain(`https://github.com/codeslage/werkstatt/compare/${OLD}...${NEW}`);
  });

  it('setzt bei einer zweiten Änderung auf den Branch auf und aktualisiert denselben PR', () => {
    const branch = { ...OUTDATED, 'CONSTITUTION.md': 'Constitution Zwischenstand\n' };
    const { lines, deps } = setup({ demo: { main: OUTDATED, branch, pr: 5 } }, only);
    expect(sync(repo, deps)).toEqual({ errors: [], notes: ['demo: Sync-PR #5 aktualisiert'] });
    const order = lines();
    expect(order.some((line) => line.endsWith(' checkout -q --track origin/cwk/sync'))).toBe(true);
    expect(order.some((line) => line.endsWith(' merge -q --no-edit origin/main'))).toBe(true);
    expect(order.some((line) => line.startsWith('gh pr edit 5 -R codeslage/demo'))).toBe(true);
    expect(order.some((line) => line.startsWith('gh pr create'))).toBe(false);
    expect(order.some((line) => line.includes(' checkout -q -b '))).toBe(false);
    noForce(order);
  });

  it('behält einen fremden Commit und den Projektblock aus dem Stand des Branches', () => {
    const branch = {
      ...OUTDATED,
      'CLAUDE.md': `# Basis alt\n${BLOCK('Eigene Regel\n')}`,
      'eigenes.md': 'vom Inhaber\n',
    };
    const { deps } = setup({ demo: { main: OUTDATED, branch, pr: 5 } }, only);
    sync(repo, deps);
    expect(read('demo', 'CLAUDE.md')).toBe(`# Basis neu\n${BLOCK('Eigene Regel\n')}`);
    expect(read('demo', 'eigenes.md')).toBe('vom Inhaber\n');
  });
});

describe('cwk sync: ohne neue Änderung (AK-7, AK-25)', () => {
  const only = [['gh api /repos/codeslage/demo', { stdout: 'public\n' }] as const];
  const repo = { kind: 'repo', name: 'demo' } as const;

  // Review PR-3a, Befund 1: Push geklappt, PR nicht angelegt (oder ohne Merge geschlossen) – sonst bliebe das still.
  it('legt ohne Änderung einen PR an, wenn der Branch vor main liegt und keiner offen ist', () => {
    const { lines, deps } = setup({ demo: { main: OUTDATED, branch: CURRENT, ahead: true } }, only);
    expect(sync(repo, deps)).toEqual({ errors: [], notes: ['demo: Sync-PR angelegt'] });
    expect(lines().some((line) => / commit /.test(line))).toBe(false);
    expect(lines().some((line) => line.endsWith(' push -q origin cwk/sync'))).toBe(true);
    expect(lines().some((line) => line.startsWith('gh pr create -R codeslage/demo'))).toBe(true);
  });

  it('meldet ohne Änderung „aktuell“, wenn für den Branch schon ein PR offen ist', () => {
    const { lines, deps } = setup({ demo: { main: OUTDATED, branch: CURRENT, ahead: true, pr: 5 } }, only);
    expect(sync(repo, deps)).toEqual({ errors: [], notes: ['demo: aktuell'] });
    expect(lines().filter((line) => / (commit|push) |^gh pr (create|edit)/.test(line))).toEqual([]);
  });

  it('macht ohne Änderung nichts: kein Commit, kein Push, kein PR', () => {
    const { lines, deps } = setup({ demo: { main: CURRENT } }, only);
    expect(sync(repo, deps)).toEqual({ errors: [], notes: ['demo: aktuell'] });
    expect(lines().filter((line) => / (commit|push) |^gh pr (create|edit)/.test(line))).toEqual([]);
  });
});
