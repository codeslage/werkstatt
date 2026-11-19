# 05 – Phase 1.5 Projekt-Plattform: Plan

> Status: **Entwurf**
> Stand: 2026-11-19
> Bezug: `spec.md` (Status: Geklärt, freigegeben am 2026-11-19), `CONSTITUTION.md` (v1.1.0), `02-architektur.md` (A9, A10), ADR 0002, 0004, 0008, 0009
> SDD-Stufe: 3 Plan

## Technischer Ansatz

Wie in Phase 1 läuft nichts auf einem eigenen Server (ADR 0009). Die Plattform besteht aus vier Teilen:

1. **CWK-Quelle in `werkstatt`:** Ein Manifest `cwk/manifest.json` listet jede Datei des CodeslageWerkzeugKastens: Quelle in `werkstatt`, Ziel im Projekt-Repo, Teil (Regel oder Code), Art (exakt oder ergänzbar). Die Prüfungen sind **wiederverwendbare GitHub-Workflows** (`cwk-rules.yml`, `cwk-code.yml`). Projekt-Repos rufen sie über einen auf einen Commit gepinnten Verweis auf. `werkstatt` nutzt dieselben Workflows selbst, so dass die Prüfungen nicht auseinanderlaufen können (AK-3, Risiko „Vorlage und `werkstatt` laufen auseinander“).
2. **Vorlage und Anlegen:** `codeslage/project-template` ist ein öffentliches GitHub-Template-Repo mit dem CWK und einer minimalen Beispiel-App. Ein Befehl `pnpm cwk new` legt ein Repo aus der Vorlage an, schreibt die Festlegungen in `cwk.json`, setzt den Schutz von `main` und die Sperrliste und startet die erste CI (AK-1 bis AK-6).
3. **Betrieb im privaten Repo `codeslage/plattform`:** Sync, Übersicht, Erinnerung, zentraler Historien-Scan und Portal-Build laufen als GitHub-Workflows in einem **privaten** Repo. Ihre Logs nennen private Repo-Namen und Inhalte. In `werkstatt` wären diese Logs öffentlich. Für den Zugriff auf alle Repos gibt es eine **GitHub App** `codeslage-cwk`. Sie darf Branches pushen und PRs anlegen, aber keinen Schutz umgehen. Ein Pflicht-Check „CWK-Freigabe“ lässt einen Sync-PR erst grün werden, wenn ein Mitglied der Organisation ihn freigegeben hat (AK-8, AK-19).
4. **Docs-Portal als zwei statische Sites** auf Cloudflare Pages, gebaut mit Astro Starlight:
   - `docs.codeslage.de` enthält **nur** öffentliche Doku.
   - `docs-intern.codeslage.de` enthält alles und liegt vollständig hinter **Cloudflare Access**. Zugang haben nur Mail-Adressen auf einer Liste; die Anmeldung läuft über einen Einmal-Code per Mail.

   Weil die beiden Sites getrennt gebaut werden, kann interne Doku nicht über Suche, Seitenindex oder direkte Adressen der öffentlichen Site sichtbar werden (AK-13). Aktualisiert wird so: Ein Organisations-Webhook meldet jeden Push an einen kleinen **Cloudflare Worker**. Der prüft die Signatur und startet den Build in `plattform` (AK-12). Ein nächtlicher Lauf baut zusätzlich alles neu.

Fehler melden sich wie in Phase 1: Ein fehlgeschlagener Workflow-Lauf erzeugt eine GitHub-Mail an den Inhaber (AK-16, AK-22, AK-26). Infrastruktur bei Cloudflare (Pages-Projekte, DNS, Access, Worker) kommt per OpenTofu in `infra/tofu/live` dazu (ADR 0002). Der Rest wird per `gh` vom Befehl `cwk` eingerichtet oder steht im Runbook (AK-21).

Zugehörige ADRs in `docs/adr/`:

| ADR                                                   | Entscheidung                                                                                               | Status        |
| ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ------------- |
| [0011](../../docs/adr/0011-cwk-verteilung.md)         | CWK: Quelle in `werkstatt`, Manifest, wiederverwendbare Workflows, Template-Repo und Sync-PR               | Vorgeschlagen |
| [0012](../../docs/adr/0012-betrieb-plattform-repo.md) | Betrieb in privatem Repo `codeslage/plattform` mit GitHub App, Freigabe-Check, zentrale geplante Läufe     | Vorgeschlagen |
| [0013](../../docs/adr/0013-docs-portal.md)            | Docs-Portal: Starlight auf Cloudflare Pages, zwei getrennte Sites, Access mit Mail-Liste, Webhook → Worker | Vorgeschlagen |

