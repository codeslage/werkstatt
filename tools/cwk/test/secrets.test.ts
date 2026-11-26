import { describe, expect, it } from 'vitest';
import { syncSecrets } from '../src/secrets.ts';
import { fakeRun, notFound } from './fake-run.ts';

// AK-3, AK-15 (Projekte): `cwk secrets` setzt PUBLIC_BLOCKLIST in allen Repos der Organisation neu und schreibt
// das Datum je Repo nach platform/blocklist-status.json. Gesetzt wird es für Actions und für Dependabot, weil Läufe
// von Dependabot nur Dependabot-Secrets sehen (Review PR-2: Dependabot-PRs in cwk-sample waren im Scan rot). Die Sperrliste selbst erscheint nie in einer Ausgabe.

const STATUS_PATH = '/repos/codeslage/platform/contents/blocklist-status.json';
const encode = (value: object) => Buffer.from(JSON.stringify(value)).toString('base64');

const repos = [
  'gh api --paginate /orgs/codeslage/repos --jq .[].full_name',
  { stdout: 'codeslage/werkstatt\ncodeslage/demo\n' },
] as const;

describe('cwk secrets (AK-3)', () => {
  it('setzt die Sperrliste in jedem Repo und schreibt das Datum nach platform', () => {
    const existing = { 'codeslage/werkstatt': '2026-11-01', 'codeslage/alt': '2026-10-01' };
    const { calls, deps } = setupWith([
      repos,
      [`gh api ${STATUS_PATH}`, { stdout: JSON.stringify({ sha: 'abc', content: encode(existing) }) }],
    ]);
    const notes = syncSecrets(deps);
    const secretCalls = calls.filter((call) => call.line.startsWith('gh secret set'));
    expect(secretCalls.map((call) => [call.line, call.input])).toEqual([
      ['gh secret set PUBLIC_BLOCKLIST -R codeslage/werkstatt --app actions', 'geheim\n'],
      ['gh secret set PUBLIC_BLOCKLIST -R codeslage/werkstatt --app dependabot', 'geheim\n'],
      ['gh secret set PUBLIC_BLOCKLIST -R codeslage/demo --app actions', 'geheim\n'],
      ['gh secret set PUBLIC_BLOCKLIST -R codeslage/demo --app dependabot', 'geheim\n'],
    ]);
    const put = calls.find((call) => call.line === `gh api -X PUT ${STATUS_PATH} --input -`);
    const body = JSON.parse(put?.input ?? '{}');
    expect(body.sha).toBe('abc');
    expect(JSON.parse(Buffer.from(body.content, 'base64').toString('utf8'))).toEqual({
      'codeslage/werkstatt': '2026-11-21',
      'codeslage/alt': '2026-10-01',
      'codeslage/demo': '2026-11-21',
    });
    expect(notes).toEqual([]);
  });

  it('legt blocklist-status.json an, wenn es sie noch nicht gibt', () => {
    const { calls, deps } = setupWith([repos, [`gh api ${STATUS_PATH}`, notFound]]);
    syncSecrets(deps);
    const body = JSON.parse(calls.find((call) => call.line.includes('-X PUT'))?.input ?? '{}');
    expect(body.sha).toBeUndefined();
  });
});

describe('cwk secrets: Sonderfälle (AK-3, Artikel VII)', () => {
  it('gibt einen Hinweis, wenn platform noch fehlt', () => {
    const { deps } = setupWith([repos, ['gh api /repos/codeslage/platform', notFound]]);
    expect(syncSecrets(deps)).toEqual(['platform fehlt noch: Datum der Sperrliste später eintragen (T-45)']);
  });

  it('bricht ohne Sperrliste ab und gibt sie nie aus', () => {
    expect(() => syncSecrets(setupWith([repos], ' \n').deps)).toThrow(/Sperrliste/);
    const { calls, deps } = setupWith([repos, ['gh secret set', { status: 1, stderr: 'forbidden' }]]);
    let message = '';
    try {
      syncSecrets(deps);
    } catch (error) {
      message = (error as Error).message;
    }
    expect(message).toMatch(/gh secret set PUBLIC_BLOCKLIST -R codeslage\/werkstatt --app actions.*forbidden/);
    expect(message).not.toContain('geheim');
    expect(calls).toHaveLength(2);
  });

  it('lehnt einen ungültigen Inhalt von blocklist-status.json ab (Artikel VII)', () => {
    const { deps } = setupWith([
      repos,
      [`gh api ${STATUS_PATH}`, { stdout: JSON.stringify({ sha: 'x', content: encode(['a']) }) }],
    ]);
    expect(() => syncSecrets(deps)).toThrow(/blocklist-status\.json/);
  });
});

function setupWith(rules: Parameters<typeof fakeRun>[0], blocklist = 'geheim\n') {
  const fake = fakeRun(rules);
  return { ...fake, deps: { run: fake.run, blocklist, today: '2026-11-21' } };
}
