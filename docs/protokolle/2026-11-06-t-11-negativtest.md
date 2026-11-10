# Protokoll T-11: Negativtest Ebene 2 (CI) und Ebene 3 (Review)

> Datum: 2026-11-06 · Task: T-11 · AK: AK-24 · PR: codeslage/werkstatt#1 (ungemergt geschlossen)

## Aufbau

- Der harmlose Kanarienbegriff `[Kanarienbegriff, siehe .sperrliste]` wurde in `.sperrliste` ergänzt, und der Inhaber hat das Secret `PUBLIC_BLOCKLIST` neu gesetzt. Ein echter Sperrbegriff kam für den Test nicht in Frage, weil PR-Inhalte öffentlich bleiben.
- Auf dem Wegwerf-Branch lag eine Datei mit einer erfundenen IPv4-Adresse, einer erfundenen persönlichen E-Mail-Adresse und dem Kanarienbegriff.
- Ebene 1 (lokaler Hook) wurde für diesen einen Commit mit `--no-verify` übersprungen, mit ausdrücklicher Erlaubnis des Inhabers. Nur so ließ sich prüfen, ob die Ebenen 2 und 3 jeweils **allein** anschlagen. Dass Ebene 1 solche Inhalte blockiert, zeigen die Hook-Tests aus T-05.

## Ergebnis

| Ebene            | Ergebnis                                                                                                                                                      | Nachweis                             |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| 2 – CI           | ✅ rot, 3 Funde: `codeslage-ipv4` (Zeile 5), `codeslage-email` (Zeile 6), `codeslage-blocklist` (Zeile 7). Ein Merge wäre durch das Ruleset gesperrt gewesen. | Run 42256600842                      |
| 3 – Review-Agent | ✅ 3 × 🔴, „nicht mergebar“. Der Agent bekam nur PR und Vorhaben genannt.                                                                                     | `specs/04-fundament/reviews/T-11.md` |

Danach wurde der PR ungemergt geschlossen und der Branch gelöscht, lokal und auf GitHub.

## Einschränkungen

- Beim Sperrbegriff stützt sich der Review-Agent auf die lokale `.sperrliste` bzw. den lokalen Scan. Er ist also nicht völlig unabhängig von den Ebenen 1 und 2. IP und E-Mail hat er eigenständig nach `governance.md` erkannt. In der CI läuft kein Review-Agent mit Sperrliste. Für Sperrbegriffe in PRs ist deshalb Ebene 2 die tragende Prüfung.
- Der Inhalt bleibt über `refs/pull/1/head` öffentlich abrufbar (Review-Befund ⚪ 4). Die Werte sind erfunden, und der Kanarienbegriff ist absichtlich harmlos und bleibt als Testbegriff in der Sperrliste.
