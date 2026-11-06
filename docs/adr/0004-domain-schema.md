# ADR 0004 – Domain-Schema: nur eine Ebene unter `codeslage.de`

> Status: **Vorgeschlagen** · Stand: 2026-11-05
> Bezug: `specs/02-architektur.md` (A9, A11), `specs/04-fundament/spec.md` (AK-11, AK-20)

## Kontext

`02-architektur.md` schlägt Domains wie `portal.int.codeslage.de` und `<projekt>.poc.codeslage.de` vor. Das kostenlose Edge-Zertifikat von Cloudflare (Universal SSL) deckt aber nur `codeslage.de` und `*.codeslage.de` ab, also **eine** Ebene. Für tiefere Namen bräuchte es den Advanced Certificate Manager (kostenpflichtig, ca. 10 $/Monat) und würde das Budget sprengen.

## Entscheidung

Alle öffentlich erreichbaren Namen liegen **eine Ebene** unter `codeslage.de`:

| Umgebung | Schema | Beispiel |
|---|---|---|
| prod | `<app>.codeslage.de` (Webseite: `codeslage.de`) | `status.codeslage.de` |
| int | `<app>-int.codeslage.de` (Webseite: `int.codeslage.de`) | `status-int.codeslage.de` |
| dev | `<app>-dev.codeslage.de` (Webseite: `dev.codeslage.de`) | `status-dev.codeslage.de` |

Die Coolify-UI bekommt keinen öffentlichen Namen (nur Tailnet, ADR 0003).

## Folgen

- AK-11 (`status.codeslage.de`) ist unverändert erfüllbar.
- `02-architektur.md` A11 wird angepasst. Für Phase 1.5 (A9, PoCs) muss dort neu entschieden werden, z. B. `<projekt>-poc.codeslage.de` oder eine eigene Domain.
- Das Origin-Zertifikat für den Server deckt `codeslage.de` und `*.codeslage.de` ab und reicht damit für alle Umgebungen.
