import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { createProject, type NewDeps } from '../src/new.ts';
import { MAIN_APPROVAL, MAIN_CHECKS } from '../src/rulesets.ts';
import type { Manifest } from '../src/schema.ts';
import { checkSettings } from '../src/settings.ts';
import { fakeRun, notFound } from './fake-run.ts';

// AK-1, AK-3, AK-4, AK-6, AK-27: `cwk new` legt ein Repo aus der Vorlage an, setzt cwk.json, Team, Sperrliste und
// bei öffentlichen Repos beide Rulesets und die Schreib-App. Fehlen platform oder App noch, gibt es einen Hinweis.

const SHA = 'c'.repeat(40);
const manifest: Manifest = {
  files: [
    { source: 'CONSTITUTION.md', target: 'CONSTITUTION.md', part: 'rules', mode: 'exact' },
    { source: 'packages/config/eslint.config.js', target: 'eslint.config.js', part: 'code', mode: 'exact' },
  ],
};

let workDir = '';
afterEach(() => rmSync(workDir, { recursive: true, force: true }));

/** Simuliert `gh repo clone`: legt den Stand der Vorlage im Zielordner an. */
function cloneTemplate(dir: string) {
  // Wie codeslage/project-template: App in src/, eigene tsconfig.json, Docker-Dateien, cwk.json mit docs public.
  mkdirSync(join(dir, 'src'), { recursive: true });
  writeFileSync(join(dir, 'src', 'health.ts'), '');
  writeFileSync(join(dir, 'cwk.json'), `{ "cwk": "${SHA}", "code": true, "docs": "public" }\n`);
  for (const file of ['eslint.config.js', 'tsconfig.json', 'Dockerfile', '.dockerignore', 'package.json']) {
    writeFileSync(join(dir, file), '');
  }
  return {};
}

const INSTALLATIONS = JSON.stringify({ installations: [{ id: 77, app_slug: 'codeslage-cwk' }] });

function setup(rules: Parameters<typeof fakeRun>[0] = []) {
  workDir = mkdtempSync(join(tmpdir(), 'cwk-new-'));
  // Regeln des Tests zuerst: Die erste passende Regel gewinnt.
  const fake = fakeRun([
    ...rules,
    ['gh repo clone', (call) => cloneTemplate(call.line.split(' ')[4] ?? '')],
    ['gh api /orgs/codeslage/installations', { stdout: INSTALLATIONS }],
    ['gh api /repos/codeslage/demo --jq .id', { stdout: '4242\n' }],
    ['gh api /repos/codeslage/platform/contents/blocklist-status.json', notFound],
  ]);
  const deps: NewDeps = {
    run: fake.run,
    workDir,
    blocklist: 'geheim\n',
    manifest,
    today: '2026-11-21',
    sleep: () => {},
  };
  return { ...fake, deps };
}

describe('cwk new: öffentlich mit Code (AK-1, AK-4, AK-6)', () => {
  it('legt das Repo an, setzt Sperrliste vor dem ersten Push, dann Team, Rulesets und App', () => {
    const { lines, calls, deps } = setup();
    createProject({ name: 'demo', isPrivate: false, code: true }, deps);
    const order = lines();
    const index = (prefix: string) => order.findIndex((line) => line.startsWith(prefix));
    expect(order[0]).toBe('gh repo create codeslage/demo --template codeslage/project-template --public');
    expect(calls.find((call) => call.line.startsWith('gh secret set'))).toMatchObject({
      line: 'gh secret set PUBLIC_BLOCKLIST -R codeslage/demo',
      input: 'geheim\n',
    });
    expect(index('gh secret set')).toBeLessThan(index('git -C'));
    expect(order).toContain('gh api -X PUT /orgs/codeslage/teams/maintainers/repos/codeslage/demo -f permission=push');
    expect(index('git -C')).toBeLessThan(index('gh api -X POST /repos/codeslage/demo/rulesets'));
    expect(order.filter((line) => line === 'gh api -X POST /repos/codeslage/demo/rulesets --input -')).toHaveLength(2);
    expect(order).toContain('gh api -X PUT /user/installations/77/repositories/4242');
  });

  it('schickt genau die Rulesets, die cwk settings verlangt', async () => {
    const { calls, deps } = setup();
    createProject({ name: 'demo', isPrivate: false, code: true }, deps);
    const sent = calls
      .filter((call) => call.line.endsWith('/rulesets --input -'))
      .map((call) => JSON.parse(call.input ?? ''));
    expect(sent).toEqual([MAIN_CHECKS, MAIN_APPROVAL]);
    const get = async (path: string) =>
      ({
        '/repos/codeslage/demo': { visibility: 'public' },
        '/repos/codeslage/demo/rulesets': sent,
        '/repos/codeslage/demo/rules/branches/main': sent.flatMap((ruleset) => ruleset.rules),
        '/repos/codeslage/demo/codeowners/errors': { errors: [] },
      })[path];
    expect(await checkSettings(get, 'codeslage/demo', ['CODEOWNERS'])).toEqual({ errors: [], notes: [] });
  });

  it('startet die erste CI mit einem Commit auf main', () => {
    const { lines, deps } = setup();
    createProject({ name: 'demo', isPrivate: false, code: true }, deps);
    expect(lines().some((line) => /^git -C \S+ commit --allow-empty -m /.test(line))).toBe(true);
    expect(lines().some((line) => /^git -C \S+ push origin main$/.test(line))).toBe(true);
  });
});

