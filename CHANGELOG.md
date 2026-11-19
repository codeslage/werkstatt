# Changelog

Alle nennenswerten Änderungen an `codeslage/werkstatt`. Neue Einträge stehen oben.

- **Pflege:** Bei Klasse M ist ein Eintrag unter „Unveröffentlicht“ im selben PR Pflicht (`docs/prozess/aenderungsklassen.md`). K- und V-Änderungen werden spätestens beim `/release` nachgetragen, gern schon im eigenen PR. Ein Eintrag besteht aus Datum, Kurzbeschreibung und PR-Nummer. Ausnahme Dependabot: Die Updates sammelt Claude in einem Eintrag im nächsten eigenen PR, spätestens beim `/release` (`aenderungsklassen.md`).
- **Release:** `/release` macht aus „Unveröffentlicht“ einen Abschnitt mit Versionsnummer und Datum (`docs/prozess/release.md`). Der Release-Ablauf mit int und prod greift erst ab Phase S (ADR 0009).
- **Rubriken:** Hinzugefügt · Geändert · Behoben · Entfernt · Sicherheit

## Unveröffentlicht

### Hinzugefügt

- 2026-11-19 – Phase 1 abgeschlossen (Stufe 8): Retro mit Soll/Ist (13,8 h statt ≈ 50 h), Content-Notiz `docs/content/2026-11-19-phase-1-fundament.md`, Spec 04 auf „Umgesetzt“, Roadmap mit Ist und Ende (#PR).
- 2026-11-18 – Rechtschreibprüfung mit cspell (Deutsch und Englisch) als Befehl `pnpm spellcheck` und Pflicht-Check „Rechtschreibung“; Wortliste `project-words.txt`, Protokolle und Reviews ausgenommen (#43, Change `changes/2026-11-18-rechtschreibung-cspell.md`).
- 2026-11-18 – Phase 1, Stufe 7 (Verify): `specs/04-fundament/retro.md` mit Nachweis je AK auf `main` (#44).
- 2026-11-18 – Phase 1, Schritt 3 (Lokale Umgebung & Images): `apps/status` als Container-Image mit Compose, Seed und Smoke-Test (#36); CI-Job „Image (Compose + Smoke)“ mit Gegenprobe, Runbook `lokale-umgebung.md` für den Mac (#37).
- 2026-11-10 – Phase 1, Schritt 2 (CI-Qualität): Pflicht-Checks Typecheck, Lint, Knip, Modulgrenzen, Spec-Check, Repo-Einstellungen, Format; Dependabot und automatische Sicherheits-Updates (#8 bis #14).
- 2026-11-10 – `CHANGELOG.md` mit Regeln zur Pflege angelegt (#6).
- 2026-11-10 – Phase 1, Schritt 1 abgeschlossen: Protokolle zu Ruleset, Negativtest und neuer Sitzung (T-10 bis T-12), Wiederholungstest AK-17 bestanden (#2, #5).
- 2026-11-06 – Repo `codeslage/werkstatt` veröffentlicht: Constitution, Prozesse, Specs 01–04, ADRs 0001–0010, Secret- und Öffentlich-Scan mit Pre-Commit-Hook und CI, Schutz von `main` per Ruleset (Bootstrap, T-01 bis T-10).

### Geändert

- 2026-11-18 – Phase 1, Schritt 3: erster Dependabot-Lauf für `docker` und `docker-compose` nachgewiesen, T-27 abgeschlossen (#42).
- 2026-11-18 – Plan 04 v1.3: AK-25 durch die Ersteinrichtung des neuen Mac nachgewiesen; `aenderungsklassen.md`: Updates von GitHub Actions bleiben M (Entscheidungen des Inhabers, #41).
- 2026-11-18 – `aenderungsklassen.md`: Abschnitt „Abhängigkeits-Updates per Dependabot“ (Klasse, Sammeleintrag im Changelog), „Renovate“ durch „Dependabot“ ersetzt; Schritt im `/release`-Ablauf und Pflege-Hinweis im Changelog; Freigabe des Inhabers (#40).
- 2026-11-18 – Cloudflare-Provider 5.28.1 → 5.29.0 in `bootstrap` (#21) und `live` (#22), Klasse K (Change `changes/2026-11-18-cloudflare-provider-5-29.md`): `live` mit `tofu plan` ohne Änderungen; `bootstrap` nur `validate`, weil der `plan` dort mit 401 scheitert (siehe Protokoll); Freigabe des Inhabers.
- 2026-11-18 – Windows-Bezüge nach dem Wechsel auf den Mac bereinigt: Risiko in Spec 04, Rechner in der Vision, lokaler Pfad zu `codeslage/internal` in Architektur und `governance.md`, alter Ordnername `codeslage-internal` in Spec, Plan, Tasks und DNS-Runbook, Kommentar in `.gitattributes`; ADRs und Protokolle bleiben als Historie unverändert (#39).
- 2026-11-18 – Abhängigkeits-Updates per Dependabot (Sammeleintrag, Dependabot schreibt keinen Changelog): typescript-eslint 8.72.1 → 8.72.2 (#23), knip 6.44.2 → 6.45.1 (#24), eslint 10.14.0 → 10.15.0 (#25), prettier 3.9.10 → 3.10.1 (#26).
- 2026-11-18 – Plan 04 v1.2: lokale Entwicklung auf dem Mac; AK-25 wird in einem frischen macOS-Benutzerkonto nachgewiesen (T-31); Architektur A2 beschreibt den Mac als aktuelle Umgebung (#35).
- 2026-11-10 – Einheitliche Formatierung mit Prettier für das ganze Repo, auch Constitution und Prozessdokumente. Nur Leerraum, Kursivschrift und Anführungszeichen, kein geänderter Wortlaut, deshalb keine neue Constitution-Version. Freigabe des Inhabers am 2026-11-10 (#14).
- 2026-11-10 – Schreibweise „Klick-Dummy“ einheitlich in Architektur, Roadmap, Spec 04 und ADR 0009; Protokolle bleiben unverändert (#7).
- 2026-11-10 – Roadmap: Phase 2 heißt „Webseite (Klick-Dummy)“ (#4).
- 2026-11-10 – `CLAUDE.md`: Einstufung und eigener Branch vor jeder Dateiänderung, auch bei Kleinigkeiten (#3, Change `changes/2026-11-10-claude-md-einstufung-branch.md`).
