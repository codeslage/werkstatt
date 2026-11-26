// Rulesets für öffentliche Projekt-Repos (Plan 05, Datenmodell). `cwk new` setzt sie, `cwk settings` prüft sie;
// new.test.ts beweist, dass beides zusammenpasst.

const DEFAULT_BRANCH = { ref_name: { include: ['~DEFAULT_BRANCH'], exclude: [] } };
/** App-ID von GitHub Actions: Nur sie darf ci-ok setzen. */
const GITHUB_ACTIONS = 15368;
/** Rolle „Repository admin“; Bypass nur für PRs, damit der Inhaber eigene PRs nach grüner CI mergen kann. */
const REPOSITORY_ADMIN = 5;

const pullRequest = (approvals: number, strict: boolean) => ({
  type: 'pull_request',
  parameters: {
    required_approving_review_count: approvals,
    require_code_owner_review: strict,
    dismiss_stale_reviews_on_push: strict,
    require_last_push_approval: strict,
    required_review_thread_resolution: false,
  },
});

export const MAIN_CHECKS = {
  name: 'main-checks',
  target: 'branch',
  enforcement: 'active',
  conditions: DEFAULT_BRANCH,
  bypass_actors: [],
  rules: [
    { type: 'deletion' },
    { type: 'non_fast_forward' },
    pullRequest(0, false),
    {
      type: 'required_status_checks',
      parameters: {
        strict_required_status_checks_policy: false,
        required_status_checks: [{ context: 'ci-ok', integration_id: GITHUB_ACTIONS }],
      },
    },
  ],
};

export const MAIN_APPROVAL = {
  name: 'main-approval',
  target: 'branch',
  enforcement: 'active',
  conditions: DEFAULT_BRANCH,
  bypass_actors: [{ actor_id: REPOSITORY_ADMIN, actor_type: 'RepositoryRole', bypass_mode: 'pull_request' }],
  rules: [pullRequest(1, true)],
};
