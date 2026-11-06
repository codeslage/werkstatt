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

| Befehl | Wofür |
|---|---|
| `/sdd-specify` … `/sdd-retro` | die 8 Stufen eines Vorhabens (Klasse V) |
| `/change` | kleine Änderung (Klasse K) mit Change-Seite |
| `/release` | Release-Kandidat → int → prod |
| `/hotfix` | Fehler in prod beheben, wählt den passenden Weg |

Claude führt diese Befehle auch **selbst** aus, wenn die Situation es verlangt (z. B. `/change` statt direkt zu editieren), auch ohne dass der Inhaber sie nennt. Die darin vorgesehenen Freigaben holt Claude trotzdem immer beim Inhaber ein.

## Vor jeder Arbeit

1. Einstufen: Ist es M, K oder V (`aenderungsklassen.md`)? Einstufung in einem Satz nennen.
2. Bei V: feststellen, in welcher SDD-Stufe das Vorhaben steht (Status-Zeilen), und kein Gate überspringen.
3. Auf einem `feature/…`- bzw. `hotfix/…`-Branch arbeiten, nie direkt auf `main`.

## Pflege

- Wenn sich die Constitution ändert: Version und Stand im Kopf anpassen, Bezüge in den Specs prüfen.
- Soll/Ist-Tabelle in `specs/03-roadmap.md` bei Phasenstart und -ende aktualisieren.
