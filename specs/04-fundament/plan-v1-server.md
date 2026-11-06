# 04 – Phase 1 Fundament: Plan v1 (Archiv, Umfang mit Server)

> Status: **Archiv** – Plan zur Spec v1 (mit Server), nie freigegeben. Vorlage für die Spec von Phase S (ADR 0009). Gilt nicht für die Umsetzung von 04-fundament v2.
> Stand: 2026-11-05
> Bezug: `spec.md` (Status: Freigegeben am 2026-11-05), `CONSTITUTION.md` (v1.1.0), `02-architektur.md`
> SDD-Stufe: 3 Plan

## Technischer Ansatz

Die gesamte Infrastruktur entsteht mit **OpenTofu** aus `infra/tofu/`. Der Server läuft bei **Hetzner Cloud** (CX33, Deutschland) hinter einer Hetzner-Cloud-Firewall, die nur 80/443 aus den Cloudflare-IP-Bereichen zulässt. **Cloudflare** übernimmt DNS, Proxy und TLS, mit Cloudflare Access vor dev und int. Admin-Zugang (SSH, Coolify-UI) läuft ausschließlich über **Tailscale**. Gehärtet wird der Server per **cloud-init**. Deployt wird mit **Coolify**: Images baut GitHub Actions einmal und legt sie in GHCR ab. dev folgt `main` automatisch, int und prod bekommen nur Release-Tags über `/release`. **Backups** macht Coolify nativ nach Cloudflare R2. Überwacht werden Backup und Status-Seite von außen durch **Better Stack** (Uptime-Monitor + Heartbeat, Mail).

Geprüft wird fast alles mit **einem** Test-Werkzeug (Vitest, TypeScript), aufgeteilt in drei Suiten:

| Suite | Ort | Läuft | Braucht |
|---|---|---|---|
| Repo-Checks | `tools/*/` | jeder PR | nichts |
| Infra extern | `infra/tests/extern` | wöchentlich + bei Infra-PRs in der CI, lokal | nur Internet |
| Infra intern | `infra/tests/intern` | lokal aus dem Tailnet, Pflicht in `/release` | Tailscale, SSH-Key |

Die interne Suite läuft bewusst nicht in der CI: Sonst bräuchte die CI SSH-Zugriff auf den Server (Artikel VII).

Zugehörige ADRs in `docs/adr/`:

| ADR | Entscheidung |
|---|---|
| [0001](../../docs/adr/0001-hosting-anbieter.md) | Hosting-Anbieter: Hetzner Cloud CX33 (Recherche R1) |
| [0002](../../docs/adr/0002-opentofu.md) | OpenTofu statt Terraform; State verschlüsselt in R2; `apply` nur lokal |
| [0003](../../docs/adr/0003-admin-netz-tailscale.md) | Privates Admin-Netz: Tailscale (offene Frage 6 der Spec) |
| [0004](../../docs/adr/0004-domain-schema.md) | Domains nur eine Ebene tief (`status-dev.…` statt `status.dev.…`) |
| [0005](../../docs/adr/0005-deploy-pfad.md) | Deploy-Pfad: Build in GitHub Actions → GHCR → Coolify |
| [0006](../../docs/adr/0006-backups.md) | Backups: Coolify nativ nach R2, Restore-Test per Skript |
| [0007](../../docs/adr/0007-benachrichtigung.md) | Benachrichtigung: Better Stack (Uptime + Heartbeat) |
| [0008](../../docs/adr/0008-repo-werkzeuge.md) | Repo-Werkzeuge: pnpm ohne Turborepo, eigene Git-Hooks, Dependabot |

## Bausteine & Struktur

