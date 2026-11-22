// SDD-Dirigent: führt eine PR-Gruppe aus Stufe 6 in frischen Claude-Code-Sitzungen aus
// (docs/prozess/sdd-ablauf.md, Regel „Schlanke Steuerung in Stufe 6“).
//
//   node tools/sdd-dirigent/src/cli.ts <NN-name> <PR-xx> [--dry-run]
//
// Je Task eine Sitzung `/sdd-implement <NN-name> T-xx` mit Kontextpaket, danach eine Sitzung
// `/sdd-implement <NN-name> review PR-xx` (Review, Status, PR). Eine PR-Gruppe je Aufruf: Merge und
// nächste Gruppe bleiben beim Menschen. Zeiten schreibt das Werkzeug nach zeiten.md.
//
// Umgebung:
//   SDD_CLAUDE       Programm (Standard: claude)
//   SDD_CLAUDE_ARGS  zusätzliche Argumente, z. B. "--model claude-opus-5-5 --permission-mode acceptEdits"
//   SDD_EFFORT       Effort je Sitzung (Standard: high)
//   SDD_PRUEFEN      Prüfbefehl nach jeder Task (Standard: pnpm test)
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  insertTimeRow,
  parseTasks,
  reviewContext,
  taskContext,
  tasksOfPr,
  timeRow,
  type Task,
  type TaskTable,
} from './plan.ts';

interface Session {
  label: string;
  costUsd: number;
  minutes: number;
  sessionId: string;
  isError: boolean;
}

const sessions: Session[] = [];

function run(command: string, args: string[], cwd: string): { ok: boolean; out: string } {
  const result = spawnSync(command, args, { cwd, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  return { ok: result.status === 0, out: `${result.stdout ?? ''}${result.stderr ?? ''}` };
}

function git(root: string, ...args: string[]): string {
  const result = run('git', args, root);
  if (!result.ok) throw new Error(`git ${args.join(' ')}: ${result.out}`);
  return result.out.trim();
}

function clean(root: string): boolean {
  return git(root, 'status', '--porcelain') === '';
}

function checksPass(root: string): boolean {
  const command = process.env['SDD_PRUEFEN'] ?? 'pnpm test';
  return run('sh', ['-c', command], root).ok;
}

interface ClaudeResult {
  total_cost_usd?: number;
  session_id?: string;
  is_error?: boolean;
  result?: string;
}

function claudeArgs(prompt: string, resume: string | undefined): string[] {
  const extra = (process.env['SDD_CLAUDE_ARGS'] ?? '').split(' ').filter((arg) => arg !== '');
  const resumeArgs = resume === undefined ? [] : ['--resume', resume];
  const effort = process.env['SDD_EFFORT'] ?? 'high';
  return [...resumeArgs, '-p', prompt, '--output-format', 'json', '--effort', effort, ...extra];
}

function parseResult(out: string): ClaudeResult {
  try {
    return JSON.parse(out) as ClaudeResult;
  } catch {
    return { is_error: true, result: out.slice(-500) };
  }
}

function claude(root: string, label: string, prompt: string, resume?: string): Session {
  console.log(`▶ ${label}`);
  const started = Date.now();
  const parsed = parseResult(run(process.env['SDD_CLAUDE'] ?? 'claude', claudeArgs(prompt, resume), root).out);
  const session: Session = {
    label,
    costUsd: parsed.total_cost_usd ?? 0,
    minutes: (Date.now() - started) / 60_000,
    sessionId: parsed.session_id ?? '',
    isError: parsed.is_error === true,
  };
  sessions.push(session);
  console.log(
    `  ${session.isError ? '⚠️ Fehler' : 'fertig'} · ${session.minutes.toFixed(1)} min · $${session.costUsd.toFixed(2)}`,
  );
  if (session.isError) console.log(`  ${(parsed.result ?? '').slice(0, 300)}`);
  return session;
}

function recordTime(root: string, project: string, what: string, start: Date, label: string): void {
  const file = join(root, 'specs', project, 'zeiten.md');
  if (!existsSync(file)) return;
  const row = timeRow({ what, start, end: new Date(), note: `Sitzung ${label} (sdd-dirigent)` });
  writeFileSync(file, insertTimeRow(readFileSync(file, 'utf8'), row));
  git(root, 'add', file);
  if (!clean(root)) git(root, 'commit', '-qm', `${what}: Zeit (sdd-dirigent)`);
}

/** Eine Sitzung; ist der Auftrag danach nicht erledigt, einmal „weiter“ in derselben Sitzung. */
function session(
  root: string,
  project: string,
  what: string,
  label: string,
  prompt: string,
  done: () => boolean,
): boolean {
  const start = new Date();
  const first = claude(root, label, prompt);
  if (!done() && first.sessionId !== '') {
    claude(
      root,
      `${label} (weiter)`,
      `Weiter: Schließe den Auftrag ${what} ab – alle Prüfungen grün, alles committet, dann aufhören.`,
      first.sessionId,
    );
  }
  const ok = done();
  recordTime(root, project, what, start, label);
  return ok;
}

function writeContext(root: string, id: string, text: string): string {
  const dir = join(root, '.sdd-dirigent');
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, `kontext-${id}.md`), text);
  return `.sdd-dirigent/kontext-${id}.md`;
}

