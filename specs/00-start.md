# Start-Prompt: Company OS & Infrastruktur

> **Historisch.** Das ist der ursprüngliche Start-Prompt. Die verbindlichen Regeln stehen jetzt in `CONSTITUTION.md`, Entscheidungen in den Specs 01 ff.


---

## Kontext

Ich gründe codeslage (vorerst als Hobby-/Lernprojekt, noch nicht angemeldet), einen IT-Dienstleister für Startups. Mein Angebot:
1. IT-Beratung und Setup für Startups (Infrastruktur, Tools, Prozesse)
2. Custom-Software-Entwicklung (Webapps, Kundenportale, später auch Mobile Apps)

Mein eigenes Setup soll gleichzeitig mein Schaufenster sein: Ich will Kunden zeigen können, wie ich selbst arbeite. Deshalb baue und betreibe ich ein eigenes "Company OS".

Ich arbeite vollständig KI-getrieben und schreibe keinen Code von Hand. Bei größeren Vorhaben arbeite ich Spec-driven: erst Spezifikation, dann Plan, dann Umsetzung, dann Tests.

Domain: codeslage.de
Mein Rechner: aktuell Windows (Gaming-PC), Mac ist bestellt

## Arbeitsweise (bitte strikt einhalten)

- **Erst planen, dann bauen.** Schreibe keinen Code, bevor die zugehörige Spec existiert und ich sie freigegeben habe.
- **Specs liegen in `/specs`** als Markdown, nummeriert (`01-vision.md`, `02-architektur.md`, …). Jede Spec enthält Ziel, Anforderungen, Akzeptanzkriterien und offene Fragen.
- **Tests sind die Absicherung**, dass der Code der Spec entspricht. Jede Akzeptanzkriterie sollte durch einen Test abgedeckt sein.
- **Kleine, überprüfbare Schritte.** Lieber mehrere kleine Commits/PRs als einen großen.
- **Frag nach, statt zu raten**, wenn etwas unklar ist.
- **Keine zerstörerischen Aktionen ohne meine ausdrückliche Bestätigung:** Löschen von Servern, Datenbanken, DNS-Einträgen, Volumes, `tofu destroy`, Force-Pushes usw.
- **Secrets niemals committen.** Nutze `.env`-Dateien (in `.gitignore`) und lege eine `.env.example` ohne echte Werte an.

## Ziel-Architektur (Vorschlag, darf kritisch hinterfragt werden)

### Code: TypeScript-Monorepo
- Paketmanager/Build: pnpm + Turborepo
- `apps/web`: Marketing-Webseite (Next.js)
- `apps/portal`: Kundenportal (Next.js), in dem Kunden Projektstatus sehen, Tickets erstellen und Rechnungen abrufen können
- `packages/ui`: gemeinsame UI-Komponenten
- `packages/db`: PostgreSQL mit Drizzle ORM
- `packages/auth`: Authentifizierung (Better Auth)
- `packages/config`: gemeinsame TS-/Lint-Konfiguration
- Validierung: Zod (Schemas als gemeinsame Wahrheit zwischen Frontend, Backend und DB)
- Tests: Vitest (Unit/Integration), Playwright (E2E)
- Bausteine sollen so gekapselt sein, dass ich sie später in Kundenprojekten wiederverwenden kann.

### Infrastruktur
- **Hetzner Cloud** (Standort Deutschland), ein Server für den Anfang
- **Coolify** als selbst gehostete Deployment-Plattform (Git-Push → Build → Deploy, SSL automatisch)
- **Cloudflare** davor: DNS, Proxy/Caching, DDoS-Schutz (Free-Plan)
- **Infrastructure as Code mit OpenTofu** (Hetzner- und Cloudflare-Provider), alles versioniert in Git
- **Backups:** automatische, verschlüsselte Datenbank-Backups auf externen Speicher (Hetzner Storage Box oder Cloudflare R2), inklusive dokumentiertem und getestetem Restore
- Kein Vercel (Hobby-Plan verbietet kommerzielle Nutzung)

### Company OS (selbst gehostet über Coolify)
- **Outline**: Wiki und Dokumentation
- **Plane**: Projekte und Aufgaben
- **Twenty**: CRM
- Später: eigene Integrationen per API (z. B. Kontaktformular der Webseite → CRM, Portal ↔ Plane)

### Sicherheit
- Server: eigener Benutzer statt root, SSH nur per Key, Passwort-Login aus, Firewall (nur 22/80/443), automatische Sicherheitsupdates
- API-Tokens mit minimalen Rechten (z. B. Cloudflare-Token nur für DNS der eigenen Zone)
- DSGVO im Blick behalten (Datenstandort EU, Auftragsverarbeitung dokumentieren)

## Roadmap (grob)

1. **Phase 0 – Discovery:** Du interviewst mich, wir schreiben Vision, Architektur und Roadmap als Specs.
2. **Phase 1 – Fundament:** Repo-Struktur, OpenTofu für Hetzner + Cloudflare, Server-Härtung, Coolify, Backups.
3. **Phase 2 – Company OS:** Outline, Plane, Twenty über Coolify deployen, Subdomains und SSO-Optionen prüfen.
4. **Phase 3 – Webseite:** `apps/web` mit Leistungen, Case Studies (u. a. "So haben wir unsere eigene Infrastruktur gebaut") und Kontaktformular.
5. **Phase 4 – Kundenportal:** `apps/portal` mit Auth, Projektübersicht, Tickets.
6. **Später – Mobile:** Webapps/PWAs bei Bedarf per Capacitor als native Apps (z. B. für NFC) in App Store und Google Play bringen; Expo als Alternative für App-zentrierte Projekte.

## Deine erste Aufgabe

Schreib noch **keinen Code** und lege noch **keine Infrastruktur** an.

1. Stell mir zunächst die wichtigsten Fragen (maximal 10), die du brauchst, um Vision, Architektur und Roadmap sauber zu spezifizieren. Gerne gruppiert und kurz.
2. Hinterfrage die Ziel-Architektur oben kritisch: Wo siehst du Risiken, Überdimensionierung oder bessere Alternativen?
3. Schlage nach meinen Antworten eine Repo-Struktur vor und erstelle die ersten Specs (`01-vision.md`, `02-architektur.md`, `03-roadmap.md`).
4. Warte danach auf meine Freigabe, bevor du mit Phase 1 beginnst.
