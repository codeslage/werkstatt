import { describe, expect, it } from 'vitest';
import { evaluateNeeds } from '../src/ci-ok.ts';

// AK-3, AK-27: ci-ok ist der einzige Pflicht-Check. Er ist nur grün, wenn kein Job fehlgeschlagen oder
// abgebrochen ist; übersprungen sein darf nur der Code-Teil, und nur in Repos ohne Code.

const needs = (results: Record<string, string>) =>
  JSON.stringify(Object.fromEntries(Object.entries(results).map(([job, result]) => [job, { result, outputs: {} }])));

describe('ci-ok (AK-3, AK-27)', () => {
  it.each([
    ['alles erfolgreich, mit Code', { rules: 'success', code: 'success' }, true, []],
    ['alles erfolgreich, ohne Code', { rules: 'success', code: 'success' }, false, []],
    ['Code übersprungen, ohne Code', { rules: 'success', code: 'skipped' }, false, []],
  ])('grün: %s', (_name, results, code, errors) => {
    expect(evaluateNeeds(needs(results), code)).toEqual(errors);
  });

  it.each([
    ['Regeln fehlgeschlagen', { rules: 'failure', code: 'success' }, true, ['rules: failure']],
    ['Code abgebrochen', { rules: 'success', code: 'cancelled' }, true, ['code: cancelled']],
    ['Code übersprungen, mit Code', { rules: 'success', code: 'skipped' }, true, ['code: skipped']],
    ['Regeln übersprungen, ohne Code', { rules: 'skipped', code: 'skipped' }, false, ['rules: skipped']],
    ['eigener Job übersprungen', { rules: 'success', code: 'success', web: 'skipped' }, true, ['web: skipped']],
    ['Fehler im Code ohne Code', { rules: 'success', code: 'failure' }, false, ['code: failure']],
    ['unbekanntes Ergebnis', { rules: 'neutral', code: 'success' }, true, ['rules: neutral']],
  ])('rot: %s', (_name, results, code, errors) => {
    expect(evaluateNeeds(needs(results), code)).toEqual(errors);
  });

  it('ist rot ohne Jobs oder bei ungültiger Eingabe', () => {
    expect(evaluateNeeds('{}', true)).toEqual(['keine Jobs in needs']);
    expect(evaluateNeeds('nicht json', true)).toEqual([expect.stringMatching(/needs: kein gültiges JSON/)]);
    expect(evaluateNeeds(JSON.stringify({ rules: 'success' }), true)).toEqual(['rules: kein Ergebnis']);
  });
});
