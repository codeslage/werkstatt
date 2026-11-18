type Level = 'info' | 'warn' | 'error';

export type Logger = (level: Level, msg: string, fields?: Record<string, unknown>) => void;

/** Strukturierte Logs: eine JSON-Zeile je Eintrag (Artikel XVI). Aufrufer geben nie Secrets oder Personendaten mit. */
export function createLogger(write: (line: string) => void): Logger {
  return (level, msg, fields = {}) => write(JSON.stringify({ time: new Date().toISOString(), level, msg, ...fields }));
}
