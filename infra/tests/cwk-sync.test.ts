import { beforeAll, describe, expect, it, vi } from 'vitest';

// Plan 05, T-20 (AK-7, AK-8, AK-19, AK-25, AK-27): Zustand nach einem Lauf von `sync.yml` in platform. Läuft auf
// Anforderung, nicht in jeder CI von werkstatt, mit GITHUB_TOKEN des Inhabers (gh auth token): Rulesets und Bypass
// zeigt die API nur Admins. Ablauf und Probe-Änderungen: Runbook cwk-sync.md, Abschnitt Sync-Test.

// Viele API-Aufrufe je Test, dazu Wartezeit auf `mergeable_state`.
vi.setConfig({ testTimeout: 120_000, hookTimeout: 30_000 });

const ORG = 'codeslage';
const SOURCE = 'werkstatt';
const APP = 'codeslage-cwk[bot]';

async function github(path: string): Promise<unknown> {
  const headers: Record<string, string> = { Accept: 'application/vnd.github+json' };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const response = await fetch(`https://api.github.com${path}`, { headers, signal: AbortSignal.timeout(15_000) });
  if (response.status === 404) return undefined;
  if (!response.ok) throw new Error(`GitHub ${path}: HTTP ${response.status}`);
  return response.json();
}

/** Antworten nur in der erwarteten Form verwenden (Artikel VII). */
function list<T>(value: unknown, check: (item: unknown) => boolean): T[] {
  if (!Array.isArray(value) || !value.every(check)) throw new Error('Unerwartete Antwort von GitHub');
  return value as T[];
}

const isObject = (item: unknown): item is Record<string, unknown> => typeof item === 'object' && item !== null;

/** Datei auf einem Branch als Text; undefined, wenn es sie dort nicht gibt. */
async function fileOn(repo: string, branch: string, path: string): Promise<string | undefined> {
  const content = await github(`/repos/${ORG}/${repo}/contents/${path}?ref=${encodeURIComponent(branch)}`);
  if (content === undefined) return undefined;
  if (!isObject(content) || typeof content.content !== 'string') throw new Error(`${repo}/${path}: keine Datei`);
  return Buffer.from(content.content, 'base64').toString('utf8');
}

interface Repo {
  name: string;
  visibility: string;
  archived: boolean;
}

interface Pull {
  number: number;
  user: { login: string };
}

let latest = '';
let targets: string[] = [];
let others: string[] = [];

beforeAll(async () => {
  const main = await github(`/repos/${ORG}/${SOURCE}/commits/main`);
  if (!isObject(main) || typeof main.sha !== 'string') throw new Error('werkstatt/main nicht lesbar');
  latest = main.sha;
  const repos = list<Repo>(await github(`/orgs/${ORG}/repos?per_page=100`), (item) => isObject(item));
  const active = repos.filter((repo) => !repo.archived);
  targets = active.filter((repo) => repo.visibility === 'public' && repo.name !== SOURCE).map((repo) => repo.name);
  others = active.filter((repo) => !targets.includes(repo.name)).map((repo) => repo.name);
});

async function openSyncPulls(repo: string): Promise<Pull[]> {
  const pulls = await github(`/repos/${ORG}/${repo}/pulls?state=open&head=${ORG}:cwk/sync`);
  return list<Pull>(pulls, (item) => isObject(item) && typeof item.number === 'number');
}

/** GitHub berechnet `mergeable_state` nachträglich; direkt nach einem Push steht dort oft `unknown` (Review PR-3b). */
async function mergeableState(repo: string, number: number): Promise<unknown> {
  for (let attempt = 0; attempt < 10; attempt++) {
    const detail = await github(`/repos/${ORG}/${repo}/pulls/${number}`);
    const state = isObject(detail) ? detail.mergeable_state : undefined;
    if (state !== 'unknown') return state;
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }
  return 'unknown';
}

