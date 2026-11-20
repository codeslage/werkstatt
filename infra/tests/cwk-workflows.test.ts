import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// Plan 05, AK-3: Die Prüfungen des CWK sind wiederverwendbare Workflows, je Teil einer. werkstatt ruft sie selbst
// auf, Projekte über ihre ci.yml aus dem CWK. Einziger Pflicht-Check ist ci-ok, der alle Jobs abwartet.
// Bewusst ohne YAML-Bibliothek (wie repo.test.ts): Job-IDs stehen mit 2 Leerzeichen unter `jobs:`.

const ROOT = join(import.meta.dirname, '..', '..');
const read = (path: string) => readFileSync(join(ROOT, path), 'utf8');
const rules = read('.github/workflows/cwk-rules.yml');
const code = read('.github/workflows/cwk-code.yml');
const ci = read('.github/workflows/ci.yml');
const projectCi = read('cwk/files/.github/workflows/ci.yml');

/** Job-ID → Text des Jobs. */
function jobs(workflow: string): Map<string, string> {
  const lines = workflow.split('\n');
  const result = new Map<string, string>();
  let current: string | undefined;
  for (const line of lines.slice(lines.indexOf('jobs:') + 1)) {
    const id = /^ {2}([\w-]+):\s*$/.exec(line)?.[1];
    if (id) current = id;
    if (current) result.set(current, `${result.get(current) ?? ''}${line}\n`);
  }
  return result;
}

/** Die Schritte eines Jobs, je ab `      - `. */
const steps = (job: string) => job.split(/^ {6}- /m).slice(1);

const needsOf = (job: string) => [...(/needs: \[(.+)\]/.exec(job)?.[1]?.split(', ') ?? [])];

describe.each([
  ['cwk-rules.yml', rules],
  ['cwk-code.yml', code],
])('%s (AK-3)', (_file, workflow) => {
  it('ist wiederverwendbar und darf nur lesen', () => {
    expect(workflow).toMatch(/^on:\n {2}workflow_call:\n/m);
    expect(workflow).toMatch(/^permissions:\n {2}contents: read\n/m);
  });

  it('pinnt jede fremde Action auf einen Commit', () => {
    const uses = [...workflow.matchAll(/uses: (\S+)/g)].map((match) => match[1] ?? '');
    expect(uses.length).toBeGreaterThan(0);
    for (const action of uses.filter((ref) => !ref.startsWith('./'))) expect(action).toMatch(/@[0-9a-f]{40}$/);
  });

  it('installiert Werkzeuge nur über die gemeinsamen Skripte', () => {
    expect(workflow).not.toMatch(/_VERSION|releases\/download/);
  });
});

describe('cwk-rules.yml: Regel-Teil (AK-3, AK-9)', () => {
  it('hat die Jobs des Regel-Teils', () => {
    expect([...jobs(rules).keys()]).toEqual([
      'scan',
      'spec-check',
      'format',
      'spellcheck',
      'repo-settings',
      'cwk-check',
    ]);
  });

  it('nimmt die Werkzeuge aus der CWK-Quelle, Projekte also aus dem gepinnten Stand', () => {
    expect(rules).toMatch(/node "\$CWK_DIR\/tools\/public-scan\/src\/cli\.ts" git \. --require-blocklist/);
    expect(rules).toMatch(/node "\$CWK_DIR\/tools\/spec-check\/src\/cli\.ts" specs/);
    expect(rules).toMatch(/node "\$CWK_DIR\/tools\/cwk\/src\/cli\.ts" settings/);
    expect(rules).toMatch(
      /node "\$CWK_DIR\/tools\/cwk\/src\/cli\.ts" check --source "\$CWK_DIR" --base-ref FETCH_HEAD/,
    );
  });
});

describe('cwk-code.yml: Code-Teil (AK-3, AK-27)', () => {
  const codeJobs = jobs(code);

  it('überspringt jeden Job außer „Festlegungen“ in Repos ohne Code', () => {
    expect([...codeJobs.keys()]).toEqual([
      'config',
      'typecheck',
      'lint',
      'test',
      'knip',
      'dependency-cruiser',
      'iac',
      'container',
    ]);
    for (const [id, job] of [...codeJobs].slice(1)) {
      expect(job, id).toMatch(/needs: config\n {4}if: needs\.config\.outputs\.code == 'true'\n/);
    }
  });

  it('führt die IaC-Prüfungen nur bei *.tf-Dateien aus', () => {
    const iac = steps(codeJobs.get('iac') ?? '');
    expect(iac.some((step) => step.includes("git ls-files '*.tf'"))).toBe(true);
    const tofuSteps = iac.filter((step) => /tofu|tflint|cwk-source/.test(step) && !step.includes('git ls-files'));
    expect(tofuSteps).toHaveLength(4);
    for (const step of tofuSteps) expect(step).toContain("if: steps.tf.outputs.present == 'true'");
    expect(code).toMatch(/tofu fmt -check -recursive/);
    expect(code).toMatch(/tofu -chdir="\$root" validate/);
  });
});

describe('ci.yml von werkstatt und der Projekte (AK-3)', () => {
  it('werkstatt ruft beide Workflows lokal auf', () => {
    expect(jobs(ci).get('rules')).toContain('uses: ./.github/workflows/cwk-rules.yml');
    expect(jobs(ci).get('code')).toContain('uses: ./.github/workflows/cwk-code.yml');
  });

  it('ci-ok wartet in werkstatt auf jeden anderen Job und läuft auch nach Fehlern', () => {
    const ciOk = jobs(ci).get('ci-ok') ?? '';
    expect(ciOk).toMatch(/^ {4}if: always\(\)$/m);
    expect(needsOf(ciOk).sort()).toEqual([...jobs(ci).keys()].filter((id) => id !== 'ci-ok').sort());
    expect(ciOk).toMatch(/NEEDS: \$\{\{ toJSON\(needs\) \}\}/);
  });

  it('ci-ok der Projekte braucht Regel- und Code-Teil außerhalb des Projektblocks', () => {
    const outside = projectCi.slice(0, projectCi.indexOf('# cwk:project:start'));
    expect(outside).toMatch(/^ {2}ci-ok:\n(?: {4}.*\n)*? {4}if: always\(\)\n/m);
    expect(outside).toMatch(/^ {4}needs:\n {6}- rules\n {6}- code\n/m);
    expect(outside).toMatch(/node "\$CWK_DIR\/tools\/cwk\/src\/cli\.ts" ci-ok/);
  });
});
