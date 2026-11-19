## Review: PR #50 (feature/zeiten-warten) · Vorhaben 05-projekt-plattform (Folge aus Stufe 1, Klasse M) · Tasks –

Ergebnis: ✅ mergebar (keine 🔴). Der PR ändert `docs/prozess/sdd-ablauf.md`, eine Vorlage und `/sdd-*`-Befehle. Deshalb braucht der Merge die Freigabe des Inhabers (`code-review.md`, Merge-Regel). Ein Auto-Merge ist nicht erlaubt.

### Befunde
| # | Grad | Datei:Zeile | Befund | Fehlerfall | Artikel |
|---|---|---|---|---|---|
| 1 | 🟡 | specs/05-projekt-plattform/zeiten.md:9 (nicht im Diff) | Das laufende Vorhaben 05 nennt in seinem Methodenteil noch die alte Regel „Wartezeit … steht in der Bemerkung“. Die Tabelle derselben Datei nutzt aber schon Zeilen „Spec (Warten)“ und eine Summen-Tabelle. Der neue Punkt „Summen“ aus der Vorlage fehlt dort. Der PR ändert genau diese Regel, passt aber das einzige laufende Vorhaben nicht an. | Eine Sitzung setzt Vorhaben 05 mit `/sdd-clarify` oder `/sdd-plan` fort und liest den Methodenteil der Datei. Dort steht „Wartezeit in der Bemerkung“, im Befehl steht „eigene Zeilen (Warten)“, und die Tabelle darunter folgt der neuen Regel. Je nachdem, welcher Stelle die Sitzung folgt, landet Wartezeit wieder in einer Arbeitszeile, und die Summe für „Arbeit“ fällt zu hoch aus. | XII |
| 2 | 🟡 | specs/_vorlagen/zeiten.md:13, specs/_vorlagen/tasks.md:15, specs/_vorlagen/retro.md:16-18, .claude/commands/sdd-retro.md:11 | Seit es die Trennung gibt, ist offen, was als „Ist“ zählt: nur die Arbeit oder Arbeit plus Warten. Laut Auswertung kommt „die Summe je Task“ gerundet in `tasks.md`, ohne Angabe welche. `/sdd-retro` verlangt Arbeit und Warten „getrennt ausgewiesen“. Die Retro-Vorlage hat für die Zeit aber nur eine einzige Ist-Zelle, ebenso die Soll/Ist-Tabelle in `03-roadmap.md`. | Beispiel: T-03 hat 0:20 Arbeit und 1:00 Warten. Eine Sitzung trägt als Ist 0,5 h ein (nur Arbeit), eine andere 1,25 h (Gesamt). Damit lassen sich die Ist-Werte verschiedener Vorhaben und der Vergleich mit dem Soll („inkl. Abstimmung“ laut `tasks.md`-Vorlage) nicht mehr vergleichen. In der Retro bleibt offen, welcher Wert in die eine Ist-Zelle gehört. | XIV |
| 3 | ⚪ | specs/05-projekt-plattform/zeiten.md:25-27 gegen specs/_vorlagen/zeiten.md:19-21 | In der Summen-Tabelle heißt die erste Spalte in 05 „Stufe“, in der Vorlage „Was“. Der Hinweis in 05 schreibt „Warten“, die Vorlage „(Warten)“. | Nur ein Schönheitsfehler. Wer die Summen-Tabellen mehrerer Vorhaben automatisch zusammenführt, stößt auf unterschiedliche Spaltennamen. | – |
| 4 | ⚪ | CHANGELOG.md:25 | Im Commit 46d0fe5 steht noch der Platzhalter „#PR“. Die Korrektur auf „#50“ liegt nur lokal und ist nicht committet. | Wird ohne diesen Commit gemergt, verweist der Changelog-Eintrag auf keinen PR. | XII |

