# Datenschutz – Dienstleister

> Stand: 2026-11-18 · Bezug: Constitution VIII, `specs/04-fundament/spec.md` (AK-28), `specs/02-architektur.md` (A8)
> Jeder Dienstleister, der Daten für codeslage verarbeitet, steht hier. Neue Dienste kommen im selben PR dazu, der sie einführt.

In Phase 1 werden **keine Daten von Kunden oder Besuchern** verarbeitet. Betroffen sind nur die Konto- und Arbeitsdaten des Inhabers.

| Dienstleister           | Zweck                                | Welche Daten                                                                                                                                                                          | Standort / Übermittlung | Grundlage                                    | Status AVV/DPA                                                                                                 |
| ----------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- | -------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| GitHub (Microsoft)      | Code, CI, Issues                     | Kontodaten des Inhabers, Commit-Metadaten (Name, noreply-Adresse), Repo-Inhalt (öffentlich)                                                                                           | USA                     | EU-US Data Privacy Framework; GitHub DPA     | DPA Teil der GitHub-Bedingungen; Org im Tarif Free                                                             |
| Cloudflare              | DNS, R2 (Tofu-State), DMARC-Berichte | Kontodaten, Zahlungsdaten (V8), DNS-Einträge (öffentlich), verschlüsselter Tofu-State (R2-Bucket im EU-Rechtsraum), DMARC-Berichte (IP-Adressen und Mengen der sendenden Mail-Server) | USA/global              | EU-US Data Privacy Framework; Cloudflare DPA | Customer DPA Teil des Self-Serve-Vertrags                                                                      |
| Google (Workspace)      | Mail und Kalender für `codeslage.de` | Mails, Termine und Kontodaten                                                                                                                                                         | EU/USA                  | Workspace-Vertrag mit DPA                    | Cloud Data Processing Addendum Teil des Workspace-Vertrags (kein eigener Schalter in der Admin-Konsole)        |
| Anthropic (Claude Code) | KI-gestützte Entwicklung             | Repo-Inhalte und Sitzungen, die Claude verarbeitet; über Connectoren auch Kalenderdaten; Claude GitHub App für Cloud-Sitzungen                                                        | USA                     | Consumer-Bedingungen (Tarif Pro)             | **kein DPA** (gilt nur für kommerzielle Tarife); vertretbar, solange nur Daten des Inhabers verarbeitet werden |
| Docker (Docker Desktop) | lokale Container                     | ggf. Nutzungs-Telemetrie (ab Schritt 3, Mac)                                                                                                                                          | USA                     | Docker-Bedingungen                           | kein DPA (Tarif Personal); Telemetrie beim Einrichten auf dem Mac abschalten                                   |

Geprüft am 2026-11-18 (T-43). Einschätzung, keine Rechtsberatung: Solange nur Daten des Inhabers verarbeitet werden, ist kein AVV zwingend.

**Regel:** Bevor Daten Dritter verarbeitet werden (Kunden, Besucher), sind für alle beteiligten Dienstleister AVVs abgeschlossen. Bei Anthropic heißt das: kommerzieller Tarif (Team oder API) statt Pro.

## Später

Mit der ersten Verarbeitung von Daten Dritter (Webseite mit Analytics in Phase 2, Kontaktformular in Phase 3) kommen Zweck, Rechtsgrundlage und Löschfrist je Verarbeitung dazu.
