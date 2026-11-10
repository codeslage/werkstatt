# 04 – Phase 1 Fundament: Tasks

> Stand: 2026-11-10
> Bezug: `spec.md` (v2.1, Freigegeben am 2026-11-05), `plan.md` (v1.1, Freigegeben am 2026-11-05)
> SDD-Stufen: 4 Tasks · 5 Analyze · 6 Implement

## Tasks

Soll in Stunden (Claude, konservativ, inkl. Abstimmung); Ist wird bei Abschluss eingetragen (Artikel XIV).

⛔ = braucht vorher die ausdrückliche Freigabe des Inhabers. 👤 = erledigt der Inhaber selbst, Claude leitet an.

### Schritt 1 – Repo & Schutz

| ID | Task | AK | Test | Abhängig von | PR | Soll | Ist | Status |
|---|---|---|---|---|---|---|---|---|
| T-01 | Lokale Werkzeuge installieren (pnpm über corepack, OpenTofu, gh, gitleaks), Versionen ins Runbook `lokale-umgebung.md` | AK-25 | manuell: `--version`-Ausgaben im Protokoll | – | Bootstrap | 0,5 | 0,25 | ✅ |
| T-02 | Grunddateien: `git init`, `.gitattributes` (LF), `.editorconfig`, `.gitignore`, `.env.example` | AK-2, AK-25 | T-03 prüft, dass `.env`, `.sperrliste`, `*.tfstate*` ignoriert werden | T-01 | Bootstrap | 0,5 | 0,25 | ✅ |
| T-03 | `tools/public-scan`: Tests + Negativ-Fixtures (Fake-Token, IPv4, IPv6, E-Mail, Test-Sperrbegriff), zunächst rot; minimales Root-`package.json` mit Vitest | AK-2, AK-24 | Vitest | T-02 | Bootstrap | 2 | 0,25 | ✅ |
| T-04 | `.gitleaks.toml`: Standardregeln + eigene Regeln (IP, E-Mail mit Ausnahmen, Sperrliste), bis T-03 grün ist | AK-2, AK-24 | T-03 | T-03 | Bootstrap | 2 | 0,25 | ✅ |
| T-05 | `.githooks/pre-commit` + `prepare`-Skript | AK-2, AK-24 | Vitest: Commit mit Fixture in einem Wegwerf-Repo wird abgelehnt | T-04 | Bootstrap | 1 | 0,25 | ✅ |
| T-06 | `ci.yml` Grundversion: gitleaks-Binary gepinnt mit Prüfsumme, public-scan-Tests, Sperrliste aus Secret | AK-1, AK-2, AK-24 | läuft ab dem ersten PR; Negativtest in T-11 | T-04 | Bootstrap | 2 | 0,25 | ✅ |
| T-07 | Doku-Gerüst: `docs/secrets.md`, `docs/kosten.md`, `docs/dsgvo.md`, `docs/protokolle/` | AK-14, AK-15, AK-28 | Review | T-02 | Bootstrap | 1 | 0,25 | ✅ |
| T-08 | Historien-Scan über alle lokalen Commits vor dem ersten Push | AK-24 | gitleaks `--log-opts=--all`, Protokoll | T-05, T-06, T-07 | Bootstrap | 0,5 | 0,25 | ✅ |
| T-09 | ⛔ Bootstrap-Commit auf `main`, Repo `codeslage/werkstatt` öffentlich anlegen, Push (= Veröffentlichung) | AK-1 | T-20 | T-08 | Bootstrap | 0,5 | 0,25 | ✅ |
| T-10 | Ruleset für `main` (PR + Status-Checks Pflicht, kein Force-Push, keine Löschung, keine Admin-Ausnahme); 👤 Secret `PUBLIC_BLOCKLIST` | AK-1, AK-24 | T-20; manuell: direkter Push auf `main` wird abgelehnt | T-09 | Einstellung | 0,5 | 0,25 | ✅ |
| T-11 | Negativtest Ebene 2 und 3: Wegwerf-PR mit IP, E-Mail und Sperrbegriff außerhalb der Fixtures → CI rot, `code-reviewer` meldet 🔴; PR schließen | AK-24 | Protokoll | T-10 | PR-01 (wird nicht gemergt) | 1 | 0,25 | ✅ |
| T-12 | Neue Claude-Code-Sitzung ohne Hinweis nach Constitution und SDD-Befehlen fragen; Protokolle T-08, T-11, T-12 einchecken | AK-17, AK-24 | Protokoll | T-11 | PR-02 | 0,25 | 0,5 | ✅ |

