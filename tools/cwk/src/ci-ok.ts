// Sammel-Job ci-ok (Plan 05): einziger Pflicht-Check im Ruleset. Läuft mit `if: always()` und wertet
// `needs.*.result` aus. Ohne diese Auswertung wäre ein übersprungener ci-ok für GitHub „erfüllt“.

/** Job-ID, unter der ci.yml den Code-Teil (cwk-code.yml) aufruft. */
const CODE_JOB = 'code';

function resultOf(job: unknown): string | undefined {
  const result = (job as { result?: unknown } | null)?.result;
  return typeof result === 'string' ? result : undefined;
}

/** Gibt die Gründe zurück, aus denen ci-ok rot ist; leer heißt grün. */
export function evaluateNeeds(needsJson: string, hasCode: boolean): string[] {
  let needs: unknown;
  try {
    needs = JSON.parse(needsJson);
  } catch (error) {
    return [`needs: kein gültiges JSON (${(error as Error).message})`];
  }
  if (typeof needs !== 'object' || needs === null || Array.isArray(needs)) return ['needs: Objekt erwartet'];
  const jobs = Object.entries(needs);
  if (jobs.length === 0) return ['keine Jobs in needs'];
  return jobs.flatMap(([name, job]) => {
    const result = resultOf(job);
    if (result === undefined) return [`${name}: kein Ergebnis`];
    if (result === 'success') return [];
    if (result === 'skipped' && name === CODE_JOB && !hasCode) return [];
    return [`${name}: ${result}`];
  });
}
