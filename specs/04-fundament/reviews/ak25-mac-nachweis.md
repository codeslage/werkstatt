## Review: PR #41 (feature/ak25-mac-nachweis) · Vorhaben 04-fundament · Tasks T-24, T-31 (dazu T-22: Regel für Actions-Updates)

Ergebnis: ✅ mergebar (keine offenen 🔴). Weil `docs/prozess/aenderungsklassen.md` geändert wird, braucht der Merge nach der Merge-Regel in `code-review.md` die Freigabe des Inhabers. Ein Auto-Merge ist nicht erlaubt.

### Befunde
| # | Grad | Datei:Zeile | Befund | Fehlerfall | Artikel |
|---|---|---|---|---|---|
| 1 | 🟡 | specs/04-fundament/plan.md:168 | Der AK-25-Punkt widerspricht sich jetzt selbst. Der neue erste Satz sagt: „ein zusätzliches frisches Benutzerkonto entfällt“. Danach stehen aber noch die alten Sätze aus v1.2: „Das frische Konto richtet nur den `PATH` ein, startet Docker Desktop einmal für sich …“ und „Diese Einschränkung steht im Protokoll: Belegt ist der Weg vom Klonen bis zur laufenden App, die Installation der Werkzeuge belegt das Protokoll T-01.“ Der Nachtrag im Protokoll enthält diese Einschränkung nicht. Er sagt das Gegenteil: Abschnitt 1 bis 3 seien auf dem frischen Rechner gelaufen. | Wer Plan v1.3 liest, weiß nicht, ob ein frisches Konto nötig ist und was der manuelle Nachweis belegt. Die Retro oder ein späterer Wiederholungslauf (z. B. Projekt-Vorlage in Phase 1.5) folgt dann womöglich der veralteten Konto-Variante. | XII, XV (Aufräumen) |
| 2 | 🟡 | docs/protokolle/2026-11-18-t-30-t-31-image-ci-runbook.md:17, specs/04-fundament/plan.md:168 | Die Begründung für das entfallene frische Konto ist zu weit gefasst. Laut Text prüft die CI „denselben Ablauf bei jedem PR auf einer frischen Maschine“. Der Job `image` (`.github/workflows/ci.yml`:176–211) nutzt aber `./.github/actions/setup` und setzt `POSTGRES_PASSWORD` als Umgebungsvariable. Runbook-Abschnitt 1 (Homebrew, Docker Desktop), Abschnitt 2 (`PATH` in `~/.zprofile`, Docker Desktop je Konto) und `cp .env.example .env` aus Abschnitt 3 führt er nie aus. Außerdem steht im Protokoll selbst: „Das Runbook ist aus diesem Ablauf entstanden.“ AK-25 (spec.md:69) verlangt aber den Start „nach Anleitung“. Niemand ist also je der fertigen Anleitung gefolgt. | Ein Fehler im Runbook, etwa ein falscher `PATH`-Eintrag oder ein fehlender Schritt bei Docker Desktop, fällt weder in der CI noch im manuellen Nachweis auf, sondern erst beim nächsten neuen Rechner oder Konto. Die Entscheidung des Inhabers ist dokumentiert. Die Begründung sollte aber genau sagen, was die CI abdeckt (Abschnitt 3 ab `pnpm install` und `dev:up`/`test:smoke`) und was nicht (Abschnitt 1 und 2, `.env`), damit er die Lücke bewusst annimmt. | II, XII |
| 3 | ⚪ | docs/prozess/aenderungsklassen.md:31 | „Sie sind per Version festgeschrieben“ ist ungenau. Die Actions sind per Commit-SHA gepinnt (z. B. `ci.yml`:183, `actions/checkout@3d3c42e…`), und das ist die stärkere Begründung. | Wer die Regel liest, könnte folgern, dass ein Pin auf ein Tag (`@v7`) reicht, damit ein Actions-Update M bleibt. | VII |
| 4 | ⚪ | docs/runbooks/lokale-umgebung.md:3 | Der Kopf verweist noch auf „Plan v1.2“, Plan und Tasks sind jetzt auf v1.3. | Rein formal, der Inhalt des Runbooks bleibt richtig. | XII |
| 5 | ⚪ | specs/04-fundament/zeiten.md:81 | Die T-31-Zeile enthält auch „GitHub Actions bleiben M“. Laut Analyze-Tabelle in tasks.md gehört das zu T-22. | Bei Soll/Ist in der Retro ist T-31 etwas zu hoch und T-22 zu niedrig (Minutenbereich). | XIV |

