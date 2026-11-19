# ADR 0012 – Betrieb im privaten Repo `codeslage/platform` mit GitHub App, Freigabe per Ruleset

> Status: **Vorgeschlagen** · Stand: 2026-11-19
> Bezug: `specs/05-projekt-plattform/spec.md` (AK-4, AK-7, AK-8, AK-10, AK-16, AK-19, AK-22, AK-25, AK-26), `plan.md`, Constitution Artikel VII, IX und XVI

## Kontext

Sync, Übersicht, Erinnerung, Historien-Scan und Portal-Build greifen auf alle Repos der Organisation zu, auch auf private. Ihre Logs nennen Repo-Namen und Inhalte. Workflow-Logs eines öffentlichen Repos wie `werkstatt` sind öffentlich. Einen Server gibt es nicht (ADR 0009). Fehler sollen per Mail beim Inhaber ankommen. Bei einem geplanten Lauf schickt GitHub die Fehler-Mail an das Konto, das die Cron-Zeile zuletzt geändert hat, bei einem gestarteten Lauf an den Auslöser (Protokoll T-41).

Der Sync ändert bei jeder CWK-Version die `ci.yml` der Projekte (gepinnter Verweis). Dafür braucht die App das Recht Workflows Write. Mit diesem Recht könnte sie einen Freigabe-Check, der selbst als Workflow läuft, im Sync-PR durch einen immer grünen Job ersetzen und danach mergen (Review PR #53, Befund 1). Die Freigabe darf deshalb nicht von einem Workflow abhängen.

## Optionen

|                                    | privates Repo `platform` + GitHub App | Workflows in `werkstatt` + App | Fine-grained Token des Inhabers für alles |
| ---------------------------------- | ------------------------------------- | ------------------------------ | ----------------------------------------- |
| Logs mit privaten Namen            | ✅ privat                             | ❌ öffentlich                  | –                                         |
| Rechte unabhängig von einer Person | ✅ App                                | ✅ App                         | ❌ hängt am Konto                         |
| Kosten                             | 0 € (2.000 Minuten frei)              | 0 €                            | 0 €                                       |

Freigabe: eigener Workflow-Check (umgehbar, siehe oben) gegen Ruleset von GitHub (Code-Owner-Review; eine App kann nicht Mitglied eines Teams sein).

## Entscheidung

- Alle Abläufe mit Zugriff auf mehrere Repos laufen im privaten Repo **`codeslage/platform`**. Es hat keinen Code und bekommt nur den Regel-Teil des CWK. Auch alle geplanten Läufe liegen dort, und ihre Cron-Zeilen ändert nur der Inhaber.
- Eine **GitHub App `codeslage-cwk`**, installiert für alle Repos, mit Contents Write, Workflows Write, Pull requests Write und Metadata Read. Sie steht in keiner Bypass-Liste.
- **Freigabe per Ruleset** in jedem öffentlichen Repo, in zwei Rulesets:
  - `main-checks`: nur per PR, Pflicht-Check `ci-ok`, ohne Bypass.
  - `main-approval`: ein Code-Owner-Review durch das Team `maintainers`, veraltete Freigaben verfallen, die Freigabe muss sich auf den neuesten Push beziehen. Bypass hat die Rolle „Repository admin“ nur für PRs, damit der Inhaber eigene PRs weiter selbst mergen kann.
- Der Historien-Scan (AK-22) läuft zentral in `platform` über alle Projekt-Repos.
- Läufe, die von außen gestartet werden (Webhook → Worker), löst ein Fine-grained Token **des Inhabers** aus, beschränkt auf `platform` mit Actions Write. Das ist eine bewusste Ausnahme von „Rechte unabhängig von einer Person“: Nur so ist der Inhaber Auslöser und bekommt die Fehler-Mails (AK-16). Wer den Token durch die App ersetzt, verliert diese Mails.

## Folgen

- Auf GitHub Free wirken Rulesets nur in öffentlichen Repos. Für private Repos braucht es eine Ersatzprüfung oder einen bezahlten Tarif (`plan.md`, Frage P1).
- Die Ruleset-Kombination wird am Probe-Repo geprüft, bevor die App Rechte bekommt (Plan, Schritt 2).
- `platform` verbraucht Actions-Minuten aus dem Kontingent für private Repos; `docs/kosten.md` führt sie.
- Der private Schlüssel der App liegt nur als Secret in `platform`. Wird er bekannt, wird er in den App-Einstellungen widerrufen und neu erzeugt.