ADR-Nummern: Die Sitzung für Phase 2 kann parallel ADRs anlegen. Vor dem Merge prüfe ich die nächste freie Nummer.

## Bausteine & Struktur

Neu oder geändert in `werkstatt`:

```
werkstatt/
├─ cwk/
│  ├─ manifest.json              # Liste aller CWK-Dateien (Schema unten), Version = Commit von werkstatt
│  └─ files/                     # CWK-Dateien, die es nur für Projekte gibt (z. B. CLAUDE.md-Basis, ci.yml der Projekte)
├─ .github/workflows/
│  ├─ cwk-rules.yml              # wiederverwendbar: Secret-/Öffentlich-Scan, Spec-Check, Format, Rechtschreibung,
│  │                             #   Repo-Einstellungen, CWK-Abgleich (AK-9), CWK-Freigabe (AK-8)
│  ├─ cwk-code.yml               # wiederverwendbar: Lint, Typecheck, Tests, Knip, Modulgrenzen, Container-Build
│  └─ ci.yml                     # ruft cwk-rules.yml und cwk-code.yml lokal auf, dazu die werkstatt-eigenen Jobs (Infra)
├─ tools/
│  └─ cwk/                       # CLI: new, check, sync, status, remind, collect (Unterbefehle unten), mit Tests
├─ apps/
│  ├─ docs/                      # Starlight-Gerüst des Portals; Inhalte werden beim Build eingesammelt
│  └─ docs-trigger/              # Cloudflare Worker: Webhook prüfen → Build in plattform starten
└─ infra/tofu/live/
   ├─ docs.tf                    # Pages-Projekte, Domains, DNS-Einträge
   ├─ access.tf                  # Access-Anwendung und Policy (Mail-Liste aus Variable)
   └─ worker.tf                  # Worker-Skript, Route, Secrets als Bindings (Werte nicht im State-Klartext: State ist verschlüsselt)
```

Neue Repos in der Organisation:

| Repo                          | Sichtbarkeit | `cwk.json`             | Zweck                                                                        |
| ----------------------------- | ------------ | ---------------------- | ---------------------------------------------------------------------------- |
| `codeslage/project-template`  | öffentlich   | Code, Doku öffentlich  | Vorlage (Template-Repo)                                                      |
| `codeslage/plattform`         | privat       | ohne Code, Doku intern | Workflows für Sync, Übersicht, Erinnerung, Historien-Scan, Portal-Build      |
| `codeslage/cwk-probe`         | öffentlich   | Code, Doku öffentlich  | Probe-Repo mit Code für die AK-Tests (bleibt als Probe für Regressionstests) |
| `codeslage/cwk-probe-no-code` | privat       | ohne Code, ohne `docs` | Probe ohne Code, privat ohne Festlegung (AK-14, AK-27)                       |

`codeslage/internal` bekommt eine `cwk.json` mit „ohne Code“ und wird im letzten Schritt angebunden. Laut Frage 5 erscheint es nicht im Portal (`"docs": "none"`).

Abhängigkeitsrichtungen (dependency-cruiser):

- `apps/docs` und `apps/docs-trigger` hängen nur von `packages/config` ab, nicht voneinander und nicht von `tools/`.
- `tools/cwk` hängt nur von `packages/config` und Node-Bordmitteln ab. `tools/public-scan` und `tools/spec-check` ruft es als Prozess auf, nicht per Import, damit die Tools getrennt bleiben.
- Kein Projekt-Repo importiert Code aus `werkstatt`. Geteilt wird nur über kopierte CWK-Dateien und gepinnte Workflow-Verweise.

Neue Abhängigkeiten (Artikel XI):