```
codeslage/
├─ .githooks/pre-commit         # gitleaks + Öffentlich-Regeln (AK-2, AK-24)
├─ .github/
│  ├─ workflows/
│  │  ├─ ci.yml                 # lint, typecheck, test, knip, depcruise, spec-check, gitleaks, tofu fmt/validate, tflint
│  │  ├─ drift.yml              # wöchentlich + Infra-PRs: tofu plan -detailed-exitcode (AK-5), Infra extern
│  │  ├─ history-scan.yml       # monatlich: gitleaks über die ganze Historie (AK-24)
│  │  ├─ backup-check.yml       # täglich: Alter des neuesten Backups → Heartbeat (AK-12, AK-19)
│  │  ├─ build-image.yml        # main → Image :main-<sha> + Deploy dev; Tag → Image :vX.Y.Z (AK-21, AK-22)
│  ├─ dependabot.yml
│  └─ pull_request_template.md
├─ .gitleaks.toml               # Secret-Regeln + eigene Regeln (IP, E-Mail); Sperrliste wird eingelesen
├─ apps/
│  └─ status/                   # Test-App „Hello codeslage“: Version, Umgebung, /health
├─ packages/
│  └─ config/                   # tsconfig, ESLint-, Prettier-Grundkonfiguration
├─ tools/
│  ├─ spec-check/               # prüft Pflichtabschnitte und Constitution-Check (AK-16)
│  ├─ public-scan/              # Tests: gitleaks-Regeln greifen auf Negativ-Fixtures (AK-2, AK-24)
│  ├─ quality-fixtures/         # Tests: knip, dependency-cruiser, ESLint greifen auf Negativ-Fixtures (AK-18)
│  └─ release/                  # lokales Skript für /release: int/prod per Coolify-API (AK-22, AK-23)
├─ infra/
│  ├─ tofu/
│  │  ├─ bootstrap/             # einmalig: R2-Bucket für den State
│  │  ├─ modules/server/        # Server + Firewall + cloud-init, wiederverwendbar (XIII)
│  │  └─ live/                  # Zone, DNS, Zonen-Einstellungen, Access, R2, Server
│  ├─ cloud-init/server.yaml.tftpl
│  └─ tests/{extern,intern}/    # Vitest-Infra-Tests
└─ docs/
   ├─ adr/                      # 0001–0008
   ├─ runbooks/                 # dns-bestand, notfallzugang, coolify-einrichtung, restore, server-neu-aufsetzen, rollback
   ├─ protokolle/               # Nachweise manueller AKs (AK-4, AK-6, AK-13, AK-19, AK-23, AK-24)
   ├─ secrets.md                # Token-Register ohne Werte (AK-14)
   ├─ dsgvo.md                  # Dienstleister (Artikel VIII)
   ├─ kosten.md                 # laufende Kosten (AK-15)
   └─ content/phase-1.md        # Rohmaterial (Artikel XII)
```

**Erlaubte Abhängigkeiten** (geprüft mit dependency-cruiser):

- `apps/*` → `packages/*`
- `tools/*` → `packages/*`
- `infra/tests` → `packages/*`
- `packages/*` → nie `apps/*`, `tools/*` oder `infra/*`; keine Zyklen

Turborepo und weitere Pakete kommen erst dazu, wenn es mehr als eine App gibt (ADR 0008).

**Neue Abhängigkeiten** (Artikel XI, alle MIT/Apache/BSD/MPL, aktiv gepflegt):

| Abhängigkeit | Wofür | Warum kein eigener Code |
|---|---|---|
| typescript, @types/node | Typecheck | Standard, Grundlage für alles |
| eslint, typescript-eslint, prettier | Lint, Komplexitätsgrenzen (AK-18), Format | Komplexitätsregeln selbst zu bauen wäre unverhältnismäßig |
| vitest | alle Tests | ein Test-Werkzeug für Repo und Infra |
| knip | ungenutzte Dateien, Exporte, Abhängigkeiten (AK-18) | nicht mit wenigen Zeilen lösbar |
| dependency-cruiser | Zyklen und Modulgrenzen (AK-18) | dto. |
| aws4fetch | signierte R2-Abfragen (S3-API) in Backup-Check und Restore-Test | AWS-SigV4 selbst zu signieren ist fehleranfällig; ca. 1 Datei statt AWS-SDK |
| gitleaks (Binary, kein npm) | Secret- und Öffentlich-Scan | etabliertes Werkzeug; in der CI als gepinntes Release mit Prüfsumme, nicht als `gitleaks-action` (braucht für Organisationen eine Lizenz) |
| tflint (Binary) | ungenutzte Variablen/Outputs in HCL (XV) | `tofu validate` erkennt toten Code nicht |
| GitHub Actions: `actions/checkout`, `actions/setup-node`, `pnpm/action-setup`, `opentofu/setup-opentofu`, `docker/build-push-action`, `tailscale/github-action` | CI | offizielle Actions, per Commit-SHA gepinnt |

## Datenmodell & Schnittstellen

Phase 1 hat kein fachliches Datenmodell. Die Schnittstellen sind:

