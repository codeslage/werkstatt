import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseArgs } from 'node:util';
import { blocklistRule, readBlocklist } from './blocklist.ts';

const REPO_ROOT = join(import.meta.dirname, '..', '..', '..');
const USAGE = 'Aufruf: cli.ts <dir|git|staged> [Pfad] [--report <Datei>] [--require-blocklist]';

/** Grundkonfiguration plus Sperrlisten-Regel, als Inhalt für GITLEAKS_CONFIG_TOML. */
function buildConfig(requireBlocklist: boolean): string {
  const base = readFileSync(join(REPO_ROOT, '.gitleaks.toml'), 'utf8');
  const terms = readBlocklist(process.env, join(REPO_ROOT, '.sperrliste'));
  if (terms.length > 0) return `${base}\n${blocklistRule(terms)}\n`;
  if (requireBlocklist) {
    console.error('public-scan: Sperrliste fehlt (PUBLIC_BLOCKLIST bzw. .sperrliste), Abbruch.');
    process.exit(2);
  }
  console.warn('public-scan: Warnung – keine Sperrliste gefunden, geprüft wird ohne sie.');
  return base;
}

function gitleaksArgs(mode: string, path: string): string[] {
  if (mode === 'dir') return ['dir', path];
  if (mode === 'git') return ['git', path, '--log-opts=--all'];
  if (mode === 'staged') return ['git', '--pre-commit', '--staged', path];
  console.error(USAGE);
  process.exit(2);
}

function main(): void {
  const { positionals, values } = parseArgs({
    allowPositionals: true,
    options: { report: { type: 'string' }, 'require-blocklist': { type: 'boolean', default: false } },
  });
  const [mode = '', path = REPO_ROOT] = positionals;
  const report = values.report ? ['--report-format', 'json', '--report-path', values.report] : [];
  const args = [...gitleaksArgs(mode, path), '--no-banner', '--redact', '--exit-code', '1', ...report];
  const result = spawnSync('gitleaks', args, {
    stdio: 'inherit',
    env: { ...process.env, GITLEAKS_CONFIG_TOML: buildConfig(values['require-blocklist']) },
  });
  if (result.error) {
    console.error(`public-scan: gitleaks konnte nicht gestartet werden: ${result.error.message}`);
    process.exit(2);
  }
  process.exit(result.status ?? 2);
}

main();