| Paket                         | Wo                        | Wofür                                                      | Lizenz, Pflege                          | Ohne Paket?                                                             |
| ----------------------------- | ------------------------- | ---------------------------------------------------------- | --------------------------------------- | ----------------------------------------------------------------------- |
| `astro`, `@astrojs/starlight` | `apps/docs`               | statisches Doku-Portal mit Navigation und Suche (Pagefind) | MIT, aktiv gepflegt                     | eigener Generator wäre deutlich mehr Code (A10 nennt Starlight bereits) |
| `wrangler`                    | `apps/docs` (dev)         | Upload der fertigen Site zu Cloudflare Pages               | MIT/Apache-2.0, von Cloudflare gepflegt | Upload per API möglich, aber mehrstufig (Manifest, Hashes); kein Gewinn |
| `@cloudflare/workers-types`   | `apps/docs-trigger` (dev) | Typen für den Worker                                       | MIT/Apache-2.0, von Cloudflare gepflegt | ohne Typen kein `tsc --noEmit` im Worker                                |

Keine Pakete braucht es für: die Schema-Prüfung von `manifest.json`, `cwk.json` und Webhook-Daten (eigene Prüffunktionen mit wenigen Zeilen) und die Webhook-Signatur (HMAC über Web Crypto).

## Datenmodell & Schnittstellen

**`cwk/manifest.json` (in `werkstatt`)**, beim Lesen gegen ein Schema geprüft (Artikel VII):

```json
{
  "files": [
    { "source": "CONSTITUTION.md", "target": "CONSTITUTION.md", "part": "rules", "mode": "exact" },
    { "source": "cwk/files/CLAUDE.md", "target": "CLAUDE.md", "part": "rules", "mode": "extendable" },
    {
      "source": "cwk/files/.github/workflows/ci.yml",
      "target": ".github/workflows/ci.yml",
      "part": "rules",
      "mode": "extendable"
    },
    { "source": "packages/config/eslint.config.js", "target": "eslint.config.js", "part": "code", "mode": "exact" }
  ]
}
```

- `part`: `rules` | `code`. `mode`: `exact` (muss Byte für Byte dem gepinnten Stand entsprechen) | `extendable` (muss außerhalb eines Projektblocks übereinstimmen).
- Projektblock in Markdown: `<!-- cwk:project:start -->` … `<!-- cwk:project:end -->`; in YAML: `# cwk:project:start` … `# cwk:project:end`. Je Datei höchstens ein Block, sein Inhalt gehört dem Projekt.
- Der Regel-Teil umfasst Constitution, `docs/prozess/*`, `specs/_vorlagen/*`, `.claude/commands/*` und `.claude/agents/code-reviewer.md`. Dazu kommen die CLAUDE.md-Basis, das PR-Template, `.githooks/pre-commit`, die Basis der cspell-Konfiguration, die Prettier-Konfiguration, die `ci.yml` der Projekte und `.env.example`. Den Code-Teil bilden die Konfigurationen aus `packages/config`, `.dependency-cruiser.json`, `knip.json` und `Dockerfile`-Gerüst. Die genaue Liste entsteht in Schritt 1 und wird dort getestet.

**`cwk.json` (je Projekt-Repo)**, ebenfalls gegen ein Schema geprüft:

```json
{ "cwk": "<Commit-SHA von werkstatt>", "code": true, "docs": "public" }
```

- `cwk`: Stand des CWK, auf dem das Repo ist (AK-9, AK-10). Der Sync setzt ihn, das Projekt ändert ihn nicht von Hand.
- `code`: `true` (Standard) | `false` = „ohne Code“ (AK-1, AK-7, AK-27).
- `docs`: `public` | `internal` | `none`. Fehlt der Wert, gilt `internal` bei privaten und `public` bei öffentlichen Repos (AK-14). Ein öffentliches Repo kann nicht `internal` sein, weil seine Doku auf GitHub ohnehin öffentlich ist. `cwk check` lehnt das ab.
- Fehlt `cwk.json` in einem Repo der Organisation (außer `werkstatt`), gilt das als Fehler. Der Sync-Lauf wird rot, die Übersicht zeigt das Repo als „nicht angebunden“ (AK-7, Soll-Menge).

**`tools/cwk` – Unterbefehle:**

