import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import type { Manifest } from '../src/schema.ts';
import { type SyncDeps, type SyncScope, syncProjects } from '../src/sync.ts';
import { fakeRun } from './fake-run.ts';

// AK-7, AK-25, AK-27: `cwk sync` bringt den neuesten CWK-Stand per PR auf Branch `cwk/sync` in jedes Repo der
// Soll-Menge. Ohne Force-Push, Projektblock und fremde Commits bleiben, ohne Änderung kein PR.

const OLD = 'a'.repeat(40);
const NEW = 'b'.repeat(40);
const manifest: Manifest = {
  files: [
    { source: 'CONSTITUTION.md', target: 'CONSTITUTION.md', part: 'rules', mode: 'exact' },
    { source: 'cwk/CLAUDE.md', target: 'CLAUDE.md', part: 'rules', mode: 'extendable' },
    { source: 'cwk/ci.yml', target: '.github/workflows/ci.yml', part: 'rules', mode: 'exact' },
    { source: 'packages/config/eslint.config.js', target: 'eslint.config.js', part: 'code', mode: 'exact' },
  ],
};
const BLOCK = (content: string) => `<!-- cwk:project:start -->\n${content}<!-- cwk:project:end -->\n`;
const SOURCE: Record<string, string> = {
  'CONSTITUTION.md': 'Constitution neu\n',
  'cwk/CLAUDE.md': `# Basis neu\n${BLOCK('')}`,
  'cwk/ci.yml': 'uses: codeslage/werkstatt/.github/workflows/cwk-rules.yml@CWK_REF\n',
  'packages/config/eslint.config.js': 'eslint neu\n',
};
/** Stand eines Projekts, das bereits auf NEW ist. */
const CURRENT: Record<string, string> = {
  'cwk.json': `{ "cwk": "${NEW}", "code": true }\n`,
  'CONSTITUTION.md': 'Constitution neu\n',
  'CLAUDE.md': `# Basis neu\n${BLOCK('')}`,
  '.github/workflows/ci.yml': `uses: codeslage/werkstatt/.github/workflows/cwk-rules.yml@${NEW}\n`,
  'eslint.config.js': 'eslint neu\n',
};
const OUTDATED: Record<string, string> = {
  'cwk.json': `{ "cwk": "${OLD}", "code": true }\n`,
  'CONSTITUTION.md': 'Constitution alt\n',
  'CLAUDE.md': `# Basis alt\n${BLOCK('')}`,
  '.github/workflows/ci.yml': `uses: codeslage/werkstatt/.github/workflows/cwk-rules.yml@${OLD}\n`,
  'eslint.config.js': 'eslint alt\n',
};

interface FakeRepo {
  main: Record<string, string>;
  /** Stand von `cwk/sync`, falls es den Branch schon gibt. */
  branch?: Record<string, string>;
  /** Nummer des offenen Sync-PR. */
  pr?: number;
  /** `cwk/sync` unterscheidet sich von `main` (git diff). */
  ahead?: boolean;
}

let workDir = '';
afterEach(() => rmSync(workDir, { recursive: true, force: true }));

function writeFiles(dir: string, files: Record<string, string>) {
  for (const [path, text] of Object.entries(files)) {
    mkdirSync(dirname(join(dir, path)), { recursive: true });
    writeFileSync(join(dir, path), text);
  }
}

const repoOf = (line: string) => /codeslage\/([a-z0-9-]+)/.exec(line)?.[1] ?? '';
const dirOf = (line: string) => line.split(' ')[2] ?? '';

function setup(repos: Record<string, FakeRepo>, listing: Parameters<typeof fakeRun>[0] = []) {
  workDir = mkdtempSync(join(tmpdir(), 'cwk-sync-'));
  const byDir = (line: string) => repos[dirOf(line).split('/').pop() ?? ''];
  const fake = fakeRun([
    ...listing,
    [
      'gh repo clone',
      (call) => {
        writeFiles(call.line.split(' ')[4] ?? '', repos[repoOf(call.line)]?.main ?? {});
        return {};
      },
    ],
    ['git -C', (call) => gitReply(call.line, byDir(call.line))],
    ['gh pr list', (call) => ({ stdout: JSON.stringify(prList(repos[repoOf(call.line)])) })],
  ]);
  const deps: SyncDeps = {
    run: fake.run,
    workDir,
    manifest,
    sha: NEW,
    readSource: (path) => SOURCE[path],
    // Ohne eigene Angabe des Tests war das Manifest im bisherigen Stand dasselbe.
    readManifest: () => manifest,
  };
  return { ...fake, deps };
}

const prList = (repo: FakeRepo | undefined) => (repo?.pr === undefined ? [] : [{ number: repo.pr }]);

/** git im Klon: ls-remote kennt den Branch nur, wenn es ihn gibt; checkout holt seinen Stand. */
function gitReply(line: string, repo: FakeRepo | undefined) {
  if (line.includes(' ls-remote ')) return { status: repo?.branch === undefined ? 2 : 0 };
  if (line.includes(' diff --quiet origin/main HEAD')) return { status: repo?.ahead === true ? 1 : 0 };
  if (line.includes(' checkout -q --track origin/cwk/sync')) writeFiles(dirOf(line), repo?.branch ?? {});
  return {};
}

const sync = (scope: SyncScope, deps: SyncDeps) => syncProjects(scope, deps);
const read = (repo: string, path: string) => readFileSync(join(workDir, repo, path), 'utf8');
const clones = (lines: string[]) => lines.filter((line) => line.startsWith('gh repo clone')).map(repoOf);

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

const rules = (target: string) => ({ source: `alt/${target}`, target, part: 'rules', mode: 'exact' }) as const;
const exists = (path: string) => existsSync(join(workDir, 'demo', path));
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

  it('löscht bei einer Umbenennung das alte Ziel und schreibt das neue', () => {
    const before = { ...OUTDATED, 'CLAUDE-alt.md': 'alt\n' };
    delete (before as Record<string, string>)['CLAUDE.md'];
    const { deps } = setup({ demo: { main: before } }, only);
    const renamed = manifest.files.map((file) =>
      file.target === 'CLAUDE.md' ? { ...file, target: 'CLAUDE-alt.md' } : file,
    );
    deps.readManifest = () => ({ files: renamed });
    sync(repo, deps);
    expect(exists('CLAUDE-alt.md')).toBe(false);
    expect(read('demo', 'CLAUDE.md')).toBe(`# Basis neu\n${BLOCK('')}`);
  });

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
