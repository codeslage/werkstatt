import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';

// AK-18: tflint mit der echten Repo-Konfiguration meldet toten HCL-Code. Wird .tflint.hcl gelockert, wird dieser Test rot.
// Braucht tflint im PATH (CI-Job „Infra“, lokal: docs/runbooks/tofu-state.md).

const REPO_CONFIG = join(import.meta.dirname, '..', '..', '.tflint.hcl');
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
