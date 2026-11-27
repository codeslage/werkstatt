# Change: Spec-Check übergeht Review-Dateien

> Klasse: **K** · Status: **Umgesetzt** · Stand: 2026-11-27
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
| CI im PR grün                                                                   | automatisiert | ✅ grün auf dem letzten Commit (PR #88, alle Checks einschließlich `ci-ok`)          |

## Constitution-Kurzcheck

Nur Artikel mit Bezug: I (Specs und Pläne werden weiter geprüft, nur Reviews nicht) ✅, II (Test vor dem Code, beide Fälle) ✅, XII (CHANGELOG im selben PR, Prozess-Doku geprüft) ✅, XV (eine Bedingung mehr, kein neuer Code-Pfad) ✅.

## Review

Ergebnis des Agents `code-reviewer` (unverändert eingefügt).

<!-- cspell:disable -->

## Review: feature/spec-check-reviews (PR #88) · Change `2026-11-27-spec-check-reviews` (Klasse K) · Tasks –

Ergebnis: ✅ mergebar

Vorbemerkung zur Methode: Das lokale `main` steht auf dd2bf62 und ist veraltet. Darum zeigt `git diff main...feature/spec-check-reviews` 26 Dateien, darunter auch den Inhalt von PR-3a (#87). Geprüft habe ich deshalb gegen `origin/main` (899864d). Dort umfasst der Diff 4 Dateien: `CHANGELOG.md`, `changes/2026-11-27-spec-check-reviews.md`, `tools/spec-check/src/cli.ts`, `tools/spec-check/test/check.test.ts`.

### Befunde

| #   | Grad | Datei:Zeile                                                 | Befund                                                                                                                                 | Fehlerfall                                                                                                                                                                                                                                                                        | Artikel |
| --- | ---- | ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| 1   | ⚪   | tools/spec-check/test/check.test.ts:80                      | `expect(withPlan.stderr).not.toContain('reviews')` prüft den ganzen Fehlertext, und darin steht auch der absolute Pfad aus `tmpdir()`. | Enthält der Temp-Pfad auf einem Rechner zufällig das Wort „reviews“ (etwa über ein eigenes `TMPDIR`), schlägt der Test fehl, obwohl der Code richtig arbeitet. Genauer wäre die Prüfung auf `join(dir, '99-beispiel', 'reviews')`. In CI und lokal tritt das praktisch nicht auf. | II      |
| 2   | ⚪   | changes/2026-11-27-spec-check-reviews.md (Nachweis, Zeiten) | In der Zeile „CI im PR grün“ fehlt noch das Ergebnis, ebenso die Spalte „Bis“ in der Zeitenzeile.                                      | Wird die Seite so gemergt, fehlen der CI-Nachweis und die Ist-Zeit. Beides vor dem Merge nachtragen.                                                                                                                                                                              | II, XIV |

### Checkliste

| #   | Prüfpunkt       | ✅/❌/– | Anmerkung                                                                                                                                                                                                                                                                                                                      |
| --- | --------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Auftrag         | ✅      | Der Diff setzt genau die Schritte 1 bis 3 der Change-Seite um (Test, Ausschluss von `reviews` in `documents()`, CHANGELOG) und geht nicht darüber hinaus. Schritt 4 (Projekt-Repos per Sync) braucht in werkstatt keinen Code.                                                                                                 |
| 2   | Korrektheit     | ✅      | Der Vergleich gilt ganzen Pfadteilen, nicht Teilstrings: Ein Ordner wie `specs/12-reviews/plan.md` wird weiter geprüft. Ausgenommen wird nur ein Ordner, der genau `reviews` oder `_vorlagen` heißt. Getrennt wird bei `/` und `\`. Bei relativen Pfaden unterhalb von `dir` bleibt das alte Verhalten für `_vorlagen` gleich. |
| 3   | Tests           | ✅      | Der neue Test deckt beide Fälle der Change-Seite ab: ein Review ohne Status ergibt Exit 0 ohne Ausgabe, ein echter Plan ohne Status ergibt Exit 1 mit `status-fehlt`. Er prüft das Verhalten über die CLI. Bestehende Tests sind nicht abgeschwächt. Lokal laufen alle 13 Tests in `tools/spec-check` grün.                    |
| 4   | Eingaben        | –       | Keine neue Systemgrenze.                                                                                                                                                                                                                                                                                                       |
| 5   | Sicherheit      | ✅      | Keine Secrets, nichts Internes.                                                                                                                                                                                                                                                                                                |
| 6   | Datenschutz     | –       | Keine personenbezogenen Daten.                                                                                                                                                                                                                                                                                                 |
| 7   | Mensch im Loop  | –       | Keine KI-Ausgaben.                                                                                                                                                                                                                                                                                                             |
| 8   | Zerstörerisches | –       | Nichts.                                                                                                                                                                                                                                                                                                                        |
| 9   | Code-Qualität   | ✅      | Eine Konstante statt eines festen Werts. Der Kommentar erklärt das Warum. Kein toter Code; lint und knip melden nichts.                                                                                                                                                                                                        |
| 10  | Abhängigkeiten  | –       | Keine neuen.                                                                                                                                                                                                                                                                                                                   |
| 11  | Fehler          | ✅      | Echte Specs und Pläne melden weiter alle Fehler. Es wird nichts verschluckt.                                                                                                                                                                                                                                                   |
| 12  | Doku            | ✅      | Der CHANGELOG-Eintrag steht unter „Behoben“. Keine andere Doku beschreibt die Ausschlussregel des Spec-Checks; das habe ich per `git grep` geprüft. Dass `code-review.md` keine Änderung braucht, ist auf der Change-Seite schlüssig begründet.                                                                                |

Lokal ausgeführt: `vitest` für `tools/spec-check` (13/13 grün), `pnpm spec-check` (Exit 0), `lint`, `typecheck`, `format`, `spellcheck` und `knip`, alle ohne Befund.

### Zusammenfassung für den Inhaber

Die automatische Prüfung der Specs und Pläne hat bisher auch Review-Dateien geprüft, wenn sie zufällig „spec.md“ oder „plan.md“ hießen. Dann wurde die CI rot, und im Quiz-Projekt mussten Dateien umbenannt werden. Jetzt lässt die Prüfung alles im Ordner „reviews“ aus, so wie bisher schon die Vorlagen. Echte Specs und Pläne werden weiter vollständig geprüft; ein Test belegt genau das. Das Risiko ist gering: Nur eine Spec, die fälschlich im Ordner „reviews“ läge, würde nicht mehr geprüft, und dort gehört laut Ablauf keine hin. Zum Ausprobieren: Nach dem nächsten Sync-PR im Quiz-Projekt eine Review-Datei probeweise „plan.md“ nennen und prüfen, ob die CI grün bleibt.

<!-- cspell:enable -->

**Umgang mit den Befunden** (im selben PR):

- Befund 1 ⚪: behoben. Der Test prüft jetzt auf `join(dir, '99-beispiel', 'reviews')` statt auf das bloße Wort.
- Befund 2 ⚪: behoben. CI-Ergebnis und Zeiten sind nachgetragen.

## Zeiten

| Datum      | Von   | Bis   | Art       | Was                                      |
| ---------- | ----- | ----- | --------- | ---------------------------------------- |
| 2026-11-27 | 21:08 | 21:09 | Arbeit    | Einlesen, Change-Seite, Branch           |
| 2026-11-27 | 21:09 | 21:10 | Wartezeit | Freigabe der Change-Seite                |
| 2026-11-27 | 21:10 | 21:20 | Arbeit    | Test, Fix, PR, Review, Befunde, Nachweis |

Summen: Arbeit 0:11 h, Wartezeit 0:01 h, Gesamt 0:12 h (Ist gerundet 0,25 h).

## Freigabe

Freigegeben durch den Inhaber am: 2026-11-27
