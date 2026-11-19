## Review: PR #55 (`feature/webseite-tasks`, Head b012af3) · Vorhaben 06-webseite · Stufen 4 (Tasks) und 5 (Analyze), T-01 bis T-27 angelegt

Ergebnis: ✅ mergebar (kein 🔴 offen; vier 🟡 sollten im selben PR behoben oder begründet werden)

Basis: Geprüft gegen `origin/main`. Das lokale `main` ist veraltet: Es enthält #54 noch nicht, deshalb zeigt `git diff main...` fälschlich auch die Plan-Dateien. Der PR ändert 12 Dateien.
Lokal geprüft: `format`, `spellcheck`, `spec-check`, `lint` und `test` (103 Tests) sind grün. Alle 11 CI-Checks von PR #55 sind grün.

### Befunde
| # | Grad | Datei:Zeile | Befund | Fehlerfall | Artikel |
|---|---|---|---|---|---|
| 1 | 🟡 | `specs/06-webseite/tasks.md:22` (T-04) und `:74` (PR-Zuschnitt) | T-04 (Layout, Navigation, alle Seiten, 404, `_headers`) liegt in PR-1. Ihr Test ist laut Spalte „Test“ T-05, und T-05 kommt erst in PR-2. | PR-1 bringt Layout, Navigation und die 404-Seite nach `main`, ohne dass ein Test sie prüft. Das widerspricht „Tests werden vor oder mit dem Code geschrieben, nicht danach“ und der Regel 1 für Stufe 6 in `tasks.md:82`. Im Review von PR-1 wäre das ein 🔴. Abhilfe: T-05 nach PR-1 ziehen oder T-04 in PR-2 verschieben. | II, III |
| 2 | 🟡 | `specs/06-webseite/tasks.md:26` (T-08) zusammen mit `:22` (T-04) und `:66` (T-23) | T-08 (PR-3) führt den Test „Build enthält kein `[…]`“ ein. T-04 legt aber alle Seiten mit Platzhaltern an, und deren Texte ersetzen erst T-12 bis T-18 (PR-6 bis PR-11). Laut Plan (Z. 93) soll der Test erst „vor Schritt 6“ greifen. | Nach dem Merge von PR-3 stehen auf Leistungen, Kontakt, Impressum usw. noch `[…]`-Platzhalter. Der neue Test in PR-3 wird damit rot, und PR-3 lässt sich nicht mergen. Man müsste den Test überspringen, was Art. II verbietet. Abhilfe: In T-08 nur Titel, Navigation, Footer und 404 prüfen und die Prüfung des ganzen Builds erst in T-23 scharf schalten, oder die Reihenfolge ausdrücklich festlegen. | II |
| 3 | 🟡 | `specs/06-webseite/tasks.md:58` (T-20, Spalte Test) | Der Test von T-20 verlangt „`tofu plan` (lokal, mit Ausgabe im PR)“, sagt aber nichts über Maskierung. In `infra/tofu/live/variables.tf:1-4` ist `account_id` nicht `sensitive`. `.github/workflows/drift.yml:63-71` maskiert IDs deshalb ausdrücklich, weil die Logs öffentlich sind. | Ein neues Pages-Projekt und die Web-Analytics-Seite brauchen `account_id = var.account_id`. Der lokale Plan zeigt die Konto-ID dann im Klartext. Kopiert man die Ausgabe 1:1 in den öffentlichen PR, steht die Konto-ID öffentlich. `governance.md` („Angaben zu Konten: Kontonamen oder -IDs“) verbietet das, und der Secret-Scan prüft PR-Beschreibungen nicht. Abhilfe: In T-20 „Ausgabe mit maskierten IDs (wie `drift.yml`)“ festschreiben. | VI, VII, `governance.md` |
| 4 | 🟡 | `specs/06-webseite/spec.md:83` gegen `gestaltung.md:25`, `:123` und `tasks.md:33` (T-10), `:97` (Analyse) | Die Spec sagt „ohne Stockfotos und Verläufe“. `gestaltung.md` macht eine Ausnahme: das Relief mit dem Verlauf `#454B55` → `#1E2228`. T-10 setzt genau dieses Relief-Zeichen in den Header jeder Seite. Die Analyse meldet „Kein Widerspruch zu Spec“, geht auf diesen Punkt aber nicht ein. | Wer die Spec liest, findet auf jeder Seite einen Verlauf, den die Spec ausschließt. Laut Rangfolge geht die Spec vor `gestaltung.md`. Ein späteres Review von PR-5 (T-10) könnte das deshalb als Spec-Verstoß werten. Die Ausnahme hat der Inhaber entschieden, sie steht aber nicht in der Spec. Abhilfe: In `spec.md:83` „(Ausnahme: Relief im Logo-Zeichen, Entscheidung des Inhabers, `gestaltung.md`)“ ergänzen und den Punkt in der Analyse als „Gefundene Lücke“ aufführen. | I, IV |
| 5 | ⚪ | `specs/06-webseite/tasks.md:94` (Analyse, AK-Zuordnung) | „AK-11 T-08, T-10 bis T-18“ zählt T-10 mit, aber in T-10 (`:33`) steht nur AK-17 und AK-18. Ebenso zählt „AK-2 T-20 bis T-26“ T-23 mit, und T-23 (`:66`) nennt AK-2 nicht. | Die Zuordnung in der Analyse stimmt nicht mit den Spalten der Tasks überein. T-10 ist ein Text-PR (📝), AK-11 gehört deshalb in die AK-Spalte von T-10. | II |
| 6 | ⚪ | `specs/06-webseite/gestaltung.md:78` | Der Kontrast des flachen Zeichens ist mit „7,6:1“ angegeben. Nach WCAG-2-Formel ergibt `#6FD69A` auf `#1E2228` 8,95:1. Die 7,6 stammt wohl noch aus der blauen Fassung. | Der Wert widerspricht dem Satz „Werte nachgerechnet“ (Z. 32). Er ist zu niedrig angegeben, AK-18 ist also nicht gefährdet. | XII |
| 7 | ⚪ | `specs/06-webseite/gestaltung.md:80-86`, `:119`, `:125` | Überholte Aussagen stehen weiter im Text: Die Dateitabelle nennt `logo-zeichen-dunkel.svg` (gelöscht) und „logo-zeichen.svg für helle Flächen“. Runde 4 nennt „viewBox 230 × 36“ und „noch nicht in der Vorschau geprüft“. Runde 5 sagt „favicon … bleiben flach (blau, `#1747C8`)“. Z. 129 und Z. 141 heben das zwar auf. | Wer T-09 oder T-10 umsetzt und nur den Abschnitt „Logo“ liest, findet eine Datei, die es nicht mehr gibt, und eine blaue Favicon-Farbe. Abhilfe: Die Tabelle Z. 80-86 durch einen Verweis auf „Dateien (Stand Runde 7)“ ersetzen und die Nachträge als „überholt durch Runde 7“ kennzeichnen. | XII |
| 8 | ⚪ | `specs/06-webseite/zeiten.md:46`, `:32-40` | Der Satz „Zwischen 15:56 und 19:25 lag eine Pause des Inhabers … steht deshalb in keiner Zeile“ stimmt nicht mehr, denn die Zeilen 32-36 (16:32-16:58, Nachtrag Gestaltung) liegen in diesem Zeitraum. Außerdem stehen die Nachtrags-Zeilen nicht in zeitlicher Reihenfolge, sondern hinter „Plan“. | Wer liest, dass in diesem Zeitraum keine Zeile steht, findet dort doch fünf Zeilen. Die Summen stimmen trotzdem (siehe unten). Abhilfe: „Pause in der Hauptsitzung; die Gestaltungs-Sitzung lief 16:32-16:58 weiter“. | XIV |

