import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// AK-5: Der Drift-Check vergleicht main regelmäßig mit der echten Infrastruktur.
// AK-14: Er arbeitet nur mit Read-only-Tokens; den Schreib-Token codeslage-tofu-rw gibt es nur lokal.
// Bewusst ohne YAML-Bibliothek (wie repo.test.ts): geprüft wird der Text des Workflows.

const WORKFLOWS = join(import.meta.dirname, '..', '..', '.github', 'workflows');
const drift = readFileSync(join(WORKFLOWS, 'drift.yml'), 'utf8');

describe('drift.yml (AK-5, AK-14)', () => {
  it('läuft wöchentlich, bei PRs auf infra/ und auf Knopfdruck', () => {
    expect(drift).toMatch(/^\s+schedule:\s*\n\s+- cron: /m);
    expect(drift).toMatch(/^\s+pull_request:\s*\n\s+paths:\s*\n\s+- 'infra\/\*\*'/m);
    expect(drift).toMatch(/^\s+workflow_dispatch:/m);
  });

  it('meldet jede Abweichung als Fehler und sperrt den State nicht', () => {
    expect(drift).toMatch(/tofu -chdir=infra\/tofu\/live plan .*-detailed-exitcode/);
    expect(drift).toMatch(/tofu -chdir=infra\/tofu\/live plan .*-lock=false/);
  });

  it('nutzt nur Read-only-Tokens', () => {
    const secrets = [...drift.matchAll(/secrets\.(\w+)/g)].map((match) => match[1] ?? '');
    expect(secrets).toContain('CF_API_TOKEN_RO');
    expect(secrets).toContain('R2_STATE_RO_ACCESS_KEY_ID');
    expect(secrets).not.toContain('CLOUDFLARE_API_TOKEN');
    expect(secrets.filter((name) => /TOKEN|ACCESS_KEY/.test(name)).every((name) => name.includes('_RO'))).toBe(true);
    expect(drift).toMatch(/^permissions:\s*\n\s+contents: read\s*$/m);
  });

  it('installiert OpenTofu über das gemeinsame Skript, also in derselben Version wie die CI', () => {
    expect(drift).toMatch(/run: sh \.github\/scripts\/install-tofu\.sh$/m);
    expect(drift).not.toMatch(/TOFU_VERSION/);
  });
});
