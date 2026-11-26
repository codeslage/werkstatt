# Datenschutz – Dienstleister

> Stand: 2026-11-26 · Bezug: Constitution VIII, `specs/04-fundament/spec.md` (AK-28), `specs/06-webseite/spec.md` (AK-14), `specs/02-architektur.md` (A8)
> Jeder Dienstleister, der Daten für codeslage verarbeitet, steht hier. Neue Dienste kommen im selben PR dazu, der sie einführt.

In Phase 1 werden **keine Daten von Kunden oder Besuchern** verarbeitet. Betroffen sind nur die Konto- und Arbeitsdaten des Inhabers. Ab Phase 2 kommen die Daten von Besuchern der Webseite `codeslage.de` dazu (Abschnitt „Webseite“).

| Dienstleister           | Zweck                                               | Welche Daten                                                                                                                                                                          | Standort / Übermittlung | Grundlage                                    | Status AVV/DPA                                                                                                 |
| ----------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- | -------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| GitHub (Microsoft)      | Code, CI, Issues                                    | Kontodaten des Inhabers, Commit-Metadaten (Name, noreply-Adresse), Repo-Inhalt (öffentlich)                                                                                           | USA                     | EU-US Data Privacy Framework; GitHub DPA     | DPA Teil der GitHub-Bedingungen; Org im Tarif Free                                                             |
| Cloudflare              | DNS, R2 (Tofu-State), DMARC-Berichte                | Kontodaten, Zahlungsdaten (V8), DNS-Einträge (öffentlich), verschlüsselter Tofu-State (R2-Bucket im EU-Rechtsraum), DMARC-Berichte (IP-Adressen und Mengen der sendenden Mail-Server) | USA/global              | EU-US Data Privacy Framework; Cloudflare DPA | Customer DPA Teil des Self-Serve-Vertrags                                                                      |
| Google (Workspace)      | Mail und Kalender für `codeslage.de`, Terminbuchung | Mails, Termine und Kontodaten                                                                                                                                                         | EU/USA                  | Workspace-Vertrag mit DPA                    | Cloud Data Processing Addendum Teil des Workspace-Vertrags (kein eigener Schalter in der Admin-Konsole)        |
| Anthropic (Claude Code) | KI-gestützte Entwicklung                            | Repo-Inhalte und Sitzungen, die Claude verarbeitet; über Konnektoren auch Kalenderdaten; Claude GitHub App für Cloud-Sitzungen                                                        | USA                     | Consumer-Bedingungen (Tarif Pro)             | **kein DPA** (gilt nur für kommerzielle Tarife); vertretbar, solange nur Daten des Inhabers verarbeitet werden |
| Docker (Docker Desktop) | lokale Container                                    | ggf. Nutzungs-Telemetrie (ab Schritt 3, Mac)                                                                                                                                          | USA                     | Docker-Bedingungen                           | kein DPA (Tarif Personal); Telemetrie beim Einrichten auf dem Mac abschalten                                   |

Geprüft am 2026-11-18 (T-43). Einschätzung, keine Rechtsberatung: Solange nur Daten des Inhabers verarbeitet werden, ist kein AVV zwingend.

**Regel:** Bevor Daten Dritter verarbeitet werden (Kunden, Besucher), sind für alle beteiligten Dienstleister AVVs abgeschlossen. Bei Anthropic heißt das: kommerzieller Tarif (Team oder API) statt Pro.

## Webseite (Phase 2)

Die Seite setzt keine Cookies und hat kein Formular (AK-4). Die Datenschutzerklärung steht unter `/datenschutz/` (`apps/web/src/pages/datenschutz.astro`).

| Verarbeitung                                  | Dienstleister            | Daten                                                                        | Standort / Übermittlung                  | Grundlage                        | Löschfrist                                                                                | Status AVV/DPA                            |
| --------------------------------------------- | ------------------------ | ---------------------------------------------------------------------------- | ---------------------------------------- | -------------------------------- | ----------------------------------------------------------------------------------------- | ----------------------------------------- |
| Hosting                                       | Cloudflare Pages         | IP-Adresse, Zeitpunkt, Adresse, Browser und Betriebssystem (technische Logs) | USA/global; EU-US Data Privacy Framework | Art. 6 Abs. 1 lit. f DSGVO       | nach den Fristen von Cloudflare; kein eigener Zugriff auf Roh-Logs                        | Customer DPA Teil des Self-Serve-Vertrags |
| Besuchsmessung                                | Cloudflare Web Analytics | Seite, Herkunftsseite, Browser, Gerätetyp, Land, Ladezeiten; keine Cookies   | USA/global; EU-US Data Privacy Framework | Art. 6 Abs. 1 lit. f DSGVO       | nur zusammengefasste Zahlen; Aufbewahrung nach den Fristen von Cloudflare                 | Customer DPA Teil des Self-Serve-Vertrags |
| Kontakt per Mail                              | Google (Workspace)       | Mail-Adresse, Inhalt der Mail                                                | EU/USA                                   | Art. 6 Abs. 1 lit. b und f DSGVO | wenn erledigt, spätestens ein Jahr nach der letzten Nachricht (ohne Aufbewahrungspflicht) | Cloud Data Processing Addendum            |
| Terminbuchung (Erstgespräch, Google Kalender) | Google (Workspace)       | Name, Mail-Adresse, Termin                                                   | EU/USA                                   | Art. 6 Abs. 1 lit. b DSGVO       | spätestens ein Jahr nach dem Termin                                                       | Cloud Data Processing Addendum            |

Die Löschfristen für Mail und Termine sind ein Vorschlag aus T-17 und gelten mit der Prüfung durch den Inhaber (Frage 15, T-23).

## Später

Mit dem Kontaktformular in Phase 3 kommen dessen Zweck, Rechtsgrundlage und Löschfrist dazu.
