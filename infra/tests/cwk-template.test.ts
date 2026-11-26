import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';

// Plan 05, T-10/T-12 (AK-1, AK-2, AK-4, AK-6, AK-27): Vorlage und Probe-Repos bei GitHub. Pflichtdateien laut
// Manifest, bei öffentlichen Repos beide Rulesets mit ci-ok aus GitHub Actions und das Team maintainers als gültiger
// Code-Owner, letzte CI auf main grün; ohne Code nur Regel-Jobs. Läuft auf Anforderung, nicht in jeder CI von
// werkstatt. Das private Probe-Repo braucht GITHUB_TOKEN mit Lesezugriff (gh auth token). Die Bypass-Liste zeigt die
// API nur Admins; sie steht im Protokoll.

const ROOT = join(import.meta.dirname, '..', '..');
const manifest = JSON.parse(readFileSync(join(ROOT, 'cwk', 'manifest.json'), 'utf8')) as {
  files: { target: string; part: string }[];
};
/** Dateien der Vorlage, die nicht aus dem CWK kommen (Plan 05 v4.2). */
const APP_FILES = ['package.json', 'pnpm-lock.yaml', 'Dockerfile', '.env.example', 'src/health.ts'];
const RULES_FILES = ['package.json', 'pnpm-lock.yaml', '.env.example'];
/** Wie TEMPLATE_CODE in tools/cwk/src/new.ts. */
const NO_CODE_ABSENT = ['src', 'tsconfig.json', 'Dockerfile', '.dockerignore'];

interface Expected {
  repo: string;
  visibility: 'public' | 'private';
  template: boolean;
  code: boolean;
}

const REPOS: Expected[] = [
  { repo: 'codeslage/project-template', visibility: 'public', template: true, code: true },
  { repo: 'codeslage/cwk-sample', visibility: 'public', template: false, code: true },
  { repo: 'codeslage/cwk-sample-no-code', visibility: 'private', template: false, code: false },
];

async function github(path: string): Promise<unknown> {
  const headers: Record<string, string> = { Accept: 'application/vnd.github+json' };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const response = await fetch(`https://api.github.com${path}`, { headers });
  if (!response.ok) throw new Error(`GitHub ${path}: HTTP ${response.status}`);
  return response.json();
}

/** Antworten nur in der erwarteten Form verwenden (Artikel VII). */
function field<T>(value: unknown, key: string, check: (item: unknown) => boolean): T {
  const item = (value as Record<string, unknown> | null)?.[key];
  if (!check(item)) throw new Error(`Unerwartete Antwort von GitHub: ${key}`);
  return item as T;
}

async function lastMainRun(repo: string): Promise<{ id: number; status: string; conclusion: string | null }> {
  const runs = field<{ id: number; status: string; conclusion: string | null }[]>(
    await github(`/repos/${repo}/actions/workflows/ci.yml/runs?branch=main&event=push&per_page=1`),
    'workflow_runs',
    Array.isArray,
  );
  if (runs[0] === undefined) throw new Error(`${repo}: kein CI-Lauf auf main`);
  return runs[0];
}

describe.each(REPOS)('$repo (T-10, T-12)', (expected) => {
  const { repo } = expected;
  let info: unknown;
  let paths: string[] = [];

  beforeAll(async () => {
    info = await github(`/repos/${repo}`);
    const tree = field<{ path: string }[]>(
      await github(`/repos/${repo}/git/trees/main?recursive=1`),
      'tree',
      Array.isArray,
    );
    paths = tree.map((entry) => entry.path);
  });

  it('hat die erwartete Sichtbarkeit und Vorlagen-Markierung', () => {
    expect(field(info, 'visibility', (item) => typeof item === 'string')).toBe(expected.visibility);
    expect(field(info, 'is_template', (item) => typeof item === 'boolean')).toBe(expected.template);
  });

  it('enthält die CWK-Dateien seines Teils und die Dateien des Projekts', () => {
    const cwk = manifest.files.filter((file) => file.part === 'rules' || expected.code).map((file) => file.target);
    const required = [...cwk, 'cwk.json', ...(expected.code ? APP_FILES : RULES_FILES)];
    expect(required.filter((path) => !paths.includes(path))).toEqual([]);
  });

  it.runIf(!expected.code)('enthält ohne Code weder Code-Teil noch Beispiel-App (AK-27)', () => {
    const code = manifest.files.filter((file) => file.part === 'code').map((file) => file.target);
    const leftovers = paths.filter((path) =>
      [...code, ...NO_CODE_ABSENT].some((absent) => path === absent || path.startsWith(`${absent}/`)),
    );
    expect(leftovers).toEqual([]);
  });

  it.runIf(expected.visibility === 'public')(
    'hat beide Rulesets, ci-ok aus GitHub Actions und Code-Owner-Review',
    async () => {
      const names = ((await github(`/repos/${repo}/rulesets`)) as { name: string }[]).map((ruleset) => ruleset.name);
      expect(names).toEqual(expect.arrayContaining(['main-checks', 'main-approval']));
      const rules = (await github(`/repos/${repo}/rules/branches/main`)) as {
        type: string;
        parameters?: Record<string, unknown>;
      }[];
      const checks = rules.flatMap((rule) => (rule.parameters?.required_status_checks as unknown[] | undefined) ?? []);
      expect(checks).toEqual([{ context: 'ci-ok', integration_id: 15368 }]);
      const reviews = rules.filter((rule) => rule.type === 'pull_request').map((rule) => rule.parameters ?? {});
      expect(reviews.some((parameters) => parameters.require_code_owner_review === true)).toBe(true);
    },
  );
});

describe.each(REPOS)('$repo: Code-Owner und CI (T-10, T-12)', (expected) => {
  const { repo } = expected;

  it('macht das Team maintainers zum gültigen Code-Owner (Schreibrecht)', async () => {
    expect(field(await github(`/repos/${repo}/codeowners/errors`), 'errors', Array.isArray)).toEqual([]);
  });

  it('hat eine grüne CI auf main, ohne Code nur mit Regel-Jobs', async () => {
    const run = await lastMainRun(repo);
    expect(run).toMatchObject({ status: 'completed', conclusion: 'success' });
    const jobs = field<{ name: string; conclusion: string }[]>(
      await github(`/repos/${repo}/actions/runs/${run.id}/jobs?per_page=50`),
      'jobs',
      Array.isArray,
    );
    const codeJobs = jobs.filter((job) => job.name.startsWith('Code / ') && job.name !== 'Code / Festlegungen');
    expect(codeJobs.length).toBeGreaterThan(0);
    for (const job of codeJobs) expect(job.conclusion, job.name).toBe(expected.code ? 'success' : 'skipped');
  });
});