Geprüft und in Ordnung (zu den fünf Prüfpunkten des Auftrags):
- **Abdeckung von Plan und AKs:** Jeder Plan-Schritt 1-6 hat Tasks, auch die Text- und Technik-Trennung, `.env.example`, das Pflicht-Modell `ci-ok` bzw. Ruleset, „nur plan, kein apply“, die Token-Rechte, das Environment `production`, MX/SPF/DKIM/DMARC festhalten und die Web-Tests im Drift-Workflow. Alle 18 AKs haben mindestens eine Task. Jede der 27 Tasks hat AK, Test, Abhängigkeit (oder „–“) und Soll.
- **Summen:** Schritt 1 = 12,5 · 2 = 3,5 · 3 = 7,75 · 4 = 2,75 · 5 = 4,75 · 6 = 4,5. Gesamt 35,75 h, stimmt.
- **Analyse:** Sie ist im Kern richtig. Kleine Ungenauigkeiten siehe 5, die fehlende Ausnahme für Verläufe siehe 4.
- **Kontraste (nachgerechnet):** Waldgrün hell 5,27:1 auf Weiß und 4,82:1 auf der Fläche. Waldgrün dunkel 10,6:1 bzw. 9,69:1. Nebentext 7,87/7,21 (hell) und 7,5/6,86 (dunkel). Text 17,79 bzw. 15,67. Alle Werte erfüllen WCAG AA, AK-18 ist erfüllbar.
- **Interna nach `governance.md`:** In `gestaltung.md`, `tasks.md`, dem Protokoll und `zeiten.md` stehen keine personenbezogenen Kontaktdaten, keine Konten, keine Arbeitgeber, keine Hosts und keine Vorschau-Links. Nur Produktnamen wie „Jira“ und „Apple-Design“ kommen vor, das ist unkritisch.
- **SVGs:** Alle fünf Dateien enthalten nur den `xmlns`-Namensraum. Sie haben kein `href`/`xlink:href`, kein `<script>`, keine `on…`-Handler, kein `<image>` und kein `<foreignObject>`. `url(#…)` verweist nur auf interne Verläufe und Filter, Schriften werden nicht von außen geladen.
- **`zeiten.md`:** Die Zeilen überlappen sich nicht. 19:47-19:47 und 19:47-19:48 berühren sich nur. Die Nachtrags-Zeilen 16:32-16:58 liegen in einer Lücke ohne andere Zeile. Summen: Clarify Arbeit 14 + 9 = 0:23, Wartezeit 4 + 27 = 0:31, gesamt 0:54. Spec, Plan und Tasks stimmen ebenfalls. Die Zeile Analyze steht noch auf „läuft“ und wird vor dem Merge geschlossen.

