# CLAUDE.md – codeslage

Diese Regeln gelten für jede Claude-Code-Sitzung in diesem Repo.

## Constitution (verbindlich)

@CONSTITUTION.md

## Orientierung

- Grundlagen: `specs/01-vision.md`, `specs/02-architektur.md`, `specs/03-roadmap.md`.
- Prozesse in `docs/prozess/`: `sdd-ablauf.md` (Stufen und Gates), `aenderungsklassen.md` (M · K · V), `code-review.md` (Reviews), `release.md` (Branches, dev · int · prod, Releases, Hotfixes), `governance.md` (Änderungen an Regeln).
- Vorhaben liegen als Ordner `specs/NN-name/` mit `spec.md`, `plan.md`, `tasks.md`, `reviews/`, `retro.md`; kleine Änderungen als `changes/JJJJ-MM-TT-name.md`; Vorlagen in `specs/_vorlagen/`.
- Sprache: Specs, Doku und Commit-Nachrichten auf Deutsch, Code und Bezeichner auf Englisch.

## Befehle

| Befehl                        | Wofür                                           |
| ----------------------------- | ----------------------------------------------- |
| `/sdd-specify` … `/sdd-retro` | die 8 Stufen eines Vorhabens (Klasse V)         |
| `/change`                     | kleine Änderung (Klasse K) mit Change-Seite     |
| `/release`                    | Release-Kandidat → int → prod                   |
| `/hotfix`                     | Fehler in prod beheben, wählt den passenden Weg |

Claude führt diese Befehle auch **selbst** aus, wenn die Situation es verlangt (z. B. `/change` statt direkt zu editieren), auch ohne dass der Inhaber sie nennt. Die darin vorgesehenen Freigaben holt Claude trotzdem immer beim Inhaber ein.

## Vor jeder Änderung – immer, auch bei Kleinigkeiten

Bevor Claude im Repo eine Datei anlegt, ändert oder löscht, gilt diese Reihenfolge. „Leg los“ oder „nur eine Kleinigkeit“ heißt: die Schritte ohne Rückfrage gehen, nicht sie überspringen.

1. **Einstufen und nennen:** M, K oder V (`aenderungsklassen.md`), in einem Satz in der Antwort, **bevor** die erste Datei geändert wird.
2. **Prozess wählen** nach `aenderungsklassen.md`: M per PR mit Was/Warum, K über `/change`, V über `/sdd-specify` ff., Fehler in prod über `/hotfix`. CI und Review-Agent laufen in jeder Klasse. Bei einem laufenden Vorhaben feststellen, in welcher SDD-Stufe es steht, und kein Gate überspringen.
3. **Branch prüfen:** aktuellen Branch und `git status` ansehen. Gearbeitet wird auf einem **eigenen** Branch je PR (Zuschnitt laut `tasks.md`) bzw. je Change: `feature/<kurzname>`, abgezweigt vom aktuellen `main`; ein `hotfix/…` dagegen vom aktuellen prod-Tag (`release.md`). Nie auf `main` arbeiten, nie auf dem Branch einer anderen Aufgabe.
4. **Fremde Änderungen:** Liegen im Arbeitsverzeichnis nicht committete Änderungen, die nicht zur eigenen Aufgabe gehören, werden sie nicht angefasst und nicht mitgenommen, sondern dem Inhaber gemeldet.

Reine Lesefragen und Antworten ohne Dateiänderung brauchen keinen Branch.

## Pflege

- Wenn sich die Constitution ändert: Version und Stand im Kopf anpassen, Bezüge in den Specs prüfen.
- Soll/Ist-Tabelle in `specs/03-roadmap.md` bei Phasenstart und -ende aktualisieren.
