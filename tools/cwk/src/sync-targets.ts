// Soll-Menge für `cwk sync` (Plan 05, AK-7): öffentliche Projekt-Repos laut Lese-App, private laut gh-Login des
// Inhabers oder ein einzelnes Repo. werkstatt ist die Quelle des CWK und nie ein Ziel.

import { must, ORG, type Run } from './gh.ts';
import { isRecord, type Visibility } from './schema.ts';

export type SyncScope = { kind: 'public'; readToken: string } | { kind: 'private' } | { kind: 'repo'; name: string };

export interface SyncTarget {
  name: string;
  visibility: Visibility;
}

/** GitHub unterscheidet bei Repo-Namen nicht nach Groß- und Kleinschreibung, deshalb wird klein verglichen. */
const SOURCE_REPO = 'werkstatt';
const REPO_NAME = /^[A-Za-z0-9_][A-Za-z0-9._-]*$/;
const SHAPE_ERROR = 'Soll-Menge: unerwartete Antwort von GitHub';

const isName = (value: unknown): value is string => typeof value === 'string' && REPO_NAME.test(value);

/** Antworten nur in der erwarteten Form verwenden, sonst ablehnen (Artikel VII). */
function parseJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(SHAPE_ERROR);
  }
}

interface InstallationEntry {
  name: string;
  visibility: string;
  archived: boolean;
}

const isInstallationEntry = (value: unknown): value is InstallationEntry =>
  isRecord(value) && isName(value.name) && typeof value.visibility === 'string' && typeof value.archived === 'boolean';

/** Alle Repos der Lese-App, eine JSON-Zeile je Repo; nur die öffentlichen, nicht archivierten zählen. */
function publicTargets(run: Run, readToken: string): SyncTarget[] {
  const jq = '.repositories[] | {name, visibility, archived}';
  const output = must(run, 'gh', ['api', '/installation/repositories', '--paginate', '--jq', jq], {
    env: { GH_TOKEN: readToken },
  });
  const entries = output
    .split('\n')
    .filter((line) => line.trim() !== '')
    .map(parseJson);
  if (!entries.every(isInstallationEntry)) throw new Error(SHAPE_ERROR);
  return entries
    .filter((entry) => entry.visibility === 'public' && !entry.archived && entry.name.toLowerCase() !== SOURCE_REPO)
    .map((entry) => ({ name: entry.name, visibility: 'public' }));
}

function privateTargets(run: Run): SyncTarget[] {
  const args = ['repo', 'list', ORG, '--visibility', 'private', '--no-archived', '--limit', '1000', '--json', 'name'];
  const entries = parseJson(must(run, 'gh', args));
  if (!Array.isArray(entries) || !entries.every((entry) => isRecord(entry) && isName(entry.name))) {
    throw new Error(SHAPE_ERROR);
  }
  return entries.map((entry) => ({ name: (entry as { name: string }).name, visibility: 'private' }));
}

function singleTarget(run: Run, name: string): SyncTarget {
  if (name.toLowerCase() === SOURCE_REPO) throw new Error(`${SOURCE_REPO}: ist die CWK-Quelle, kein Ziel für den Sync`);
  if (!isName(name)) throw new Error(`Repo-Name „${name}“ ungültig`);
  const visibility = must(run, 'gh', ['api', `/repos/${ORG}/${name}`, '--jq', '.visibility']).trim();
  if (visibility !== 'public' && visibility !== 'private') throw new Error(SHAPE_ERROR);
  return { name, visibility };
}

export function listTargets(scope: SyncScope, run: Run): SyncTarget[] {
  if (scope.kind === 'public') return publicTargets(run, scope.readToken);
  if (scope.kind === 'private') return privateTargets(run);
  return [singleTarget(run, scope.name)];
}
