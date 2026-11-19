---
description: 'SDD Stufe 4 – freigegebenen Plan in kleine Tasks zerlegen'
argument-hint: '<NN-name>'
---

SDD-Stufe 4 **Tasks** gemäß `docs/prozess/sdd-ablauf.md` (verbindlich über `CONSTITUTION.md`).

Vorhaben: $ARGUMENTS

1. Prüfe, dass `specs/<NN-name>/plan.md` freigegeben ist. Wenn nicht: abbrechen.
2. Lege `specs/<NN-name>/tasks.md` aus `specs/_vorlagen/tasks.md` an.
3. Zerlege jeden Plan-Schritt in Tasks, die in höchstens wenigen Stunden erledigt und einzeln prüfbar sind.
4. Jede Task bekommt: AK-Bezug, Test, Abhängigkeiten und ein Soll in Stunden. Eine Task ohne AK gibt es nicht.
5. Danach direkt `/sdd-analyze` ausführen.

Zeit: Trage die Zeit dieser Stufe in `specs/<NN-name>/zeiten.md` ein (Systemuhr, Wartezeit auf den Inhaber in eigenen Zeilen, Spalte „Art“).
