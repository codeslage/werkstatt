import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// AK-1: Repo ist öffentlich, `main` geschützt, CI läuft bei jedem PR.
// Prüft den echten Zustand bei GitHub über öffentliche Endpunkte (kein Admin-Token nötig).

const REPO = 'codeslage/werkstatt';
const CI_WORKFLOW = join(import.meta.dirname, '..', '..', '.github', 'workflows', 'ci.yml');

async function github(path: string): Promise<unknown> {
  const headers: Record<string, string> = { Accept: 'application/vnd.github+json' };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const response = await fetch(`https://api.github.com${path}`, { headers });
  if (!response.ok) throw new Error(`GitHub ${path}: HTTP ${response.status}`);
  return response.json();
}

interface BranchRule {
  type: string;
  parameters?: { required_status_checks?: { context: string }[] };
}

/** Antwort der API gegen die erwartete Form prüfen statt ihr blind zu vertrauen (Artikel VII). */
function asRules(value: unknown): BranchRule[] {
  if (!Array.isArray(value) || !value.every((rule) => typeof rule?.type === 'string')) {
    throw new Error('Unerwartete Antwort für Branch-Regeln');
  }
  return value as BranchRule[];
}

/** Die Namen aller Jobs in ci.yml (Zeilen „    name: …“ direkt unter einer Job-ID). */
function ciJobNames(): string[] {
  const text = readFileSync(CI_WORKFLOW, 'utf8');
  return [...text.matchAll(/^ {4}name: (.+)$/gm)].map((match) => (match[1] ?? '').trim());
}

describe(`Repo ${REPO} bei GitHub (AK-1)`, () => {
  it('ist öffentlich', async () => {
    const repo = (await github(`/repos/${REPO}`)) as { visibility?: unknown };
    expect(repo.visibility).toBe('public');
  });

  it('schützt main: nur per PR, kein Force-Push, keine Löschung, Status-Checks Pflicht', async () => {
    const types = asRules(await github(`/repos/${REPO}/rules/branches/main`)).map((rule) => rule.type);
    expect(types).toEqual(expect.arrayContaining(['pull_request', 'non_fast_forward', 'deletion', 'required_status_checks']));
  });

  it('verlangt jeden Job aus ci.yml als Pflicht-Check', async () => {
    const required = asRules(await github(`/repos/${REPO}/rules/branches/main`))
      .flatMap((rule) => rule.parameters?.required_status_checks ?? [])
      .map((check) => check.context);
    expect(ciJobNames().length).toBeGreaterThan(0);
    expect(required).toEqual(expect.arrayContaining(ciJobNames()));
  });
});
