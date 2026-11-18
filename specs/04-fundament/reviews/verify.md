## Review: PR #44 `feature/verify-04` · Vorhaben 04-fundament · Stufe 7 (Verify), Abnahme je AK

Ergebnis: ✅ mergebar (keine offenen 🔴)

Geprüft: `git diff main...feature/verify-04` (Commits f99aacd, 622b641). Geändert sind `specs/04-fundament/retro.md` (neu), `tasks.md` (Kopfzeile), `zeiten.md` (eine neue Zeile „Verify“, dazu eine korrigierte Tabellen-Trennzeile; sonst nur Leerraum) und `CHANGELOG.md`.

Die Angaben in der Retro habe ich selbst nachgeprüft:
- **Tests:** `pnpm test` ergibt lokal 100/100, `pnpm format` und `pnpm spec-check` laufen sauber durch. `pnpm test:infra` habe ich nicht selbst ausgeführt.
- **Läufe auf GitHub:** Run 44402691716 (Drift-Check) und Run 44402696714 (Historien-Scan) liefen auf `cd5abff`/`main` per `workflow_dispatch` und sind grün. Die CI für den Push `cd5abff` ist grün, ebenso alle 10 Checks von PR #44.
- **Abdeckung der AKs:** Alle 17 aktiven AKs der Spec stehen in der Tabelle. Alle genannten Testdateien, Protokolle (`docs/protokolle/…`), Reviews und ADR 0009 gibt es wirklich.
- **Reviews je PR:** Von #2 bis #42 hat jeder gemergte PR ein Review oder einen Nachweis dafür. Die 🔴 in T-12, T-15 und T-38 sind durch spätere Durchgänge oder Nachträge erledigt. Das 🔴 aus T-23 (PR #14) ist durch die Freigabe des Inhabers erledigt, die in `CHANGELOG.md:29` belegt ist.

### Befunde
| # | Grad | Datei:Zeile | Befund | Fehlerfall | Artikel |
|---|---|---|---|---|---|
| 1 | 🟡 | `specs/04-fundament/retro.md:38` | Der Satz „Bei #4, #6 und #7 (Klasse M) steht der Review im PR bzw. im Protokoll T-12“ sagt mehr, als sich belegen lässt. Laut `code-review.md` gehört bei Klasse M eine Zusammenfassung des Reviews in die PR-Beschreibung. In #6 und #7 steht aber nur das Häkchen „[x] Review-Agent“, ohne Ergebnis und ohne Befunde. In #4 fehlt jeder Hinweis. Belegt ist dort nur eine Zeile in `docs/protokolle/2026-11-10-t-12-neue-sitzung.md:51` („sein 🟡-Befund wurde im selben PR behoben“). | Wer in Stufe 8 nach Befunden sucht, die mehrfach vorkamen, findet zu #6 und #7 nichts. Die Bedingung von Stufe 7 „alle Reviews ohne 🔴“ ist für diese beiden PRs nur behauptet, nicht belegt. Vorschlag: genau so in der Retro schreiben (z. B. „bei #6 und #7 nur als Häkchen dokumentiert, bei #4 nur im Protokoll T-12“) und in Stufe 8 als Lernpunkt aufnehmen. | XII, XIV |
| 2 | 🟡 | `specs/04-fundament/tasks.md:43` gegen `retro.md:35` | AK-29 wird an zwei Stellen verschieden bewertet. Die Retro sieht eine Abweichung (⚠️): Für GitHub Actions, `docker` und `docker-compose` gab es noch keinen „ersten Update-PR“, wie ihn Spec (`spec.md:73`) und Plan (`plan.md:210`) als Nachweis verlangen. In `tasks.md` steht derselbe Nachweis dagegen je Ökosystem auf ✅ („Läufe ohne Updates“), und T-22 hat den Status ✅. Für den Satz „Der erste echte PR dieser Ökosysteme wird nachgetragen“ gibt es außerdem weder eine Task noch ein Issue. | Wer `tasks.md` liest, hält AK-29 für vollständig belegt. Kommt der erste PR für GitHub Actions oder Docker, hält niemand ihn fest, weil nichts darauf verweist. Vorschlag: in `tasks.md` bei T-22 auf die Abweichung in der Retro verweisen, oder den Nachtrag als Issue bzw. offenen Punkt anlegen. | II, XII |
| 3 | ⚪ | `specs/04-fundament/retro.md:8` | Abgenommen wird auf `main` statt auf int. Das ist sachlich begründet (ADR 0009, `spec.md:96`). Das Gate in `docs/prozess/sdd-ablauf.md` (Stufe 7: „Abnahme auf int“) ist aber nicht angepasst. In der Retro steht das als offener Punkt (Zeile 65), das reicht für jetzt. | Das nächste Vorhaben vor Phase S steht vor derselben Lücke im Prozess. | I |

