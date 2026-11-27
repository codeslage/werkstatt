# Content-Notizen: Phase 2 – Webseite (Klick-Dummy)

> Stand: 2026-11-27 · Bezug: `specs/06-webseite/retro.md`, `specs/03-roadmap.md` („Soll/Ist – die Wette“)
> Rohmaterial für Case Study, Talk und Podcast (Constitution, Artikel XII). Keine Preise, Konten oder internen Angaben (`governance.md`, „Öffentlich vs. intern“).

## Kernaussage

Eine statische Firmenseite mit sieben Seiten, eigenem Logo, Hell- und Dunkelmodus, Besuchsmessung ohne Cookies, Impressum, Datenschutz und einer Case Study ging in **12,0 Stunden** gemeinsamer Sitzungszeit live. Geschätzt waren 35,75 h. Von der Sitzungszeit war gut die Hälfte Wartezeit auf den Inhaber, die reine Arbeit lag bei 5,8 h. Laufende Kosten: 0 €.

Der Inhaber: Die Qualität der Webseite sei „wirklich gut“, das Design gefalle ihm.

## Die Wette: Erwartung gegen Ergebnis

| Wer          | Erwartung vorher                                      | Ergebnis                                                          |
| ------------ | ----------------------------------------------------- | ----------------------------------------------------------------- |
| Claude       | 35,75 h (Summe der Tasks), 1–2 Wochen bei ~20 h/Woche | 12,0 h, also gut ein Drittel der eigenen Schätzung                |
| Inhaber      | keine eigene Schätzung                                | –                                                                 |
| Kalenderzeit | –                                                     | 9 Tage, an 6 Tagen gearbeitet, nebenbei und parallel zu Phase 1.5 |

Wie in Phase 1 hat sich Claude deutlich überschätzt. Neu ist, dass die Wartezeit größer war als die Arbeit. Bei einer KI-getriebenen Entwicklung ist der Mensch der Engpass, nicht die Maschine, und das ist gewollt: Jeder Text braucht seine Freigabe.

## Wie gearbeitet wurde: Koordination und Unterchats

- Der Inhaber arbeitet nur noch in Claude Code. Eine Koordinationssitzung steuert das Vorhaben und startet für jede Task eine eigene Sitzung. Jede dieser Sitzungen hat einen frischen Kontext und meldet sich, wenn sie fertig ist.
- Startseite, Projekte und Rechtliches liefen so parallel, jede Sitzung auf ihrem eigenen Branch und mit eigenem PR.
- Der Wunsch des Inhabers: Das soll fest eingebaut sein. Jede neue Aufgabe bekommt einen frischen Kontext, und eine Sitzung orchestriert das gesamte Vorhaben.

## Geschichten für den Talk

- **Die Sperre, die alle aussperrte:** Der neue Pflicht-Check stand im Ruleset, bevor es den Job auf `main` gab. Kein PR konnte mehr mergen, auch der nicht, der den Job bringen sollte.
- **„CI grün“, aber nicht auf diesem Commit:** Eine Sitzung meldete Grün, während auf dem neuesten Commit noch geprüft wurde. Seitdem gilt: erst den Check auf genau diesem Commit ansehen, dann mergen.
- **Der Test, der die falsche Seite prüfte:** Lokal hat der Testlauf die Vorschau einer anderen Sitzung erwischt, die noch auf demselben Port lief. Parallele KI-Sitzungen auf einem Rechner brauchen getrennte Ports.
- **Die Leitplanke greift:** Als Claude einen Branch per Rebase neu aufgesetzt hatte und ihn mit Gewalt pushen wollte, wurde das blockiert. Die Regel „kein Force-Push ohne Freigabe“ hat also nicht nur auf dem Papier gestanden.

## Zahlen

- 22 PRs der Phase, 27 Review-Berichte mit 10 🔴 und 53 🟡, alle erledigt
- 95 E2E-Tests, Lighthouse ≥ 90 in allen vier Kategorien auf jeder Seite, Kontrast WCAG AA hell und dunkel
- 0 Cookies, 0 Formulare, 0 € laufende Kosten
- 12,0 h Ist gegen 35,75 h Soll, davon 5,8 h Arbeit und 6,2 h Wartezeit

## Für später

- Der Token-Verbrauch ist hoch. Ein größeres Abo lohnt sich noch nicht, wird aber wohl die erste große Investition. Das ist ein guter Punkt für die Kostenfrage im Talk: Was kostet KI-Entwicklung wirklich?
