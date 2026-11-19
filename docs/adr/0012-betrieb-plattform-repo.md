# ADR 0012 – Betrieb im privaten Repo `codeslage/plattform` mit GitHub App

> Status: **Vorgeschlagen** · Stand: 2026-11-19
> Bezug: `specs/05-projekt-plattform/spec.md` (AK-7, AK-8, AK-10, AK-16, AK-19, AK-22, AK-25, AK-26), `plan.md`, Constitution Artikel VII, IX und XVI

## Kontext

Sync, Übersicht, Erinnerung, Historien-Scan und Portal-Build greifen auf alle Repos der Organisation zu, auch auf private. Ihre Logs nennen Repo-Namen und Inhalte. Workflow-Logs eines öffentlichen Repos wie `werkstatt` sind öffentlich. Es gibt keinen Server (ADR 0009). Fehler sollen per Mail beim Inhaber ankommen. GitHub schickt die Fehler-Mail eines geplanten Laufs an das Konto, das die Cron-Zeile zuletzt geändert hat (Protokoll T-41).

## Optionen

|                                    | privates Repo `plattform` + GitHub App | Workflows in `werkstatt` + App | Fine-grained Token des Inhabers |
| ---------------------------------- | -------------------------------------- | ------------------------------ | ------------------------------- |
| Logs mit privaten Namen            | ✅ privat                              | ❌ öffentlich                  | –                               |
| Rechte unabhängig von einer Person | ✅ App                                 | ✅ App                         | ❌ hängt am Konto               |
| Kosten                             | 0 € (2.000 Minuten frei)               | 0 €                            | 0 €                             |

## Entscheidung

- Alle Abläufe mit Zugriff auf mehrere Repos laufen im privaten Repo **`codeslage/plattform`** (ohne Code, Regel-Teil des CWK). Auch alle geplanten Läufe liegen dort, die Cron-Zeilen ändert nur der Inhaber. Damit kommen die Fehler-Mails an.
- Eine **GitHub App `codeslage-cwk`**, installiert für alle Repos, mit Contents Write, Pull requests Write und Metadata Read. Sie steht in keiner Bypass-Liste.
- **Freigabe-Check:** Der Pflicht-Check „CWK-Freigabe“ ist bei PRs vom Branch `cwk/sync` nur grün, wenn ein Mitglied der Organisation den PR freigegeben hat. So kann die App nicht mergen, obwohl sie Schreibrechte hat (AK-8, AK-19).
- Der Historien-Scan (AK-22) läuft zentral in `plattform`, nicht in jedem Projekt-Repo.

## Folgen

- Auf GitHub Free wirken Ruleset und Pflicht-Check nur in öffentlichen Repos. Für private Repos braucht es eine Ersatzprüfung oder einen bezahlten Tarif (`plan.md`, Frage P1).
- `plattform` verbraucht Actions-Minuten aus dem Kontingent für private Repos; `docs/kosten.md` führt sie.
- Der private Schlüssel der App liegt nur als Secret in `plattform`. Wird er bekannt, wird er in den App-Einstellungen widerrufen und neu erzeugt.
