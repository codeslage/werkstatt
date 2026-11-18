export type DbProblem = 'unreachable' | 'seed missing';

export type Health = { status: 'ok'; version: string; db: 'ok' } | { status: 'error'; db: DbProblem };

const PROBLEMS: readonly string[] = ['unreachable', 'seed missing'] satisfies DbProblem[];

const hasExactKeys = (value: object, keys: string[]) =>
  Object.keys(value).length === keys.length && keys.every((key) => key in value);

function asOk(record: Record<string, unknown>): Health | undefined {
  const valid =
    hasExactKeys(record, ['status', 'version', 'db']) &&
    typeof record.version === 'string' &&
    record.version !== '' &&
    record.db === 'ok';
  return valid ? { status: 'ok', version: record.version as string, db: 'ok' } : undefined;
}

function asError(record: Record<string, unknown>): Health | undefined {
  const valid = hasExactKeys(record, ['status', 'db']) && typeof record.db === 'string' && PROBLEMS.includes(record.db);
  return valid ? { status: 'error', db: record.db as DbProblem } : undefined;
}

/**
 * Prüft eine /health-Antwort gegen das Schema aus dem Plan (Artikel VII).
 * Ungültiges wird abgelehnt, nicht repariert – auch zusätzliche Felder.
 */
export function parseHealth(value: unknown): Health {
  if (typeof value !== 'object' || value === null) throw new Error('/health: Antwort ist kein Objekt');
  const record = value as Record<string, unknown>;
  const parsed = record.status === 'ok' ? asOk(record) : record.status === 'error' ? asError(record) : undefined;
  if (!parsed) throw new Error(`/health: Antwort entspricht nicht dem Schema: ${JSON.stringify(value)}`);
  return parsed;
}
