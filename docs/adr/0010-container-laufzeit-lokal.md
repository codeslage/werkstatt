# ADR 0010 – Lokale Container-Laufzeit: Docker Desktop

> Status: **Vorgeschlagen** · Stand: 2026-11-05
> Bezug: `specs/04-fundament/spec.md` (offene Frage 8, AK-25, AK-26), ADR 0009

## Kontext

Bis Phase S ist dev = lokal (ADR 0009). Postgres und die Apps laufen über Docker Compose. Gebraucht wird eine Container-Laufzeit für Windows jetzt und für macOS später.

## Optionen

|                                    | Docker Desktop                                                                                                             | Podman Desktop                                                                                     |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Lizenz                             | kostenlos für private Nutzung und Unternehmen mit < 250 Mitarbeitenden **und** < 10 Mio. $ Umsatz; darüber kostenpflichtig | Apache-2.0, ohne Einschränkung                                                                     |
| Compose                            | `docker compose` eingebaut                                                                                                 | über `podman compose` (ruft `docker-compose` oder `podman-compose` auf), gelegentlich Abweichungen |
| Verbreitung bei Kunden und in Doku | Standard                                                                                                                   | geringer                                                                                           |
| Windows                            | WSL2-Backend                                                                                                               | WSL2-Backend (Podman-Maschine)                                                                     |
| Gleichheit zur CI                  | GitHub-Runner nutzen Docker Engine, dieselben Befehle                                                                      | Befehle weitgehend gleich, Details abweichend                                                      |

## Entscheidung

**Docker Desktop.** Es nutzt dieselben Befehle und dasselbe Compose wie die CI und wie die meisten Kunden. Das Lizenzmodell passt für ein Hobbyprojekt und später für ein kleines Unternehmen.

## Folgen

- Der Inhaber installiert Docker Desktop selbst und akzeptiert die Lizenzbedingungen (V7).
- `compose.yaml` nutzt nur Funktionen, die auch Podman versteht. Ein Wechsel bleibt so möglich, falls sich die Lizenz ändert oder das Unternehmen die Grenzen überschreitet.
- Docker Desktop wird in `docs/kosten.md` mit 0 € und dem Hinweis auf die Lizenzgrenzen geführt.

## Quellen

- [Docker: Docker Desktop license agreement](https://docs.docker.com/subscription/desktop-license/)
