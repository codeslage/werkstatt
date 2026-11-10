import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { checkDocument } from '../src/check.ts';
import { NUMERALS, validPlan, validSpec, withRow } from './fixtures.ts';

const REPO_ROOT = join(import.meta.dirname, '..', '..', '..');
const CLI = join(import.meta.dirname, '..', 'src', 'cli.ts');

describe('Spec-Check: gültige Dokumente (AK-16)', () => {
  it('akzeptiert eine vollständige Spec', () => {
    expect(checkDocument('spec', validSpec, NUMERALS)).toEqual([]);
  });

  it('akzeptiert einen vollständigen Plan ohne AK-Tabelle', () => {
    expect(checkDocument('plan', validPlan, NUMERALS)).toEqual([]);
  });

  it('akzeptiert ⚠️ mit Anmerkung und – ohne Anmerkung', () => {
    let text = withRow(
      validSpec,
      'VIII Datenschutz & EU',
      '| VIII Datenschutz & EU | ⚠️ | US-Dienste, siehe dsgvo.md |',
    );
    text = withRow(text, 'IX Mensch im Loop', '| IX Mensch im Loop | – | |');
    expect(checkDocument('spec', text, NUMERALS)).toEqual([]);
  });
});

describe('Spec-Check: fehlende Pflichtteile werden gemeldet (AK-16)', () => {
  it.each([
    ['status-fehlt', validSpec.replace(/^> Status:.*$/m, '')],
    ['constitution-bezug-fehlt', validSpec.replace('`CONSTITUTION.md` (v1.1.0)', '`CONSTITUTION.md`')],
    ['ak-tabelle-fehlt', validPlan],
    ['constitution-check-fehlt', validSpec.replace('## Constitution-Check', '## Etwas anderes')],
    ['artikel-fehlt: XII', withRow(validSpec, 'XII Offen dokumentieren', '')],
    ['bewertung-ungueltig: III', withRow(validSpec, 'III Kleine Schritte', '| III Kleine Schritte | ok | passt |')],
    ['anmerkung-fehlt: VII', withRow(validSpec, 'VII Sicher als Standard', '| VII Sicher als Standard | ⚠️ | |')],
  ])('%s', (error, text) => {
    expect(checkDocument('spec', text, NUMERALS)).toContain(error);
  });
});

describe('Spec-Check über das Repo', () => {
  it('alle spec.md und plan.md unter specs/ sind vollständig', () => {
    const result = spawnSync(process.execPath, [CLI, join(REPO_ROOT, 'specs')], { encoding: 'utf8' });
    expect(result.stderr).toBe('');
    expect(result.status).toBe(0);
  });

  it('endet mit Exit 1 und nennt die Datei, wenn ein Dokument unvollständig ist', () => {
    const dir = mkdtempSync(join(tmpdir(), 'spec-check-'));
    try {
      mkdirSync(join(dir, '99-beispiel'));
      writeFileSync(join(dir, '99-beispiel', 'spec.md'), withRow(validSpec, 'XII Offen dokumentieren', ''));
      const result = spawnSync(process.execPath, [CLI, dir], { encoding: 'utf8' });
      expect(result.status).toBe(1);
      expect(result.stderr).toContain('artikel-fehlt: XII');
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
