# Protokoll T-22/T-23: Dependabot und Prettier

> Datum: 2026-11-10 · Tasks: T-22 (AK-29), T-23 (AK-30) · PR: PR-09

## T-22 Dependabot

1. `.github/dependabot.yml` für npm und GitHub Actions (auch die lokale Action unter `.github/actions/`), wöchentlich.
   - **Cooldown 3 Tage:** Frisch veröffentlichte Versionen werden erst nach drei Tagen vorgeschlagen, wie bei der Wartezeit von pnpm (Lehre aus PR-04).
   - `typescript` bleibt unter 6.1, solange `typescript-eslint` nichts Neueres unterstützt.
   - `typescript-eslint` und `@typescript-eslint/*` kommen als eine Gruppe.
2. Die Ökosysteme `docker` und `terraform` kommen dazu, sobald es Dockerfiles (T-27) bzw. OpenTofu-Code (T-35) gibt. Ohne diese Dateien würde Dependabot einen Fehler melden.
3. Repo-Einstellungen: Schwachstellen-Warnungen waren schon aktiv. **Automatische Sicherheits-Updates sind jetzt eingeschaltet** (API: `enabled: true`).
4. **Offen:** Der Nachweis für AK-29 ist der erste Update-PR von Dependabot nach dem Merge. T-22 bleibt bis dahin 🔄.

## T-23 Prettier

5. Test vor der Konfiguration: TS, JSON, YAML und Markdown, je richtig und falsch formatiert, geprüft mit der Repo-Konfiguration. **Rot**, weil ohne Konfiguration die Prettier-Standards gelten (doppelte Anführungszeichen).
6. `packages/config/prettier.config.js` (Breite 120, einfache Anführungszeichen, Markdown-Fließtext bleibt unverändert) und `.prettierignore` (Lockfile; Reviews als unveränderte Agent-Ausgaben). Danach **grün** (8/8).
7. Einmalige Formatierung des Repos als eigener Commit: 57 Dateien, ohne Leerraum betrachtet fast nur Tabellen-Trennzeilen und Anführungszeichen in YAML-Frontmatter. Danach waren alle Prüfungen grün, auch der Spec-Check auf den neu ausgerichteten Tabellen. Hinweis: Die in Change-Seiten zitierten Reviews sind mit formatiert. Dabei hat sich nur Leerraum geändert, der Wortlaut ist gleich.
8. CI-Job „Format“. Ruleset `main-schutz`: Pflicht-Checks sind jetzt **„Secret- und Öffentlich-Scan“, „Typecheck“, „Lint“, „Knip“, „Modulgrenzen“, „Spec-Check“, „Repo-Einstellungen“, „Format“**. `pnpm test:infra` bestätigt, dass jeder Job Pflicht ist.
9. `tofu fmt` für HCL folgt mit T-37, sobald es OpenTofu-Code gibt.

## Nach dem Review (🔴 1, 🟡 2–4, ⚪ 5–6)

10. **🔴 Governance:** Die einmalige Formatierung hat auch `CONSTITUTION.md`, `docs/prozess/`, `.claude/commands/` und `specs/_vorlagen/` berührt. Es ändert sich nur Leerraum, Kursivschrift (`*…*` → `_…_`) und Anführungszeichen im YAML-Frontmatter, der Wortlaut bleibt gleich. Für diese Dateien braucht es laut `governance.md` die Freigabe des Inhabers, deshalb wird dieser PR nicht selbst gemergt. **Entscheidung des Inhabers am 2026-11-10: freigegeben.** Keine Versionserhöhung der Constitution, weil sich nicht einmal die Formulierung ändert (PATCH wäre „nur Formulierung“); Vermerk im Changelog.
11. T-22: Die Ist-Zeit bleibt leer, solange T-22 🔄 ist (Regel aus Review T-12-2: Ist erst bei Abschluss). Die bisherige Zeit steht in `zeiten.md`.
12. T-23 war zum Zeitpunkt des Reviews noch nicht nachgetragen. Das ist inzwischen erledigt (✅, Ist 0,25).
13. T-27 und T-37 nennen jetzt ausdrücklich, dass das Dependabot-Ökosystem `docker` bzw. `terraform` ergänzt wird (AK-29).
14. ⚪ Change-Seiten in `changes/` werden mit formatiert, auch die darin zitierten Reviews. Der Wortlaut bleibt erhalten, nur Leerraum kann sich ändern. Das wird bewusst so gelassen, weil die Change-Seiten auch eigenen Text enthalten.
