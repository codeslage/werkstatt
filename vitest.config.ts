import { defineConfig } from 'vitest/config';

// Zwei Gruppen: „unit“ läuft überall ohne Netz, „infra“ prüft den echten Zustand
// von GitHub (und später Cloudflare) und braucht Internet.
export default defineConfig({
  test: {
    projects: [
      { test: { name: 'unit', include: ['{packages,tools}/**/*.test.ts'], exclude: ['**/node_modules/**'] } },
      { test: { name: 'infra', include: ['infra/tests/**/*.test.ts'] } },
    ],
  },
});
