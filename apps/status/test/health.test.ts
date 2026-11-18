import { describe, expect, it } from 'vitest';
import { checkHealth } from '../src/health.ts';
import { parseHealth } from '../src/health-schema.ts';

// Plan 04-fundament, Datenmodell: /health meldet 200 mit Version und db "ok",
// sonst 503 mit dem Grund (DB nicht erreichbar, Seed-Zeile fehlt).

const VERSION = 'abc1234';
const seedRow = async () => [{ message: 'Hello codeslage' }];

describe('checkHealth', () => {
  it('DB ok: 200 mit Version', async () => {
    const result = await checkHealth(seedRow, VERSION);
    expect(result).toEqual({ httpStatus: 200, body: { status: 'ok', version: VERSION, db: 'ok' } });
  });

  it('DB weg: 503 „unreachable“', async () => {
    const down = async () => {
      throw Object.assign(new Error('connect ECONNREFUSED 127.0.0.1:5432'), { code: 'ECONNREFUSED' });
    };
    const result = await checkHealth(down, VERSION);
    expect(result).toEqual({ httpStatus: 503, body: { status: 'error', db: 'unreachable' } });
  });

  it('Seed fehlt (keine Zeile): 503 „seed missing“', async () => {
    const result = await checkHealth(async () => [], VERSION);
    expect(result).toEqual({ httpStatus: 503, body: { status: 'error', db: 'seed missing' } });
  });

  it('Seed fehlt (Tabelle fehlt): 503 „seed missing“', async () => {
    const noTable = async () => {
      throw Object.assign(new Error('relation "status_check" does not exist'), { code: '42P01' });
    };
    const result = await checkHealth(noTable, VERSION);
    expect(result).toEqual({ httpStatus: 503, body: { status: 'error', db: 'seed missing' } });
  });

  it('jede Antwort entspricht dem Schema', async () => {
    for (const query of [seedRow, async () => []]) {
      const { body } = await checkHealth(query, VERSION);
      expect(parseHealth(body)).toEqual(body);
    }
  });
});

describe('parseHealth (Schema, Artikel VII)', () => {
  it('nimmt gültige Antworten an', () => {
    expect(parseHealth({ status: 'ok', version: VERSION, db: 'ok' })).toEqual({
      status: 'ok',
      version: VERSION,
      db: 'ok',
    });
    expect(parseHealth({ status: 'error', db: 'unreachable' })).toEqual({ status: 'error', db: 'unreachable' });
  });

  it.each([
    ['kein Objekt', 'ok'],
    ['null', null],
    ['unbekannter Status', { status: 'fine', version: VERSION, db: 'ok' }],
    ['ok ohne Version', { status: 'ok', db: 'ok' }],
    ['ok mit leerer Version', { status: 'ok', version: '', db: 'ok' }],
    ['ok mit db-Fehler', { status: 'ok', version: VERSION, db: 'unreachable' }],
    ['error mit db ok', { status: 'error', db: 'ok' }],
    ['unbekannter Grund', { status: 'error', db: 'kaputt' }],
    ['zusätzliches Feld', { status: 'ok', version: VERSION, db: 'ok', secret: 'x' }],
  ])('lehnt ab: %s', (_name, value) => {
    expect(() => parseHealth(value)).toThrow();
  });
});