### Schritt 2 – CI-Qualität

| ID | Task | AK | Test | Abhängig von | PR | Soll | Ist | Status |
|---|---|---|---|---|---|---|---|---|
| T-13 | pnpm-Workspace, `packages/config` mit tsconfig strict, Job `typecheck` in der CI | AK-1 | CI-Job grün | T-10 | PR-03 | 1 | | ⬜ |
| T-14 | `tools/quality-fixtures`: Tests für ESLint-Regeln (Komplexität, Tiefe, Funktions- und Dateilänge, `TODO`, leerer `catch`), zunächst rot | AK-18 | Vitest | T-13 | PR-04 | 1,5 | | ⬜ |
| T-15 | ESLint-Konfiguration in `packages/config`, bis T-14 grün; Job `lint` | AK-18 | T-14 | T-14 | PR-04 | 1,5 | | ⬜ |
| T-16 | knip: Fixtures (ungenutzte Datei, ungenutzter Export, ungenutzte Abhängigkeit) + Konfiguration + Job | AK-18 | Vitest | T-13 | PR-05 | 2 | | ⬜ |
| T-17 | dependency-cruiser: Fixtures (Zyklus, `packages` → `apps`) + Regeln + Job | AK-18 | Vitest | T-13 | PR-06 | 2 | | ⬜ |
| T-18 | `tools/spec-check`: Tests mit Fixtures (fehlender Artikel, ⚠️ ohne Anmerkung, fehlende Status-Zeile, fehlender Constitution-Bezug, fehlende AK-Tabelle), zunächst rot | AK-16 | Vitest | T-13 | PR-07 | 1,5 | | ⬜ |
| T-19 | `tools/spec-check` umsetzen, bis T-18 grün; Job prüft alle `spec.md`/`plan.md` unter `specs/` | AK-16 | T-18; bestehende Specs grün | T-18 | PR-07 | 3 | | ⬜ |
| T-20 | `infra/tests/repo.test.ts`: Repo öffentlich, Ruleset auf `main` aktiv | AK-1 | Vitest in der CI | T-13 | PR-08 | 1 | | ⬜ |
| T-21 | PR-Template mit Constitution-Checkliste (inkl. Punkt „Öffentlich vs. intern“) | AK-24 | Review | T-10 | PR-08 | 0,5 | | ⬜ |
| T-22 | `dependabot.yml` (npm, github-actions, docker, terraform), Sicherheits-Updates aktivieren | AK-29 | erster Dependabot-PR beobachtet, Protokoll | T-13 | PR-09 | 0,5 | | ⬜ |
| T-23 | Prettier in `packages/config`, Job `format` | AK-30 | Fixture mit falscher Formatierung → rot | T-13 | PR-09 | 0,5 | | ⬜ |

### Schritt 3 – Lokale Umgebung & Images

| ID | Task | AK | Test | Abhängig von | PR | Soll | Ist | Status |
|---|---|---|---|---|---|---|---|---|
| T-24 | 👤 V7: Docker Desktop installieren | AK-25 | `docker version` im Protokoll | – | – | 0,25 | | ⬜ |
| T-25 | `apps/status`: Unit-Tests für `/` und `/health` (DB ok, DB weg, Seed fehlt, Variable fehlt, Antwort-Schema), zunächst rot | AK-25, AK-26 | Vitest | T-15, T-16, T-17 | PR-10 | 2 | | ⬜ |
| T-26 | `apps/status` umsetzen (`node:http`, `postgres`, JSON-Logs), bis T-25 grün | AK-25 | T-25 | T-25 | PR-10 | 2 | | ⬜ |
| T-27 | `apps/status/Dockerfile`: mehrstufig, ohne Root, `HEALTHCHECK` | AK-26 | T-29 | T-24, T-26 | PR-11 | 1 | | ⬜ |
| T-28 | `compose.yaml` + `infra/local/seed.sql`; Ports nur `127.0.0.1`; DB-Variablen in `.env.example` | AK-25 | T-29 | T-27 | PR-11 | 1 | | ⬜ |
| T-29 | Skripte `dev:up`, `dev:down`, `test:smoke` (prüft `/health` gegen das Schema) | AK-25, AK-26 | lokal grün | T-28 | PR-11 | 1 | | ⬜ |
| T-30 | CI-Job `image`: Compose bauen und starten, `test:smoke`, stoppen | AK-26 | CI-Job grün; mit kaputtem Seed rot | T-29 | PR-12 | 1 | | ⬜ |
| T-31 | Runbook `lokale-umgebung.md` vervollständigen; einmal in frischem Windows-Benutzerkonto durchspielen | AK-25 | Protokoll | T-30 | PR-12 | 1,5 | | ⬜ |

