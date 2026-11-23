import { describe, expect, it } from 'vitest';
import { parseConfig, parseManifest } from '../src/schema.ts';

// AK-9: Manifest und cwk.json werden vor der Verarbeitung gegen ein Schema geprüft (Artikel VII).
// AK-14: Standardwert von `docs` hängt von der Sichtbarkeit ab, öffentlich ist nie `internal`.

const SHA = 'a'.repeat(40);
const entry = { source: 'CONSTITUTION.md', target: 'CONSTITUTION.md', part: 'rules', mode: 'exact' };
const manifest = (files: unknown[]) => JSON.stringify({ files });

describe('parseManifest (AK-9)', () => {
  it('akzeptiert ein gültiges Manifest', () => {
    const ci = { source: 'cwk/files/ci.yml', target: '.github/workflows/ci.yml', part: 'rules', mode: 'extendable' };
    expect(parseManifest(manifest([entry, ci])).files).toEqual([entry, ci]);
  });

  it('lehnt kein JSON und eine leere Liste ab', () => {
    expect(() => parseManifest('{')).toThrow(/kein gültiges JSON/);
    expect(() => parseManifest(manifest([]))).toThrow(/files/);
    expect(() => parseManifest('[]')).toThrow(/files/);
  });

  it.each([
    ['fehlende Quelle', { ...entry, source: undefined }, /source/],
    ['leeres Ziel', { ...entry, target: '' }, /target/],
    ['falscher Teil', { ...entry, part: 'docs' }, /part/],
    ['falscher Modus', { ...entry, mode: 'loose' }, /mode/],
    ['unbekanntes Feld', { ...entry, extra: 1 }, /extra/],
    ['absolutes Ziel', { ...entry, target: '/etc/passwd' }, /target/],
    ['Ziel außerhalb des Repos', { ...entry, target: '../x.md' }, /target/],
    ['ergänzbar ohne Blockformat', { ...entry, source: 'a.js', target: 'a.js', mode: 'extendable' }, /extendable/],
  ])('lehnt %s ab', (_name, file, message) => {
    expect(() => parseManifest(manifest([file]))).toThrow(message);
  });

  it('lehnt ein Ziel ab, das doppelt vorkommt', () => {
    expect(() => parseManifest(manifest([entry, { ...entry, source: 'b.md' }]))).toThrow(/doppelt/);
  });
});

describe('parseConfig (AK-9, AK-14)', () => {
  it('setzt die Standardwerte: Code ja, docs nach Sichtbarkeit', () => {
    const text = JSON.stringify({ cwk: SHA });
    expect(parseConfig(text, 'public')).toEqual({ cwk: SHA, code: true, docs: 'public' });
    expect(parseConfig(text, 'private')).toEqual({ cwk: SHA, code: true, docs: 'internal' });
  });

  it('übernimmt gesetzte Werte', () => {
    const text = JSON.stringify({ cwk: SHA, code: false, docs: 'none' });
    expect(parseConfig(text, 'public')).toEqual({ cwk: SHA, code: false, docs: 'none' });
  });

  it.each([
    ['kein JSON', '{', /kein gültiges JSON/],
    ['fehlender Stand', JSON.stringify({ code: true }), /cwk/],
    ['kurzer SHA', JSON.stringify({ cwk: 'abc123' }), /cwk/],
    ['Code als Text', JSON.stringify({ cwk: SHA, code: 'yes' }), /code/],
    ['unbekannte Doku-Art', JSON.stringify({ cwk: SHA, docs: 'secret' }), /docs/],
    ['unbekanntes Feld', JSON.stringify({ cwk: SHA, owner: 'x' }), /owner/],
  ])('lehnt %s ab', (_name, text, message) => {
    expect(() => parseConfig(text, 'private')).toThrow(message);
  });

  it('lehnt internal in einem öffentlichen Repo ab', () => {
    expect(() => parseConfig(JSON.stringify({ cwk: SHA, docs: 'internal' }), 'public')).toThrow(/öffentlich/);
    expect(parseConfig(JSON.stringify({ cwk: SHA, docs: 'internal' }), 'private').docs).toBe('internal');
  });
});
