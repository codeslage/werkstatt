// `cwk sync [--private | --repo <name>]` (Plan 05, AK-7, AK-8, AK-25, AK-27): bringt den CWK-Stand `sha` aus
// werkstatt per PR auf Branch `cwk/sync` in jedes Repo der Soll-Menge. Nie Force-Push: Gibt es den Branch schon,
// setzt der Sync darauf auf. So bleiben eigene Commits und der Projektblock aus dem Stand des Branches erhalten.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { BLOCK_END, BLOCK_START, PLACEHOLDER } from './check.ts';
import { must, ORG, type Run } from './gh.ts';
import { isRecord, type Manifest, parseConfig } from './schema.ts';
import { listTargets, type SyncScope, type SyncTarget } from './sync-targets.ts';

export type { SyncScope } from './sync-targets.ts';

export interface SyncDeps {
  run: Run;
  /** Ordner für die lokalen Klone. */
  workDir: string;
  manifest: Manifest;
  /** Neuester CWK-Stand: Commit auf werkstatt/main. */
  sha: string;
  /** Datei aus werkstatt im Stand `sha`; undefined, wenn sie fehlt. */
  readSource: (path: string) => string | undefined;
}

export interface SyncResult {
  errors: string[];
  notes: string[];
}

const BRANCH = 'cwk/sync';
const CONFIG = 'cwk.json';
const CWK_VALUE = /("cwk"\s*:\s*")[0-9a-f]{40}(")/;
/** Exit-Code von `git ls-remote --exit-code`, wenn es den Branch nicht gibt. */
const NO_SUCH_BRANCH = 2;

const short = (sha: string) => sha.slice(0, 7);
const message = (error: unknown) => (error instanceof Error ? error.message : String(error));

/** Zeilen zwischen Start- und Endmarke des Projektblocks; undefined ohne gültigen Block. */
function blockRange(lines: string[]): [number, number] | undefined {
  const start = lines.findIndex((line) => BLOCK_START.test(line));
  const end = lines.findIndex((line) => BLOCK_END.test(line));
  return start < 0 || end < start ? undefined : [start, end];
}

/** Neuer Stand außerhalb des Projektblocks, der Inhalt des Blocks aus dem bisherigen Stand. */
function keepProjectBlock(expected: string, current: string): string {
  const currentLines = current.split('\n');
  const expectedLines = expected.split('\n');
  const own = blockRange(currentLines);
  const slot = blockRange(expectedLines);
  if (own === undefined || slot === undefined) return expected;
  const block = currentLines.slice(own[0] + 1, own[1]);
  return [...expectedLines.slice(0, slot[0] + 1), ...block, ...expectedLines.slice(slot[1])].join('\n');
}

/** Bestehenden Branch auschecken und main hineinholen (kein Force-Push nötig), sonst neu von main. */
function checkoutBranch(run: Run, dir: string): void {
  const remote = run('git', ['-C', dir, 'ls-remote', '--exit-code', '--heads', 'origin', BRANCH]);
  if (remote.status === NO_SUCH_BRANCH) {
    must(run, 'git', ['-C', dir, 'checkout', '-q', '-b', BRANCH]);
    return;
  }
  if (remote.status !== 0) throw new Error(`git ls-remote: ${remote.stderr.trim()}`);
  must(run, 'git', ['-C', dir, 'checkout', '-q', '--track', `origin/${BRANCH}`]);
  must(run, 'git', ['-C', dir, 'merge', '-q', '--no-edit', 'origin/main']);
}

const readIfExists = (path: string) => (existsSync(path) ? readFileSync(path, 'utf8') : undefined);

/** Schreibt jede CWK-Datei des Teils im Stand `sha`, nur wo sie abweicht; gibt die geänderten Ziele zurück. */
function writeCwkFiles(dir: string, deps: SyncDeps, code: boolean): string[] {
  const changed: string[] = [];
  for (const file of deps.manifest.files.filter((entry) => entry.part === 'rules' || code)) {
    const source = deps.readSource(file.source);
    if (source === undefined) throw new Error(`Quelle ${file.source} fehlt im CWK-Stand ${short(deps.sha)}`);
    const path = join(dir, file.target);
    const current = readIfExists(path);
    const fresh = source.replaceAll(PLACEHOLDER, `@${deps.sha}`);
    const expected = file.mode === 'extendable' && current !== undefined ? keepProjectBlock(fresh, current) : fresh;
    if (expected === current) continue;
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, expected);
    changed.push(file.target);
  }
  return changed;
}

/** Setzt nur den Wert von `cwk`, damit Format und übrige Felder des Projekts bleiben. */
function writeConfig(dir: string, sha: string): string[] {
  const text = readIfExists(join(dir, CONFIG));
  if (text === undefined) throw new Error(`${CONFIG} fehlt auf ${BRANCH}`);
  const updated = text.replace(CWK_VALUE, `$1${sha}$2`);
  if (updated === text) return [];
  writeFileSync(join(dir, CONFIG), updated);
  return [CONFIG];
}

