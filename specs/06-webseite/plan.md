# 06 – Phase 2 Webseite (Klick-Dummy): Plan

> Status: **Freigegeben** am 2026-11-19 (Freigabe des Inhabers im Chat)
> Stand: 2026-11-19
> Bezug: `spec.md` (Status: Geklärt, freigegeben am 2026-11-19), `leistungen.md`, `gestaltung.md`, `CONSTITUTION.md` (v1.1.0), `02-architektur.md`, ADR 0002, 0004, 0009, 0014, 0015
> SDD-Stufe: 3 Plan

## Technischer Ansatz

`apps/web` ist eine **statische Seite aus Astro** (ADR 0014). Sie liefert reines HTML und CSS aus, ohne eigenes JavaScript, ohne Cookies und ohne Schriften von außen. Einziges fremdes Skript ist der Beacon von Cloudflare Web Analytics.

- **Hosting:** Cloudflare Pages. Die CI baut die Seite und lädt sie nur von `main` hoch (ADR 0015). Einen Deploy gibt es erst ab dem Livegang-Schritt, nach dem OK des Inhabers (A7). Vorher läuft die Seite nur lokal (`pnpm --filter web dev` bzw. `preview`, AK-11).
- **Infrastruktur:** Pages-Projekt, eigene Domains, DNS-Einträge, die Weiterleitung `www` → Hauptdomain und die Seite für Web Analytics legt OpenTofu in `infra/tofu/live` an (ADR 0002). Die Mail-Einträge bleiben unverändert (AK-13).
- **Impressum:** Name und Anschrift stehen nicht im Repo (Frage 4, V4). Beim Build kommen sie aus Umgebungsvariablen: lokal aus `.env`, im Deploy aus GitHub Secrets. Ein Schema prüft sie (Constitution VII). Fehlt ein Wert oder ist er ungültig, bricht der Build mit einer klaren Meldung ab (XVI). Für Tests und die lokale Vorschau gibt `.env.example` erkennbare Platzhalter vor.
- **Sicherheits-Header** kommen aus einer `_headers`-Datei von Pages (AK-9): HSTS, Content-Security-Policy, `frame-ancestors 'none'`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`. HTTP → HTTPS erledigt die Zoneneinstellung `always_use_https`, die es schon gibt.
- **Tests:** Playwright prüft die gebaute Seite lokal in der CI (E2E, mit axe für Kontraste in hell und dunkel). Lighthouse CI misst jede Seite mobil. Für die Live-Seite kommen Prüfungen in `infra/tests` (Vitest) dazu: Weiterleitungen, Header, Mail-Einträge. Sie laufen nach jedem Deploy und wöchentlich im Drift-Workflow.

Zugehörige ADRs:

| ADR                                                   | Entscheidung                                                               | Status                                                  |
| ----------------------------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------- |
| [0014](../../docs/adr/0014-webseite-astro.md)         | Astro statt Next.js für `apps/web`                                         | Angenommen 2026-11-19                                   |
| [0015](../../docs/adr/0015-webseite-deploy.md)        | Upload aus der CI statt Git-Anbindung; kein Container-Image für `apps/web` | Angenommen 2026-11-19                                   |
| [0004](../../docs/adr/0004-domain-schema.md)          | Webseite auf `codeslage.de`                                                | Vorgeschlagen                                           |
| [0009](../../docs/adr/0009-server-erst-bei-bedarf.md) | Server erst bei Bedarf                                                     | Vorgeschlagen; Ausnahme „Dockerfile je App“ in ADR 0015 |

## Bausteine & Struktur

```
apps/web/                      # neu, Astro, statisch
├─ astro.config.ts             # output 'static', site 'https://codeslage.de', kein Integrations-Zoo
├─ public/
│  ├─ _headers                 # Sicherheits-Header für Pages (AK-9)
│  ├─ favicon.svg              # aus specs/06-webseite/gestaltung/ (AK-17)
│  ├─ logo-zeichen.svg         # Zeichen mit Relief für den Header (AK-17)
│  ├─ apple-touch-icon.png     # 180 px aus dem flachen Zeichen (T-10)
│  └─ robots.txt
├─ src/
│  ├─ layouts/Base.astro       # <html lang="de">, Titel, Beschreibung, Canonical, Favicon, Beacon, Header, Footer
│  ├─ components/              # Header (Wortmarke als Text + Zeichen), Nav, Footer, ContactButton
│  ├─ pages/                   # index, leistungen, projekte/index, projekte/<case-study>, ueber-mich, kontakt,
│  │                           #   impressum, datenschutz, 404
│  ├─ styles/global.css        # Farb-Tokens hell/dunkel (prefers-color-scheme), Systemschriften (gestaltung.md)
│  └─ site/                    # TypeScript: Seitenliste/Navigation, Kontaktadresse, Impressum-Schema
│     ├─ pages.ts              # eine Quelle für Navigation und Tests (Titel, Pfad, Beschreibung)
│     └─ imprint.ts            # liest und prüft IMPRESSUM_* (Schema); Unit-Tests in apps/web/test/ (wie apps/status)
├─ e2e/                        # Playwright: Navigation, Kontakt, Datenschutz, Layout, SEO, Kontrast
├─ lighthouserc.json           # Grenzwerte ≥ 0.9 je Kategorie, mobil, alle Seiten
└─ package.json

