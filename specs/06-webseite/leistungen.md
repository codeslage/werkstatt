# 06 – Phase 2 Webseite: Leistungen

> Ergebnis der Sitzung „Leistungen“ vom 2026-11-19, Antwort auf die offene Frage 1 der Spec. Zeiten in `zeiten.md`.

> Mit dem Inhaber abgestimmt am 2026-11-19.
> Kein Webseiten-Text. Die Formulierungen unten sind die Grundlage, der endgültige Text entsteht in Stufe 6 und braucht die Freigabe des Inhabers (Artikel IX, AK-11).

## Klammer: alles AI-driven

Der Inhaber sagt: „Wichtig ist: alles AI-driven.“ Das ist die Überschrift über allen Leistungen. Sie beschreibt, **wie** codeslage arbeitet: KI-getrieben, spec-driven, und ein Mensch gibt frei. Beleg dafür ist `codeslage/werkstatt` mit der Soll/Ist-Wette (Phase 1: ≈ 14,4 h statt ≈ 50 h).

## Zielgruppe

Startups in einer frühen Phase im DACH-Raum: Gründer und Teams mit 1–10 Personen vor oder kurz nach der Gründung, oft ohne eigene Entwickler oder DevOps. Das bestätigt die Annahme A2 der Spec.

## Die vier Leistungsbereiche

| #   | Bereich                                       | Nutzen (ein Satz, Grundlage)                                                                                                     | Beleg heute                                                                                                                                                    |
| --- | --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **KI-Automatisierung von Geschäftsprozessen** | Wiederkehrende Abläufe erledigt eine KI als Entwurf, du prüfst nur noch und gibst frei.                                          | Social-Media-Agent des Inhabers; ohne Kennzeichnung „im Aufbau“ (Entscheidung 6, 2026-11-26), der erste Workflow (Anfrage → Angebotsentwurf) folgt mit Phase 3 |
| 2   | **Prototyp / MVP**                            | Aus deiner Idee wird in Tagen, nicht in Monaten, ein lauffähiger Prototyp: zum Testen mit Nutzern und zum Zeigen vor Investoren. | Arbeitsweise der Werkstatt, Soll/Ist-Wette                                                                                                                     |
| 3   | **Infrastruktur & CI**                        | Ein sauberes, sicheres Fundament ab dem ersten Commit, reproduzierbar, in der EU und mit niedrigen laufenden Kosten.             | Phase 1: CI, OpenTofu, DNS-Umzug mit Mail, Secret-Scan                                                                                                         |
| 4   | **KI-Entwicklung einführen**                  | Dein Team entwickelt mit KI-Agenten schneller, ohne die Kontrolle über Qualität und Sicherheit zu verlieren.                     | Constitution, SDD-Ablauf, Gates, Review-Agent der Werkstatt                                                                                                    |

Die Nutzen-Sätze hat der Inhaber als Grundlage bestätigt.

## Wie konkret

- Je Leistung ein Nutzen-Satz und **1–2 Beispiele**. Es gibt keine Pakete und keine Paketpreise.
- Ein gemeinsamer **Ablauf** für alle Bereiche: Erstgespräch → Spec → PoC → MVP.

## Preise: auf Anfrage, dazu Pilotprojekte

Geändert am 2026-11-19 um 15:32. Vorher stand hier „kostenlose Pilotprojekte, keine Preise“.

- **Preise auf Anfrage.** Auf der Seite stehen keine Preise und nirgends das Wort „kostenlos“. Begründung des Inhabers: Das wirkt wie ein echter Dienstleister, lockt keine Leute an, die nur etwas umsonst wollen, und hält die Tür für bezahlte Aufträge offen.
- **Pilotprojekte:** Dazu kommt ein Satz wie „Die ersten Startups begleiten wir als Pilotprojekt zu besonderen Konditionen, gegen Feedback und eine Case Study.“ Welche Konditionen gelten (bis hin zu 0 €), entscheidet der Inhaber im Gespräch. So bleiben die Friendly User aus der Vision möglich.
- Bedingungen für Pilotprojekte (alle vom Inhaber gewählt):
  - **Feedback und Bericht:** Gegenleistung sind ehrliches Feedback und die Erlaubnis, als Case Study darüber zu berichten (anonymisiert oder mit Namen).
  - **Begrenzte Plätze:** höchstens **zwei Pilotprojekte gleichzeitig**.
  - **Ein Mensch gibt frei:** KI erstellt Entwürfe, ein Mensch prüft und gibt frei. Das steht auch auf der Seite.
  - **Der Code gehört dem Kunden:** Ergebnisse und Code gehen an das Startup. Wissen und allgemeine Bausteine darf codeslage wiederverwenden (Artikel XIII).

## Nicht im Angebot (steht so auf der Seite)

- **Betrieb mit SLA:** kein 24/7-Betrieb, keine Bereitschaft, keine Zusagen zur Verfügbarkeit.
- **Nur Tools betreiben:** kein reines Hosten fertiger Tools ohne Automatisierung.

Bewusst **nicht erwähnt**, also weder angeboten noch ausgeschlossen:

- **Mobile Apps:** kommen erst auf die Seite, wenn es ein eigenes Beispiel gibt.

## Noch offen

1. **Beispiele je Leistung:** entschieden im Entwurf T-14 (2026-11-26): je Bereich ein Beispiel aus der Werkstatt.
2. **Große Projekte, Verträge, Gewährleistung:** entschieden im Entwurf T-14 (2026-11-26): nicht unter „Nicht im Angebot“; „Preise auf Anfrage“ lässt große Projekte im Einzelfall offen.
3. **Rechtliches zum Angebot auf der Seite:** Niemand hat geprüft, ob ein Angebot mit „Preise auf Anfrage“ auf der Seite eines Hobbyprojekts ohne Gewerbe unbedenklich ist (Haftung, Impressum, „geschäftsmäßiges Angebot“). Claude ersetzt keine Rechtsberatung. Gehört zu AK-12 und Annahme A3.
4. **Erstgespräch:** entschieden am 2026-11-23: 30 Minuten, Buchung über einen Link auf Google Kalender oder per Mail (Spec A9, T-12).
5. **Vision, offene Frage 2 (Positionierung):** Wird durch dieses Ergebnis weitgehend beantwortet („AI-driven für frühe Startups“). Die Hauptsitzung sollte prüfen, ob `01-vision.md` nachgezogen wird.
6. **Umgang mit „im Aufbau“:** entschieden im Entwurf T-14 (2026-11-26): kleine Kennzeichnung neben der Überschrift; sie fällt weg, wenn der erste Ablauf (Phase 3) abgenommen ist. **Nachtrag 2026-11-26 (Abnahme der Texte):** Die Kennzeichnung entfällt schon jetzt, entschieden mit dem Inhaber; die KI-Automatisierung steht ohne Zusatz neben den anderen drei Bereichen.
7. **Bezahlte Anfrage, Gewerbe und Vision:** Die Vision sagt „Hobby, kein Gewerbe, keine Rechnungen“. Für die Webseite ist „auf Anfrage“ kein Widerspruch. Nimmt der Inhaber Geld an, klärt er vorher die persönlichen und rechtlichen Voraussetzungen (u. a. Gewerbeanmeldung, eventuell als Kleinunternehmer; Einzelheiten intern). Dann wird auch `01-vision.md` (Rahmenbedingungen und Nicht-Ziele) angepasst. Für die Hauptsitzung: Prüfen, ob die Vision schon jetzt den Satz „bezahlte Aufträge nur nach Gewerbeanmeldung“ bekommen soll.
