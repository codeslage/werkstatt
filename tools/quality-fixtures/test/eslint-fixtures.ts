// Verstöße entstehen erst zur Laufzeit als Text: So enthält das Repo selbst
// keinen Code, den ESLint melden würde, und braucht keine Ausnahmen.

const repeat = (count: number, line: (i: number) => string): string =>
  Array.from({ length: count }, (_, i) => line(i)).join('\n');

const nested = (depth: number): string =>
  `${repeat(depth, (i) => `${'  '.repeat(i)}if (x > ${i}) {`)}\n${repeat(depth, (i) => `${'  '.repeat(depth - 1 - i)}}`)}`;

/** Je Regel aus AK-18 ein Stück Code, das genau diese Regel verletzt. */
export const eslintViolations: Record<string, string> = {
  complexity: `export function f(x: number): number {\n${repeat(11, (i) => `  if (x === ${i}) return ${i};`)}\n  return -1;\n}\n`,
  'max-depth': `export function f(x: number): void {\n${nested(4)}\n}\n`,
  'max-lines-per-function': `export function f(): number {\n  let n = 0;\n${repeat(50, () => '  n += 1;')}\n  return n;\n}\n`,
  'max-lines': `${repeat(301, (i) => `export const v${i} = ${i};`)}\n`,
  'no-warning-comments': `// ${'TO' + 'DO'}: später erledigen\nexport const x = 1;\n`,
  'no-empty': `export function f(g: () => void): void {\n  try {\n    g();\n  } catch {\n  }\n}\n`,
};