### Schritt 4 – Cloudflare DNS & State

| ID | Task | AK | Test | Abhängig von | PR | Soll | Ist | Status |
|---|---|---|---|---|---|---|---|---|
| T-32 | 👤 V8 (Zahlungsmethode für R2) und Tokens anlegen (V5); Einträge in `docs/secrets.md` | AK-14 | Review | T-07 | PR-13 | 0,5 | | ⬜ |
| T-33 | DNS-Bestand beim Registrar erfassen → `docs/runbooks/dns-bestand.md` (interne Angaben nach `codeslage-internal`) | AK-3, AK-4 | Abgleich mit der öffentlichen Auflösung | T-09 | PR-13 | 1 | | ⬜ |
| T-34 | `infra/tests/dns.test.ts` (MX, SPF, DKIM, DMARC, Nameserver als Parameter); Basislauf gegen die aktuellen Nameserver | AK-3 | Vitest, grün gegen den Ist-Zustand | T-13, T-33 | PR-13 | 1 | | ⬜ |
| T-35 | ⛔ `infra/tofu/bootstrap`: State-Bucket, State-Verschlüsselung, Migration des eigenen States nach R2 | AK-5, AK-14 | `tofu plan` nach Migration ohne Änderungen; State in R2 nicht im Klartext lesbar | T-32 | PR-14 | 2 | | ⬜ |
| T-36 | ⛔ `infra/tofu/live`: Zone, alle Records 1:1, Zonen-Einstellungen; `plan` gemeinsam prüfen, dann `apply` | AK-3, AK-5 | T-34 gegen die Cloudflare-Nameserver grün; `plan` danach ohne Änderungen | T-34, T-35 | PR-15 | 3 | | ⬜ |
| T-37 | CI für `infra/`: `tofu validate`, `tofu fmt -check`, tflint | AK-5, AK-18, AK-30 | Fixture mit ungenutzter Variable → tflint rot | T-36 | PR-15 | 1 | | ⬜ |
| T-38 | ⛔ Umstellung: TTL senken, 👤 V6 Nameserver, DS-Record; T-34 gegen öffentliche Auflösung; Testmail in beide Richtungen | AK-3, AK-4 | T-34 + Protokoll | T-36 | PR-16 | 1 | | ⬜ |
| T-39 | `drift.yml` (wöchentlich + PRs auf `infra/`) mit Read-only-Tokens; R2-Edit-Recht aus `CF_API_TOKEN_RW` entfernen | AK-5, AK-14 | erster Lauf mit Exit 0 | T-38 | PR-16 | 1,5 | | ⬜ |

### Schritt 5 – Alarme & Abschluss

| ID | Task | AK | Test | Abhängig von | PR | Soll | Ist | Status |
|---|---|---|---|---|---|---|---|---|
| T-40 | `history-scan.yml` (monatlich + manuell startbar) | AK-24 | manueller Start grün | T-10 | PR-17 | 0,5 | | ⬜ |
| T-41 | Eingang `simulate_failure` für die geplanten Workflows; einen Fehlschlag auslösen, Mail-Eingang protokollieren | AK-27 | Protokoll | T-39, T-40 | PR-17 | 1 | | ⬜ |
| T-42 | `docs/secrets.md` vollständig mit Rechten und Ablaufdaten | AK-14 | Review gegen die tatsächlichen Tokens | T-39 | PR-18 | 0,5 | | ⬜ |
| T-43 | `docs/kosten.md` mit Nachweis 0 €; `docs/dsgvo.md` abschließen | AK-15, AK-28 | Review, Abrechnungsseiten | T-39 | PR-18 | 0,5 | | ⬜ |

Content-Notizen und Soll/Ist der Phase entstehen in Stufe 8 (Retro), nicht als Task.

**Summe Soll:** Schritt 1: 11,75 h · Schritt 2: 15 h · Schritt 3: 9,75 h · Schritt 4: 11 h · Schritt 5: 2,5 h · **gesamt ≈ 50 h**

