## Review: PR #48 (feature/projekt-plattform-spec) · Vorhaben 05-projekt-plattform · Stufe 1 (Specify), keine Tasks

Ergebnis: ✅ mergebar (kein 🔴). Es gilt weiter das Gate „⛔ Spec freigegeben“ durch den Inhaber. Die vier 🟡 sollten vor der Freigabe oder spätestens in Stufe 2 (Clarify) erledigt werden.

### Befunde
| # | Grad | Datei:Zeile | Befund | Fehlerfall | Artikel |
|---|---|---|---|---|---|
| 1 | 🟡 | specs/05-projekt-plattform/spec.md:48 | AK-3 fordert „dieselben Pflicht-Checks wie `werkstatt`“. Die Klammer zählt aber nur einen Teil auf. Die CI von `werkstatt` hat außerdem Lint, Typecheck, Knip, Modulgrenzen, Repo-Einstellungen und Infra (OpenTofu) (Job-Liste von PR #48). Typecheck und Tests stehen weder in der Klammer noch ausdrücklich unter „Code-Qualität“. | Beim Test „Negativtest je Check“ ist offen, welche Checks geprüft werden. Eine Vorlage ohne Typecheck- und Test-Job würde AK-3 nach der Klammer erfüllen, nach dem Hauptsatz aber nicht. Bei einem Projekt ohne IaC ist auch offen, ob „Infra (OpenTofu)“ Pflicht ist. Das hängt mit den offenen Fragen 9 und 10 zusammen. | II, XV |
| 2 | 🟡 | spec.md:54 | AK-9 verlangt, dass jede „Abschwächung“ der übernommenen Regeln erkannt wird. Der Nachweis prüft nur „Artikel gelöscht“. Eine Abschwächung durch Umformulierung ist so nicht prüfbar. Prüfbar wäre z. B. „jede Abweichung des übernommenen Textes vom zentralen Stand“. | Ein Projekt ändert in Artikel VI „Secrets gehören nie ins Repo“ zu „möglichst nicht“. Der beschriebene Negativtest bleibt grün und AK-9 gilt als erfüllt, obwohl `governance.md` („Abschwächungen nicht“) verletzt ist. | II, governance.md (Geltungsbereich) |
| 3 | 🟡 | spec.md:52, 55, 62 | Der Begriff „Projekt-Repo“ ist nicht festgelegt. `governance.md` lässt die Constitution für alle Repos der Organisation gelten, ausdrücklich auch für `codeslage/internal`. Offen bleibt, ob `internal` (und `werkstatt` als Quelle) Sync-PRs bekommen und in der Übersicht erscheinen. | Der Nachweis von AK-7 („PRs in allen Projekt-Repos gezählt“) und von AK-10 hat keine feste Soll-Menge. `internal` bekommt keinen Sync-PR, und je nach Lesart ist AK-7 erfüllt oder nicht. In diesem Fall liefe `internal` mit veralteten Regeln weiter, ohne dass es auffällt. | II, governance.md |
| 4 | 🟡 | spec.md:36, 58 | Die User Story „ich **und die KI**“ sollen die Doku an einer Adresse lesen (so auch A10: „für die KI lesbar“). Kein AK deckt das ab. AK-13 sperrt interne Bereiche hinter eine Anmeldung, die für eine Claude-Sitzung nicht vorgesehen ist. | Alle AKs sind erfüllt, aber eine Claude-Sitzung kann die interne Doku anderer Projekte im Portal nicht lesen. Die User Story ist dann nicht erfüllt und niemand bemerkt es. Lösung: ein AK ergänzen oder die Story auf öffentliche Teile bzw. Lesen im Repo eingrenzen. | I, II, XV (Punkt 1 „nichts fehlt“) |
| 5 | 🟡 | spec.md:62, 77 | Es fehlt die Regel aus `governance.md` „Scan der gesamten Git-Historie vor dem ersten Veröffentlichen eines Repos und danach monatlich“. Weder AK-17 (Übernahme bestehender Projekte) noch AK-1/AK-3 (Vorlage) nennen sie. In `werkstatt` gibt es dafür einen eigenen geplanten Workflow (`.github/workflows/history-scan.yml`, monatlich), keinen PR-Check. Die Aufzählung in AK-3 erfasst ihn deshalb nicht. | Ein bestehendes Projekt mit einem alten Token in der Historie wird in die Organisation übernommen und öffentlich gestellt. Die CI prüft nur den PR, sie ist grün, und AK-17 gilt als erfüllt. Der Token ist dann öffentlich. Der Constitution-Check VI sagt trotzdem ✅. | VI, VII, governance.md (Öffentlich vs. intern) |
| 6 | ⚪ | spec.md:79 | Der Constitution-Check VIII sagt „keine personenbezogenen Daten Dritter“. Wenn nach offener Frage 3 auch Kollegen oder Kunden Zugang bekommen, verarbeitet die Anmeldung deren E-Mail-Adressen. AK-20 verlangt nur den Eintrag in `docs/dsgvo.md`, nicht die Löschfrist aus Artikel VIII. | Nach der Antwort auf Frage 3 kann der Check VIII falsch werden. In Stufe 2 neu bewerten. | VIII |
| 7 | ⚪ | spec.md:103 / specs/03-roadmap.md (Offene Fragen, Nr. 3) | Spec-Frage 1 ist dieselbe Frage wie Roadmap-Frage 3. | Wird sie in der Spec beantwortet, bleibt sie in der Roadmap offen, wenn niemand daran denkt. Beim Clarify beide Stellen pflegen. | XII |

### Checkliste
| # | Prüfpunkt | ✅/❌/– | Anmerkung |
|---|---|---|---|
| 1 | Auftrag | ✅ | Der Diff enthält nur Stufe-1-Ergebnisse: `spec.md`, `zeiten.md` und den Roadmap-Start. Alle Roadmap-Punkte zu Phase 1.5 sind abgedeckt (Vorlage → AK-1–6, Sync → AK-7–10, Portal → AK-11–16, Übernahme → AK-17). PoC-Hosting ist sauber nach Phase S verschoben, und dass Vision-Erfolg Nr. 5 nur teilweise erreicht wird, steht offen in der Spec. Eine User Story ohne AK: Befund 4. |
| 2 | Korrektheit | ✅ | Bezüge stimmen: A9 (Vorlage `codeslage/project-template`, eigenständige Repos, Paket-Wiederverwendung später), A10 (Option A, WYSIWYG nur bei Bedarf, Schutz der internen Bereiche), `governance.md` (Geltungsbereich, Sync per PR, Ergänzungen ja und Abschwächungen nein, Liste „Öffentlich vs. intern“ in AK-15). Die Spec bleibt bei Was und Warum: Sie nennt weder Cloudflare Pages/Access noch Astro, obwohl Roadmap und A10 das tun. Unschärfen: Befunde 1–3. |
| 3 | Tests | ✅ | Jedes AK hat einen Nachweis, die meisten automatisiert am Probe-Repo, mit Negativtests (AK-3, 9, 13, 14, 15). AK-13 deckt jeden Zugriffsweg ab. Prüfbarkeit eingeschränkt bei AK-3, AK-9 und AK-7/10 (Befunde 1–3). |
| 4 | Eingaben | – | Keine Code-Änderung. Für das Portal regelt AK-15 die Prüfung vor der Veröffentlichung. |
| 5 | Sicherheit | ✅ | Keine Secrets, keine Kontonamen, IPs oder persönlichen Angaben. Die Erwähnung von `codeslage/internal` mit „Konto-Angaben“ (Frage 5) steht so schon in `governance.md`. Der Secret- und Öffentlich-Scan in der CI ist grün. Inhaltliche Lücke: Befund 5. |
| 6 | Datenschutz | ✅ | AK-20 deckt neue Dienstleister ab. Hinweis zur Löschfrist: Befund 6. |
| 7 | Mensch im Loop | ✅ | AK-8: Sync-PRs nie automatisch mergen, Freigabe durch den Inhaber. AK-19: Die Sync-Berechtigung darf nicht mergen. |
| 8 | Zerstörerisches | ✅ | Das Verschieben oder Umbenennen von Repos bei AK-17 ist im Constitution-Check V mit Freigabe je Repo markiert. |
| 9 | Code-Qualität | – | Kein Code. |
| 10 | Abhängigkeiten | – | Keine neuen. |
| 11 | Fehler | ✅ | AK-16: Mail bei fehlgeschlagenem Sync oder Portal-Build. AK-9/10 machen Abweichungen sichtbar. |
| 12 | Doku | ✅ | Roadmap: Start 2026-11-19 und Stand im Kopf aktualisiert (CLAUDE.md, „Pflege“). `zeiten.md` ab Stufe 1 nach Vorlage (sdd-ablauf.md, „Zeiterfassung“). Der Constitution-Check hat alle 16 Artikel. Lokal grün: `pnpm spec-check`, `pnpm format`, `pnpm spellcheck` (141 Dateien, 0 Funde). CI: alle Jobs grün, nur „Image (Compose + Smoke)“ lief beim Review noch. |

### Zusammenfassung für den Inhaber
Dieser PR beschreibt nur, was Phase 1.5 leisten soll. Es gibt noch keinen Code. Geplant sind eine Vorlage für neue Projekte, eine automatische Weitergabe von Regeländerungen an alle Projekte per Vorschlag, den du freigibst, und ein gemeinsames Doku-Portal mit öffentlichem und geschütztem Bereich. Die Spec ist sauber aufgebaut, bleibt ohne Technik und passt zu Roadmap, Architektur und Governance.

Das größte Risiko liegt später in der Umsetzung: Interne Doku könnte versehentlich öffentlich werden. Das sichern die Kriterien gut ab. Bei der Übernahme bestehender Projekte fehlt aber noch die Pflicht, vorher die gesamte Git-Historie nach Geheimnissen zu durchsuchen. Außerdem sind drei Kriterien noch zu ungenau, um sie sicher zu testen: Welche Prüfungen genau Pflicht sind, was als „Abschwächung“ der Regeln gilt und welche Repos überhaupt dazugehören. Und es ist offen, ob die KI die interne Doku im Portal lesen können soll.

Eine Vorschau zum Ausprobieren gibt es nicht. Bitte beantworte vor allem die vier blockierenden Fragen (welche Projekte, was der Sync umfasst, wer intern lesen darf, ob Kundenprojekte eigene Regeln haben dürfen) und entscheide die Befunde 1–5.

---

## Umsetzung der Befunde (Nachtrag)

1. 🟡 AK-3 zählt jetzt alle Pflicht-Checks von `werkstatt` auf, auch Lint, Typprüfung, Tests, ungenutzten Code, Modulgrenzen und Repo-Einstellungen. Prüfungen der Infrastruktur als Code gelten nur für Projekte, die welche haben.
2. 🟡 AK-9 erkennt jetzt jede Abweichung des übernommenen Textes (Löschung, Umformulierung, Abschwächung). Erlaubt sind nur Ergänzungen an vorgesehenen Stellen. Der Nachweis hat einen zweiten Negativtest (Satz umformuliert).
3. 🟡 Unter „Ziel“ steht jetzt der Begriff „Projekt-Repo“: alle Repos der Organisation außer `werkstatt`, also auch `codeslage/internal` und die Vorlage. Damit haben AK-7 und AK-10 eine feste Soll-Menge.
4. 🟡 Neues AK-23: Eine Claude-Sitzung liest die öffentliche Doku über das Portal. Die User Story ist auf die öffentlichen Teile eingegrenzt. Ob die KI auch die interne Doku im Portal lesen soll, ist jetzt die offene Frage 13 (Annahme: Lesen im Repo reicht).
5. 🟡 AK-17 verlangt jetzt vor Übernahme bzw. erstem Veröffentlichen einen Scan der gesamten Historie ohne Funde. Neues AK-22: Jedes Repo aus der Vorlage scannt monatlich seine Historie und meldet Funde per Mail. Der Constitution-Check VI verweist darauf.
6. ⚪ AK-20 verlangt jetzt Zweck und Löschfrist. Der Constitution-Check VIII nennt die Neubewertung in Stufe 2, falls Dritte Zugang bekommen.
7. ⚪ Wird in Stufe 2 (Clarify) umgesetzt: Die Antwort auf Frage 1 wird auch in der Roadmap (Frage 3) eingetragen.
