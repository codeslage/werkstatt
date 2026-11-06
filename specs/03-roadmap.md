# 03 – Roadmap

> Status: **Entwurf** – wartet auf Freigabe
> Stand: 2026-11-05 (Server erst bei Bedarf, ADR 0009; Webseite zuerst als Click-Dummy auf Cloudflare Pages)
> Bezug: `CONSTITUTION.md` (v1.1.0), `01-vision.md`, `02-architektur.md`

## Ziel

Reihenfolge und Zuschnitt der Phasen so, dass möglichst früh etwas Sichtbares live ist und jede Phase für sich als Case Study taugt. Jede Phase bekommt **vor** der Umsetzung eine eigene Spec mit Akzeptanzkriterien und Tests.

## Soll/Ist – die Wette 🏁

Claude hat konservativ geschätzt (bei ~20 h/Woche). Der Inhaber wettet, dass es schneller geht. Wir halten die echten Zeiten fest, und die Abweichung wird selbst Teil der Case Study („Wie schnell ist KI-getriebene Entwicklung wirklich?“). Daraus entstehen später ein **Talk/Pitch** und Podcast-Folgen.

| Phase | Soll (Claude) | Ist | Start | Ende |
|---|---|---|---|---|
| 0 – Discovery | – | | 2026-11-04 | |
| 1 – Fundament (lokal) | **2–3 Wochen** (≈ 50 h laut `tasks.md`; zuvor ~1 Woche, ursprünglich 1–2 Wochen mit Server) | | 2026-11-05 | |
| 1.5 – Projekt-Plattform | ~1 Woche | | | |
| 2 – Webseite (Click-Dummy) | 1–2 Wochen (vorher 2–3 Wochen mit Formular und Coolify) | | | |
| S – Server & Betrieb (bei Bedarf) | ~1 Woche | | | |
| 3 – Erste KI-Automation | 2–4 Wochen | | | |
| 4 – Demo-Kundenportal | 3–4 Wochen | | | |

Die Soll-Werte für Phase 1 und 2 wurden am 2026-11-05 wegen des geänderten Umfangs angepasst; die ursprünglichen Werte stehen in Klammern. Phase 1 wurde vor dem Start ein zweites Mal korrigiert: Die Summe der Tasks (≈ 50 h) passte nicht zur Schätzung „~1 Woche“. Der Inhaber wettet ausdrücklich dagegen.

## Phasen

### Phase 0 – Discovery (diese Specs)
- `01-vision.md`, `02-architektur.md`, `03-roadmap.md`
- **Fertig, wenn:** alle drei Specs freigegeben sind.

### Phase 1 – Fundament (lokal)
Spec-Ordner: `specs/04-fundament/`
- Leitsatz: **Wir bauen erst, wenn wir es brauchen.** Kein Server, solange nichts dauerhaft öffentlich mit Server-Anteil laufen muss (ADR 0009).
- GitHub-Organisation + Monorepo-Gerüst (pnpm, `packages/config`, `CLAUDE.md`, `.gitattributes`, `.env.example`)
- CI: Lint, Typecheck, Tests, Code-Qualität, Secret- und Öffentlich-Scan, Spec-Check, `tofu fmt`/`validate`/`plan`
- OpenTofu: Cloudflare-Zone **mit importierten Google-Mail-Records**, State-Backend mit Verschlüsselung
- Lokale Umgebung mit Docker Compose (Test-App + Postgres mit Seed-Daten); jedes Image wird in der CI gebaut und gestartet
- **Fertig, wenn:** die CI die Constitution durchsetzt, Google-Mail nach dem DNS-Umzug weiter funktioniert, die lokale Umgebung auf einem frischen Rechner mit einem Befehl startet und die laufenden Kosten bei 0 € liegen.

