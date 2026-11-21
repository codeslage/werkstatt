// Schnittstelle zu gh und git für `cwk new` und `cwk secrets` (Plan 05, Schritt 2): Tests ersetzen `Run`.

import { spawnSync } from 'node:child_process';

export const ORG = 'codeslage';

export interface RunResult {
  status: number;
  stdout: string;
  stderr: string;
}

export type Run = (cmd: string, args: string[], options?: { cwd?: string; input?: string }) => RunResult;

export const spawnRun: Run = (cmd, args, options = {}) => {
  const result = spawnSync(cmd, args, { encoding: 'utf8', cwd: options.cwd, input: options.input });
  if (result.error) throw new Error(`${cmd}: ${result.error.message}`);
  return { status: result.status ?? 1, stdout: result.stdout, stderr: result.stderr };
};

/** Führt einen Befehl aus und bricht mit Befehlszeile und Fehlerausgabe ab, nie mit der Eingabe (Sperrliste). */
export function must(run: Run, cmd: string, args: string[], options: { cwd?: string; input?: string } = {}): string {
  const result = run(cmd, args, options);
  if (result.status !== 0) throw new Error(`${[cmd, ...args].join(' ')}: ${result.stderr.trim()}`);
  return result.stdout;
}

/** gh api mit JSON-Antwort; undefined bei HTTP 404, jeder andere Fehler bricht ab. */
export function ghGet(run: Run, path: string): unknown {
  const result = run('gh', ['api', path]);
  if (result.status !== 0) {
    if (result.stderr.includes('HTTP 404')) return undefined;
    throw new Error(`gh api ${path}: ${result.stderr.trim()}`);
  }
  try {
    return JSON.parse(result.stdout);
  } catch {
    throw new Error(`gh api ${path}: Antwort ist kein JSON`);
  }
}

/** Gibt es die Ressource? false bei HTTP 404, jeder andere Fehler bricht ab. */
export function ghExists(run: Run, path: string): boolean {
  const result = run('gh', ['api', path, '--silent']);
  if (result.status === 0) return true;
  if (result.stderr.includes('HTTP 404')) return false;
  throw new Error(`gh api ${path}: ${result.stderr.trim()}`);
}

export function ghSend(run: Run, method: 'POST' | 'PUT', path: string, body: object): void {
  must(run, 'gh', ['api', '-X', method, path, '--input', '-'], { input: JSON.stringify(body) });
}
