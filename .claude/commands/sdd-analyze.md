---
description: "SDD Stufe 5 – Konsistenz von Spec, Plan, Tasks und Constitution prüfen"
argument-hint: "<NN-name>"
---
SDD-Stufe 5 **Analyze** gemäß `docs/prozess/sdd-ablauf.md` (verbindlich über `CONSTITUTION.md`).

Vorhaben: $ARGUMENTS

Lies `CONSTITUTION.md` sowie `spec.md`, `plan.md` und `tasks.md` in `specs/<NN-name>/` und prüfe:
- Jedes AK hat mindestens eine Task und einen Test.
- Jede Task verweist auf ein AK (kein Code ohne Auftrag, Artikel XV).
- Plan und Tasks widersprechen weder der Spec noch der Constitution.
- Abhängigkeiten und Reihenfolge sind schlüssig, nichts ist doppelt.

Trage das Ergebnis in den Abschnitt „Analyse“ von `tasks.md` ein. Behebe Lücken (bei Spec- oder Plan-Änderungen: zurück zur Stufe und deren Gate). Melde dem Inhaber das Ergebnis.
