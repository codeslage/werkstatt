import base from '@codeslage/config/eslint';
import astro from 'eslint-plugin-astro';
import { defineConfig } from 'eslint/config';

// Gemeinsame Regeln plus Astro für apps/web (Plan 06, T-01). Astro gehört nicht in packages/config,
// weil nicht jedes Projekt Astro nutzt (Artikel XIII).
export default defineConfig({ ignores: ['**/.astro/**'] }, base, astro.configs.recommended);