| Befehl                                   | Läuft                             | Tut                                                                                                                                                    | AK              |
| ---------------------------------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------- |
| `cwk new <name> [--private] [--no-code]` | lokal beim Inhaber (gh-Login)     | Repo aus Vorlage, `cwk.json`, Ruleset für `main` (bei öffentlichen Repos), Secret `PUBLIC_BLOCKLIST` aus `.sperrliste`; ohne Code: Code-Teil entfernen | AK-1, 4, 6, 27  |
| `cwk check`                              | `cwk-rules.yml` in jedem Repo     | vergleicht alle CWK-Dateien mit dem Stand aus `cwk.json` (exakt bzw. außerhalb des Projektblocks); prüft `cwk.json` gegen das Schema                   | AK-9, 14        |
| `cwk sync`                               | `plattform`, nach CWK-Änderung    | je Repo: Soll-Dateien bilden, auf Branch `cwk/sync` committen (ohne Force-Push), PR anlegen oder aktualisieren                                         | AK-7, 8, 25, 27 |
| `cwk status`                             | `plattform`, nachts und nach Sync | Übersicht je Repo: CWK-Stand, Abstand zum neuesten Stand, offener Sync-PR seit; als Seite im internen Portal                                           | AK-10           |
| `cwk remind`                             | `plattform`, täglich              | rot (→ Mail), wenn ein Sync-PR genau 14, 21, 28 … Tage offen ist                                                                                       | AK-26           |
| `cwk collect --visibility`               | `plattform`, Portal-Build         | Doku aller Repos nach `docs` einsammeln; `public` für die öffentliche Site, alles außer `none` für die interne                                         | AK-11, 14       |

**Sync-PR im Detail (AK-25):** Gibt es den Branch `cwk/sync` schon, setzt der Sync darauf auf und legt einen neuen Commit an. Eigene Commits des Inhabers auf dem Branch bleiben so erhalten. In ergänzbaren Dateien bleibt der Projektblock aus dem Stand des Branches stehen. Die PR-Beschreibung nennt den alten und den neuen CWK-Stand und verlinkt die Änderungen in `werkstatt`.

**Freigabe-Check (AK-8, AK-19):** Der Job „CWK-Freigabe“ in `cwk-rules.yml` läuft bei `pull_request` und `pull_request_review`. Kommt der PR vom Branch `cwk/sync`, ist er nur grün, wenn mindestens ein Review den Zustand `APPROVED` hat und von einem Mitglied der Organisation stammt (`author_association` `OWNER` oder `MEMBER`, kein Bot). Bei allen anderen PRs ist er sofort grün. Der Check ist Pflicht-Check im Ruleset. Die App kann deshalb nicht mergen, obwohl sie Schreibrechte für Inhalte hat. Sie hat auch keinen Eintrag in einer Bypass-Liste.

**Webhook → Worker (AK-12):** Der Organisations-Webhook schickt das Ereignis `push` an `https://docs-trigger.codeslage.de`. Der Worker:

1. prüft `X-Hub-Signature-256` mit HMAC-SHA256 und lehnt bei Fehler mit 401 ab;
2. prüft die Nutzdaten gegen ein Schema: nur `ref`, `repository.full_name` und `commits[].added/modified/removed` werden gelesen;
3. tut nichts, wenn der Push nicht `main` betrifft oder keine Doku-Pfade (`docs/`, `specs/`, `cwk.json`) bzw. bei `werkstatt` keine CWK-Pfade berührt;
4. startet sonst per `workflow_dispatch` den Workflow `portal.yml` bzw. bei CWK-Änderungen in `werkstatt` `sync.yml` in `plattform`.

Ungültiges wird abgelehnt, nicht repariert (Artikel VII).

## Voraussetzungen (erledigt der Inhaber selbst)

Claude legt keine Konten und Apps an und gibt keine Tokens in Webformulare ein. Es leitet jeweils Schritt für Schritt an.

| #   | Schritt                                                                                                                                                                                                          | Wann      |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| V1  | GitHub App `codeslage-cwk` in der Organisation anlegen und für alle Repos installieren. Rechte: Contents Write, Pull requests Write, Metadata Read, keine weiteren. Privaten Schlüssel als Secret in `plattform` | Schritt 3 |
| V2  | Cloudflare Zero Trust (Free) aktivieren, Team-Namen wählen                                                                                                                                                       | Schritt 6 |
| V3  | Cloudflare-Token für Tofu um Pages Edit, Access Edit und Workers Edit erweitern (Konto-Ebene); Lese-Token für den Drift-Check entsprechend                                                                       | Schritt 5 |
| V4  | Fine-grained Token „docs-trigger“: nur Repo `plattform`, Actions Write, Ablauf 1 Jahr; Organisations-Webhook mit Secret anlegen                                                                                  | Schritt 7 |
| V5  | Token für den Pages-Upload (nur Pages Edit) als Secret in `plattform`                                                                                                                                            | Schritt 5 |

