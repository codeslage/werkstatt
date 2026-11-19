# Content-Notizen: Phase 1 – Fundament

> Stand: 2026-11-19 · Bezug: `specs/04-fundament/retro.md`, `specs/03-roadmap.md` („Soll/Ist – die Wette“)
> Rohmaterial für Case Study, Talk und Podcast (Constitution, Artikel XII). Keine Preise, Konten oder internen Angaben (`governance.md`, „Öffentlich vs. intern“).

## Kernaussage

Ein komplettes technisches Fundament – öffentliches Monorepo mit CI, die die eigene Constitution durchsetzt, DNS als Code mit Mail-Umzug, verschlüsselter State, lokale Umgebung mit Container-Images, Alarme – entstand in **gut 14 Stunden** gemeinsamer Sitzungszeit (13,8 h bis zur Abnahme, dazu ≈ 0,5 h Retro). Der Inhaber hat dabei keine Zeile Code geschrieben.

Der Inhaber: „Wahrscheinlich geht alles, was man sich vorstellen kann, in absurd kurzer Zeit.“

## Die Wette: Erwartung gegen Ergebnis

| Wer          | Erwartung vorher                                        | Ergebnis                                                        |
| ------------ | ------------------------------------------------------- | --------------------------------------------------------------- |
| Claude       | ≈ 50 h Arbeit, 2–3 Wochen bei ~20 h/Woche (konservativ) | ≈ 14,4 h, also gut ein Viertel der eigenen Schätzung            |
| Inhaber      | 2–5 Arbeitstage                                         | ≈ 2 Arbeitstage, wenn man die gut 14 h am Stück rechnet         |
| Kalenderzeit | –                                                       | 2 Wochen, weil das Vorhaben nebenbei lief; Sitzungen an 7 Tagen |

Der Inhaber lag näher dran als Claude. Interessant für den Talk: Die KI hat sich selbst unterschätzt, vermutlich weil sie in menschlichen Arbeitsstunden geschätzt hat.

## Wer hat was gemacht?

- **Der Inhaber:** entschieden, freigegeben, abgenommen. Dazu alles, was nur ein Mensch darf oder kann: Anmeldungen, Klicks beim Registrar und in Docker Desktop, Secrets setzen, Pflicht-Checks im Ruleset eintragen, eine Testmail schicken. Außerhalb der Sitzungen hat er nichts für das Vorhaben getan; auch die Einrichtung beim Registrar lief mit Anleitung von Claude.
- **Claude:** Specs, Plan, Tasks, sämtlicher Code und alle Tests, CI, OpenTofu, DNS-Umzug, Runbooks, Protokolle, Fehlersuche, Zeiterfassung, Changelog. Dazu ein zweiter Claude als unabhängiger Review-Agent für jeden PR.
- **Die Grenze dazwischen** ist gewollt (Constitution, Artikel IX „Mensch im Loop“): Wo Claude an Rechte stieß, etwa beim Ruleset oder bei Werten in `.env`, blieb der Schritt beim Inhaber. Das hat Wartezeit gekostet, die mitgezählt ist.

## Zahlen

- 42 gemergte PRs, davon 6 von Dependabot
- 35 Review-Berichte mit 52 🟡 und 7 🔴; 3 der 🔴 stammen aus dem absichtlichen Negativtest, die übrigen wurden vor dem Merge behoben oder vom Inhaber freigegeben
- 103 Unit-, 22 Infra- und 9 Smoke-Tests
- 25 Protokolle, 10 ADRs
- zusätzliche laufende Kosten: 0 €

## Momente für Talk und Podcast

- **Der Negativtest:** Absichtlich eingeschmuggelte IP-Adresse, Mail-Adresse und ein gesperrter Begriff. CI und Review-Agent haben alle drei unabhängig erkannt; den lokalen Hook hatten wir dafür bewusst übersprungen, er hat einen eigenen Test (AK-24).
- **Die neue Sitzung, die eine Regel übersprang:** Eine frische Claude-Sitzung kannte die Regeln, hat bei einer „Kleinigkeit“ aber Einstufung und eigenen Branch übersprungen. Daraus wurde eine schärfere Regel in `CLAUDE.md`, und der Wiederholungstest bestand (AK-17).
- **Mail-Umzug ohne Ausfall:** Nameserver zu Cloudflare, alle Records vorher als Code nachgebaut und verglichen.
- **Rechnerwechsel mittendrin:** Von Windows auf einen neuen Mac. Kostete eine Plan-Version und eine Sitzung, und die Einrichtung des neuen Mac wurde gleich zum Nachweis, dass die Anleitung auf einem frischen Rechner funktioniert.
- **Der Review-Agent prüft auch den Prüfer:** In Stufe 7 hat er Claudes eigene Abnahme gegengelesen und zwei ungenaue Aussagen gefunden.

## Offene Fragen für die Case Study

- Wie verändert sich das Verhältnis Mensch/KI, wenn Tasks parallel laufen (echte Projekte)?
- Wie viel der gut 14 h war Warten auf den Menschen? (Die Zeilen nennen Wartezeit nur in der Bemerkung; die längste reine Wartezeit waren 1:55 h.)
