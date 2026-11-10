# 04 – Phase 1 Fundament: Plan

> Status: **Freigegeben** am 2026-11-05 (v1.1 nach Analyse: PR-Zuschnitt, tflint/`tofu`-Prüfungen erst in Schritt 4, AK-28 bis AK-30)
> Stand: 2026-11-05
> Bezug: `spec.md` (v2.1), `tasks.md`, `CONSTITUTION.md` (v1.1.0), `02-architektur.md`
> SDD-Stufe: 3 Plan
> Der Plan zur Spec v1 (mit Server) liegt als Archiv in `plan-v1-server.md` und dient als Vorlage für Phase S.

## Technischer Ansatz

In Phase 1 läuft nichts dauerhaft (ADR 0009). Es gibt vier Bausteine:

1. **Repo & CI auf GitHub** (öffentlich, kostenlos). Die CI setzt die Constitution maschinell durch: Secrets, interne Angaben, Spec-Abschnitte, toter Code, Modulgrenzen, Komplexität. Derselbe Secret- und Öffentlich-Scan läuft lokal als Git-Hook.
2. **Lokale Umgebung mit Docker Compose** (Docker Desktop, ADR 0010): eine Test-App `apps/status` und Postgres mit Seed-Daten, nur auf `127.0.0.1`. Dasselbe Image baut und startet die CI bei jedem PR.
3. **DNS per OpenTofu bei Cloudflare** (ADR 0002): Die Zone mit allen bestehenden Google-Mail-Records wird nachgebaut, bevor die Nameserver umziehen. Der State liegt verschlüsselt in R2.
4. **Geplante CI-Läufe** (Drift-Check, Historien-Scan) melden Fehler per GitHub-Mail.

Getestet wird mit **Vitest** in TypeScript. Für Infrastruktur-Prüfungen (DNS, Repo-Einstellungen) gibt es eine eigene Suite `infra/tests`. Sie braucht nur Internet und läuft in der CI und lokal.

Zugehörige ADRs in `docs/adr/`:

| ADR                                                     | Entscheidung                                                       | Status                                          |
| ------------------------------------------------------- | ------------------------------------------------------------------ | ----------------------------------------------- |
| [0002](../../docs/adr/0002-opentofu.md)                 | OpenTofu, State verschlüsselt in R2, `apply` nur lokal             | Vorgeschlagen (ergänzt: Zahlungsmethode für R2) |
| [0004](../../docs/adr/0004-domain-schema.md)            | Domains nur eine Ebene tief                                        | Vorgeschlagen                                   |
| [0008](../../docs/adr/0008-repo-werkzeuge.md)           | pnpm ohne Turborepo, eigene Git-Hooks, Dependabot, gitleaks-Binary | Vorgeschlagen                                   |
| [0009](../../docs/adr/0009-server-erst-bei-bedarf.md)   | Server erst bei Bedarf, Entwicklung lokal                          | Vorgeschlagen                                   |
| [0010](../../docs/adr/0010-container-laufzeit-lokal.md) | Lokale Container-Laufzeit: Docker Desktop (offene Frage 8)         | Vorgeschlagen                                   |

ADRs 0001, 0003, 0005, 0006 und 0007 sind bis Phase S vertagt.

## Bausteine & Struktur

