# 02 – Architektur

> Status: **Entwurf** – wartet auf Freigabe
> Stand: 2026-11-05 (Server erst bei Bedarf, ADR 0009; Domains nach ADR 0004; pnpm ohne Turborepo nach ADR 0008)
> Bezug: `CONSTITUTION.md` (v1.1.0), `01-vision.md`

## Ziel

Eine schlanke, reproduzierbare Architektur, die ins Budget (≤ ~10–15 €/Monat Infrastruktur) passt, sicher betrieben werden kann und als Schaufenster für Kunden dient. Schwerpunkt: Webseite, Demo-Portal und KI-Automationen.

## Überblick

**Ausbaustufen** (ADR 0009, Leitsatz „Wir bauen erst, wenn wir es brauchen“):

| Stufe | Was läuft wo | Laufende Kosten |
|---|---|---|
| Jetzt (Phase 1–2) | Entwicklung lokal (Docker Compose), CI auf GitHub, DNS und Webseite (Klick-Dummy) auf Cloudflare Free / Pages | 0 € |
| Ab Phase S (bei Bedarf, spätestens vor der ersten Kunden-Demo) | Zielbild unten: eigener Server mit Coolify | nach Anbieterwahl |

Zielbild ab Phase S:

```
                 Internet
                    │
            ┌───────▼────────┐
            │   Cloudflare   │  DNS · Proxy · TLS · DDoS · Web Analytics · R2
            └───────┬────────┘
                    │ nur Cloudflare-IPs auf 80/443
            ┌───────▼────────────────────────────────┐
            │ Cloud-Firewall des Anbieters            │
            ├─────────────────────────────────────────┤
            │ Cloud-Server (EU, ~8 GB RAM)            │
            │ Anbieter: offen → Recherche R1          │
            │  Coolify                                │
            │   ├─ apps/web       (codeslage.de)      │
            │   ├─ apps/portal    (portal.…)  [P4]    │
            │   ├─ Projekte/PoCs  (<name>.poc.…)      │
            │   ├─ Doku/Wiki      (docs.…)            │
            │   ├─ PostgreSQL                         │
            │   └─ Automationen   [P3]                │
            └───────┬─────────────────────────────────┘
                    │ verschlüsselte Backups
            ┌───────▼────────┐
            │ Cloudflare R2  │  DB-Backups · Tofu-State
            └────────────────┘

   Umgebungen: dev · int (bei Bedarf an) · prod – getrennte Coolify-Umgebungen auf der VM (A11)
   Später: wächst ein Projekt raus → eigener Projekt-Server, von Coolify mitverwaltet
   Admin-Zugang (SSH, Coolify-UI): nur über Tailscale – nicht öffentlich
   Logins: Google Workspace (OAuth) für Inhaber/Team
```

## Anforderungen & Entscheidungen

### A1 – Repository & Code

| Entscheidung | Begründung |
|---|---|
| **Ein öffentliches Monorepo** `github.com/codeslage/werkstatt` | Schaufenster: Kunden sehen, wie gearbeitet wird |
| **GitHub-Organisation `codeslage` (Free-Plan)** | Trennung von privatem Account, Marke in der URL, später übertragbar/Team-fähig. Business-Plan nicht nötig. |
| **Privates Repo `codeslage/internal`** (lokal `X:\Coding\codeslage-internal`) | Für alles, was nie öffentlich sein soll: **Ideenboard** (`ideen/`), Preise, Strategie, später Prompts mit Geschäftslogik und Kundendaten-Fixtures. Von Anfang an getrennt, weil einmal Veröffentlichtes in der Git-Historie öffentlich bleibt. Der „Premium“-Bereich der *Apps* ist dagegen eine Laufzeit-Frage (Login), keine Repo-Frage. |
| pnpm-Workspace, TypeScript strict; Turborepo erst ab mehreren Apps (ADR 0008) | wie im Startprompt, Turborepo bei Bedarf |
| Pakete **erst anlegen, wenn gebraucht** | vermeidet leere Hüllen |
| Next.js für `web` und `portal` | ein Stack, ein Mental Model; Astro wäre für `web` schlanker, aber kein Muss |
| Drizzle + PostgreSQL, Zod, Better Auth | wie im Startprompt |
| Vitest + Playwright | Akzeptanzkriterien → Tests |
| `.gitattributes` mit LF, `.editorconfig` | Windows ↔ Mac ohne Zeilenende-Chaos |

