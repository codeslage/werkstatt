import { describe, expect, it } from 'vitest';
import { readConfig } from '../src/config.ts';

// Plan 04-fundament: Konfiguration nur über Umgebungsvariablen; fehlt eine, beendet sich die App mit klarer Meldung (XVI).

const complete = { DATABASE_URL: 'postgres://app:pw@127.0.0.1:5432/app', APP_VERSION: 'abc1234', PORT: '3000' };

describe('readConfig', () => {
  it('liest alle Variablen', () => {
    expect(readConfig(complete)).toEqual({
      databaseUrl: complete.DATABASE_URL,
      version: 'abc1234',
      port: 3000,
    });
  });

  it('nennt jede fehlende Variable', () => {
    expect(() => readConfig({ APP_VERSION: 'abc1234' })).toThrow(/DATABASE_URL.*PORT/);
  });

  it('behandelt leere Werte wie fehlende', () => {
    expect(() => readConfig({ ...complete, APP_VERSION: '' })).toThrow(/APP_VERSION/);
  });

  it('lehnt einen ungültigen Port ab', () => {
    expect(() => readConfig({ ...complete, PORT: 'drei' })).toThrow(/PORT/);
    expect(() => readConfig({ ...complete, PORT: '70000' })).toThrow(/PORT/);
  });

  it('gibt den Wert von DATABASE_URL nie in der Meldung preis', () => {
    const message = (() => {
      try {
        readConfig({ ...complete, PORT: 'x' });
        return '';
      } catch (error) {
        return String(error);
      }
    })();
    expect(message).toMatch(/PORT/);
    expect(message).not.toContain('pw');
  });
});
