# Runbook: Neues Projekt-Repo anlegen

> Stand: 2026-11-21 · Bezug: `specs/05-projekt-plattform/` (AK-1, AK-4, AK-6, AK-27), Plan 05 Schritt 2, ADR 0011, `platform-setup.md`
> Wer: der Inhaber, lokal in einem Checkout von `werkstatt` auf aktuellem `main`

## 1. Voraussetzungen

- `gh` ist mit dem Konto des Inhabers angemeldet, mit den Rechten `repo`, `workflow` und `admin:org` (sonst: `gh auth refresh -s admin:org`).
- `.sperrliste` liegt im Checkout (gitignored, Inhalt aus dem Passwortmanager). Ohne sie bricht `cwk new` vor dem ersten Schritt ab.
- Das Team `maintainers` gibt es (`platform-setup.md`, Abschnitt Team), ebenso die Vorlage `codeslage/project-template`.

## 2. Anlegen

```bash
pnpm cwk new <name>
```

Varianten:

| Aufruf                          | Repo                                                            |
| ------------------------------- | --------------------------------------------------------------- |
| `pnpm cwk new <name>`           | öffentlich, mit Code                                            |
| `pnpm cwk new <name> --no-code` | „ohne Code“: Code-Teil des CWK und Beispiel-App werden entfernt |
| `pnpm cwk new <name> --private` | privat: ohne Rulesets und ohne Schreib-App (GitHub Free, P1)    |

Der Name besteht aus Kleinbuchstaben, Ziffern und Bindestrichen. `werkstatt`, `project-template`, `platform` und `internal` sind vergeben.

`cwk new` macht nacheinander:

1. Repo aus der Vorlage anlegen und warten, bis der Inhalt da ist.
2. Secret `PUBLIC_BLOCKLIST` aus `.sperrliste` setzen, vor dem ersten Push. Sonst wäre der erste Scan rot.
3. Dem Team `maintainers` Schreibrecht geben, damit GitHub es als Code-Owner anerkennt.
4. Klonen, bei `--no-code` den Code-Teil entfernen und `cwk.json` auf `"code": false` setzen, dann einen Commit auf `main` pushen. Der startet die erste CI.
5. Nur öffentlich: Rulesets `main-checks` und `main-approval` setzen und das Repo in die Installation der Schreib-App `codeslage-cwk` aufnehmen.
6. Das Datum der Sperrliste in `platform/blocklist-status.json` eintragen.

Fehlen die Schreib-App oder `platform` noch, meldet `cwk new` einen Hinweis und macht weiter. Nachgezogen wird das mit T-45. Jeder andere Fehler bricht mit dem Befehl und der Meldung von `gh` ab.

## 3. Prüfen

- Der erste CI-Lauf auf `main` ist grün: Actions → CI, alle Jobs unter „Regeln / …“ und bei Code „Code / …“ sowie `ci-ok`.
- Öffentlich: „Regeln / Repo-Einstellungen“ ist grün. Damit sind beide Rulesets, `ci-ok` aus GitHub Actions und das Team als Code-Owner nachgewiesen.
- Privat: „Repo-Einstellungen“ ist grün mit dem Hinweis „privat, ohne Schutz“.

## 4. Regeln für das neue Repo

- **Secrets für Deployments nur in Environments, die auf `main` beschränkt sind** (Settings → Environments → Deployment branches: `main`). Repo-Secrets stehen jedem Workflow offen, auch dem eines PR-Branches.
- CWK-Dateien (Liste in `cwk/manifest.json`) werden im Projekt nicht geändert, außer im Projektblock. Änderungen gehören nach `werkstatt`, sie kommen dann per Sync-PR.
- Private Repos bekommen keinen automatischen Sync. Der Inhaber rollt neue CWK-Stände selbst aus (Schritt 3, `cwk sync --private`).

## 5. Wenn etwas schiefgeht

- **Abbruch mittendrin:** Das Repo existiert dann teilweise eingerichtet. Ein zweiter Aufruf mit demselben Namen scheitert schon beim Anlegen. Die fehlenden Schritte aus Abschnitt 2 lassen sich einzeln nachholen. Soll das Repo stattdessen weg, ist das eine zerstörerische Aktion: Löschen nur nach ausdrücklicher Freigabe (Constitution V).
- **Erster Scan rot wegen fehlender Sperrliste:** `pnpm cwk secrets` setzt sie in allen Repos neu, danach den Lauf neu starten.
