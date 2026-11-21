import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';

// Prüfungen für HCL im CI-Job „Code / IaC (OpenTofu)“ (cwk-code.yml), bewiesen mit Gegenbeispielen.
// AK-18: tflint mit der echten Repo-Konfiguration meldet toten Code. Wird .tflint.hcl gelockert, wird der Test rot.
// AK-30: falsch formatiertes HCL macht die CI rot. Wird aus „fmt -check“ ein reines „fmt“, wird der Test rot.
// Braucht tofu und tflint im PATH (CI-Job „Infra-Tests“, lokal: docs/runbooks/tofu-state.md).

const REPO_ROOT = join(import.meta.dirname, '..', '..');
const REPO_CONFIG = join(REPO_ROOT, '.tflint.hcl');
const dir = mkdtempSync(join(tmpdir(), 'tflint-'));

afterAll(() => rmSync(dir, { recursive: true, force: true }));

function tflint(mainTf: string) {
  writeFileSync(join(dir, 'main.tf'), mainTf);
  const result = spawnSync('tflint', ['--config', REPO_CONFIG, '--format', 'json'], { cwd: dir, encoding: 'utf8' });
  if (result.error) throw new Error('tflint nicht gefunden', { cause: result.error });
  const output = JSON.parse(result.stdout) as { issues: { rule: { name: string } }[]; errors: { message: string }[] };
  if (output.errors.length > 0) throw new Error(`tflint-Fehler: ${output.errors.map((e) => e.message).join('; ')}`);
  return { exitCode: result.status, rules: output.issues.map((issue) => issue.rule.name) };
}

const REQUIRED_VERSION = 'terraform {\n  required_version = ">= 1.10"\n}\n';

describe('tflint (AK-18)', () => {
  it('lässt sauberen Code durch', () => {
    expect(tflint(REQUIRED_VERSION)).toEqual({ exitCode: 0, rules: [] });
  });

  it('meldet eine ungenutzte Variable', () => {
    const result = tflint(`${REQUIRED_VERSION}\nvariable "unused" {\n  type = string\n}\n`);
    expect(result.exitCode).not.toBe(0);
    expect(result.rules).toEqual(['terraform_unused_declarations']);
  });
});

describe('tofu fmt (AK-30)', () => {
  it('der CI-Job prüft die Formatierung nur, statt sie zu korrigieren', () => {
    const ci = readFileSync(join(REPO_ROOT, '.github', 'workflows', 'cwk-code.yml'), 'utf8');
    expect(ci).toContain('tofu fmt -check -recursive -diff infra/tofu');
  });

  it('falsch formatiertes HCL fällt durch', () => {
    writeFileSync(join(dir, 'main.tf'), 'terraform {\nrequired_version = ">= 1.10"\n}\n');
    const result = spawnSync('tofu', ['fmt', '-check', '-recursive', '-diff', '.'], { cwd: dir, encoding: 'utf8' });
    if (result.error) throw new Error('tofu nicht gefunden', { cause: result.error });
    expect(result.status).not.toBe(0);
    expect(result.stdout).toContain('main.tf');
  });
});
