import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// AK-27: Ein fehlgeschlagener geplanter Lauf erreicht den Inhaber per Mail. Nachgewiesen wird das mit einem
// absichtlichen Fehlschlag, den jeder geplante Workflow per workflow_dispatch auslösen kann.

const WORKFLOWS = join(import.meta.dirname, '..', '..', '.github', 'workflows');
const SCHEDULED = ['drift.yml', 'history-scan.yml'];

describe.each(SCHEDULED)('%s: Schalter simulate_failure (AK-27)', (file) => {
  const workflow = readFileSync(join(WORKFLOWS, file), 'utf8');

  it('bietet den Schalter beim manuellen Start an, standardmäßig aus', () => {
    expect(workflow).toMatch(
      /^\s+workflow_dispatch:\s*\n\s+inputs:\s*\n\s+simulate_failure:\s*\n(\s+\w+: .+\n)*?\s+type: boolean\s*\n/m,
    );
    expect(workflow).toMatch(/^\s+simulate_failure:\s*\n(\s+\w+: .+\n)*?\s+default: false\s*$/m);
  });

  it('bricht als erster Schritt ab, wenn der Schalter gesetzt ist', () => {
    const firstStep = /^\s+steps:\s*\n\s+- (?:name: .+\n\s+)?if: (.+)\n\s+run: (.+)$/m.exec(workflow);
    expect(firstStep?.[1]).toBe('inputs.simulate_failure');
    expect(firstStep?.[2]).toMatch(/exit 1/);
  });
});
