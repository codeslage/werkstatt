# Laufende Kosten

> Stand: 2026-11-18 · Bezug: Constitution XI und XIV, `specs/04-fundament/spec.md` (AK-15), ADR 0009
> Ziel in Phase 1: **0 €/Monat** zusätzlich. Bestehende Kosten (Domain, Google Workspace) sind nicht Teil dieses Projekts.

| Dienst                            | Tarif                     | Kosten/Monat | Hinweis                                                                                                                                    | Nachweis                                                                                   |
| --------------------------------- | ------------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| GitHub (Organisation `codeslage`) | Free                      | 0 €          | Actions für öffentliche Repos kostenlos                                                                                                    | ✅ Tarif `free` per API (2026-11-18)                                                       |
| Cloudflare (DNS)                  | Free                      | 0 €          | Zone `codeslage.de` im Free-Plan                                                                                                           | ✅ Plan „Free Website“, 0 USD, per API (2026-11-18)                                        |
| Cloudflare R2 (Tofu-State)        | Gratis-Kontingent (10 GB) | 0 €          | Zahlungsmethode hinterlegt (V8); State wenige KB                                                                                           | ✅ Nutzung November: 30 Class-A-, 36 Class-B-Zugriffe, 0 GB; berechnet 0,00 $ (2026-11-18) |
| Docker Desktop                    | Personal                  | 0 €          | kostenlos für private Nutzung und kleine Unternehmen (< 250 Mitarbeitende und < 10 Mio. $ Umsatz), ADR 0010; im Einsatz ab Schritt 3 (Mac) | –                                                                                          |
| **Summe**                         |                           | **0 €**      |                                                                                                                                            |                                                                                            |

Nicht in der Summe, weil schon vor dem Projekt vorhanden: Domain, Google Workspace und das Claude-Abo (Pro) des Inhabers.
