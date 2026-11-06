---
description: "SDD Stufe 6 – nächste Task(s) testgetrieben umsetzen"
argument-hint: "<NN-name> [T-xx]"
---
SDD-Stufe 6 **Implement** gemäß `docs/prozess/sdd-ablauf.md` (verbindlich über `CONSTITUTION.md`).

Vorhaben/Task: $ARGUMENTS

1. Prüfe, dass die Analyse in `tasks.md` keine offenen Lücken hat. Wenn doch: abbrechen.
2. Nimm die genannte Task bzw. die nächste offene Task, deren Abhängigkeiten erledigt sind.
3. Arbeite auf einem eigenen Branch. Schreibe zuerst den Test, der fehlschlägt, dann den minimalen Code, bis er grün ist.
4. Halte Artikel XV ein: kein toter Code, klare Modulgrenzen, Überflüssiges im selben PR entfernen.
5. Lint, Typecheck und alle Tests laufen lokal grün.
6. Aktualisiere den Task-Status, erstelle einen PR mit ausgefüllter Constitution-Checkliste. Keine zerstörerischen Aktionen ohne Freigabe (Artikel V).
7. Starte den Agent `code-reviewer` und nenne ihm **nur** Branch/PR und Vorhaben. Lege seine Ausgabe unverändert unter `specs/<NN-name>/reviews/T-xx.md` ab. Behebe 🔴-Befunde und lass das Review danach erneut laufen.
8. Der Merge nach `main` (dev) erfolgt automatisch nach `docs/prozess/release.md`.
