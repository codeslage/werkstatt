# ADR 0003 – Privates Admin-Netz: Tailscale

> Status: **Vertagt** bis Phase S (ADR 0009) · Stand: 2026-11-05
> Bezug: `specs/04-fundament/spec.md` (offene Frage 6, AK-7, AK-8, AK-10), `specs/02-architektur.md` (A4)

## Kontext

SSH und die Coolify-UI dürfen nie öffentlich erreichbar sein. Zur Wahl stehen Tailscale und Cloudflare Tunnel + Access.

## Optionen

|                                | Tailscale                                                                                 | Cloudflare Tunnel + Access                                      |
| ------------------------------ | ----------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| Eingehende Ports               | keine für Admin; 80/443 nur aus Cloudflare-Netzen                                         | gar keine, auch nicht 80/443                                    |
| SSH                            | normales `ssh` über die Tailnet-Adresse                                                   | `cloudflared` als ProxyCommand auf jedem Client                 |
| Coolify-UI                     | direkt über die Tailnet-Adresse                                                           | als Access-geschützte öffentliche Domain                        |
| Ausfallunabhängigkeit          | Admin-Zugang funktioniert auch, wenn Cloudflare oder der Proxy auf dem Server gestört ist | Admin-Zugang hängt am selben Dienst wie der öffentliche Verkehr |
| CI-Zugriff (dev-Deploy)        | ephemerer Knoten mit Tag, ACL auf einen Port                                              | Service-Token für Access                                        |
| Kosten                         | kostenlos (Personal)                                                                      | kostenlos (bis 50 Nutzer)                                       |
| Neue Komponente auf dem Server | `tailscaled`                                                                              | `cloudflared`                                                   |

## Entscheidung

**Tailscale** für SSH und Coolify-UI. Öffentlicher Verkehr läuft weiter über den Cloudflare-Proxy auf 80/443, beschränkt auf die Cloudflare-IP-Bereiche. Cloudflare Access wird zusätzlich vor dev und int genutzt (AK-20), aber nicht für Admin-Zugänge.

Der wichtigste Grund ist die Trennung der Ausfallbereiche: Ist Cloudflare oder der Proxy gestört, kommt man trotzdem auf den Server. SSH bleibt außerdem ein ganz normales `ssh`.

## Folgen

- SSH lauscht nur auf `tailscale0`; Port 22 ist in der Hetzner-Firewall gar nicht geöffnet.
- ACL: `tag:admin` (Geräte des Inhabers) → `tag:server:*`; `tag:ci` → `tag:server:8000`. Sonst nichts.
- Notfallzugang bei Tailscale-Ausfall: Hetzner-Web-Konsole (Runbook `notfallzugang.md`).
- Tailscale (Kanada/USA) wird in `docs/dsgvo.md` erfasst; es verarbeitet nur Verbindungs-Metadaten.
- Die Option „gar keine eingehenden Ports“ (Tunnel) kann später für den öffentlichen Verkehr nachgezogen werden, ohne diese Entscheidung zu ändern.
