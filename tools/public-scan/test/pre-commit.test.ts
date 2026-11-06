import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { TEST_BLOCK_TERM, violations } from './fixtures.ts';

const HOOKS_DIR = join(import.meta.dirname, '..', '..', '..', '.githooks');
const tempDirs: string[] = [];

afterEach(() => {
  for (const dir of tempDirs.splice(0)) rmSync(dir, { recursive: true, force: true });
});

function git(cwd: string, ...args: string[]) {
  return spawnSync('git', args, {
    cwd,
    encoding: 'utf8',
    env: { ...process.env, PUBLIC_BLOCKLIST: TEST_BLOCK_TERM },
  });
}

/** Wegwerf-Repo, das den Hook aus diesem Repo nutzt. */
function repoWithHook(): string {
  const dir = mkdtempSync(join(tmpdir(), 'pre-commit-'));
  tempDirs.push(dir);
  git(dir, 'init', '-q');
  git(dir, 'config', 'user.name', 'Test');
  git(dir, 'config', 'user.email', 'test@example.com');
  git(dir, 'config', 'core.hooksPath', HOOKS_DIR);
  return dir;
}

function commitFile(content: string): number | null {
  const dir = repoWithHook();
  writeFileSync(join(dir, 'datei.txt'), `${content}\n`);
  git(dir, 'add', 'datei.txt');
  return git(dir, 'commit', '-q', '-m', 'test').status;
}

describe('pre-commit-Hook (Ebene 1, AK-2, AK-24)', () => {
  it.each(Object.entries(violations))('lehnt Commit ab: %s', (_name, content) => {
    expect(commitFile(content)).not.toBe(0);
  });

  it('lässt sauberen Commit durch', () => {
    expect(commitFile('Hallo codeslage')).toBe(0);
  });
});
