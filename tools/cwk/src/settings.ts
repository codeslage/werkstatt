// `cwk settings` (Plan 05, T-47): Job „Repo-Einstellungen“ in Projekt-Repos. Prüft den echten Zustand bei GitHub
// mit dem Lese-Token des Laufs. Nicht prüfbar ist die Bypass-Liste: Die API zeigt sie nur Admins (wie repo.test.ts).

export type GitHubGet = (path: string) => Promise<unknown>;

export interface SettingsResult {
  errors: string[];
  notes: string[];
}

interface Rule {
  type: string;
  parameters?: Record<string, unknown>;
}

const RULESETS = ['main-checks', 'main-approval'];
const REQUIRED_RULES = ['deletion', 'non_fast_forward', 'pull_request', 'required_status_checks'];
const REQUIRED_CHECK = 'ci-ok';
/** App-ID von GitHub Actions: Nur sie darf ci-ok setzen, keine andere App mit gleichnamigem Status. */
const GITHUB_ACTIONS = 15368;
const PRIVATE_NOTE = 'privat, ohne Schutz: GitHub Free kann main in privaten Repos nicht schützen (Plan 05, P1)';

function expectArray(value: unknown, what: string): Record<string, unknown>[] {
  if (!Array.isArray(value) || !value.every((item) => typeof item === 'object' && item !== null)) {
    throw new Error(`Unerwartete Antwort von GitHub für ${what}`);
  }
  return value as Record<string, unknown>[];
}

async function visibilityOf(get: GitHubGet, repo: string): Promise<string> {
  const visibility = ((await get(`/repos/${repo}`)) as { visibility?: unknown } | null)?.visibility;
  if (typeof visibility !== 'string') throw new Error('Unerwartete Antwort von GitHub für die Sichtbarkeit');
  return visibility;
}

async function rulesetErrors(get: GitHubGet, repo: string): Promise<string[]> {
  const names = expectArray(await get(`/repos/${repo}/rulesets`), 'Rulesets').map((ruleset) => ruleset.name);
  return RULESETS.filter((name) => !names.includes(name)).map((name) => `Ruleset ${name} fehlt`);
}

function pullRequestErrors(rule: Rule | undefined): string[] {
  if (rule === undefined) return [];
  const parameters = rule.parameters ?? {};
  const required: [string, boolean][] = [
    ['required_approving_review_count', Number(parameters.required_approving_review_count) >= 1],
    ['require_code_owner_review', parameters.require_code_owner_review === true],
    ['dismiss_stale_reviews_on_push', parameters.dismiss_stale_reviews_on_push === true],
    ['require_last_push_approval', parameters.require_last_push_approval === true],
  ];
  return required.filter(([, ok]) => !ok).map(([field]) => `main: pull_request ohne ${field}`);
}

function statusCheckErrors(rules: Rule[]): string[] {
  const checks = rules
    .filter((rule) => rule.type === 'required_status_checks')
    .flatMap((rule) => (rule.parameters?.required_status_checks as Record<string, unknown>[] | undefined) ?? []);
  const pinned = checks.some((check) => check.context === REQUIRED_CHECK && check.integration_id === GITHUB_ACTIONS);
  return pinned ? [] : [`main: Pflicht-Check ${REQUIRED_CHECK} mit Quelle GitHub Actions fehlt`];
}

async function branchErrors(get: GitHubGet, repo: string): Promise<string[]> {
  const rules = expectArray(await get(`/repos/${repo}/rules/branches/main`), 'Branch-Regeln') as unknown as Rule[];
  const types = rules.map((rule) => rule.type);
  return [
    ...REQUIRED_RULES.filter((type) => !types.includes(type)).map((type) => `main: Regel ${type} fehlt`),
    ...pullRequestErrors(rules.find((rule) => rule.type === 'pull_request')),
    ...statusCheckErrors(rules),
  ];
}

/** GitHub meldet hier u. a. „Unknown owner“, wenn das Team kein Schreibrecht hat und deshalb kein Code-Owner ist. */
async function codeownerErrors(get: GitHubGet, repo: string, hasCodeowners: boolean): Promise<string[]> {
  if (!hasCodeowners) return ['CODEOWNERS fehlt'];
  const errors = ((await get(`/repos/${repo}/codeowners/errors`)) as { errors?: unknown } | null)?.errors;
  return expectArray(errors, 'CODEOWNERS').map((error) => `CODEOWNERS Zeile ${error.line}: ${error.message}`);
}

export async function checkSettings(get: GitHubGet, repo: string, hasCodeowners: boolean): Promise<SettingsResult> {
  if ((await visibilityOf(get, repo)) !== 'public') return { errors: [], notes: [PRIVATE_NOTE] };
  const errors = [
    ...(await rulesetErrors(get, repo)),
    ...(await branchErrors(get, repo)),
    ...(await codeownerErrors(get, repo, hasCodeowners)),
  ];
  return { errors, notes: [] };
}
