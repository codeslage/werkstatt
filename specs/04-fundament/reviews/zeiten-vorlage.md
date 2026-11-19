## Review: PR #47 (feature/zeiten-vorlage) · Vorhaben 04-fundament (Retro-Folge, Klasse M) · Tasks –

Ergebnis: ✅ mergebar (keine 🔴). Weil `docs/prozess/sdd-ablauf.md`, eine Vorlage und `/sdd-*`-Befehle geändert werden, braucht der Merge die Freigabe des Inhabers (`governance.md`, `code-review.md` Merge-Regel). Ein Auto-Merge ist nicht erlaubt.

### Befunde
| # | Grad | Datei:Zeile | Befund | Fehlerfall | Artikel |
|---|---|---|---|---|---|
| 1 | 🟡 | .claude/commands/sdd-implement.md:15, specs/_vorlagen/zeiten.md:3 und :12 gegen specs/_vorlagen/tasks.md:9 | Der neue Schritt verlangt „das gerundete Ist in `tasks.md`“. Die neue Vorlage verweist auf „`tasks.md` (Spalte Ist)“. Die Vorlage `specs/_vorlagen/tasks.md` hat aber weder eine Spalte Soll noch eine Spalte Ist (`ID, Task, AK, Test, Abhängig von, PR, Status`). Die Spalten gibt es nur in der handgepflegten `specs/04-fundament/tasks.md`. | Ein neues Vorhaben legt `tasks.md` mit `/sdd-tasks` aus der Vorlage an. In Stufe 6 soll `/sdd-implement` das Ist eintragen, findet dafür aber keine Spalte. Die Sitzung baut die Tabelle dann nach Gutdünken um, oder das Ist fehlt, und Soll/Ist je Task lässt sich in der Retro nicht vergleichen. Das ist dieselbe Lücke „Pflicht ohne Vorlage“, die dieser PR schließen will. | XII, XIV |
| 2 | 🟡 | docs/prozess/sdd-ablauf.md:27 gegen .claude/commands/sdd-clarify.md, sdd-plan.md, sdd-tasks.md, sdd-analyze.md, sdd-verify.md | Laut Regel trägt „jede Stufe und jede Task“ ihre Zeit ein. Einen Befehlsschritt dafür bekommen aber nur `/sdd-specify` (Anlage), `/sdd-implement` (Tasks) und `/sdd-retro` (Auswertung). Clarify, Plan, Tasks, Analyze und Verify erwähnen `zeiten.md` nicht. Die PR-Beschreibung begründet die Änderung selbst mit dem Argument aus Review #46, dass eine Pflicht ohne Befehlsschritt nicht eingehalten wird. | Eine Sitzung führt `/sdd-plan` aus und hält sich an die Befehlsschritte. Sie trägt keine Zeit ein. Plan, Tasks, Analyze und Verify fehlen danach in `zeiten.md`, und das Ist in der Retro und eine Abrechnung fallen zu niedrig aus. | XIV, XII |
| 3 | 🟡 | specs/04-fundament/zeiten.md:92 | Die Dauer ist falsch: 10:43 bis 10:47 sind 0:04, eingetragen ist 0:05. | Die Retro summiert laut neuem `/sdd-retro` die „genauen Minuten aller Zeilen“. Wer die Spalte Dauer addiert, bekommt 1 Minute zu viel. Gerade bei der neuen Grundlage für eine Abrechnung sollten Start, Ende und Dauer übereinstimmen. | XIV |

### Checkliste
| # | Prüfpunkt | ✅/❌/– | Anmerkung |
|---|---|---|---|
| 1 | Auftrag | ✅ | Alle Änderungen gehen auf die Entscheidung des Inhabers vom 2026-11-19 und auf Befund 3 aus Review #46 zurück, nichts geht darüber hinaus. Unvollständig ist die Umsetzung bei den Befehlen der übrigen Stufen und bei der tasks-Vorlage (Befunde 1 und 2). |
| 2 | Korrektheit | ❌ | Die Verweise passen nicht zusammen (Befund 1), die Abdeckung der Stufen fehlt teilweise (Befund 2), eine Dauer ist falsch gerechnet (Befund 3). Alles 🟡, kein Fehlverhalten im Betrieb. |
| 3 | Tests | – | Keine Code-Änderung. `pnpm format`, `pnpm spec-check` und `pnpm spellcheck` laufen lokal grün (139 Dateien, 0 Funde). |
| 4 | Eingaben | – | Keine Systemgrenze betroffen. |
| 5 | Sicherheit | ✅ | Keine Secrets, keine internen Angaben aus der Liste „Öffentlich vs. intern“. |
| 6 | Datenschutz | ✅ | Das Zeitprotokoll enthält keine personenbezogenen Daten Dritter. |
| 7 | Mensch im Loop | – | Nicht betroffen. |
| 8 | Zerstörerisches | – | Keine. |
| 9 | Code-Qualität | ✅ | Kein Code. Die neue Vorlage ist knapp und deckt sich inhaltlich mit der Methode aus 04. |
| 10 | Abhängigkeiten | – | Keine neuen. |
| 11 | Fehler | – | Nicht betroffen. |
| 12 | Doku | ✅ | Changelog-Eintrag vorhanden (Pflicht bei M), Stand-Zeile in `sdd-ablauf.md` angepasst, Zeit in `zeiten.md` nachgetragen. Lücken wie in Befund 1. |

### Zusammenfassung für den Inhaber
Mit der Änderung wird die Zeiterfassung, die in Phase 1 gut funktioniert hat, für jedes künftige Vorhaben Pflicht. Dazu kommen eine fertige Vorlage und Schritte in den Befehlen zum Anlegen, Eintragen und Auswerten. Ein Risiko für den Betrieb gibt es nicht, es geht nur um Text und Prozess. Die Regelung ist aber noch nicht ganz rund. Die Aufgabenliste für neue Vorhaben hat keine Spalte, in die die Ist-Zeit eingetragen werden soll. Außerdem erinnern nur drei der acht Stufenbefehle an die Zeiterfassung, so dass Zeiten für Planung oder Abnahme leicht fehlen können. Weil eine Prozessregel geändert wird, brauchen Sie hier ausdrücklich zuzustimmen. Ich empfehle, vorher die Spalten Soll/Ist in der Aufgaben-Vorlage zu ergänzen und die übrigen Stufenbefehle um einen Satz zur Zeiterfassung zu erweitern.

---

## Umsetzung der Befunde (Nachtrag)

1. 🟡 `specs/_vorlagen/tasks.md` hat jetzt die Spalten Soll und Ist mit Erklärung (Soll beim Anlegen geschätzt, Ist aus `zeiten.md` gerundet). `/sdd-tasks` verlangt ein Soll je Task.
2. 🟡 Clarify, Plan, Tasks, Analyze und Verify haben jetzt je einen Schlusssatz „Zeit: … in `zeiten.md` eintragen“. Damit erinnern alle acht Stufenbefehle an die Zeiterfassung.
3. 🟡 Dauer auf 0:04 korrigiert. Die neue Zeile für diese Nacharbeit ist aus `date` berechnet.
- Freigabe: Der Inhaber hat die Pflicht am 2026-11-19 im Chat beschlossen und den Merge übertragen.
