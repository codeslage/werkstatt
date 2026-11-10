# ADR 0008 – Repo-Werkzeuge: pnpm ohne Turborepo, eigene Git-Hooks, Dependabot

> Status: **Vorgeschlagen** · Stand: 2026-11-05
> Bezug: `specs/02-architektur.md` (A1), Constitution Artikel XI und XV

## Kontext

`02-architektur.md` sieht pnpm + Turborepo vor. In Phase 1 gibt es aber nur eine App (`apps/status`), ein Paket (`packages/config`) und wenige Tools. Außerdem braucht es einen Pre-Commit-Hook und automatische Abhängigkeits-Updates.

## Entscheidung

| Thema                       | Gewählt                                                          | Statt             | Warum                                                                                                                                                |
| --------------------------- | ---------------------------------------------------------------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Monorepo                    | **pnpm-Workspace**, Skripte per `pnpm -r`                        | Turborepo         | Caching und Task-Graph lohnen sich erst ab mehreren Apps. Turborepo kommt in Phase 2 dazu, wenn `apps/web` entsteht und die CI messbar langsam wird. |
| Git-Hooks                   | **`.githooks/` + `core.hooksPath`**, gesetzt im `prepare`-Skript | husky, lefthook   | Ein Shell-Skript mit wenigen Zeilen, keine Abhängigkeit. Läuft unter Git Bash (Windows) und macOS.                                                   |
| Updates                     | **Dependabot** (Versionen + Sicherheits-Updates)                 | Renovate          | in GitHub eingebaut, keine Drittanbieter-App mit Repo-Rechten; deckt npm, GitHub Actions, Docker und Terraform/OpenTofu ab                           |
| Secret-Scan                 | **gitleaks**-Binary, in der CI gepinnt mit Prüfsumme             | `gitleaks-action` | Die Action braucht für Organisationen einen Lizenzschlüssel.                                                                                         |
| TypeScript in `apps/status` | **Node 24 Type-Stripping**, kein Build-Schritt                   | tsc-Build, tsx    | Keine Build-Abhängigkeit für eine App aus wenigen Zeilen. `tsc --noEmit` prüft trotzdem die Typen.                                                   |

## Folgen

- `02-architektur.md` A1 wird angepasst („Turborepo ab Phase 2“).
- Dependabot kann pnpm-Workspaces, gruppiert aber weniger flexibel als Renovate. Reicht das nicht, wird per ADR gewechselt.
