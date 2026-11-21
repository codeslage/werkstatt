// `cwk check` (Plan 05, AK-9): vergleicht die CWK-Dateien eines Repos mit dem gepinnten Stand aus werkstatt.
// Reine Logik ohne Dateisystem und Git, damit sie mit Beispielen testbar ist; cli.ts liefert die Zugriffe.

import type { CwkConfig, Manifest, ManifestFile } from './schema.ts';

interface WorkflowFile {
  path: string;
  text: string;
}

export interface CheckInput {
  manifest: Manifest;
  config: CwkConfig;
  /** Datei aus werkstatt im Stand `config.cwk`; undefined, wenn sie fehlt. */
  readSource: (path: string) => string | undefined;
  /** Datei im geprüften Repo; undefined, wenn sie fehlt. */
  readTarget: (path: string) => string | undefined;
  workflows: WorkflowFile[];
  /** `cwk` aus cwk.json auf dem Basis-Branch, falls es dort eine gibt. */
  baseCwk?: string;
  isAncestor: (older: string, newer: string) => boolean;
}

const PLACEHOLDER = '@CWK_REF';
/** Start- und Endzeile eines Projektblocks, in Markdown als HTML-Kommentar, in YAML als `#`-Kommentar. */
const BLOCK_START = /^\s*(<!-- cwk:project:start -->|# cwk:project:start)\s*$/;
const BLOCK_END = /^\s*(<!-- cwk:project:end -->|# cwk:project:end)\s*$/;
// GitHub löst Owner und Repo ohne Rücksicht auf Groß-/Kleinschreibung auf, deshalb `i`.
const WERKSTATT_USES = /uses:\s*['"]?codeslage\/werkstatt\/[^@\s'"]+@([^\s'"]+)/gi;

/** Ersetzt den Inhalt des Projektblocks durch nichts; die Markierungen bleiben Teil des Vergleichs. */
function withoutProjectBlock(text: string): string | undefined {
  const lines = text.split('\n');
  const starts = lines.flatMap((line, index) => (BLOCK_START.test(line) ? [index] : []));
  const ends = lines.flatMap((line, index) => (BLOCK_END.test(line) ? [index] : []));
  if (starts.length === 0 && ends.length === 0) return text;
  const [start, end] = [starts[0] ?? -1, ends[0] ?? -1];
  if (starts.length !== 1 || ends.length !== 1 || start > end) return undefined;
  return [...lines.slice(0, start + 1), ...lines.slice(end)].join('\n');
}

function fileErrors(file: ManifestFile, input: CheckInput): string[] {
  const source = input.readSource(file.source);
  if (source === undefined) return [`${file.target}: Quelle ${file.source} fehlt im CWK-Stand`];
  const target = input.readTarget(file.target);
  if (target === undefined) return [`${file.target}: fehlt`];
  const expected = source.replaceAll(PLACEHOLDER, `@${input.config.cwk}`);
  if (file.mode === 'exact') {
    return target === expected ? [] : [`${file.target}: weicht vom CWK-Stand ab (Modus exact)`];
  }
  const actual = withoutProjectBlock(target);
  if (actual === undefined) return [`${file.target}: Projektblock höchstens einmal, Start vor Ende`];
  return actual === withoutProjectBlock(expected)
    ? []
    : [`${file.target}: weicht außerhalb des Projektblocks vom CWK-Stand ab`];
}

function pinErrors(workflows: WorkflowFile[], cwk: string): string[] {
  return workflows.flatMap(({ path, text }) =>
    [...text.matchAll(WERKSTATT_USES)]
      .filter((match) => match[1] !== cwk)
      .map((match) => `${path}: Verweis auf codeslage/werkstatt mit @${match[1] ?? ''} statt @${cwk}`),
  );
}

/** Schutz vor Rückstufung: Ein PR darf den CWK-Stand nur auf einen Nachfolger des bisherigen setzen. */
function downgradeErrors(input: CheckInput): string[] {
  const { baseCwk } = input;
  const { cwk } = input.config;
  if (baseCwk === undefined || baseCwk === cwk || input.isAncestor(baseCwk, cwk)) return [];
  return [`cwk.json: Stand ${cwk} ist kein Nachfolger von ${baseCwk} auf dem Basis-Branch (Rückstufung)`];
}

export function checkProject(input: CheckInput): string[] {
  const files = input.manifest.files.filter((file) => file.part === 'rules' || input.config.code);
  return [
    ...files.flatMap((file) => fileErrors(file, input)),
    ...pinErrors(input.workflows, input.config.cwk),
    ...downgradeErrors(input),
  ];
}