describe('cwk new: privat und ohne Code (AK-27, P1)', () => {
  it('setzt bei privaten Repos weder Rulesets noch App und meldet das', () => {
    const { lines, deps } = setup();
    const notes = createProject({ name: 'demo', isPrivate: true, code: true }, deps);
    expect(lines()[0]).toBe('gh repo create codeslage/demo --template codeslage/project-template --private');
    expect(lines().some((line) => line.includes('/rulesets') || line.includes('/user/installations'))).toBe(false);
    expect(notes).toContain('privat: keine Rulesets und keine Schreib-App (GitHub Free, Plan 05 P1)');
  });

  // Probelauf T-12: src/, tsconfig.json und .dockerignore blieben stehen; cwk.json war für Prettier falsch formatiert.
  it('entfernt ohne Code den Code-Teil und die Beispiel-App, package.json bleibt', () => {
    const { lines, deps } = setup();
    createProject({ name: 'demo', isPrivate: true, code: false }, deps);
    const rm = lines().find((line) => line.includes(' rm -r -q '));
    expect(rm).toMatch(/ rm -r -q -- eslint\.config\.js src tsconfig\.json Dockerfile \.dockerignore$/);
    expect(readFileSync(join(workDir, 'demo', 'cwk.json'), 'utf8')).toBe(`{ "cwk": "${SHA}", "code": false }\n`);
  });

  // Probelauf T-12: Ein privates Repo erbte "docs": "public" aus der Vorlage; seine Doku wäre öffentlich geworden.
  it('lässt docs weg, damit der Standard nach Sichtbarkeit gilt (AK-14)', () => {
    const { lines, deps } = setup();
    createProject({ name: 'demo', isPrivate: true, code: true }, deps);
    expect(readFileSync(join(workDir, 'demo', 'cwk.json'), 'utf8')).toBe(`{ "cwk": "${SHA}", "code": true }\n`);
    expect(lines()).toContain(`git -C ${join(workDir, 'demo')} add cwk.json`);
  });
});

describe('cwk new: fehlende Bausteine und Eingaben (AK-1)', () => {
  it('gibt einen Hinweis statt abzubrechen, wenn Schreib-App oder platform fehlen', () => {
    const { deps } = setup([
      ['gh api /orgs/codeslage/installations', { stdout: JSON.stringify({ installations: [] }) }],
      ['gh api /repos/codeslage/platform', notFound],
    ]);
    const notes = createProject({ name: 'demo', isPrivate: false, code: true }, deps);
    expect(notes).toEqual([
      'Schreib-App codeslage-cwk ist noch nicht installiert: Repo später aufnehmen (T-45)',
      'platform fehlt noch: Datum der Sperrliste später eintragen (T-45)',
    ]);
  });

  it.each(['Demo', '-demo', 'a b', 'werkstatt', 'project-template', ''])('lehnt den Namen „%s“ ab', (name) => {
    const { lines, deps } = setup();
    expect(() => createProject({ name, isPrivate: false, code: true }, deps)).toThrow(/Name/);
    expect(lines()).toEqual([]);
  });

  it('bricht ab, wenn gh scheitert, und nennt den Befehl', () => {
    const { deps } = setup([['gh repo create', { status: 1, stderr: 'name already exists' }]]);
    expect(() => createProject({ name: 'demo', isPrivate: false, code: true }, deps)).toThrow(
      /gh repo create .*: name already exists/,
    );
  });
});
