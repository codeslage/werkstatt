export interface Config {
  databaseUrl: string;
  version: string;
  port: number;
}

const REQUIRED = ['DATABASE_URL', 'APP_VERSION', 'PORT'] as const;
const MAX_PORT = 65_535;

/** Liest die Konfiguration aus den Umgebungsvariablen. Werte erscheinen nie in Fehlermeldungen (XVI, keine Secrets). */
export function readConfig(env: Record<string, string | undefined>): Config {
  const missing = REQUIRED.filter((name) => !env[name]);
  if (missing.length > 0) throw new Error(`Fehlende Umgebungsvariablen: ${missing.join(', ')}`);

  const port = Number(env.PORT);
  if (!Number.isInteger(port) || port < 1 || port > MAX_PORT) {
    throw new Error(`PORT muss eine ganze Zahl zwischen 1 und ${MAX_PORT} sein`);
  }
  return { databaseUrl: env.DATABASE_URL ?? '', version: env.APP_VERSION ?? '', port };
}
