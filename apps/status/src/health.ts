import type { DbProblem, Health } from './health-schema.ts';

/** Liest die Seed-Zeile; in der App über `postgres`, in Tests ersetzt. */
export type SeedQuery = () => Promise<unknown[]>;

export interface HealthResult {
  httpStatus: 200 | 503;
  body: Health;
}

// Postgres-Fehlercode „undefined_table“: Die Tabelle aus dem Seed fehlt.
const UNDEFINED_TABLE = '42P01';

function problemOf(error: unknown): DbProblem {
  const code = (error as { code?: unknown } | null)?.code;
  return code === UNDEFINED_TABLE ? 'seed missing' : 'unreachable';
}

/**
 * Ergebnis für /health. Die technische Ursache geht nur an `onError` (fürs Log), nie in die Antwort.
 */
export async function checkHealth(
  query: SeedQuery,
  version: string,
  onError: (cause: string) => void = () => undefined,
): Promise<HealthResult> {
  try {
    const rows = await query();
    if (rows.length === 0) return { httpStatus: 503, body: { status: 'error', db: 'seed missing' } };
    return { httpStatus: 200, body: { status: 'ok', version, db: 'ok' } };
  } catch (error) {
    onError(error instanceof Error ? error.message : String(error));
    return { httpStatus: 503, body: { status: 'error', db: problemOf(error) } };
  }
}
