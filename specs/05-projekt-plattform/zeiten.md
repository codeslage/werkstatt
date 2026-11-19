# 05 – Phase 1.5 Projekt-Plattform: Zeitprotokoll

> Bezug: `tasks.md` (Spalte Ist), `retro.md` (Soll/Ist), Constitution Artikel XIV, `docs/prozess/sdd-ablauf.md` („Zeiterfassung“)

Methode:

- **Ab Stufe 1:** Jede Stufe und jede Task bekommt Zeilen, auch Specify, Plan, Analyze, Verify und Retro. In der Spalte „Was“ steht die Task (`T-xx`) oder der Name der Stufe (z. B. `Spec`, `Plan`, `Verify`, `Retro`).
- **Start und Ende** nach der Systemuhr (`date`), nicht geschätzt. Ende heißt: Test grün, Protokoll geschrieben bzw. Stufe abgeschlossen.
- **Wartezeit auf den Inhaber** (Freigaben, Schritte 👤) zählt mit, so wie in einem echten Projekt; sie steht in der Bemerkung.
- **Pausen** zwischen Sitzungen zählen nicht: Eine Task oder Stufe kann mehrere Zeilen haben.
- **Parallele Tasks:** Die Zeit zählt nur einmal. Sie gehört der Task, an der die Sitzung gerade arbeitet; die Zeilen überlappen sich nicht.
- **Auswertung:** Die Summe je Task wird auf Viertelstunden gerundet (mindestens 0,25 h) und in `tasks.md` als Ist eingetragen. Für die Retro und eine spätere Abrechnung zählen die genauen Minuten aus dieser Tabelle.

| Was           | Start            | Ende             | Dauer | Bemerkung                                                                                                                           |
| ------------- | ---------------- | ---------------- | ----- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Spec          | 2026-11-19 13:04 | 2026-11-19 13:06 | 0:02  | Prozess, Roadmap und Vorlagen gelesen; Branch, `spec.md` (21 AKs, 12 offene Fragen), `zeiten.md`, Roadmap-Start; lokale Checks grün |
| Spec          | 2026-11-19 13:06 | 2026-11-19 13:10 | 0:04  | PR #48, Review durch `code-reviewer` (kein 🔴, 5 × 🟡), Befunde umgesetzt, Review-Bericht und Protokoll                             |
| Spec (Warten) | 2026-11-19 13:10 | 2026-11-19 14:17 | 1:07  | Wartezeit auf die Antworten des Inhabers zu den offenen Fragen                                                                      |
| Spec          | 2026-11-19 14:17 | 2026-11-19 14:19 | 0:02  | Antworten eingearbeitet (Kit-Sync, AK-17 entfällt, AK-24 und Frage 14 neu), Roadmap-Frage 3 beantwortet                             |
| Spec (Warten) | 2026-11-19 14:19 | 2026-11-19 15:12 | 0:53  | Wartezeit auf die Freigabe der überarbeiteten Spec                                                                                  |
| Spec          | 2026-11-19 15:12 | 2026-11-19 15:14 | 0:02  | Freigabe eingetragen (Status Freigegeben), CI abgewartet, Wartezeit in eigene Zeilen getrennt, Merge                                |

## Summen

Wartezeit auf den Inhaber steht in eigenen Zeilen („Warten“). Sie zählt mit, wird aber getrennt ausgewiesen, weil der Inhaber in dieser Zeit an anderem arbeitet.

| Stufe | Arbeit | Warten | Gesamt |
| ----- | ------ | ------ | ------ |
| Spec  | 0:10   | 2:00   | 2:10   |
