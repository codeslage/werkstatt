<!-- cspell:ignore Akzeptanzkriterie Connectoren -->

# Change: Rechtschreibprüfung mit cspell (Deutsch und Englisch)

> Klasse: **K** · Status: **Umgesetzt** · Stand: 2026-11-18
> Bezug: `CONSTITUTION.md` (v1.1.0), `docs/prozess/aenderungsklassen.md`, `.github/workflows/ci.yml`, `infra/tests/repo.test.ts` (AK-1)
> Notfall: nein

**Einstufung K:** Die Änderung bringt einen neuen Pflicht-Check in die CI. Er kann Merges blockieren und muss im Ruleset von `main` eingetragen werden, also eine Einstellung mit Wirkung auf den Schutz des Repos. Neues Verhalten für Nutzer oder neue AKs bringt sie nicht. Damit ist sie mehr als M und weniger als V.

## Ziel

Specs, Doku und Commit-Texte sind auf Deutsch, Code und Bezeichner auf Englisch (`CLAUDE.md`). Bisher prüft nichts die Rechtschreibung, und eine Editor-Erweiterung sieht nur, wer im Editor schreibt, nicht ein Agent und nicht die CI. Mit `cspell` als Befehl im Repo gilt dieselbe Prüfung lokal, für Claude und in der CI.

## Änderung

