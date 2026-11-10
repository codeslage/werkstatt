**Klasse:** M · K · V (`docs/prozess/aenderungsklassen.md`)
**Bezug:** Vorhaben `specs/…` mit Task T-xx und AK-xx · Change-Seite `changes/…` · bei M: kurz Was/Warum

## Was

<!-- Was ändert sich? Stichpunkte reichen. -->

## Warum

<!-- Welches Ziel, welcher Befund, welche Entscheidung? -->

## Test

<!-- Wie ist die Änderung bewiesen? Bei neuen Prüfungen: Rot-Phase und Gegenprobe nennen. -->

## Constitution-Checkliste

- [ ] **Auftrag:** Jede Änderung gehört zu einer Task, einem AK oder einer Change-Seite, und nichts darüber hinaus (I, XV)
- [ ] **Tests:** Test zuerst rot, dann grün; kein Test gelöscht, übersprungen oder abgeschwächt (II)
- [ ] **Secrets:** keine Secrets, Tokens oder Passwörter (VI)
- [ ] **Öffentlich vs. intern:** keine IP-Adressen, persönlichen Kontaktdaten, Kontonamen, Registrar-Angaben oder persönlichen Rahmenbedingungen (`governance.md`)
- [ ] **Sicherheit und Datenschutz:** Least Privilege, Eingaben an Systemgrenzen geprüft, keine personenbezogenen Daten ohne Zweck (VII, VIII)
- [ ] **Zerstörerisches:** keine zerstörerische Aktion, oder sie ist hier genannt und vom Inhaber freigegeben (V)
- [ ] **Kein unnötiger Code:** kein toter Code; neue Abhängigkeiten sind begründet, und `pnpm-workspace.yaml` enthält keine neue Ausnahme (XI, XV)
- [ ] **Neue CI-Jobs** sind im Ruleset als Pflicht-Check eingetragen
- [ ] **Doku im selben PR:** Specs, Tasks, Protokolle, Runbooks, Changelog (bei M Pflicht) (XII)
- [ ] **Review-Agent** `code-reviewer` gelaufen, kein offenes 🔴, Ergebnis abgelegt (`docs/prozess/code-review.md`)