| Schnittstelle | Richtung | Authentifizierung | Rechte (Least Privilege) |
|---|---|---|---|
| Hetzner Cloud API | Tofu (lokal) | Token `hcloud-rw` | Read & Write, nur Projekt `codeslage` |
| Hetzner Cloud API | Drift-Check (CI) | Token `hcloud-ro` | nur Read |
| Cloudflare API | Tofu (lokal) | Token `cf-tofu-rw` | Zone `codeslage.de`: DNS, Zone Settings, Access-Apps; Account: R2-Bucket-Verwaltung |
| Cloudflare API | Drift-Check (CI) | Token `cf-tofu-ro` | dieselben Bereiche, nur Read |
| R2 (S3-API) | Tofu-State | R2-Token `r2-state` | Object Read & Write, nur Bucket `codeslage-tofu-state`; in der CI eigener Token nur Read |
| R2 (S3-API) | Coolify-Backups | R2-Token `r2-backup-write` | Object Read & Write, nur Bucket `codeslage-backups` |
| R2 (S3-API) | Backup-Check (CI) | R2-Token `r2-backup-read` | Object Read, nur Bucket `codeslage-backups` |
| Tailscale | Server-Join | Auth-Key, einmalig, kurzlebig, Tag `tag:server` | nur Join |
| Tailscale | CI → dev-Deploy | OAuth-Client, Tag `tag:ci`, ephemer | ACL: `tag:ci` → `tag:server:8000`, sonst nichts |
| Coolify API | CI → dev | Token `coolify-deploy-dev` | nur Deploy, nur dev-Ressourcen (falls Coolify das nicht trennen kann: siehe Risiken) |
| Coolify API | lokal → int/prod (`/release`) | Token `coolify-release` | Deploy + Read |
| GHCR | CI → Registry | `GITHUB_TOKEN` | `packages: write` nur im Build-Workflow |
| Better Stack | Backup-Check → Heartbeat | geheime Heartbeat-URL | nur Ping |
| `apps/status` | HTTP | keine | `GET /` (HTML), `GET /health` → `{ version, environment, imageDigest }` |

Alle Tokens stehen ohne Werte in `docs/secrets.md` (wer, wofür, Rechte, Ablaufdatum). Das ist AK-14. `.env.example` enthält dieselben Namen mit leeren Werten. Die Antworten von `/health` validieren die Infra-Tests gegen ein Schema (Artikel VII).

**Konfiguration der Umgebungen** (Coolify, per Runbook, ADR 0004):

| Umgebung | Domain der Test-App | Zugriff | Image | Daten |
|---|---|---|---|---|
| dev | `status-dev.codeslage.de` | Cloudflare Access (Inhaber) | `:main-<sha>`, automatisch | Seed |
| int | `status-int.codeslage.de` | Cloudflare Access (Inhaber) | `:vX.Y.Z` per Digest, an/aus per `/release` | Seed |
| prod | `status.codeslage.de` | öffentlich | `:vX.Y.Z` per Digest, nur `/release` | – |

## Schritte (je ein PR)

Die Nummern 1–6 entsprechen den Plan-Schritten, auf die sich die Voraussetzungen V1–V6 der Spec beziehen.

### Schritt 1 – Entscheidungen (Recherche R1, ADRs)
- ADRs 0001–0008 (liegen mit diesem Plan als Entwurf vor), Freigabe zusammen mit dem Plan
- `02-architektur.md`: A1 (Turborepo ab Phase 2, ADR 0008), A3 (Anbieter), A11 (Domains nach ADR 0004) und A9 (PoC-Domains: Hinweis für Phase 1.5) angleichen
- Kein eigener PR, weil es noch kein Repo gibt: Diese Dateien gehen mit dem ersten Commit in Schritt 2a ein.
- **Danach:** Inhaber legt das Hetzner-Konto an (V3) und prüft den Preis auf hetzner.com.

