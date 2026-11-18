# Protokoll T-41: Fehler-Mail bei geplanten Läufen

> Datum: 2026-11-18 · Task: T-41 · AK: AK-27 · PR: PR-17b

1. `infra/tests/simulate-failure.test.ts` zuerst geschrieben (rot, 4 Fehlschläge), dann in `drift.yml` und `history-scan.yml` der Eingang `simulate_failure` (boolean, Standard `false`) beim manuellen Start und als erster Schritt ein Abbruch mit `exit 1`, wenn er gesetzt ist. Bei geplanten Läufen und PRs ist der Eingang leer, der Schritt wird übersprungen. Test 4/4 grün; die Tests der geplanten Workflows laufen im CI-Job Infra.
2. Absichtliche Fehlschläge auf dem Branch, ausgelöst vom GitHub-Konto des Inhabers: Historien-Scan (Run 44297749385) und Drift-Check (Run 44297796195), beide rot im Schritt „Absichtlicher Fehlschlag (AK-27)“, alle übrigen Schritte übersprungen.
3. **Beide Fehler-Mails sind beim Inhaber angekommen**, je eine Minute nach dem Lauf, Betreff „[codeslage/werkstatt] Run failed: Drift-Check …“ bzw. „… Run failed: Historien-Scan …“ (Screenshot gesichtet, nicht abgelegt, da er die Adresse zeigt). AK-27 erfüllt.
4. Zur Zuordnung: GitHub benachrichtigt bei manuellen Läufen den Auslösenden, bei geplanten Läufen den, der den Cron zuletzt geändert hat. Beides ist dasselbe Konto des Inhabers (die Commits mit den Cron-Zeilen laufen unter diesem Konto). Ändert künftig ein anderes Konto eine Cron-Zeile, gehen die Mails dorthin (Risiko in `plan.md`).
