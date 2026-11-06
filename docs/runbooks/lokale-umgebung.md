# Runbook: Lokale Umgebung einrichten

> Stand: 2026-11-05 · Bezug: `specs/04-fundament/spec.md` (AK-25), ADR 0009, ADR 0010
> Wird mit T-31 vervollständigt (Repo klonen, Installieren, Starten) und dann einmal auf einem frischen Konto durchgespielt.

## 1. Werkzeuge

| Werkzeug | Wofür | Windows | macOS | Geprüfte Version |
|---|---|---|---|---|
| Git | Versionskontrolle | vorinstalliert bzw. `winget install --id Git.Git -e` | `xcode-select --install` | 2.47.0 |
| Node.js 24 | Laufzeit, Skripte, Tests | `winget install --id OpenJS.NodeJS -e` | `brew install node@24` | 24.18.0 |
| pnpm (über Corepack) | Paketverwaltung | `corepack enable` (als Administrator) | `corepack enable` | 12.16.1 |
| OpenTofu | DNS als Code | `winget install --id OpenTofu.Tofu -e` | `brew install opentofu` | 1.13.1 |
| GitHub CLI | Repo, PRs, Secrets | `winget install --id GitHub.cli -e` | `brew install gh` | 2.103.3 |
| gitleaks | Secret- und Öffentlich-Scan (Git-Hook) | `winget install --id Gitleaks.Gitleaks -e` | `brew install gitleaks` | 8.30.1 |
| Docker Desktop | lokale Container (ab Schritt 3) | von docker.com, Lizenz selbst akzeptieren | dto. | – (T-24) |

Hinweise:
- **Windows:** `corepack enable` braucht Administratorrechte, weil Node unter `C:\Program Files` liegt. Nach der Installation das Terminal bzw. die Claude-App neu starten, damit der `PATH` greift.
- **Lizenzen:** Bei `winget` und Docker Desktop bestätigt der Inhaber die Bedingungen selbst.
- Die pnpm-Version für das Repo wird über das Feld `packageManager` in der `package.json` festgeschrieben. Corepack lädt dann genau diese Version.

## 2. Repo klonen und starten

*Folgt mit T-31.*

## 3. Prüfen

```bash
git --version
node --version
pnpm --version
tofu --version
gh --version
gitleaks version
```

Alle Befehle müssen eine Versionsnummer ausgeben.
