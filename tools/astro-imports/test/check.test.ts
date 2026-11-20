import { describe, expect, it } from 'vitest';
import { checkAstroFile, astroImports } from '../src/check.ts';

// dependency-cruiser liest keine .astro-Dateien (Review PR #56, Befund 1). Diese Prüfung setzt dieselbe Regel
// „nur-nach-packages“ für die Imports im Frontmatter durch (Artikel XV, Plan 06, T-01).

const PACKAGES = ['config'];
const page = (imports: string) => `---\n${imports}\n---\n\n<h1>Hallo</h1>\n`;

describe('astroImports', () => {
  it('findet statische, reine und dynamische Imports im Frontmatter', () => {
    const source = page(
      "import { PAGES } from '../site/pages.ts';\nimport '../styles/global.css';\nconst m = await import(\"astro:content\");",
    );
    expect(astroImports(source)).toEqual(['../site/pages.ts', '../styles/global.css', 'astro:content']);
  });

  it('ignoriert Text außerhalb des Frontmatters', () => {
    expect(astroImports("<p>import x from 'y'</p>")).toEqual([]);
  });

  it('findet Imports in <script>-Blöcken, die Astro mitbündelt (Review PR #56, 2. Durchgang)', () => {
    const source =
      "---\nconst a = 1;\n---\n\n<p>{a}</p>\n<script>\n  import x from '../../../status/src/config.ts';\n</script>\n";
    expect(astroImports(source)).toEqual(['../../../status/src/config.ts']);
  });

  it('findet import.meta.glob und dynamische Imports mit Template-String', () => {
    const source = page("const a = import.meta.glob('../a/*.ts');\nconst b = await import(`../b/c.ts`);");
    expect(astroImports(source)).toEqual(['../a/*.ts', '../b/c.ts']);
  });

  it('erkennt das Frontmatter auch nach einer Leerzeile', () => {
    expect(astroImports("\n---\nimport x from '../x.ts';\n---\n")).toEqual(['../x.ts']);
  });
});

describe('checkAstroFile', () => {
  const file = 'apps/web/src/pages/index.astro';

  it('erlaubt Imports innerhalb der eigenen App, aus packages/ und aus npm', () => {
    const source = page(
      "import a from '../site/pages.ts';\nimport b from '@codeslage/config';\nimport c from 'astro:assets';\nimport d from 'astro';",
    );
    expect(checkAstroFile(file, source, PACKAGES)).toEqual([]);
  });

  it('meldet einen relativen Import in eine andere App', () => {
    const errors = checkAstroFile(file, page("import x from '../../../status/src/config.ts';"), PACKAGES);
    expect(errors).toEqual([`${file}: Import „../../../status/src/config.ts“ verlässt apps/web (nur-nach-packages)`]);
  });

  it('meldet einen Import über den Paketnamen einer App', () => {
    expect(checkAstroFile(file, page("import x from '@codeslage/status';"), PACKAGES)).toHaveLength(1);
  });

  it('meldet einen Import nach tools/ oder infra/', () => {
    expect(
      checkAstroFile(file, page("import x from '../../../../tools/spec-check/src/check.ts';"), PACKAGES),
    ).toHaveLength(1);
  });

  it('erlaubt einen relativen Import nach packages/', () => {
    expect(checkAstroFile(file, page("import x from '../../../../packages/config/x.ts';"), PACKAGES)).toEqual([]);
  });
});
