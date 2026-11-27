// `cwk new <name> [--private] [--no-code]` (Plan 05, AK-1, AK-4, AK-6, AK-27): Repo aus der Vorlage anlegen und
// einrichten. Läuft lokal mit dem gh-Login des Inhabers. Reihenfolge: Sperrliste vor dem ersten Push (sonst ist der
// erste Scan rot), Rulesets nach dem Push (danach ist main nur noch per PR änderbar).

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { ghGet, ghSend, must, ORG, type Run } from './gh.ts';
import { MAIN_APPROVAL, MAIN_CHECKS } from './rulesets.ts';
import type { Manifest } from './schema.ts';
import { recordBlocklistDates, requireBlocklist, setBlocklist } from './secrets.ts';

export interface NewOptions {
  name: string;
  isPrivate: boolean;
  code: boolean;
}

export interface NewDeps {
  run: Run;
  /** Ordner für den lokalen Klon. */
  workDir: string;
  blocklist: string;
  manifest: Manifest;
  today: string;
  sleep: (ms: number) => void;
}

const TEMPLATE = `${ORG}/project-template`;
const WRITE_APP = 'codeslage-cwk';
/** Bestehende Repos mit eigener Rolle. platform fehlt hier, weil es selbst mit `cwk new` entsteht (Plan 05, T-16). */
const RESERVED = ['werkstatt', 'project-template', 'internal'];
/**
 * Beispiel-App der Vorlage (codeslage/project-template), die in Repos ohne Code wegfällt, zusätzlich zum Code-Teil des
 * CWK. package.json bleibt: Format und Rechtschreibung brauchen Prettier und cspell auch ohne Code.
 */
const TEMPLATE_CODE = ['src', 'tsconfig.json', 'Dockerfile', '.dockerignore'];

function validateName(name: string): void {
  if (!/^[a-z0-9][a-z0-9-]{0,99}$/.test(name) || RESERVED.includes(name)) {
    throw new Error(`Name „${name}“ ungültig: Kleinbuchstaben, Ziffern, Bindestrich; nicht ${RESERVED.join(', ')}`);
  }
}

/** GitHub legt den Inhalt der Vorlage mit kurzer Verzögerung an. */
function waitForContent(deps: NewDeps, repo: string): void {
  for (let attempt = 0; attempt < 10; attempt++) {
    if (deps.run('gh', ['api', `/repos/${repo}/commits?per_page=1`]).status === 0) return;
    deps.sleep(2000);
  }
  throw new Error(`${repo}: Inhalt aus der Vorlage nach 20 s noch nicht da`);
}

const DEPENDABOT = '.github/dependabot.yml';
const DOCKER_UPDATES = /\n* {2}- package-ecosystem: docker\n(?:(?: {4}.*)?\n)*/;

/** Ohne Dockerfile bricht der docker-Lauf von Dependabot bei jedem Termin mit einem Fehler ab (T-16). */
function removeDockerUpdates(deps: NewDeps, dir: string): void {
  const path = join(dir, DEPENDABOT);
  if (!existsSync(path)) return;
  const text = readFileSync(path, 'utf8');
  const without = text.replace(DOCKER_UPDATES, '\n');
  if (without === text) return;
  writeFileSync(path, without);
  must(deps.run, 'git', ['-C', dir, 'add', DEPENDABOT]);
}

function removeCode(deps: NewDeps, dir: string): void {
  const codeTargets = deps.manifest.files.filter((file) => file.part === 'code').map((file) => file.target);
  const present = [...codeTargets, ...TEMPLATE_CODE].filter((path) => existsSync(join(dir, path)));
  if (present.length > 0) must(deps.run, 'git', ['-C', dir, 'rm', '-r', '-q', '--', ...present]);
  removeDockerUpdates(deps, dir);
}

/**
 * cwk.json ohne `docs`, damit der Standard nach Sichtbarkeit gilt (AK-14): Die Vorlage ist öffentlich und sagt
 * "public"; ein privates Repo würde das sonst erben. Einzeilig mit Leerzeichen, so wie Prettier es verlangt.
 */
function writeConfig(deps: NewDeps, dir: string, code: boolean): void {
  const configPath = join(dir, 'cwk.json');
  const config = JSON.parse(readFileSync(configPath, 'utf8')) as Record<string, unknown>;
  delete config.docs;
  const entries = Object.entries({ ...config, code }).map(([key, value]) => `"${key}": ${JSON.stringify(value)}`);
  writeFileSync(configPath, `{ ${entries.join(', ')} }\n`);
  must(deps.run, 'git', ['-C', dir, 'add', 'cwk.json']);
}

/** Klont, passt bei Bedarf an und pusht einen Commit; der Push startet die erste CI. */
function firstCommit(deps: NewDeps, repo: string, options: NewOptions): void {
  const dir = join(deps.workDir, options.name);
  must(deps.run, 'gh', ['repo', 'clone', repo, dir]);
  if (!options.code) removeCode(deps, dir);
  writeConfig(deps, dir, options.code);
  const message = `Projekt angelegt mit cwk new${options.code ? '' : ' (ohne Code)'}`;
  must(deps.run, 'git', ['-C', dir, 'commit', '--allow-empty', '-m', message]);
  must(deps.run, 'git', ['-C', dir, 'push', 'origin', 'main']);
}

function installWriteApp(deps: NewDeps, repo: string): string[] {
  const response = ghGet(deps.run, `/orgs/${ORG}/installations`) as { installations?: unknown } | undefined;
  const installations = Array.isArray(response?.installations) ? response.installations : [];
  const app = installations.find((entry) => (entry as { app_slug?: unknown }).app_slug === WRITE_APP) as
    { id?: unknown } | undefined;
  if (typeof app?.id !== 'number')
    return [`Schreib-App ${WRITE_APP} ist noch nicht installiert: Repo später aufnehmen (T-45)`];
  const repoId = must(deps.run, 'gh', ['api', `/repos/${repo}`, '--jq', '.id']).trim();
  if (!/^\d+$/.test(repoId)) throw new Error(`${repo}: unerwartete Repo-ID`);
  must(deps.run, 'gh', ['api', '-X', 'PUT', `/user/installations/${app.id}/repositories/${repoId}`]);
  return [];
}

/** Legt das Repo an und gibt Hinweise auf noch fehlende Bausteine zurück; jeder Fehler bricht ab. */
export function createProject(options: NewOptions, deps: NewDeps): string[] {
  validateName(options.name);
  requireBlocklist(deps.blocklist);
  const repo = `${ORG}/${options.name}`;
  must(deps.run, 'gh', ['repo', 'create', repo, '--template', TEMPLATE, options.isPrivate ? '--private' : '--public']);
  waitForContent(deps, repo);
  setBlocklist(deps.run, repo, deps.blocklist);
  must(deps.run, 'gh', ['api', '-X', 'PUT', `/orgs/${ORG}/teams/maintainers/repos/${repo}`, '-f', 'permission=push']);
  firstCommit(deps, repo, options);
  const notes: string[] = [];
  if (options.isPrivate) {
    notes.push('privat: keine Rulesets und keine Schreib-App (GitHub Free, Plan 05 P1)');
  } else {
    for (const ruleset of [MAIN_CHECKS, MAIN_APPROVAL]) ghSend(deps.run, 'POST', `/repos/${repo}/rulesets`, ruleset);
    notes.push(...installWriteApp(deps, repo));
  }
  return [...notes, ...recordBlocklistDates(deps.run, [repo], deps.today)];
}
