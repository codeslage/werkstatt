// Reine Funktionen des SDD-Dirigenten: tasks.md lesen, Kontextpakete bauen, Zeiten eintragen
// (docs/prozess/sdd-ablauf.md, Regel „Schlanke Steuerung in Stufe 6“).

export interface Task {
  id: string;
  pr: string;
  status: string;
  /** Alle Zellen der Zeile, Schlüssel = Spaltenüberschrift. */
  cells: Map<string, string>;
}

export interface TaskTable {
  header: string[];
  tasks: Task[];
}

function cellsOf(line: string): string[] {
  return line
    .split('|')
    .slice(1, -1)
    .map((cell) => cell.trim());
}

/** Wert der ersten Spalte, deren Überschrift mit einem der Namen beginnt (Groß-/Kleinschreibung egal). */
export function column(task: Task, ...names: string[]): string {
  for (const name of names) {
    for (const [key, value] of task.cells) {
      if (key.toLowerCase().startsWith(name.toLowerCase())) return value;
    }
  }
  return '';
}

/** Zeilennummer der Kopfzeile der ersten Tabelle unter „## Tasks“, sonst -1. */
function headerLine(lines: string[]): number {
  const start = lines.findIndex((line) => line.trim() === '## Tasks');
  return start === -1 ? -1 : lines.findIndex((line, i) => i > start && line.startsWith('|'));
}

function toTask(header: string[], values: string[]): Task {
  const cells = new Map(header.map((name, j) => [name, values[j] ?? '']));
  const task: Task = { id: values[0] ?? '', pr: '', status: '', cells };
  task.pr = column(task, 'PR');
  task.status = column(task, 'Status');
  return task;
}

/** Die erste Tabelle unter „## Tasks“ in tasks.md. */
export function parseTasks(text: string): TaskTable {
  const lines = text.split(/\r?\n/);
  const headerIndex = headerLine(lines);
  if (headerIndex === -1) return { header: [], tasks: [] };
  const header = cellsOf(lines[headerIndex] ?? '');
  const end = lines.findIndex((line, i) => i > headerIndex && !line.startsWith('|'));
  const rows = lines.slice(headerIndex + 2, end === -1 ? undefined : end).map(cellsOf);
  const tasks = rows.filter((values) => (values[0] ?? '').startsWith('T-')).map((values) => toTask(header, values));
  return { header, tasks };
}

/** Tasks einer PR-Gruppe in der Reihenfolge der Tabelle. */
export function tasksOfPr(table: TaskTable, pr: string): Task[] {
  return table.tasks.filter((task) => task.pr.toUpperCase() === pr.toUpperCase());
}

/** Abschnitt aus plan.md zu einer Überschrift (Teiltreffer), bis zur nächsten Überschrift gleicher oder höherer Ebene. */
export function planSection(plan: string, heading: string): string | undefined {
  const wanted = normalize(heading);
  if (wanted === '') return undefined;
  const lines = plan.split(/\r?\n/);
  const start = lines.findIndex((line) => {
    const match = /^#+\s+(.*)$/.exec(line);
    return match !== null && normalize(match[1] ?? '').includes(wanted);
  });
  if (start === -1) return undefined;
  const level = headingLevel(lines[start] ?? '');
  const end = lines.findIndex((line, i) => i > start && headingLevel(line) > 0 && headingLevel(line) <= level);
  return lines
    .slice(start, end === -1 ? undefined : end)
    .join('\n')
    .trim();
}

function normalize(text: string): string {
  return text.replaceAll('`', '').trim().toLowerCase();
}

/** Ebene einer Markdown-Überschrift (Anzahl #), 0 für andere Zeilen. */
function headingLevel(line: string): number {
  return /^(#+)\s/.exec(line)?.[1]?.length ?? 0;
}

/** Zeilen der AK-Tabelle in spec.md, die zu den AK-Kennungen im Feld passen. */
export function acceptanceRows(spec: string, akField: string): string[] {
  const ids = akField.match(/AK-\d+/g) ?? [];
  return spec.split(/\r?\n/).filter((line) => ids.some((id) => new RegExp(`^\\|\\s*${id}\\s*\\|`).test(line)));
}

/** Kontextpaket für die Sitzung einer Task. */
export function taskContext(table: TaskTable, task: Task, spec: string, plan: string, project: string): string {
  const header = `| ${table.header.join(' | ')} |\n|${' --- |'.repeat(table.header.length)}`;
  const row = `| ${table.header.map((name) => task.cells.get(name) ?? '').join(' | ')} |`;
  const heading = column(task, 'Plan');
  const section =
    planSection(plan, heading) ?? `(Abschnitt „${heading}“ nicht gefunden – bitte gezielt in plan.md nachlesen)`;
  return [
    `# Kontextpaket ${task.id} (${project})`,
    '',
    `## Task (specs/${project}/tasks.md)`,
    '',
    header,
    row,
    '',
    `## Betroffene Akzeptanzkriterien (specs/${project}/spec.md)`,
    '',
    ...acceptanceRows(spec, column(task, 'AK')),
    '',
    `## Plan-Abschnitt (specs/${project}/plan.md)`,
    '',
    section,
    '',
    '## Dateien',
    '',
    column(task, 'Dateien') || '(keine Angabe)',
    '',
    'Weitere Dateien (ADRs in docs/adr/, bestehender Code) bei Bedarf gezielt lesen.',
    '',
  ].join('\n');
}

/** Kontextpaket für den Abschluss einer PR-Gruppe. */
export function reviewContext(pr: string, branch: string, tasks: Task[], project: string): string {
  return [
    `# Kontextpaket ${pr} (${project})`,
    '',
    `Branch: \`${branch}\``,
    `Tasks: ${tasks.map((task) => task.id).join(', ')}`,
    '',
    'Review mit dem Agent `code-reviewer`, Befunde beheben, Status und Ist in tasks.md, PR erstellen.',
    '',
  ].join('\n');
}

export interface TimeRow {
  what: string;
  start: Date;
  end: Date;
  note: string;
}

function stamp(date: Date): string {
  const pad = (n: number): string => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function duration(start: Date, end: Date): string {
  const minutes = Math.max(0, Math.round((end.getTime() - start.getTime()) / 60_000));
  return `${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, '0')}`;
}

/** Zeile im Format der Vorlage specs/_vorlagen/zeiten.md. */
export function timeRow(row: TimeRow): string {
  return `| ${row.what} | Arbeit | ${stamp(row.start)} | ${stamp(row.end)} | ${duration(row.start, row.end)} | ${row.note} |`;
}

/** Fügt eine Zeile ans Ende der ersten Tabelle vor „## Summen“ ein (sonst ans Ende der Datei). */
export function insertTimeRow(zeiten: string, row: string): string {
  const lines = zeiten.split('\n');
  const sums = lines.findIndex((line) => line.trim().startsWith('## Summen'));
  const limit = sums === -1 ? lines.length : sums;
  let last = -1;
  for (let i = 0; i < limit; i++) if ((lines[i] ?? '').startsWith('|')) last = i;
  if (last === -1) return `${zeiten.trimEnd()}\n\n${row}\n`;
  lines.splice(last + 1, 0, row);
  return lines.join('\n');
}