```
codeslage/
├─ .githooks/pre-commit          # gitleaks + Öffentlich-Regeln (AK-2, AK-24)
├─ .github/
│  ├─ workflows/
│  │  ├─ ci.yml                  # jeder PR: lint, format, typecheck, test, knip, depcruise, spec-check, gitleaks,
│  │  │                          #   Image bauen + starten (AK-26); ab Schritt 4 zusätzlich tofu fmt/validate, tflint
│  │  ├─ drift.yml               # wöchentlich + PRs auf infra/: tofu plan -detailed-exitcode, infra/tests (AK-3, AK-5)
│  │  └─ history-scan.yml        # monatlich: gitleaks über die ganze Historie (AK-24)
│  ├─ dependabot.yml
│  └─ pull_request_template.md
├─ .gitleaks.toml                # Standardregeln + eigene Regeln (IP, E-Mail, Sperrliste)
├─ compose.yaml                  # lokale Umgebung: db + status (AK-25)
├─ apps/
│  └─ status/                    # Test-App: GET / und GET /health (Version, DB-Verbindung, Seed-Zeile)
│     ├─ Dockerfile
│     ├─ src/
│     └─ test/
├─ packages/
│  └─ config/                    # tsconfig, ESLint-, Prettier-Grundkonfiguration
├─ tools/
│  ├─ spec-check/                # Pflichtabschnitte + Constitution-Check (AK-16), mit Negativ-Fixtures
│  ├─ public-scan/               # Tests: gitleaks-Regeln greifen auf Negativ-Fixtures (AK-2, AK-24)
│  └─ quality-fixtures/          # Tests: knip, dependency-cruiser, ESLint greifen auf Negativ-Fixtures (AK-18)
├─ infra/
│  ├─ local/seed.sql             # Seed-Daten für die lokale DB
│  ├─ tofu/
│  │  ├─ bootstrap/              # einmalig: R2-Bucket für den State
│  │  └─ live/                   # Zone, DNS-Records, Zonen-Einstellungen
│  └─ tests/                     # Vitest: dns.test.ts, repo.test.ts
└─ docs/
   ├─ adr/
   ├─ runbooks/                  # dns-bestand.md, lokale-umgebung.md
   ├─ protokolle/                # Nachweise manueller AKs (AK-4, AK-17, AK-24, AK-25, AK-27)
   ├─ secrets.md                 # Token-Register ohne Werte (AK-14)
   ├─ dsgvo.md                   # Dienstleister: GitHub, Cloudflare, Google
   ├─ kosten.md                  # laufende Kosten (AK-15)
   └─ content/phase-1.md         # Rohmaterial (Artikel XII)
```

Kein `modules/`-Ordner für Tofu und kein `cloud-init`: Das kommt mit Phase S (Artikel XV, keine „für später“-Abstraktionen).

**Erlaubte Abhängigkeiten** (geprüft mit dependency-cruiser):

- `apps/*` → `packages/*`
- `tools/*` → `packages/*`
- `infra/tests` → `packages/*`
- `packages/*` → nie `apps/*`, `tools/*` oder `infra/*`; keine Zyklen

**Neue Abhängigkeiten** (Artikel XI; Lizenzen erlauben eigene und kommerzielle Nutzung):

| Abhängigkeit                                                                                     | Lizenz                                               | Wofür                                               | Warum kein eigener Code                                                                                        |
| ------------------------------------------------------------------------------------------------ | ---------------------------------------------------- | --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| typescript, @types/node                                                                          | Apache-2.0, MIT                                      | Typecheck                                           | Grundlage                                                                                                      |
| eslint, typescript-eslint                                                                        | MIT                                                  | Lint, Komplexitätsgrenzen (AK-18)                   | Komplexitätsmessung selbst bauen wäre unverhältnismäßig                                                        |
| prettier                                                                                         | MIT                                                  | Format                                              | dto.                                                                                                           |
| vitest                                                                                           | MIT                                                  | alle Tests                                          | ein Test-Werkzeug für alles                                                                                    |
| knip                                                                                             | ISC                                                  | ungenutzte Dateien, Exporte, Abhängigkeiten (AK-18) | nicht mit wenigen Zeilen lösbar                                                                                |
| dependency-cruiser                                                                               | MIT                                                  | Zyklen, Modulgrenzen (AK-18)                        | dto.                                                                                                           |
| postgres (porsager)                                                                              | Unlicense                                            | Test-App liest die Seed-Zeile (AK-25)               | Postgres-Protokoll selbst sprechen wäre unsinnig; ohne weitere Abhängigkeiten, später auch von Drizzle nutzbar |
| gitleaks (Binary)                                                                                | MIT                                                  | Secret- und Öffentlich-Scan                         | in der CI als gepinntes Release mit Prüfsumme, nicht als Action (ADR 0008)                                     |
| tflint (Binary)                                                                                  | MPL-2.0                                              | ungenutzte Variablen/Outputs in HCL (XV)            | `tofu validate` erkennt toten Code nicht                                                                       |
| OpenTofu, Cloudflare-Provider                                                                    | MPL-2.0                                              | DNS als Code                                        | ADR 0002                                                                                                       |
| Docker Desktop (lokal)                                                                           | kostenlos für private Nutzung und kleine Unternehmen | lokale Container                                    | ADR 0010                                                                                                       |
| Images `node:24-alpine`, `postgres:17-alpine`                                                    | offiziell                                            | Laufzeit                                            | per Digest gepinnt, Updates über Dependabot                                                                    |
| Actions `actions/checkout`, `actions/setup-node`, `pnpm/action-setup`, `opentofu/setup-opentofu` | MIT/MPL                                              | CI                                                  | offiziell, per Commit-SHA gepinnt                                                                              |

