import { randomBytes } from 'node:crypto';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

// Plan 05, T-14 (AK-3): Negativtest je PR-Prüfung des CWK im öffentlichen Probe-Repo cwk-sample. Je Fall ein Probe-PR
// mit genau einem Verstoß; erwartet sind der passende Job rot, ci-ok rot und ein abgelehnter Merge. Danach werden die
// eigenen Probe-PRs geschlossen und ihre Branches gelöscht, sonst nichts. Schreibend, deshalb nur auf Anforderung:
//   CWK_NEGATIVE=1 GITHUB_TOKEN=$(gh auth token) pnpm test:infra cwk-negative.test.ts
// Der Merge läuft nie mit Bypass. Kann das Konto main-checks umgehen, bricht der Test vor dem ersten Merge ab.

const REPO = 'codeslage/cwk-sample';
const BRANCH_PREFIX = 'cwk-negative/';
/** Älterer werkstatt-Stand mit derselben cwk-code.yml wie der Pin von cwk-sample, damit nur der Pin falsch ist. */
const OTHER_CWK_COMMIT = 'b7c27bc75b5ead5419e5fec9e3c44778fc859646';
const RUN_TIMEOUT_MS = 25 * 60_000;
const POLL_MS = 15_000;

type Edit = (files: Map<string, string>) => void;

interface ProbeCase {
  id: string;
  /** Job, der rot werden muss; ci-ok kommt immer dazu. */
  job: string;
  /** Datei → neuer Inhalt, abgeleitet vom Stand auf main. */
  edit: Edit;
  /** Dateien von main, die edit braucht. */
  reads: string[];
  /**
   * Erst nach allen anderen Fällen öffnen: Der Scan holt alle Branches (fetch-depth 0), ein Secret auf einem Probe-
   * Branch macht sonst auch die Scans der anderen Probe-PRs rot.
   */
  last?: true;
}

interface Probe {
  probeCase: ProbeCase;
  branch: string;
  number: number;
  sha: string;
  failedJobs?: string[];
}

function replaceOnce(text: string, search: string, replacement: string): string {
  if (!text.includes(search)) throw new Error(`Probe: „${search}“ nicht gefunden`);
  return text.replace(search, replacement);
}

function change(path: string, search: string, replacement: string): Edit {
  return (files) => files.set(path, replaceOnce(files.get(path) ?? '', search, replacement));
}

function add(path: string, content: string): Edit {
  return (files) => files.set(path, content);
}

// Secret und Tippfehler entstehen erst zur Laufzeit: So enthält werkstatt selbst nichts, was der Scan oder die
// Rechtschreibprüfung hier melden würde (wie tools/public-scan/test/fixtures.ts).
function randomText(alphabet: string, length: number): string {
  return Array.from(randomBytes(length), (byte) => alphabet[byte % alphabet.length]).join('');
}

const BASE62 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const fakeSecret = (): string => randomText(BASE62, 48);
const unknownWord = (): string => randomText(BASE62.slice(36), 12);

const CASES: ProbeCase[] = [
  {
    id: 'format',
    job: 'Regeln / Format',
    reads: ['src/health.ts'],
    edit: change('src/health.ts', 'response.end(JSON.stringify(', 'response.end(  JSON.stringify('),
  },
  {
    id: 'spellcheck',
    job: 'Regeln / Rechtschreibung',
    reads: [],
    edit: (files) => files.set('docs/probe-rechtschreibung.md', `# Probe\n\nUnbekanntes Wort: ${unknownWord()}\n`),
  },
  {
    id: 'lint',
    job: 'Code / Lint',
    reads: ['src/health.ts'],
    edit: change('src/health.ts', "request.url === '/health';\n", "request.url === '/health';\n  if (!ok) debugger;\n"),
  },
  {
    id: 'typecheck',
    job: 'Code / Typecheck',
    reads: ['src/health.ts'],
    edit: change('src/health.ts', 'const ok = ', 'const ok: string = '),
  },
  {
    id: 'test',
    job: 'Code / Tests',
    reads: ['src/health.test.ts'],
    edit: change('src/health.test.ts', 'expect(response.status).toBe(200);', 'expect(response.status).toBe(201);'),
  },
  {
    id: 'knip',
    job: 'Code / Knip',
    reads: ['src/health.ts'],
    edit: (files) => files.set('src/health.ts', `${files.get('src/health.ts') ?? ''}\nexport const probeUnused = 1;\n`),
  },
  {
    id: 'spec-check',
    job: 'Regeln / Spec-Check',
    reads: [],
    edit: add('specs/99-probe/spec.md', '# Probe\n\nDiese Spec hat absichtlich keine Pflichtteile.\n'),
  },
  {
    id: 'constitution',
    job: 'Regeln / CWK-Abgleich',
    reads: ['CONSTITUTION.md'],
    edit: change(
      'CONSTITUTION.md',
      'Die Artikel sind kurz und überprüfbar.',
      'Die Artikel sind kurz und gut überprüfbar.',
    ),
  },
  {
    id: 'pin',
    job: 'Regeln / CWK-Abgleich',
    reads: ['.github/workflows/ci.yml', 'cwk.json'],
    edit: (files) => {
      const pin = (JSON.parse(files.get('cwk.json') ?? '{}') as { cwk?: unknown }).cwk;
      if (typeof pin !== 'string' || pin === OTHER_CWK_COMMIT) throw new Error('Probe: Pin in cwk.json unerwartet');
      change('.github/workflows/ci.yml', `cwk-code.yml@${pin}`, `cwk-code.yml@${OTHER_CWK_COMMIT}`)(files);
    },
  },
  {
    id: 'secret',
    job: 'Regeln / Secret- und Öffentlich-Scan',
    reads: [],
    last: true,
    // In docs/protokolle/, weil die Rechtschreibprüfung dort nicht prüft; so bleibt nur der Scan rot.
    edit: (files) =>
      files.set(
        'docs/protokolle/probe-secret.md',
        `# Probe\n\nFalsches Test-Secret aus T-14, kein echtes:\n\n\`\`\`text\nprobe_api_key = "${fakeSecret()}"\n\`\`\`\n`,
      ),
  },
];

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
  const rulesets = (await ok('GET', `/repos/${REPO}/rulesets`)) as { id: number; name: string }[];
  const checks = rulesets.find((ruleset) => ruleset.name === 'main-checks');
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
