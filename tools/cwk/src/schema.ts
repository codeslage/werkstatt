// Schema-Prüfung für cwk/manifest.json und cwk.json (Plan 05, Datenmodell). Bewusst ohne Paket (Artikel XI):
// Ungültiges wird mit allen Gründen abgelehnt, nicht repariert (Artikel VII).

type Part = 'rules' | 'code';
type Mode = 'exact' | 'extendable';
type Docs = 'public' | 'internal' | 'none';
export type Visibility = 'public' | 'private';

export interface ManifestFile {
  source: string;
  target: string;
  part: Part;
  mode: Mode;
}

export interface Manifest {
  files: ManifestFile[];
}

export interface CwkConfig {
  cwk: string;
  code: boolean;
  docs: Docs;
}

const PARTS: readonly string[] = ['rules', 'code'];
const MODES: readonly string[] = ['exact', 'extendable'];
const DOCS: readonly string[] = ['public', 'internal', 'none'];
const FILE_KEYS = ['source', 'target', 'part', 'mode'];
const CONFIG_KEYS = ['cwk', 'code', 'docs'];
/** Für diese Endungen gibt es ein Format für den Projektblock (Markdown- bzw. YAML-Kommentar). */
const BLOCK_EXTENSIONS = /\.(md|ya?ml)$/;
const SHA = /^[0-9a-f]{40}$/;

class SchemaError extends Error {
  constructor(file: string, errors: string[]) {
    super(`${file} ungültig:\n- ${errors.join('\n- ')}`);
    this.name = 'SchemaError';
  }
}

function parseJson(text: string, file: string): unknown {
  try {
    return JSON.parse(text);
  } catch (error) {
    throw new SchemaError(file, [`kein gültiges JSON (${(error as Error).message})`]);
  }
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function unknownKeys(value: Record<string, unknown>, allowed: string[], where: string): string[] {
  return Object.keys(value)
    .filter((key) => !allowed.includes(key))
    .map((key) => `${where}: unbekanntes Feld „${key}“`);
}

/** Relativer Pfad innerhalb des Repos: nicht leer, nicht absolut, ohne `..`. */
function isRepoPath(value: unknown): value is string {
  return typeof value === 'string' && value !== '' && !value.startsWith('/') && !value.split(/[\\/]/).includes('..');
}

const oneOf = (value: unknown, allowed: readonly string[]) => typeof value === 'string' && allowed.includes(value);

function fileErrors(file: unknown, index: number): string[] {
  const where = `files[${index}]`;
  if (!isRecord(file)) return [`${where}: kein Objekt`];
  const checks: [boolean, string][] = [
    [isRepoPath(file.source), 'source: relativer Pfad im Repo erwartet'],
    [isRepoPath(file.target), 'target: relativer Pfad im Repo erwartet'],
    [oneOf(file.part, PARTS), 'part: rules oder code'],
    [oneOf(file.mode, MODES), 'mode: exact oder extendable'],
    [
      file.mode !== 'extendable' || BLOCK_EXTENSIONS.test(String(file.target)),
      'extendable nur für Markdown und YAML (Projektblock)',
    ],
  ];
  return [...unknownKeys(file, FILE_KEYS, where), ...failed(checks, where)];
}

const failed = (checks: [boolean, string][], where: string) =>
  checks.filter(([ok]) => !ok).map(([, message]) => `${where}.${message}`);

export function parseManifest(text: string): Manifest {
  const value = parseJson(text, 'cwk/manifest.json');
  if (!isRecord(value) || !Array.isArray(value.files) || value.files.length === 0) {
    throw new SchemaError('cwk/manifest.json', ['files: nicht leere Liste erwartet']);
  }
  const files: unknown[] = value.files;
  const errors = [...unknownKeys(value, ['files'], 'manifest'), ...files.flatMap(fileErrors)];
  const targets = files.map((file) => (isRecord(file) ? file.target : undefined));
  targets.forEach((target, index) => {
    if (typeof target === 'string' && targets.indexOf(target) !== index) errors.push(`Ziel doppelt: ${target}`);
  });
  if (errors.length > 0) throw new SchemaError('cwk/manifest.json', errors);
  return { files: files as ManifestFile[] };
}

function configErrors(value: Record<string, unknown>, visibility: Visibility): string[] {
  const checks: [boolean, string][] = [
    [typeof value.cwk === 'string' && SHA.test(value.cwk), 'cwk: Commit-SHA mit 40 Zeichen erwartet'],
    [value.code === undefined || typeof value.code === 'boolean', 'code: true oder false'],
    [value.docs === undefined || oneOf(value.docs, DOCS), 'docs: public, internal oder none'],
    [
      visibility !== 'public' || value.docs !== 'internal',
      'docs: ein öffentliches Repo kann nicht internal sein, seine Doku ist auf GitHub öffentlich',
    ],
  ];
  return [...unknownKeys(value, CONFIG_KEYS, 'cwk.json'), ...failed(checks, 'cwk.json')];
}

/** Liest cwk.json und setzt die Standardwerte (AK-14: docs nach Sichtbarkeit, code = true). */
export function parseConfig(text: string, visibility: Visibility): CwkConfig {
  const value = parseJson(text, 'cwk.json');
  if (!isRecord(value)) throw new SchemaError('cwk.json', ['Objekt erwartet']);
  const errors = configErrors(value, visibility);
  if (errors.length > 0) throw new SchemaError('cwk.json', errors);
  return {
    cwk: value.cwk as string,
    code: (value.code as boolean | undefined) ?? true,
    docs: (value.docs as Docs | undefined) ?? (visibility === 'public' ? 'public' : 'internal'),
  };
}