**Geplante Struktur:**

```
codeslage/
├─ specs/                 # Grundlagen flach, Vorhaben als Ordner NN-name/ (spec, plan, tasks, retro)
│  └─ _vorlagen/          # Vorlagen für den SDD-Ablauf
├─ .claude/commands/      # /sdd-specify … /sdd-retro
├─ docs/
│  ├─ prozess/            # SDD-Ablauf, Code-Review, Governance
│  ├─ adr/                # Architecture Decision Records (kurz, je Entscheidung)
│  └─ runbooks/           # Restore, Server neu aufsetzen, Incident
├─ infra/
│  ├─ tofu/               # OpenTofu: Hosting-Anbieter, Cloudflare, R2
│  └─ cloud-init/         # Server-Härtung beim ersten Boot
├─ apps/
│  ├─ web/                # Marketing-Webseite          [Phase 2]
│  └─ portal/             # Demo-Kundenportal           [Phase 4]
├─ packages/
│  ├─ config/             # tsconfig, eslint, prettier  [Phase 1]
│  ├─ ui/                 # gemeinsame Komponenten      [Phase 2]
│  ├─ db/                 # Drizzle-Schema              [Phase 3]
│  ├─ automations/        # KI-Workflows (Claude API)   [Phase 3]
│  └─ auth/               # Better Auth                 [Phase 4]
├─ .github/workflows/     # CI: lint, typecheck, test, tofu plan
├─ CONSTITUTION.md        # verbindliche Grundsätze für alle Repos
├─ CLAUDE.md              # Arbeitsregeln für Claude Code (importiert die Constitution)
├─ .github/pull_request_template.md  # Constitution-Checkliste je PR
├─ .env.example
└─ .gitattributes
```

### A2 – Lokale Entwicklung

