# ADR 0006 – Backups: Coolify nativ nach Cloudflare R2

> Status: **Vertagt** bis Phase S (ADR 0009) · Stand: 2026-11-05
> Bezug: `specs/02-architektur.md` (A5), `specs/04-fundament/spec.md` (AK-12, AK-13, AK-19)

## Kontext

Täglich soll ein verschlüsseltes Backup außerhalb des Servers liegen, und ein Restore muss nachweislich funktionieren. In Phase 1 gibt es nur die Coolify-eigene Datenbank und eine Test-DB mit Seed-Daten, aber noch keine personenbezogenen Daten.

## Optionen

|                 | Coolify nativ → R2                                                                     | restic (eigener Container) → R2                       |
| --------------- | -------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| Aufwand         | Einstellung in Coolify                                                                 | eigener Container, Zeitplan, Aufbewahrung, Monitoring |
| Verschlüsselung | TLS beim Transport, R2 verschlüsselt ruhende Daten (AES-256, Schlüssel bei Cloudflare) | zusätzlich clientseitig, Schlüssel nur beim Inhaber   |
| Aufbewahrung    | in Coolify einstellbar                                                                 | `restic forget`                                       |
| Restore         | Dump laden und einspielen                                                              | `restic restore`                                      |

## Entscheidung

**Coolify-native Backups nach R2**, Bucket `codeslage-backups` (privat), eigener Token nur für diesen Bucket. Aufbewahrung 7 täglich + 4 wöchentlich. Der Restore wird per Skript getestet (AK-13). Ob ein Backup da ist, prüft ein unabhängiger CI-Job von außen (AK-12).

Begründung: In Phase 1 liegen keine Personendaten vor. Die Verschlüsselung beim Transport und im Ruhezustand reicht für Konfigurations- und Seed-Daten. Clientseitige Verschlüsselung wäre zusätzlicher Code ohne aktuellen Bedarf (Artikel XI).

## Folgen

- **Neu bewerten, bevor die ersten Personendaten gespeichert werden** (Phase 2, Kontaktformular): dann voraussichtlich clientseitige Verschlüsselung (z. B. restic oder `age`), Schlüssel offline beim Inhaber. Das kommt als Punkt in die Spec von Phase 2.
- R2 bleibt mit wenigen MB deutlich im kostenlosen Rahmen (10 GB).
- Cloudflare wird als Auftragsverarbeiter für Backups in `docs/dsgvo.md` erfasst.