### Schritt 2a – Repo & Schutz (AK-1, AK-2, AK-24, AK-17)
- Lokale Werkzeuge: `corepack enable` (pnpm), `winget install OpenTofu.Tofu GitHub.cli Gitleaks.Gitleaks`
- `git init`, `.gitattributes` (LF), `.editorconfig`, `.gitignore` (inkl. `.env`, `.sperrliste`, `*.tfstate*`), `.env.example`
- `.gitleaks.toml` mit eigenen Regeln für IPv4/IPv6, E-Mail-Adressen (Ausnahme: freigegebene Rollenadressen) und Sperrliste; `.githooks/pre-commit`, aktiviert über `pnpm install` (`prepare`: `git config core.hooksPath .githooks`)
- **Historien-Scan vor dem ersten Push** (AK-24), Protokoll in `docs/protokolle/`
- Erster Commit auf `main` (Bootstrap des leeren Repos, einzige Ausnahme von „nur per PR“), dann Repo `codeslage/codeslage` öffentlich anlegen und `main` schützen: PR Pflicht, Status-Checks Pflicht, kein Force-Push, gilt auch für Admins
- Sperrliste als GitHub Secret `PUBLIC_BLOCKLIST`
- Minimale `ci.yml` mit gitleaks, damit der Schutz ab dem ersten PR greift; `tools/public-scan` mit Negativ-Fixtures (Fake-Token, IP, E-Mail, Test-Sperrbegriff)
- `docs/secrets.md`, `docs/dsgvo.md`, `docs/kosten.md` anlegen
- AK-17 prüfen: neue Claude-Code-Sitzung, Protokoll

### Schritt 2b – CI-Qualität (AK-1, AK-16, AK-18)
- pnpm-Workspace, `packages/config` (tsconfig strict, ESLint mit `complexity` 10, `max-depth` 3, `max-lines-per-function` 50, `max-lines` 300, `no-warning-comments`, kein leerer `catch`; Prettier)
- `tools/spec-check`: jede `spec.md`/`plan.md` hat Status, Constitution-Bezug, (bei Specs) AKs und einen Constitution-Check mit allen 16 Artikeln; ⚠️ nur mit Anmerkung
- knip, dependency-cruiser (Regeln oben)
- **Negativ-Fixtures** in `tools/spec-check/fixtures/` und `tools/quality-fixtures/`: je ein Verstoß pro Regel; Tests erwarten, dass das Werkzeug fehlschlägt. Die Fixtures sind von den normalen Läufen von knip, ESLint und dependency-cruiser ausgenommen.
- `ci.yml` vollständig; `dependabot.yml` (npm, github-actions, docker, terraform), Sicherheits-Updates an
- PR-Template mit Constitution-Checkliste

### Schritt 3 – Cloudflare & State (AK-3, AK-4, AK-5)
- Voraussetzung: V2 ✅, Tokens `cf-tofu-rw/-ro`, `r2-state` (V5)
- Bestandsaufnahme aller Records beim Registrar → `docs/runbooks/dns-bestand.md` (Werte, die nicht öffentlich sein dürfen, nach `codeslage-internal`)
- `infra/tofu/bootstrap`: State-Bucket anlegen, danach den eigenen State in den Bucket verschieben
- `infra/tofu/live`: Zone, alle bestehenden Records 1:1 (zuerst MX, SPF, DKIM, DMARC, Google-Verifizierung), `tofu plan` gemeinsam prüfen, erst dann `apply`
- Zonen-Einstellungen: SSL Full (strict), Always HTTPS, min. TLS 1.2, DNSSEC; DMARC mindestens `p=none` mit Reporting
- Infra-Test extern AK-3 gegen die Cloudflare-Nameserver, **bevor** V6 umgestellt wird; TTL vorher senken
- V6 (Inhaber stellt Nameserver um), AK-3 erneut, Testmail AK-4 mit Protokoll; DS-Record für DNSSEC beim Registrar
- `drift.yml` (AK-5)

### Schritt 4 – Server, Firewall, Härtung (AK-7, AK-8, AK-9)
- Voraussetzung: V3, V4 (Tailnet, ACL, Auth-Key), Tokens `hcloud-rw/-ro`
- `modules/server`: Server CX33 in Nürnberg, SSH-Key, Hetzner-Firewall: eingehend nur TCP 80/443 aus `data.cloudflare_ip_ranges`, sonst nichts (auch kein 22)
- cloud-init: Benutzer `deploy` (nur Key), `PermitRootLogin no`, `PasswordAuthentication no`, `KbdInteractiveAuthentication no`, SSH lauscht nur auf `tailscale0`, unattended-upgrades (Security), fail2ban, Swap, Zeitzone, Tailscale-Join mit Tag `tag:server`
- Tests: extern TCP-Connect auf alle Ports 1–65535 der öffentlichen IPv4/IPv6 mit kurzen Timeouts; nur 80/443 offen, und die nur aus Cloudflare-Netzen (AK-7: direkter Request auf die IP schlägt fehl). Intern: SSH als `root` und mit Passwort wird abgelehnt (System-`ssh` mit `BatchMode`), `unattended-upgrades` aktiv und letzter Lauf < 48 h (AK-8, AK-9)
- Runbook `notfallzugang.md` (Hetzner-Web-Konsole) einmal real durchspielen