infra/tofu/live/web.tf         # neu: Pages-Projekt, Domains, DNS (Apex + www), Redirect-Regel, Web-Analytics-Seite
infra/tests/web.test.ts        # neu: Live-Prüfungen AK-2, AK-9 (laufen erst ab dem Livegang)
.github/workflows/ci.yml       # neuer Pflicht-Job „Webseite (E2E + Lighthouse)“
.github/workflows/deploy-web.yml  # erst im Livegang-Schritt: environment „production“ (nur main), Build, wrangler pages deploy, Live-Tests
```

Abhängigkeitsrichtungen: `apps/web` importiert nichts aus anderen Apps und aus keinem Paket außer `packages/config` (gemeinsame TS-, ESLint- und Prettier-Einstellungen). Kein Paket importiert `apps/web` (Constitution XV). `infra/tests` prüft die Live-Seite nur über HTTP und importiert keinen Code aus `apps/web`.

**Neue Abhängigkeiten** (alle nur in `apps/web` bzw. als Dev-Abhängigkeit; Versionen über das Lockfile, Updates per Dependabot):

| Paket                       | Wofür                                                                       | Lizenz         | Begründung (Artikel XI)                                                                                                  |
| --------------------------- | --------------------------------------------------------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `astro`                     | statische Seite bauen                                                       | MIT            | ADR 0014                                                                                                                 |
| `@playwright/test`          | E2E-Tests (AK-1, 3, 4, 7, 8, 16, 17, 18)                                    | Apache-2.0     | in `02-architektur.md` (A1) bereits vorgesehen                                                                           |
| `@axe-core/playwright`      | Kontrast- und Barrierefreiheitsprüfung in hell und dunkel (AK-18)           | MPL-2.0        | Kontrast nach WCAG selbst zu berechnen wäre fehleranfällig; axe ist der Standard                                         |
| `@lhci/cli`                 | Lighthouse je Seite mit Grenzwerten in der CI (AK-6)                        | Apache-2.0     | die „Fertig, wenn“-Bedingung der Roadmap ist Lighthouse ≥ 90; nutzt das Chromium von Playwright mit                      |
| `@astrojs/check`            | Typecheck für `.astro` (`astro check` im Skript `typecheck` von `apps/web`) | MIT            | `tsc` prüft keine `.astro`-Dateien; ohne das ginge ein Typfehler im Frontmatter durch den Pflicht-Check „Typecheck“ (XV) |
| `prettier-plugin-astro`     | Formatprüfung auch für `.astro` (Format-Check, AK-30 aus 04)                | MIT            | sonst blieben `.astro`-Dateien ungeprüft                                                                                 |
| `eslint-plugin-astro`       | Lint auch für `.astro`                                                      | MIT            | Artikel XV verlangt maschinelle Prüfung jedes Codes                                                                      |
| `wrangler` (erst Schritt 6) | Upload nach Cloudflare Pages                                                | MIT/Apache-2.0 | offizielles Werkzeug, ADR 0015                                                                                           |

Nicht gebraucht: Tailwind oder ein anderes CSS-Framework (eine Datei mit Tokens reicht), UI-Bibliotheken, Analytics-SDKs, eine Bibliothek für das Schema (die Prüfung von drei Feldern sind wenige Zeilen, XI).

## Datenmodell & Schnittstellen

Es gibt keine Datenbank und keine API. Die Schnittstellen sind:

| Schnittstelle                           | Inhalt                                                                                                | Prüfung                                                                                        |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Build-Umgebung `IMPRESSUM_*`            | `IMPRESSUM_NAME`, `IMPRESSUM_STRASSE`, `IMPRESSUM_PLZ_ORT` (Werte nur in `.env` bzw. GitHub Secrets)  | `imprint.ts`: alle Pflicht, nicht leer, Längengrenze, keine Steuerzeichen; sonst Abbruch (VII) |
| Build-Umgebung `PUBLIC_CF_BEACON_TOKEN` | öffentliches Token des Beacons (steht ohnehin im HTML der Live-Seite); GitHub-Variable, nicht im Repo | fehlt es, wird kein Beacon eingebunden (lokal und in Tests)                                    |
| `src/site/pages.ts`                     | Liste der Seiten: Pfad, Titel, Beschreibung, in Navigation ja/nein                                    | Unit-Test: Pfade eindeutig, Titel eindeutig, Beschreibung 50–160 Zeichen                       |
| Kontaktadresse                          | Konstante `kontakt@codeslage.de` (freigegebene Rollenadresse, `.gitleaks.toml`)                       | E2E AK-3                                                                                       |
| `_headers`                              | Sicherheits-Header je Pfad                                                                            | Live-Test AK-9                                                                                 |

Content-Security-Policy (Entwurf): `default-src 'self'; script-src 'self' https://static.cloudflareinsights.com; connect-src 'self' https://cloudflareinsights.com; img-src 'self' data:; style-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'`. Astro wird so eingestellt, dass es kein Inline-CSS erzeugt (`build.inlineStylesheets: 'never'`). So kommt die Seite ohne `'unsafe-inline'` aus.

