import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';

// AK-1: Repo ist öffentlich, `main` geschützt, CI läuft bei jedem PR.
// Prüft den echten Zustand bei GitHub über öffentliche Endpunkte (kein Admin-Token nötig).
// Nicht abgedeckt: „keine Ausnahme für Admins“ – die öffentliche API zeigt die Bypass-Liste nicht (Nachweis: Protokoll T-10).

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

/** Antworten der API gegen die erwartete Form prüfen statt ihnen blind zu vertrauen (Artikel VII). */
function asRules(value: unknown): BranchRule[] {
  if (!Array.isArray(value) || !value.every((rule) => typeof rule?.type === 'string')) {
    throw new Error('Unerwartete Antwort für Branch-Regeln');
  }
  return value as BranchRule[];
}

function asVisibility(value: unknown): string {
  const visibility = (value as { visibility?: unknown } | null)?.visibility;
  if (typeof visibility !== 'string') throw new Error('Unerwartete Antwort für das Repo');
  return visibility;
}

/**
 * Die Check-Namen aller Jobs in ci.yml: `name:` des Jobs, sonst seine ID – so benennt GitHub den Check.
 * Bewusst ohne YAML-Bibliothek: Job-IDs stehen mit 2 Leerzeichen unter `jobs:`, ihr `name:` mit 4.
 */
function ciCheckNames(): string[] {
  const lines = readFileSync(CI_WORKFLOW, 'utf8').split(/\r?\n/);
  const jobs = lines.slice(lines.indexOf('jobs:') + 1);
  const names: string[] = [];
  for (const line of jobs) {
    const id = /^ {2}([\w-]+):\s*$/.exec(line)?.[1];
    if (id) names.push(id);
    const name = /^ {4}name:\s*(.+?)\s*$/.exec(line)?.[1];
    if (name) names[names.length - 1] = name.replace(/^(['"])(.*)\1$/, '$2');
  }
  return names;
}

describe(`Repo ${REPO} bei GitHub (AK-1)`, () => {
  let rules: BranchRule[] = [];

  beforeAll(async () => {
    rules = asRules(await github(`/repos/${REPO}/rules/branches/main`));
  });

  it('ist öffentlich', async () => {
    expect(asVisibility(await github(`/repos/${REPO}`))).toBe('public');
  });

  it('schützt main: nur per PR, kein Force-Push, keine Löschung, Status-Checks Pflicht', () => {
    const types = rules.map((rule) => rule.type);
    expect(types).toEqual(
      expect.arrayContaining(['pull_request', 'non_fast_forward', 'deletion', 'required_status_checks']),
    );
  });

  it('verlangt jeden Job aus ci.yml als Pflicht-Check', () => {
    const required = rules
      .flatMap((rule) => rule.parameters?.required_status_checks ?? [])
      .map((check) => check.context);
    expect(ciCheckNames().length).toBeGreaterThan(0);
    expect(required).toEqual(expect.arrayContaining(ciCheckNames()));
  });
});
