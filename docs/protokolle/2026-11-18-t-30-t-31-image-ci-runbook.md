# Protokoll T-30 und T-31: CI-Job `image` und Runbook für den Mac (PR-12)

> Datum: 2026-11-18 · Tasks: T-30, T-31 (und T-24) · AK: AK-25, AK-26 · Plan v1.2

## T-30: CI-Job `image`

1. Neuer Job „Image (Compose + Smoke)“ in `ci.yml`: `pnpm dev:up` (Image bauen, beide Container starten und auf „gesund“ warten), `pnpm test:smoke`, bei Fehlern `docker compose logs`, am Ende immer `pnpm dev:down`. Das DB-Passwort ist ein fester Wegwerf-Wert im Workflow, die DB lebt nur im `tmpfs` dieses Laufs.
2. **Gegenprobe im Job:** Nach dem grünen Smoke-Test startet der Job die Umgebung mit auskommentierter Seed-Zeile neu. `pnpm dev:up` muss scheitern, und `/health` muss `seed missing` melden; sonst ist der Job rot.
3. Erster Lauf (PR #37, Runner amd64): Smoke-Test 9/9 grün, Gegenprobe wie erwartet. Damit laufen dieselben Images lokal auf arm64 und in der CI auf amd64.
4. **Rot-Phase Repo-Einstellungen:** `infra/tests/repo.test.ts` verlangt jeden CI-Job als Pflicht-Check. Mit dem neuen Job ist der Test rot (lokal und im CI-Lauf von #37), bis „Image (Compose + Smoke)“ im Ruleset `main-schutz` steht. Die Ruleset-Änderung per API wurde in dieser Sitzung von der Rechteprüfung abgelehnt; sie liegt beim Inhaber (Settings → Rules → `main-schutz` → Require status checks → „Image (Compose + Smoke)“ hinzufügen).
   **Nachtrag:** Vom Inhaber eingetragen. „Repo-Einstellungen“ neu gestartet: grün. Alle Pflicht-Checks auf Head `7361060` grün, #37 gemergt (`3b378de`).

## T-31: Runbook

5. `docs/runbooks/lokale-umgebung.md` neu für den Mac (Plan v1.2): Werkzeuge einmal je Rechner im Admin-Konto, `PATH` und Docker Desktop je Konto, dann Klonen, `pnpm install`, `.env` mit `POSTGRES_PASSWORD`, `pnpm dev:up`, Browser, `pnpm test:smoke`, `pnpm dev:down`. Übernommen aus Review und Protokoll T-27–T-29: Passwort nur aus Buchstaben, Ziffern und Bindestrich; geänderte `seed.sql` wirkt erst nach `dev:down`; Fehlerbilder als Tabelle.
6. **Offen (AK-25 manuell):** einmal in einem frischen macOS-Standardkonto nach dem Runbook durchspielen. Das Konto anzulegen ist eine Einstellung am Rechner des Inhabers; der Lauf folgt mit ihm und wird hier nachgetragen.
   **Nachtrag (Plan v1.3, Entscheidung des Inhabers):** AK-25 ist durch die Ersteinrichtung des neuen Mac am 2026-11-18 nachgewiesen. Auf dem frischen Rechner liefen die Schritte aus Runbook-Abschnitt 1 bis 3: Werkzeuge (Protokoll T-01, Nachtrag Mac), `PATH` in `~/.zprofile`, Docker Desktop mit abgeschalteter Telemetrie, Klonen, `pnpm install`, `.env` mit `POSTGRES_PASSWORD`. Danach `pnpm dev:up` (beide Container gesund), `pnpm test:smoke` 9/9 grün, `pnpm dev:down`. Das Runbook ist aus diesem Ablauf entstanden. Ein zusätzliches frisches Konto entfällt, weil die CI denselben Ablauf bei jedem PR auf einer frischen Maschine prüft.

## T-24: Docker Desktop

7. Installiert vom Inhaber: Docker Desktop 4.99.0, Client und Engine 29.9.3, `linux/arm64`, Kontext `desktop-linux`. **Offen:** Telemetrie abschalten (Settings → General → „Send usage statistics“). In den Einstellungen ist der Schalter bisher nicht gesetzt, also gilt die Voreinstellung (an).
   **Nachtrag:** Laut Inhaber ist die Telemetrie jetzt aus. In `~/Library/Group Containers/group.com.docker/settings-store.json` ist aber kein geänderter Wert gespeichert (Datei zuletzt 17:11 geändert). Vermutlich wurde „Apply“ nicht gedrückt. T-24 bleibt 🔄, bis der Wert in der Datei steht.
   **Nachtrag:** Gespeichert, `AnalyticsEnabled: false` (Datei 20:29 geändert). T-24 ✅.
