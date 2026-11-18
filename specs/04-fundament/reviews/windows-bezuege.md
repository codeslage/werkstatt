## Review: PR #39 (feature/windows-bezuege) · Vorhaben 04-fundament · Tasks T-31 (Folgepunkt), Klasse M

Ergebnis: ✅ mergebar (keine offenen 🔴; der PR ändert `docs/prozess/governance.md`, deshalb mergt laut `code-review.md` und `governance.md` der Inhaber)

### Befunde
| # | Grad | Datei:Zeile | Befund | Fehlerfall | Artikel |
|---|---|---|---|---|---|
| 1 | 🟡 | `specs/04-fundament/spec.md:133`, `specs/04-fundament/plan.md:173`, `specs/04-fundament/tasks.md:64`, `docs/runbooks/dns-bestand.md:4` und `:44` | Der PR stellt den lokalen Pfad des internen Repos in `governance.md` und `02-architektur.md` auf `~/Developer/codeslage/internal` um. Diese gültigen Dokumente verweisen aber weiter auf `codeslage-internal/betrieb/konten.md`, also auf den alten Ordnernamen unter Windows. | Eine neue Sitzung folgt dem Runbook `dns-bestand.md` (Schritt 2, „Besonderheiten des Registrars“) und sucht auf dem Mac `codeslage-internal/betrieb/konten.md`. Diesen Ordner gibt es dort nicht, er heißt `~/Developer/codeslage/internal`. Damit tritt genau das Problem auf, das der PR beheben will („veraltete Pfade führen neue Sitzungen in die Irre“). Vorschlag: einheitlich `codeslage/internal` (`betrieb/konten.md`) schreiben. Die Protokolle bleiben als Historie unverändert. | XII |
| 2 | 🟡 | `CHANGELOG.md:20` | Der neue Eintrag endet mit dem Platzhalter `(#PR)` statt `(#39)`. Alle anderen Einträge nennen die echte PR-Nummer. | Nach dem Merge führt der Changelog-Eintrag zu keinem PR. Die Retro und jeder, der den Eintrag nachverfolgen will, finden die Änderung nicht über die Nummer. | XII |
| 3 | ⚪ | `.gitattributes:1` | Der Kommentar lautet weiter „Einheitliche Zeilenenden zwischen Windows und macOS (02-architektur.md, A1)“. A1 begründet die Datei nach diesem PR aber mit „gleiche Zeilenenden (LF) auf jedem Rechner und in der CI“. | Kommentar und Architektur widersprechen sich leicht. Das hat keine Wirkung auf das Verhalten. Der PR nennt in seiner Suche nur Specs und `docs/prozess/`, deshalb fiel die Stelle nicht auf. | XII |
| 4 | ⚪ | `specs/04-fundament/spec.md:126` | In der neuen Gegenmaßnahme zum Risiko fehlt ein Teil, der in `plan.md:241` noch steht: „Container nur für DB und Test-App, Entwicklung nativ“. | Spec und Plan beschreiben die Gegenmaßnahme unterschiedlich ausführlich. Inhaltlich widersprechen sie sich nicht. | – |

### Checkliste
| # | Prüfpunkt | ✅/❌/– | Anmerkung |
|---|---|---|---|
| 1 | Auftrag | ✅ | Alle Änderungen gehen auf Plan v1.2 und den Entscheid im Protokoll von `tasks.md:124` zurück („Risiko WSL2 ersetzt durch arm64 lokal/amd64 in der CI“). Der PR ändert keine AKs und nichts darüber hinaus. Der Zeiteintrag in `zeiten.md` läuft unter T-31. |
| 2 | Korrektheit | ✅ | Das neue Risiko in der Spec passt zu `plan.md:241`. Die Basis-Images sind per Digest gepinnt (`apps/status/Dockerfile`, `compose.yaml:9`). Den alten Pfad tauscht der PR nicht überall aus (Befund 1). |
| 3 | Tests | – | Keine Code-Änderung. Lokal grün: `spec-check`, `prettier --check`, `eslint` und `pnpm test` (100/100). In der CI sind alle Jobs grün außer „Image (Compose + Smoke)“, der zum Zeitpunkt des Reviews noch lief. |
| 4 | Eingaben | – | Nur Text. |
| 5 | Sicherheit | ✅ | Keine Secrets. Der neue Pfad `~/Developer/codeslage/internal` enthält keinen Benutzernamen und nichts aus der Liste „Öffentlich vs. intern“. Der Secret- und Öffentlich-Scan ist grün. |
| 6 | Datenschutz | – | Nicht betroffen. |
| 7 | Mensch im Loop | – | Nicht betroffen. |
| 8 | Zerstörerisches | – | Nicht betroffen. |
| 9 | Code-Qualität | – | Kein Code. |
| 10 | Abhängigkeiten | – | Keine neuen. |
| 11 | Fehler | – | Nicht betroffen. |
| 12 | Doku | ❌ | Die Köpfe von Spec, Vision und Governance haben einen neuen Stand, und es gibt einen Changelog-Eintrag. Es bleiben aber veraltete Pfadverweise in gültigen Dokumenten (Befund 1), und im Changelog steht ein Platzhalter (Befund 2). Beides ist 🟡, deshalb blockiert es den Merge nicht. |

### Zusammenfassung für den Inhaber
Die Änderung räumt Texte auf. Spec 04, Vision, Architektur und Governance sprechen jetzt vom Mac statt von Windows, und der lokale Pfad zum internen Repo ist der neue Mac-Pfad. Am Verhalten ändert sich nichts, das Risiko ist gering. Zwei Kleinigkeiten fehlen noch. An einigen Stellen steht weiter der alte Ordnername `codeslage-internal`, vor allem im DNS-Runbook. Und im Changelog steht noch `#PR` statt der Nummer 39. Eine Vorschau gibt es hier nicht. Lies stattdessen die geänderte Zeile in `governance.md` und gib sie frei, denn sie gehört zu den Prozessdokumenten und braucht deine Freigabe. Am Rande: Im Ordner `~/Developer/codeslage/internal` liegt auf dem Mac zurzeit nur der Git-Ordner `.git`, aber keine Dateien. Die Datei `betrieb/konten.md`, auf die die Dokumente verweisen, fehlt dort also. Das liegt nicht an diesem PR, sollte aber geprüft werden.

---

## Umsetzung der Befunde (Nachtrag)

1. 🟡 `codeslage-internal` → `codeslage/internal` (`betrieb/konten.md`) in `spec.md`, `plan.md`, `tasks.md` (T-33) und `docs/runbooks/dns-bestand.md` (Kopf und Schritt 2). Historische Stellen bleiben: `plan-v1-server.md`, Reviews, Protokolle, `zeiten.md`.
2. 🟡 Changelog nennt jetzt #39 und die zusätzlichen Dateien.
3. ⚪ Kommentar in `.gitattributes` an A1 angeglichen.
4. ⚪ Gegenmaßnahme in der Spec um „Container nur für DB und Test-App, Entwicklung nativ“ ergänzt, wie in `plan.md`.
- Randnotiz (leeres `internal` auf dem Mac) an den Inhaber weitergegeben.
