import postgres from 'postgres';
import { readConfig } from './config.ts';
import { createLogger } from './log.ts';
import { createStatusServer } from './server.ts';

const write = (line: string) => process.stdout.write(`${line}\n`);
const log = createLogger(write);

let config;
try {
  config = readConfig(process.env);
} catch (error) {
  // Artikel XVI: klare Meldung und Abbruch statt eines halb laufenden Dienstes.
  log('error', 'Konfiguration unvollständig, Abbruch', {
    cause: error instanceof Error ? error.message : String(error),
  });
  process.exit(1);
}

// Kurze Zeitlimits: /health soll eine fehlende DB schnell melden, nicht hängen.
const sql = postgres(config.databaseUrl, { max: 2, connect_timeout: 3, idle_timeout: 30 });
const query = () => sql`select message from status_check where id = 1`;

const server = createStatusServer({ version: config.version, query, log: write });
server.listen(config.port, () => log('info', 'gestartet', { port: config.port, version: config.version }));

for (const signal of ['SIGTERM', 'SIGINT'] as const) {
  process.on(signal, () => {
    log('info', 'beende', { signal });
    server.close();
    sql.end({ timeout: 5 }).then(
      () => process.exit(0),
      (error: unknown) => {
        log('error', 'DB-Verbindung ließ sich nicht sauber schließen', { cause: String(error) });
        process.exit(1);
      },
    );
  });
}