### Checkliste
| # | Prüfpunkt | ✅/❌/– | Anmerkung |
|---|---|---|---|
| 1 | Auftrag | ✅ | Alle Änderungen gehen auf T-24, T-31 und den offenen Punkt aus Review PR #40 (T-22) zurück. Beide Entscheidungen sind als Entscheidung des Inhabers in der Analyze-Tabelle von tasks.md festgehalten. Nichts geht darüber hinaus. |
| 2 | Korrektheit | ✅ | Spec-Treue: AK-25 lässt „zweiten Rechner oder frisches Benutzerkonto“ zu, der frisch eingerichtete Mac erfüllt die Prüfart. Ist für T-31 (Summe 27 min, gerundet 0,5) und T-24 (0,25) stimmt mit der Methode in zeiten.md überein. Widerspruch im Plan siehe Befund 1. |
| 3 | Tests | ✅ | Kein Test geändert oder abgeschwächt. Lokal grün: `pnpm test` 100/100, `pnpm test:infra` 22/22, `format`, `spec-check`. CI auf PR #41: alle Checks grün außer „Image (Compose + Smoke)“, der zum Zeitpunkt des Reviews noch lief und vor dem Merge grün sein muss. Ob der manuelle Nachweis von AK-25 reicht, siehe Befund 2. |
| 4 | Eingaben | – | Keine Eingabeverarbeitung. |
| 5 | Sicherheit | ✅ | Keine Secrets, keine Kontodaten, IPs oder Konto-IDs im Diff. Der Pfad zu `settings-store.json` ist ein Standardpfad von Docker Desktop. Die Regel „Actions-Updates bleiben M“ hat der Inhaber entschieden; die Actions sind per SHA gepinnt und haben einen Cooldown von 3 Tagen (`.github/dependabot.yml`). |
| 6 | Datenschutz | ✅ | Docker-Telemetrie ist jetzt nachweislich aus (`AnalyticsEnabled: false`). Damit ist der offene Punkt aus T-24 erledigt. |
| 7 | Mensch im Loop | – | Keine KI-Ausgaben nach außen. |
| 8 | Zerstörerisches | – | Nichts. |
| 9 | Code-Qualität | ✅ | Kein Code geändert. Veralteter Text im Plan siehe Befund 1. |
| 10 | Abhängigkeiten | – | Keine neuen. |
| 11 | Fehler | – | Nicht betroffen. |
| 12 | Doku | ✅ | Plan, Tasks, Protokoll, Zeiten und Changelog wurden im selben PR angepasst. Der Kopf von `aenderungsklassen.md` hat den neuen Stand. Kleinere Ungenauigkeiten siehe Befunde 1, 3 und 4. |

### Zusammenfassung für den Inhaber
Die Änderung hält zwei Entscheidungen von Ihnen fest. Erstens gilt die Einrichtung Ihres neuen Mac als Nachweis, dass die lokale Umgebung auf einem frischen Rechner läuft. Ein zusätzliches Test-Benutzerkonto entfällt. Zweitens bleiben automatische Updates der GitHub-Prüfschritte in der einfachsten Änderungsklasse. Außerdem werden zwei Aufgaben als erledigt markiert, darunter die abgeschaltete Docker-Telemetrie. Ein Risiko für den Betrieb gibt es nicht, weil kein Code geändert wird. Eine Lücke sollten Sie aber bewusst annehmen: Die Anleitung ist aus Ihrer Einrichtung entstanden, aber nie jemand hat sie danach Schritt für Schritt befolgt. Die automatische Prüfung deckt die ersten Schritte (Werkzeuge installieren, Docker Desktop, die Datei mit dem Datenbank-Passwort) nicht ab. Ausprobieren müssen Sie nichts. Prüfen Sie vor dem Merge nur, ob der Prüflauf „Image (Compose + Smoke)“ grün ist, und geben Sie den Merge selbst frei, weil ein Prozessdokument geändert wird.

---

## Umsetzung der Befunde (Nachtrag)

1. 🟡 Plan, AK-25-Punkt: die alten Sätze zur Konto-Variante aus v1.2 entfernt. Der Punkt beschreibt nur noch den Nachweis durch die Ersteinrichtung des Mac.
2. 🟡 Plan und Protokoll benennen die Lücke jetzt genau: Die CI prüft nur Abschnitt 3 ab `pnpm install`, nicht Abschnitt 1 und 2 und nicht `cp .env.example .env`, und das Runbook wurde nicht noch einmal blind befolgt. Im Plan steht sie als „bewusst angenommene Lücke“, Entscheidung des Inhabers. Ein Fehler dort wird beim nächsten neuen Rechner oder Konto im Runbook korrigiert. Der Inhaber wird im Chat noch einmal ausdrücklich darauf hingewiesen.
3. ⚪ `aenderungsklassen.md`: „per Commit-SHA gepinnt (ein Pin auf ein Tag wie `@v7` reicht dafür nicht)“.
4. ⚪ Runbook-Kopf: Plan v1.3.
5. ⚪ Zeiten: Die Entscheidung zu GitHub Actions steht als eigene Zeile unter T-22.
- Merge: Der Inhaber hat im Chat „ok M“ entschieden. Die Änderung an `aenderungsklassen.md` gibt genau diese Entscheidung wieder.
