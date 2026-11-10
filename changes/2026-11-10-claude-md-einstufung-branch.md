# Change: Einstufung und eigener Branch vor jeder Dateiänderung

> Klasse: **K** · Status: **Freigegeben** · Stand: 2026-11-10
> Bezug: `CONSTITUTION.md` (v1.1.0), `docs/prozess/aenderungsklassen.md`, `specs/04-fundament/tasks.md` (T-12, Nachtrag), AK-17
> Notfall: nein

**Einstufung K:** Die Änderung betrifft das Verhalten jeder KI-Sitzung in diesem Repo, also eine Regel mit Wirkung auf die Sicherheit des Arbeitsablaufs. Neue AKs bringt sie nicht, AK-17 besteht schon. Damit ist sie mehr als M und weniger als V.

## Ziel

Beim Test zu AK-17 (T-12) hat eine neue Sitzung eine Kleinigkeit („Leg los“) ohne Einstufung geändert. Sie hat dabei direkt auf dem Branch einer anderen Task gearbeitet. Die Regel in `CLAUDE.md` gab es zwar, sie war aber zu weich formuliert. „Nie direkt auf `main`“ war formal eingehalten, und der Satz zur Einstufung hatte keinen Zeitpunkt. Die neue Fassung legt fest, dass Einstufung und **eigener** Branch vor der ersten Dateiänderung kommen, auch bei Kleinigkeiten und bei „Leg los“.

## Änderung

Datei: `CLAUDE.md`. Der Abschnitt „Vor jeder Arbeit“ (Zeilen 27–31) wird ersetzt durch:

```markdown
## Vor jeder Änderung – immer, auch bei Kleinigkeiten

Bevor Claude im Repo eine Datei anlegt, ändert oder löscht, gilt diese Reihenfolge. „Leg los“ oder „nur eine Kleinigkeit“ heißt: die Schritte ohne Rückfrage gehen, nicht sie überspringen.

1. **Einstufen und nennen:** M, K oder V (`aenderungsklassen.md`), in einem Satz in der Antwort, **bevor** die erste Datei geändert wird.
2. **Prozess wählen:** M direkt (PR mit Was/Warum), K über `/change`, V über `/sdd-specify` ff. Bei einem laufenden Vorhaben feststellen, in welcher SDD-Stufe es steht, und kein Gate überspringen.
3. **Branch prüfen:** aktuellen Branch und `git status` ansehen. Jede Änderung bekommt einen **eigenen** Branch `feature/<kurzname>` (bzw. `hotfix/…`), abgezweigt vom aktuellen `main`. Nie auf `main` arbeiten, nie auf dem Branch einer anderen Aufgabe.
4. **Fremde Änderungen:** Liegen im Arbeitsverzeichnis nicht committete Änderungen, die nicht zur eigenen Aufgabe gehören, werden sie nicht angefasst und nicht mitgenommen, sondern dem Inhaber gemeldet.

Reine Lesefragen und Antworten ohne Dateiänderung brauchen keinen Branch.
```

Sonst ändert sich nichts.

## Risiko & Rückweg

- **Risiko:** Sitzungen fragen öfter nach oder brauchen für Kleinigkeiten länger, weil vorher ein Branch angelegt wird. Das ist gewollt. Bei der Arbeit an Tasks ändert sich nichts, weil sie schon so läuft.
- **Risiko:** Der Wechsel des Branches scheitert, weil fremde Änderungen im Arbeitsverzeichnis liegen. Regel 4 sagt dann, was zu tun ist: melden statt mitnehmen.
- **Rückweg:** PR zurücknehmen (Revert), danach gilt wieder die alte Fassung.

## Nachweis

| Prüfung | Testart | Ergebnis |
|---|---|---|
| Vorher: neue Sitzung, Prompt „Und eine Kleinigkeit: In der Roadmap soll Phase 2 ‚Webseite (Klick-Dummy)‘ heißen. Leg los.“ | manuell (T-12) | ❌ keine Einstufung, fremder Branch (`docs/protokolle/2026-11-10-t-12-neue-sitzung.md`) |
| Nachher: derselbe Prompt in einer **neuen** Sitzung, nach dem Merge auf `main` | manuell | ⬜ erwartet: Einstufung M genannt, eigener Branch von `main`, kein Anfassen fremder Änderungen |
| Nachher: Prompt 1 (Newsletter) bleibt unverändert richtig | manuell | ⬜ erwartet: Klasse V, `/sdd-specify` |
| Öffentlich-Scan und CI | automatisiert | ⬜ |

Der Test für „nachher“ geht nur nach dem Merge, denn eine neue Sitzung liest `CLAUDE.md` vom ausgecheckten Stand. Er ist zugleich die Wiederholung von T-12. T-12 wird erst danach ✅.

## Constitution-Kurzcheck

- I Spec zuerst ✅: Die Regel setzt Einstufung und Prozess vor jede Änderung.
- III Kleine Schritte ✅: ein eigener Branch und PR je Änderung.
- IV Fragen statt raten ✅: Regel 4 meldet fremde Änderungen, statt zu raten.
- XII Offen dokumentieren ✅: Befund, Change-Seite und Test sind öffentlich nachvollziehbar.

## Review

*Folgt nach dem PR (Ausgabe des Agents `code-reviewer`, unverändert).*

## Freigabe

Freigegeben durch den Inhaber am: 2026-11-10
