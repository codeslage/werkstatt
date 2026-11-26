# Changelog

Alle nennenswerten Änderungen an `codeslage/werkstatt`. Neue Einträge stehen oben.

- **Pflege:** Bei Klasse M ist ein Eintrag unter „Unveröffentlicht“ im selben PR Pflicht (`docs/prozess/aenderungsklassen.md`). K- und V-Änderungen werden spätestens beim `/release` nachgetragen, gern schon im eigenen PR. Ein Eintrag besteht aus Datum, Kurzbeschreibung und PR-Nummer. Ausnahme Dependabot: Die Updates sammelt Claude in einem Eintrag im nächsten eigenen PR, spätestens beim `/release` (`aenderungsklassen.md`).
- **Release:** `/release` macht aus „Unveröffentlicht“ einen Abschnitt mit Versionsnummer und Datum (`docs/prozess/release.md`). Der Release-Ablauf mit int und prod greift erst ab Phase S (ADR 0009).
- **Rubriken:** Hinzugefügt · Geändert · Behoben · Entfernt · Sicherheit

## Unveröffentlicht

### Hinzugefügt

- 2026-11-26 – Phase 2, Schritt 4 (PR-11, T-17 bis T-19, Text-PR): Datenschutzerklärung (Hosting, cookielose Besuchsmessung, Mail, Terminbuchung über Google Kalender) und Impressum mit den Angaben aus der Build-Umgebung; Cloudflare Pages und Web Analytics in `docs/dsgvo.md` und `docs/kosten.md` (#75).
- 2026-11-26 – Phase 2, Schritt 3 (PR-7, T-13, Text-PR): Startseite mit Kernsatz, Erklärung, „Schreib mir“, vier Leistungen in Kurzform und Teaser der Case Study (#74).
- 2026-11-26 – Phase 2, Schritt 3 (PR-9, T-15, Text-PR): Seite „Projekte“ und Case Study „Wir bauen erst, wenn wir es brauchen“ mit den Soll/Ist-Zahlen aus Phase 1 (#73).
- 2026-11-26 – Phase 2, Schritt 3 (PR-8, T-14, Text-PR): Seite „Leistungen“ mit vier Bereichen, Ablauf, Pilotprojekten (Preise auf Anfrage) und Abgrenzung (#72).
- 2026-11-23 – Phase 2, Schritt 3 (PR-10, T-11, T-16, Text-PR): Seite „Über mich“ mit Foto (ohne Metadaten, ohne Arbeitgeber) und Werdegang (#66).
- 2026-11-21 – Phase 2, Schritt 3 (PR-6, T-12, Text-PR): Kontaktseite mit Rollenadresse, Mail-Link und Link „Erstgespräch buchen“ (Google Kalender, nicht eingebettet), kein Formular; Tests für AK-3 (#63).
- 2026-11-21 – Phase 1.5, Schritt 1 (PR-1, T-01 bis T-06, T-47): CodeslageWerkzeugKasten in werkstatt – `tools/cwk` (Schema, `check`, `ci-ok`, `settings`), `cwk/manifest.json` mit Regel- und Code-Teil, wiederverwendbare Workflows `cwk-rules.yml` und `cwk-code.yml`; einziger Pflicht-Check ist `ci-ok` (#62).
- 2026-11-20 – Phase 2, Schritt 2 (PR-5, T-10, Text-PR): Logo-Zeichen und zweiteilige Wortmarke `codeslage_` im Header, Touch-Icon; Test für Logo, Favicon und Touch-Icon (#61).
- 2026-11-20 – Phase 2, Schritt 1 (PR-3, T-08, Text-PR): Seitentitel, Beschreibungen, Navigation, Footer und Fehlerseite mit fertigen Texten; Tests gegen Platzhalter (#60).
- 2026-11-20 – Phase 2, Schritt 2 (PR-4, T-09): Gestaltung der Webseite (Waldgrün, hell und dunkel nach Systemeinstellung, Systemschriften) mit Kontrastprüfung per axe in beiden Darstellungen (#59).
- 2026-11-20 – Phase 2, Schritt 1 (PR-2, T-04 bis T-07): Layout, alle Seiten mit Platzhaltern, 404, Sicherheits-Header; E2E-Tests mit Playwright (Navigation, SEO, Layout, Datenschutz) und Lighthouse CI (alle Seiten ≥ 90) im neuen CI-Job „Webseite (E2E + Lighthouse)“ (#58).
- 2026-11-20 – Phase 2, Schritt 1 (PR-1, T-01 bis T-03): `apps/web` mit Astro 7 (statisch, ohne Telemetrie), Seitenliste `pages.ts` und geprüfte Impressumsangaben `imprint.ts` mit Unit-Tests; ESLint, Prettier und Typecheck kennen `.astro`; neue Prüfung `tools/astro-imports` setzt die Modulgrenzen für `.astro` im Check „Modulgrenzen“ durch (#56).
- 2026-11-19 – Phase 2, Stufen 4 und 5 (Tasks, Analyze): `specs/06-webseite/tasks.md` mit 27 Tasks (Soll 35,75 h) und Analyse ohne offene Lücken; finale Gestaltung (Waldgrün, Logo als Graphit-Kachel) in `gestaltung.md` und `gestaltung/` (#55).
- 2026-11-19 – Phase 2, Stufe 3 (Plan): `specs/06-webseite/plan.md` mit sechs Schritten und Teststrategie je AK; ADR 0014 (Astro für `apps/web`) und ADR 0015 (Upload aus der CI nach Cloudflare Pages, kein Container-Image); `02-architektur.md` A1, A2 und A3 angepasst (#54).
- 2026-11-19 – Phase 2, Stufe 2 (Clarify): Spec 06 geklärt. Kontaktadresse, Vorschau nur lokal, Pilotprojekte mit Konditionen auf Anfrage, Foto; neues AK-18 (hell/dunkel), Voraussetzungen V1–V4; Leistungen (`leistungen.md`), Gestaltung und Logo (`gestaltung.md`, `gestaltung/`) (#51).
- 2026-11-19 – Phase 2, Stufe 1 (Specify): Spec `specs/06-webseite/spec.md` für die Webseite als Klick-Dummy mit 17 AKs freigegeben, `zeiten.md` mit getrennt ausgewiesener Wartezeit, Start von Phase 2 in der Roadmap (#49).
- 2026-11-19 – Vorlage `specs/_vorlagen/zeiten.md`; Zeiterfassung ist für jedes Vorhaben ab Stufe 1 Pflicht (`sdd-ablauf.md`, alle `/sdd-*`-Befehle, Spalten Soll/Ist in der tasks-Vorlage), als Grundlage für Soll/Ist und spätere Abrechnung (Entscheidung des Inhabers, #47).
- 2026-11-19 – Phase 1 abgeschlossen (Stufe 8): Retro mit Soll/Ist (≈ 14,4 h statt ≈ 50 h), Content-Notiz `docs/content/2026-11-19-phase-1-fundament.md`, Spec 04 auf „Umgesetzt“, Roadmap mit Ist und Ende (#45).
- 2026-11-18 – Rechtschreibprüfung mit cspell (Deutsch und Englisch) als Befehl `pnpm spellcheck` und Pflicht-Check „Rechtschreibung“; Wortliste `project-words.txt`, Protokolle und Reviews ausgenommen (#43, Change `changes/2026-11-18-rechtschreibung-cspell.md`).
- 2026-11-18 – Phase 1, Stufe 7 (Verify): `specs/04-fundament/retro.md` mit Nachweis je AK auf `main` (#44).
- 2026-11-18 – Phase 1, Schritt 3 (Lokale Umgebung & Images): `apps/status` als Container-Image mit Compose, Seed und Smoke-Test (#36); CI-Job „Image (Compose + Smoke)“ mit Gegenprobe, Runbook `lokale-umgebung.md` für den Mac (#37).
- 2026-11-10 – Phase 1, Schritt 2 (CI-Qualität): Pflicht-Checks Typecheck, Lint, Knip, Modulgrenzen, Spec-Check, Repo-Einstellungen, Format; Dependabot und automatische Sicherheits-Updates (#8 bis #14).
- 2026-11-10 – `CHANGELOG.md` mit Regeln zur Pflege angelegt (#6).
- 2026-11-10 – Phase 1, Schritt 1 abgeschlossen: Protokolle zu Ruleset, Negativtest und neuer Sitzung (T-10 bis T-12), Wiederholungstest AK-17 bestanden (#2, #5).
- 2026-11-06 – Repo `codeslage/werkstatt` veröffentlicht: Constitution, Prozesse, Specs 01–04, ADRs 0001–0010, Secret- und Öffentlich-Scan mit Pre-Commit-Hook und CI, Schutz von `main` per Ruleset (Bootstrap, T-01 bis T-10).

### Geändert

- 2026-11-26 – Phase 2, Nachtrag Stufe 6 (Text-PR): Texte nach der Abnahme korrigiert. Schwerpunkt jetzt KI-Softwareentwicklung, „nachvollziehbar“ statt „offen dokumentiert“, neuer Prototyp-Satz, „mit niedrigen laufenden Kosten“ statt „günstig“. Kennzeichnung „im Aufbau“ entfernt, eigener Link „Case Study lesen →“; Ist von T-10 korrigiert (#77).
- 2026-11-26 – Abhängigkeits-Updates per Dependabot (Sammeleintrag, Dependabot schreibt keinen Changelog): vitest 5.1.0 → 5.1.1 (#69), cspell 10.5.1 → 10.5.2 (#70), dependency-cruiser 18.7.2 → 18.9.0 (#68), knip 6.45.1 → 6.48.0 (#71), typescript-eslint 8.72.2 → 8.73.0 (#67); geprüft (CI, Release Notes, Lockfile), freigegeben und gemergt vom Inhaber.
- 2026-11-19 – Zeiterfassung: Wartezeit auf den Inhaber steht in eigenen Zeilen (Spalte „Art“), `zeiten.md` hat Summen für Arbeit, Wartezeit und Gesamt, das Ist ist die Gesamtzeit (Vorlage `zeiten.md` und `retro.md`, `sdd-ablauf.md`, `/sdd-*`-Befehle; Wunsch des Inhabers, #50).
- 2026-11-19 – `sdd-ablauf.md` und `/sdd-verify`: Abnahme auf `main`, solange es kein int gibt; Zeiterfassung zählt parallele Tasks nur einmal; Hinweise in `release.md`, `code-review.md` und `/release` (Retro 04, Entscheidung des Inhabers, #46).
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