### Checkliste
| # | Prüfpunkt | ✅/❌/– | Anmerkung |
|---|---|---|---|
| 1 | Auftrag | ✅ | Der Diff besteht aus Stufe 4/5 sowie Gestaltung, Zeiten, Protokoll, CHANGELOG und Wortliste. Nichts geht darüber hinaus, alle Plan-Schritte sind abgedeckt. |
| 2 | Korrektheit | ✅ | Summen und Abhängigkeiten sind schlüssig. Zwei Reihenfolge-Probleme für Stufe 6 siehe Befunde 1 und 2 (🟡). |
| 3 | Tests | ✅ | Jedes AK hat einen geplanten Test. Befund 1: Der Test für T-04 kommt einen PR zu spät. Befund 2: Der Platzhalter-Test kommt zu früh. |
| 4 | Eingaben | ✅ | Die Prüfung von `IMPRESSUM_*` ist in T-03 mit Negativfällen geplant. Kein Code im Diff. |
| 5 | Sicherheit | ✅ | Keine Secrets und keine Interna im Diff, die SVGs sind sauber. Für Stufe 6 droht ein Abfluss der Konto-ID in der Plan-Ausgabe, siehe Befund 3 (🟡). |
| 6 | Datenschutz | – | Kein Code, der Daten verarbeitet. Die Einträge in `dsgvo.md` sind in T-19 geplant. |
| 7 | Mensch im Loop | ✅ | Text-PRs (📝), Freigaben (⛔) und die Gesamtabnahme T-23 vor dem Livegang sind markiert. Die Logo-Freigabe steht in `gestaltung.md`. |
| 8 | Zerstörerisches | ✅ | Im Diff nicht vorhanden. Gelöscht wird nur `logo-zeichen-dunkel.svg`, eine Gestaltungsdatei, auf die nichts mehr verweist. `apply` ist in T-25 hinter ⛔ gelegt. |
| 9 | Code-Qualität | – | Kein Code. Die überflüssige SVG ist entfernt. |
| 10 | Abhängigkeiten | – | Keine neuen Pakete in diesem PR. |
| 11 | Fehler | – | Kein Code. |
| 12 | Doku | ✅ | CHANGELOG, Protokoll und `zeiten.md` sind gepflegt, `project-words.txt` ergänzt. Die Spec-Zeile zu Verläufen fehlt (Befund 4), dazu kleinere veraltete Stellen (Befunde 6-8). |

