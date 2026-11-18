import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// AK-24: Die gesamte Historie wird regelmäßig gescannt, auch wenn kein PR läuft
// (neue gitleaks-Regeln oder Sperrbegriffe greifen so auch für alte Commits).
// Bewusst ohne YAML-Bibliothek (wie repo.test.ts): geprüft wird der Text des Workflows.

const WORKFLOWS = join(import.meta.dirname, '..', '..', '.github', 'workflows');
const scan = readFileSync(join(WORKFLOWS, 'history-scan.yml'), 'utf8');
const ci = readFileSync(join(WORKFLOWS, 'ci.yml'), 'utf8');

const envValue = (workflow: string, name: string) => new RegExp(`^\\s+${name}: (\\S+)$`, 'm').exec(workflow)?.[1];

describe('history-scan.yml (AK-24)', () => {
  it('läuft monatlich und auf Knopfdruck', () => {
    expect(scan).toMatch(/^\s+schedule:\s*\n\s+- cron: '\d+ \d+ \d+ \* \*'/m);
    expect(scan).toMatch(/^\s+workflow_dispatch:/m);
  });

  it('scannt die ganze Historie mit Pflicht-Sperrliste', () => {
    expect(scan).toMatch(/fetch-depth: 0/);
    expect(scan).toMatch(/node tools\/public-scan\/src\/cli\.ts git \. --require-blocklist/);
    expect(scan).toMatch(/PUBLIC_BLOCKLIST: \$\{\{ secrets\.PUBLIC_BLOCKLIST \}\}/);
    expect(scan).toMatch(/^permissions:\s*\n\s+contents: read\s*$/m);
  });

  it('nutzt dieselbe gitleaks-Version wie ci.yml', () => {
    expect(envValue(scan, 'GITLEAKS_VERSION')).toBe(envValue(ci, 'GITLEAKS_VERSION'));
    expect(envValue(scan, 'GITLEAKS_SHA256')).toBe(envValue(ci, 'GITLEAKS_SHA256'));
  });
});
