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

export default defineConfig({
  testDir: 'e2e',
  forbidOnly: Boolean(process.env.CI),
  reporter: process.env.CI ? 'github' : 'list',
  use: { baseURL: `http://127.0.0.1:${PORT}` },
  webServer: {
    // --ignore-lock: einmaliger Server im Vordergrund. Astro 7 schiebt `preview` sonst in Agent-Umgebungen
    // automatisch in den Hintergrund, und Playwright hielte den Prozess für beendet.
    command: `pnpm build && pnpm preview --host 127.0.0.1 --port ${PORT} --ignore-lock`,
    url: `http://127.0.0.1:${PORT}/`,
    env: placeholders,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
