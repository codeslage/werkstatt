# Runbook: Lokale Umgebung einrichten

> Stand: 2026-11-18 · Bezug: `specs/04-fundament/spec.md` (AK-25), Plan v1.2, ADR 0009, ADR 0010
> Ziel: vom frischen Mac bis zur laufenden Test-App mit Datenbank. Bis Phase S ist **dev = lokal**.
> Bis 2026-11-18 lief die Entwicklung unter Windows; die damaligen Schritte stehen in der Git-Historie dieser Datei und im Protokoll T-01.

## 1. Werkzeuge (einmal je Rechner, im Admin-Konto)

Homebrew und das Node-Verzeichnis gehören dem Konto, das sie installiert. Ein Standardkonto ohne Administratorrechte nutzt sie mit, kann dort aber nichts installieren.

| Werkzeug             | Wofür                                     | macOS (Apple Silicon)                                                                                                | Geprüfte Version |
| -------------------- | ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | ---------------- |
| Git                  | Versionskontrolle                         | `xcode-select --install`                                                                                             | 2.50.1           |
| Homebrew             | Paketverwaltung                           | Installationsbefehl von brew.sh                                                                                      | –                |
| Node.js 24           | Laufzeit, Skripte, Tests                  | `brew install node@24` (keg-only, `PATH` siehe Abschnitt 2)                                                          | 24.22.3          |
| pnpm (über Corepack) | Paketverwaltung                           | `corepack enable` (legt die Shims im Node-Verzeichnis an)                                                            | 12.16.1          |
| GitHub CLI           | Repo, PRs, Secrets                        | `brew install gh`                                                                                                    | 2.105.0          |
| Docker Desktop       | lokale Container                          | von docker.com, Lizenz selbst akzeptieren; danach Settings → General → „Send usage statistics“ aus (`docs/dsgvo.md`) | 4.99.0           |
| gitleaks             | Secret- und Öffentlich-Scan (Git-Hook)    | Release-Binary in `~/.local/bin`, Version wie in `ci.yml` (`GITLEAKS_VERSION`)                                       | 8.30.1           |
| OpenTofu, tflint     | DNS als Code (nur für Arbeit an `infra/`) | Release-Binaries in `~/.local/bin`, Versionen wie in `ci.yml` (`TOFU_VERSION`, `TFLINT_VERSION`)                     | 1.13.1, 0.66.0   |

Die pnpm-Version steht im Feld `packageManager` der `package.json`; Corepack lädt genau diese Version. gitleaks, OpenTofu und tflint sind dieselben gepinnten Versionen wie in der CI, damit lokale und CI-Ergebnisse nicht abweichen.

## 2. Je Benutzerkonto

1. `PATH` in `~/.zprofile` setzen, danach ein neues Terminal öffnen:

   ```bash
   eval "$(/opt/homebrew/bin/brew shellenv zsh)"
   export PATH="/opt/homebrew/opt/node@24/bin:$PATH"
   export PATH="$HOME/.local/bin:$PATH"
   ```

2. Docker Desktop einmal starten und die Einrichtung abschließen (je Konto). Die Telemetrie ist eine Einstellung je Konto, also auch hier abschalten.

## 3. Repo klonen und starten

```bash
git clone https://github.com/codeslage/werkstatt.git
cd werkstatt
pnpm install
cp .env.example .env
```

In `.env` `POSTGRES_PASSWORD` setzen: nur Buchstaben, Ziffern und Bindestrich, z. B. `lokal-nur-zum-testen`. Die übrigen Einträge braucht nur die Arbeit mit OpenTofu (`docs/runbooks/tofu-state.md`). `pnpm install` setzt außerdem den Git-Hook (`core.hooksPath`).

```bash
pnpm dev:up
```

Startet die Datenbank (Postgres 17 mit Seed-Daten) und die Test-App `apps/status` und wartet, bis beide gesund sind. Danach zeigt <http://127.0.0.1:3000> „Hello codeslage“, und <http://127.0.0.1:3000/health> meldet `{"status":"ok", …, "db":"ok"}`.

```bash
pnpm test:smoke
pnpm dev:down
```

`test:smoke` prüft `/health` gegen das Schema, den Zustand beider Container, dass Ports nur auf `127.0.0.1` liegen und die App ohne Root läuft. `dev:down` stoppt alles. Die Datenbank liegt im Arbeitsspeicher; es bleibt kein Volume zurück.

## 4. Hinweise und Fehlerbilder

| Fehlerbild                                               | Ursache und Abhilfe                                                                                                             |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `required variable POSTGRES_PASSWORD is missing a value` | `.env` fehlt oder ohne `POSTGRES_PASSWORD` (Abschnitt 3).                                                                       |
| `dev:up` bricht ab, `status` wird nicht gesund           | `/health` zeigt den Grund (`unreachable` oder `seed missing`); `docker compose logs status`. Häufig: Sonderzeichen im Passwort. |
| geänderte `infra/local/seed.sql` wirkt nicht             | Der Seed läuft nur beim ersten Start der DB. Erst `pnpm dev:down`, dann `pnpm dev:up`.                                          |
| `port is already allocated`                              | Port 3000 oder 5432 ist belegt (z. B. ein anderes Postgres). Den anderen Dienst stoppen.                                        |
| `pnpm` oder `node` nicht gefunden                        | `PATH` aus Abschnitt 2 fehlt; neues Terminal öffnen.                                                                            |
| `Cannot connect to the Docker daemon`                    | Docker Desktop ist nicht gestartet.                                                                                             |

## 5. Prüfen

```bash
git --version
node --version
pnpm --version
gh --version
docker version
gitleaks version
```

Alle Befehle müssen eine Versionsnummer ausgeben; `docker version` auch einen Abschnitt „Server“. Für Arbeit an `infra/` zusätzlich `tofu --version` und `tflint --version`.
