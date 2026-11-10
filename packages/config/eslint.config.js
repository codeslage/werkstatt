import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

// Grenzwerte nach Artikel XV. Änderungen nur per ADR (Plan 04-fundament, Risiken).
const MAX_COMPLEXITY = 10;
const MAX_DEPTH = 3;
const MAX_FUNCTION_LINES = 50;
const MAX_FILE_LINES = 300;

export default defineConfig(
  { ignores: ['**/node_modules/**', '**/dist/**', '**/coverage/**'] },
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    rules: {
      complexity: ['error', MAX_COMPLEXITY],
      'max-depth': ['error', MAX_DEPTH],
      'max-lines-per-function': ['error', { max: MAX_FUNCTION_LINES, skipBlankLines: true, skipComments: true }],
      'max-lines': ['error', { max: MAX_FILE_LINES, skipBlankLines: true, skipComments: true }],
      // Kein „später“ im Code: offene Punkte gehören in Tasks oder Issues.
      'no-warning-comments': ['error', { terms: ['todo', 'fixme', 'xxx'], location: 'anywhere' }],
      // Artikel XVI: kein Fehler wird still verschluckt – auch nicht hinter einem Kommentar.
      'no-empty': ['error', { allowEmptyCatch: false }],
      'no-restricted-syntax': [
        'error',
        {
          selector: 'CatchClause > BlockStatement[body.length=0]',
          message: 'Leerer catch-Block: Fehler behandeln oder mit Kontext weiterreichen (Artikel XVI).',
        },
      ],
    },
  },
);
