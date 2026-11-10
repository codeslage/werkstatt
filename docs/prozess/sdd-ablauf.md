# SDD-Ablauf (Spec-Driven Development)

> Status: **Freigegeben** am 2026-11-05 · Stand: 2026-11-05
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
| 7   | **Verify**    | Erfüllt es die Spec?              | Release-Kandidat auf **int** (`/release`), alle AKs dort nachgewiesen, alle Reviews ohne 🔴                                        | ⛔ Abnahme auf int = Freigabe für prod |
| 8   | **Retro**     | Was haben wir gelernt?            | `retro.md`: Soll/Ist, Learnings, Content-Notizen; Status `Umgesetzt`                                                               | –                                      |

Regeln:

- Vorlagen für alle Dateien liegen in `specs/_vorlagen/`.
- In Claude Code gibt es für jede Stufe einen Befehl (`/sdd-specify` … `/sdd-retro`, definiert in `.claude/commands/`).
- Ändert sich in einer späteren Stufe etwas Grundlegendes, geht es zurück zur betroffenen Stufe, und deren Gate gilt erneut.
- Grundlagen-Dokumente (`01-vision`, `02-architektur`, `03-roadmap`) liegen flach in `specs/` und durchlaufen nur die Stufen 1–2.
- Was „Code-Review“ bedeutet, regelt `docs/prozess/code-review.md`; Branches, Umgebungen und Releases regelt `docs/prozess/release.md`.
- Nicht jede Änderung braucht den vollen Ablauf: kleine Änderungen (Klasse K) und Mini-Änderungen (Klasse M) regelt `docs/prozess/aenderungsklassen.md`.
