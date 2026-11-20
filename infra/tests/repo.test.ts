import { beforeAll, describe, expect, it } from 'vitest';

// AK-1: Repo ist öffentlich, `main` geschützt, CI läuft bei jedem PR.
// Prüft den echten Zustand bei GitHub über öffentliche Endpunkte (kein Admin-Token nötig).
// Nicht abgedeckt: „keine Ausnahme für Admins“ – die öffentliche API zeigt die Bypass-Liste nicht (Nachweis: Protokoll T-10).

const REPO = 'codeslage/werkstatt';
// Einziger Pflicht-Check ist der Sammel-Job ci-ok, gesetzt nur von GitHub Actions (App-ID 15368), damit keine
// andere App einen gleichnamigen Status melden kann (Plan 05). Dass ci-ok jeden Job abwartet, prüft cwk-workflows.test.ts.
const REQUIRED_CHECK = { context: 'ci-ok', integration_id: 15368 };

async function github(path: string): Promise<unknown> {
  const headers: Record<string, string> = { Accept: 'application/vnd.github+json' };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const response = await fetch(`https://api.github.com${path}`, { headers });
  if (!response.ok) throw new Error(`GitHub ${path}: HTTP ${response.status}`);
  return response.json();
}

interface BranchRule {
  type: string;
  parameters?: { required_status_checks?: { context: string; integration_id?: number }[] };
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

  it('verlangt ci-ok als einzigen Pflicht-Check, gesetzt von GitHub Actions', () => {
    const required = rules.flatMap((rule) => rule.parameters?.required_status_checks ?? []);
    expect(required).toEqual([REQUIRED_CHECK]);
  });
});
