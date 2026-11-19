# ADR 0014 – Webseite mit Astro statt Next.js

> Status: **Angenommen** am 2026-11-19 (Entscheidung des Inhabers in Stufe 3) · Stand: 2026-11-19
> Bezug: `specs/06-webseite/spec.md` (AK-4, AK-6, AK-9, AK-17, AK-18), `specs/06-webseite/plan.md`, `specs/02-architektur.md` (A1), ADR 0009, Constitution XI, XIII, XV

## Kontext

`02-architektur.md` (A1) sah „Next.js für `web` und `portal`“ vor und nannte Astro für `web` als schlanker, aber kein Muss. Die Spec 06 verlangt für die Webseite:

- reine statische Auslieferung ohne Backend
- keine Dienste Dritter außer der Besuchsmessung (AK-4)
- Lighthouse ≥ 90 in allen Kategorien (AK-6)
- eine strenge Content-Security-Policy (AK-9)

Phase 1.5 plant außerdem ein statisches Docs-Portal (`02-architektur.md`, A10: „z. B. Astro Starlight“).

## Optionen

|                                    | Astro                                                    | Next.js (statischer Export)                    | Eigener Mini-Generator                         |
| ---------------------------------- | -------------------------------------------------------- | ---------------------------------------------- | ---------------------------------------------- |
| Ausgeliefertes JavaScript          | keins, solange keine Insel genutzt wird                  | React-Laufzeit und Hydration auf jeder Seite   | keins                                          |
| Lighthouse ≥ 90, strenge CSP       | einfach (reines HTML/CSS)                                | machbar, aber Aufwand (Inline-Skripte, Hashes) | einfach                                        |
| Gemeinsamer Stack mit dem Portal   | nein (Portal bleibt Next.js, Phase 4)                    | ja                                             | nein                                           |
| Gemeinsamer Stack mit Docs-Portal  | ja (Starlight baut auf Astro)                            | nein                                           | nein                                           |
| Wiederverwendbar für Kunden (XIII) | verbreitet für Marketing-Seiten                          | verbreitet                                     | gering                                         |
| Abhängigkeiten (XI)                | ein Paket mit Build-Werkzeug, MIT-Lizenz, aktiv gepflegt | mehrere (Next.js, React), MIT, aktiv gepflegt  | keine, aber eigener Code für Templates/Routing |

## Entscheidung

`apps/web` wird mit **Astro** als statische Seite gebaut (`output: 'static'`) und liefert kein eigenes JavaScript aus. Inhalte stehen als `.astro`- und Markdown-Dateien im Repo, Logik (z. B. die Prüfung der Impressumsangaben) in getesteten TypeScript-Modulen. Das Portal (Phase 4) bleibt bei Next.js.

## Folgen

- `02-architektur.md` A1: „Astro für `web` (ADR 0014), Next.js für `portal`“.
- Zwei Web-Stacks im Monorepo (Astro, später Next.js). Das ist bewusst so: Jeder passt zu seiner Aufgabe, und der Astro-Teil teilt sich das Wissen mit dem Docs-Portal aus Phase 1.5.
- Die Qualitäts-Checks (ESLint, Knip, Modulgrenzen, Format) müssen `.astro`-Dateien kennen. Details stehen im Plan.
