## Review: PR #42 (feature/t27-dependabot-docker) · Vorhaben 04-fundament · Tasks T-27, T-22

Ergebnis: ✅ mergebar

### Befunde
| # | Grad | Datei:Zeile | Befund | Fehlerfall | Artikel |
|---|---|---|---|---|---|
| 1 | ⚪ Hinweis | specs/04-fundament/tasks.md (Zeile T-27, Testspalte) und docs/protokolle/2026-11-18-t-27-t-29-compose.md:15 | AK-29 verlangt in spec.md:73 als Nachweis einen „ersten Update-PR“ (plan.md:210: „erster Dependabot-PR je Ökosystem“). Als Nachweis dient hier ein Lauf ohne PR. Das entspricht dem schon akzeptierten Vorgehen bei `github-actions` in T-22, weicht aber vom Wortlaut des AK ab. Ein Lauf ohne Updates belegt, dass Dependabot die Dateien findet und die Images prüft. Dass tatsächlich ein PR entsteht, belegt er nicht. | Beispiel: Ein Digest wird neu veröffentlicht und Dependabot kann den PR nicht anlegen. Das zeigt dieser Nachweis nicht. Vorschlag: AK-29 oder die Plan-Zeile bei Gelegenheit auf „erster Lauf oder PR“ angleichen, oder den ersten echten Docker-PR später im Protokoll nachtragen. Kein Merge-Hindernis. | II |

Weitere Befunde gibt es nicht.

### Checkliste
| # | Prüfpunkt | ✅/❌/– | Anmerkung |
|---|---|---|---|
| 1 | Auftrag | ✅ | Der Diff schließt T-27 ab: Status ✅, Ist 0,25, Testspalte ergänzt. Er ergänzt die Testspalte von T-22 und trägt Protokoll, Zeiten und Changelog nach. Die übrigen Zeilen in tasks.md ändern sich nur durch die Prettier-Neuformatierung der breiteren Spalte, der Inhalt ist gleich. |
| 2 | Korrektheit | ✅ | Die Angaben stimmen mit GitHub überein. Ich habe sie selbst mit `gh run list` und `gh run view --log` geprüft. Lauf 44351092323 („docker in /apps/*“) und Lauf 44351088649 („docker_compose in /.“) endeten am 2026-11-18 um 16:46 UTC (= 17:46 MEZ) mit `success`. Die Logs zeigen „No update needed for node 24-alpine“ und „No update needed for postgres 17-alpine“. Die Ausnahmen für Major-Versionen kamen dabei an. Ist-Zeit für T-27: 1 + 3 + 7 = 11 Minuten, gerundet 0,25 h. Das entspricht der Methode in zeiten.md. |
| 3 | Tests | ✅ | Kein Code geändert, kein Test angefasst. Der Nachweis ist ein manueller, protokollierter Test. Zum Wortlaut von AK-29 siehe Hinweis 1. |
| 4 | Eingaben | – | Keine Systemgrenze berührt. |
| 5 | Sicherheit | ✅ | Keine Secrets. Keine IPs, Kontakt- oder Kontodaten. Der Secret- und Öffentlich-Scan lief zum Zeitpunkt des Reviews noch. |
| 6 | Datenschutz | – | Keine personenbezogenen Daten. |
| 7 | Mensch im Loop | – | Nicht relevant. |
| 8 | Zerstörerisches | – | Keine. |
| 9 | Code-Qualität | – | Nur Doku. |
| 10 | Abhängigkeiten | – | Keine neuen. |
| 11 | Fehler | – | Nicht relevant. |
| 12 | Doku | ✅ | tasks.md, Protokoll, zeiten.md und CHANGELOG im selben PR. Der Nachtrag im Protokoll löst die frühere Angabe „T-27 bleibt bis dahin 🔄“ sauber auf. |

CI zum Zeitpunkt des Reviews: Format, Spec-Check, Typecheck, Knip, Modulgrenzen und Repo-Einstellungen waren grün. Lint, Secret- und Öffentlich-Scan, Image und Infra liefen noch. Gemergt werden darf erst, wenn alle Checks grün sind. Lokal konnte ich Prettier nicht ausführen (`pnpm` nicht im PATH der Review-Shell). Die CI meldet Format als grün.

### Zusammenfassung für den Inhaber
Die Änderung trägt nur einen Nachweis nach. Dependabot hat am 18.11. die Basis-Images der Status-App (Node) und der lokalen Datenbank (Postgres) zum ersten Mal geprüft und nichts zum Aktualisieren gefunden. Damit ist T-27 abgeschlossen. Ich habe beide Läufe und ihre Protokolle auf GitHub selbst geprüft, die Angaben stimmen. Ein Risiko gibt es nicht, weil kein Code geändert wird. Offen bleibt eine Kleinigkeit: Die Spec spricht von einem „ersten Update-PR“, belegt ist bisher nur ein Lauf ohne PR. Wenn Sie wollen, sehen Sie unter Actions → „Dependabot Updates“ die beiden Läufe von 17:46 Uhr nach. Ansonsten müssen Sie nichts ausprobieren.

---

## Umsetzung der Befunde (Nachtrag)

1. ⚪ Ins Protokoll T-27–T-29 aufgenommen: Der erste echte Docker-PR von Dependabot wird dort nachgetragen, sobald er kommt. Der Wortlaut von AK-29 („erster Update-PR“ gegenüber „Lauf ohne Updates“) steht schon als Retro-Punkt zur Auslegung bei `github-actions` an und wird dort für alle Ökosysteme zusammen geklärt.
