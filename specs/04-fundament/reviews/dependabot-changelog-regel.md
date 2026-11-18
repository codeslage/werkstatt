## Review: PR #40 (feature/dependabot-changelog-regel) · Vorhaben 04-fundament · Tasks T-22 (Nachtrag 2026-11-18)

Ergebnis: ✅ mergebar (kein 🔴). Weil `docs/prozess/` geändert wird, muss der Inhaber selbst mergen (`governance.md`, `code-review.md` Merge-Regel).

### Befunde
| # | Grad | Datei:Zeile | Befund | Fehlerfall | Artikel |
|---|---|---|---|---|---|
| 1 | 🟡 | `CHANGELOG.md:5` | Die Pflege-Regel im Changelog-Kopf ist nicht angepasst. Dort steht weiter: „Bei Klasse M ist ein Eintrag … im selben PR Pflicht“, ohne die neue Ausnahme für Dependabot. Damit widersprechen sich zwei Dokumente im selben PR. | Eine Sitzung liest nur den Changelog-Kopf. Sie hält einen Dependabot-PR ohne Eintrag für einen Regelverstoß oder verlangt einen Eintrag im Dependabot-PR selbst. | XII |
| 2 | 🟡 | `docs/prozess/aenderungsklassen.md:32` gegen `.claude/commands/release.md:10,16` und `docs/prozess/release.md:56,61` | Die neue Regel nennt „spätestens beim `/release`“ als letzte Frist. Der Befehl `/release` und `release.md` enthalten aber keinen Schritt, der fehlende Dependabot-Sammeleinträge nachträgt. Die Befehle sollen das Prozessdokument umsetzen (`governance.md`, Abschnitt „Änderungen“). | Zwischen dem letzten eigenen PR und dem Release werden Dependabot-PRs gemergt. Die `/release`-Sitzung folgt ihren Schritten („Changelog-Entwurf zeigen“, „Changelog finalisieren“) und schließt den Release-Abschnitt ohne diese Updates ab. Die Frist läuft dann ins Leere. | XII |
| 3 | ⚪ | `docs/prozess/aenderungsklassen.md:31` | Als Ausnahme von M nennt der Abschnitt nur „Infrastruktur“ (Beispiel OpenTofu). Die allgemeine Untergrenze in Zeile 23 nennt auch „Sicherheit“. `dependabot.yml` aktualisiert außerdem `github-actions`, `docker` und `docker-compose`. | Dependabot hebt eine GitHub Action an, die im Secret-Scan-Job mit Secrets läuft. Eine Sitzung liest nur den neuen Abschnitt, stuft den PR als M ein und lässt ihn per Auto-Merge ohne Inhaber durch. Vorschlag: „Berührt er Infrastruktur oder Sicherheit (Einstufung Nr. 3) …“ oder ein Verweis auf die Untergrenzen. | I, VII |
| 4 | ⚪ | `specs/04-fundament/tasks.md:122` | Der Nachtrag „in `aenderungsklassen.md` ergänzt (#40, Merge durch den Inhaber)“ klingt schon nach Erledigung, obwohl der Merge noch aussteht. | Wird #40 abgelehnt oder geändert, steht in `tasks.md` ein falscher Stand. | XII |

### Checkliste
| # | Prüfpunkt | ✅/❌/– | Anmerkung |
|---|---|---|---|
| 1 | Auftrag | ✅ | Setzt den Nachtrag T-22 vom 2026-11-18 um, dazu den Befund aus `reviews/dependabot-21-26.md` (Provider sind K). Der Tausch „Renovate“ → „Dependabot“ ist durch ADR 0008 gedeckt. Nichts geht darüber hinaus. |
| 2 | Korrektheit | ✅ | Die Regel stimmt mit der K-Zeile der Tabelle und mit der bisherigen Praxis (#21 bis #26) überein. Sie hat eine inhaltliche Lücke (Befund 3). |
| 3 | Tests | – | Kein Code. `spec-check` und `prettier --check` laufen lokal grün. In der CI sind Spec-Check, Lint, Typecheck, Knip, Modulgrenzen, Secret-Scan, Infra und Repo-Einstellungen grün. Format und Image liefen beim Review noch. |
| 4 | Eingaben | – | Keine Systemgrenze betroffen. |
| 5 | Sicherheit | ✅ | Keine Secrets und nichts aus der Liste „Öffentlich vs. intern“. |
| 6 | Datenschutz | – | Keine personenbezogenen Daten. |
| 7 | Mensch im Loop | ✅ | Bei Infrastruktur ist die Freigabe des Inhabers festgeschrieben. Die Prozessänderung wird vom Inhaber gemergt. |
| 8 | Zerstörerisches | – | Nichts. |
| 9 | Code-Qualität | – | Kein Code. |
| 10 | Abhängigkeiten | – | Keine neuen. |
| 11 | Fehler | – | Nicht relevant. |
| 12 | Doku | ❌ (🟡) | Changelog, Tasks und Zeiten sind gepflegt, auch der Stand im Kopf von `aenderungsklassen.md`. Die Pflege-Regel im `CHANGELOG.md` (Befund 1) und der `/release`-Ablauf (Befund 2) sind aber nicht angepasst. |

### Zusammenfassung für den Inhaber
Die Änderung schreibt fest, wie mit den automatischen Update-PRs von Dependabot umgegangen wird. Normale Updates gelten als Kleinigkeit. Updates an der Infrastruktur brauchen eine Change-Seite, einen `tofu plan` und deine Freigabe. Weil Dependabot keinen Changelog schreiben kann, trägt Claude solche Updates gesammelt im nächsten eigenen PR nach. Ein Risiko für den Betrieb gibt es nicht, es ändert sich nur Text. Zwei Stellen sind aber noch nicht nachgezogen. Der Changelog selbst nennt die neue Ausnahme nicht. Und der Release-Ablauf hat keinen Schritt, der fehlende Sammeleinträge nachholt, obwohl die Regel den Release als letzte Frist nennt. Eine Vorschau gibt es nicht. Prüf vor deinem Merge, ob Updates an GitHub Actions (die in der CI mit Secrets laufen) wie Infrastruktur behandelt werden sollen.

---

## Umsetzung der Befunde (Nachtrag)

1. 🟡 Pflege-Regel im Kopf von `CHANGELOG.md` um die Dependabot-Ausnahme ergänzt.
2. 🟡 Schritt ergänzt in `docs/prozess/release.md` (vor Freigabe 1) und `.claude/commands/release.md` (Schritt 1): gemergte Dependabot-Updates ohne Eintrag als Sammeleintrag nachtragen.
3. ⚪ Ausnahme nennt jetzt Infrastruktur **oder Sicherheit** mit Verweis auf die Untergrenzen. Ob Updates von GitHub Actions als „Sicherheit“ gelten (und damit K sind), entscheidet der Inhaber vor dem Merge.
4. ⚪ Nachtrag in `tasks.md` heißt jetzt „vorgeschlagen (#40, Merge durch den Inhaber offen)“.