- **Windows (jetzt):** native Entwicklung mit Node, pnpm, Git und OpenTofu direkt unter Windows im Repo `X:\Coding\codeslage`.
  Begründung: WSL2 ist nur schnell, wenn das Repo *im* Linux-Dateisystem liegt; auf `X:\` (über `/mnt/x`) sind Builds und File-Watcher langsam. Da der Mac bald kommt, lohnt sich der WSL-Umweg nicht.
- **Mac (später):** Repo klonen, `pnpm install`, fertig. Keine Windows-spezifischen Skripte – nur plattformneutrale Node-Skripte.
- **Dienste lokal in Containern:** Postgres und die Apps laufen über **Docker Compose**, nur auf `localhost`, mit Seed-Daten. Jede App hat ein Dockerfile; dasselbe Image baut und startet die CI bei jedem PR. So ist der spätere Umzug auf einen Server kein Umbau. Bis Phase S ist **dev = lokal** (ADR 0009).

### A3 – Infrastruktur

Bis Phase S gibt es nur Cloudflare (DNS, Pages, R2 für den Tofu-State) und GitHub. Alles, was einen Server betrifft, gilt ab Phase S.

| Baustein | Entscheidung |
|---|---|
| Webseite (Phase 2) | **Cloudflare Pages** als statische Seite (Klick-Dummy), Cloudflare Web Analytics |
| Server (ab Phase S) | **1× Cloud-Server in der EU (bevorzugt DE), ~4 vCPU / 8 GB RAM.** Anbieter wird in Phase S nach den dann gültigen Preisen gewählt (Recherche R1, ADR 0001 vertagt). Stand 2026-11-05: Hetzner CX33 nicht bestellbar, UpCloud Starter 8 GB ca. 20 € netto. |
| Deployment | **Coolify** auf demselben Server; Merge nach `main` → Build → dev; Releases per Tag nach int/prod (A11) |
| DNS/Proxy | **Cloudflare Free**; SSL-Modus **Full (strict)**; Origin-Zertifikat oder DNS-Challenge statt HTTP-Challenge |
| IaC | **OpenTofu** (Empfehlung, s. ADR unten) mit dem Provider des gewählten Anbieters und `cloudflare`; Server, Firewall, SSH-Keys, DNS-Records, R2-Buckets |
| Tofu-State | Remote in **Cloudflare R2** (S3-Backend) + **OpenTofu State Encryption** |
| Server-Setup | **cloud-init** (von Tofu übergeben): User anlegen, SSH-Härtung, unattended-upgrades, Tailscale, Docker/Coolify |
| Nicht in IaC | Coolify-Konfiguration (Apps, Env-Vars) → wird in `docs/runbooks/` dokumentiert; später prüfen, ob die Coolify-API automatisierbar ist |
| Kein Vercel | wie im Startprompt |

#### Recherche R1 – Hosting-Anbieter (erster Schritt in Phase S)

Kandidaten (nicht abschließend): Hetzner Cloud, netcup, IONOS Cloud, OVHcloud, Scaleway, STACKIT.

| Kriterium | Gewicht |
|---|---|
| Rechenzentrum in der EU (bevorzugt DE), AVV/DSGVO sauber | Muss |
| Preis für ~4 vCPU / 8 GB inkl. IPv4 im Budget | Muss |
| Gepflegter Terraform/OpenTofu-Provider (Server, Firewall, Keys) | Muss |
| Cloud-Firewall vor dem Server | Soll |
| Stundenweise Abrechnung (PoC-Server kurz hoch- und runterfahren) | Soll |
| Snapshots/Images, Skalierung ohne Neuinstallation | Soll |
| Bekanntheit bei DACH-Startups (Schaufenster-Wirkung, Kundenrelevanz) | Kann |

Ergebnis: ADR `docs/adr/0001-hosting-anbieter.md` mit Vergleichstabelle und aktuellen Preisen.

#### ADR-Vorschlag – OpenTofu statt Terraform

Für mich (Claude) macht es praktisch keinen Unterschied: gleiche Sprache (HCL), gleiche Provider, gleiche Befehle. Wissen und Code lassen sich 1:1 übertragen. Entscheidend sind daher zwei Punkte:
- **Für OpenTofu:** echte Open-Source-Lizenz (MPL) und eingebaute **State-Verschlüsselung**, die Terraform so nicht hat. Das ist gut für Secrets im State.
- **Für Terraform:** bei Kunden und in Stellenanzeigen verbreiteter. Die Lizenz (BSL) ist für eigene Nutzung und Kundenprojekte unproblematisch.

→ **Empfehlung: OpenTofu.** Ein Kunde mit Terraform ist kein Hindernis, weil der Code darauf läuft. Ein Wechsel ist jederzeit mit geringem Aufwand möglich.

**Wichtig – Google-Workspace-DNS:** MX-, SPF-, DKIM- und DMARC-Records für Google werden **als Erstes in Tofu importiert**, bevor irgendetwas anderes an DNS geändert wird. Kein `tofu apply` ohne geprüften `plan`.

### A4 – Sicherheit

- **Netzwerk:** Cloud-Firewall des Anbieters (per Tofu) als primäre Firewall, da Docker `ufw` umgeht.
  - 80/443: **nur von Cloudflare-IP-Bereichen**
  - 22 und Coolify-UI: **nicht öffentlich**, nur über **Tailscale** (kostenlos für Einzelpersonen)
- **SSH:** eigener Benutzer, nur Key-Login, Root-Login aus, Passwort-Login aus
- **Updates:** unattended-upgrades für Sicherheitsupdates
- **Tokens:** minimal berechtigt (Cloudflare-Token nur für Zone `codeslage.de` + R2; Hosting-Token nur für dieses Projekt)
- **Secrets:** nie im Repo; lokal `.env` (gitignored), in CI als GitHub Secrets, auf dem Server in Coolify
- **Geschützte Web-Oberflächen** (Wiki-Interna, PoCs für Friendly User): **Cloudflare Access** (Zero Trust, kostenlos bis 50 Nutzer) mit Google-Login oder E-Mail-Code. Das braucht keinen eigenen Login-Code.
- **Zugänge:** 2FA auf GitHub, Google, Cloudflare und beim Hosting-Anbieter (Voraussetzung, nicht von Claude einzurichten)

### A5 – Backups

- PostgreSQL-Backups über Coolify (nativ), **täglich**, verschlüsselt, nach **Cloudflare R2** (10 GB frei)
- Aufbewahrung: 7 täglich, 4 wöchentlich
- **Restore-Runbook** in `docs/runbooks/restore.md`, Restore wird **mindestens einmal real getestet** (in eine frische DB)
- Server selbst ist per Tofu + cloud-init + Runbook neu aufsetzbar (Server = Vieh, nicht Haustier)

### A6 – Company OS (angepasst)

Der Startprompt sah Outline + Plane + Twenty vor. Angepasst an Budget, „erst mal nur ich“ und den Fokus KI-Automation:

| Zweck | Jetzt | Später (nach Bedarf) |
|---|---|---|
| Doku/Wiki | zentrales Docs-Portal aus allen Repos (siehe A10) + Google Docs | Outline |
| Aufgaben | GitHub Issues + GitHub Projects | Plane |
| CRM / Leads | eigene schlanke Lead-Tabelle in `packages/db` **oder** Twenty (siehe offene Frage 1) | Twenty |
| Automation | eigener TypeScript-Code in `packages/automations` mit Claude API | ggf. n8n für visuelle Workflows |
| Login | Google Workspace OAuth | – |

### A7 – KI-Automationen (Phase 3)

Erster Workflow „Anfrage → Angebotsentwurf“:

1. Kontaktformular auf `codeslage.de` speichert die Anfrage (Zod-validiert) in Postgres.
2. Ein Job ruft die **Claude API** mit Anfrage + Leistungskatalog + Preislogik auf und erzeugt einen strukturierten Angebotsentwurf (Zod-Schema für die Antwort).
3. Entwurf landet mit Status `zur_prüfung` im Portal/Admin; Benachrichtigung per Mail an den Inhaber.
4. Inhaber prüft, bearbeitet, gibt frei → erst dann geht etwas an den Interessenten.

Anforderungen: Kostenbremse (Max-Tokens, Tageslimit), Logging jedes KI-Aufrufs, Prompts versioniert im Repo, Tests mit gemockter API plus wenige echte Evals.

> **Kosten:** Claude-API-Nutzung wird nutzungsbasiert abgerechnet und ist **nicht** im Claude-Abo enthalten. Bei geringem Volumen sind das eher Cent- als Euro-Beträge, aber es braucht ein hartes Limit.

### A8 – DSGVO

- Server und DB in der EU (bevorzugt Deutschland)
- Auftragsverarbeitung dokumentieren in `docs/dsgvo.md`: Hosting-Anbieter, Cloudflare, Google, GitHub, Anthropic, Tailscale
- Cloudflare Web Analytics (cookielos) → kein Cookie-Banner nötig, sofern sonst nichts trackt
- Impressum + Datenschutzerklärung vor dem Livegang der Webseite (auch beim Hobbyprojekt, sobald Leistungen angeboten werden)
- Formulardaten: Zweck, Speicherdauer, Löschkonzept festlegen

### A9 – Projekte & PoCs

Eigene Projekte und Kundenprojekte sind **eigenständige Repos** in der GitHub-Organisation `codeslage` (öffentlich oder privat je Projekt). Sie gehören nicht ins Monorepo.

- **Hosting PoCs:** als eigene Apps im selben Coolify, je Projekt unter `<projekt>.poc.codeslage.de` (Wildcard-DNS)
- **Ressourcen-Limits** je Container (CPU/RAM), damit ein PoC nicht Webseite und DB lahmlegt
- **Zugriff:** öffentlich oder per Cloudflare Access nur für eingeladene Friendly User
- **Wächst ein Projekt raus:** eigener Server per Tofu, als **weiterer Server in Coolify** eingebunden. Der Deploy-Weg bleibt gleich, es gibt keinen Umbau.
- **Projekt-Vorlage** (`codeslage/project-template`): Repo-Gerüst mit `specs/`, `docs/`, `CLAUDE.md`, CI und Dockerfile/Coolify-Config. Jedes neue Projekt startet gleich.
- Bausteine aus dem Monorepo (`ui`, `auth`, `db`, `config`) werden als Pakete wiederverwendet (anfangs per Git-Abhängigkeit, später ggf. über die GitHub Packages Registry).

### A10 – Zentrales Wiki / Doku

Anforderungen:
- **Eine zentrale Stelle** für die Doku aller Projekte und des Unternehmens
- Für die KI lesbar und schreibbar (KI-getriebene Arbeitsweise)
- Öffentliche Teile (Schaufenster) und interne Teile
- Möglichst kein zusätzlicher Wartungsaufwand

Optionen:

| Option | Pro | Contra |
|---|---|---|
| **A: Docs-as-Code + zentrales Docs-Portal.** Jedes Repo hat `docs/` (Markdown), ein Build sammelt alle zu `docs.codeslage.de` (z. B. Astro Starlight) | Doku liegt beim Code und ist versioniert, Claude pflegt sie im selben PR mit. Kaum RAM nötig (statische Seite), selbst ein Schaufenster | Bearbeiten im Browser nur über GitHub, kein WYSIWYG |
| **B: Outline selbst gehostet** | schönes Wiki mit WYSIWYG, Google-Login, API | ~1–2 GB RAM plus Wartung; Doku liegt getrennt vom Code und veraltet leichter |
| **C: Google Docs/Drive** | schon vorhanden, kostet nichts | nicht strukturiert, für die KI schlechter zugänglich, kein Schaufenster |

→ **Empfehlung: A** für Projekt- und Technik-Doku. Interne Bereiche schützt Cloudflare Access. Google Docs bleibt für Entwürfe und Nicht-Technisches. Outline kommt nur, wenn ein Browser-Editor wirklich fehlt; es lässt sich über die API auch mit den Repos synchronisieren.

### A11 – Umgebungen & Releases

Details und Abläufe: `docs/prozess/release.md`, Änderungsklassen: `docs/prozess/aenderungsklassen.md`.

| Entscheidung | Begründung |
|---|---|
| **Drei Umgebungen dev · int · prod** als getrennte Coolify-Umgebungen auf der VM | klassische Trennung: aktiv gearbeitet wird nur auf dev, int ist prod-gleich zum Abnehmen und Testen, prod ist live |
| **int wird bei Bedarf eingeschaltet** und nach dem Release wieder aus | spart RAM und Kosten; bei echten Testern später ggf. dauerhaft |
| **Ein Branch (`main`) + Tags** statt Branches pro Umgebung | keine auseinanderlaufenden Branches, keine Merge-Konflikte zwischen Umgebungen |
| **Build once, promote:** int und prod bekommen dasselbe Image | in prod läuft nachweislich das, was in int abgenommen wurde |
| **Auto-Merge nach dev** bei grüner CI und Review ohne 🔴 | dev ist ein Entwicklungsstand; die menschliche Kontrolle sitzt bei Release-Kandidat und prod |
| dev und int nur über **Cloudflare Access**, nur mit Seed-/Testdaten | Datenschutz (Artikel VIII), keine Echtdaten außerhalb von prod |
| Ressourcen-Limits je Umgebung | dev und int dürfen prod nicht ausbremsen |

Domains nach ADR 0004, nur eine Ebene unter `codeslage.de` (das kostenlose Cloudflare-Zertifikat deckt keine tieferen Namen ab): `codeslage.de` (prod), `int.codeslage.de`, `dev.codeslage.de`; je App `<app>.codeslage.de`, `<app>-int.codeslage.de`, `<app>-dev.codeslage.de`, z. B. `portal-int.codeslage.de`. PoC-Domains (A9) werden in Phase S nach demselben Prinzip festgelegt.

**Bis Phase S** gibt es nur dev, und dev ist lokal (A2). int und prod entstehen mit dem Server.

### Später: Rechnungen

**Empfehlung: nicht selbst bauen, sondern Lexoffice oder sevDesk per API anbinden.**
Technisch ist eine Rechnung schnell gebaut – schwierig sind die rechtlichen Pflichten:
- **GoBD:** Rechnungen müssen unveränderbar, lückenlos nummeriert und revisionssicher archiviert werden (mehrjährige Aufbewahrungspflicht).
- **E-Rechnung:** Im B2B-Bereich wird die strukturierte E-Rechnung (XRechnung/ZUGFeRD) schrittweise Pflicht.
- **Steuer:** Kleinunternehmerregelung, Umsatzsteuer usw.

Ein Buchhaltungstool erledigt das und bietet eine API.

**Kosten (grob, vor der Entscheidung aktuell prüfen):** etwa **10–30 €/Monat** je nach Tarif (Lexware Office, ehemals lexoffice; sevDesk). Für die Portal-Anbindung muss der Tarif den **API-Zugang** enthalten, das ist nicht bei jedem Einstiegstarif der Fall. Fällig wird das erst, wenn ein Gewerbe angemeldet ist und Rechnungen geschrieben werden. Das Portal zeigt die Rechnungen dann nur an (z. B. „Meine Rechnungen“). Diese Integration ist für Kunden-Startups sogar das bessere Schaufenster, weil sie genau das selbst brauchen.

## Akzeptanzkriterien für diese Spec

- [ ] Inhaber bestätigt Monorepo-Struktur und GitHub-Organisation.
- [ ] Inhaber bestätigt Server-Größe und Budgetrahmen.
- [ ] Inhaber bestätigt Zugriffskonzept (Tailscale, nur Cloudflare auf 80/443).
- [ ] Inhaber bestätigt das angepasste Company OS (A6).
- [ ] Offene Fragen sind beantwortet oder bewusst vertagt.

*(Technische Akzeptanzkriterien mit Tests folgen in den Phasen-Specs, z. B. `04-fundament.md`.)*

## Constitution-Check

| Artikel | Bewertung | Anmerkung |
|---|---|---|
| I Spec zuerst | ✅ | Phasen-Specs vor der Umsetzung |
| II Tests beweisen die Spec | ✅ | Vitest/Playwright, Infra-Tests in `04-fundament.md` |
| III Kleine Schritte | ✅ | Pakete erst bei Bedarf, `main` geschützt |
| IV Fragen statt raten | ✅ | Anbieter offen (R1), offene Fragen unten |
| V Keine zerstörerischen Aktionen | ✅ | kein `tofu apply` ohne geprüften Plan |
| VI Secrets nie ins Repo | ✅ | A4, verschlüsselter State |
| VII Sicher als Standard | ✅ | A4: Tailscale, Cloud-Firewall, Cloudflare Access, Least Privilege |
| VIII Datenschutz & EU | ⚠️ | US-Anbieter (Cloudflare, Google, GitHub, Anthropic, Tailscale) nötig; abgesichert über Data Privacy Framework und AVV, dokumentiert in `docs/dsgvo.md` (A8) |
| IX Mensch im Loop | ✅ | A7: Status `zur_prüfung`, Freigabe durch den Inhaber |
| X Reproduzierbar | ⚠️ | Coolify-Konfiguration nicht als IaC → Runbook, API-Automatisierung später prüfen |
| XI Einfach vor vollständig | ✅ | A6: Company-OS-Tools nur nach Bedarf |
| XII Offen dokumentieren | ✅ | öffentliches Monorepo, ADRs, Docs-Portal |
| XIII Wiederverwendbar | ✅ | Pakete, Projekt-Vorlage (A9) |
| XIV Messen statt schätzen | ✅ | Kosten- und Budget-Check, Analytics |
| XV Kein unnötiger Code | ✅ | Pakete erst bei Bedarf; CI-Prüfung (knip, dependency-cruiser, ESLint-Grenzen) ab Phase 1 |
| XVI Fehler sind sichtbar | ✅ | strukturierte Logs über Coolify; Werkzeug für Benachrichtigungen je Phase im Plan |

## Offene Fragen

1. **CRM für Phase 3:** Eigene schlanke Lead-/Angebots-Tabellen (leicht, voll testbar, zeigt Custom-Software-Kompetenz) **oder** Twenty (fertiges CRM, ~2 GB RAM, API/Webhooks)? → Vorschlag: eigene Tabellen; Twenty später, falls die Funktionen fehlen.
2. **Automation:** eigener Code (`packages/automations`) vs. n8n? → Vorschlag: eigener Code, weil er spec-/testgetrieben und wiederverwendbar ist. n8n optional, wenn Kunden einen visuellen Editor wollen.
3. **Subdomains:** `portal.codeslage.de`, `admin.…` / `coolify.…` (nur Tailscale)? Oder Portal unter `codeslage.de/portal`?
4. **Notfallzugang:** Wenn Tailscale ausfällt – Zugriff über die Hetzner-Web-Konsole reicht als Fallback?
5. **Wiki:** Option A (Docs-as-Code + Docs-Portal) bestätigt?
6. **PoC-Domains:** `<projekt>.poc.codeslage.de` ok, oder lieber eine eigene Domain für Experimente?
7. **Mail-Versand aus Apps** (Formular-Benachrichtigungen): über Google Workspace SMTP oder einen Dienst wie Resend/Brevo (Free-Tier)?
