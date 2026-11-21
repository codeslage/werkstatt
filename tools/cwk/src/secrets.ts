// `cwk secrets` (Plan 05): setzt PUBLIC_BLOCKLIST aus .sperrliste in allen Repos der Organisation und schreibt das
// Datum je Repo nach platform/blocklist-status.json. So braucht die App kein Recht auf Secrets.
// Läuft lokal mit dem gh-Login des Inhabers. Die Sperrliste geht nur über stdin an gh, nie in Ausgaben.

import { ghExists, ghGet, ghSend, must, ORG, type Run } from './gh.ts';

export interface SecretsDeps {
  run: Run;
  blocklist: string;
  today: string;
}

const PLATFORM = `${ORG}/platform`;
const STATUS_PATH = `/repos/${PLATFORM}/contents/blocklist-status.json`;
const PLATFORM_MISSING = 'platform fehlt noch: Datum der Sperrliste später eintragen (T-45)';

export function requireBlocklist(blocklist: string): void {
  if (blocklist.trim() === '') throw new Error('Sperrliste fehlt oder ist leer (.sperrliste), Abbruch');
}

export function setBlocklist(run: Run, repo: string, blocklist: string): void {
  must(run, 'gh', ['secret', 'set', 'PUBLIC_BLOCKLIST', '-R', repo], { input: blocklist });
}

function parseStatus(value: unknown): { sha?: string; dates: Record<string, string> } {
  if (value === undefined) return { dates: {} };
  const { sha, content } = (value ?? {}) as { sha?: unknown; content?: unknown };
  let dates: unknown;
  try {
    dates = JSON.parse(Buffer.from(String(content), 'base64').toString('utf8'));
  } catch {
    dates = undefined;
  }
  const valid =
    typeof sha === 'string' &&
    typeof dates === 'object' &&
    dates !== null &&
    !Array.isArray(dates) &&
    Object.values(dates).every((date) => typeof date === 'string');
  if (!valid) throw new Error('platform/blocklist-status.json ungültig: Objekt Repo → Datum erwartet');
  return { sha, dates: dates as Record<string, string> };
}

/** Trägt das heutige Datum für `repos` ein; fehlt platform noch, kommt ein Hinweis statt eines Abbruchs. */
export function recordBlocklistDates(run: Run, repos: string[], today: string): string[] {
  if (!ghExists(run, `/repos/${PLATFORM}`)) return [PLATFORM_MISSING];
  const { sha, dates } = parseStatus(ghGet(run, STATUS_PATH));
  for (const repo of repos) dates[repo] = today;
  const content = Buffer.from(`${JSON.stringify(dates, null, 2)}\n`).toString('base64');
  const message = `Sperrliste gesetzt am ${today}: ${repos.join(', ')}`;
  ghSend(run, 'PUT', STATUS_PATH, { message, content, ...(sha === undefined ? {} : { sha }) });
  return [];
}

export function syncSecrets(deps: SecretsDeps): string[] {
  requireBlocklist(deps.blocklist);
  const list = must(deps.run, 'gh', ['api', '--paginate', `/orgs/${ORG}/repos`, '--jq', '.[].full_name']);
  const repos = list.split('\n').filter((line) => line !== '');
  for (const repo of repos) setBlocklist(deps.run, repo, deps.blocklist);
  return recordBlocklistDates(deps.run, repos, deps.today);
}