### Zusammenfassung für den Inhaber
Dieser PR enthält noch keinen Code. Er legt fest, wie die Webseite gebaut wird: 27 Arbeitsschritte mit zusammen gut 35 Stunden Schätzung, dazu eine Prüfung, ob Spec, Plan und Schritte zusammenpassen. Außerdem übernimmt er die finale Gestaltung (Waldgrün, grünes `>_` auf dunkler Kachel). Die Farben habe ich nachgerechnet: Sie sind gut lesbar, und die Logo-Dateien enthalten nichts Gefährliches. Drei Punkte sollten vor dem Bauen noch angepasst werden. Erstens kommen zwei Tests in der falschen Reihenfolge, sodass ein Teil zuerst ungetestet bliebe und ein anderer Test zu früh rot würde. Zweitens muss bei der späteren Vorschau der DNS-Änderungen die Cloudflare-Konto-ID unkenntlich gemacht werden, bevor sie im öffentlichen PR landet. Drittens sagt die Spec „keine Verläufe“, Ihr Logo hat aber bewusst einen. Diese Ausnahme sollte auch in der Spec stehen. Ausprobieren kann man noch nichts. Schauen Sie sich am besten die Logo-Dateien im Ordner `gestaltung/` einmal auf hellem und dunklem Hintergrund an.

Relevante Dateien (Pfade beim Ablegen auf das Repo gekürzt): `specs/06-webseite/tasks.md`, `specs/06-webseite/gestaltung.md`, `specs/06-webseite/zeiten.md`, `specs/06-webseite/spec.md`, `infra/tofu/live/variables.tf`, `.github/workflows/drift.yml`

## Umsetzung der Befunde (Nachtrag)

1. 🟡 T-04 liegt jetzt mit T-05 bis T-07 in PR-2: Layout, Seiten und ihre E2E-Tests kommen im selben PR. PR-1 enthält nur T-01 bis T-03 mit Unit-Tests.
2. 🟡 Der Test in T-08 prüft nur Titel, Beschreibungen, Navigation, Footer und 404. Die Prüfung „kein Platzhalter im gesamten Build“ kommt mit T-23.
3. 🟡 T-20: Die `plan`-Ausgabe kommt nur mit maskierten IDs in den PR (wie `drift.yml`).
4. 🟡 `spec.md`, Abschnitt „Inhalte“: Ausnahme „Relief im Logo-Zeichen, Entscheidung des Inhabers vom 2026-11-19“ ergänzt. Die Analyse führt den Punkt als gefundene Lücke. Das ist keine neue Anforderung, sondern hält eine Entscheidung des Inhabers aus der Gestaltungs-Sitzung fest.
5. ⚪ T-10 nennt jetzt AK-11. Die Analyse ordnet AK-2 den Tasks T-20 bis T-22 und T-24 bis T-26 zu.
6. ⚪ Kontrast des flachen Zeichens auf „≈ 9,0 : 1“ korrigiert.
7. ⚪ Die Dateitabelle im Abschnitt „Logo“ ist durch einen Verweis auf „Dateien (Stand Runde 7)“ ersetzt. Die Nachträge zu Runde 4 und 5 sind als „überholt durch Runde 7“ gekennzeichnet.
8. ⚪ Der Satz in `zeiten.md` stellt jetzt klar, dass die Pause nur die Hauptsitzung betraf und die Gestaltungs-Sitzung 16:32–16:58 weiterlief.

Kein 🔴: Nach `code-review.md` braucht es keinen zweiten Durchgang. Die Zeile „Analyze“ ist vor dem Merge geschlossen (2026-11-19 22:38).
