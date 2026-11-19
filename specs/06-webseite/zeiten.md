# 06 – Phase 2 Webseite (Klick-Dummy): Zeitprotokoll

> Bezug: `tasks.md` (Spalte Ist), `retro.md` (Soll/Ist), Constitution Artikel XIV, `docs/prozess/sdd-ablauf.md` („Zeiterfassung“)

Methode:

- **Ab Stufe 1:** Jede Stufe und jede Task bekommt Zeilen, auch Specify, Plan, Analyze, Verify und Retro. In der Spalte „Was“ steht die Task (`T-xx`) oder der Name der Stufe (z. B. `Spec`, `Plan`, `Verify`, `Retro`).
- **Start und Ende** nach der Systemuhr (`date`), nicht geschätzt. Ende heißt: Test grün, Protokoll geschrieben bzw. Stufe abgeschlossen.
- **Wartezeit auf den Inhaber** (Freigaben, Schritte 👤) zählt mit, so wie in einem echten Projekt; sie steht in der Bemerkung.
- **Pausen** zwischen Sitzungen zählen nicht: Eine Task oder Stufe kann mehrere Zeilen haben.
- **Parallele Tasks:** Die Zeit zählt nur einmal. Sie gehört der Task, an der die Sitzung gerade arbeitet; die Zeilen überlappen sich nicht.
- **Auswertung:** Die Summe je Task wird auf Viertelstunden gerundet (mindestens 0,25 h) und in `tasks.md` als Ist eingetragen. Für die Retro und eine spätere Abrechnung zählen die genauen Minuten aus dieser Tabelle.

| Was  | Art       | Start            | Ende             | Dauer | Bemerkung                                                                             |
| ---- | --------- | ---------------- | ---------------- | ----- | ------------------------------------------------------------------------------------- |
| Spec | Arbeit    | 2026-11-19 14:17 | 2026-11-19 14:20 | 0:03  | Entwurf `spec.md`, Roadmap-Eintrag, Draft-PR; parallel zu Phase 1.5                   |
| Spec | Wartezeit | 2026-11-19 14:20 | 2026-11-19 15:11 | 0:51  | Antworten auf die Fragen 3, 4, 8, 9; Ende = erste Ablesung nach der Antwort           |
| Spec | Arbeit    | 2026-11-19 15:11 | 2026-11-19 15:11 | 0:00  | Antworten eingetragen, Commit                                                         |
| Spec | Wartezeit | 2026-11-19 15:11 | 2026-11-19 15:17 | 0:06  | Antworten auf die übrigen Fragen und Freigabe; Ende = erste Ablesung nach der Antwort |
| Spec | Arbeit    | 2026-11-19 15:17 | läuft            |       | Unterchats gestartet, Freigabe eingetragen, Review, Protokoll; parallel zu Phase 1.5  |

Wartezeit steht ab diesem Vorhaben in **eigenen Zeilen** (Spalte „Art“), damit sie getrennt ausgewiesen werden kann (Wunsch des Inhabers vom 2026-11-19). Die Sitzungen für Leistungen sowie Gestaltung und Logo führen ihre Zeiten selbst; sie werden in Stufe 2 übernommen.

| Summe     | Dauer |
| --------- | ----- |
| Arbeit    | läuft |
| Wartezeit | 0:57  |