function pullRequestText(old: string, sha: string): { title: string; body: string } {
  const body = [
    'Sync des CodeslageWerkzeugKastens (CWK) aus `codeslage/werkstatt` (Plan 05, AK-7).',
    '',
    `- bisher: \`${short(old)}\``,
    `- neu: \`${short(sha)}\``,
    `- Änderungen: https://github.com/${ORG}/werkstatt/compare/${old}...${sha}`,
    '',
    'Mergen erst nach Code-Owner-Review des Teams `maintainers` zum neuesten Stand.',
    'Eigene Commits auf diesem Branch bleiben beim nächsten Sync erhalten.',
  ].join('\n');
  return { title: `CWK auf ${short(sha)} aktualisieren`, body };
}

function openPullRequest(run: Run, repo: string): number | undefined {
  const output = must(run, 'gh', ['pr', 'list', '-R', repo, '--head', BRANCH, '--state', 'open', '--json', 'number']);
  let list: unknown;
  try {
    list = JSON.parse(output);
  } catch {
    list = undefined;
  }
  if (!Array.isArray(list) || !list.every((entry) => isRecord(entry) && Number.isInteger(entry.number))) {
    throw new Error('gh pr list: unerwartete Antwort');
  }
  return (list[0] as { number: number } | undefined)?.number;
}

function upsertPullRequest(run: Run, repo: string, text: { title: string; body: string }): string {
  const number = openPullRequest(run, repo);
  const fields = ['--title', text.title, '--body', text.body];
  if (number !== undefined) {
    must(run, 'gh', ['pr', 'edit', String(number), '-R', repo, ...fields]);
    return `Sync-PR #${number} aktualisiert`;
  }
  must(run, 'gh', ['pr', 'create', '-R', repo, '--base', 'main', '--head', BRANCH, ...fields]);
  return 'Sync-PR angelegt';
}

function syncRepo(target: SyncTarget, deps: SyncDeps): string {
  const { run } = deps;
  const repo = `${ORG}/${target.name}`;
  const dir = join(deps.workDir, target.name);
  must(run, 'gh', ['repo', 'clone', repo, dir, '--', '-q']);
  const configText = readIfExists(join(dir, CONFIG));
  if (configText === undefined) throw new Error(`nicht angebunden, ${CONFIG} fehlt`);
  const config = parseConfig(configText, target.visibility);
  checkoutBranch(run, dir);
  const changed = [...writeCwkFiles(dir, deps, config.code), ...writeConfig(dir, deps.sha)];
  const text = pullRequestText(config.cwk, deps.sha);
  if (changed.length === 0) return publishPending(run, dir, repo, text);
  must(run, 'git', ['-C', dir, 'add', '--', ...changed]);
  must(run, 'git', ['-C', dir, 'commit', '-q', '-m', text.title]);
  return publish(run, dir, repo, text);
}

function publish(run: Run, dir: string, repo: string, text: { title: string; body: string }): string {
  must(run, 'git', ['-C', dir, 'push', '-q', 'origin', BRANCH]);
  return upsertPullRequest(run, repo, text);
}

/**
 * Ohne neue Änderung fehlt trotzdem ein PR, wenn der Branch vor main liegt und keiner offen ist: Push geklappt, PR
 * nicht angelegt, oder ohne Merge geschlossen. Sonst bliebe das bis zur nächsten CWK-Änderung still (Review PR-3a).
 */
function publishPending(run: Run, dir: string, repo: string, text: { title: string; body: string }): string {
  if (openPullRequest(run, repo) !== undefined) return 'aktuell';
  const diff = run('git', ['-C', dir, 'diff', '--quiet', 'origin/main', 'HEAD']);
  if (diff.status === 0) return 'aktuell';
  if (diff.status !== 1) throw new Error(`git diff: ${diff.stderr.trim()}`);
  return publish(run, dir, repo, text);
}

/** Jedes Repo für sich: Ein Fehler wird gemeldet, die übrigen Repos laufen weiter. */
export function syncProjects(scope: SyncScope, deps: SyncDeps): SyncResult {
  let targets: SyncTarget[];
  try {
    targets = listTargets(scope, deps.run);
  } catch (error) {
    return { errors: [message(error)], notes: [] };
  }
  const result: SyncResult = { errors: [], notes: [] };
  for (const target of targets) {
    try {
      result.notes.push(`${target.name}: ${syncRepo(target, deps)}`);
    } catch (error) {
      result.errors.push(`${target.name}: ${message(error)}`);
    }
  }
  return result;
}
