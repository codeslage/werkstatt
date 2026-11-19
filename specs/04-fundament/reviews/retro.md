## Review: PR #45 (feature/retro-04) · Vorhaben 04-fundament · SDD-Stufe 8 (Retro)

Ergebnis: ✅ mergebar (kein 🔴; ein 🟡 sollte vor dem Merge behoben werden)

Geprüft wurde der committete Stand `cb70392`. Im Arbeitsverzeichnis gibt es eine nicht committete Änderung an `specs/04-fundament/zeiten.md`: Die letzte Retro-Zeile wurde von „09:58 / 0:18“ auf „09:52 / 0:12“ geändert. Diese Änderung ist nicht Teil des PR.

### Befunde
| # | Grad | Datei:Zeile | Befund | Fehlerfall | Artikel |
|---|---|---|---|---|---|
| 1 | 🟡 | `specs/04-fundament/retro.md:48`, `specs/03-roadmap.md:18`, `docs/content/2026-11-19-phase-1-fundament.md:8,16,17,47`, `CHANGELOG.md:13` gegen `specs/04-fundament/zeiten.md:87-88` | Das Ist „13,8 h (827 min laut `zeiten.md`)“ enthält nur die Zeit bis einschließlich Stufe 7. Derselbe PR fügt in `zeiten.md` zwei Retro-Zeilen hinzu (0:15 + 0:18). Damit ergibt die Tabelle jetzt 860 min, also 14,3 h. In der Roadmap steht als Ende 2026-11-18, die Phase schließt aber erst mit Stufe 8 am 2026-11-19 ab (so steht es auch im Changelog: „Phase 1 abgeschlossen (Stufe 8)“). Nirgends steht, dass Stufe 8 nicht mitgezählt ist. | Wer die Spalte Dauer in `zeiten.md` nachrechnet, so wie es die Methode in `zeiten.md:11` für die Retro vorsieht, kommt auf 860 min statt der genannten 827 min. Die öffentliche Zahl für die Case Study („13,8 h“) passt dann nicht zur eigenen Quelle. Behebung: entweder die Retro-Zeit einrechnen (Ist ≈ 14,3 h, Ende 2026-11-19) oder überall ausdrücklich „bis Stufe 7 (Abnahme)“ dazuschreiben. Danach Retro, Roadmap, Content-Notiz und Changelog gleich halten. | XIV, XII |
| 2 | ⚪ | `specs/04-fundament/retro.md:83` | In der Spalte Umsetzung steht „im selben PR, Regel in `sdd-ablauf.md`“. Gemeint ist der folgende Prozess-PR aus der Zeile darüber, nicht PR #45. Das steht aber nur in der PR-Beschreibung. | Wer später nur `retro.md` liest, nimmt an, dass PR #45 `sdd-ablauf.md` geändert hat, und sucht die Regel dort vergeblich. Besser: „im selben Prozess-PR wie oben“. | XII |
| 3 | ⚪ | `specs/04-fundament/spec.md:3` | Laut Kopfzeile ist die Spec „Umgesetzt am 2026-11-18“. Laut `sdd-ablauf.md:17` wird dieser Status aber erst in Stufe 8 gesetzt, und Stufe 8 endet am 2026-11-19. Das hängt mit Befund 1 zusammen. | Abnahmedatum und Umsetzungsdatum fallen in den Dokumenten zusammen, das Ende der Retro taucht nirgends auf. Ein Datum festlegen und überall gleich verwenden. | XII |

Nachgeprüfte Zahlen, alle stimmen mit dem Repo überein: 42 gemergte PRs, davon 6 von Dependabot (per `gh`). 35 Review-Dateien mit 52 🟡 und 7 🔴 in den Befundtabellen: 3 in T-11 (Negativtest), dazu je einer in T-12, T-15, T-23 und T-38, alle mit Folge-Reviews bzw. Freigabe. 103 Unit- und 22 Infra-Tests laufen lokal grün. 10 ADRs, 25 Protokolle, Arbeit an 6 Tagen. Das Ist auf Viertelstunden in `tasks.md` ergibt 16,5 h, das Soll 50 h. 13,8 h sind 27,6 % von 50 h („gut ein Viertel“ passt).

