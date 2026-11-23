import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';

// Plan 05, T-10/T-12 (AK-1, AK-2, AK-4): Vorlage und Probe-Repos bei GitHub. Pflichtdateien laut Manifest, beide
// Rulesets mit ci-ok aus GitHub Actions, das Team maintainers als gültiger Code-Owner, letzte CI auf main grün.
// Liest nur über öffentliche Endpunkte (GITHUB_TOKEN optional, nur für das Rate-Limit). Die Bypass-Liste zeigt die
// API nur Admins; sie steht im Protokoll.

const ROOT = join(import.meta.dirname, '..', '..');
const manifest = JSON.parse(readFileSync(join(ROOT, 'cwk', 'manifest.json'), 'utf8')) as {
  files: { target: string; part: string }[];
};
/** Dateien der Vorlage, die nicht aus dem CWK kommen (Plan 05 v4.2). */
const TEMPLATE_FILES = ['cwk.json', 'package.json', 'pnpm-lock.yaml', 'Dockerfile', '.env.example', 'src/health.ts'];

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

describe.each([['codeslage/project-template']])('%s (T-10, AK-1, AK-2, AK-4)', (repo) => {
  let info: unknown;
  let paths: string[] = [];
  let rules: { type: string; parameters?: Record<string, unknown> }[] = [];

  beforeAll(async () => {
    info = await github(`/repos/${repo}`);
    const tree = field<{ path: string }[]>(
      await github(`/repos/${repo}/git/trees/main?recursive=1`),
      'tree',
      Array.isArray,
    );
    paths = tree.map((entry) => entry.path);
    rules = (await github(`/repos/${repo}/rules/branches/main`)) as typeof rules;
  });

  it('ist öffentlich und als Vorlage markiert', () => {
    expect(field(info, 'visibility', (item) => typeof item === 'string')).toBe('public');
    expect(field(info, 'is_template', (item) => typeof item === 'boolean')).toBe(true);
  });

  it('enthält alle CWK-Dateien und die Dateien der Vorlage', () => {
    const required = [...manifest.files.map((file) => file.target), ...TEMPLATE_FILES];
    expect(required.filter((path) => !paths.includes(path))).toEqual([]);
  });

  it('hat beide Rulesets, ci-ok aus GitHub Actions und Code-Owner-Review', async () => {
    const names = ((await github(`/repos/${repo}/rulesets`)) as { name: string }[]).map((ruleset) => ruleset.name);
    expect(names).toEqual(expect.arrayContaining(['main-checks', 'main-approval']));
    const checks = rules.flatMap((rule) => (rule.parameters?.required_status_checks as unknown[] | undefined) ?? []);
    expect(checks).toEqual([{ context: 'ci-ok', integration_id: 15368 }]);
    const reviews = rules.filter((rule) => rule.type === 'pull_request').map((rule) => rule.parameters ?? {});
    expect(reviews.some((parameters) => parameters.require_code_owner_review === true)).toBe(true);
  });

  it('macht das Team maintainers zum gültigen Code-Owner (Schreibrecht)', async () => {
    expect(field(await github(`/repos/${repo}/codeowners/errors`), 'errors', Array.isArray)).toEqual([]);
  });

  it('hat eine grüne CI auf main', async () => {
    const runs = field<{ conclusion: string | null; status: string }[]>(
      await github(`/repos/${repo}/actions/workflows/ci.yml/runs?branch=main&event=push&per_page=1`),
      'workflow_runs',
      Array.isArray,
    );
    expect(runs[0]).toMatchObject({ status: 'completed', conclusion: 'success' });
  });
});
