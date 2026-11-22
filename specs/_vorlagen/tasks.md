# NN – Titel: Tasks

> Stand: JJJJ-MM-TT
> Bezug: `spec.md`, `plan.md` (Status: Freigegeben)
> SDD-Stufen: 4 Tasks · 5 Analyze · 6 Implement

## Tasks

| ID   | Task | AK   | Test | Abhängig von | PR    | Plan-Abschnitt | Dateien | Soll | Ist | Status |
| ---- | ---- | ---- | ---- | ------------ | ----- | -------------- | ------- | ---- | --- | ------ |
| T-01 |      | AK-1 |      | –            | PR-01 |                |         |      |     | ⬜     |

Status: ⬜ offen · 🔄 in Arbeit · ✅ erledigt (gesetzt beim Abschluss der PR-Gruppe)

Soll und Ist in Stunden. Soll schätzt Claude beim Anlegen (konservativ, inkl. Abstimmung); Ist ist die Summe aus `zeiten.md`, auf Viertelstunden gerundet (mindestens 0,25 h).

Spalten für die schlanke Steuerung (`sdd-ablauf.md`, Stufe 6):

- **PR:** Tasks mit derselben Kennung bilden zusammen einen überprüfbaren PR (1–5 Tasks, Artikel III). Abhängigkeiten zeigen nur auf Tasks im selben oder in einem früheren PR.
- **Plan-Abschnitt:** die Überschrift aus `plan.md` (ohne `#`), in der die Task beschrieben ist. Daraus entsteht das Kontextpaket der Sitzung.
- **Dateien:** Dateien, die die Task anlegt oder ändert (Code und Tests), durch Leerzeichen getrennt.

Regeln für die Umsetzung (Stufe 6):

1. Test zur Task schreiben, der zunächst fehlschlägt
2. Minimalen Code schreiben, bis der Test grün ist (Artikel XV)
3. Aufräumen, Lint, Typecheck, alle Tests grün, Commit auf dem Branch der PR-Gruppe
4. Nach der letzten Task der PR-Gruppe: Review, Status und Ist aktualisieren, PR mit Constitution-Checkliste

## Analyse (Stufe 5)

| Prüfung                                                | Ergebnis |
| ------------------------------------------------------ | -------- |
| Jedes AK hat mindestens eine Task                      |          |
| Jedes AK hat einen Test                                |          |
| Jede Task verweist auf ein AK (kein Code ohne Auftrag) |          |
| Kein Widerspruch zu Spec, Plan oder Constitution       |          |
| Reihenfolge und Abhängigkeiten schlüssig               |          |
| PR-Gruppen, Plan-Abschnitte und Dateien vollständig    |          |

Gefundene Lücken und ihre Behebung:

-
