import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { allowed, TEST_BLOCK_TERM, violations } from './fixtures.ts';

const CLI = join(import.meta.dirname, '..', 'src', 'cli.ts');
const REPO_ROOT = join(import.meta.dirname, '..', '..', '..');
const tempDirs: string[] = [];

afterEach(() => {
  for (const dir of tempDirs.splice(0)) rmSync(dir, { recursive: true, force: true });
});

interface ScanResult {
  exitCode: number | null;
  ruleIds: string[];
}

function scanText(content: string): ScanResult {
  const dir = mkdtempSync(join(tmpdir(), 'public-scan-'));
  tempDirs.push(dir);
  const target = join(dir, 'ziel');
  const report = join(dir, 'report.json');
  spawnSync('git', ['init', '-q', target]);
  writeFileSync(join(target, 'fixture.txt'), `${content}\n`);
  const result = spawnSync(process.execPath, [CLI, 'dir', target, '--report', report], {
    env: { ...process.env, PUBLIC_BLOCKLIST: TEST_BLOCK_TERM },
    encoding: 'utf8',
  });
  const findings = existsSync(report) ? JSON.parse(readFileSync(report, 'utf8')) : [];
  return { exitCode: result.status, ruleIds: findings.map((f: { RuleID: string }) => f.RuleID) };
}

describe('public-scan meldet Verstöße (AK-2, AK-24)', () => {
  it.each(Object.entries(violations))('%s', (_name, content) => {
    const result = scanText(content);
    expect(result.exitCode).toBe(1);
    expect(result.ruleIds.length).toBeGreaterThan(0);
  });

  it('ordnet die Funde den eigenen Regeln zu', () => {
    expect(scanText(violations.ipv4).ruleIds).toContain('codeslage-ipv4');
    expect(scanText(violations.ipv6).ruleIds).toContain('codeslage-ipv6');
    expect(scanText(violations.email).ruleIds).toContain('codeslage-email');
    expect(scanText(violations.blockTerm).ruleIds).toContain('codeslage-blocklist');
  });
});

describe('public-scan lässt Erlaubtes durch', () => {
  it.each(Object.entries(allowed))('%s', (_name, content) => {
    expect(scanText(content)).toEqual({ exitCode: 0, ruleIds: [] });
  });
});

describe('.gitignore hält Vertrauliches fern (AK-2)', () => {
  const isIgnored = (path: string) =>
    spawnSync('git', ['check-ignore', '-q', path], { cwd: REPO_ROOT }).status === 0;

  it.each(['.env', '.env.local', '.sperrliste', 'infra/x.tfstate', 'infra/x.tfstate.backup', 'infra/.terraform/a'])(
    'ignoriert %s',
    (path) => expect(isIgnored(path)).toBe(true),
  );

  it('versioniert .env.example', () => expect(isIgnored('.env.example')).toBe(false));
});
