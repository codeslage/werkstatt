---
description: 'SDD Stufe 6 – genau eine Task umsetzen oder eine PR-Gruppe abschließen'
argument-hint: '<NN-name> T-xx | <NN-name> review PR-xx'
---

SDD-Stufe 6 **Implement** gemäß `docs/prozess/sdd-ablauf.md` (verbindlich über `CONSTITUTION.md`), Regel „Schlanke Steuerung in Stufe 6“.

Auftrag: $ARGUMENTS

Eine Sitzung erledigt **genau einen** Auftrag und hört dann auf. Liegt ein Kontextpaket vor (`.sdd-dirigent/kontext-<ID>.md`, von `tools/sdd-dirigent` erzeugt), lies zuerst nur dieses und danach gezielt, was fehlt.

Prüfe vorab, dass die Analyse in `tasks.md` keine offenen Lücken hat. Wenn doch: abbrechen.

**Auftrag `T-xx` (eine Task):**

1. Arbeite auf dem Branch der PR-Gruppe (`feature/<NN-name>-pr-xx`). Steuert `tools/sdd-dirigent`, ist er schon ausgecheckt; sonst lege ihn von `main` an bzw. checke ihn aus.
2. Schreibe zuerst den Test, der fehlschlägt, dann den minimalen Code, bis er grün ist. Halte Artikel XV ein: kein toter Code, klare Modulgrenzen, Überflüssiges im selben PR entfernen.
3. Lint, Typecheck und alle Tests laufen lokal grün.
4. Ein Commit `T-xx: <kurz>`. Noch kein PR und kein Review – beides folgt je PR-Gruppe.
5. Zeit: Steuert `tools/sdd-dirigent`, trägt das Werkzeug sie ein. Sonst: Zeile in `zeiten.md` (Systemuhr, Wartezeit auf den Inhaber in eigenen Zeilen, Spalte „Art“).

**Auftrag `review PR-xx` (PR-Gruppe abschließen):**

1. Starte den Agent `code-reviewer` und nenne ihm **nur** den Branch und das Vorhaben. Lege seine Ausgabe unverändert unter `specs/<NN-name>/reviews/PR-xx.md` ab (weitere Durchläufe: `PR-xx-2.md` …).
2. Behebe 🔴-Befunde (und 🟡, wenn sie mit wenigen Zeilen zu beheben sind) und lass das Review danach erneut laufen, bis kein 🔴 offen ist.
3. Setze den Status der Tasks dieser PR-Gruppe in `tasks.md` auf ✅ und trage das gerundete Ist aus `zeiten.md` ein.
4. Erstelle den PR mit ausgefüllter Constitution-Checkliste. Keine zerstörerischen Aktionen ohne Freigabe (Artikel V).
5. Der Merge nach `main` (dev) erfolgt automatisch nach `docs/prozess/release.md`.
