## Review: PR #35 (feature/plan-mac) · Vorhaben 04-fundament · Tasks T-31 (Plan v1.2, Klasse M, nur Doku)

Ergebnis: ✅ mergebar (keine offenen 🔴)

Geprüft: `git diff main...feature/plan-mac` (1 Commit 05e8858; geändert sind `CHANGELOG.md`, `specs/04-fundament/plan.md` und `specs/04-fundament/tasks.md`). Gelesen habe ich die geänderten Dateien sowie `spec.md` (AK-25), `docs/runbooks/lokale-umgebung.md`, `specs/02-architektur.md`, ADR 0010, `aenderungsklassen.md` und die PR-Beschreibung. Lokal laufen `pnpm format`, `pnpm spec-check` und `pnpm test` (100/100) grün. Alle 9 CI-Checks am PR sind grün.

### Befunde

| # | Grad | Datei:Zeile | Befund | Fehlerfall | Artikel |
|---|---|---|---|---|---|
| 1 | 🟡 | specs/04-fundament/plan.md:168 | Der Plan sagt: „Das Runbook kommt dort ohne Administratorrechte aus (Homebrew gehört dem ersten Konto)“. Das stimmt nur, wenn im frischen Konto Abschnitt 1 des Runbooks (Werkzeuge) übersprungen wird. Der Plan sagt nicht, welche Schritte das frische Konto tatsächlich durchläuft. | Auf diesem Mac gehört `/opt/homebrew` dem ersten Konto (`drwxr-xr-x`). `node@24` ist keg-only, und die pnpm-Shims liegen in `/opt/homebrew/opt/node@24/bin`, ebenfalls nur für das erste Konto beschreibbar. Ein frisches Standardkonto, das dem heutigen macOS-Teil des Runbooks folgt, scheitert bei `brew install gh` (Präfix nicht beschreibbar) und bei `corepack enable` (keine Schreibrechte im Node-Verzeichnis). Ohne `brew shellenv` und den `node@24`-Pfad in seinem `~/.zprofile` findet es außerdem weder `brew` noch `node`. Damit belegt das AK-25-Protokoll die Installation der Werkzeuge nicht, und das bleibt ungesagt. Vorschlag: Im Plan festhalten, dass die Werkzeuge einmal je Rechner vom Admin-Konto installiert werden. Das frische Konto richtet dann PATH ein, klont, führt `pnpm install` und `pnpm dev:up` aus. Die Einschränkung gehört ins Protokoll. | II, X |
| 2 | 🟡 | specs/02-architektur.md:102-104 | Abschnitt A2 „Lokale Entwicklung“ beschreibt weiter „Windows (jetzt)“ mit dem Repo unter `X:\Coding\codeslage` und „Mac (später)“. Dieser PR macht den Mac zum Ist-Zustand, passt die Architektur aber nicht an. | Wer die Architektur liest (eine neue Sitzung, ein späterer Kunde, der Inhaber), hält Windows für die aktuelle Umgebung und `X:\` für den Repo-Pfad, während Plan und Runbook schon vom Mac ausgehen. | XII |
| 3 | 🟡 | CHANGELOG.md:20 | Im neuen Eintrag fehlt die PR-Nummer. Die Pflegeregel in CHANGELOG.md:5 verlangt „Datum, Kurzbeschreibung und PR-Nummer“. | Der Eintrag nennt nur „(T-31)“. Beim `/release` lässt er sich keinem PR zuordnen. Richtig wäre „(#35)“. | XII |
| 4 | ⚪ | specs/04-fundament/spec.md:126; docs/prozess/governance.md:46 | Die Spec führt weiter das Risiko „Docker unter Windows ist langsam (WSL2, `X:\`)“. In governance.md steht der lokale Pfad `X:\Coding\codeslage-internal`. Beides ist jetzt überholt. Spec und Prozessdokument brauchen die Freigabe des Inhabers, deshalb nur als Hinweis bzw. Folgeänderung. | In der Spec steht ein Windows-Risiko, das der Plan v1.2 durch das arm64/amd64-Risiko ersetzt hat. Der Pfad in governance.md stimmt auf dem Mac nicht. | XII |
| 5 | ⚪ | specs/04-fundament/plan.md:241 / tasks.md:53 (T-27) | Die neue Gegenmaßnahme „per Digest des Index gepinnt“ fehlt in der Prüfspalte von T-27. | Pinnt T-27 versehentlich den Digest eines einzelnen Plattform-Manifests (z. B. amd64 aus der CI), bleibt der Job `image` grün. Lokal auf arm64 startet das Image dann gar nicht oder nur emuliert. Auffallen würde das erst bei T-31. Vorschlag: In T-27 als Prüfung ergänzen, dass `docker buildx imagetools inspect` für den gepinnten Digest eine Manifest-Liste mit arm64 und amd64 zeigt. | II |

### Checkliste

| # | Prüfpunkt | ✅/❌/– | Anmerkung |
|---|---|---|---|
| 1 | Auftrag | ✅ | Alle drei Dateien betreffen nur Plan v1.2 bzw. T-31. Die Plan-Freigabe (Gate Stufe 3) ist in der Status-Zeile vermerkt. Nichts geht über den Auftrag hinaus. Zum Satz über Administratorrechte siehe Befund 1. |
| 2 | Korrektheit | ✅ | Die Aussagen sind in sich stimmig: Spec, Tasks und Plan nennen dieselben Versionen, und das Risiko passt zu T-29/T-30. Einschränkung: Befund 1. |
| 3 | Tests | ✅ | Keine Code-Änderung. AK-25 bleibt manuell plus Smoke-Test abgedeckt, nichts wurde abgeschwächt. Die Wiederholung unter Windows fällt laut Freigabe weg, und AK-25 verlangt nur einen frischen Rechner oder ein frisches Konto. Zur Aussagekraft des Protokolls siehe Befund 1. |
| 4 | Eingaben | – | nur Doku |
| 5 | Sicherheit | ✅ | Keine Secrets, nichts Internes. Der Secret- und Öffentlich-Scan ist grün. |
| 6 | Datenschutz | – | nur Doku |
| 7 | Mensch im Loop | ✅ | Die Plan-Änderung hat der Inhaber freigegeben (Vermerk in plan.md:3 und tasks.md:122). |
| 8 | Zerstörerisches | – | keins |
| 9 | Code-Qualität | – | kein Code |
| 10 | Abhängigkeiten | – | keine neuen |
| 11 | Fehler | – | kein Code |
| 12 | Doku | ❌ | Plan, Tasks und Changelog sind angepasst. Die Architektur (A2) ist veraltet (Befund 2), und im Changelog fehlt die PR-Nummer (Befund 3). Das Runbook wird ausdrücklich erst in T-31 angepasst, das ist in Ordnung. |

### Zusammenfassung für den Inhaber

Die Änderung passt nur Dokumente an: Der Plan für Phase 1 geht jetzt davon aus, dass du auf dem Mac entwickelst. Der Nachweis, dass ein frischer Rechner die lokale Umgebung startet, erfolgt einmal in einem neuen macOS-Benutzerkonto statt unter Windows. Ein Risiko für den Betrieb gibt es nicht, und alle automatischen Prüfungen sind grün. Bevor T-31 startet, sollte im Plan klarer stehen, was das frische Konto selbst einrichtet und was es vom ersten Konto übernimmt. Ein neues Standardkonto kann mit Homebrew nichts installieren, die Werkzeuge kommen also vom ersten Konto, und das sollte im Protokoll stehen. Außerdem beschreibt das Architekturdokument noch Windows als aktuelle Umgebung, und im Changelog fehlt die PR-Nummer. Zum Ausprobieren gibt es nichts, die eigentliche Probe folgt in T-31.

### Umsetzung der Befunde (Nachtrag)

- 1 🟡: Plan Schritt 3 präzisiert: Werkzeuge installiert das Admin-Konto einmal je Rechner; das frische Standardkonto richtet `PATH` ein, startet Docker Desktop, klont, `pnpm install`, `pnpm dev:up`. Die Einschränkung kommt ins Protokoll; die Installation der Werkzeuge belegt das Protokoll T-01 (Nachtrag Mac in PR #34).
- 2 🟡: `specs/02-architektur.md` A2: Mac als aktuelle Umgebung, Windows als Verlauf; Stand-Zeile ergänzt. Der Status „Entwurf“ bleibt unverändert.
- 3 🟡: Changelog-Eintrag mit „(#35)“.
- 4 ⚪: Nicht umgesetzt: Spec (freigegeben) und `docs/prozess/governance.md` brauchen die Freigabe des Inhabers. Dem Inhaber als Folgeänderung vorgelegt.
- 5 ⚪: T-27 prüft jetzt zusätzlich per `docker buildx imagetools inspect`, dass jeder gepinnte Digest eine Manifest-Liste mit `linux/amd64` und `linux/arm64` ist.
