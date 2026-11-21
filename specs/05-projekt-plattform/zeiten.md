# 05 – Phase 1.5 Projekt-Plattform: Zeitprotokoll

> Bezug: `tasks.md` (Spalte Ist), `retro.md` (Soll/Ist), Constitution Artikel XIV, `docs/prozess/sdd-ablauf.md` („Zeiterfassung“)

Methode:

- **Ab Stufe 1:** Jede Stufe und jede Task bekommt Zeilen, auch Specify, Plan, Analyze, Verify und Retro. In der Spalte „Was“ steht die Task (`T-xx`) oder der Name der Stufe (z. B. `Spec`, `Plan`, `Verify`, `Retro`).
- **Art:** `Arbeit` oder `Wartezeit`. Wartezeit auf den Inhaber (Antworten, Freigaben, Schritte 👤) zählt mit, so wie in einem echten Projekt, steht aber in **eigenen Zeilen**. Eine Zeile enthält nie beides: Die Wartezeit endet mit der ersten Ablesung der Systemuhr nach der Antwort, danach beginnt eine neue Zeile `Arbeit`.
- **Start und Ende** nach der Systemuhr (`date`), nicht geschätzt. Ende heißt: Test grün, Protokoll geschrieben bzw. Stufe abgeschlossen.
- **Pausen** zwischen Sitzungen zählen nicht: Eine Task oder Stufe kann mehrere Zeilen haben.
- **Parallele Tasks:** Die Zeit zählt nur einmal. Sie gehört der Task, an der die Sitzung gerade arbeitet; die Zeilen überlappen sich nicht.
- **Summen:** Unter der Tabelle stehen je Stufe bzw. Task Arbeit, Wartezeit und Gesamt.
- **Auswertung:** Das **Ist ist die Gesamtzeit** (Arbeit + Wartezeit), weil auch das Soll die Abstimmung enthält. Die Summe je Task wird auf Viertelstunden gerundet (mindestens 0,25 h) und in `tasks.md` als Ist eingetragen. Retro und eine spätere Abrechnung weisen Arbeit und Wartezeit zusätzlich getrennt aus; dafür zählen die genauen Minuten aus dieser Tabelle.

