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

| Was        | Art       | Start            | Ende             | Dauer | Bemerkung                                                                                                                                                |
| ---------- | --------- | ---------------- | ---------------- | ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Spec       | Arbeit    | 2026-11-19 14:17 | 2026-11-19 14:20 | 0:03  | Entwurf `spec.md`, Roadmap-Eintrag, Draft-PR; parallel zu Phase 1.5                                                                                      |
| Spec       | Wartezeit | 2026-11-19 14:20 | 2026-11-19 15:11 | 0:51  | Antworten auf die Fragen 3, 4, 8, 9; Ende = erste Ablesung nach der Antwort                                                                              |
| Spec       | Arbeit    | 2026-11-19 15:11 | 2026-11-19 15:11 | 0:00  | Antworten eingetragen, Commit                                                                                                                            |
| Spec       | Wartezeit | 2026-11-19 15:11 | 2026-11-19 15:17 | 0:06  | Antworten auf die übrigen Fragen und Freigabe; Ende = erste Ablesung nach der Antwort                                                                    |
| Spec       | Arbeit    | 2026-11-19 15:17 | 2026-11-19 15:25 | 0:08  | Unterchats gestartet, Freigabe eingetragen, Review, Protokoll; parallel zu Phase 1.5                                                                     |
| Clarify    | Arbeit    | 2026-11-19 15:25 | 2026-11-19 15:29 | 0:04  | Unterchats: Notiz Leistungen, Gestaltung Runde 2 und Logo-Dateien; 15:18–15:25 liefen sie parallel zur Zeile „Spec“ und zählen dort                      |
| Clarify    | Arbeit    | 2026-11-19 15:30 | 2026-11-19 15:31 | 0:01  | Unterchats: Nacharbeit Zeiterfassung, Preisfrage Leistungen                                                                                              |
| Clarify    | Wartezeit | 2026-11-19 15:31 | 2026-11-19 15:32 | 0:01  | Unterchat Leistungen: Entscheidung Preisangabe                                                                                                           |
| Clarify    | Arbeit    | 2026-11-19 15:32 | 2026-11-19 15:33 | 0:01  | Branch, Notizen der Unterchats lesen, Lücken suchen                                                                                                      |
| Clarify    | Wartezeit | 2026-11-19 15:33 | 2026-11-19 15:36 | 0:03  | Antworten auf Kontaktadresse, Vorschau, Preise, Foto                                                                                                     |
| Clarify    | Arbeit    | 2026-11-19 15:36 | 2026-11-19 15:44 | 0:08  | Spec auf „Geklärt“, `leistungen.md`, `gestaltung.md`, Review, Protokoll                                                                                  |
| Plan       | Arbeit    | 2026-11-19 15:55 | 2026-11-19 15:56 | 0:01  | Branch, Vorlage und Bezüge lesen, Fragen zu Framework, Deploy und Image                                                                                  |
| Plan       | Arbeit    | 2026-11-19 19:25 | 2026-11-19 19:39 | 0:14  | `plan.md`, ADR 0014 und 0015, `02-architektur.md`, PR, zwei Reviews umgesetzt                                                                            |
| Plan       | Wartezeit | 2026-11-19 19:39 | 2026-11-19 19:47 | 0:08  | Freigabe des Plans; Ende = erste Ablesung nach der Antwort                                                                                               |
| Plan       | Arbeit    | 2026-11-19 19:47 | 2026-11-19 19:47 | 0:00  | Freigabe eintragen, Merge                                                                                                                                |
| Clarify    | Arbeit    | 2026-11-19 16:32 | 2026-11-19 16:34 | 0:02  | Nachtrag Gestaltung: Runde 3 bauen                                                                                                                       |
| Clarify    | Wartezeit | 2026-11-19 16:34 | 2026-11-19 16:52 | 0:18  | Nachtrag Gestaltung: Auswahl Runde 3                                                                                                                     |
| Clarify    | Arbeit    | 2026-11-19 16:52 | 2026-11-19 16:54 | 0:02  | Nachtrag Gestaltung: Variante 5 als SVG, Runde 4 bauen                                                                                                   |
| Clarify    | Wartezeit | 2026-11-19 16:54 | 2026-11-19 16:57 | 0:03  | Nachtrag Gestaltung: Auswahl Runde 4                                                                                                                     |
| Clarify    | Arbeit    | 2026-11-19 16:57 | 2026-11-19 16:58 | 0:01  | Nachtrag Gestaltung: Runde 4 als SVG                                                                                                                     |
| Clarify    | Wartezeit | 2026-11-19 19:47 | 2026-11-19 19:48 | 0:01  | Nachtrag Gestaltung: Auswahl Runde 5 (Teil nach der Zeile „Plan“, Beginn 19:28 zählt dort)                                                               |
| Clarify    | Arbeit    | 2026-11-19 19:48 | 2026-11-19 19:50 | 0:02  | Nachtrag Gestaltung: Relief-Fassung, Runde 6 bauen                                                                                                       |
| Clarify    | Wartezeit | 2026-11-19 19:50 | 2026-11-19 19:55 | 0:05  | Nachtrag Gestaltung: Auswahl Farbe                                                                                                                       |
| Clarify    | Arbeit    | 2026-11-19 19:55 | 2026-11-19 19:57 | 0:02  | Nachtrag Gestaltung: Runde 7 bauen, Endfassung; darin 0:44 min Warten auf die Auswahl (unter einer Minute, nicht getrennt)                               |
| Tasks      | Arbeit    | 2026-11-19 22:30 | 2026-11-19 22:33 | 0:03  | Branch, Vorlage, finale Gestaltung übernehmen, `tasks.md`                                                                                                |
| Analyze    | Arbeit    | 2026-11-19 22:33 | 2026-11-19 22:38 | 0:05  | Analyse in `tasks.md`, PR, Review                                                                                                                        |
| T-02, T-03 | Arbeit    | 2026-11-20 08:48 | 2026-11-20 08:50 | 0:02  | Branch, Tests zuerst (rot), `pages.ts` und `imprint.ts` (13 Tests grün)                                                                                  |
| T-01       | Arbeit    | 2026-11-20 08:50 | 2026-11-20 09:02 | 0:12  | Astro-Konfiguration, ESLint/Prettier/Knip/Typecheck für `.astro`, Gegenproben, PR, Review                                                                |
| T-04       | Arbeit    | 2026-11-20 09:05 | 2026-11-20 09:08 | 0:03  | Branch, Layout, Header, Footer, Seiten, 404, `_headers`; Ende = erster erfolgreicher Build (Zeitstempel im Build-Log)                                    |
| T-05       | Arbeit    | 2026-11-20 09:08 | 2026-11-20 09:19 | 0:11  | Playwright, vier E2E-Specs, `--ignore-lock` für `astro preview`, vier Gegenproben; Ende = Build für die Lighthouse-Gegenprobe (Zeitstempel im Build-Log) |
| T-06       | Arbeit    | 2026-11-20 09:19 | 2026-11-20 09:37 | 0:18  | Lighthouse CI, Gegenprobe, CI-Job, Doku, PR, Review, Befunde umgesetzt (Beacon-Test, 404)                                                                |
| T-07       | Wartezeit | 2026-11-20 09:37 | 2026-11-20 09:50 | 0:13  | Freigabe Pflicht-Check im Ruleset; gefragt 09:31, bis 09:37 lief parallel die Arbeit an T-06 (zählt dort); Ende = erste Ablesung nach der Antwort        |
| T-07       | Arbeit    | 2026-11-20 09:50 | 2026-11-20 09:51 | 0:01  | Ruleset `main-schutz` um „Webseite (E2E + Lighthouse)“ ergänzt (Diff gezeigt), `repo.test.ts` lokal grün, Doku, Merge                                    |
| T-07       | Arbeit    | 2026-11-20 09:51 | 2026-11-20 10:04 | 0:13  | Nacharbeit PR-2: zweites Review abgelegt, Hinweise behoben, CI, Merge (#58), Hinweis an Phase 1.5                                                        |
| T-09       | Arbeit    | 2026-11-20 10:04 | 2026-11-20 10:10 | 0:06  | Branch, axe, Kontrasttest (rot), `global.css`, Gegenprobe, Lighthouse; Ende = Änderungszeit des Lighthouse-Logs (10:09:59, Systemuhr)                    |
| T-09       | Arbeit    | 2026-11-20 13:59 | 2026-11-20 14:02 | 0:03  | nach Unterbrechung (10:10–13:59, zählt nicht): Checks, Doku, PR, Review                                                                                  |
| T-09       | Arbeit    | 2026-11-20 14:02 | 2026-11-20 14:09 | 0:07  | Nacharbeit PR-4: Commit, CI, Merge (#59)                                                                                                                 |
| T-08       | Arbeit    | 2026-11-20 14:09 | 2026-11-20 14:14 | 0:05  | Platzhalter-Tests (rot), Texte für Titel, Beschreibungen, Navigation, Footer, 404, Screenshots, Lighthouse                                               |
| T-08       | Wartezeit | 2026-11-20 14:18 | 2026-11-20 14:30 | 0:12  | Freigabe der Texte (Text-PR #60); gefragt 14:15, bis 14:18 lief parallel die Arbeit am Review (zählt dort)                                               |
| T-08       | Arbeit    | 2026-11-20 14:30 | 2026-11-20 14:31 | 0:01  | Freigabe eingetragen, Merge                                                                                                                              |
| T-08       | Arbeit    | 2026-11-20 14:14 | 2026-11-20 14:18 | 0:04  | Doku, PR, Review                                                                                                                                         |

Die Sitzungen „Leistungen“ sowie „Gestaltung und Logo“ (Stufe 2) haben ihre Zeiten sekundengenau nach der Systemuhr erfasst. Übernommen sind sie hier auf die Minute und nur dort, wo keine Zeile dieser Sitzung schon läuft, damit nichts doppelt zählt. Für sich genommen kamen sie auf 2:36 min Arbeit und 7:28 min Wartezeit (Leistungen) bzw. 5:28 min Arbeit und 6:10 min Wartezeit (Gestaltung), überwiegend parallel zur Zeile „Spec“.

Die Sitzung „Gestaltung und Logo“ lief nach Stufe 2 weiter (Runden 3–7). Ihre Zeiten sind als „Clarify, Nachtrag Gestaltung“ auf die Minute übernommen, nur wo keine andere Zeile läuft; ihre eigenen Pausen 15:34–16:32 und 16:58–19:27 zählen nicht. Zwischen 15:56 und 19:25 lag eine Pause in der Hauptsitzung. Die Gestaltungs-Sitzung lief in dieser Zeit von 16:32 bis 16:58 weiter; diese Zeilen stehen als Nachtrag hinter „Plan“. Sie zählt nicht und steht deshalb in keiner Zeile (Bestätigung des Inhabers am 2026-11-19).

## Summen

| Was        | Arbeit | Wartezeit | Gesamt |
| ---------- | ------ | --------- | ------ |
| Spec       | 0:11   | 0:57      | 1:08   |
| Clarify    | 0:23   | 0:31      | 0:54   |
| Plan       | 0:15   | 0:08      | 0:23   |
| Tasks      | 0:03   | 0:00      | 0:03   |
| Analyze    | 0:05   | 0:00      | 0:05   |
| T-01       | 0:12   | 0:00      | 0:12   |
| T-02, T-03 | 0:02   | 0:00      | 0:02   |
| T-04       | 0:03   | 0:00      | 0:03   |
| T-05       | 0:11   | 0:00      | 0:11   |
| T-06       | 0:18   | 0:00      | 0:18   |
| T-07       | 0:14   | 0:13      | 0:27   |
| T-09       | 0:16   | 0:00      | 0:16   |
| T-08       | 0:10   | 0:12      | 0:22   |
