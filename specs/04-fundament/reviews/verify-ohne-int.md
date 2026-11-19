## Review: PR #46 (feature/verify-ohne-int) · Vorhaben 04-fundament (Retro, „Was ändern wir?“) · Klasse M, keine Task

Ergebnis: ✅ mergebar (kein 🔴, drei 🟡). Weil `docs/prozess/` geändert wird, merget der Inhaber selbst (`governance.md`, `code-review.md` Merge-Regel).

### Befunde
| # | Grad | Datei:Zeile | Befund | Fehlerfall | Artikel |
|---|---|---|---|---|---|
| 1 | 🟡 | specs/04-fundament/zeiten.md:87 (zusammen mit PR #45) | Die neue Zeile „Retro 09:52–09:55“ überschneidet sich mit der Zeile „Retro 2026-11-19 09:40–09:58“, die in PR #45 (feature/retro-04, Commit 7fd9d6f) committet ist. Damit verletzen die beiden PRs zusammen die Regel, die dieser PR einführt („die Zeilen überlappen sich nicht“). Die Korrektur auf 09:52 liegt nur als nicht committete Änderung im Arbeitsverzeichnis von feature/retro-04. | Werden beide PRs im jetzigen Stand gemergt, zählen 09:52–09:55 doppelt, und die Ist-Summe der Retro stimmt nicht. Die Korrektur muss in #45 committet werden. | XIV |
| 2 | 🟡 | specs/04-fundament/zeiten.md:87 | Merge-Konflikt mit PR #45: Beide PRs fügen Zeilen an derselben Stelle ein, nach „Verify 22:36–22:44“. `git merge-tree feature/retro-04 feature/verify-ohne-int` meldet CONFLICT in zeiten.md. | Der zweite der beiden PRs lässt sich nicht automatisch mergen. Beim Auflösen muss die Reihenfolge stimmen: Retro 22:55, dann Retro 09:40–09:52, dann 09:52–09:55. | III |
| 3 | 🟡 | docs/prozess/sdd-ablauf.md:27 (mit :21) | „Jedes Vorhaben führt `zeiten.md`“ ist eine neue Pflicht, die über die Entscheidung des Inhabers hinausgeht. Entschieden war nur „parallele Tasks zählen einmal“. Für die Datei gibt es keine Vorlage in `specs/_vorlagen/`, obwohl Zeile 21 sagt „Vorlagen für alle Dateien liegen in `specs/_vorlagen/`“. Kein `/sdd-*`-Befehl legt die Datei an, und die Methode steht nur in `specs/04-fundament/zeiten.md`. | Ein neues Vorhaben 05, das mit `/sdd-specify` … `/sdd-implement` durchläuft, bekommt nie eine `zeiten.md` und verletzt damit sofort die neue Regel. Abhilfe: entweder Vorlage und Befehlsschritt ergänzen (nach Freigabe durch den Inhaber) oder den Satz auf die Zählregel beschränken. | I, XII, XV |
| 4 | ⚪ | docs/prozess/sdd-ablauf.md:17 | Die Stufentabelle, Zeile 7, nennt weiterhin ohne Einschränkung „Release-Kandidat auf int (`/release`)“ und „⛔ Abnahme auf int“. Die Ausnahme steht nur unter „Regeln“. | Wer nur die Tabelle liest, sucht int. Ein Verweis wie „(bis Phase S: siehe Regel ‚Verify ohne int‘)“ würde reichen. | XII |
| 5 | ⚪ | docs/prozess/release.md:57/59, .claude/commands/release.md:14, docs/prozess/code-review.md:16 | Nennen int bzw. `/release` als Teil von Stufe 7 („Auslöser: Ein Vorhaben hat SDD-Stufe 7 erreicht“, „Abnahme auf int (= SDD-Stufe 7)“). Es gibt keinen Hinweis auf die Ausnahme bis Phase S. | Die Rangfolge der Dokumente ist hier keine Hilfe, weil beide Prozessdokumente gleichrangig sind. Wer von `release.md` aus kommt, startet womöglich `/release`, obwohl es laut neuer Regel entfällt. | XII |

### Checkliste
| # | Prüfpunkt | ✅/❌/– | Anmerkung |
|---|---|---|---|
| 1 | Auftrag | ✅ | Beide Entscheidungen aus retro.md (PR #45, „Was ändern wir?“) sind umgesetzt. Kleine Erweiterung über den Auftrag hinaus: Befund 3. |
| 2 | Korrektheit | ✅ | Die Regeln sind in sich schlüssig. Die Überschneidung mit #45 (Befund 1) ist eine Abstimmungsfrage zwischen den PRs. |
| 3 | Tests | – | Nur Text. Prettier und cspell lokal grün (137 Dateien, 0 Befunde). In der CI sind Format, Spec-Check, Lint, Typecheck, Knip, Modulgrenzen, Infra, Rechtschreibung und Repo-Einstellungen grün. Secret-Scan und Image liefen zum Zeitpunkt des Reviews noch. |
| 4 | Eingaben | – | keine Systemgrenze |
| 5 | Sicherheit | ✅ | keine Secrets und keine internen Angaben (Konten, IPs, Beträge) |
| 6 | Datenschutz | – | |
| 7 | Mensch im Loop | ✅ | Das Gate „⛔ Abnahme auf `main`“ bleibt eine Freigabe durch den Inhaber. Der Merge durch den Inhaber ist im PR genannt. |
| 8 | Zerstörerisches | – | |
| 9 | Code-Qualität | – | kein Code |
| 10 | Abhängigkeiten | – | keine neuen |
| 11 | Fehler | – | |
| 12 | Doku | ✅ | Changelog und Stand im Kopf von sdd-ablauf.md sind angepasst, `/sdd-verify` ist passend zur Regel geändert. Verweise in release.md und code-review.md fehlen (Befund 5, Hinweis). |

### Zusammenfassung für den Inhaber
Die Änderung schreibt zwei Entscheidungen aus der Retro in die Prozessregeln. Erstens: Solange es int nicht gibt, wird Stufe 7 auf dem aktuellen `main` abgenommen, und `/release` entfällt. Zweitens: Laufen Tasks parallel, wird die Zeit nur einmal gezählt. Es gibt kein technisches Risiko, aber zwei Punkte zur Abstimmung mit dem Retro-PR #45. Beide PRs ändern dieselbe Stelle im Zeitprotokoll, deshalb muss der zweite nach dem ersten angepasst werden. Außerdem überschneidet sich die Retro-Zeit in #45 noch mit der Zeit dieses PRs; die Korrektur liegt bisher nur lokal und ist nicht committet. Bitte zudem entscheiden, ob jedes künftige Vorhaben wirklich ein Zeitprotokoll führen muss. Falls ja, fehlen dafür eine Vorlage und ein Schritt in den Befehlen.

---

## Umsetzung der Befunde (Nachtrag)

1. 🟡 Die Korrektur auf 09:40–09:52 ist in #45 committet und gemergt. Die Zeilen überlappen sich nicht mehr.
2. 🟡 `main` (mit #45) eingeholt, Konflikt in `zeiten.md` gelöst, Retro-Zeilen nach Startzeit sortiert: 22:55, 09:40, 09:52, 09:55.
3. 🟡 Die Pflicht ist gestrichen. Die Regel lautet jetzt: „Führt ein Vorhaben eine `zeiten.md` … und laufen Tasks parallel, …“. Ob jedes Vorhaben eine `zeiten.md` braucht (dann mit Vorlage und Befehlsschritt), entscheidet der Inhaber getrennt.
4. ⚪ Stufentabelle, Zeile 7: Verweis „(bis Phase S: Regel ‚Verify ohne int‘)“.
5. ⚪ Hinweise ergänzt in `release.md` (Auslöser, Stand), `.claude/commands/release.md` (Einleitung) und `code-review.md` (Ebene 3, Stand).
