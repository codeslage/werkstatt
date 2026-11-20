import { readFileSync } from 'node:fs';
import { defineConfig, devices } from '@playwright/test';

// E2E gegen die gebaute Seite (`astro preview`), nicht gegen den Dev-Server (Plan 06, Teststrategie).
// Die Impressumsangaben kommen aus den Platzhaltern in .env.example, damit der Test-Build keine .env braucht.
const placeholders = Object.fromEntries(
  readFileSync(new URL('./.env.example', import.meta.url), 'utf8')
    .split('\n')
    .filter((line) => /^[A-Z_]+=/.test(line))
    .map((line) => [line.slice(0, line.indexOf('=')), line.slice(line.indexOf('=') + 1)]),
);

const PORT = 4321;
// Zweiter Build mit Test-Token: prüft, dass der Beacon die einzige fremde Quelle ist (AK-4, T-05).
const BEACON_PORT = 4322;
export const BEACON_TEST_TOKEN = 'e2e-test-token';

// --ignore-lock: einmaliger Server im Vordergrund. Astro 7 schiebt `preview` sonst in Agent-Umgebungen
// automatisch in den Hintergrund, und Playwright hielte den Prozess für beendet.
const serve = (port: number) => `pnpm build && pnpm preview --host 127.0.0.1 --port ${port} --ignore-lock`;

export default defineConfig({
  testDir: 'e2e',
  forbidOnly: Boolean(process.env.CI),
  reporter: process.env.CI ? 'github' : 'list',
  webServer: [
    {
      command: serve(PORT),
      url: `http://127.0.0.1:${PORT}/`,
      env: placeholders,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
    {
      command: serve(BEACON_PORT),
      url: `http://127.0.0.1:${BEACON_PORT}/`,
      env: { ...placeholders, PUBLIC_CF_BEACON_TOKEN: BEACON_TEST_TOKEN, WEB_OUT_DIR: './dist-beacon' },
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  ],
  projects: [
    {
      name: 'chromium',
      testIgnore: 'beacon.spec.ts',
      use: { ...devices['Desktop Chrome'], baseURL: `http://127.0.0.1:${PORT}` },
    },
    {
      name: 'beacon',
      testMatch: 'beacon.spec.ts',
      use: { ...devices['Desktop Chrome'], baseURL: `http://127.0.0.1:${BEACON_PORT}` },
    },
  ],
});
