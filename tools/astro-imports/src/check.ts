import { dirname, join, normalize } from 'node:path';

// Regel „nur-nach-packages“ aus .dependency-cruiser.json für .astro-Dateien, die dependency-cruiser nicht liest:
// Eine App importiert nur aus sich selbst, aus packages/ und aus npm, nie aus einer anderen App, tools/ oder infra/.

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---/;
const IMPORT = /\bimport\s*(?:[^'"()]*?\bfrom\s*)?\(?\s*['"]([^'"]+)['"]/g;
const WORKSPACE_SCOPE = '@codeslage/';

/** Alle Import-Ziele im Frontmatter einer .astro-Datei. */
export function frontmatterImports(source: string): string[] {
  const frontmatter = FRONTMATTER.exec(source)?.[1] ?? '';
  return [...frontmatter.matchAll(IMPORT)].map((match) => match[1] ?? '');
}

function appOf(file: string): string {
  return normalize(file).split('/').slice(0, 2).join('/');
}

function isAllowed(file: string, target: string, packages: readonly string[]): boolean {
  if (target.startsWith(WORKSPACE_SCOPE))
    return packages.includes(target.slice(WORKSPACE_SCOPE.length).split('/')[0] ?? '');
  if (!target.startsWith('.') && !target.startsWith('/')) return true;
  if (target.startsWith('/')) return false;
  const resolved = normalize(join(dirname(file), target));
  return resolved.startsWith(`${appOf(file)}/`) || resolved.startsWith('packages/');
}

/** Meldungen für alle unerlaubten Imports; `file` ist relativ zur Repo-Wurzel, `packages` die Ordner in packages/. */
export function checkAstroFile(file: string, source: string, packages: readonly string[]): string[] {
  return frontmatterImports(source)
    .filter((target) => !isAllowed(file, target, packages))
    .map((target) => `${file}: Import „${target}“ verlässt ${appOf(file)} (nur-nach-packages)`);
}