function committed(root: string, branch: string, task: Task): boolean {
  return git(root, 'log', '--format=%s', `main..${branch}`)
    .split('\n')
    .some((subject) => subject.startsWith(`${task.id}:`));
}

function fail(message: string, code: number): never {
  console.error(`sdd-dirigent: ${message}`);
  process.exit(code);
}

interface Run {
  root: string;
  project: string;
  pr: string;
  branch: string;
  table: TaskTable;
  tasks: Task[];
  spec: string;
  plan: string;
}

function load(project: string, pr: string): Run {
  const root = git(process.cwd(), 'rev-parse', '--show-toplevel');
  const dir = join(root, 'specs', project);
  const table = parseTasks(readFileSync(join(dir, 'tasks.md'), 'utf8'));
  const tasks = tasksOfPr(table, pr).filter((task) => !task.status.includes('✅'));
  if (tasks.length === 0) fail(`keine offenen Tasks für ${pr} in specs/${project}/tasks.md.`, 2);
  return {
    root,
    project,
    pr,
    branch: `feature/${project}-${pr.toLowerCase()}`,
    table,
    tasks,
    spec: readFileSync(join(dir, 'spec.md'), 'utf8'),
    plan: readFileSync(join(dir, 'plan.md'), 'utf8'),
  };
}

function checkout(r: Run): void {
  if (!clean(r.root)) fail('Arbeitsverzeichnis nicht sauber – erst committen oder aufräumen.', 2);
  if (git(r.root, 'branch', '--list', r.branch) === '') git(r.root, 'switch', '-q', '-c', r.branch, 'main');
  else git(r.root, 'switch', '-q', r.branch);
}

function runTask(r: Run, task: Task): void {
  if (committed(r.root, r.branch, task)) {
    console.log(`✓ ${task.id} schon auf ${r.branch}`);
    return;
  }
  const context = writeContext(r.root, task.id, taskContext(r.table, task, r.spec, r.plan, r.project));
  const prompt = `/sdd-implement ${r.project} ${task.id}\n\nKontextpaket: ${context}`;
  const done = (): boolean => clean(r.root) && committed(r.root, r.branch, task) && checksPass(r.root);
  if (!session(r.root, r.project, task.id, `${r.pr} ${task.id}`, prompt, done)) {
    fail(
      `${task.id} nicht abgeschlossen (Prüfungen rot, nicht committet oder kein Commit „${task.id}: …“). Abbruch.`,
      3,
    );
  }
}

function runReview(r: Run): boolean {
  const context = writeContext(r.root, r.pr, reviewContext(r.pr, r.branch, r.tasks, r.project));
  const prompt = `/sdd-implement ${r.project} review ${r.pr}\n\nKontextpaket: ${context}`;
  return session(r.root, r.project, `${r.pr} Review`, `${r.pr} Review`, prompt, () => clean(r.root));
}

function main(): void {
  const [project, pr] = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));
  if (project === undefined || pr === undefined) fail('Aufruf: cli.ts <NN-name> <PR-xx> [--dry-run]', 2);
  const r = load(project, pr);
  if (process.argv.includes('--dry-run')) {
    for (const task of r.tasks) console.log(taskContext(r.table, task, r.spec, r.plan, r.project));
    console.log(reviewContext(r.pr, r.branch, r.tasks, r.project));
    return;
  }
  checkout(r);
  for (const task of r.tasks) runTask(r, task);
  const ok = runReview(r);
  const total = sessions.reduce((sum, s) => sum + s.costUsd, 0);
  const state = ok ? 'abgeschlossen' : 'Review-Sitzung nicht sauber beendet';
  console.log(`\n${pr}: ${sessions.length} Sitzungen, $${total.toFixed(2)} (Listenpreis laut Claude Code), ${state}.`);
  process.exit(ok ? 0 : 3);
}

main();