## Schritte (je ein PR)

### Schritt 1 – CWK-Quelle und Prüfungen in `werkstatt`

`cwk/manifest.json` mit vollständiger Liste und `tools/cwk` mit `check` und Schema-Prüfung, Tests zuerst. `cwk-rules.yml` und `cwk-code.yml` als wiederverwendbare Workflows. `ci.yml` von `werkstatt` ruft sie auf, die Pflicht-Checks im Ruleset werden auf die neuen Job-Namen umgestellt (`repo.test.ts` prüft das). Der Freigabe-Check ist enthalten. Danach hat `werkstatt` dieselben Prüfungen wie vorher, nur anders aufgerufen; der CI-Lauf vorher/nachher wird verglichen.
**AK:** AK-3, AK-9 (Logik), AK-8 (Check-Logik).

### Schritt 2 – Vorlage und `cwk new`

`codeslage/project-template` anlegen: CWK-Dateien, minimale App mit `/health`, Test, Dockerfile, `cwk.json`. Dazu `cwk new` mit Tests (gh-Aufrufe hinter einer kleinen Schnittstelle, damit sie im Test ersetzt werden können) und das Runbook `docs/runbooks/neues-projekt.md`. Probelauf: `cwk-probe` und `cwk-probe-no-code` anlegen, Zeit nach Systemuhr messen. Negativtests je PR-Prüfung im Probe-Repo (Wegwerf-PRs, danach geschlossen).
**AK:** AK-1, AK-2, AK-3 (Nachweis), AK-4, AK-5, AK-6, AK-27 (CI ohne Code).

### Schritt 3 – `plattform`, GitHub App und Sync

Privates Repo `plattform` (über `cwk new --private --no-code`), V1 durch den Inhaber, `sync.yml` mit `cwk sync`. Erst einmal manuell auslösen. Probe-Änderung je Teil: Sync-PRs gegen die Soll-Menge zählen. Zwei Änderungen nacheinander ergeben einen PR. Eine eigene Änderung auf dem Branch bleibt erhalten. Ohne Freigabe ist der Check rot, nach der Freigabe grün.
**AK:** AK-7, AK-8, AK-19 (App-Rechte), AK-25, AK-27 (Sync nur Regel-Teil).

### Schritt 4 – Übersicht, Erinnerung, zentraler Historien-Scan

`cwk status` und `cwk remind` mit Tests (Uhr als Parameter, damit „14 Tage“ prüfbar ist). In `plattform` laufen `status.yml` (nachts), `remind.yml` (täglich) und `history.yml` (monatlich, gitleaks + Sperrliste über alle Repos der Organisation). Alle haben den Eingang `simulate_failure` wie in Phase 1. Provozierte Fehler, Mail-Eingang protokollieren. AK-22 wird zentral erfüllt: `plattform` scannt jeden Monat die Historie jedes Repos. Ein Scan im Projekt-Repo selbst würde seine Fehler-Mail an die App schicken (Risiko „Mail-Empfänger“).
**AK:** AK-10, AK-22, AK-26, AK-16 (Teil Sync).

### Schritt 5 – Öffentliches Docs-Portal

`apps/docs` (Starlight), `cwk collect`, `portal.yml` in `plattform`: einsammeln → Öffentlich-Scan über den gesammelten Inhalt (bei Fund Abbruch vor dem Upload) → Build → Upload. In Tofu: Pages-Projekt `docs`, Domain `docs.codeslage.de`, DNS. Tests: Erreichbarkeit, Inhalt je Repo, `internal` fehlt, Kanarienbegriff verhindert die Veröffentlichung.
**AK:** AK-11, AK-15, AK-23, AK-18 (Teil).

### Schritt 6 – Internes Portal mit Access

Pages-Projekt `docs-intern`, Domain `docs-intern.codeslage.de`. Access-Anwendung für die Domain **und** für `docs-intern.pages.dev` samt Vorschau-Adressen, Policy „Mail-Adresse in Liste“; die Liste ist eine Tofu-Variable aus `.env`, nicht im Repo. Übersicht aus Schritt 4 als interne Seite. Tests ohne Anmeldung: Startseite, tiefe Seite, Suchindex, Sitemap, `pages.dev`- und Vorschau-Adresse werden umgeleitet bzw. abgelehnt. Die öffentliche Site enthält den Kanarien-Inhalt aus `cwk-probe-no-code` nicht. Manuell: mit Test-Adresse freischalten, lesen, entfernen, abgelehnt. Eintrag in `docs/dsgvo.md`.
**AK:** AK-13, AK-14, AK-24, AK-20.