### Phase 1.5 – Projekt-Plattform
Spec-Ordner: `specs/05-projekt-plattform/`
- Projekt-Vorlage `codeslage/project-template` (CONSTITUTION.md, CLAUDE.md, specs mit Vorlage, docs, CI, PR-Template, Dockerfile)
- Constitution-Sync: Änderungen an der zentralen Constitution erzeugen automatisch PRs in allen Projekt-Repos
- Zentrales Docs-Portal `docs.codeslage.de` als statische Seite auf Cloudflare Pages, das die `docs/` aller Repos einsammelt (öffentliche Bereiche; interne Bereiche hinter Cloudflare Access)
- Erste eigene Projekte in die Org übernehmen
- PoC-Hosting (Domains, Coolify-Deploy je Projekt, Access für Friendly User) → Phase S
- **Fertig, wenn:** ein neues Projekt aus der Vorlage mit grüner CI startet und seine Doku im Docs-Portal erscheint.

### Phase 2 – Webseite (Click-Dummy)
Spec-Ordner: `specs/06-webseite/`
- `apps/web` als statische Seite auf **Cloudflare Pages** (kostenlos): Startseite, Leistungen, Projekte/Referenzen, Über mich, Kontakt
- Ziel: herausfinden, ob die Seite Besucher und Klicks bekommt, bevor wir Geld in Betrieb stecken
- Kontakt zunächst ohne eigenes Backend (z. B. Mail-Link); das Formular mit Speicherung kommt mit Phase 3
- Impressum, Datenschutz, Cloudflare Web Analytics (cookielos)
- Erste Case Study: „Wir bauen erst, wenn wir es brauchen“
- **Fertig, wenn:** die Seite auf `codeslage.de` live ist, Lighthouse ≥ 90, Web Analytics Besuche und Klicks zählt und die E2E-Tests in der CI grün sind.

### Phase S – Server & Betrieb (bei Bedarf)
Spec-Ordner: wird bei Anlage nummeriert
- **Auslöser:** sobald etwas dauerhaft öffentlich mit Server-Anteil laufen muss, spätestens vor der **ersten echten Kunden-Demo** (siehe `04-fundament/spec.md`, offene Frage 7)
- Übernimmt die verschobenen AKs aus `04-fundament` (AK-6 bis AK-13, AK-19 bis AK-23)
- Anbieter nach den dann gültigen Preisen und der Verfügbarkeit wählen (ADR 0001 vertagt); Probe-Aufbau auf Stundenbasis vor dem ersten Einsatz
- Server per OpenTofu, Härtung, privates Admin-Netz, Coolify, Umgebungen int/prod, Backups mit getestetem Restore, Alarme
- PoC-Hosting aus Phase 1.5
- **Fertig, wenn:** der Server per `tofu apply` reproduzierbar entsteht, von außen nur 80/443 über Cloudflare offen sind und ein Restore erfolgreich getestet ist.

### Phase 3 – Erste KI-Automation
Spec-Ordner: `specs/07-anfrage-zu-angebot/`
- `packages/db`: Leads, Anfragen, Angebotsentwürfe
- `packages/automations`: Workflow „Anfrage → Angebotsentwurf“ mit Claude API, Kostenlimit, Logging
- Einfache Admin-Ansicht zum Prüfen, Bearbeiten und Freigeben (Login per Google)
- Case Study: „Wie KI unsere Angebote vorbereitet“
- Entwicklung lokal; geht der Workflow live (Formular auf der Webseite → Automation), braucht es vorher Phase S
- **Fertig, wenn:** eine Testanfrage über die Webseite zu einem prüfbaren Entwurf führt und ohne Freigabe nichts an Interessenten rausgeht.

### Phase 4 – Demo-Kundenportal
Spec-Ordner: `specs/08-portal/`
- `apps/portal` mit `packages/auth` (Better Auth) und `packages/ui`
- Öffentliche Demo mit Beispieldaten + geschützter „Premium“-Bereich
- Projektstatus, Tickets, (Platzhalter für) Rechnungen
- Klick-/Interessenmessung: Nutzen Besucher die Demo? Fragen sie danach an?
- Öffentliche Demo für Kunden → setzt Phase S voraus
- **Fertig, wenn:** Friendly User die Demo nutzen und Feedback geben können.

