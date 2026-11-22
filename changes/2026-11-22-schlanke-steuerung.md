# Change: Schlanke Steuerung in Stufe 6, Verify meldet, Retro hält fest

> Klasse: **K** · Status: **Entwurf** · Stand: 2026-11-22
> Bezug: `CONSTITUTION.md` (v1.1.0), `docs/prozess/sdd-ablauf.md`, `docs/prozess/code-review.md`, `docs/prozess/governance.md` („Änderungen“)
> Notfall: nein

**Einstufung K:** Die Änderung betrifft Prozessdokumente, Vorlagen und `/sdd-*`-Befehle, also das Vorgehen in jedem Vorhaben, bringt aber keine neuen AKs für Nutzer. Laut `governance.md` braucht sie einen PR mit Begründung und die Freigabe des Inhabers. Der Inhaber darf auf V hochstufen.

## Ziel

Die Kosten einer KI-gestützten Umsetzung entstehen vor allem durch **Kontext**, nicht durch das Schreiben von Code. Arbeitet eine Sitzung alle Tasks eines Vorhabens nacheinander ab, liest jeder Schritt den gesamten, wachsenden Verlauf erneut (gemessen: Median ~270–310 Tsd. Tokens je Aufruf, Start ~25 Tsd.). Die Änderung hält den Kontext klein: eine Sitzung je Task mit Kontextpaket, Reviews je PR-Gruppe, Verify und Retro ohne Umsetzungsarbeit.

**Messung** an einem kleinen Testvorhaben (Kanban-Board, gleiches Kit, gleiche Vorgaben, Claude Opus, Kosten zum Listenpreis inkl. Subagenten, Abnahme im Browser):

| Steuerung                                     | Kosten             | Wandzeit | Abnahme                                          |
| --------------------------------------------- | ------------------ | -------- | ------------------------------------------------ |
| eine lange Sitzung je Stufe (heutiger Ablauf) | $74,18             | 230 min  | alle AKs ✅                                      |
| schlank (diese Änderung)                      | $26,48 (**−64 %**) | 100 min  | alle AKs ✅ nach einer kurzen Nacharbeit ($1,36) |

Der größte Einzelposten danach sind die Reviews (~45 % der Umsetzung).

## Änderung

| Datei                               | Änderung                                                                                                                                                                                                                       |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `docs/prozess/sdd-ablauf.md`        | Stufe 4 und 6 in der Tabelle; neue Regeln „Schlanke Steuerung in Stufe 6“ und „Verify meldet, Retro hält fest“; Zeiterfassung durch `tools/sdd-dirigent`                                                                       |
| `docs/prozess/code-review.md`       | Review-Datei je PR-Gruppe (`reviews/PR-xx.md`), ältere Vorhaben behalten `T-xx.md`                                                                                                                                             |
| `specs/_vorlagen/tasks.md`          | Spalten PR (Pflicht), Plan-Abschnitt, Dateien; Status je PR-Gruppe; Analyse prüft die neuen Spalten                                                                                                                            |
| `.claude/commands/sdd-tasks.md`     | PR-Gruppen, Plan-Abschnitt und Dateien je Task                                                                                                                                                                                 |
| `.claude/commands/sdd-implement.md` | Aufträge `T-xx` (eine Task, ein Commit) und `review PR-xx` (Review, Status/Ist, PR)                                                                                                                                            |
| `.claude/commands/sdd-verify.md`    | weist nach und meldet; keine Hilfsskripte, keine Reparatur, manuelle Prüfschritte für den Inhaber                                                                                                                              |
| `.claude/commands/sdd-retro.md`     | Vorschläge mit Änderungsklasse, keine Umsetzung in der Retro                                                                                                                                                                   |
| `tools/sdd-dirigent/`               | neues Werkzeug: führt eine PR-Gruppe in frischen `claude -p`-Sitzungen aus (Kontextpakete, einmal „weiter“ bei unfertigem Auftrag, Zeiten nach `zeiten.md`); Unit-Tests für das Lesen von `tasks.md`, Kontextpakete und Zeiten |
| `.gitignore`                        | `.sdd-dirigent/` (Kontextpakete)                                                                                                                                                                                               |
| `project-words.txt`                 | drei neue Wörter                                                                                                                                                                                                               |

