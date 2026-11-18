import { defineConfig } from 'vitest/config';

// Drei Gruppen: „unit“ läuft überall ohne Netz, „infra“ prüft den echten Zustand
// von GitHub und Cloudflare und braucht Internet, „smoke“ prüft die laufende lokale Umgebung (Docker).
export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'unit',
          include: ['{apps,packages,tools}/**/*.test.ts'],
          exclude: ['**/node_modules/**', 'apps/*/smoke/**'],
        },
      },
      { test: { name: 'infra', include: ['infra/tests/**/*.test.ts'] } },
      { test: { name: 'smoke', include: ['apps/*/smoke/**/*.test.ts'] } },
    ],
  },
});