### Schritt 5a – Coolify & Test-App prod (AK-10, AK-11)
- Docker aus dem offiziellen Apt-Repo; Coolify über das offizielle Installationsskript mit **fester Version**; Auto-Update aus
- Coolify-UI nur über `http://<tailscale-name>:8000` (öffentlich durch die Firewall gesperrt); Admin-Konto + 2FA legt der Inhaber an
- Cloudflare Origin Certificate (per Tofu, Key nur im verschlüsselten State) für `codeslage.de` und `*.codeslage.de`, im Coolify-Proxy hinterlegt (Runbook `coolify-einrichtung.md`)
- `apps/status` (Node 24, TypeScript ohne Build-Schritt per Type-Stripping, `node:http`, keine Abhängigkeit), Dockerfile, Unit-Tests für `/health`
- `status.codeslage.de` in prod
- Tests extern: Port 8000/6001/6002 öffentlich zu (AK-10), HTTPS 200 + gültiges Zertifikat + Redirect HTTP→HTTPS (AK-11). Intern: Coolify-UI über Tailscale erreichbar (AK-10)

### Schritt 5b – Umgebungen & Release-Weg (AK-20, AK-21, AK-22, AK-23)
- Coolify-Projekte dev, int, prod mit CPU/RAM-Limits; Cloudflare Access per Tofu vor `*-dev` und `*-int`
- `build-image.yml`: Merge nach `main` → Image `:main-<sha>` → Deploy dev über Tailscale-Job + Coolify-API (ADR 0005); Tag `v*` → Image `:vX.Y.Z` einmal bauen
- `tools/release`: int an, Deploy per **Digest**, Tests intern + extern, int aus; prod nur nach Bestätigung im Dialog; Rollback auf das vorige Release (ADR 0005)
- `/release`, `/hotfix`, `/change` einmal komplett an der Test-App durchspielen, Rollback einmal testen (AK-23), Protokoll
- Tests: dev/int ohne Access-Token → Weiterleitung zum Access-Login, kein Inhalt (AK-20); Digest auf int = prod (AK-22); `/health` auf dev zeigt den SHA des letzten Merges (AK-21); dev/int haben keine Variable, die auf prod-Daten zeigt (AK-20, intern über Coolify-API)

### Schritt 6 – Backups, Restore, Alarme (AK-12, AK-13, AK-19)
- Tofu: Bucket `codeslage-backups`; Tokens `r2-backup-write/-read` (V5)
- Coolify: S3-Ziel R2, tägliches Backup der Coolify-eigenen DB und einer Test-DB (Seed) in prod, Aufbewahrung 7 täglich + 4 wöchentlich
- `backup-check.yml` täglich 1 h nach dem Backup: neuestes Objekt < 26 h (AK-12) → Heartbeat ok, sonst `/fail`
- Better Stack: Heartbeat (Erwartung 24 h, Karenz 30 min) und HTTP-Monitor `status.codeslage.de` (3 min), Mail an den Inhaber
- Restore-Test (`infra/tests/intern/restore.test.ts`): neuestes Backup laden, in eine frische Postgres-Instanz (Wegwerf-Container) einspielen, Prüfsumme je Tabelle mit der Quelle vergleichen (AK-13), Protokoll
- AK-19 provozieren: Backup-Ziel absichtlich ungültig machen und Test-App stoppen, Mail-Eingang < 30 min protokollieren
- Runbooks `restore.md`, `server-neu-aufsetzen.md`

### Schritt 7 – Neuaufbau-Probe & Abschluss (AK-6, AK-14, AK-15)
- **Nur nach ausdrücklicher Freigabe für genau diese Aktion** (Artikel V): Ich zeige `tofu plan -destroy` für den Server, dann Abriss und Neuaufbau nach `server-neu-aufsetzen.md`, Restore aus R2, danach beide Infra-Suiten grün. Zeit messen, protokollieren.
- `docs/secrets.md` vollständig (AK-14), `docs/kosten.md` mit der ersten Rechnung (AK-15), `docs/dsgvo.md` (Hetzner, Cloudflare, Google, GitHub, Tailscale, Better Stack)
- Content-Notizen `docs/content/phase-1.md`