### Checkliste
| # | Prüfpunkt | ✅/❌/– | Anmerkung |
|---|---|---|---|
| 1 | Auftrag | ✅ | Der PR enthält nur die Abnahme für Stufe 7 sowie Zeiten, Changelog und Kopfzeile. Er greift nicht in Stufe 8 vor: Die Abschnitte dafür sind ausdrücklich als „Folgt in Stufe 8“ markiert. |
| 2 | Korrektheit | ✅ | Run-IDs, Commit, Testzahlen, PR-Nummern und Dateiverweise stimmen. Ungenau sind nur die Aussagen in Befund 1 und 2. |
| 3 | Tests | ✅ | 100/100 lokal, CI grün. Kein Test wurde verändert. |
| 4 | Eingaben | – | Nur Doku |
| 5 | Sicherheit | ✅ | Keine Secrets, kein Registrar, nichts aus der Liste „Öffentlich vs. intern“. Den Hinweis auf Commit `83e43b6` und die Ref von PR #1 gab es schon vorher öffentlich (T-11). Der Secret- und Öffentlich-Scan ist grün. |
| 6 | Datenschutz | ✅ | Keine personenbezogenen Daten |
| 7 | Mensch im Loop | ✅ | Abnahme durch den Inhaber ist ausdrücklich offen (`retro.md:42`) |
| 8 | Zerstörerisches | – | Keines |
| 9 | Code-Qualität | – | Kein Code |
| 10 | Abhängigkeiten | – | Keine neuen |
| 11 | Fehler | – | Nicht betroffen |
| 12 | Doku | ✅ | Retro, tasks-Kopf, Zeiten und Changelog sind im selben PR. Zwei Aussagen sind ungenau (Befunde 1, 2). |

### Zusammenfassung für den Inhaber
Dieser PR schreibt die Abnahme von Phase 1 auf: Für jedes Akzeptanzkriterium steht in der Retro, womit es nachgewiesen ist. Ich habe nachgeprüft, dass die genannten Tests, CI-Läufe und Dokumente wirklich existieren und grün sind. Bei 16 von 17 Kriterien stimmt das. Offen ist die Frage, ob bei den automatischen Updates (AK-29) ein Lauf ohne Update als Nachweis reicht. Das steht in der Retro ehrlich als Abweichung, in der Aufgabenliste dagegen als erledigt. Zwei Formulierungen solltest du vor deiner Abnahme geraderücken lassen: welche frühen kleinen PRs nur ein Häkchen statt eines Reviews haben, und wo der Nachtrag zu AK-29 festgehalten wird. Ausprobieren musst du nichts. Prüfe beim Lesen der Retro, ob du die Abweichungen bei AK-15, AK-25 und AK-29 so annehmen willst, und trag dann das Abnahmedatum ein.

---

## Umsetzung der Befunde (Nachtrag)

1. 🟡 Teilweise zutreffend. Bei #6 und #7 steht der Review als **Kommentar** im PR, nicht in der Beschreibung: #6 mit zwei 🟡 (im PR behoben), #7 ohne Befunde (per `gh pr view --comments` geprüft). Bei #4 belegt ihn nur das Protokoll T-12. Die Retro sagt das jetzt genau so, und der verlorene Wortlaut bei #4 steht als Lernpunkt für Stufe 8 drin.
2. 🟡 Bei T-22 in `tasks.md` steht jetzt der Verweis auf die Abweichung (`retro.md`, AK-29 ⚠️). Der Nachtrag des ersten echten PR für GitHub Actions, `docker` und `docker-compose` ist ein offener Punkt in den Nachträgen von `tasks.md`, und die Retro verweist darauf.
3. ⚪ Steht schon als offener Punkt in der Retro, jetzt mit Hinweis auf das nicht angepasste Gate in `sdd-ablauf.md`. Eine Änderung am Prozess folgt in Stufe 8 (Entscheidung des Inhabers).
