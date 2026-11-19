# ADR 0013 – Docs-Portal: Starlight auf Cloudflare Pages, zwei getrennte Sites

> Status: **Vorgeschlagen** · Stand: 2026-11-19
> Bezug: `specs/02-architektur.md` (A10), `specs/05-projekt-plattform/spec.md` (AK-11 bis AK-16, AK-23, AK-24), `plan.md`, ADR 0004, Constitution Artikel VII, XI und XII

## Kontext

Die Doku aller Repos soll unter einer Adresse lesbar sein. Öffentliche Teile sind ein Schaufenster, interne Teile liest anfangs nur der Inhaber; später sollen weitere Personen ohne Umbau dazukommen. Interne Inhalte dürfen auf keinem Weg öffentlich werden: weder über direkte Adressen noch über die Suche oder einen Seitenindex. Nach einem Merge soll die Änderung spätestens nach 15 Minuten sichtbar sein. Laufende Kosten: 0 €.

## Optionen

|                                                 | Zwei Sites (öffentlich / intern), Access vor der internen | Eine Site, Access auf Pfad `/intern`                       |
| ----------------------------------------------- | --------------------------------------------------------- | ---------------------------------------------------------- |
| Interne Inhalte in Suchindex/Sitemap öffentlich | ✅ unmöglich, nicht im Build                              | ❌ Suchindex und Sitemap enthalten sie, extra Filter nötig |
| `pages.dev`-Adresse                             | ✅ ganze Site hinter Access                               | ⚠️ Pfadschutz auch dort nötig                              |
| Aufwand                                         | zwei Builds                                               | ein Build                                                  |

Aktualisierung: GitHub-Cron (unpünktlich, kostet bei Takt ≤ 15 min mehr als die freien Minuten) gegen Organisations-Webhook mit einem kleinen Worker, der den Build startet.

## Entscheidung

- **Astro Starlight** als statischer Generator (A10), Suche über den eingebauten Index. Upload als fertige Site zu **Cloudflare Pages**.
- **Zwei Pages-Projekte:** `docs.codeslage.de` mit nur öffentlicher Doku, `docs-intern.codeslage.de` mit allem. Die interne Site liegt mit allen Adressen (eigene Domain, `pages.dev`, Vorschau) hinter **Cloudflare Access**. Policy: Mail-Adresse steht auf einer Liste (Tofu-Variable), Anmeldung per Einmal-Code. Zugang erteilen und entziehen heißt: Liste ändern, `tofu apply` (AK-24).
- Vor jedem Upload der öffentlichen Site läuft der Öffentlich-Scan über den gesammelten Inhalt. Ein Fund bricht vor dem Upload ab (AK-15).
- **Aktualisierung:** Ein Organisations-Webhook (`push`) geht an den Worker `docs-trigger`. Der prüft Signatur und Nutzdaten und startet den Build in `codeslage/plattform` per `workflow_dispatch`. Zusätzlich gibt es einen nächtlichen Voll-Build.
- Pages-Projekte, Domains, DNS, Access und Worker per OpenTofu in `infra/tofu/live`.

## Folgen

- Neue Abhängigkeiten: `astro`, `@astrojs/starlight`, `wrangler`, `@cloudflare/workers-types` (Begründung in `plan.md`).
- Neuer Dienst: Cloudflare Zero Trust (Free, bis 50 Nutzer) verarbeitet die Mail-Adressen der Berechtigten → `docs/dsgvo.md`.
- Der Tofu-Token braucht zusätzlich Pages, Access und Workers (`docs/secrets.md`).
- Gehen Webhooks verloren, gilt die 15-Minuten-Grenze bis zum nächtlichen Build nicht; die Zustellung ist im Webhook-Protokoll von GitHub sichtbar.
