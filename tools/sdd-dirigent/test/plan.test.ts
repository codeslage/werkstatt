import { describe, expect, it } from 'vitest';
import {
  acceptanceRows,
  column,
  insertTimeRow,
  parseTasks,
  planSection,
  reviewContext,
  taskContext,
  tasksOfPr,
  timeRow,
} from '../src/plan.ts';

const TASKS = `# 07-beispiel – Tasks

## Tasks

| ID   | Task       | AK         | Test   | Abhängig von | PR    | Plan-Abschnitt     | Dateien            | Soll | Ist | Status |
| ---- | ---------- | ---------- | ------ | ------------ | ----- | ------------------ | ------------------ | ---- | --- | ------ |
| T-01 | Modul a    | AK-1       | test_a | –            | PR-01 | Schritt 1: Modul a | src/a.ts           | 0.5  |     | ✅     |
| T-02 | Modul b    | AK-2, AK-3 | test_b | T-01         | PR-02 | Schritt 2          | src/b.ts b.test.ts | 0.5  |     | ⬜     |
| T-03 | Modul c    | AK-3       | test_c | T-02         | PR-02 | \`Schritt 3\`        | src/c.ts           | 1    |     | ⬜     |

## Analyse (Stufe 5)

| Prüfung | Ergebnis |
| ------- | -------- |
| T-99 keine Task | – |
`;

const PLAN = `# Plan

## Schritt 1: Modul a

Baue a.

### Detail zu a

Feinheiten.

## Schritt 2: Modul b

Baue b.

## Schritt 3: Modul c

Baue c.
`;

const SPEC = `# Spec

| AK   | Kriterium | Test |
| ---- | --------- | ---- |
| AK-1 | a liefert 1 | auto |
| AK-2 | b liefert 2 | auto |
| AK-3 | c liefert 3 | auto |
| AK-10 | nicht gemeint | auto |
`;

describe('parseTasks', () => {
  it('liest nur die Tabelle unter „## Tasks“', () => {
    const table = parseTasks(TASKS);
    expect(table.tasks.map((task) => task.id)).toEqual(['T-01', 'T-02', 'T-03']);
    expect(table.header).toContain('Plan-Abschnitt');
  });

  it('liefert PR, Status und Spalten per Namensanfang', () => {
    const [first] = parseTasks(TASKS).tasks;
    expect(first?.pr).toBe('PR-01');
    expect(first?.status).toBe('✅');
    expect(first === undefined ? '' : column(first, 'Plan')).toBe('Schritt 1: Modul a');
  });

  it('gibt eine leere Tabelle ohne Abschnitt „## Tasks“ zurück', () => {
    expect(parseTasks('# leer').tasks).toEqual([]);
  });
});

describe('tasksOfPr', () => {
  it('filtert eine PR-Gruppe, unabhängig von Groß-/Kleinschreibung', () => {
    expect(tasksOfPr(parseTasks(TASKS), 'pr-02').map((task) => task.id)).toEqual(['T-02', 'T-03']);
  });
});

describe('planSection', () => {
  it('liefert den Abschnitt samt Unterabschnitten bis zur nächsten gleichrangigen Überschrift', () => {
    const section = planSection(PLAN, 'Schritt 1: Modul a');
    expect(section).toContain('Detail zu a');
    expect(section).not.toContain('Schritt 2');
  });

  it('findet Teiltreffer und ignoriert Backticks', () => {
    expect(planSection(PLAN, '`Schritt 3`')).toContain('Baue c.');
  });

  it('liefert undefined, wenn nichts passt', () => {
    expect(planSection(PLAN, 'gibt es nicht')).toBeUndefined();
    expect(planSection(PLAN, '')).toBeUndefined();
  });
});

describe('acceptanceRows', () => {
  it('liefert genau die genannten AKs (AK-1 nicht als Präfix von AK-10)', () => {
    const rows = acceptanceRows(SPEC, 'AK-1');
    expect(rows).toHaveLength(1);
    expect(rows[0]).toContain('a liefert 1');
  });

  it('versteht mehrere Kennungen in einem Feld', () => {
    expect(acceptanceRows(SPEC, 'AK-2, AK-3')).toHaveLength(2);
  });
});

describe('Kontextpakete', () => {
  it('enthält Task-Zeile, AKs, Plan-Abschnitt und Dateien', () => {
    const table = parseTasks(TASKS);
    const task = tasksOfPr(table, 'PR-02')[0];
    if (task === undefined) throw new Error('Task fehlt');
    const text = taskContext(table, task, SPEC, PLAN, '07-beispiel');
    expect(text).toContain('| T-02 |');
    expect(text).toContain('b liefert 2');
    expect(text).toContain('c liefert 3');
    expect(text).toContain('Baue b.');
    expect(text).toContain('src/b.ts b.test.ts');
  });

  it('meldet einen fehlenden Plan-Abschnitt statt ihn zu erfinden', () => {
    const table = parseTasks(TASKS.replace('Schritt 2 ', 'Schritt 9 '));
    const task = tasksOfPr(table, 'PR-02')[0];
    if (task === undefined) throw new Error('Task fehlt');
    expect(taskContext(table, task, SPEC, PLAN, '07-beispiel')).toContain('nicht gefunden');
  });

  it('nennt im Review-Paket Branch und Tasks', () => {
    const tasks = tasksOfPr(parseTasks(TASKS), 'PR-02');
    const text = reviewContext('PR-02', 'feature/07-beispiel-pr-02', tasks, '07-beispiel');
    expect(text).toContain('feature/07-beispiel-pr-02');
    expect(text).toContain('T-02, T-03');
  });
});

describe('Zeiten', () => {
  const row = timeRow({
    what: 'T-02',
    start: new Date(2026, 10, 22, 9, 5),
    end: new Date(2026, 10, 22, 10, 17),
    note: 'Sitzung PR-02 T-02 (sdd-dirigent)',
  });

  it('formatiert eine Zeile wie die Vorlage', () => {
    expect(row).toBe(
      '| T-02 | Arbeit | 2026-11-22 09:05 | 2026-11-22 10:17 | 1:12 | Sitzung PR-02 T-02 (sdd-dirigent) |',
    );
  });

  it('fügt die Zeile ans Ende der Zeitentabelle vor „## Summen“ ein', () => {
    const zeiten = '| Was | Art |\n| --- | --- |\n| Spec | Arbeit |\n\n## Summen\n\n| Was | Gesamt |\n| --- | --- |\n';
    const result = insertTimeRow(zeiten, row).split('\n');
    expect(result.indexOf(row)).toBe(3);
    expect(result.indexOf('## Summen')).toBeGreaterThan(3);
  });

  it('hängt die Zeile an, wenn es noch keine Tabelle gibt', () => {
    expect(insertTimeRow('# Zeiten\n', row)).toBe(`# Zeiten\n\n${row}\n`);
  });
});