## Schritte (je ein oder mehrere PRs, Zuschnitt in `tasks.md`)

**Text-PR** ist jeder PR, der öffentlich sichtbaren Text anlegt oder ändert. Das gilt in jedem Schritt, auch für Seitentitel und Beschreibungen in `pages.ts`, Navigation, Footer, die 404-Seite und die Wortmarke. Claude mergt einen Text-PR erst nach ausdrücklicher Freigabe des Inhabers, nach Ansicht der lokalen Vorschau (Spec, Frage 9, AK-11). Technik-PRs ohne sichtbaren Text folgen der Regel „selbst mergen bei grüner CI ohne 🔴“. Vor dem Livegang gibt der Inhaber außerdem die **vollständige Seite** in der lokalen Vorschau frei (Gesamtabnahme, Schritt 6).

### Schritt 1 – Gerüst und Prüfstand (AK-1, AK-4, AK-6, AK-7, AK-8, AK-10) · Technik-PR + kleiner Text-PR

- **Technik-PR:** `apps/web` mit Astro, `Base`-Layout, Header, Navigation, Footer, alle Seiten aus `pages.ts` und die 404-Seite. Sichtbare Texte (Titel, Beschreibungen, Navigation, Footer, 404) sind darin erkennbare Platzhalter wie `[Titel Startseite]`. So kann Claude den Prüfstand selbst mergen, ohne auf eine Freigabe zu warten. Die Tests prüfen Regeln (eindeutig, Länge, vorhanden), keine Wortlaute.
- **Text-PR:** die echten Titel, Beschreibungen, Navigations- und Footer-Texte und der 404-Text. Gemergt wird nach Freigabe des Inhabers. Platzhalter gehen nie live (A6), und vor Schritt 6 prüft ein Test, dass kein `[`…`]`-Platzhalter mehr im Build steht.
- `imprint.ts` mit Unit-Tests; `.env.example` mit Platzhaltern (z. B. „Erika Mustermann“).
- Playwright-Suite und Lighthouse CI als neuer Job „Webseite (E2E + Lighthouse)“ in `ci.yml` von `werkstatt` (app-spezifisch, nicht in den gemeinsamen CWK-Workflows aus Plan 05). Pflicht wird er über das Modell, das dann auf `main` gilt: Liegt Schritt 1 aus Plan 05 schon vor, steht der Job in `needs` von `ci-ok`, und `ci-ok` ist der Pflicht-Check. Sonst kommt er direkt ins Ruleset (Einstellungsänderung nur mit Freigabe des Inhabers). `infra/tests/repo.test.ts` prüft das jeweilige Modell.
- ESLint, Knip, Prettier und der Typecheck (`astro check`) kennen `apps/web` und `.astro`. dependency-cruiser liest `.astro` nicht; die Regel „nur-nach-packages“ prüft dafür `tools/astro-imports` (wenige Zeilen eigener Code, keine neue Abhängigkeit) im selben Check „Modulgrenzen“. Geprüft werden Frontmatter und `<script>`-Blöcke, auch dynamische Imports und `import.meta.glob`. Nicht abgedeckt sind Zyklen zwischen `.astro`-Dateien und Import-Ziele, die erst zur Laufzeit berechnet werden; die Seiten importieren nur Komponenten und `src/site/`.