**Bewusst nicht geändert:** Constitution (Artikel III und XIV bleiben erfüllt: kleine PRs, Zeiten werden gemessen), Gates, `release.md` (PR, CI und Auto-Merge wie bisher; der Dirigent erstellt **einen** PR je Aufruf und merged nie selbst).

**Aufruf:**

```sh
node tools/sdd-dirigent/src/cli.ts 07-beispiel PR-02 --dry-run   # nur Kontextpakete anzeigen
SDD_CLAUDE_ARGS="--permission-mode acceptEdits" node tools/sdd-dirigent/src/cli.ts 07-beispiel PR-02
```

Umgebung: `SDD_CLAUDE` (Programm), `SDD_CLAUDE_ARGS` (zusätzliche Argumente, z. B. Modell oder Berechtigungen), `SDD_EFFORT` (Standard `high`), `SDD_PRUEFEN` (Prüfbefehl nach jeder Task, Standard `pnpm test`).

## Risiko & Rückweg

- **Zusammenhang zwischen Tasks geht verloren:** Entscheidungen müssen in Spec, Plan, ADRs stehen statt im Gesprächsverlauf. Das Review je PR-Gruppe sieht den Zusammenhang wieder. Im Test kein Bruch beobachtet.
- **Fehler werden später gefunden:** Verify sucht nicht mehr selbst per Hilfsskript; Fehler in der Oberfläche fallen erst bei der Abnahme auf (im Test: ein Fehler, Nacharbeit 4 min). Die Prüfschritte für den Inhaber in `retro.md` gleichen das aus.
- **Berechtigungen im Headless-Modus:** `claude -p` darf nur, was die Einstellungen bzw. `SDD_CLAUDE_ARGS` erlauben. Der Dirigent setzt bewusst keine Standard-Berechtigung.
- **Rückweg:** Revert des PR. Laufende Vorhaben können jederzeit wieder mit `/sdd-implement` von Hand arbeiten; die neuen Spalten stören den alten Ablauf nicht.

## Nachweis

| Prüfung                                                                         | Testart                                                          | Ergebnis               |
| ------------------------------------------------------------------------------- | ---------------------------------------------------------------- | ---------------------- |
| `tasks.md` lesen, Plan-Abschnitt und AKs finden, Kontextpakete, Zeiten einfügen | automatisiert (`tools/sdd-dirigent/test/plan.test.ts`, 15 Tests) | ✅                     |
| Typecheck, Lint, Formatierung, Rechtschreibung, knip, Modulgrenzen              | automatisiert (lokal)                                            | ✅                     |
| `--dry-run` an einem Beispielvorhaben                                           | manuell                                                          | ✅                     |
| Wirkung auf Kosten und Qualität                                                 | Messung am Testvorhaben (siehe Ziel)                             | −64 %, gleiche Abnahme |
| Erster echter Einsatz in einem werkstatt-Vorhaben                               | manuell, nach Freigabe                                           | offen                  |

## Constitution-Kurzcheck

- I ✅ SDD-Ablauf und Gates unverändert
- II ✅ Test zuerst je Task, Prüfbefehl nach jeder Task
- III ✅ PR-Gruppen mit 1–5 Tasks
- IX ✅ Mensch gibt jeden PR und jede Abnahme frei; der Dirigent merged nie
- XI ✅ keine neue Abhängigkeit (nur Node-Bordmittel)
- XIV ✅ Zeiten weiterhin gemessen, für Stufe 6 durch das Werkzeug
- XV ✅ Komplexitätsgrenzen eingehalten

## Offene Punkte für die Freigabe

- Klasse K oder Hochstufung auf V?
- ADR für das neue Werkzeug nötig, oder reicht diese Change-Seite?
- Spätere Variante: Review durch ein günstigeres Modell (größter verbleibender Kostenposten), eigener Change nach Messung.

## Review
