---
description: 'SDD Stufe 3 – technischen Plan zu einer freigegebenen Spec erstellen'
argument-hint: '<NN-name>'
---

SDD-Stufe 3 **Plan** gemäß `docs/prozess/sdd-ablauf.md` (verbindlich über `CONSTITUTION.md`).

Vorhaben: $ARGUMENTS

1. Prüfe, dass `specs/<NN-name>/spec.md` den Status `Freigegeben` oder `Geklärt` mit Freigabe hat. Wenn nicht: abbrechen und darauf hinweisen.
2. Lege `specs/<NN-name>/plan.md` aus `specs/_vorlagen/plan.md` an.
3. Beschreibe das **Wie**: Ansatz, Bausteine, Abhängigkeitsrichtungen, Datenmodell, Schnittstellen, Schritte (je ein PR), Teststrategie je AK.
4. Wähle die einfachste Lösung, die alle AKs erfüllt (Artikel XI, XV). Begründe jede neue Abhängigkeit.
5. Lege für jede Architekturentscheidung ein ADR in `docs/adr/` an.
6. Fülle den Constitution-Check aus. Ende mit der Bitte um Freigabe (Gate ⛔).