### Checkliste
| # | Prüfpunkt | ✅/❌/– | Anmerkung |
|---|---|---|---|
| 1 | Auftrag | ✅ | Alle fünf Schritte aus `.claude/commands/sdd-retro.md` sind erfüllt: Retro, Roadmap-Übertrag, Content-Notiz, Vorschläge mit Entscheidung des Inhabers, Status „Umgesetzt“. Die Prozessänderungen kommen wie vorgesehen als eigener PR, nichts geht darüber hinaus. |
| 2 | Korrektheit | ❌ | Die Zahlen stimmen bis auf die Zeitsumme, siehe Befund 1 (🟡, kein Blocker). |
| 3 | Tests | – | Reine Doku-Änderung. `pnpm test` (103) und `pnpm test:infra` (22) sind grün, kein Test wurde geändert. |
| 4 | Eingaben | – | Keine Systemgrenze betroffen. |
| 5 | Sicherheit | ✅ | Keine Secrets. Der Registrar wird nicht beim Namen genannt, Beträge stehen nur im internen Repo, keine Konten oder Adressen. Der Secret- und Öffentlich-Scan ist grün. |
| 6 | Datenschutz | ✅ | Keine personenbezogenen Daten. Die Zitate stammen vom Inhaber selbst und nennen keinen Namen. |
| 7 | Mensch im Loop | ✅ | Die Content-Notiz ist ausdrücklich Rohmaterial. Veröffentlicht wird sie erst später nach Freigabe. |
| 8 | Zerstörerisches | – | Nichts dergleichen. |
| 9 | Code-Qualität | – | Kein Code geändert. |
| 10 | Abhängigkeiten | – | Keine neuen Abhängigkeiten. |
| 11 | Fehler | – | Nicht relevant. |
| 12 | Doku | ✅ | Retro, Roadmap mit Stand im Kopf, Spec-Status, Tasks-Kopf, Zeiten und Changelog sind im selben PR angepasst. Spec-Check, Prettier, cspell und Lint laufen lokal grün, alle 11 CI-Checks auf PR #45 sind grün. |

### Zusammenfassung für den Inhaber
Mit dieser Änderung ist Phase 1 schriftlich abgeschlossen. Darin stehen die Rückschau mit Soll und Ist, was gut und was schlecht lief, Ihre Entscheidungen zu den vier Verbesserungsvorschlägen, eine Notiz mit Material für Case Study und Talk sowie der Eintrag in der Roadmap. Für den Betrieb besteht kein Risiko, weil nur Dokumente geändert werden. Bei der Zeit gibt es eine kleine Unstimmigkeit: Die öffentliche Zahl von 13,8 Stunden enthält die Zeit für die Retro selbst nicht, obwohl sie im selben Zeitprotokoll steht. Mit der Retro sind es etwa 14,3 Stunden. Entscheiden Sie, ob die Retro mitzählt. Danach sollten Retro, Roadmap und Content-Notiz dieselbe Zahl und dasselbe Enddatum nennen. Lesen Sie die Content-Notiz am besten einmal ganz durch und prüfen Sie, ob Zitate und Darstellung so öffentlich stehen dürfen.

---

## Umsetzung der Befunde (Nachtrag)

1. 🟡 Die Retro-Zeit zählt mit. Neues Ist **≈ 14,4 h**: 827 min bis zur Abnahme, dazu die Retro mit 0:15 + 0:12 + 0:05 (Review-Nacharbeit) und 0:03 für den Prozess-PR #46, zusammen 862 min (nach Korrektur der Uhrzeiten in #46: 861 min, weiterhin ≈ 14,4 h). Retro, Roadmap, Content-Notiz und Changelog nennen jetzt dieselbe Zahl, dazu die 13,8 h bis zur Abnahme. Ende der Phase ist der 2026-11-19, gearbeitet wurde an 7 Tagen.
2. ⚪ „im selben Prozess-PR wie oben (#46)“.
3. ⚪ `spec.md`: „Umgesetzt am 2026-11-19 (abgenommen am 2026-11-18)“.
- Die nicht committete Korrektur der Zeitzeile (09:52 / 0:12) ist jetzt Teil des PR.
- Die Content-Notiz prüft der Inhaber vor jeder Veröffentlichung (Constitution IX). Sie ist Rohmaterial.