### Später (nach Bedarf, Reihenfolge offen)
- **Talk/Pitch** „Wie schnell ist KI-getriebene Entwicklung wirklich?“ auf Basis der Soll/Ist-Daten
- **Podcast** mit Kollegen: Bereich auf der Webseite (Folgen, RSS-Feed); Hosting und Tools klären wir in einer eigenen Spec
- Weitere Automationen (z. B. KI-gestützte Marketing-Kampagnen, Lead-Qualifizierung)
- Eigene Server für Projekte, die aus dem PoC-Stadium herauswachsen (in Coolify eingebunden)
- Company-OS-Tools selbst hosten, wenn sie vermisst werden: Twenty, Plane, Outline
- Rechnungen über die API von Lexware Office oder sevDesk (sobald ein Gewerbe angemeldet ist, ca. 10–30 €/Monat)
- Mobile: Capacitor (z. B. NFC) bzw. Expo, sobald der Mac da ist
- Integrationen Portal ↔ Aufgaben-Tool

## Querschnitt (in jeder Phase)

- Jede Phase durchläuft den SDD-Ablauf (`docs/prozess/sdd-ablauf.md`): Specify → Clarify → Plan → Tasks → Analyze → Implement → Verify → Retro (Befehle `/sdd-*`)
- Für jede Architekturentscheidung ein kurzes ADR in `docs/adr/`
- Soll/Ist-Tabelle oben pflegen
- **Content sammeln:** pro Phase kurze Notizen zu Learnings, Überraschungen, Fehlern und Zahlen in `docs/content/` (Rohmaterial für Case Studies, Talk und Podcast)
- Budget-Check am Ende jeder Phase

## Akzeptanzkriterien für diese Spec

- [ ] Inhaber bestätigt die Reihenfolge (Fundament → Projekt-Plattform → Webseite → Automation → Portal, Server & Betrieb bei Bedarf).
- [ ] Inhaber bestätigt die „Fertig, wenn“-Kriterien je Phase.

## Constitution-Check

| Artikel | Bewertung | Anmerkung |
|---|---|---|
| I Spec zuerst | ✅ | jede Phase mit eigener Spec |
| II Tests beweisen die Spec | ✅ | „Fertig, wenn“ je Phase, Details in den Phasen-Specs |
| III Kleine Schritte | ✅ | Phasen von 1–4 Wochen, darin einzelne PRs |
| IV Fragen statt raten | ✅ | offene Fragen unten |
| V Keine zerstörerischen Aktionen | – | |
| VI Secrets nie ins Repo | – | |
| VII Sicher als Standard | – | → Phasen-Specs |
| VIII Datenschutz & EU | ✅ | Impressum/Datenschutz vor dem Livegang der Webseite |
| IX Mensch im Loop | ✅ | Phase 3: ohne Freigabe geht nichts raus |
| X Reproduzierbar | ✅ | Fundament zuerst; Server-Phase mit IaC und getestetem Restore |
| XI Einfach vor vollständig | ✅ | Server erst bei Bedarf (Phase S), Webseite zuerst als Click-Dummy; Company OS und Mobile in „Später“ |
| XII Offen dokumentieren | ✅ | Case Study je Phase, `docs/content/` |
| XIII Wiederverwendbar | ✅ | Projekt-Plattform mit Vorlage |
| XIV Messen statt schätzen | ✅ | Soll/Ist-Tabelle, Budget-Check |
| XV Kein unnötiger Code | ✅ | Code-Qualitäts-Checks ab Phase 1 (AK-18) |
| XVI Fehler sind sichtbar | ✅ | ab Phase 1: Mail bei fehlgeschlagenen geplanten CI-Läufen; ab Phase S: Benachrichtigung bei Backup- und Uptime-Fehlern |

## Offene Fragen

1. ~~Soll die Webseite schon vor Phase 1 als „Coming Soon“-Seite live gehen?~~ Beantwortet am 2026-11-05: Die Webseite kommt in Phase 2 als Click-Dummy auf Cloudflare Pages, nicht auf eigener Infrastruktur.
2. Gibt es schon Friendly User, die man ab Phase 2 einbinden kann?
3. Welche ersten Projekte kommen in Phase 1.5 dazu (Name, Stack, öffentlich oder privat)?