Status: ⬜ offen · 🔄 in Arbeit · ✅ erledigt

Regeln für die Umsetzung (Stufe 6):
1. Test zur Task schreiben, der zunächst fehlschlägt
2. Minimalen Code schreiben, bis der Test grün ist (Artikel XV)
3. Aufräumen, Lint, Typecheck, alle Tests grün
4. PR mit Constitution-Checkliste, Task-Status aktualisieren

## Analyse (Stufe 5)

> Stand: 2026-11-05

| Prüfung | Ergebnis |
|---|---|
| Jedes AK hat mindestens eine Task | ✅ AK-1 (T-06, 09, 10, 13, 20), AK-2 (T-02–06), AK-3 (T-33, 34, 36, 38), AK-4 (T-33, 38), AK-5 (T-35–37, 39), AK-14 (T-07, 32, 35, 39, 42), AK-15 (T-07, 43), AK-16 (T-18, 19), AK-17 (T-12), AK-18 (T-14–17, 37), AK-24 (T-03–06, 08, 10–12, 21, 40), AK-25 (T-01, 02, 24–26, 28, 29, 31), AK-26 (T-25, 27, 29, 30), AK-27 (T-41), AK-28 (T-07, 43), AK-29 (T-22), AK-30 (T-23, 37) |
| Jedes AK hat einen Test | ✅ jede Task nennt einen Test; die Teststrategie im Plan deckt alle 17 AKs |
| Jede Task verweist auf ein AK (kein Code ohne Auftrag) | ✅ alle 43 Tasks; AK-28 bis AK-30 sind in Spec v2.1 ergänzt |
| Kein Widerspruch zu Spec, Plan oder Constitution | ✅ PR-Zuschnitt im Plan v1.1 auf „ein oder mehrere PRs“ angepasst (Artikel III); tflint/`tofu`-Prüfungen erst in Schritt 4 (Artikel XV) |
| Reihenfolge und Abhängigkeiten schlüssig | ✅ keine Zyklen, nichts doppelt; Schritt 4 hängt nur an T-07, T-09, T-13 und kann vorgezogen werden; Soll-Summe (≈ 50 h) und Roadmap (2–3 Wochen) passen zusammen |

Gefundene Lücken und ihre Behebung (erster Lauf am 2026-11-05, zweiter Lauf nach Behebung am selben Tag):

1. **Pflichten aus der Constitution ohne AK** (`docs/dsgvo.md`, Dependabot, Format-Prüfung) → AK-28, AK-29, AK-30 in Spec v2.1 ergänzt. Vom Inhaber im Chat beauftragt; **Freigabe der Spec v2.1 ausstehend** (Gate Stufe 1).
2. **PR-Zuschnitt** widersprach Artikel III → Plan v1.1: „Schritte (je ein oder mehrere PRs, Zuschnitt in `tasks.md`)“, 18 PRs. **Freigabe des Plans v1.1 ausstehend** (Gate Stufe 3).
3. **tflint und `tofu` zu früh** → im Plan v1.1 von Schritt 2 nach Schritt 4 verschoben (T-37). Teil der Plan-Freigabe.
4. **Soll-Zeit** → Roadmap für Phase 1 auf „2–3 Wochen“ korrigiert, Korrektur dort vermerkt. ✅

**Ergebnis:** Keine offenen Lücken. Spec v2.1 und Plan v1.1 freigegeben am 2026-11-05. Stufe 6 (Implement) kann starten.

## Nachträge aus der Umsetzung

| Datum | Task | Befund | Vorschlag | Status |
|---|---|---|---|---|
| 2026-11-10 | T-12 | AK-17 nur teilweise erfüllt: Eine neue Sitzung wendet SDD bei einem Vorhaben korrekt an, ändert eine Kleinigkeit aber ohne Einstufung und ohne eigenen Branch (Protokoll `docs/protokolle/2026-11-10-t-12-neue-sitzung.md`). | Änderung der Klasse K an `CLAUDE.md`: Einstufung und Branch-Prüfung als harte erste Schritte formulieren, *bevor* eine Datei geändert wird, auch bei Kleinigkeiten. Danach den Test aus T-12 wiederholen. | erledigt am 2026-11-10: umgesetzt mit `changes/2026-11-10-claude-md-einstufung-branch.md` (PR 3); Wiederholungstest bestanden, T-12 ✅ |
