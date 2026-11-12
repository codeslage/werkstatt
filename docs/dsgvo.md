# Datenschutz – Dienstleister

> Stand: 2026-11-05 · Bezug: Constitution VIII, `specs/04-fundament/spec.md` (AK-28), `specs/02-architektur.md` (A8)
> Jeder Dienstleister, der Daten für codeslage verarbeitet, steht hier. Neue Dienste kommen im selben PR dazu, der sie einführt.

In Phase 1 werden **keine Daten von Kunden oder Besuchern** verarbeitet. Betroffen sind nur die Konto- und Arbeitsdaten des Inhabers.

| Dienstleister           | Zweck                    | Welche Daten                                                                                                       | Standort / Übermittlung | Grundlage                                    | Status AVV/DPA                                         |
| ----------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------ | ----------------------- | -------------------------------------------- | ------------------------------------------------------ |
| GitHub (Microsoft)      | Code, CI, Issues         | Kontodaten des Inhabers, Commit-Metadaten (Name, noreply-Adresse), Repo-Inhalt (öffentlich)                        | USA                     | EU-US Data Privacy Framework; GitHub DPA     | ⬜ prüfen (Org-Einstellungen)                          |
| Cloudflare              | DNS, R2 (Tofu-State)     | Kontodaten, Zahlungsdaten (V8), DNS-Einträge (öffentlich), verschlüsselter Tofu-State (R2-Bucket im EU-Rechtsraum) | USA/global              | EU-US Data Privacy Framework; Cloudflare DPA | ⬜ prüfen (Konto)                                      |
| Google (Workspace)      | Mail für `codeslage.de`  | Mails und Kontodaten                                                                                               | EU/USA                  | Workspace-Vertrag mit DPA                    | ⬜ prüfen (Admin-Konsole)                              |
| Anthropic (Claude Code) | KI-gestützte Entwicklung | Repo-Inhalte und Sitzungen, die Claude verarbeitet                                                                 | USA                     | Anthropic-Bedingungen/DPA                    | ⬜ prüfen                                              |
| Docker (Docker Desktop) | lokale Container         | ggf. Nutzungs-Telemetrie                                                                                           | USA                     | Docker-Bedingungen                           | ⬜ prüfen; Telemetrie in den Einstellungen abschaltbar |

Die AVV-/DPA-Prüfung und ggf. den Abschluss im jeweiligen Konto erledigt der Inhaber. Die Spalte wird bis T-43 nachgezogen.

## Später

Mit der ersten Verarbeitung von Daten Dritter (Webseite mit Analytics in Phase 2, Kontaktformular in Phase 3) kommen Zweck, Rechtsgrundlage und Löschfrist je Verarbeitung dazu.
