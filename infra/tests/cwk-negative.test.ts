import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { CASES, type ProbeCase } from './cwk-negative-cases.ts';

// Plan 05, T-14 (AK-3): Negativtest je PR-Prüfung des CWK im öffentlichen Probe-Repo cwk-sample. Je Fall ein Probe-PR
// mit genau einem Verstoß; erwartet sind der passende Job rot, ci-ok rot und ein abgelehnter Merge. Danach werden die
// eigenen Probe-PRs geschlossen und ihre Branches gelöscht, sonst nichts. Schreibend, deshalb nur auf Anforderung:
//   CWK_NEGATIVE=1 GITHUB_TOKEN=$(gh auth token) pnpm test:infra cwk-negative.test.ts
// Der Merge läuft nie mit Bypass. Kann das Konto main-checks umgehen, bricht der Test vor dem ersten Merge ab.

const REPO = 'codeslage/cwk-sample';
const BRANCH_PREFIX = 'cwk-negative/';
const RUN_TIMEOUT_MS = 25 * 60_000;
const POLL_MS = 15_000;

interface Probe {
  probeCase: ProbeCase;
  branch: string;
  number: number;
  sha: string;
  failedJobs?: string[];
}

interface Response {
  status: number;
  body: unknown;
}

async function github(method: string, path: string, body?: unknown): Promise<Response> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error('GITHUB_TOKEN fehlt (gh auth token)');
  const response = await fetch(`https://api.github.com${path}`, {
    method,
    headers: { Accept: 'application/vnd.github+json', Authorization: `Bearer ${token}` },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  const text = await response.text();
  return { status: response.status, body: text === '' ? undefined : (JSON.parse(text) as unknown) };
}

async function ok(method: string, path: string, body?: unknown): Promise<unknown> {
  const response = await github(method, path, body);
  if (response.status >= 300) throw new Error(`GitHub ${method} ${path}: HTTP ${response.status}`);
  return response.body;
}

/** Antworten nur in der erwarteten Form verwenden (Artikel VII). */
function field<T>(value: unknown, key: string, check: (item: unknown) => boolean): T {
  const item = (value as Record<string, unknown> | null)?.[key];
  if (!check(item)) throw new Error(`Unerwartete Antwort von GitHub: ${key}`);
  return item as T;
}

const isString = (item: unknown): boolean => typeof item === 'string';
const isNumber = (item: unknown): boolean => typeof item === 'number';

async function mainSha(): Promise<string> {
  return field(field(await ok('GET', `/repos/${REPO}/git/ref/heads/main`), 'object', Boolean), 'sha', isString);
}

async function readFile(path: string): Promise<string> {
  const content = field<string>(await ok('GET', `/repos/${REPO}/contents/${path}?ref=main`), 'content', isString);
  return Buffer.from(content, 'base64').toString('utf8');
}

async function commitFiles(base: string, files: Map<string, string>, message: string): Promise<string> {
  const baseTree = field<string>(
    field(await ok('GET', `/repos/${REPO}/git/commits/${base}`), 'tree', Boolean),
    'sha',
    isString,
  );
  const tree = [...files].map(([path, content]) => ({ path, mode: '100644', type: 'blob', content }));
  const treeSha = field<string>(
    await ok('POST', `/repos/${REPO}/git/trees`, { base_tree: baseTree, tree }),
    'sha',
    isString,
  );
  return field(
    await ok('POST', `/repos/${REPO}/git/commits`, { message, tree: treeSha, parents: [base] }),
    'sha',
    isString,
  );
}

async function openProbe(probeCase: ProbeCase, base: string, stamp: string, probes: Probe[]): Promise<void> {
  const files = new Map<string, string>();
  for (const path of probeCase.reads) files.set(path, await readFile(path));
  probeCase.edit(files);
  const sha = await commitFiles(base, files, `Probe T-14 (${probeCase.id}): absichtlicher Verstoß`);
  const branch = `${BRANCH_PREFIX}${stamp}-${probeCase.id}`;
  await ok('POST', `/repos/${REPO}/git/refs`, { ref: `refs/heads/${branch}`, sha });
  const probe: Probe = { probeCase, branch, number: 0, sha };
  probes.push(probe);
  const pull = await ok('POST', `/repos/${REPO}/pulls`, {
    title: `Probe T-14: ${probeCase.id} (wird automatisch geschlossen)`,
    head: branch,
    base: 'main',
    body: `Negativtest aus codeslage/werkstatt \`infra/tests/cwk-negative.test.ts\`. Erwartet: „${probeCase.job}“ und ci-ok rot, Merge abgelehnt.`,
  });
  probe.number = field(pull, 'number', isNumber);
}

async function finishedRun(sha: string): Promise<number> {
  const deadline = Date.now() + RUN_TIMEOUT_MS;
  while (Date.now() < deadline) {
    const runs = field<{ id: number; status: string }[]>(
      await ok('GET', `/repos/${REPO}/actions/workflows/ci.yml/runs?head_sha=${sha}&event=pull_request`),
      'workflow_runs',
      Array.isArray,
    );
    const run = runs.find((item) => item.status === 'completed');
    if (run) return run.id;
    await new Promise((resolve) => setTimeout(resolve, POLL_MS));
  }
  throw new Error(`CI für ${sha} nicht rechtzeitig fertig`);
}

async function failedJobs(runId: number): Promise<string[]> {
  const jobs = field<{ name: string; conclusion: string | null }[]>(
    await ok('GET', `/repos/${REPO}/actions/runs/${runId}/jobs?per_page=50`),
    'jobs',
    Array.isArray,
  );
  return jobs.filter((job) => job.conclusion === 'failure').map((job) => job.name);
}

async function closeProbe(probe: Probe): Promise<void> {
  if (!probe.branch.startsWith(BRANCH_PREFIX)) throw new Error(`Kein Probe-Branch: ${probe.branch}`);
  if (probe.number > 0) await ok('PATCH', `/repos/${REPO}/pulls/${probe.number}`, { state: 'closed' });
  await ok('DELETE', `/repos/${REPO}/git/refs/heads/${probe.branch}`);
}

/** Kann das Konto main-checks umgehen, würde der Merge-Versuch womöglich gelingen. */
async function assertNoChecksBypass(): Promise<void> {
  const rulesets = await ok('GET', `/repos/${REPO}/rulesets`);
  if (!Array.isArray(rulesets)) throw new Error('Unerwartete Antwort von GitHub: rulesets');
  const checks = (rulesets as { id: number; name: string }[]).find((ruleset) => ruleset.name === 'main-checks');
  if (!checks) throw new Error('Ruleset main-checks fehlt');
  const bypass = field(await ok('GET', `/repos/${REPO}/rulesets/${checks.id}`), 'current_user_can_bypass', isString);
  if (bypass !== 'never') throw new Error(`Konto kann main-checks umgehen (${bypass}); Merge-Versuch wäre unsicher`);
}

/** Öffnet die Probe-PRs in zwei Gruppen (siehe ProbeCase.last) und wartet jeweils auf deren CI. */
async function runProbes(base: string, probes: Probe[]): Promise<void> {
  const stamp = new Date().toISOString().replace(/\D/g, '').slice(0, 14);
  for (const group of [CASES.filter((item) => !item.last), CASES.filter((item) => item.last)]) {
    for (const probeCase of group) await openProbe(probeCase, base, stamp, probes);
    const opened = probes.filter((probe) => group.includes(probe.probeCase));
    await Promise.all(
      opened.map(async (probe) => {
        probe.failedJobs = await failedJobs(await finishedRun(probe.sha));
      }),
    );
  }
}

describe.skipIf(process.env.CWK_NEGATIVE !== '1')(`${REPO}: Negativtest je PR-Prüfung (T-14, AK-3)`, () => {
  const probes: Probe[] = [];
  let mainBefore = '';

  beforeAll(
    async () => {
      await assertNoChecksBypass();
      mainBefore = await mainSha();
      await runProbes(mainBefore, probes);
    },
    2 * RUN_TIMEOUT_MS + 5 * 60_000,
  );

  afterAll(async () => {
    const errors: string[] = [];
    for (const probe of probes) await closeProbe(probe).catch((error: unknown) => errors.push(String(error)));
    if (errors.length > 0) throw new Error(`Aufräumen unvollständig: ${errors.join('; ')}`);
  }, 5 * 60_000);

  it.each(CASES.map((probeCase) => [probeCase.id, probeCase] as const))(
    '%s: passender Job und ci-ok rot, Merge abgelehnt',
    async (_id, probeCase) => {
      const probe = probes.find((item) => item.probeCase === probeCase);
      if (!probe) throw new Error(`Probe ${probeCase.id} nicht angelegt`);
      console.log(`${probeCase.id}: https://github.com/${REPO}/pull/${probe.number} → ${probe.failedJobs?.join(', ')}`);
      expect(probe.failedJobs?.toSorted()).toEqual([probeCase.job, 'ci-ok'].toSorted());

      const merge = await github('PUT', `/repos/${REPO}/pulls/${probe.number}/merge`, { sha: probe.sha });
      expect(merge.status, JSON.stringify(merge.body)).toBe(405);
      // Abgelehnt wegen des Pflicht-Checks, nicht aus einem anderen Grund (z. B. fehlendes Review).
      expect(JSON.stringify(merge.body)).toContain('ci-ok');
      expect(field(await ok('GET', `/repos/${REPO}/pulls/${probe.number}`), 'merged', (item) => item === false)).toBe(
        false,
      );
    },
    60_000,
  );

  it('lässt main unverändert', async () => {
    expect(await mainSha()).toBe(mainBefore);
  });
});
