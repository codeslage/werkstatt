import { ESLint } from 'eslint';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { eslintViolations } from './eslint-fixtures.ts';

const REPO_ROOT = join(import.meta.dirname, '..', '..', '..');
const FIXTURE_PATH = join(REPO_ROOT, 'tools', 'quality-fixtures', 'test', 'fixture.ts');
const eslint = new ESLint({ cwd: REPO_ROOT });

async function ruleIds(code: string): Promise<(string | null)[]> {
  const [result] = await eslint.lintText(code, { filePath: FIXTURE_PATH });
  return result?.messages.map((message) => message.ruleId) ?? [];
}

describe('ESLint-Grenzen nach Artikel XV (AK-18)', () => {
  it.each(Object.entries(eslintViolations))('meldet %s', async (ruleId, code) => {
    expect(await ruleIds(code)).toContain(ruleId);
  });

  it('lässt sauberen Code ohne Befund', async () => {
    expect(await ruleIds('export const ok = 1;\n')).toEqual([]);
  });
});
