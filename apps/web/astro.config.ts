import { defineConfig } from 'astro/config';

// Statische Seite ohne eigenes JavaScript (ADR 0014). Kein Inline-CSS, damit die CSP ohne 'unsafe-inline'
// auskommt (Plan 06, Datenmodell & Schnittstellen).
export default defineConfig({
  site: 'https://codeslage.de',
  output: 'static',
  // Nur der zweite E2E-Build (mit Test-Beacon-Token) nutzt ein eigenes Verzeichnis (playwright.config.ts).
  outDir: process.env.WEB_OUT_DIR ?? './dist',
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'never' },
});
