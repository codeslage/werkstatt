# ADR 0015 – Webseite: Upload aus der CI statt Git-Anbindung von Cloudflare Pages

> Status: **Angenommen** am 2026-11-19 (Entscheidung des Inhabers in Stufe 3) · Stand: 2026-11-19
> Bezug: `specs/06-webseite/spec.md` (AK-2, AK-11, AK-15, Frage 13, A7), `specs/06-webseite/plan.md`, ADR 0002, ADR 0009, Constitution IX, X

## Kontext

Die Webseite läuft auf Cloudflare Pages (`02-architektur.md`, A3). Pages kann auf zwei Wegen befüllt werden:

1. **Git-Anbindung:** Cloudflare liest das Repo und baut selbst. Jeder Branch bekommt dabei eine eigene, öffentlich erreichbare Vorschau-Adresse.
2. **Direkter Upload:** Unsere CI baut die Seite und lädt das Ergebnis mit `wrangler pages deploy` hoch.

Der Inhaber hat festgelegt: Die Vorschau gibt es nur lokal, und vor seiner Freigabe ist kein Text öffentlich erreichbar (AK-11, Frage 13). Live geht die Seite erst nach seinem ausdrücklichen OK (A7). Die Impressumsangaben dürfen nicht im öffentlichen Repo liegen (Frage 4).

## Optionen

|                                  | Git-Anbindung                                       | Upload aus der CI                                       |
| -------------------------------- | --------------------------------------------------- | ------------------------------------------------------- |
| Öffentliche Vorschau je Branch   | ja (lässt sich nur eingeschränkt abschalten)        | nein, hochgeladen wird nur `main`                       |
| Wer baut                         | Cloudflare (Build-Umgebung außerhalb unserer CI)    | GitHub Actions, dieselben Schritte wie die Tests        |
| Impressumsangaben zur Build-Zeit | als Pages-Umgebungsvariable bei Cloudflare          | als GitHub Secret, im Workflow gegen ein Schema geprüft |
| Zugriff                          | GitHub-App von Cloudflare mit Lesezugriff aufs Repo | ein Cloudflare-Token nur mit dem Recht „Pages: Edit“    |
| Reproduzierbar (X)               | Build-Einstellungen in Cloudflare                   | Workflow im Repo                                        |

## Entscheidung

**Upload aus der CI.** Ein Workflow baut `apps/web` mit den Impressumsangaben aus GitHub Secrets und lädt das Ergebnis per `wrangler pages deploy` hoch, und zwar **nur von `main`**. Das Pages-Projekt, die Domains, die DNS-Einträge und die Weiterleitung von `www` legt OpenTofu an (ADR 0002).

- **Bis zum Livegang** gibt es keinen Deploy-Workflow. Er kommt erst mit dem Livegang-Schritt ins Repo, nach dem OK des Inhabers.
- **Nach dem Livegang** geht jeder Merge nach `main` automatisch live. Das ist vertretbar, weil PRs mit sichtbaren Texten nur nach Freigabe des Inhabers gemergt werden (Spec, Frage 9).

## Folgen

- Neuer Cloudflare-Token `codeslage-pages-deploy`, nur mit dem Recht „Cloudflare Pages: Edit“ und mit Ablaufdatum. Er liegt nur als Secret des GitHub-Environments `production`, das ausschließlich `main` verwenden darf, und wird in `docs/secrets.md` und im Runbook `token-erneuerung.md` erfasst.
- Restrisiko: „Cloudflare Pages: Edit“ gilt für alle Pages-Projekte des Kontos, nicht für ein einzelnes. Mit dem Token ließe sich also auch auf die Projekte des Docs-Portals (ADR 0013) hochladen, am Öffentlich-Scan vorbei. Wirksame Gegenmaßnahme: Der Token liegt nur im Environment `production`, das ausschließlich `main` verwenden darf. Ein Workflow auf einem anderen Branch, etwa ein geänderter Workflow in einem PR, kommt so nicht an ihn heran. Ein eigener Token je Vorhaben schränkt die Rechte nicht ein, macht aber Erneuern und Widerrufen unabhängig voneinander. Er hat ein Ablaufdatum und wird mit den übrigen Tokens erneuert.
- Die Adresse `<projekt>.pages.dev` liefert nach dem Livegang dieselbe Seite aus. Auf jeder Seite verweist ein Canonical-Link auf `codeslage.de`.
- Fällt der Deploy aus, wird die CI rot, und GitHub schickt eine Mail (Constitution XVI). Die Seite bleibt dann auf dem letzten Stand.
- Ein Container-Image für `apps/web` gibt es nicht. Das ist eine bewusste Ausnahme von ADR 0009 („jede App hat ein Dockerfile“), denn statische Dateien brauchen keinen Server (Entscheidung des Inhabers, 2026-11-19). Zieht die Seite später auf einen eigenen Server um, reicht ein Webserver für statische Dateien.