### Schritt 2 – Gestaltung und Logo (AK-17, AK-18, AK-6) · Text-PR (Wortmarke, Header)

- Farb-Tokens hell und dunkel, Systemschriften, Raster und Abstände nach `gestaltung.md`; Links im Fließtext unterstrichen.
- Wortmarke `codeslage_` als Text im Header, Zeichen `>_` als SVG; `favicon.svg`, dazu `apple-touch-icon.png` (180 px), erzeugt aus dem SVG.
- Screenshots hell und dunkel, mobil und Desktop, im PR für den Inhaber.

### Schritt 3 – Inhalte (AK-3, AK-11, AK-16) · Text-PR · braucht V2, V3

- Startseite, Leistungen (nach `leistungen.md`, KI-Automatisierung „im Aufbau“), Projekte mit der Case Study „Wir bauen erst, wenn wir es brauchen“ (Zahlen der Soll/Ist-Wette, Quelle `docs/content/`), Über mich (Quelle LinkedIn-PDF, Foto; ohne Arbeitgeber- und Kundennamen ohne Freigabe), Kontakt mit `kontakt@codeslage.de`.
- Offene Punkte aus `leistungen.md` (Beispiele, „im Aufbau“, Erstgespräch) werden mit den Entwürfen entschieden (Spec, Frage 14).
- Möglich als mehrere PRs (eine Seite je PR), damit der Inhaber in kleinen Stücken freigibt.

### Schritt 4 – Rechtliches (AK-12, AK-14, AK-15) · Text-PR

- Datenschutzerklärung: Grundlage aus einem Generator (A8; Abweichung in T-17: nur die Gliederung, eigener Text, Frage 17), abgeglichen mit Hosting (Cloudflare Pages), Besuchsmessung (Cloudflare Web Analytics) und Mail-Link; keine Cookies.
- Impressum mit den Angaben aus `IMPRESSUM_*` und der Rollenadresse.
- `docs/dsgvo.md`: Cloudflare Pages und Web Analytics ergänzen. `docs/kosten.md`: Pages und Web Analytics im Free-Plan, 0 €.

### Schritt 5 – Infrastruktur als Code (AK-2, AK-9, AK-15 vorbereitet) · Entwurfs-PR bis Schritt 6

- `infra/tofu/live/web.tf`: Pages-Projekt (Direct Upload, Produktions-Branch `main`), Domains `codeslage.de` und `www.codeslage.de`, die zugehörigen DNS-Einträge, eine Redirect-Regel `www` → `https://codeslage.de` (301, Pfad bleibt erhalten), Seite für Web Analytics.
- In diesem Schritt nur `tofu plan` (CI und lokal), **kein `apply`**: Vorher dürfen weder die Domain noch `*.pages.dev` etwas ausliefern.
- Der PR bleibt bis Schritt 6 **als Entwurf offen** und wird erst im Livegang gemergt, direkt nach dem `apply`. Läge `web.tf` vorher auf `main`, wäre der Drift-Check bis zum Livegang dauerhaft rot und würde echte Abweichungen (z. B. an den Mail-Einträgen) verdecken.
- Rechte der Tokens festlegen und mit Plan 05 (V3) abstimmen, damit sie nur einmal erweitert werden:
  - `codeslage-tofu-rw`: zusätzlich Pages (Bearbeiten), Web Analytics (Bearbeiten, Konto) und Zonen-Regeln für die Weiterleitung (Bearbeiten).
  - `codeslage-tofu-ro`: dieselben Bereiche nur lesend, damit der Drift-Check sie lesen kann.
  - neuer Token `codeslage-pages-deploy` nur mit „Cloudflare Pages: Edit“ und Ablaufdatum.

  Die genauen Bezeichnungen der Rechte prüft Claude beim Anlegen in der Doku von Cloudflare. Alles kommt in `docs/secrets.md` und ins Runbook `token-erneuerung.md`, angelegt wird noch nichts.

