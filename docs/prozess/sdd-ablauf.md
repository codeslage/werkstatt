# SDD-Ablauf (Spec-Driven Development)

> Status: **Freigegeben** am 2026-11-05 · Stand: 2026-11-19 (Verify ohne int bis Phase S, Zeiterfassung Pflicht ab Stufe 1 mit Vorlage, parallele Tasks; Retro 04; Wartezeit in eigenen Zeilen)
> Verbindlich über `CONSTITUTION.md`, Artikel I. Änderungen nach `docs/prozess/governance.md`.

Jedes Vorhaben (Phase oder Feature) bekommt einen Ordner `specs/NN-name/`. Die Stufen bauen aufeinander auf; ein ⛔ markiert ein **Gate**, das die Freigabe des Inhabers braucht.

| #   | Stufe         | Frage                             | Ergebnis                                                                                                                           | Gate                                   |
| --- | ------------- | --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| 1   | **Specify**   | _Was_ und _warum_? (ohne Technik) | `spec.md`: Ziel, Umfang, Anforderungen, Akzeptanzkriterien, Constitution-Check, offene Fragen                                      | ⛔ Spec freigegeben                    |
| 2   | **Clarify**   | Was ist unklar?                   | offene Fragen beantwortet oder bewusst vertagt, `spec.md` aktualisiert                                                             | keine blockierenden Fragen             |
| 3   | **Plan**      | _Wie_ setzen wir es um?           | `plan.md`: Technik, Schritte, Datenmodell und Schnittstellen, ADRs, Teststrategie, Constitution-Check                              | ⛔ Plan freigegeben                    |
| 4   | **Tasks**     | Welche kleinen Aufgaben?          | `tasks.md`: nummerierte Tasks, je mit AK-Bezug, Test, Abhängigkeiten                                                               | –                                      |
| 5   | **Analyze**   | Passt alles zusammen?             | Konsistenzbericht in `tasks.md`: jedes AK hat Task und Test, jede Task hat ein AK, kein Widerspruch zu Constitution, Spec und Plan | keine offenen Lücken                   |
| 6   | **Implement** | Umsetzen                          | je Task: Test zuerst, dann Code, dann PR, Review-Datei in `reviews/`                                                               | CI grün, kein 🔴 → Auto-Merge nach dev |
| 7   | **Verify**    | Erfüllt es die Spec?              | Release-Kandidat auf **int** (`/release`), alle AKs dort nachgewiesen, alle Reviews ohne 🔴 (bis Phase S: Regel „Verify ohne int“) | ⛔ Abnahme auf int = Freigabe für prod |
| 8   | **Retro**     | Was haben wir gelernt?            | `retro.md`: Soll/Ist, Learnings, Content-Notizen; Status `Umgesetzt`                                                               | –                                      |

Regeln:

- Vorlagen für alle Dateien liegen in `specs/_vorlagen/`.
- In Claude Code gibt es für jede Stufe einen Befehl (`/sdd-specify` … `/sdd-retro`, definiert in `.claude/commands/`).
- Ändert sich in einer späteren Stufe etwas Grundlegendes, geht es zurück zur betroffenen Stufe, und deren Gate gilt erneut.
- Grundlagen-Dokumente (`01-vision`, `02-architektur`, `03-roadmap`) liegen flach in `specs/` und durchlaufen nur die Stufen 1–2.
- Was „Code-Review“ bedeutet, regelt `docs/prozess/code-review.md`; Branches, Umgebungen und Releases regelt `docs/prozess/release.md`.
- **Verify ohne int (bis Phase S):** Solange es int und prod nicht gibt (ADR 0009), wird in Stufe 7 auf dem aktuellen `main` abgenommen. Nachweis: automatische Tests lokal und in der CI, geplante Läufe (z. B. Drift-Check, Historien-Scan) auf `main` neu gestartet, manuelle Tests protokolliert. `/release` entfällt. Das Gate lautet dann „⛔ Abnahme auf `main`“.
- **Zeiterfassung:** Jedes Vorhaben führt ab Stufe 1 eine `zeiten.md` (Vorlage `specs/_vorlagen/zeiten.md`, Constitution XIV). Jede Stufe und jede Task trägt dort ihre Zeit nach der Systemuhr ein. Die genauen Minuten sind die Grundlage für Soll/Ist und eine spätere Abrechnung. Wartezeit auf den Inhaber zählt mit, steht aber in eigenen Zeilen (Spalte „Art“: `Arbeit` oder `Wartezeit`) und wird in den Summen getrennt ausgewiesen. Das Ist ist die Gesamtzeit aus Arbeit und Wartezeit. Laufen Tasks parallel, wird die Zeit nur einmal gezählt: Sie gehört der Task, an der die Sitzung gerade arbeitet, und die Zeilen überlappen sich nicht.
- Nicht jede Änderung braucht den vollen Ablauf: kleine Änderungen (Klasse K) und Mini-Änderungen (Klasse M) regelt `docs/prozess/aenderungsklassen.md`.
