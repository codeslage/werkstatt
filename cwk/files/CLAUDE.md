# CLAUDE.md

Diese Regeln gelten für jede Claude-Code-Sitzung in diesem Repo. Sie kommen aus dem CodeslageWerkzeugKasten (CWK) und werden per Sync-PR aktualisiert. Eigene Regeln des Projekts stehen nur im Projektblock am Ende.

## Constitution (verbindlich)

@CONSTITUTION.md

## Orientierung

- Prozesse in `docs/prozess/`: `sdd-ablauf.md` (Stufen und Gates), `aenderungsklassen.md` (M · K · V), `code-review.md` (Reviews), `release.md` (Branches, Releases, Hotfixes), `governance.md` (Änderungen an Regeln).
- Vorhaben liegen als Ordner `specs/NN-name/` mit `spec.md`, `plan.md`, `tasks.md`, `reviews/`, `retro.md`; kleine Änderungen als `changes/JJJJ-MM-TT-name.md`; Vorlagen in `specs/_vorlagen/`.
- `cwk.json` nennt den CWK-Stand, ob das Repo Code hat und wohin die Doku gehört. Den Stand setzt nur der Sync.
- Sprache: Specs, Doku und Commit-Nachrichten auf Deutsch, Code und Bezeichner auf Englisch.

## Befehle

| Befehl                        | Wofür                                           |
| ----------------------------- | ----------------------------------------------- |
| `/sdd-specify` … `/sdd-retro` | die 8 Stufen eines Vorhabens (Klasse V)         |
| `/change`                     | kleine Änderung (Klasse K) mit Change-Seite     |
| `/release`                    | Release-Kandidat → int → prod                   |
| `/hotfix`                     | Fehler in prod beheben, wählt den passenden Weg |

Claude führt diese Befehle auch **selbst** aus, wenn die Situation es verlangt, auch ohne dass der Inhaber sie nennt. Die darin vorgesehenen Freigaben holt Claude trotzdem immer beim Inhaber ein.

## Vor jeder Änderung – immer, auch bei Kleinigkeiten

1. **Einstufen und nennen:** M, K oder V (`aenderungsklassen.md`), in einem Satz in der Antwort, **bevor** die erste Datei geändert wird.
2. **Prozess wählen** nach `aenderungsklassen.md`. CI und Review-Agent laufen in jeder Klasse. Bei einem laufenden Vorhaben kein Gate überspringen.
3. **Branch prüfen:** Gearbeitet wird auf einem **eigenen** Branch je PR bzw. je Change, abgezweigt vom aktuellen `main`; ein `hotfix/…` vom aktuellen prod-Tag. Nie auf `main` arbeiten, nie auf dem Branch einer anderen Aufgabe.
4. **Fremde Änderungen** im Arbeitsverzeichnis werden nicht angefasst, sondern dem Inhaber gemeldet.

Dateien aus dem CWK (Liste in `cwk/manifest.json` von `codeslage/werkstatt`) werden hier nicht geändert, außer im Projektblock. Änderungen daran gehören nach `werkstatt`.

<!-- cwk:project:start -->
<!-- cwk:project:end -->