## Teststrategie

| AK | Testart | Wo |
|---|---|---|
| AK-1 | Infra: `gh api` prüft Sichtbarkeit `public` und Branch-Protection; CI-Status | `infra/tests/extern/repo.test.ts` |
| AK-2 | gitleaks im Hook und in der CI; Negativ-Fixture mit Fake-Token wird erkannt | `.githooks`, `ci.yml`, `tools/public-scan` (Fixture-Test) |
| AK-24 | Negativ-Fixture (IP, E-Mail, Sperrlisten-Begriff) einzeln gegen Hook, CI und Review-Agent; Historien-Scan | Hook + CI + `code-reviewer`, Protokoll |
| AK-3 | Infra: DNS-Lookup MX, SPF, DKIM, DMARC | `infra/tests/extern/dns.test.ts` |
| AK-4 | manuell: Testmail in beide Richtungen | `docs/protokolle/` |
| AK-5 | Infra: `tofu plan -detailed-exitcode` (Exit 0) | `drift.yml` |
| AK-6 | manuell: Abriss + Neuaufbau, danach beide Infra-Suiten | `docs/protokolle/`, nur mit Freigabe |
| AK-7 | Infra: TCP-Connect auf alle Ports der Server-IP; HTTP direkt auf die IP schlägt fehl | `infra/tests/extern/ports.test.ts` |
| AK-8 | Infra: Port 22 öffentlich zu; über Tailscale Root- und Passwort-Login abgelehnt | `extern/ports.test.ts`, `intern/ssh.test.ts` |
| AK-9 | Infra: `unattended-upgrades` aktiv, letzter Lauf < 48 h | `infra/tests/intern/updates.test.ts` |
| AK-10 | Infra: Coolify-Ports öffentlich zu, über Tailscale erreichbar | `extern/ports.test.ts`, `intern/coolify.test.ts` |
| AK-11 | Infra: HTTPS 200, Zertifikat gültig, HTTP → 301/308 auf HTTPS | `infra/tests/extern/status.test.ts` |
| AK-12 | Infra: neuestes Objekt in `codeslage-backups` < 26 h | `backup-check.yml` (nutzt `extern/backup.test.ts`) |
| AK-13 | Infra: Restore in frische DB, Prüfsummen gleich | `infra/tests/intern/restore.test.ts` + Protokoll |
| AK-14 | Review: `docs/secrets.md` gegen die tatsächlichen Tokens | Code-Review Schritt 7 |
| AK-15 | manuell: Rechnungen/Kostenübersicht | `docs/kosten.md`, Retro |
| AK-16 | Unit: spec-check gegen Fixtures (fehlender Artikel, ⚠️ ohne Anmerkung, fehlender Status); läuft auch über `specs/` | `tools/spec-check` |
| AK-17 | manuell: neue Sitzung ohne Hinweis fragen | `docs/protokolle/` |
| AK-18 | Unit: knip, dependency-cruiser, ESLint gegen je eine fehlerhafte Fixture | `tools/quality-fixtures` |
| AK-19 | manuell, provozierter Fehler: Mail-Eingang < 30 min | `docs/protokolle/` |
| AK-20 | Infra: dev/int ohne Access → kein Inhalt; dev/int ohne Verweis auf prod-Daten | `extern/access.test.ts`, `intern/environments.test.ts` |
| AK-21 | Infra: nach Merge zeigt `/health` auf dev den Merge-SHA | Schritt im `build-image.yml` |
| AK-22 | Infra: Image-Digest auf int = Digest des Release-Tags = später prod | `tools/release` + `intern/environments.test.ts` |
| AK-23 | manuell: Release + Rollback der Test-App | `docs/protokolle/`, `docs/runbooks/rollback.md` |

## Constitution-Check

