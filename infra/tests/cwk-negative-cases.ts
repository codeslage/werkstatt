import { randomBytes } from 'node:crypto';

// Fälle für cwk-negative.test.ts (Plan 05, T-14, AK-3): je PR-Prüfung des CWK ein Verstoß, abgeleitet vom Stand auf
// main von cwk-sample.

/** Älterer werkstatt-Stand mit derselben cwk-code.yml wie der Pin von cwk-sample, damit nur der Pin falsch ist. */
const OTHER_CWK_COMMIT = 'b7c27bc75b5ead5419e5fec9e3c44778fc859646';

type Edit = (files: Map<string, string>) => void;

export interface ProbeCase {
  id: string;
  /** Job, der rot werden muss; ci-ok kommt immer dazu. */
  job: string;
  /** Datei → neuer Inhalt, abgeleitet vom Stand auf main. */
  edit: Edit;
  /** Dateien von main, die edit braucht. */
  reads: string[];
  /**
   * Erst nach allen anderen Fällen öffnen: Der Scan holt alle Branches (fetch-depth 0), ein Secret auf einem Probe-
   * Branch macht sonst auch die Scans der anderen Probe-PRs rot.
   */
  last?: true;
}

function replaceOnce(text: string, search: string, replacement: string): string {
  if (!text.includes(search)) throw new Error(`Probe: „${search}“ nicht gefunden`);
  return text.replace(search, replacement);
}

function change(path: string, search: string, replacement: string): Edit {
  return (files) => files.set(path, replaceOnce(files.get(path) ?? '', search, replacement));
}

function add(path: string, content: string): Edit {
  return (files) => files.set(path, content);
}

// Secret und Tippfehler entstehen erst zur Laufzeit: So enthält werkstatt selbst nichts, was der Scan oder die
// Rechtschreibprüfung hier melden würde (wie tools/public-scan/test/fixtures.ts).
function randomText(alphabet: string, length: number): string {
  return Array.from(randomBytes(length), (byte) => alphabet[byte % alphabet.length]).join('');
}

const BASE62 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const fakeSecret = (): string => randomText(BASE62, 48);
const unknownWord = (): string => randomText(BASE62.slice(36), 12);

export const CASES: ProbeCase[] = [
  {
    id: 'format',
    job: 'Regeln / Format',
    reads: ['src/health.ts'],
    edit: change('src/health.ts', 'response.end(JSON.stringify(', 'response.end(  JSON.stringify('),
  },
  {
    id: 'spellcheck',
    job: 'Regeln / Rechtschreibung',
    reads: [],
    edit: (files) => files.set('docs/probe-rechtschreibung.md', `# Probe\n\nUnbekanntes Wort: ${unknownWord()}\n`),
  },
  {
    id: 'lint',
    job: 'Code / Lint',
    reads: ['src/health.ts'],
    edit: change('src/health.ts', "request.url === '/health';\n", "request.url === '/health';\n  if (!ok) debugger;\n"),
  },
  {
    id: 'typecheck',
    job: 'Code / Typecheck',
    reads: ['src/health.ts'],
    edit: change('src/health.ts', 'const ok = ', 'const ok: string = '),
  },
  {
    id: 'test',
    job: 'Code / Tests',
    reads: ['src/health.test.ts'],
    edit: change('src/health.test.ts', 'expect(response.status).toBe(200);', 'expect(response.status).toBe(201);'),
  },
  {
    id: 'knip',
    job: 'Code / Knip',
    reads: ['src/health.ts'],
    edit: (files) => files.set('src/health.ts', `${files.get('src/health.ts') ?? ''}\nexport const probeUnused = 1;\n`),
  },
  {
    id: 'depcruise',
    job: 'Code / Modulgrenzen',
    reads: ['src/health.ts'],
    // Zyklischer Import health.ts ↔ probe-cycle.ts; beide Exporte werden genutzt, damit Knip grün bleibt.
    edit: (files) => {
      add(
        'src/probe-cycle.ts',
        "import { handle } from './health.ts';\n\nexport const probeCycle = typeof handle;\n",
      )(files);
      change(
        'src/health.ts',
        "from 'node:http';\n",
        "from 'node:http';\nimport { probeCycle } from './probe-cycle.ts';\n",
      )(files);
      change(
        'src/health.ts',
        "{ 'content-type': 'application/json' }",
        "{ 'content-type': 'application/json', 'x-probe': probeCycle }",
      )(files);
    },
  },
  {
    id: 'container',
    job: 'Code / Container-Build',
    reads: ['Dockerfile'],
    edit: (files) => files.set('Dockerfile', `${files.get('Dockerfile') ?? ''}RUN exit 1\n`),
  },
  {
    id: 'iac',
    job: 'Code / IaC (OpenTofu)',
    reads: [],
    // Ohne Einrückung: tofu fmt -check schlägt an.
    edit: add('infra/tofu/probe/main.tf', 'terraform {\nrequired_version = ">= 1.6"\n}\n'),
  },
  {
    id: 'repo-settings',
    job: 'Regeln / Repo-Einstellungen',
    reads: ['CODEOWNERS'],
    // Eine zweite CODEOWNERS-Datei könnte die aus dem CWK aushebeln; cwk settings lässt nur die im Wurzelverzeichnis zu.
    edit: (files) => files.set('.github/CODEOWNERS', files.get('CODEOWNERS') ?? ''),
  },
  {
    id: 'spec-check',
    job: 'Regeln / Spec-Check',
    reads: [],
    edit: add('specs/99-probe/spec.md', '# Probe\n\nDiese Spec hat absichtlich keine Pflichtteile.\n'),
  },
  {
    id: 'constitution',
    job: 'Regeln / CWK-Abgleich',
    reads: ['CONSTITUTION.md'],
    edit: change(
      'CONSTITUTION.md',
      'Die Artikel sind kurz und überprüfbar.',
      'Die Artikel sind kurz und gut überprüfbar.',
    ),
  },
  {
    id: 'pin',
    job: 'Regeln / CWK-Abgleich',
    reads: ['.github/workflows/ci.yml', 'cwk.json'],
    edit: (files) => {
      const pin = (JSON.parse(files.get('cwk.json') ?? '{}') as { cwk?: unknown }).cwk;
      if (typeof pin !== 'string' || pin === OTHER_CWK_COMMIT) throw new Error('Probe: Pin in cwk.json unerwartet');
      change('.github/workflows/ci.yml', `cwk-code.yml@${pin}`, `cwk-code.yml@${OTHER_CWK_COMMIT}`)(files);
    },
  },
  {
    id: 'secret',
    job: 'Regeln / Secret- und Öffentlich-Scan',
    reads: [],
    last: true,
    // In docs/protokolle/, weil die Rechtschreibprüfung dort nicht prüft; so bleibt nur der Scan rot.
    edit: (files) =>
      files.set(
        'docs/protokolle/probe-secret.md',
        `# Probe\n\nFalsches Test-Secret aus T-14, kein echtes:\n\n\`\`\`text\nprobe_api_key = "${fakeSecret()}"\n\`\`\`\n`,
      ),
  },
];
