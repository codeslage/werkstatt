// Einstieg für `cwk` (Plan 05, Unterbefehle). Hier liegen nur die Zugriffe auf Dateien, Git, Umgebung und
// GitHub; die Logik steckt in check.ts, ci-ok.ts, settings.ts, new.ts, secrets.ts und sync.ts.

import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { parseArgs } from 'node:util';
import { checkProject } from './check.ts';
import { evaluateNeeds } from './ci-ok.ts';
import { spawnRun } from './gh.ts';
import { createProject } from './new.ts';
import { parseConfig, parseManifest, type Visibility } from './schema.ts';
import { syncSecrets } from './secrets.ts';
import { checkSettings, CODEOWNERS_PATHS } from './settings.ts';
import { type SyncScope, syncProjects } from './sync.ts';

const readIfExists = (path: string) => (existsSync(path) ? readFileSync(path, 'utf8') : undefined);
const visibility = (): Visibility => (process.env.CWK_VISIBILITY === 'public' ? 'public' : 'private');

function git(dir: string, args: string[]) {
  return spawnSync('git', ['-C', dir, ...args], { encoding: 'utf8' });
}

/** Kommt der Stand `newer` in werkstatt nach `older`? Exit 1 heißt nein, alles andere ist ein Fehler. */
function isAncestor(source: string, older: string, newer: string): boolean {
  const result = git(source, ['merge-base', '--is-ancestor', older, newer]);
  if (result.status === 0 || result.status === 1) return result.status === 0;
  throw new Error(`git merge-base in ${source}: ${result.stderr.trim()}`);
}

/** `cwk` aus cwk.json auf dem Basis-Branch; undefined, wenn es dort noch keine cwk.json gibt. */
function baseCwk(project: string, baseRef: string | undefined): string | undefined {
  if (baseRef === undefined) return undefined;
  const result = git(project, ['show', `${baseRef}:cwk.json`]);
  if (result.status !== 0) {
    if (/does not exist|exists on disk, but not in/.test(result.stderr)) return undefined;
    throw new Error(`cwk.json auf ${baseRef} nicht lesbar: ${result.stderr.trim()}`);
  }
  return parseConfig(result.stdout, visibility()).cwk;
}

function workflows(project: string) {
  const dir = join(project, '.github', 'workflows');
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((name) => /\.ya?ml$/.test(name))
    .map((name) => ({ path: `.github/workflows/${name}`, text: readFileSync(join(dir, name), 'utf8') }));
}

/** In werkstatt selbst: Manifest gültig, jede Quelle vorhanden. */
function checkSelf(root: string): string[] {
  const manifest = parseManifest(readFileSync(join(root, 'cwk', 'manifest.json'), 'utf8'));
  return manifest.files.filter((file) => !existsSync(join(root, file.source))).map((file) => `${file.source}: fehlt`);
}

function check(args: string[]): string[] {
  const { values } = parseArgs({
    args,
    options: { self: { type: 'boolean' }, source: { type: 'string' }, 'base-ref': { type: 'string' } },
  });
  const project = process.cwd();
  if (values.self) return checkSelf(project);
  const source = values.source;
  if (source === undefined) return ['Aufruf: cwk check --self | --source <werkstatt> [--base-ref <rev>]'];
  const configText = readIfExists(join(project, 'cwk.json'));
  if (configText === undefined) return ['cwk.json fehlt: Repo ist nicht an den CWK angebunden'];
  const base = baseCwk(project, values['base-ref']);
  return checkProject({
    manifest: parseManifest(readFileSync(join(source, 'cwk', 'manifest.json'), 'utf8')),
    config: parseConfig(configText, visibility()),
    readSource: (path) => readIfExists(join(source, path)),
    readTarget: (path) => readIfExists(join(project, path)),
    workflows: workflows(project),
    ...(base === undefined ? {} : { baseCwk: base }),
    isAncestor: (older, newer) => isAncestor(source, older, newer),
  });
}

/** ci-ok: In werkstatt gibt es keine cwk.json, dort hat das Repo immer Code. */
function ciOk(): string[] {
  const configText = readIfExists('cwk.json');
  const hasCode = configText === undefined || parseConfig(configText, visibility()).code;
  return evaluateNeeds(process.env.NEEDS ?? '', hasCode);
}

async function settings(): Promise<string[]> {
  const repo = process.env.GITHUB_REPOSITORY;
  if (repo === undefined) return ['GITHUB_REPOSITORY fehlt'];
  const get = async (path: string) => {
    const headers: Record<string, string> = { Accept: 'application/vnd.github+json' };
    if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    const response = await fetch(`https://api.github.com${path}`, { headers });
    if (!response.ok) throw new Error(`GitHub ${path}: HTTP ${response.status}`);
    return response.json();
  };
  const result = await checkSettings(
    get,
    repo,
    CODEOWNERS_PATHS.filter((path) => existsSync(path)),
    process.env.GITHUB_SHA,
  );
  for (const note of result.notes) console.log(`::notice::${note}`);
  return result.errors;
}

