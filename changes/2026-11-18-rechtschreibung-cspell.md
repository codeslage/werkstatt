<!-- cspell:ignore Akzeptanzkriterie Connectoren -->

# Change: Rechtschreibprüfung mit cspell (Deutsch und Englisch)

> Klasse: **K** · Status: **Umgesetzt** · Stand: 2026-11-18
> Bezug: `CONSTITUTION.md` (v1.1.0), `docs/prozess/aenderungsklassen.md`, `.github/workflows/ci.yml`, `infra/tests/repo.test.ts` (AK-1)
> Notfall: nein

**Einstufung K:** Die Änderung bringt einen neuen Pflicht-Check in die CI. Er kann Merges blockieren und muss im Ruleset von `main` eingetragen werden, also eine Einstellung mit Wirkung auf den Schutz des Repos. Neues Verhalten für Nutzer oder neue AKs bringt sie nicht. Damit ist sie mehr als M und weniger als V.

## Ziel

Specs, Doku und Commit-Texte sind auf Deutsch, Code und Bezeichner auf Englisch (`CLAUDE.md`). Bisher prüft nichts die Rechtschreibung, und eine Editor-Erweiterung sieht nur, wer im Editor schreibt, nicht ein Agent und nicht die CI. Mit `cspell` als Befehl im Repo gilt dieselbe Prüfung lokal, für Claude und in der CI.

## Änderung

1. **Abhängigkeiten** (Root, exakt gepinnt wie die übrigen): `cspell` 10.5.1 und `@cspell/dict-de-de` 4.1.3. Beide älter als die Wartezeit von 3 Tagen (`dependabot.yml`); die neueste Version 10.5.2 ist vom 2026-11-18 und wird deshalb noch nicht genommen.
2. **Konfiguration** `cspell.config.yaml`: Sprachen `en,de-DE`, deutsches Wörterbuch, `.gitignore` beachten, ausgenommen `pnpm-lock.yaml` und `.terraform.lock.hcl`. Projektwörter in `project-words.txt` (Fachbegriffe, Anbieter, Hostnamen wie `codeslage`, `gitleaks`, `DNSSEC`, `gemergt`). Probelauf am 2026-11-18: 180 unbekannte Wörter, fast alle Fachbegriffe oder Eigennamen.
3. **Ausnahmen für Protokolle und Reviews:** `docs/protokolle/**` und `specs/**/reviews/**` werden nicht geprüft. Sie sind Aufzeichnungen und bleiben unverändert (wie beim Change „Klick-Dummy“, #7).
4. **Befehl** `pnpm spellcheck` (`cspell --no-progress .`).
5. **CI-Job** „Rechtschreibung“ in `ci.yml`, aufgebaut wie der Job „Format“.
6. **Ruleset (Inhaber):** „Rechtschreibung“ als Pflicht-Check für `main` eintragen. Sonst schlägt der Test „verlangt jeden Job aus ci.yml als Pflicht-Check“ fehl (`repo.test.ts`).
7. **Gefundene Fehler beheben:** `specs/00-start.md`: „Jede Akzeptanzkriterie“ → „Jedes Akzeptanzkriterium“; `docs/dsgvo.md`: „Connectoren“ → „Konnektoren“. Die übrigen Funde waren korrekte Fachbegriffe; `project-words.txt` hat 126 Einträge.
8. **Doku:** `CLAUDE.md` (Hinweis: neue Wörter in `project-words.txt`, nicht abschalten), Eintrag in `CHANGELOG.md`.

Nicht Teil dieser Änderung: Prüfung im Pre-Commit-Hook (er bleibt schnell) und Commit-Nachrichten.

## Risiko & Rückweg

- **Risiko:** Falsch-Treffer bei neuen Fachbegriffen blockieren einen PR. Abhilfe: Wort in `project-words.txt` ergänzen, im selben PR.
- **Risiko:** Das deutsche Wörterbuch kennt zusammengesetzte Wörter nur teilweise. Abhilfe wie oben; wächst die Liste stark, prüfen wir `allowCompoundWords`.
- **Risiko:** Der Job ist in `ci.yml`, aber nicht im Ruleset (oder umgekehrt). Das fängt `repo.test.ts` ab.
- **Rückweg:** PR zurücknehmen (Revert) und den Pflicht-Check im Ruleset entfernen.

## Nachweis

| Prüfung                                                                                             | Testart       | Ergebnis                                                                                           |
| --------------------------------------------------------------------------------------------------- | ------------- | -------------------------------------------------------------------------------------------------- |
| Zuerst: Test in `tools/quality-fixtures`, ein Tippfehler auf Deutsch und auf Englisch wird gemeldet | automatisiert | ✅ vor der Umsetzung rot (3 von 3), danach grün                                                    |
| Korrektes Deutsch (mit Umlauten und ß) und Englisch werden nicht gemeldet                           | automatisiert | ✅ grün                                                                                            |
| `pnpm spellcheck` auf dem ganzen Repo: 0 Befunde                                                    | automatisiert | ✅ 108 Dateien, 0 Befunde                                                                          |
| Alle übrigen Prüfungen lokal (test, typecheck, lint, format, knip, depcruise, spec-check)           | automatisiert | ✅ grün, 103 Tests                                                                                 |
| CI-Job „Rechtschreibung“ grün; Pflicht-Check im Ruleset (`repo.test.ts`)                            | automatisiert | lokal erwartungsgemäß rot („Rechtschreibung“ fehlt im Ruleset), bis der Inhaber den Check einträgt |

## Constitution-Kurzcheck

Nur Artikel mit Bezug: II (Tests beweisen die Änderung) ✅, XII (Doku im selben PR) ✅.

## Review

Ergebnis des Agents `code-reviewer` (unverändert eingefügt).

## Freigabe

Freigegeben durch den Inhaber am: 2026-11-18