### Checkliste
| # | Prüfpunkt | ✅/❌/– | Anmerkung |
|---|---|---|---|
| 1 | Auftrag | ✅ | Alle Änderungen setzen den Wunsch des Inhabers um: Warten steht in eigenen Zeilen, Summen getrennt nach Arbeit und Warten. Darüber hinaus wird nichts geändert. Alle sieben Stufenbefehle mit Zeit-Hinweis sind gleich angepasst. `/sdd-specify` nennt keine Wartezeit, das ist aber auch nicht nötig. |
| 2 | Korrektheit | ❌ | Regel und Beispiele in der Vorlage sind stimmig. Offen ist, was als Ist gilt (Befund 2), und das laufende Vorhaben widerspricht der neuen Regel (Befund 1). Beides 🟡. Die Summen in 05 stimmen (0:10 Arbeit + 2:00 Warten = 2:10). |
| 3 | Tests | – | Keine Code-Änderung. `pnpm spellcheck` grün (141 Dateien, 0 Funde), `pnpm spec-check` grün. `prettier --check` auf die geänderten Dateien ist grün. `pnpm format` schlägt lokal nur wegen Dateien unter `.claude/worktrees/` fehl, die nicht zum PR gehören. |
| 4 | Eingaben | – | Keine Systemgrenze betroffen. |
| 5 | Sicherheit | ✅ | Keine Secrets, nichts aus der Liste „Öffentlich vs. intern“. |
| 6 | Datenschutz | ✅ | Keine personenbezogenen Daten Dritter. |
| 7 | Mensch im Loop | – | Nicht betroffen. |
| 8 | Zerstörerisches | – | Keine. |
| 9 | Code-Qualität | ✅ | Kein Code. Die Formulierungen sind knapp und in allen Befehlen einheitlich. |
| 10 | Abhängigkeiten | – | Keine neuen. |
| 11 | Fehler | – | Nicht betroffen. |
| 12 | Doku | ❌ | Changelog-Eintrag ist vorhanden, die Stand-Zeile in `sdd-ablauf.md` ist angepasst. Der Methodenteil von `specs/05-projekt-plattform/zeiten.md` ist nicht nachgezogen (Befund 1). Die PR-Nummer im Changelog ist noch nicht committet (Befund 4). |

### Zusammenfassung für den Inhaber
Die Änderung legt fest, dass die Zeit, in der Claude auf Ihre Antwort oder Freigabe wartet, in eigenen Zeilen steht. Am Ende jedes Zeitprotokolls stehen dann getrennte Summen für Arbeit und Warten. Für den Betrieb gibt es kein Risiko, es geht nur um Prozess und Vorlagen. Offen ist eine Frage, die Sie entscheiden sollten: Zählt als „Ist“ einer Aufgabe nur die Arbeitszeit oder Arbeit plus Warten? Davon hängt der Vergleich mit der Schätzung ab. Außerdem beschreibt das Zeitprotokoll des laufenden Vorhabens 05 in seinem Kopf noch die alte Regel und sollte im selben PR angepasst werden. Weil eine Prozessregel geändert wird, braucht der Merge Ihre ausdrückliche Zustimmung.

---

## Umsetzung der Befunde (Nachtrag)

Vorab: Die Sitzung für Phase 2 (`specs/06-webseite/zeiten.md`, PR #49) hat zur selben Zeit eine eigene Spalte „Art“ (`Arbeit` / `Wartezeit`) eingeführt. Damit es nur ein Format gibt, übernehmen Vorlage und Prozess diese Spalte statt des Zusatzes „(Warten)“ in der Spalte „Was“. Eine eigene Spalte lässt sich außerdem leichter auswerten.

1. 🟡 Der Methodenteil von `specs/05-projekt-plattform/zeiten.md` ist jetzt wortgleich mit der Vorlage. Die Tabelle hat die Spalte „Art“.
2. 🟡 Vorschlag (die Entscheidung liegt beim Inhaber, mit dem Merge): **Ist = Gesamtzeit** (Arbeit + Wartezeit), weil das Soll laut `tasks.md`-Vorlage die Abstimmung enthält. So steht es in der Vorlage `zeiten.md`, in `sdd-ablauf.md` und in `/sdd-retro`. Die Retro-Vorlage hat jetzt die Zeilen „Zeit (gesamt)“, „davon Arbeit“ und „davon Wartezeit“. Die Roadmap behält eine Ist-Spalte (Gesamt).
3. ⚪ Die Summen-Tabellen in Vorlage und 05 haben jetzt dieselben Spalten: Was, Arbeit, Wartezeit, Gesamt.
4. ⚪ „#50“ ist committet.
- Freigabe: Der Inhaber hat den Merge am 2026-11-19 im Chat freigegeben („Ja, mergen“), mit Ist = Gesamtzeit.
