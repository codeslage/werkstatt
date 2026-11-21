// Einstieg für `cwk` (Plan 05, Unterbefehle). Hier liegen nur die Zugriffe auf Dateien, Git, Umgebung und
// GitHub; die Prüflogik steckt in check.ts, ci-ok.ts und settings.ts.

import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseArgs } from 'node:util';
import { checkProject } from './check.ts';
import { evaluateNeeds } from './ci-ok.ts';
import { parseConfig, parseManifest, type Visibility } from './schema.ts';
import { checkSettings, CODEOWNERS_PATHS } from './settings.ts';

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
  );
  for (const note of result.notes) console.log(`::notice::${note}`);
  return result.errors;
}

const COMMANDS: Record<string, (args: string[]) => string[] | Promise<string[]>> = {
  check,
  'ci-ok': ciOk,
  settings,
};

async function main(): Promise<void> {
  const [name = '', ...args] = process.argv.slice(2);
  const command = COMMANDS[name];
  if (command === undefined) {
    console.error(`Aufruf: cwk <${Object.keys(COMMANDS).join(' | ')}>`);
    process.exit(2);
  }
  const errors = await command(args);
  for (const error of errors) console.error(`cwk ${name}: ${error}`);
  process.exit(errors.length === 0 ? 0 : 1);
}

await main();
