# 06 – Phase 2 Webseite (Klick-Dummy): Zeitprotokoll

> Bezug: `tasks.md` (Spalte Ist), `retro.md` (Soll/Ist), Constitution Artikel XIV, `docs/prozess/sdd-ablauf.md` („Zeiterfassung“)

Methode:

- **Ab Stufe 1:** Jede Stufe und jede Task bekommt Zeilen, auch Specify, Plan, Analyze, Verify und Retro. In der Spalte „Was“ steht die Task (`T-xx`) oder der Name der Stufe (z. B. `Spec`, `Plan`, `Verify`, `Retro`).
- **Art:** `Arbeit` oder `Wartezeit`. Wartezeit auf den Inhaber (Antworten, Freigaben, Schritte 👤) zählt mit, so wie in einem echten Projekt, steht aber in **eigenen Zeilen**. Eine Zeile enthält nie beides: Die Wartezeit endet mit der ersten Ablesung der Systemuhr nach der Antwort, danach beginnt eine neue Zeile `Arbeit`.
- **Start und Ende** nach der Systemuhr (`date`), nicht geschätzt. Ende heißt: Test grün, Protokoll geschrieben bzw. Stufe abgeschlossen.
- **Pausen** zwischen Sitzungen zählen nicht: Eine Task oder Stufe kann mehrere Zeilen haben.
- **Parallele Tasks:** Die Zeit zählt nur einmal. Sie gehört der Task, an der die Sitzung gerade arbeitet; die Zeilen überlappen sich nicht.
- **Summen:** Unter der Tabelle stehen je Stufe bzw. Task Arbeit, Wartezeit und Gesamt.
- **Auswertung:** Das **Ist ist die Gesamtzeit** (Arbeit + Wartezeit), weil auch das Soll die Abstimmung enthält. Die Summe je Task wird auf Viertelstunden gerundet (mindestens 0,25 h) und in `tasks.md` als Ist eingetragen. Retro und eine spätere Abrechnung weisen Arbeit und Wartezeit zusätzlich getrennt aus; dafür zählen die genauen Minuten aus dieser Tabelle.

| Was     | Art       | Start            | Ende             | Dauer | Bemerkung                                                                                                                           |
| ------- | --------- | ---------------- | ---------------- | ----- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Spec    | Arbeit    | 2026-11-19 14:17 | 2026-11-19 14:20 | 0:03  | Entwurf `spec.md`, Roadmap-Eintrag, Draft-PR; parallel zu Phase 1.5                                                                 |
| Spec    | Wartezeit | 2026-11-19 14:20 | 2026-11-19 15:11 | 0:51  | Antworten auf die Fragen 3, 4, 8, 9; Ende = erste Ablesung nach der Antwort                                                         |
| Spec    | Arbeit    | 2026-11-19 15:11 | 2026-11-19 15:11 | 0:00  | Antworten eingetragen, Commit                                                                                                       |
| Spec    | Wartezeit | 2026-11-19 15:11 | 2026-11-19 15:17 | 0:06  | Antworten auf die übrigen Fragen und Freigabe; Ende = erste Ablesung nach der Antwort                                               |
| Spec    | Arbeit    | 2026-11-19 15:17 | 2026-11-19 15:25 | 0:08  | Unterchats gestartet, Freigabe eingetragen, Review, Protokoll; parallel zu Phase 1.5                                                |
| Clarify | Arbeit    | 2026-11-19 15:25 | 2026-11-19 15:29 | 0:04  | Unterchats: Notiz Leistungen, Gestaltung Runde 2 und Logo-Dateien; 15:18–15:25 liefen sie parallel zur Zeile „Spec“ und zählen dort |
| Clarify | Arbeit    | 2026-11-19 15:30 | 2026-11-19 15:31 | 0:01  | Unterchats: Nacharbeit Zeiterfassung, Preisfrage Leistungen                                                                         |
| Clarify | Wartezeit | 2026-11-19 15:31 | 2026-11-19 15:32 | 0:01  | Unterchat Leistungen: Entscheidung Preisangabe                                                                                      |
| Clarify | Arbeit    | 2026-11-19 15:32 | 2026-11-19 15:33 | 0:01  | Branch, Notizen der Unterchats lesen, Lücken suchen                                                                                 |
| Clarify | Wartezeit | 2026-11-19 15:33 | 2026-11-19 15:36 | 0:03  | Antworten auf Kontaktadresse, Vorschau, Preise, Foto                                                                                |
| Clarify | Arbeit    | 2026-11-19 15:36 | 2026-11-19 15:44 | 0:08  | Spec auf „Geklärt“, `leistungen.md`, `gestaltung.md`, Review, Protokoll                                                             |
| Plan    | Arbeit    | 2026-11-19 15:55 | 2026-11-19 15:56 | 0:01  | Branch, Vorlage und Bezüge lesen, Fragen zu Framework, Deploy und Image                                                             |
| Plan    | Arbeit    | 2026-11-19 19:25 | 2026-11-19 19:39 | 0:14  | `plan.md`, ADR 0014 und 0015, `02-architektur.md`, PR, zwei Reviews umgesetzt                                                       |
| Plan    | Wartezeit | 2026-11-19 19:39 | 2026-11-19 19:47 | 0:08  | Freigabe des Plans; Ende = erste Ablesung nach der Antwort                                                                          |
| Plan    | Arbeit    | 2026-11-19 19:47 | 2026-11-19 19:47 | 0:00  | Freigabe eintragen, Merge                                                                                                           |

Die Sitzungen „Leistungen“ sowie „Gestaltung und Logo“ (Stufe 2) haben ihre Zeiten sekundengenau nach der Systemuhr erfasst. Übernommen sind sie hier auf die Minute und nur dort, wo keine Zeile dieser Sitzung schon läuft, damit nichts doppelt zählt. Für sich genommen kamen sie auf 2:36 min Arbeit und 7:28 min Wartezeit (Leistungen) bzw. 5:28 min Arbeit und 6:10 min Wartezeit (Gestaltung), überwiegend parallel zur Zeile „Spec“.

Zwischen 15:56 und 19:25 lag eine Pause des Inhabers. Sie zählt nicht und steht deshalb in keiner Zeile (Bestätigung des Inhabers am 2026-11-19).

## Summen

| Was     | Arbeit | Wartezeit | Gesamt |
| ------- | ------ | --------- | ------ |
| Spec    | 0:11   | 0:57      | 1:08   |
| Clarify | 0:14   | 0:04      | 0:18   |
| Plan    | 0:15   | 0:08      | 0:23   |
