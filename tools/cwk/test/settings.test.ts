import { describe, expect, it } from 'vitest';
import { checkSettings } from '../src/settings.ts';

// AK-2, AK-4, AK-27: Öffentliche Projekt-Repos haben beide Rulesets, ci-ok als einzigen Pflicht-Check aus
// GitHub Actions, das Team maintainers als gültigen Code-Owner. Private Repos lassen sich mit GitHub Free
// nicht schützen (P1) und sind grün mit Hinweis.

const REPO = 'codeslage/cwk-sample';
const GITHUB_ACTIONS = 15368;
const ROOT_ONLY = ['CODEOWNERS'];

const rulesets = [{ name: 'main-checks' }, { name: 'main-approval' }];
const rules = [
  { type: 'deletion' },
  { type: 'non_fast_forward' },
  {
    type: 'pull_request',
    parameters: {
      required_approving_review_count: 1,
      require_code_owner_review: true,
      dismiss_stale_reviews_on_push: true,
      require_last_push_approval: true,
    },
  },
  {
    type: 'required_status_checks',
    parameters: { required_status_checks: [{ context: 'ci-ok', integration_id: GITHUB_ACTIONS }] },
  },
];

function api(overrides: Record<string, unknown> = {}) {
  const responses: Record<string, unknown> = {
    [`/repos/${REPO}`]: { visibility: 'public' },
    [`/repos/${REPO}/rulesets`]: rulesets,
    [`/repos/${REPO}/rules/branches/main`]: rules,
    [`/repos/${REPO}/codeowners/errors`]: { errors: [] },
    ...overrides,
  };
  return async (path: string) => {
    if (!(path in responses)) throw new Error(`unerwarteter Aufruf ${path}`);
    return responses[path];
  };
}

const withRule = (type: string, change: object | undefined) =>
  rules.flatMap((rule) => (rule.type !== type ? [rule] : change === undefined ? [] : [{ ...rule, ...change }]));

describe('cwk settings: öffentliche Repos (AK-2, AK-4)', () => {
  it('ist grün, wenn alles vollständig ist', async () => {
    expect(await checkSettings(api(), REPO, ROOT_ONLY)).toEqual({ errors: [], notes: [] });
  });

  it('ist rot ohne Rulesets', async () => {
    const result = await checkSettings(
      api({ [`/repos/${REPO}/rulesets`]: [], [`/repos/${REPO}/rules/branches/main`]: [] }),
      REPO,
      ROOT_ONLY,
    );
    expect(result.errors).toEqual(
      expect.arrayContaining([
        'Ruleset main-checks fehlt',
        'Ruleset main-approval fehlt',
        'main: Regel deletion fehlt',
        'main: Regel pull_request fehlt',
        'main: Pflicht-Check ci-ok mit Quelle GitHub Actions fehlt',
      ]),
    );
  });

  it.each([
    ['ohne Code-Owner-Review', { require_code_owner_review: false }, 'require_code_owner_review'],
    ['ohne Verwerfen alter Freigaben', { dismiss_stale_reviews_on_push: false }, 'dismiss_stale_reviews_on_push'],
    ['ohne Freigabe des letzten Pushes', { require_last_push_approval: false }, 'require_last_push_approval'],
    ['ohne Approval', { required_approving_review_count: 0 }, 'required_approving_review_count'],
  ])('ist rot %s', async (_name, change, field) => {
    const parameters = { ...rules[2]?.parameters, ...change };
    const result = await checkSettings(
      api({ [`/repos/${REPO}/rules/branches/main`]: withRule('pull_request', { parameters }) }),
      REPO,
      ROOT_ONLY,
    );
    expect(result.errors).toEqual([`main: pull_request ohne ${field}`]);
  });
});

describe('cwk settings: zwei Rulesets und Quelle von ci-ok (AK-4)', () => {
  // main-checks braucht für „nur per PR“ eine eigene pull_request-Regel ohne Approval; die API liefert die Regeln
  // beider Rulesets nebeneinander, in beliebiger Reihenfolge (Review PR #62, Befund 1).
  it('fasst die pull_request-Regeln beider Rulesets zusammen, unabhängig von der Reihenfolge', async () => {
    const loose = {
      type: 'pull_request',
      parameters: {
        required_approving_review_count: 0,
        require_code_owner_review: false,
        dismiss_stale_reviews_on_push: false,
        require_last_push_approval: false,
      },
    };
    const strict = rules[2];
    const others = rules.filter((rule) => rule.type !== 'pull_request');
    for (const order of [
      [loose, strict],
      [strict, loose],
    ]) {
      const result = await checkSettings(
        api({ [`/repos/${REPO}/rules/branches/main`]: [...others, ...order] }),
        REPO,
        ROOT_ONLY,
      );
      expect(result.errors).toEqual([]);
    }
  });

  it('ist rot, wenn ci-ok aus einer anderen Quelle kommen darf', async () => {
    const parameters = { required_status_checks: [{ context: 'ci-ok' }] };
    const result = await checkSettings(
      api({ [`/repos/${REPO}/rules/branches/main`]: withRule('required_status_checks', { parameters }) }),
      REPO,
      ROOT_ONLY,
    );
    expect(result.errors).toEqual(['main: Pflicht-Check ci-ok mit Quelle GitHub Actions fehlt']);
  });
});

describe('cwk settings: CODEOWNERS und Antworten der API (AK-4)', () => {
  it('ist rot ohne CODEOWNERS oder wenn das Team kein Schreibrecht hat', async () => {
    expect((await checkSettings(api(), REPO, [])).errors).toEqual(['CODEOWNERS fehlt']);
    const unknown = { errors: [{ line: 1, message: 'Unknown owner on line 1: @codeslage/maintainers' }] };
    const result = await checkSettings(api({ [`/repos/${REPO}/codeowners/errors`]: unknown }), REPO, ROOT_ONLY);
    expect(result.errors).toEqual(['CODEOWNERS Zeile 1: Unknown owner on line 1: @codeslage/maintainers']);
  });

  // GitHub nimmt die erste Datei aus .github/, Wurzel, docs/ (Review PR #62, Befund 2).
  it('ist rot, wenn eine CODEOWNERS-Datei an anderer Stelle Vorrang haben könnte', async () => {
    for (const other of ['.github/CODEOWNERS', 'docs/CODEOWNERS']) {
      const result = await checkSettings(api(), REPO, ['CODEOWNERS', other]);
      expect(result.errors).toEqual([`${other}: nur CODEOWNERS im Wurzelverzeichnis ist erlaubt (CWK)`]);
    }
  });

  it('lehnt unerwartete Antworten der API ab (Artikel VII)', async () => {
    await expect(checkSettings(api({ [`/repos/${REPO}/rulesets`]: { name: 'x' } }), REPO, ROOT_ONLY)).rejects.toThrow(
      /Rulesets/,
    );
    await expect(checkSettings(api({ [`/repos/${REPO}`]: {} }), REPO, ROOT_ONLY)).rejects.toThrow(/Sichtbarkeit/);
  });
});

describe('cwk settings: private Repos (AK-27, P1)', () => {
  it('ist grün mit Hinweis und fragt nichts weiter ab', async () => {
    expect(await checkSettings(api({ [`/repos/${REPO}`]: { visibility: 'private' } }), REPO, [])).toEqual({
      errors: [],
      notes: ['privat, ohne Schutz: GitHub Free kann main in privaten Repos nicht schützen (Plan 05, P1)'],
    });
  });
});
