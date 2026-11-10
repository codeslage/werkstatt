# Changelog

Alle nennenswerten Änderungen an `codeslage/werkstatt`. Neue Einträge stehen oben.

- **Pflege:** Jede gemergte Änderung bekommt im selben PR einen Eintrag unter „Unveröffentlicht“, bei Klasse M ist das Pflicht (`docs/prozess/aenderungsklassen.md`). Ein Eintrag besteht aus Datum, Kurzbeschreibung und PR.
- **Release:** `/release` macht aus „Unveröffentlicht“ einen Abschnitt mit Versionsnummer und Datum (`docs/prozess/release.md`). Bis Phase S gibt es keine Releases (ADR 0009).
- **Rubriken:** Hinzugefügt · Geändert · Behoben · Entfernt · Sicherheit

## Unveröffentlicht

### Hinzugefügt
- 2026-11-10 – `CHANGELOG.md` mit Regeln zur Pflege angelegt.
- 2026-11-10 – Phase 1, Schritt 1 abgeschlossen: Protokolle zu Ruleset, Negativtest und neuer Sitzung (T-10 bis T-12), Wiederholungstest AK-17 bestanden (#2, #5).
- 2026-11-06 – Repo `codeslage/werkstatt` veröffentlicht: Constitution, Prozesse, Specs 01–04, ADRs 0001–0010, Secret- und Öffentlich-Scan mit Pre-Commit-Hook und CI, Schutz von `main` per Ruleset (Bootstrap, T-01 bis T-10).

### Geändert
- 2026-11-10 – Roadmap: Phase 2 heißt „Webseite (Klick-Dummy)“ (#4).
- 2026-11-10 – `CLAUDE.md`: Einstufung und eigener Branch vor jeder Dateiänderung, auch bei Kleinigkeiten (#3, Change `changes/2026-11-10-claude-md-einstufung-branch.md`).