### Schritt 7 – Aktualisierung per Webhook

`apps/docs-trigger` (Worker) mit Tests: gültige und ungültige Signatur, fremde Branches, Pfade ohne Doku, ungültige Nutzdaten. Tofu: Worker, Route, Secrets. V4 durch den Inhaber. Zusätzlich nächtlicher Voll-Build. Messung: Doku-Änderung in `cwk-probe` mergen, Zeit bis zur Anzeige messen (≤ 15 min). Provozierter Fehler im Portal-Build → Mail.
**AK:** AK-12, AK-16 (Teil Portal).

### Schritt 8 – Anbindung `internal`, Kosten, Register, Runbooks

`codeslage/internal` mit `cwk.json` („ohne Code“, `docs: none`) anbinden, erster Sync-PR. Danach `docs/kosten.md`, `docs/secrets.md`, `docs/dsgvo.md` und die Runbooks prüfen: `neues-projekt.md`, `cwk-sync.md`, `docs-portal.md` mit Zugang erteilen und entziehen. Abgleich wie T-42.
**AK:** AK-18, AK-19, AK-20, AK-21, AK-27 (echtes Repo).

## Teststrategie

| AK    | Testart                                                                                                            | Wo                                                                  |
| ----- | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------- |
| AK-1  | Infra: frisch angelegtes Probe-Repo mit und ohne Code auf Pflichtdateien prüfen                                    | `infra/tests/cwk-template.test.ts`                                  |
| AK-2  | Infra: CI-Status des ersten Laufs im Probe-Repo                                                                    | `infra/tests/cwk-template.test.ts`                                  |
| AK-3  | Negativtest je PR-Prüfung im Probe-Repo (Wegwerf-PRs), protokolliert; Unit für `cwk-rules`/`cwk-code`-Aufbau       | `docs/protokolle/`, `tools/cwk/test/`                               |
| AK-4  | Infra: Sichtbarkeit, Ruleset, Pflicht-Checks im Probe-Repo; abgelehnter Direkt-Push                                | `infra/tests/cwk-template.test.ts`, Protokoll                       |
| AK-5  | manuell: neue Claude-Sitzung im Probe-Repo                                                                         | Protokoll                                                           |
| AK-6  | manuell: Probelauf nach Runbook, Zeit nach Systemuhr                                                               | Protokoll                                                           |
| AK-7  | Unit: Soll-Menge und Dateiauswahl je Teil; Infra: Probe-Änderung, Sync-PRs gezählt                                 | `tools/cwk/test/sync.test.ts`, `infra/tests/cwk-sync.test.ts`       |
| AK-8  | Unit: Freigabe-Logik (Bot, Mitglied, kein Review); Infra: Pflicht-Check im Ruleset; manuell: rot → Freigabe → grün | `tools/cwk/test/approval.test.ts`, Protokoll                        |
| AK-9  | Unit: exakt, ergänzbar mit Projektblock, gelöschter Artikel, umformulierter Satz, geänderter CI-Baustein           | `tools/cwk/test/check.test.ts`                                      |
| AK-10 | Unit: Übersicht gegen bekannten Stand (Fixtures)                                                                   | `tools/cwk/test/status.test.ts`                                     |
| AK-11 | Infra: HTTPS, Inhalt je Repo, `internal` fehlt                                                                     | `infra/tests/docs-portal.test.ts`                                   |
| AK-12 | manuell: Merge → Anzeige, Zeit gemessen; Unit: Worker-Filter                                                       | Protokoll, `apps/docs-trigger/test/`                                |
| AK-13 | Infra: alle Zugriffswege ohne Anmeldung abgelehnt; manuell: Anmeldung                                              | `infra/tests/docs-intern.test.ts`, Protokoll                        |
| AK-14 | Unit: Standardwerte von `docs`; Infra: Kanarien-Inhalt aus privatem Probe-Repo nicht öffentlich                    | `tools/cwk/test/collect.test.ts`, `infra/tests/docs-portal.test.ts` |
| AK-15 | Unit + Workflow-Probe: Kanarienbegriff → Build bricht vor dem Upload ab                                            | `tools/cwk/test/collect.test.ts`, Protokoll                         |
| AK-16 | manuell: provozierter Fehler in Sync und Portal-Build → Mail                                                       | Protokoll                                                           |
| AK-18 | Kostenübersicht (Cloudflare, GitHub-Minuten von `plattform`)                                                       | `docs/kosten.md`, Protokoll                                         |
| AK-19 | Review: `docs/secrets.md`; Infra: App-Rechte per API                                                               | Review, `infra/tests/cwk-sync.test.ts`                              |
| AK-20 | Review: `docs/dsgvo.md`                                                                                            | Review                                                              |
| AK-21 | Review: Tofu und Runbooks                                                                                          | Review                                                              |
| AK-22 | automatisiert (geplanter Lauf) + provozierter Fund mit Kanarienbegriff im Probe-Repo → Mail                        | `plattform/history.yml`, Protokoll                                  |
| AK-23 | manuell: Claude-Sitzung liest Seiten von `docs.codeslage.de`                                                       | Protokoll                                                           |
| AK-24 | manuell: Test-Adresse freischalten, lesen, entfernen, abgelehnt                                                    | Protokoll                                                           |
| AK-25 | Unit: Aktualisieren ohne Force-Push, Projektblock und fremde Commits bleiben; Infra: zwei Änderungen → ein PR      | `tools/cwk/test/sync.test.ts`, `infra/tests/cwk-sync.test.ts`       |
| AK-26 | Unit: Tage 13, 14, 20, 21 mit fester Uhr; manuell: Mail                                                            | `tools/cwk/test/remind.test.ts`, Protokoll                          |
| AK-27 | Infra: Probe-Repo ohne Code hat nur Regel-Jobs und ist grün; Sync-PR nur mit Regel-Dateien                         | `infra/tests/cwk-template.test.ts`, `infra/tests/cwk-sync.test.ts`  |