| Was             | Art       | Start            | Ende             | Dauer | Bemerkung                                                                                                                                                                                                |
| --------------- | --------- | ---------------- | ---------------- | ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Spec            | Arbeit    | 2026-11-19 13:04 | 2026-11-19 13:06 | 0:02  | Prozess, Roadmap und Vorlagen gelesen; Branch, `spec.md` (21 AKs, 12 offene Fragen), `zeiten.md`, Roadmap-Start; lokale Checks grün                                                                      |
| Spec            | Arbeit    | 2026-11-19 13:06 | 2026-11-19 13:10 | 0:04  | PR #48, Review durch `code-reviewer` (kein 🔴, 5 × 🟡), Befunde umgesetzt, Review-Bericht und Protokoll                                                                                                  |
| Spec            | Wartezeit | 2026-11-19 13:10 | 2026-11-19 14:17 | 1:07  | Antworten des Inhabers zu den offenen Fragen                                                                                                                                                             |
| Spec            | Arbeit    | 2026-11-19 14:17 | 2026-11-19 14:19 | 0:02  | Antworten eingearbeitet (Kit-Sync, AK-17 entfällt, AK-24 und Frage 14 neu), Roadmap-Frage 3 beantwortet                                                                                                  |
| Spec            | Wartezeit | 2026-11-19 14:19 | 2026-11-19 15:12 | 0:53  | Freigabe der überarbeiteten Spec                                                                                                                                                                         |
| Spec            | Arbeit    | 2026-11-19 15:12 | 2026-11-19 15:14 | 0:02  | Freigabe eingetragen (Status Freigegeben), CI abgewartet, Wartezeit getrennt, Merge #48                                                                                                                  |
| M #50           | Wartezeit | 2026-11-19 15:14 | 2026-11-19 15:18 | 0:04  | Entscheidung des Inhabers, die getrennte Wartezeit in Vorlage und Prozess aufzunehmen                                                                                                                    |
| M #50           | Arbeit    | 2026-11-19 15:18 | 2026-11-19 15:20 | 0:02  | Vorlage, `sdd-ablauf.md`, Befehle, Changelog; PR #50, Review (kein 🔴, 2 × 🟡), Format an Phase 2 (Spalte „Art“) angeglichen                                                                             |
| M #50           | Arbeit    | 2026-11-19 15:20 | 2026-11-19 15:21 | 0:01  | Review-Bericht abgelegt, PR-Text neu gesetzt, Push                                                                                                                                                       |
| M #50           | Wartezeit | 2026-11-19 15:21 | 2026-11-19 15:26 | 0:05  | Freigabe des Inhabers zum Merge (Ist = Gesamtzeit)                                                                                                                                                       |
| M #50           | Arbeit    | 2026-11-19 15:26 | 2026-11-19 15:28 | 0:02  | Freigabe eingetragen, CI geprüft, Merge (Ende nachträglich auf die Ablesung nach dem Merge korrigiert)                                                                                                   |
| Clarify         | Arbeit    | 2026-11-19 15:56 | 2026-11-19 15:56 | 0:00  | Spec auf Lücken geprüft, 3 neue Fragen und Frage 14 mit Vorschlägen gestellt; Zeit von 15:28 bis 15:56 ist Pause bis zum Start durch den Inhaber (zählt nicht)                                           |
| Clarify         | Wartezeit | 2026-11-19 15:56 | 2026-11-19 16:08 | 0:12  | Antworten des Inhabers auf die Fragen 14–17                                                                                                                                                              |
| Clarify         | Arbeit    | 2026-11-19 16:08 | 2026-11-19 16:12 | 0:04  | Antworten eingetragen, AK-25 bis AK-27, Status Geklärt, PR #52, Review (kein 🔴, 3 × 🟡) umgesetzt, Bericht und Protokoll                                                                                |
| Clarify         | Arbeit    | 2026-11-19 16:12 | 2026-11-19 16:14 | 0:02  | CI abgewartet, Merge #52 (nachgetragen, Ende = Ablesung nach dem Merge)                                                                                                                                  |
| Plan            | Arbeit    | 2026-11-19 16:31 | 2026-11-19 16:37 | 0:06  | Grundlagen gelesen (CI, Infra, ADRs); `plan.md`, ADR 0011–0013; Bezeichner auf Englisch; 16:14 bis 16:31 Pause bis zum Start durch den Inhaber (zählt nicht)                                             |
| Plan            | Arbeit    | 2026-11-19 16:37 | 2026-11-19 16:54 | 0:17  | PR #53, Review 1. Durchgang (🔴), Plan v2, Review 2. Durchgang (🔴), Plan v3, Berichte und Protokoll                                                                                                     |
| Plan            | Arbeit    | 2026-11-19 16:54 | 2026-11-19 16:58 | 0:04  | Review 3. Durchgang (✅, 6 × 🟡); Ende aus der gemessenen Laufzeit des Review-Agenten (214 s), nicht per `date` abgelesen. Danach Pause bis 22:31 (Token-Kontingent des Inhabers erschöpft, zählt nicht) |
| Plan            | Arbeit    | 2026-11-19 22:31 | 2026-11-19 22:33 | 0:02  | Plan v3.1 (zweite App nur zum Lesen, Prüfung von außen, `CODEOWNERS` in `werkstatt`, P5), Bericht und Protokoll; Freigabe angefragt                                                                      |
| Plan            | Arbeit    | 2026-11-20 08:47 | 2026-11-20 08:49 | 0:02  | Antworten P1–P5 eingearbeitet (Plan v4: Sync in private Repos per Hand), ADR 0011/0012, Nachtrag, Protokoll. Von 22:33 bis 08:47 Pause über Nacht (zählt nicht, obwohl die Fragen offen waren)           |
| Plan            | Wartezeit | 2026-11-20 08:49 | 2026-11-20 08:51 | 0:02  | Freigabe des Plans durch den Inhaber                                                                                                                                                                     |
| Plan            | Arbeit    | 2026-11-20 08:51 | 2026-11-20 08:53 | 0:02  | Status Freigegeben, CI, Merge #53 (Ende = Ablesung nach dem Merge, nachgetragen)                                                                                                                         |
| Tasks + Analyze | Arbeit    | 2026-11-20 08:54 | 2026-11-20 08:57 | 0:03  | `tasks.md` (44 Tasks, Soll 55,5 h), direkt danach Analyse (Stufe 5) mit 5 Lücken; beide Stufen in einer Zeile, weil der Wechsel nicht per `date` abgelesen wurde                                         |
| Tasks + Analyze | Arbeit    | 2026-11-20 08:57 | 2026-11-20 09:06 | 0:09  | PR #57, Review (3 × 🔴), Befunde umgesetzt (T-45 bis T-47, Plan v4.1, Spec VII), Bericht, Protokoll                                                                                                      |
| Tasks + Analyze | Arbeit    | 2026-11-20 09:06 | 2026-11-20 09:09 | 0:03  | Review 2. Durchgang (✅, 3 × 🟡), Befunde umgesetzt (Plan v4.1 angeglichen), Bericht, Protokoll; Bestätigung angefragt                                                                                   |
| Tasks + Analyze | Wartezeit | 2026-11-20 09:09 | 2026-11-20 09:51 | 0:42  | Bestätigung von AK-4/AK-7 und Entscheidung zum Roadmap-Soll                                                                                                                                              |
| Tasks + Analyze | Arbeit    | 2026-11-20 09:51 | 2026-11-20 09:53 | 0:02  | Antworten eingetragen, Roadmap-Soll korrigiert, CI grün, Merge von GitHub blockiert (neuer Pflicht-Check aus Phase 2)                                                                                    |
| Tasks + Analyze | Wartezeit | 2026-11-20 09:53 | 2026-11-20 10:04 | 0:11  | Warten auf PR #58 von Phase 2 (Pflicht-Check „Webseite (E2E + Lighthouse)“)                                                                                                                              |
| Tasks + Analyze | Arbeit    | 2026-11-20 10:04 | 2026-11-20 10:05 | 0:01  | `main` in den Branch gemergt, CI neu, Merge (Rest bis zum Merge wird mit Stufe 6 nachgetragen)                                                                                                           |
| Tasks + Analyze | Arbeit    | 2026-11-20 13:59 | 2026-11-20 14:00 | 0:01  | Merge #57 (nachgetragen). 10:05–13:59 Pause, zählt nicht: CI war um 10:08 grün, der Merge kam erst auf „Versuch es noch einmal“                                                                          |
| Implement PR-1  | Arbeit    | 2026-11-20 16:55 | 2026-11-20 17:15 | 0:20  | T-01 bis T-05, T-47 testgetrieben, T-06 ohne Ruleset, PR #62, Review gestartet. Ende geschätzt (letzte Ablesung 17:09). 14:00–16:55 als Pause gewertet                                                   |
| Implement PR-1  | Arbeit    | 2026-11-21 18:13 | 2026-11-21 18:20 | 0:07  | CI: `hcl.test.ts` auf `cwk-code.yml` umgestellt, Review neu gestartet. 17:15–18:13 (Folgetag) Pause: Review-Agent am Nutzungslimit abgebrochen                                                           |
| Implement PR-1  | Arbeit    | 2026-11-21 18:20 | 2026-11-21 18:25 | 0:05  | Review 1 umgesetzt (🔴 zwei pull_request-Regeln), Review 2 (✅), `main` gemergt, Befunde aus Review 2; Freigabe T-06 angefragt                                                                           |
| Implement PR-1  | Wartezeit | 2026-11-21 18:25 | 2026-11-21 18:37 | 0:12  | Freigabe der Umstellung des Rulesets (T-06)                                                                                                                                                              |
| Implement PR-1  | Arbeit    | 2026-11-21 18:37 | 2026-11-21 18:45 | 0:08  | Ruleset umgestellt, CI neu, Nachtrag Protokoll, Merge #62 (Ende = geplanter Merge, wird bei Abweichung korrigiert)                                                                                       |

## Summen

| Was             | Arbeit | Wartezeit | Gesamt |
| --------------- | ------ | --------- | ------ |
| Spec            | 0:10   | 2:00      | 2:10   |
| M #50           | 0:05   | 0:09      | 0:14   |
| Clarify         | 0:06   | 0:12      | 0:18   |
| Plan            | 0:33   | 0:02      | 0:35   |
| Tasks + Analyze | 0:19   | 0:53      | 1:12   |
| Implement PR-1  | 0:40   | 0:12      | 0:52   |

`M #50` ist die Klasse-M-Änderung an der Zeiterfassung, die aus Stufe 1 entstand.
