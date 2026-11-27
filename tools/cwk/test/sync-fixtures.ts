import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import type { Manifest } from '../src/schema.ts';
import { type SyncDeps, type SyncScope, syncProjects } from '../src/sync.ts';
import { fakeRun } from './fake-run.ts';

// Gemeinsame Ausgangslage der Tests von `cwk sync` (sync.test.ts, sync-removal.test.ts): ersetzte gh- und git-Aufrufe,
// Klone als echte Dateien in einem Temp-Ordner.

export const OLD = 'a'.repeat(40);
export const NEW = 'b'.repeat(40);
export const manifest: Manifest = {
  files: [
    { source: 'CONSTITUTION.md', target: 'CONSTITUTION.md', part: 'rules', mode: 'exact' },
    { source: 'cwk/CLAUDE.md', target: 'CLAUDE.md', part: 'rules', mode: 'extendable' },
    { source: 'cwk/ci.yml', target: '.github/workflows/ci.yml', part: 'rules', mode: 'exact' },
    { source: 'packages/config/eslint.config.js', target: 'eslint.config.js', part: 'code', mode: 'exact' },
  ],
};
export const BLOCK = (content: string) => `<!-- cwk:project:start -->\n${content}<!-- cwk:project:end -->\n`;
const SOURCE: Record<string, string> = {
  'CONSTITUTION.md': 'Constitution neu\n',
  'cwk/CLAUDE.md': `# Basis neu\n${BLOCK('')}`,
  'cwk/ci.yml': 'uses: codeslage/werkstatt/.github/workflows/cwk-rules.yml@CWK_REF\n',
  'packages/config/eslint.config.js': 'eslint neu\n',
};
/** Stand eines Projekts, das bereits auf NEW ist. */
export const CURRENT: Record<string, string> = {
  'cwk.json': `{ "cwk": "${NEW}", "code": true }\n`,
  'CONSTITUTION.md': 'Constitution neu\n',
  'CLAUDE.md': `# Basis neu\n${BLOCK('')}`,
  '.github/workflows/ci.yml': `uses: codeslage/werkstatt/.github/workflows/cwk-rules.yml@${NEW}\n`,
  'eslint.config.js': 'eslint neu\n',
};
export const OUTDATED: Record<string, string> = {
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

/** In afterEach jeder Testdatei aufrufen. */
export const cleanup = () => rmSync(workDir, { recursive: true, force: true });
export const exists = (repo: string, path: string) => existsSync(join(workDir, repo, path));

function writeFiles(dir: string, files: Record<string, string>) {
  for (const [path, text] of Object.entries(files)) {
    mkdirSync(dirname(join(dir, path)), { recursive: true });
    writeFileSync(join(dir, path), text);
  }
}

const repoOf = (line: string) => /codeslage\/([a-z0-9-]+)/.exec(line)?.[1] ?? '';
const dirOf = (line: string) => line.split(' ')[2] ?? '';

export function setup(repos: Record<string, FakeRepo>, listing: Parameters<typeof fakeRun>[0] = []) {
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

export const sync = (scope: SyncScope, deps: SyncDeps) => syncProjects(scope, deps);
export const read = (repo: string, path: string) => readFileSync(join(workDir, repo, path), 'utf8');
export const clones = (lines: string[]) => lines.filter((line) => line.startsWith('gh repo clone')).map(repoOf);
