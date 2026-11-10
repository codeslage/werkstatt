# 01 – Vision

> Status: **Entwurf** – wartet auf Freigabe
> Stand: 2026-11-04
> Bezug: `CONSTITUTION.md` (v1.1.0)

## Ziel

codeslage ist (vorerst) ein **Lern- und Portfolio-Projekt** mit dem Anspruch, wie ein echter IT-Dienstleister für Startups zu arbeiten. Das eigene Setup ist das Schaufenster: Alles, was codeslage Kunden später anbieten will, wird zuerst an sich selbst gebaut, betrieben und öffentlich dokumentiert.

Der Kern des Schaufensters ist **KI-getriebene Automatisierung von Geschäftsprozessen** – nicht das bloße Betreiben fertiger Tools.

> Leit-User-Story: _Als Inhaber von codeslage möchte ich, dass für eine eingehende Kundenanfrage automatisch ein Angebotsentwurf erstellt wird, damit ich ihn nur noch prüfen, anpassen und freigeben muss._

## Rahmenbedingungen

| Thema        | Festlegung                                                                                                                        |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| Rechtsform   | Hobby, kein Gewerbe angemeldet, keine Rechnungen                                                                                  |
| Zeit         | bis zu ~20 h/Woche                                                                                                                |
| Budget       | ~30 €/Monat gesamt (inkl. Google Workspace, Domain, Claude-Abo); Infrastruktur also **≤ ~10–15 €/Monat** zusätzlich               |
| Markt        | DACH, Webseite zunächst Deutsch                                                                                                   |
| Nutzer       | zunächst nur der Inhaber; später Mitarbeitende/Freelancer; Friendly User geben Feedback (zahlen nicht)                            |
| Projekte     | eigene Projekte und PoCs als separate GitHub-Repos, gehostet auf der codeslage-Infrastruktur, Doku zentral                        |
| Werbekanäle  | Webseite + Case Studies, Talk/Pitch („Wie schnell ist KI-getriebene Entwicklung wirklich?“), Podcast mit einem Kollegen (geplant) |
| Domain       | `codeslage.de`                                                                                                                    |
| Konten       | Google Workspace (Mail, Docs, Drive, Login), GitHub                                                                               |
| Arbeitsweise | 100 % KI-getrieben, spec-driven (Spec → Plan → Umsetzung → Tests)                                                                 |
| Rechner      | jetzt Windows, demnächst Mac (auch für iOS)                                                                                       |

## Was Erfolg bedeutet (in 6–12 Monaten)

1. **Eigene Infrastruktur läuft** reproduzierbar per IaC, gehärtet, mit getestetem Backup-Restore.
2. **Webseite `codeslage.de` ist live** mit Leistungen, Kontaktformular und mindestens einer Case Study („So haben wir unsere Infrastruktur gebaut“).
3. **Mindestens ein KI-Automations-Workflow läuft produktiv** (Anfrage → Angebotsentwurf → menschliche Prüfung).
4. **Demo-Kundenportal** zeigt, was ein Kunde sehen würde – öffentlich erreichbar, mit geschütztem „Premium“-Bereich.
5. **Projekt-Plattform steht:** Ein neues Projekt startet aus einer Vorlage, ist per Git-Push als PoC unter `<projekt>.poc.codeslage.de` erreichbar, und seine Doku erscheint automatisch im zentralen Wiki.
6. **Interesse wird messbar:** Klicks/Anfragen über die Demo zeigen, ob ein Nerv getroffen wird (datenschutzfreundliche Analytics).
7. **Mehrere Friendly User** haben Feedback gegeben.

## Nicht-Ziele (vorerst)

- Keine echten Rechnungen, keine Buchhaltung
- Kein Kunden-SLA, keine Hochverfügbarkeit (ein Server reicht, Ausfälle sind akzeptabel, Datenverlust nicht)
- Keine Mobile Apps vor Phase „Später“
- Kein vollständiges Company OS mit allen Tools auf einmal

## Prinzipien

- **Schaufenster first:** Jede Entscheidung wird so dokumentiert, dass sie als Case Study taugt.
- **Wiederverwendbar:** Bausteine (Auth, DB, UI, Automationen, Infra-Module) sollen in Kundenprojekte übertragbar sein.
- **Mensch im Loop:** KI erstellt Entwürfe, ein Mensch gibt frei. Nichts geht automatisch an Kunden raus.
- **Klein anfangen, nach Bedarf wachsen:** Ein Tool erst hosten, wenn es vermisst wird.
- **Günstig & EU:** Daten in der EU, Budget im Blick.

## Akzeptanzkriterien für diese Spec

- [ ] Inhaber bestätigt Ziel, Rahmenbedingungen, Erfolgskriterien und Nicht-Ziele.

## Constitution-Check

| Artikel                          | Bewertung | Anmerkung                                                   |
| -------------------------------- | --------- | ----------------------------------------------------------- |
| I Spec zuerst                    | ✅        | Vision vor allem anderen                                    |
| II Tests beweisen die Spec       | –         | Erfolgskriterien werden in den Phasen-Specs testbar gemacht |
| III Kleine Schritte              | ✅        | Phasen statt Big Bang                                       |
| IV Fragen statt raten            | ✅        | aus dem Interview abgeleitet, Rest als offene Fragen        |
| V Keine zerstörerischen Aktionen | –         |                                                             |
| VI Secrets nie ins Repo          | –         |                                                             |
| VII Sicher als Standard          | –         | → `02-architektur.md`                                       |
| VIII Datenschutz & EU            | ✅        | „Günstig & EU“ als Prinzip                                  |
| IX Mensch im Loop                | ✅        | Leit-User-Story mit Prüfung durch den Inhaber               |
| X Reproduzierbar                 | –         | → `02-architektur.md`                                       |
| XI Einfach vor vollständig       | ✅        | Nicht-Ziele, Tools nur nach Bedarf                          |
| XII Offen dokumentieren          | ✅        | Schaufenster-Prinzip, Talk, Podcast                         |
| XIII Wiederverwendbar            | ✅        | als Prinzip verankert                                       |
| XIV Messen statt schätzen        | ✅        | Interesse messbar, Soll/Ist in der Roadmap                  |
| XV Kein unnötiger Code           | –         | Grundlagen-Dokument, kein Code                              |
| XVI Fehler sind sichtbar         | –         | Grundlagen-Dokument                                         |

## Offene Fragen

1. **Analytics:** Plausible (gehostet, ~9 €/Monat – sprengt Budget) vs. Umami selbst gehostet (kostenlos) vs. Cloudflare Web Analytics (kostenlos, cookielos)? → Vorschlag: Cloudflare Web Analytics zum Start.
2. **Positionierung:** Gibt es eine Nische (z. B. „KI-Automatisierung für Startups“) oder bleibt es breit bei Beratung + Custom Software?
3. **Rechnungen später:** siehe Empfehlung in `02-architektur.md` → _Später: Rechnungen_.
