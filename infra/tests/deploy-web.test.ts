import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// Plan 06, T-26: Deploy der Webseite (AK-2, AK-10) und Web-Tests im Drift-Workflow (AK-9, XVI).

const WORKFLOWS = join(import.meta.dirname, '..', '..', '.github', 'workflows');
const read = (name: string) => {
  const file = join(WORKFLOWS, name);
  return existsSync(file) ? readFileSync(file, 'utf8') : '';
};
const deploy = read('deploy-web.yml');
const drift = read('drift.yml');

describe('deploy-web.yml (T-26)', () => {
  it('läuft bei Push auf main nur bei Änderungen in apps/web', () => {
    expect(deploy).toMatch(/^\s+push:\s*\n\s+branches: \[main\]\s*\n\s+paths:\s*\n\s+- 'apps\/web\/\*\*'/m);
    expect(deploy).not.toMatch(/^\s+pull_request/m);
  });

  it('bekommt den Deploy-Token nur über das Environment production', () => {
    expect(deploy).toMatch(/^\s+environment: production$/m);
    expect(deploy).toContain('secrets.CF_PAGES_TOKEN');
    expect(deploy).toContain('vars.PUBLIC_CF_BEACON_TOKEN');
  });

  it('baut, lädt mit wrangler hoch und prüft danach die Live-Seite', () => {
    const build = deploy.indexOf('pnpm --filter @codeslage/web build');
    const upload = deploy.indexOf('wrangler pages deploy');
    const live = deploy.indexOf('pnpm test:infra web.test.ts');
    expect(build).toBeGreaterThan(-1);
    expect(upload).toBeGreaterThan(build);
    expect(live).toBeGreaterThan(upload);
    expect(deploy).toMatch(/--project-name=codeslage-web --branch=main/);
  });
});

describe('drift.yml prüft auch die Webseite (T-26)', () => {
  it('führt web.test.ts aus', () => {
    expect(drift).toContain('pnpm test:infra web.test.ts');
  });
});