| Artikel | Bewertung | Anmerkung |
|---|---|---|
| I Spec zuerst | ✅ | Spec freigegeben am 2026-11-05; Plan wartet auf Freigabe |
| II Tests beweisen die Spec | ✅ | jedes der 24 AKs hat einen Test (Tabelle oben), Tests je Schritt mit dem Code |
| III Kleine Schritte | ✅ | 8 PRs (2a–7); Ausnahme: der Bootstrap-Commit des leeren Repos in 2a, danach ist `main` geschützt |
| IV Fragen statt raten | ✅ | Frage 6 per ADR 0003 entschieden; Fragen 3–5 im Plan nach Vorschlag umgesetzt; offene Punkte unter Risiken |
| V Keine zerstörerischen Aktionen | ✅ | AK-6 nur mit Freigabe und vorherigem `plan -destroy`; kein `apply` ohne gemeinsam geprüften `plan`; Nameserver erst nach AK-3 gegen Cloudflare |
| VI Secrets nie ins Repo | ✅ | gitleaks lokal + CI, verschlüsselter State, Origin-Key nur im State, `.env.example`, `docs/secrets.md` ohne Werte |
| VII Sicher als Standard | ✅ | keine öffentlichen Admin-Ports, getrennte Read-/Write-Tokens, CI ohne SSH, ACL für `tag:ci` nur Port 8000; `/health` wird gegen ein Schema geprüft |
| VIII Datenschutz & EU | ⚠️ | Server in DE; Cloudflare, GitHub, Tailscale und Better Stack verarbeiten Daten (teils außerhalb der EU), Erfassung in `docs/dsgvo.md`; Personendaten gibt es in Phase 1 nicht |
| IX Mensch im Loop | – | keine KI-Ausgaben an Kunden; prod-Deploys trotzdem nur nach Bestätigung |
| X Reproduzierbar | ⚠️ | Coolify-Konfiguration (Projekte, Proxy, Backups) nur als Runbook, nicht als Code; durch AK-6 einmal real geprüft |
| XI Einfach vor vollständig | ✅ | kein Turborepo, keine Hook-Bibliothek, kein Monitoring-Stack, Test-App ohne Abhängigkeiten; jede neue Abhängigkeit oben begründet |
| XII Offen dokumentieren | ✅ | 8 ADRs, Runbooks, Protokolle, Content-Notizen; `02-architektur.md` wird in Schritt 1 angeglichen |
| XIII Wiederverwendbar | ✅ | `modules/server` und cloud-init ohne codeslage-spezifische Werte (alles über Variablen) |
| XIV Messen statt schätzen | ✅ | Zeiten je Schritt in `tasks.md`, Neuaufbau-Zeit in AK-6, Kosten in `docs/kosten.md` |
| XV Kein unnötiger Code | ✅ | knip, dependency-cruiser, ESLint-Grenzen, tflint ab Schritt 2b; Negativ-Fixtures beweisen, dass sie greifen |
| XVI Fehler sind sichtbar | ✅ | Better Stack für Backup und Uptime (AK-19); fehlgeschlagene Drift- und Scan-Workflows mailen über GitHub; ESLint verbietet leere `catch` |

## Risiken

| Risiko | Gegenmaßnahme |
|---|---|
| Mail-Ausfall beim Nameserver-Wechsel | Records vorher 1:1 nachbauen, AK-3 gegen die Cloudflare-Nameserver vor V6, niedrige TTL, AK-4 direkt danach |
| Aussperren vom Server (SSH nur auf `tailscale0`) | Hetzner-Web-Konsole als Notfallzugang, in Schritt 4 real getestet; `deploy` hat dafür ein lokales Passwort nur für die Konsole (nicht für SSH) |
| Coolify-Token lassen sich nicht auf eine Umgebung begrenzen | dann: Token für die CI nur mit Deploy-Recht, Release-Token nur lokal; in `docs/secrets.md` als ⚠️ vermerken |
| Henne-Ei beim State-Bucket | einmaliger Bootstrap mit lokalem State, danach Migration; Runbook |
| Cloudflare-IP-Bereiche ändern sich | kommen per Data-Source in die Firewall; der Drift-Check zeigt Änderungen wöchentlich |
| Hetzner-Preise steigen weiter (zuletzt Juni 2026) | Budget mit Puffer (~10,70 € brutto bei ≤ 15 €), Kosten in der Retro; Wechsel ist dank IaC machbar |
| Updates von Coolify brechen etwas | feste Version, Update nur manuell nach Backup |
| Zu strenge Lint-Grenzen | Werte zentral in `packages/config`, Änderung per ADR |