Turborepo, Hook-Bibliotheken, ein Image-Registry-Workflow und das AWS-SDK werden **nicht** gebraucht.

## Datenmodell & Schnittstellen

**Lokale Datenbank** (nur Seed, keine Personendaten):

```sql
create table status_check (id int primary key, message text not null);
insert into status_check values (1, 'Hello codeslage');
```

**`apps/status`** (Node 24 mit Type-Stripping, `node:http`, kein Framework):

| Route         | Antwort                                                                                                                                                           |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GET /`       | einfache HTML-Seite „Hello codeslage“ mit Version                                                                                                                 |
| `GET /health` | `200 { "status": "ok", "version": "<git-sha>", "db": "ok" }`; ist die DB nicht erreichbar oder fehlt die Seed-Zeile: `503 { "status": "error", "db": "<Grund>" }` |

Konfiguration nur über Umgebungsvariablen: `DATABASE_URL`, `APP_VERSION`, `PORT`. Fehlt eine, beendet sich die App mit einer klaren Meldung (XVI). Logs gehen strukturiert (JSON) auf die Standardausgabe, ohne Secrets. Die Smoke-Tests prüfen die Antwort von `/health` gegen ein Schema (Artikel VII).

**Ports lokal:** Beide Dienste binden nur an `127.0.0.1` (App 3000, DB 5432). Das lokale DB-Passwort kommt aus `.env` (Beispielwert in `.env.example`).

**Externe Schnittstellen und Tokens** (alle in `docs/secrets.md` ohne Werte, AK-14):

| Schnittstelle         | Wer                        | Token                      | Rechte                                                                                                                   |
| --------------------- | -------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Cloudflare API        | Tofu lokal                 | `CF_API_TOKEN_RW`          | Zone `codeslage.de`: DNS Edit, Zone Settings Edit, Zone Read; Account: R2 Edit (nur für den Bootstrap, danach entziehen) |
| Cloudflare API        | Drift-Check (CI)           | `CF_API_TOKEN_RO`          | Zone `codeslage.de`: DNS Read, Zone Settings Read, Zone Read                                                             |
| R2 (S3-API)           | Tofu-State lokal           | `R2_STATE_RW`              | Object Read & Write, nur Bucket `codeslage-tofu-state`                                                                   |
| R2 (S3-API)           | Drift-Check (CI)           | `R2_STATE_RO`              | Object Read, nur dieser Bucket                                                                                           |
| State-Verschlüsselung | lokal + CI                 | `TF_ENCRYPTION_PASSPHRASE` | – (zusätzlich im Passwort-Manager)                                                                                       |
| Sperrliste            | CI                         | `PUBLIC_BLOCKLIST`         | –                                                                                                                        |
| GitHub API            | `infra/tests/repo.test.ts` | keiner                     | öffentliche Endpunkte (Repo-Sichtbarkeit, Rulesets)                                                                      |

`main` wird über ein **Repository-Ruleset** geschützt statt über die klassische Branch-Protection. Rulesets lassen sich ohne Admin-Token lesen, deshalb kann der AK-1-Test in der CI ohne Sonderrechte laufen.

## Schritte (je ein oder mehrere PRs, Zuschnitt in `tasks.md`)

### Schritt 1 – Repo & Schutz (AK-1, AK-2, AK-24, AK-17)

- Lokal: `corepack enable` (pnpm), `winget install OpenTofu.Tofu GitHub.cli Gitleaks.Gitleaks`
- `git init`; `.gitattributes` (LF), `.editorconfig`, `.gitignore` (u. a. `.env`, `.sperrliste`, `*.tfstate*`, `.terraform/`), `.env.example`
- `.gitleaks.toml` mit eigenen Regeln für IPv4/IPv6, E-Mail-Adressen (Ausnahmen: freigegebene Rollenadressen, Dokumentations-IPs) und Sperrliste; `.githooks/pre-commit`, aktiviert per `prepare`-Skript (`git config core.hooksPath .githooks`)
- `tools/public-scan` mit Negativ-Fixtures: Fake-Token, IP, E-Mail, Test-Sperrbegriff. Jede Fixture muss den Scan auslösen.
- **Historien-Scan vor dem ersten Push**, Protokoll in `docs/protokolle/`
- Erster Commit auf `main` (Bootstrap des leeren Repos, einzige Ausnahme von „nur per PR“). Danach Repo `codeslage/werkstatt` öffentlich anlegen und ein Ruleset für `main` setzen: PR Pflicht, Status-Checks Pflicht, kein Force-Push, keine Löschung, keine Ausnahme für Admins.
- Sperrliste als GitHub Secret `PUBLIC_BLOCKLIST`
- `ci.yml` (vorerst: gitleaks + public-scan), `docs/secrets.md`, `docs/dsgvo.md`, `docs/kosten.md`
- AK-17: neue Claude-Code-Sitzung ohne Hinweis fragen, Protokoll

### Schritt 2 – CI-Qualität (AK-1, AK-16, AK-18)

- pnpm-Workspace, `packages/config`: tsconfig strict; ESLint mit `complexity` 10, `max-depth` 3, `max-lines-per-function` 50, `max-lines` 300, `no-warning-comments`, `no-empty` (auch für `catch`); Prettier
- `tools/spec-check`: Jede `spec.md`/`plan.md` hat eine Status-Zeile und einen Constitution-Bezug mit Version. Specs haben eine AK-Tabelle. Der Constitution-Check enthält alle 16 Artikel mit ✅/⚠️/–; ⚠️ nur mit Anmerkung. Der Check läuft über `specs/` und gegen Fixtures.
- knip, dependency-cruiser mit den Regeln oben; Negativ-Fixtures in `tools/quality-fixtures` (ungenutzter Export, ungenutzte Abhängigkeit, Zyklus, verbotener Import packages → apps, zu komplexe Funktion, leerer `catch`), aus den normalen Läufen ausgenommen
- `infra/tests/repo.test.ts`: Repo ist öffentlich, Ruleset auf `main` aktiv (AK-1)
- `ci.yml` für alles außer `infra/tofu` (das folgt in Schritt 4); `dependabot.yml` (npm, github-actions, docker, terraform) mit Sicherheits-Updates (AK-29); Prettier-Prüfung (AK-30); PR-Template mit Constitution-Checkliste

### Schritt 3 – Lokale Umgebung & Images (AK-25, AK-26)

- Voraussetzung: V7 (Docker Desktop)
- `apps/status` testgetrieben: Unit-Tests für `/health` (DB ok, DB weg, Seed fehlt, fehlende Variable)
- `apps/status/Dockerfile` (mehrstufig, ohne Root, `HEALTHCHECK`)
- `compose.yaml`: `db` (Postgres, Seed aus `infra/local/seed.sql`, Healthcheck `pg_isready`) und `status` (wartet auf gesunde DB); Ports nur an `127.0.0.1`
- Skripte: `pnpm dev:up` (`docker compose up -d --wait`), `pnpm dev:down`, `pnpm test:smoke` (prüft `/health` gegen das Schema)
- CI-Job `image`: Compose bauen und starten, `test:smoke`, Compose stoppen (AK-26)
- `docs/runbooks/lokale-umgebung.md`: Schritte vom frischen Rechner bis zur laufenden App
- AK-25 manuell: einmal in einem frischen Windows-Benutzerkonto nach Runbook, Protokoll (später auf dem Mac wiederholen)

### Schritt 4 – Cloudflare DNS & State (AK-3, AK-4, AK-5, AK-14)

- Voraussetzung: V2 ✅, **V8** (Zahlungsmethode in Cloudflare hinterlegen, nötig für R2, offene Frage 9), Tokens (V5)
- Bestandsaufnahme aller Records beim Registrar → `docs/runbooks/dns-bestand.md`; Angaben, die nicht öffentlich sein dürfen, nach `codeslage-internal`
- `infra/tofu/bootstrap`: State-Bucket anlegen, danach den eigenen State in den Bucket verschieben; R2-Edit-Recht danach aus `CF_API_TOKEN_RW` entfernen
- `infra/tofu/live`: Zone, alle bestehenden Records 1:1 (zuerst MX, SPF, DKIM, DMARC, Google-Verifizierung). `tofu plan` prüfen wir gemeinsam, erst danach folgt `apply`.
- Zonen-Einstellungen: SSL Full (strict), Always HTTPS, min. TLS 1.2, DNSSEC; DMARC mindestens `p=none` mit Reporting
- `infra/tests/dns.test.ts` (AK-3) zuerst gegen die Cloudflare-Nameserver, **bevor** V6 umgestellt wird; TTL beim Registrar vorher senken
- V6: Inhaber stellt die Nameserver um, danach AK-3 gegen die öffentliche Auflösung; Testmail in beide Richtungen (AK-4) mit Protokoll; DS-Record für DNSSEC beim Registrar
- CI für `infra/`: `tofu validate`, `tofu fmt -check` (AK-30), tflint (AK-18)
- `drift.yml` mit Read-only-Tokens (AK-5)

### Schritt 5 – Alarme & Abschluss (AK-27, AK-14, AK-15, AK-24)

- `history-scan.yml` (monatlich)
- AK-27: einen geplanten Lauf absichtlich fehlschlagen lassen (z. B. per `workflow_dispatch` mit Fehler-Schalter), Mail-Eingang protokollieren. Voraussetzung: GitHub-Benachrichtigungen für Actions sind beim Inhaber aktiv.
- `docs/secrets.md` vollständig mit Ablaufdaten (AK-14); `docs/kosten.md` mit 0 € und der Cloudflare-Abrechnungsseite als Nachweis (AK-15); `docs/dsgvo.md` (AK-28)
- Content-Notizen `docs/content/phase-1.md`; Soll/Ist in der Roadmap

Die Schritte 1 → 2 → 3 bauen aufeinander auf. Schritt 4 (DNS) braucht nur Schritt 1 und kann nach Schritt 1 auch vorgezogen werden, falls der Mail-Umzug früher passen soll.

## Teststrategie

| AK    | Testart                                                                                                                               | Wo                                                                  |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| AK-1  | Infra: Repo öffentlich, Ruleset auf `main` aktiv; CI-Status im PR                                                                     | `infra/tests/repo.test.ts`, `ci.yml`                                |
| AK-2  | gitleaks im Hook und in der CI; Fake-Token-Fixture wird erkannt                                                                       | `.githooks/pre-commit`, `ci.yml`, `tools/public-scan`               |
| AK-24 | Negativ-Fixtures (IP, E-Mail, Sperrbegriff) einzeln gegen Hook, CI und Review-Agent; Historien-Scan vor dem ersten Push und monatlich | `tools/public-scan`, `code-reviewer`, `history-scan.yml`, Protokoll |
| AK-3  | Infra: DNS-Lookup MX, SPF, DKIM, DMARC                                                                                                | `infra/tests/dns.test.ts`                                           |
| AK-4  | manuell: Testmail in beide Richtungen                                                                                                 | `docs/protokolle/`                                                  |
| AK-5  | Infra: `tofu plan -detailed-exitcode` liefert 0                                                                                       | `drift.yml`                                                         |
| AK-14 | Review: `docs/secrets.md` gegen die tatsächlich angelegten Tokens                                                                     | Code-Review Schritt 5                                               |
| AK-15 | manuell: Cloudflare-Abrechnung und GitHub-Abrechnung zeigen 0 €                                                                       | `docs/kosten.md`, Retro                                             |
| AK-16 | Unit: spec-check gegen Fixtures (fehlender Artikel, ⚠️ ohne Anmerkung, fehlende Status-Zeile, fehlende AK-Tabelle)                    | `tools/spec-check`                                                  |
| AK-17 | manuell: neue Sitzung ohne Hinweis fragen                                                                                             | `docs/protokolle/`                                                  |
| AK-18 | Unit: knip, dependency-cruiser, ESLint gegen je eine fehlerhafte Fixture                                                              | `tools/quality-fixtures`                                            |
| AK-25 | Smoke: `dev:up` + `test:smoke` in der CI; manuell einmal auf frischem Benutzerkonto                                                   | `ci.yml` (Job `image`), Protokoll                                   |
| AK-26 | CI: Image bauen, starten, `/health` gegen das Schema prüfen                                                                           | `ci.yml` (Job `image`)                                              |
| AK-27 | manuell, provozierter Fehler: Mail-Eingang                                                                                            | `docs/protokolle/`                                                  |
| AK-28 | Review: `docs/dsgvo.md` gegen die genutzten Dienste (GitHub, Cloudflare, Google, Docker)                                              | Code-Review Schritt 5                                               |
| AK-29 | manuell: erster Dependabot-PR je Ökosystem beobachtet                                                                                 | `docs/protokolle/`                                                  |
| AK-30 | CI: Prettier- und `tofu fmt`-Prüfung gegen eine falsch formatierte Fixture                                                            | `tools/quality-fixtures`, `ci.yml`                                  |

## Constitution-Check

| Artikel                          | Bewertung | Anmerkung                                                                                                                                                                                      |
| -------------------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| I Spec zuerst                    | ✅        | Spec v2 freigegeben am 2026-11-05; Plan wartet auf Freigabe                                                                                                                                    |
| II Tests beweisen die Spec       | ✅        | alle 17 AKs haben einen Test (Tabelle oben); Tests je Schritt mit dem Code, `apps/status` testgetrieben                                                                                        |
| III Kleine Schritte              | ✅        | 5 Schritte mit 18 PRs (je 1–3 Tasks, `tasks.md`); Ausnahme: Bootstrap-Commit des leeren Repos in Schritt 1, danach ist `main` geschützt                                                        |
| IV Fragen statt raten            | ✅        | Fragen 8 (ADR 0010) und 9 (V8, ADR 0002) im Plan beantwortet; Frage 7 betrifft erst Phase S                                                                                                    |
| V Keine zerstörerischen Aktionen | ✅        | kein `apply` ohne gemeinsam geprüften `plan`; Nameserver erst, wenn AK-3 gegen Cloudflare grün ist                                                                                             |
| VI Secrets nie ins Repo          | ✅        | gitleaks lokal + CI, verschlüsselter State, `.env.example` ohne echte Werte, `docs/secrets.md` ohne Werte                                                                                      |
| VII Sicher als Standard          | ✅        | getrennte Read-/Write-Tokens, CI nur lesend, R2-Edit nach dem Bootstrap entzogen; lokale Dienste nur auf `127.0.0.1`; Container ohne Root; `/health` gegen ein Schema geprüft                  |
| VIII Datenschutz & EU            | ✅        | keine Personendaten, lokal nur Seed; GitHub und Cloudflare in `docs/dsgvo.md`                                                                                                                  |
| IX Mensch im Loop                | –         | keine KI-Ausgaben an Kunden                                                                                                                                                                    |
| X Reproduzierbar                 | ✅        | DNS als Code (AK-5), lokale Umgebung als Code + Runbook (AK-25), Images in der CI (AK-26)                                                                                                      |
| XI Einfach vor vollständig       | ✅        | kein Server, kein Turborepo, keine Hook-Bibliothek, keine Registry, kein Tofu-Modul; jede neue Abhängigkeit oben begründet                                                                     |
| XII Offen dokumentieren          | ✅        | ADRs 0002, 0004, 0008–0010; Runbooks, Protokolle, Content-Notizen                                                                                                                              |
| XIII Wiederverwendbar            | ✅        | `packages/config`, `.gitleaks.toml`, Hook, CI-Workflows und `tools/spec-check` ohne codeslage-spezifische Annahmen im Kern (Sperrliste von außen) → Grundlage der Projekt-Vorlage in Phase 1.5 |
| XIV Messen statt schätzen        | ✅        | Zeiten je Task in `tasks.md`, Kosten in `docs/kosten.md`, Soll/Ist in der Roadmap                                                                                                              |
| XV Kein unnötiger Code           | ✅        | knip, dependency-cruiser, ESLint-Grenzen ab Schritt 2, tflint ab Schritt 4 (erst dann gibt es HCL), durch Negativ-Fixtures bewiesen; keine Vorab-Strukturen für Phase S                        |
| XVI Fehler sind sichtbar         | ✅        | AK-27; App beendet sich bei fehlender Konfiguration mit klarer Meldung, `/health` meldet den Grund; leere `catch` per Lint verboten                                                            |

## Risiken

| Risiko                                                                | Gegenmaßnahme                                                                                                                                                                   |
| --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Mail-Ausfall beim Nameserver-Wechsel                                  | Records 1:1 nachbauen, AK-3 gegen die Cloudflare-Nameserver vor V6, niedrige TTL, AK-4 direkt danach                                                                            |
| R2 ohne Zahlungsmethode nicht nutzbar (V8 abgelehnt)                  | Ausweichweg: verschlüsselter State im privaten Repo `codeslage/internal`; dann läuft der Drift-Check nur lokal, und AK-5 wird manuell nachgewiesen. Entscheidung vor Schritt 4. |
| Ungewollte Kosten bei R2                                              | State ist wenige KB, weit unter dem Gratis-Kontingent; Abrechnung in AK-15 geprüft                                                                                              |
| Docker Desktop unter Windows langsam oder hakelig (WSL2, `X:\`)       | Container nur für DB und Test-App, keine Bind-Mounts für Quellcode; Entwicklung nativ                                                                                           |
| Benachrichtigung bei geplanten Workflows geht an den falschen Account | GitHub mailt an den, der den Cron zuletzt geändert hat; Commits laufen unter dem Konto des Inhabers; AK-27 prüft es real                                                        |
| Rulesets lassen sich doch nicht ohne Token lesen                      | AK-1-Test dann lokal mit `gh` des Inhabers statt in der CI; im Test vermerken                                                                                                   |
| Zu strenge Lint-Grenzen                                               | Werte zentral in `packages/config`, Änderung per ADR                                                                                                                            |