1. **Abhängigkeiten** (Root, exakt gepinnt wie die übrigen): `cspell` 10.5.1 (MIT) und `@cspell/dict-de-de` 4.1.3 (LGPL-3.0). Beide sind aktiv gepflegt, älter als die Wartezeit von 3 Tagen (`dependabot.yml`) und als Entwicklungswerkzeug auch kommerziell nutzbar. Die neueste Version 10.5.2 ist vom 2026-11-18 und wird deshalb noch nicht genommen.
2. **Konfiguration** `cspell.config.yaml`: Sprachen `en,de-DE`, deutsches Wörterbuch, `.gitignore` beachten, ausgenommen `pnpm-lock.yaml` und `.terraform.lock.hcl`. Projektwörter in `project-words.txt` (Fachbegriffe, Anbieter, Hostnamen wie `codeslage`, `gitleaks`, `DNSSEC`, `gemergt`). Probelauf am 2026-11-18: 180 unbekannte Wörter, fast alle Fachbegriffe oder Eigennamen.
3. **Ausnahmen für Protokolle und Reviews:** `docs/protokolle/**` und `specs/**/reviews/**` werden nicht geprüft. Sie sind Aufzeichnungen und bleiben unverändert (wie beim Change „Klick-Dummy“, #7).
4. **Befehl** `pnpm spellcheck` (`cspell --no-progress --dot .`). `--dot` nimmt auch `.claude/`, `.github/` und `.env.example` mit (Review, Befund 1), `.git/` ist ausgenommen; `.env` und `.sperrliste` bleiben über `.gitignore` außen vor.
5. **CI-Job** „Rechtschreibung“ in `ci.yml`, aufgebaut wie der Job „Format“.
6. **Ruleset (Inhaber):** „Rechtschreibung“ als Pflicht-Check für `main` eintragen. Sonst schlägt der Test „verlangt jeden Job aus ci.yml als Pflicht-Check“ fehl (`repo.test.ts`).
7. **Gefundene Fehler beheben:** `specs/00-start.md`: „Jede Akzeptanzkriterie“ → „Jedes Akzeptanzkriterium“; `docs/dsgvo.md`: „Connectoren“ → „Konnektoren“. Die übrigen Funde waren korrekte Fachbegriffe; `project-words.txt` hat 138 Einträge.
8. **Doku:** `CLAUDE.md` (Hinweis: neue Wörter in `project-words.txt`, nicht abschalten), Eintrag in `CHANGELOG.md`.

Nicht Teil dieser Änderung: Prüfung im Pre-Commit-Hook (er bleibt schnell) und Commit-Nachrichten.

## Risiko & Rückweg

- **Risiko:** Falsch-Treffer bei neuen Fachbegriffen blockieren einen PR. Abhilfe: Wort in `project-words.txt` ergänzen, im selben PR.
- **Risiko:** Das deutsche Wörterbuch kennt zusammengesetzte Wörter nur teilweise. Abhilfe wie oben; wächst die Liste stark, prüfen wir `allowCompoundWords`.
- **Risiko:** Der Job ist in `ci.yml`, aber nicht im Ruleset (oder umgekehrt). Das fängt `repo.test.ts` ab.
- **Rückweg:** PR zurücknehmen (Revert) und den Pflicht-Check im Ruleset entfernen.

## Nachweis

| Prüfung                                                                                             | Testart       | Ergebnis                                                                                               |
| --------------------------------------------------------------------------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------ |
| Zuerst: Test in `tools/quality-fixtures`, ein Tippfehler auf Deutsch und auf Englisch wird gemeldet | automatisiert | ✅ vor der Umsetzung rot (3 von 3), danach grün                                                        |
| Korrektes Deutsch (mit Umlauten und ß) und Englisch werden nicht gemeldet                           | automatisiert | ✅ grün                                                                                                |
| `pnpm spellcheck` auf dem ganzen Repo: 0 Befunde                                                    | automatisiert | ✅ 136 Dateien (mit `--dot`, ohne `.git/`), 0 Befunde                                                  |
| Alle übrigen Prüfungen lokal (test, typecheck, lint, format, knip, depcruise, spec-check)           | automatisiert | ✅ grün, 103 Tests                                                                                     |
| CI-Job „Rechtschreibung“ grün; Pflicht-Check im Ruleset (`repo.test.ts`)                            | automatisiert | ✅ zuerst rot („Rechtschreibung“ fehlte im Ruleset), nach dem Eintrag durch den Inhaber grün (3 von 3) |

## Constitution-Kurzcheck

Nur Artikel mit Bezug: II (Tests beweisen die Änderung) ✅, XI (neue Abhängigkeiten begründet, Lizenz und Pflege geprüft) ✅, XII (Doku im selben PR) ✅.

## Review

Ergebnis des Agents `code-reviewer` (unverändert eingefügt).

<!-- cspell:disable -->

## Review: feature/cspell (PR #43) · Change `changes/2026-11-18-rechtschreibung-cspell.md` (Klasse K)

Ergebnis: ✅ mergebar (keine offenen 🔴). Merge erst, wenn der Inhaber „Rechtschreibung“ im Ruleset von `main` als Pflicht-Check eingetragen hat. Bis dahin bleibt der CI-Job „Repo-Einstellungen“ rot (Change-Seite, Schritt 6).

### Befunde

| #   | Grad | Datei:Zeile                                                                        | Befund                                                                                                                                                                                                                                                                                                                                                                              | Fehlerfall                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | Artikel |
| --- | ---- | ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| 1   | 🟡   | `package.json:23` (`cspell --no-progress .`), `cspell.config.yaml`                 | cspell überspringt ohne `--dot` alle Dateien in Punkt-Ordnern und Punkt-Dateien. Nicht geprüft werden deshalb die 12 deutschen Prozess-Prompts in `.claude/commands/` und `.claude/agents/`, `.github/pull_request_template.md`, die Workflows und `.env.example`. Laut Change-Seite und PR läuft die Prüfung „auf dem ganzen Repo“ (108 Dateien). Mit `--dot` sind es 137 Dateien. | Ein Tippfehler in `.claude/commands/change.md` oder in der PR-Vorlage wird weder von `pnpm spellcheck` noch von der CI gemeldet. Nachgeprüft: `cspell --no-progress --dot .` meldet 32 unbekannte Wörter in 8 Dateien, die der jetzige Befehl gar nicht ansieht (z. B. `.claude/commands/release.md:2` „taggen“, `.claude/agents/code-reviewer.md:12` „drüberschauen“). Echte Rechtschreibfehler waren nicht darunter, die Lücke besteht aber. Abhilfe: `--dot` setzen und Wortliste ergänzen. Alternativ die Ausnahme in der Change-Seite ausdrücklich nennen und begründen. | XII, I  |
| 2   | ⚪   | `changes/2026-11-18-rechtschreibung-cspell.md`, Abschnitt „Constitution-Kurzcheck“ | Der Kurzcheck nennt nur II und XII. Artikel XI (neue Abhängigkeiten) fehlt. Lizenz und Pflege der neuen Pakete stehen nirgends. Geprüft: `cspell` steht unter MIT, `@cspell/dict-de-de` unter LGPL-3.0. Beide dürfen als Entwicklungswerkzeug auch kommerziell genutzt werden.                                                                                                      | Die Retro oder ein späterer Leser kann ohne eigene Recherche nicht nachvollziehen, ob die Lizenz-Pflicht aus XI geprüft wurde.                                                                                                                                                                                                                                                                                                                                                                                                                                                | XI      |
| 3   | ⚪   | `tools/quality-fixtures/test/cspell.test.ts:9`                                     | Der Test ruft `node_modules/cspell/bin.mjs` aus dem Root auf. `cspell` fehlt aber in `tools/quality-fixtures/package.json`, wo die übrigen geprüften Werkzeuge (eslint, knip, prettier, dependency-cruiser) eingetragen sind.                                                                                                                                                       | Läuft das Paket einmal für sich (z. B. bei einer Workspace-Umstellung) und ist `cspell` nicht im Root, findet der Test die Datei nicht und schlägt mit ENOENT fehl. Heute funktioniert er, knip meldet nichts.                                                                                                                                                                                                                                                                                                                                                                | XV      |

### Checkliste

| #   | Prüfpunkt       | ✅/❌/– | Anmerkung                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| --- | --------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Auftrag         | ✅      | Alle Diff-Teile entsprechen den Schritten 1–8 der Change-Seite: Abhängigkeiten, Konfiguration, Ausnahmen, Befehl, CI-Job, zwei Korrekturen, Doku. Darüber hinaus enthält der Diff nichts. Die Lockfile-Änderung besteht nur aus Ergänzungen. Lücke beim Umfang der geprüften Dateien siehe Befund 1.                                                                                                                                                                                                 |
| 2   | Korrektheit     | ✅      | `cspell --no-progress .` meldet 108 Dateien und 0 Befunde. Die Ausnahmen (Lockfiles, Wortliste, Protokolle, Reviews) wirken. Alle 126 Einträge der Wortliste kommen in geprüften Dateien vor, `domainkey` und `isready` über `google._domainkey` bzw. `pg_isready`. Punkt-Dateien bleiben ungeprüft (Befund 1).                                                                                                                                                                                      |
| 3   | Tests           | ✅      | `cspell.test.ts` prüft das Verhalten mit der echten Repo-Konfiguration: Tippfehler auf Deutsch und Englisch führen zu Exit 1 mit dem Wort in der Ausgabe, korrekter Text mit Umlauten und ß zu Exit 0 ohne Ausgabe. Damit ist auch belegt, dass das deutsche Wörterbuch geladen wird. Lokal 3/3 grün. Kein Test abgeschwächt. Die übrigen 14 roten Unit-Tests (`tools/public-scan`) scheitern in meiner Umgebung nur an der fehlenden `gitleaks`-Binary und haben mit dieser Änderung nichts zu tun. |
| 4   | Eingaben        | –       | Keine Eingaben von außen.                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| 5   | Sicherheit      | ✅      | Keine Secrets. Die Action ist per SHA gepinnt wie in den übrigen Jobs, der Job hat keine Sonderrechte. Die Wortliste enthält nur Begriffe, die schon im öffentlichen Repo stehen.                                                                                                                                                                                                                                                                                                                    |
| 6   | Datenschutz     | –       | Nicht berührt. Die Korrektur in `docs/dsgvo.md` ändert nur ein Wort.                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| 7   | Mensch im Loop  | –       | Nicht berührt.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| 8   | Zerstörerisches | –       | Nichts Zerstörerisches.                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| 9   | Code-Qualität   | ✅      | Kein toter Code. Lint, Typecheck (quality-fixtures), knip, depcruise und Format sind grün. Kleinigkeit siehe Befund 3.                                                                                                                                                                                                                                                                                                                                                                               |
| 10  | Abhängigkeiten  | ✅      | Bedarf in der Change-Seite begründet. Versionen exakt gepinnt und im Lockfile festgeschrieben. Lizenzen MIT bzw. LGPL-3.0 sind in Ordnung, aber nicht dokumentiert (Befund 2).                                                                                                                                                                                                                                                                                                                       |
| 11  | Fehler          | ✅      | Ein Fund lässt den Job mit Exit ≠ 0 scheitern, nichts wird verschluckt.                                                                                                                                                                                                                                                                                                                                                                                                                              |
| 12  | Doku            | ✅      | `CLAUDE.md`, `CHANGELOG.md` und die Change-Seite sind im selben PR angepasst. Die Aussage „ganzes Repo“ stimmt nicht ganz (Befund 1).                                                                                                                                                                                                                                                                                                                                                                |

### Zusammenfassung für den Inhaber

Die Änderung führt eine automatische Rechtschreibprüfung für Deutsch und Englisch ein. Sie läuft als Befehl im Repo und als neuer Pflicht-Check in der CI und hat zwei echte Fehler in der Doku gefunden und behoben. Das Risiko ist gering: Schlimmstenfalls blockiert ein unbekannter Fachbegriff einen PR, bis er in die Wortliste eingetragen ist. Eine Lücke gibt es: Dateien in versteckten Ordnern werden nicht geprüft, darunter die Claude-Befehle unter `.claude/` und die PR-Vorlage. Das sollte noch ergänzt oder bewusst als Ausnahme festgehalten werden. Bevor gemergt werden kann, musst du „Rechtschreibung“ im Ruleset von `main` als Pflicht-Check eintragen. Danach lohnt sich ein Blick, ob der neue Check im PR grün angezeigt wird.

<!-- cspell:enable -->

**Umgang mit den Befunden** (im selben PR):

- Befund 1 🟡: behoben. `--dot` gesetzt, 12 Wörter ergänzt; jetzt 136 Dateien, 0 Befunde. `.git/` ist ausgenommen (sonst prüft cspell z. B. die letzte Commit-Nachricht). `.env` und `.sperrliste` bleiben über `.gitignore` außen vor.
- Befund 2 ⚪: behoben. Lizenz und Pflege unter „Änderung“, Nr. 1; XI im Kurzcheck.
- Befund 3 ⚪: nicht übernommen. Mit `cspell` in `tools/quality-fixtures/package.json` meldet knip den Eintrag als ungenutzt (der Test ruft nur die Binary auf, importiert nichts). Eine knip-Ausnahme wäre mehr Aufwand als der Nutzen; der Test nutzt deshalb weiter die Binary aus dem Root, wo `cspell` ohnehin für `pnpm spellcheck` steht.
- Ruleset: „Rechtschreibung“ vom Inhaber als Pflicht-Check eingetragen; `repo.test.ts` grün.

## Freigabe

Freigegeben durch den Inhaber am: 2026-11-18