AK-17 entfällt (Spec). Unit-Tests laufen in der CI von `werkstatt`. Infra-Tests brauchen einen Lese-Token für die Organisation und laufen lokal sowie im CI-Job Infra.

## Constitution-Check

| Artikel                          | Bewertung | Anmerkung                                                                                                                                                                                         |
| -------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| I Spec zuerst                    | ✅        | Plan zur geklärten Spec; Vorlage und Sync bringen den SDD-Ablauf in jedes Projekt                                                                                                                 |
| II Tests beweisen die Spec       | ✅        | Teststrategie je AK; Logik als Unit-Tests in `tools/cwk`, Wirkung an den Probe-Repos                                                                                                              |
| III Kleine Schritte              | ✅        | 8 Schritte, je ein PR; Vorlage, Sync und Portal sind getrennt prüfbar                                                                                                                             |
| IV Fragen statt raten            | ✅        | offene Fragen P1–P3 unten; P1 blockiert die Freigabe                                                                                                                                              |
| V Keine zerstörerischen Aktionen | ✅        | Sync nur per PR, nie Force-Push; Probe-Repos bleiben bestehen; keine Repo-Löschung vorgesehen                                                                                                     |
| VI Secrets nie ins Repo          | ✅        | App-Schlüssel, Tokens, Webhook-Secret und die Mail-Liste für Access liegen in Secrets bzw. `.env`; `cwk new` setzt die Sperrliste als Secret                                                      |
| VII Sicher als Standard          | ⚠️        | App ohne Merge-Möglichkeit (Freigabe-Check), Access vor der ganzen internen Site, Worker prüft Signatur und Schema. **Abweichung:** private Repos lassen sich auf GitHub Free nicht schützen (P1) |
| VIII Datenschutz & EU            | ✅        | Access verarbeitet anfangs nur die Mail-Adresse des Inhabers; Eintrag in `docs/dsgvo.md` mit Löschfrist (Schritt 6)                                                                               |
| IX Mensch im Loop                | ✅        | Sync-PRs nur nach Freigabe (Check); öffentliche Doku nur nach Scan                                                                                                                                |
| X Reproduzierbar                 | ✅        | Cloudflare-Teile per Tofu, Repos per `cwk new`, GitHub App und Webhook per Runbook                                                                                                                |
| XI Einfach vor vollständig       | ✅        | kein Server, statische Sites, Worker nur als Weiterleitung; drei neue Pakete mit Begründung                                                                                                       |
| XII Offen dokumentieren          | ✅        | ADRs 0011–0013, Runbooks, öffentliches Portal                                                                                                                                                     |
| XIII Wiederverwendbar            | ✅        | CWK und Vorlage sind genau dieser Baustein; Kundenprojekte nutzen sie unverändert                                                                                                                 |
| XIV Messen statt schätzen        | ✅        | Soll je Task in `tasks.md`; AK-6 und AK-12 messen Zeiten nach der Systemuhr                                                                                                                       |
| XV Kein unnötiger Code           | ✅        | `werkstatt` nutzt dieselben Workflows wie die Projekte (keine Kopie); Vorlage mit minimaler App                                                                                                   |
| XVI Fehler sind sichtbar         | ✅        | alle geplanten Läufe in `plattform` melden Fehler per GitHub-Mail; nächtlicher Voll-Build fängt verlorene Webhooks ab                                                                             |

