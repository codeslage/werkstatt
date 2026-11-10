// Verstöße entstehen erst zur Laufzeit als Text: So enthält das Repo selbst
// keinen Code, den ESLint melden würde, und braucht keine Ausnahmen.

const repeat = (count: number, line: (i: number) => string): string =>
  Array.from({ length: count }, (_, i) => line(i)).join('\n');

const nested = (depth: number): string =>
  `${repeat(depth, (i) => `${'  '.repeat(i)}if (x > ${i}) {`)}\n${repeat(depth, (i) => `${'  '.repeat(depth - 1 - i)}}`)}`;

const branches = (count: number): string =>
  `export function f(x: number): number {\n${repeat(count, (i) => `  if (x === ${i}) return ${i};`)}\n  return -1;\n}\n`;

const functionWithStatements = (count: number): string =>
  `export function f(): number {\n  let n = 0;\n${repeat(count, () => '  n += 1;')}\n  return n;\n}\n`;

const fileWithLines = (count: number): string => `${repeat(count, (i) => `export const v${i} = ${i};`)}\n`;

const catchWith = (body: string): string =>
  `export function f(g: () => void): void {\n  try {\n    g();\n  } catch {\n${body}  }\n}\n`;

/** Je Regel aus AK-18 ein Stück Code, das genau diese Regel verletzt. */
export const eslintViolations: Record<string, string> = {
  complexity: branches(10), // Komplexität 11
  'max-depth': `export function f(x: number): void {\n${nested(4)}\n}\n`,
  'max-lines-per-function': functionWithStatements(47), // 51 Zeilen (Signatur, let, 47, return, Klammer)
  'max-lines': fileWithLines(301),
  'no-warning-comments': `// ${'TO' + 'DO'}: später erledigen\nexport const x = 1;\n`,
  'no-empty': catchWith(''),
  // Ein Kommentar macht den Block für no-empty nicht leer, der Fehler wäre trotzdem verschluckt.
  'no-restricted-syntax': catchWith('    // egal\n'),
};

/** Je Grenzwert ein Stück Code genau auf der Grenze: Es darf keinen Befund geben. */
export const eslintAtLimit: Record<string, string> = {
  complexity: branches(9), // Komplexität 10
  'max-depth': `export function f(x: number): void {\n${nested(3)}\n}\n`,
  'max-lines-per-function': functionWithStatements(46), // 50 Zeilen
  'max-lines': fileWithLines(300),
};