- Live-Tests `infra/tests/web.test.ts` schreiben (AK-2, AK-9). Sie werden erst in Schritt 6 aktiv und sind bis dahin nicht Teil eines Workflows.

### Schritt 6 – Livegang (AK-2, AK-5, AK-9, AK-13, AK-15) · nur nach OK des Inhabers

Voraussetzungen: V1 (Alias `kontakt@codeslage.de`), V4 (Impressumsangaben), Frage 15 (rechtliche Prüfung durch den Inhaber), alle Text-PRs gemergt und die **Gesamtabnahme** der vollständigen Seite in der lokalen Vorschau durch den Inhaber (AK-11).

1. 👤 Inhaber legt den Token `codeslage-pages-deploy` an und erweitert die Rechte von `codeslage-tofu-rw` und `codeslage-tofu-ro` (Schritt 5); Claude leitet an. GitHub-Environment `production` anlegen, das nur `main` verwenden darf. Die Secrets `CF_PAGES_TOKEN` und `IMPRESSUM_*` kommen **nur in dieses Environment** und nicht als Repo-Secrets, dazu die Variable `PUBLIC_CF_BEACON_TOKEN` (ADR 0015, Restrisiko). Die Einstellungsänderung braucht die Freigabe des Inhabers.
2. `tofu plan` vom Branch aus Schritt 5 prüfen, dem Inhaber zeigen, dann `tofu apply` (lokal, ADR 0002) und den PR aus Schritt 5 sofort mergen; der Drift-Check muss danach grün sein. Vorher MX, SPF, DKIM und DMARC festhalten.
3. `deploy-web.yml` einführen, Job mit `environment: production`: bei Push auf `main` (nur bei Änderungen in `apps/web`) bauen, hochladen, danach `infra/tests` mit den Web-Tests. Die Web-Tests kommen zusätzlich in den wöchentlichen Drift-Workflow (XVI: ein Ausfall fällt spätestens nach einer Woche per Mail auf; ohne SLA reicht das bis Phase S, Spec-Risiken). Der Drift-Workflow bleibt in `werkstatt`; „geplante Läufe nur in `platform`“ aus Plan 05 gilt für Läufe über mehrere Repos. Den Takt ändert nur der Inhaber, weil die Cron-Zeile bestimmt, wer die Fehler-Mail bekommt (T-41).
4. Nachweise: Live-Tests grün, DNS-Test der Mail-Einträge grün, Testmail an und von `@codeslage.de` (AK-13), erster Besuch und Aufruf der Kontaktseite in der Auswertung (AK-5, Screenshot). Alles kommt ins Protokoll.

## Teststrategie

