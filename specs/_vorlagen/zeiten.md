# NN – Titel: Zeitprotokoll

> Bezug: `tasks.md` (Spalte Ist), `retro.md` (Soll/Ist), Constitution Artikel XIV, `docs/prozess/sdd-ablauf.md` („Zeiterfassung“)

Methode:

- **Ab Stufe 1:** Jede Stufe und jede Task bekommt Zeilen, auch Specify, Plan, Analyze, Verify und Retro. In der Spalte „Was“ steht die Task (`T-xx`) oder der Name der Stufe (z. B. `Spec`, `Plan`, `Verify`, `Retro`).
- **Art:** `Arbeit` oder `Wartezeit`. Wartezeit auf den Inhaber (Antworten, Freigaben, Schritte 👤) zählt mit, so wie in einem echten Projekt, steht aber in **eigenen Zeilen**. Eine Zeile enthält nie beides: Die Wartezeit endet mit der ersten Ablesung der Systemuhr nach der Antwort, danach beginnt eine neue Zeile `Arbeit`.
- **Start und Ende** nach der Systemuhr (`date`), nicht geschätzt. Ende heißt: Test grün, Protokoll geschrieben bzw. Stufe abgeschlossen.
- **Pausen** zwischen Sitzungen zählen nicht: Eine Task oder Stufe kann mehrere Zeilen haben.
- **Parallele Tasks:** Die Zeit zählt nur einmal. Sie gehört der Task, an der die Sitzung gerade arbeitet; die Zeilen überlappen sich nicht.
- **Summen:** Unter der Tabelle stehen je Stufe bzw. Task Arbeit, Wartezeit und Gesamt.
- **Auswertung:** Das **Ist ist die Gesamtzeit** (Arbeit + Wartezeit), weil auch das Soll die Abstimmung enthält. Die Summe je Task wird auf Viertelstunden gerundet (mindestens 0,25 h) und in `tasks.md` als Ist eingetragen. Retro und eine spätere Abrechnung weisen Arbeit und Wartezeit zusätzlich getrennt aus; dafür zählen die genauen Minuten aus dieser Tabelle.

| Was | Art    | Start            | Ende             | Dauer | Bemerkung |
| --- | ------ | ---------------- | ---------------- | ----- | --------- |
|     | Arbeit | JJJJ-MM-TT hh:mm | JJJJ-MM-TT hh:mm | h:mm  |           |

## Summen

| Was | Arbeit | Wartezeit | Gesamt |
| --- | ------ | --------- | ------ |
|     | h:mm   | h:mm      | h:mm   |