describe('CWK-Sync: Soll-Menge hat je einen Sync-PR auf dem neuesten Stand (AK-7, AK-25)', () => {
  it('kennt mindestens die Vorlage als Ziel', () => {
    expect(targets).toContain('project-template');
  });

  // Zugleich der Nachweis, dass die Schreib-App in jedem dieser Repos installiert ist (T-45): Ohne Installation
  // scheitert ihr Push, und cwk/sync stünde nicht auf dem neuesten Stand (nächster Test).
  it('hat in jedem öffentlichen Projekt-Repo genau einen offenen Sync-PR der Schreib-App', async () => {
    for (const repo of targets) {
      const pulls = await openSyncPulls(repo);
      expect(
        pulls.map((pull) => pull.user.login),
        repo,
      ).toEqual([APP]);
    }
  });

  it('setzt auf cwk/sync den Stand von werkstatt/main und bringt die Probe je Teil (AK-27)', async () => {
    for (const repo of targets) {
      const config = JSON.parse((await fileOn(repo, 'cwk/sync', 'cwk.json')) ?? '{}') as Record<string, unknown>;
      expect(config.cwk, repo).toBe(latest);
      expect(await fileOn(repo, 'cwk/sync', '.cwk/probe.md'), repo).toBeDefined();
      const probeCode = await fileOn(repo, 'cwk/sync', '.cwk/probe-code.md');
      expect(probeCode !== undefined, `${repo}: Code-Probe nur mit Code`).toBe(config.code !== false);
    }
  });

  it.runIf(process.env.CWK_OWN_COMMIT !== undefined)(
    'behält einen eigenen Commit auf cwk/sync (CWK_OWN_COMMIT=<repo>:<sha>)',
    async () => {
      const [repo = '', sha = ''] = (process.env.CWK_OWN_COMMIT ?? '').split(':');
      const compare = await github(`/repos/${ORG}/${repo}/compare/${sha}...cwk/sync`);
      expect(isObject(compare) ? compare.status : undefined).toMatch(/^(ahead|identical)$/);
    },
  );
});

describe('CWK-Sync: Sperrliste in jedem Repo (T-45)', () => {
  it('trägt jedes Repo mit Datum in platform/blocklist-status.json', async () => {
    const status = JSON.parse((await fileOn('platform', 'main', 'blocklist-status.json')) ?? '{}') as Record<
      string,
      unknown
    >;
    const missing = [...targets, ...others].filter(
      (repo) => !/^\d{4}-\d{2}-\d{2}$/.test(String(status[`${ORG}/${repo}`])),
    );
    expect(missing).toEqual([]);
  });
});

describe('CWK-Sync: Schreib-App kann nicht mergen und erreicht nur die Soll-Menge (AK-8, AK-19)', () => {
  it('sperrt jeden Sync-PR, bis das Team freigibt', async () => {
    for (const repo of targets) {
      for (const pull of await openSyncPulls(repo)) {
        expect(await mergeableState(repo, pull.number), `${repo}#${pull.number}`).toBe('blocked');
      }
    }
  });

  it('lässt in keinem Ruleset eine App am Review vorbei (ersetzt den Merge-Versuch mit dem App-Token)', async () => {
    for (const repo of [SOURCE, ...targets]) {
      const rulesets = list<{ id: number }>(await github(`/repos/${ORG}/${repo}/rulesets`), isObject);
      for (const { id } of rulesets) {
        const detail = await github(`/repos/${ORG}/${repo}/rulesets/${id}`);
        const actors = isObject(detail) && Array.isArray(detail.bypass_actors) ? detail.bypass_actors : [];
        const apps = actors.filter((actor) => isObject(actor) && actor.actor_type === 'Integration');
        expect(apps, `${repo}: Ruleset ${id}`).toEqual([]);
      }
    }
  });

  it('hat in werkstatt und privaten Repos keinen Sync-PR der Schreib-App', async () => {
    for (const repo of others) {
      const pulls = await openSyncPulls(repo);
      expect(
        pulls.filter((pull) => pull.user.login === APP),
        repo,
      ).toEqual([]);
    }
  });
});