| AK    | Testart                                                                                                                                                                                                 | Wo                                                   |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| AK-1  | E2E: jede Seite aus `pages.ts` liefert 200; von jeder Seite führen Links zu jeder Hauptseite, Impressum, Datenschutz                                                                                    | `apps/web/e2e/navigation.spec.ts`                    |
| AK-2  | Live: `http://` und `www.` → 301 auf `https://codeslage.de/…`, Pfad bleibt erhalten; Hauptdomain 200                                                                                                    | `infra/tests/web.test.ts` (ab Schritt 6)             |
| AK-3  | E2E: alle Kontakt-Links zeigen auf `/kontakt/`; dort ist `kontakt@codeslage.de` als Text sichtbar, und es gibt genau einen Link `mailto:kontakt@codeslage.de`; kein `<form>` auf keiner Seite           | `apps/web/e2e/contact.spec.ts`                       |
| AK-4  | E2E: keine Cookies, `localStorage`/`sessionStorage` leer; alle Anfragen gehen an den eigenen Ursprung, mit dem Beacon als einziger erlaubter Ausnahme (Test baut einmal mit Beacon-Token)               | `apps/web/e2e/privacy.spec.ts`, `beacon.spec.ts`     |
| AK-5  | manuell: Auswertung zeigt Besuche je Seite und Aufrufe von `/kontakt/`; Screenshot im Protokoll                                                                                                         | Protokoll Schritt 6                                  |
| AK-6  | Lighthouse CI, mobil, je Seite drei Läufe (Median), alle vier Kategorien ≥ 0,9                                                                                                                          | `apps/web/lighthouserc.json`, CI-Job                 |
| AK-7  | E2E bei 375 × 812 und 1280 × 800: `scrollWidth` ≤ Fensterbreite auf jeder Seite                                                                                                                         | `apps/web/e2e/layout.spec.ts`                        |
| AK-8  | Unit: Titel und Beschreibungen eindeutig; E2E: `lang="de"`, `<title>`, `meta description` je Seite, alle internen Links liefern 200, unbekannter Pfad → 404-Seite                                       | `apps/web/test/pages.test.ts`, `e2e/seo.spec.ts`     |
| AK-9  | Live: HSTS, CSP, `frame-ancestors`, `X-Content-Type-Options`, `Referrer-Policy` vorhanden; nur HTTPS                                                                                                    | `infra/tests/web.test.ts` (ab Schritt 6)             |
| AK-10 | CI: Job „Webseite (E2E + Lighthouse)“ ist Pflicht für den Merge, entweder über `needs` von `ci-ok` (Modell aus Plan 05) oder direkt im Ruleset                                                          | `infra/tests/repo.test.ts`                           |
| AK-11 | Review und manuell: jeder PR mit sichtbarem Text als Text-PR mit Freigabe des Inhabers; Gesamtabnahme der lokalen Vorschau vor Schritt 6; bis Schritt 6 gibt es keinen Deploy-Workflow und kein `apply` | Review-Checkliste, Protokoll Schritt 6               |
| AK-12 | manuell: Prüfung von Impressum und Datenschutzerklärung durch den Inhaber; Unit-Test: Build bricht ohne gültige `IMPRESSUM_*` ab                                                                        | Protokoll Schritt 4, `apps/web/test/imprint.test.ts` |
| AK-13 | DNS-Test (vorhanden) nach dem `apply` + Testmail                                                                                                                                                        | `infra/tests/dns.test.ts`, Protokoll Schritt 6       |
| AK-14 | Review: Einträge in `docs/dsgvo.md`                                                                                                                                                                     | Review Schritt 4                                     |
| AK-15 | Kostenübersicht `docs/kosten.md`; Cloudflare-Abrechnung nach dem Livegang                                                                                                                               | Review Schritt 4, Protokoll Schritt 6                |
| AK-16 | E2E: Case-Study-Seite liefert 200 und ist von „Projekte“ verlinkt                                                                                                                                       | `apps/web/e2e/navigation.spec.ts`                    |
| AK-17 | E2E: Logo im Header jeder Seite, `<link rel="icon">` auf `favicon.svg` liefert 200; Freigabe des Logos liegt vor (Stufe 2)                                                                              | `apps/web/e2e/brand.spec.ts`                         |
| AK-18 | E2E mit axe, Regel `color-contrast` (WCAG AA), je Seite in `light` und `dark` (Playwright `colorScheme`)                                                                                                | `apps/web/e2e/contrast.spec.ts`                      |

Die Tests aus Schritt 1 entstehen vor dem Inhalt. Sie prüfen Struktur und Regeln, keine Wortlaute, damit Text-PRs sie nicht anfassen müssen (Constitution II).

## Constitution-Check

