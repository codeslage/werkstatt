# NN – Titel: Zeitprotokoll

> Bezug: `tasks.md` (Spalte Ist), `retro.md` (Soll/Ist), Constitution Artikel XIV, `docs/prozess/sdd-ablauf.md` („Zeiterfassung“)

Methode:

- **Ab Stufe 1:** Jede Stufe und jede Task bekommt Zeilen, auch Specify, Plan, Analyze, Verify und Retro. In der Spalte „Was“ steht die Task (`T-xx`) oder der Name der Stufe (z. B. `Spec`, `Plan`, `Verify`, `Retro`).
- **Start und Ende** nach der Systemuhr (`date`), nicht geschätzt. Ende heißt: Test grün, Protokoll geschrieben bzw. Stufe abgeschlossen.
- **Wartezeit auf den Inhaber** (Antworten, Freigaben, Schritte 👤) zählt mit, so wie in einem echten Projekt, steht aber in **eigenen Zeilen** mit dem Zusatz „(Warten)“ in der Spalte „Was“ (z. B. `Spec (Warten)`, `T-03 (Warten)`). Eine Zeile enthält nie Arbeit und Warten zugleich: Kommt die Antwort, endet die Wartezeile, und eine neue Arbeitszeile beginnt.
- **Pausen** zwischen Sitzungen zählen nicht: Eine Task oder Stufe kann mehrere Zeilen haben.
- **Parallele Tasks:** Die Zeit zählt nur einmal. Sie gehört der Task, an der die Sitzung gerade arbeitet; die Zeilen überlappen sich nicht.
- **Summen:** Am Ende steht die Tabelle „Summen“ mit Arbeit, Warten und Gesamt je Stufe bzw. Task. So bleibt sichtbar, wie viel Zeit Arbeit war und wie viel Warten.
- **Auswertung:** Die Summe je Task wird auf Viertelstunden gerundet (mindestens 0,25 h) und in `tasks.md` als Ist eingetragen. Für die Retro und eine spätere Abrechnung zählen die genauen Minuten aus dieser Tabelle.

| Was | Start            | Ende             | Dauer | Bemerkung |
| --- | ---------------- | ---------------- | ----- | --------- |
|     | JJJJ-MM-TT hh:mm | JJJJ-MM-TT hh:mm | h:mm  |           |

## Summen

| Was | Arbeit | Warten | Gesamt |
| --- | ------ | ------ | ------ |
|     | h:mm   | h:mm   | h:mm   |
