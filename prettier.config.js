import base from '@codeslage/config/prettier';

// Gemeinsame Formatierung plus Astro-Dateien (Plan 06, T-01).
export default {
  ...base,
  plugins: ['prettier-plugin-astro'],
  overrides: [{ files: '*.astro', options: { parser: 'astro' } }],
};