// new und secrets laufen lokal in werkstatt mit dem gh-Login des Inhabers; die Sperrliste kommt aus .sperrliste.
const blocklist = () => readIfExists('.sperrliste') ?? '';
const today = () => new Date().toISOString().slice(0, 10);
const printNotes = (notes: string[]): string[] => {
  for (const note of notes) console.log(`Hinweis: ${note}`);
  return [];
};

function newProject(args: string[]): string[] {
  const { values, positionals } = parseArgs({
    args,
    allowPositionals: true,
    options: { private: { type: 'boolean' }, 'no-code': { type: 'boolean' } },
  });
  if (positionals.length !== 1) return ['Aufruf: cwk new <name> [--private] [--no-code]'];
  const notes = createProject(
    { name: positionals[0] ?? '', isPrivate: values.private === true, code: values['no-code'] !== true },
    {
      run: spawnRun,
      workDir: mkdtempSync(join(tmpdir(), 'cwk-new-')),
      blocklist: blocklist(),
      manifest: parseManifest(readFileSync(join('cwk', 'manifest.json'), 'utf8')),
      today: today(),
      sleep: (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms),
    },
  );
  return printNotes(notes);
}

const secrets = (): string[] => printNotes(syncSecrets({ run: spawnRun, blocklist: blocklist(), today: today() }));

const SYNC_USAGE = 'Aufruf: cwk sync [--private | --repo <name>] [--source <werkstatt>]';

/** Ohne --private und --repo: öffentliche Repos mit dem Token der Lese-App (sync.yml in platform). */
function syncScope(values: { private?: boolean; repo?: string }): SyncScope | string {
  if (values.private === true && values.repo !== undefined) return SYNC_USAGE;
  if (values.private === true) return { kind: 'private' };
  if (values.repo !== undefined) return { kind: 'repo', name: values.repo };
  const readToken = process.env.CWK_READ_TOKEN;
  return readToken ? { kind: 'public', readToken } : 'CWK_READ_TOKEN fehlt: Token der Lese-App codeslage-cwk-read';
}

/** Datei aus werkstatt im Stand `sha`, unabhängig vom Arbeitsverzeichnis; undefined, wenn sie dort fehlt. */
function showSource(source: string, sha: string, path: string): string | undefined {
  const result = git(source, ['show', `${sha}:${path}`]);
  if (result.status === 0) return result.stdout;
  if (/does not exist|exists on disk, but not in/.test(result.stderr)) return undefined;
  throw new Error(`git show ${sha}:${path}: ${result.stderr.trim()}`);
}

/** Neuester Stand von werkstatt/main, auch wenn der Checkout auf einem anderen Branch steht. */
function latestCwk(source: string): string {
  const fetched = git(source, ['fetch', '-q', 'origin', 'main']);
  if (fetched.status !== 0) throw new Error(`git fetch in ${source}: ${fetched.stderr.trim()}`);
  const sha = git(source, ['rev-parse', 'origin/main']).stdout.trim();
  if (!/^[0-9a-f]{40}$/.test(sha)) throw new Error(`origin/main in ${source} nicht lesbar`);
  return sha;
}

function sync(args: string[]): string[] {
  const { values } = parseArgs({
    args,
    options: { private: { type: 'boolean' }, repo: { type: 'string' }, source: { type: 'string' } },
  });
  const scope = syncScope(values);
  if (typeof scope === 'string') return [scope];
  const source = values.source ?? process.cwd();
  const sha = latestCwk(source);
  const manifestText = showSource(source, sha, 'cwk/manifest.json');
  if (manifestText === undefined) return [`cwk/manifest.json fehlt im Stand ${sha}`];
  const workDir = mkdtempSync(join(tmpdir(), 'cwk-sync-'));
  try {
    const result = syncProjects(scope, {
      run: spawnRun,
      workDir,
      manifest: parseManifest(manifestText),
      sha,
      readSource: (path) => showSource(source, sha, path),
    });
    printNotes(result.notes);
    return result.errors;
  } finally {
    // Klone privater Repos sollen nicht im Temp-Ordner liegen bleiben (Review PR-3a, Befund 5).
    rmSync(workDir, { recursive: true, force: true });
  }
}

const COMMANDS: Record<string, (args: string[]) => string[] | Promise<string[]>> = {
  check,
  'ci-ok': ciOk,
  new: newProject,
  secrets,
  settings,
  sync,
};

async function main(): Promise<void> {
  const [name = '', ...args] = process.argv.slice(2);
  const command = COMMANDS[name];
  if (command === undefined) {
    console.error(`Aufruf: cwk <${Object.keys(COMMANDS).join(' | ')}>`);
    process.exit(2);
  }
  let errors: string[];
  try {
    errors = await command(args);
  } catch (error) {
    errors = [(error as Error).message];
  }
  for (const error of errors) console.error(`cwk ${name}: ${error}`);
  process.exit(errors.length === 0 ? 0 : 1);
}

await main();
