import { describe, expect, it } from 'vitest';
import { readImprint } from '../src/site/imprint.ts';

// Plan 06, Datenmodell: Impressumsangaben kommen nur aus der Build-Umgebung und werden geprüft (Constitution VII).
// Ungültiges bricht den Build ab (XVI), die Meldung nennt die Variable, nie den Wert. AK-12.

const complete = {
  IMPRESSUM_NAME: 'Erika Mustermann',
  IMPRESSUM_STRASSE: 'Musterstraße 1',
  IMPRESSUM_PLZ_ORT: '12345 Musterstadt',
};

function messageOf(action: () => unknown): string {
  try {
    action();
    return '';
  } catch (error) {
    return String(error);
  }
}

describe('readImprint', () => {
  it('liest alle Angaben', () => {
    expect(readImprint(complete)).toEqual({
      name: 'Erika Mustermann',
      street: 'Musterstraße 1',
      postalCodeCity: '12345 Musterstadt',
    });
  });

  it('entfernt Leerraum am Rand', () => {
    expect(readImprint({ ...complete, IMPRESSUM_NAME: '  Erika Mustermann ' }).name).toBe('Erika Mustermann');
  });

  it('nennt jede fehlende Variable', () => {
    expect(() => readImprint({ IMPRESSUM_STRASSE: 'Musterstraße 1' })).toThrow(/IMPRESSUM_NAME.*IMPRESSUM_PLZ_ORT/);
  });

  it('behandelt leere Werte wie fehlende', () => {
    expect(() => readImprint({ ...complete, IMPRESSUM_STRASSE: '   ' })).toThrow(/IMPRESSUM_STRASSE/);
  });

  it('lehnt zu lange Werte ab', () => {
    expect(() => readImprint({ ...complete, IMPRESSUM_NAME: 'x'.repeat(101) })).toThrow(/IMPRESSUM_NAME/);
  });

  it('lehnt Steuerzeichen ab', () => {
    expect(() => readImprint({ ...complete, IMPRESSUM_PLZ_ORT: '12345\nMusterstadt' })).toThrow(/IMPRESSUM_PLZ_ORT/);
    expect(() => readImprint({ ...complete, IMPRESSUM_NAME: 'Erika\u0000' })).toThrow(/IMPRESSUM_NAME/);
  });

  it('gibt den Wert nie in der Meldung preis', () => {
    const message = messageOf(() => readImprint({ ...complete, IMPRESSUM_NAME: 'Geheim\tName' }));
    expect(message).toMatch(/IMPRESSUM_NAME/);
    expect(message).not.toContain('Geheim');
  });
});