| Artikel                          | Bewertung | Anmerkung                                                                                                                                                      |
| -------------------------------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| I Spec zuerst                    | ✅        | Spec geklärt und freigegeben; dieser Plan vor jedem Code                                                                                                       |
| II Tests beweisen die Spec       | ✅        | jedes AK hat einen Test (Tabelle oben); Prüfstand in Schritt 1 vor den Inhalten                                                                                |
| III Kleine Schritte              | ✅        | sechs Schritte, Texte seitenweise als eigene PRs                                                                                                               |
| IV Fragen statt raten            | ✅        | Framework, Deploy-Weg und Image vom Inhaber entschieden (ADR 0014, 0015); Voraussetzungen V1–V4 benannt                                                        |
| V Keine zerstörerischen Aktionen | ✅        | `apply` erst im Livegang, nach gezeigtem `plan` und Freigabe; Mail-Einträge werden nicht angefasst und vorher festgehalten                                     |
| VI Secrets nie ins Repo          | ✅        | Impressumsangaben und Tokens nur in `.env` und GitHub Secrets; `.env.example` mit Platzhaltern                                                                 |
| VII Sicher als Standard          | ✅        | Token nur mit „Pages: Edit“; strenge CSP ohne `unsafe-inline`; Eingaben zur Build-Zeit per Schema geprüft                                                      |
| VIII Datenschutz & EU            | ✅        | keine Cookies, keine fremden Schriften; Cloudflare in `docs/dsgvo.md` ergänzt (AK-14)                                                                          |
| IX Mensch im Loop                | ✅        | jeder PR mit sichtbarem Text nur nach Freigabe; Gesamtabnahme vor dem Livegang; Vorschau nur lokal; Deploy erst nach OK                                        |
| X Reproduzierbar                 | ⚠️        | Pages, DNS, Weiterleitung und Analytics per OpenTofu, Deploy als Workflow. Abweichung: kein Container-Image für `apps/web` (ADR 0015, vom Inhaber entschieden) |
| XI Einfach vor vollständig       | ✅        | statisches HTML ohne JS und Backend; kein CSS-Framework, keine Schema-Bibliothek; jede neue Abhängigkeit begründet                                             |
| XII Offen dokumentieren          | ✅        | ADR 0014 und 0015, `02-architektur.md` angepasst, Protokolle je Schritt, Case Study auf der Seite                                                              |
| XIII Wiederverwendbar            | ✅        | Layout, Tokens, Header-Konfiguration und Prüfstand (E2E, Lighthouse, axe) ohne codeslage-Annahmen im Kern, als Vorlage für Kunden-Webseiten                    |
| XIV Messen statt schätzen        | ✅        | Besuche und Kontakt-Interesse (AK-5); Lighthouse-Werte je Lauf; Zeiten in `zeiten.md`                                                                          |
| XV Kein unnötiger Code           | ✅        | Lint, Knip, Modulgrenzen (über `tools/astro-imports`) und Format auch für `.astro`; eine Quelle für die Seitenliste                                            |
| XVI Fehler sind sichtbar         | ✅        | Build bricht bei fehlenden Impressumsangaben ab; Deploy- und Live-Test-Fehler machen die CI rot, wöchentliche Live-Prüfung im Drift-Workflow mit Mail          |

## Risiken

| Risiko                                                                                                                                      | Gegenmaßnahme                                                                                                                                                                          |
| ------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Lighthouse-Werte schwanken in der CI                                                                                                        | drei Läufe je Seite, Median; Seite ohne JS und ohne fremde Schriften hat Reserve                                                                                                       |
| Der Beacon von Web Analytics verlangt CSP-Ausnahmen oder Inline-Code                                                                        | Beacon als externes Skript mit eigenem Tag; CSP erlaubt nur die zwei Cloudflare-Hosts; Live-Test prüft die CSP                                                                         |
| Die Tofu-Ressourcen für Pages oder Web Analytics im Provider 5.x verhalten sich anders als erwartet                                         | in Schritt 5 nur `plan`; Abweichungen dort beheben, bevor etwas live geht; Rückfall: Domain-Verknüpfung per Runbook dokumentieren (X)                                                  |
| `*.pages.dev` liefert die Seite auch aus                                                                                                    | Canonical-Link auf `codeslage.de`; erst ab Schritt 6, also nach Freigabe                                                                                                               |
| Eine Freigabe für Text-PRs bleibt aus und hält den Livegang auf                                                                             | Technik und Text getrennt: Gerüst und Prüfstand (Schritt 1, Technik-PR), Gestaltung und Infrastruktur laufen ohne Freigabe weiter; Texte seitenweise in kleinen Text-PRs               |
| Ein Fehler bei der DNS-Änderung trifft die Mail                                                                                             | `web.tf` ändert nur Einträge für `@` (A/AAAA bzw. CNAME) und `www`, nie MX/TXT; `plan` vor dem `apply` zeigen; AK-13 direkt danach                                                     |
| Phase 1.5 (ADR 0013, PR #53) legt ebenfalls Pages-Projekte, DNS und Access in `infra/tofu/live` an und erweitert die Rechte des Tofu-Tokens | eigene Datei `web.tf`; vor Schritt 5 den Stand von Phase 1.5 auf `main` prüfen; Token-Rechte gemeinsam erweitern; Pflicht-Check nach dem jeweils geltenden Modell (`ci-ok`, Schritt 1) |
