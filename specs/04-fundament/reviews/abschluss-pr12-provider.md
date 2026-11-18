## Review: PR #38 (feature/abschluss-pr12-provider) · Vorhaben 04-fundament · Tasks T-24, T-30, T-37 · Klasse M

Geprüfter Commit: `bcba50a` (1 Commit gegen `main`, 5 Dateien, nur Doku)

Ergebnis: ✅ mergebar (keine 🔴). Die zwei 🟡 im Changelog sollten im selben PR korrigiert werden, sie sind jeweils eine Zeile.

### Befunde
| # | Grad | Datei:Zeile | Befund | Fehlerfall | Artikel |
|---|---|---|---|---|---|
| 1 | 🟡 | `CHANGELOG.md:21` | Der Eintrag lautet „Cloudflare-Provider 5.28.1 → 5.29.0 in `bootstrap` (#21) und `live` (#22), Klasse K: `tofu plan` ohne Änderungen“. Das stimmt nur für `live`. Laut eigenem Protokoll (`docs/protokolle/2026-11-18-cloudflare-provider-5-29.md:7`) lief in `bootstrap` kein `plan`, nur `init -backend=false` und `validate`, weil der `plan` dort mit 401 scheitert. | Wer beim nächsten `/release` den Changelog liest, glaubt, dass beide Wurzeln gegen den echten State geprüft wurden. Für den State-Bucket stimmt das nicht. Genau diese Lücke hatte `reviews/dependabot-21-26.md`, Befund 3, benannt. Vorschlag: „`live`: `tofu plan` ohne Änderungen; `bootstrap`: nur `validate` (plan 401, siehe Protokoll)“. | XII |
| 2 | 🟡 | `CHANGELOG.md:13` | Der Eintrag ordnet #36 und #37 „Phase 1, Schritt 5 (Image)“ zu. Image, Compose und Runbook sind laut `plan.md:159` und `tasks.md:46` aber „Schritt 3 – Lokale Umgebung & Images“. Schritt 5 heißt „Alarme & Abschluss“. | Beim Release und in der Retro sieht es so aus, als sei Schritt 5 schon begonnen, während Schritt 3 noch offen ist (T-24, T-27 und T-31 stehen auf 🔄). | XII |
| 3 | 🟡 | `docs/protokolle/2026-11-18-cloudflare-provider-5-29.md:3`, `CHANGELOG.md:21` | #21 und #22 sind als „Klasse K“ dokumentiert. Klasse K verlangt aber nach `aenderungsklassen.md` (Tabelle, Zeile K) eine Change-Seite `changes/JJJJ-MM-TT-name.md` mit `tofu plan`-Auszug und Freigabe des Inhabers **auf der Change-Seite**. In `changes/` liegt nur `2026-11-10-claude-md-einstufung-branch.md`. Die Freigabe steht nur als „im Chat erteilt“ im Protokoll. | Die Doku behauptet einen Prozess, der in dieser Form nicht stattfand. Bei einer späteren Prüfung (Retro oder Verify) gibt es für die Infra-Änderung keine Change-Seite und keine nachlesbare Freigabe. Vorschlag: Change-Seite nachträglich anlegen (Auszug aus dem Protokoll, Freigabe vom 2026-11-18, Hinweis auf den fehlenden Bootstrap-Plan). Oder die Abweichung als Nachtrag in `tasks.md` festhalten und vom Inhaber bestätigen lassen. | I, XII |
| 4 | ⚪ | `specs/04-fundament/tasks.md:123` | Der Nachtrag zu T-37 steht auf „erledigt“. Dabei hieß der eigene Vorschlag „vor #21 lokal `tofu plan` in `infra/tofu/bootstrap`“, und das wurde nicht erfüllt. Die Abweichung ist in der Statuszelle genannt. Das Runbook (`docs/runbooks/tofu-state.md:56`) beschreibt aber einen Weg: Recht vorübergehend vergeben, wieder entziehen, beides protokollieren. Dieser Weg wurde nicht gegangen und auch nicht begründet verworfen. | Liest 5.29.0 `cloudflare_r2_bucket` anders, fällt das erst beim nächsten Bootstrap-Plan auf. Das Risiko ist gering (`prevent_destroy`, Release Notes ohne Bezug), aber offen. Vorschlag: im Status kurz begründen, warum der Runbook-Weg nicht genutzt wurde, oder ein Folge-Item anlegen. | X |

### Checkliste
| # | Prüfpunkt | ✅/❌/– | Anmerkung |
|---|---|---|---|
| 1 | Auftrag | ✅ | Alle Änderungen gehören zu T-24 (Status Telemetrie), T-30 (✅, Ist), T-37 (Merge #21/#22, Protokoll, Nachtrag) und zur Changelog-Pflicht. Nichts darüber hinaus. |
| 2 | Korrektheit | ❌ | Die Inhalte habe ich gegen die Quellen geprüft. T-30: Ist 2 h passt zu `zeiten.md` (0:03 + 1:55 + 0:03 = 2:01, auf die Viertelstunde gerundet). Die Wartezeit des Inhabers zählt laut Methode in `zeiten.md` mit und ist in der Bemerkung genannt. T-37: Ist 0,25 passt zur Summe 0:21. Commit-SHAs `3b378de`, `105e0e9` und `f99c060` stimmen mit `git log main` überein. Falsch sind die Angaben in den Befunden 1 und 2. |
| 3 | Tests | ✅ | Keine Code- oder Teständerung. Lokal: `pnpm test` 100/100, `spec-check` ohne Fehler, `prettier --check .` grün. CI auf dem PR: alle Checks grün, nur „Image (Compose + Smoke)“ lief bei der Prüfung noch. Vor dem Merge muss er grün sein. |
| 4 | Eingaben | – | Keine Systemgrenzen betroffen. |
| 5 | Sicherheit | ✅ | Keine Secrets, Tokens, IPs oder Kontonamen. Der Pfad `~/Library/Group Containers/group.com.docker/settings-store.json` ist ein Standardpfad ohne Personenbezug. Der Secret- und Öffentlich-Scan ist grün. |
| 6 | Datenschutz | – | Keine personenbezogenen Daten. |
| 7 | Mensch im Loop | ✅ | Die offene Telemetrie-Prüfung bleibt beim Inhaber (T-24 🔄, nachvollziehbar begründet). Die Freigabe für #21/#22 ist dokumentiert, aber nur im Chat (Befund 3). |
| 8 | Zerstörerisches | – | Keine zerstörerische Aktion im PR. Die verworfene lokale Lockfile-Änderung betraf nur das Arbeitsverzeichnis. |
| 9 | Code-Qualität | – | Kein Code. |
| 10 | Abhängigkeiten | – | Keine neuen Abhängigkeiten in diesem PR. Das Provider-Update ist bereits über #21/#22 gemergt und wurde in `reviews/dependabot-21-26.md` geprüft. |
| 11 | Fehler | – | Kein Laufzeit-Code. |
| 12 | Doku | ❌ | Changelog-Einträge sind vorhanden, wie bei M Pflicht. Zwei davon sind aber sachlich ungenau (Befunde 1 und 2), und für den als K eingestuften Teil fehlt die Change-Seite (Befund 3). |

### Zusammenfassung für den Inhaber
Dieser PR ändert kein Programm. Er trägt nach, was heute passiert ist: Der neue Image-Check ist jetzt Pflicht, T-30 ist abgeschlossen, und das Update des Cloudflare-Bausteins ist nach Ihrer Freigabe eingespielt. Das Risiko liegt allein in der Genauigkeit der Doku. Im Changelog steht, dass beide Infrastruktur-Teile gegen das echte Cloudflare geprüft wurden. Für den Speicher-Bucket stimmt das nicht, dort lief nur eine formale Prüfung. Außerdem ist der Image-Teil dem falschen Schritt zugeordnet (5 statt 3). Für die als „kleine Änderung“ eingestuften Provider-Updates fehlt die vorgeschriebene Change-Seite mit Ihrer Freigabe. Ausprobieren müssen Sie nichts. Bitte prüfen Sie aber in Docker Desktop, ob die Telemetrie-Einstellung wirklich mit „Apply“ gespeichert wurde.

---

## Umsetzung der Befunde (Nachtrag)

1. 🟡 Changelog: Der Eintrag trennt jetzt `live` (`plan` ohne Änderungen) und `bootstrap` (nur `validate`, `plan` 401).
2. 🟡 Changelog: #36 und #37 stehen jetzt unter „Schritt 3 (Lokale Umgebung & Images)“.
3. 🟡 Change-Seite `changes/2026-11-18-cloudflare-provider-5-29.md` nachträglich angelegt, mit `plan`-Auszug, Risiko, Rückweg und der Freigabe vom 2026-11-18 (im Chat). Protokoll und Changelog verweisen darauf.
4. ⚪ Im Nachtrag zu T-37 und auf der Change-Seite begründet: Der Runbook-Weg ändert Token-Rechte und wurde für ein reines Versions-Update nicht gegangen. Der nächste `bootstrap`-Plan prüft 5.29.0 mit.
