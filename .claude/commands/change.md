---
description: 'Kleine Änderung (Klasse K) mit Change-Seite durchführen'
argument-hint: '<kurzname> <Beschreibung>'
---

Kleine Änderung gemäß `docs/prozess/aenderungsklassen.md` (Klasse K).

Änderung: $ARGUMENTS

1. Prüfe die Einstufung: Ist es wirklich K? Bei neuen AKs oder neuem Nutzerverhalten → stattdessen `/sdd-specify`. Bei reinem Text/Update ohne Risiko → M (nur PR mit Was/Warum).
2. Lege `changes/JJJJ-MM-TT-<kurzname>.md` aus `specs/_vorlagen/change.md` an und fülle Ziel, Änderung, Risiko & Rückweg, Nachweis. Bei Infra: `tofu plan` ausführen und den relevanten Auszug einfügen.
3. Bitte den Inhaber um Freigabe der Change-Seite und warte darauf.
4. Branch `feature/<kurzname>`, zuerst den Test (bei Bugfix: Test, der den Fehler zeigt), dann die Änderung.
5. PR erstellen, Agent `code-reviewer` starten (nur Branch und Change-Datei nennen), Ergebnis unverändert in die Change-Seite übernehmen, 🔴-Befunde beheben.
6. Merge erfolgt automatisch nach `release.md`, wenn CI grün und kein 🔴 offen ist.
