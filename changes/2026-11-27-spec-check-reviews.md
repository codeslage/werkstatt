# Change: Spec-Check übergeht Review-Dateien

> Klasse: **K** · Status: **Freigegeben** · Stand: 2026-11-27
> Bezug: `CONSTITUTION.md` (v1.1.0), `docs/prozess/aenderungsklassen.md`, `docs/prozess/code-review.md` („Wo das Review landet“), `tools/spec-check`
> Notfall: nein

**Einstufung K:** Der Spec-Check ist ein Pflicht-Check in der CI von werkstatt und, über `cwk-rules.yml`, in jedem Projekt-Repo. Die Änderung ändert, welche Dateien er prüft. Neue AKs oder neues Nutzerverhalten bringt sie nicht. Damit ist sie mehr als M und weniger als V.

## Ziel

Der Spec-Check wählt Dateien nur nach dem Namen aus: Jede `spec.md` und `plan.md` unter `specs/` gilt als Spec bzw. Plan. Liegt ein Review mit diesem Namen unter `specs/NN-name/reviews/`, meldet er `status-fehlt`, `constitution-bezug-fehlt` und `constitution-check-fehlt`, und die CI wird rot. Im Projekt `codeslage/quiz` musste die Review-Datei deshalb zweimal umbenannt werden (`specify.md`, `plan-1.md`). Künftig übergeht der Check alles unter `reviews/`, so wie heute schon `_vorlagen/`.

## Änderung

1. **Test zuerst** (`tools/spec-check/test/check.test.ts`): Ein Ordner mit `99-beispiel/reviews/plan.md` ohne Status wird nicht gemeldet (Exit 0). Ein echter `99-beispiel/plan.md` ohne Status meldet weiter `status-fehlt` (Exit 1).
2. **Spec-Check** (`tools/spec-check/src/cli.ts`): Die Auswahl der Dokumente schließt neben `_vorlagen` auch Pfade mit einem Ordner `reviews` aus.
3. **Doku:** Eintrag in `CHANGELOG.md` unter „Behoben“. `docs/prozess/code-review.md` braucht keinen Hinweis: Die Ablage `specs/NN-name/reviews/T-xx.md` bleibt gleich, und nach dieser Änderung ist jeder Dateiname dort erlaubt. Eine Namensregel für Reviews müsste also nichts mehr verhindern.
4. **Projekt-Repos:** Sie führen den Spec-Check aus werkstatt aus (`cwk-rules.yml`, Stand aus `cwk.json`). Die Änderung kommt mit dem nächsten Sync-PR in `codeslage/quiz` an. Die umbenannten Dateien dort dürfen bleiben.

Nicht Teil dieser Änderung: Review-Dateien in `quiz` wieder umbenennen, andere Ordner ausnehmen.

## Risiko & Rückweg

- **Risiko:** Eine echte Spec oder ein echter Plan liegt versehentlich in einem Ordner `reviews/` und wird dann nicht mehr geprüft. Laut `sdd-ablauf.md` liegen sie immer direkt in `specs/NN-name/`; das deckt der zweite Test ab.
- **Rückweg:** PR zurücknehmen (Revert).

## Nachweis

| Prüfung                                                                         | Testart       | Ergebnis                                                                             |
| ------------------------------------------------------------------------------- | ------------- | ------------------------------------------------------------------------------------ |
| Zuerst: `reviews/plan.md` ohne Status wird nicht gemeldet                       | automatisiert | ✅ vor der Umsetzung rot, danach grün                                                |
| Echter `plan.md` ohne Status meldet weiter `status-fehlt`                       | automatisiert | ✅ grün (Exit 1, Meldung nennt nur den echten Plan)                                  |
| Spec-Check über das ganze Repo bleibt grün                                      | automatisiert | ✅ grün (`pnpm spec-check`)                                                          |
| Alle übrigen Prüfungen lokal (test, typecheck, lint, format, knip, spellcheck…) | automatisiert | ✅ grün, 279 Tests; typecheck, lint, knip, depcruise, format, spellcheck ohne Befund |
| CI im PR grün                                                                   | automatisiert |                                                                                      |

## Constitution-Kurzcheck

Nur Artikel mit Bezug: I (Specs und Pläne werden weiter geprüft, nur Reviews nicht) ✅, II (Test vor dem Code, beide Fälle) ✅, XII (CHANGELOG im selben PR, Prozess-Doku geprüft) ✅, XV (eine Bedingung mehr, kein neuer Code-Pfad) ✅.

## Review

Ergebnis des Agents `code-reviewer` (unverändert eingefügt).

## Zeiten

| Datum      | Von   | Bis | Art    | Was                            |
| ---------- | ----- | --- | ------ | ------------------------------ |
| 2026-11-27 | 21:08 |     | Arbeit | Einlesen, Change-Seite, Branch |

## Freigabe

Freigegeben durch den Inhaber am: 2026-11-27
