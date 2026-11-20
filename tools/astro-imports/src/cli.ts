import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { checkAstroFile } from './check.ts';

const REPO_ROOT = join(import.meta.dirname, '..', '..', '..');
// Abhängigkeiten, Build-Ausgabe und der von Astro erzeugte Ordner `.astro/` (der selbst auf „.astro“ endet).
const SKIPPED = new Set(['node_modules', 'dist', '.astro']);

function astroFiles(): string[] {
  return readdirSync(join(REPO_ROOT, 'apps'), { recursive: true, encoding: 'utf8' })
    .filter((path) => path.endsWith('.astro') && !path.split('/').some((segment) => SKIPPED.has(segment)))
    .map((path) => join('apps', path));
}

const packages = readdirSync(join(REPO_ROOT, 'packages'));
const files = astroFiles();
const errors = files.flatMap((file) => checkAstroFile(file, readFileSync(join(REPO_ROOT, file), 'utf8'), packages));
for (const error of errors) console.error(error);
console.info(`astro-imports: ${files.length} .astro-Dateien geprüft, ${errors.length} Verstöße`);
if (errors.length > 0) process.exit(1);