Bewertung: ✅ erfüllt · ⚠️ Abweichung (mit Begründung) · – nicht relevant

## Risiken

- **Private Repos ohne Schutz (GitHub Free):** Rulesets und Branch-Schutz gibt es auf GitHub Free nur für öffentliche Repos. In privaten Repos (`plattform`, `internal`, private Kundenprojekte) ist AK-4 technisch nicht durchsetzbar. Der Freigabe-Check (AK-8) läuft zwar, kann einen Merge dort aber nicht verhindern. Entscheidung: P1.
- **Mail-Empfänger bei geplanten Läufen:** GitHub benachrichtigt, wer die Cron-Zeile zuletzt geändert hat (Protokoll T-41). Liegen geplante Läufe in Projekt-Repos und kommt die Zeile per Sync von der App, geht die Mail ins Leere. Deshalb laufen alle geplanten Läufe zentral in `plattform`, und die Cron-Zeilen dort ändert nur der Inhaber.
- **GitHub-Cron ist unpünktlich:** Geplante Läufe starten oft verspätet. Für AK-12 deshalb Webhook statt Cron; die Erinnerung (AK-26) verträgt Verspätungen.
- **Verlorene Webhooks:** Fällt der Worker aus oder kommt ein Webhook nicht an, bleibt das Portal bis zum nächtlichen Voll-Build alt. Die Zustellungen sind im Webhook-Protokoll von GitHub sichtbar; die Grenze von 15 Minuten aus AK-12 gilt dann nicht. Akzeptiert, Hinweis im Runbook.
- **Actions-Minuten in `plattform`:** Private Repos haben 2.000 Minuten im Monat frei. Geschätzt: Builds je Doku-Merge (~2 min), nachts Build und Übersicht, täglich Erinnerung, monatlich Historien-Scan → unter 300 Minuten. Die Kostenübersicht prüft das (AK-18).
- **Werkzeug-Versionen in Projekten:** Die Konfigurationen kommen per Sync, die Versionen von ESLint, Prettier usw. stehen aber in der `package.json` des Projekts. Dependabot hält sie aktuell; laufen sie auseinander, kann eine synchronisierte Konfiguration brechen. Das fällt in der CI des Sync-PRs auf.
- **ADR-Nummern parallel zu Phase 2:** siehe oben.

## Offene Fragen

| #   | Frage                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Blockiert? | Antwort |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------- |
| P1  | Auf GitHub Free lassen sich private Repos nicht schützen (AK-4; Durchsetzung von AK-8). Vorschlag: (a) Neue Projekte sind öffentlich, privat nur als begründete Ausnahme. (b) Für private Repos meldet ein täglicher Lauf in `plattform` jeden Commit auf `main`, der nicht aus einem PR stammt, per Mail. (c) AK-4 gilt dann für öffentliche Repos; für private ist das eine ⚠️-Abweichung mit dieser Ersatzprüfung. Alternative: GitHub Team (ca. 4 $ je Nutzer und Monat), widerspricht AK-18. | ja         |         |
| P2  | Adresse des internen Portals: Vorschlag `docs-intern.codeslage.de` (eine Ebene, ADR 0004).                                                                                                                                                                                                                                                                                                                                                                                                        | nein       |         |
| P3  | Name des privaten Betriebs-Repos: Vorschlag `codeslage/plattform`.                                                                                                                                                                                                                                                                                                                                                                                                                                | nein       |         |
