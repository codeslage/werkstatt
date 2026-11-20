# Protokoll T-04 bis T-07: Layout und Prüfstand `apps/web`

> Datum: 2026-11-20 · Tasks: T-04, T-05, T-06, T-07 · AK: AK-1, AK-4, AK-6, AK-7, AK-8, AK-9, AK-10 · PR: PR-2 (Plan 06, Schritt 1)

1. **Layout (T-04):**
   - `Base.astro`: `lang="de"`, Titel, Beschreibung, Canonical auf `https://codeslage.de/…` und Favicon. Der Beacon kommt nur dann ins HTML, wenn beim Build `PUBLIC_CF_BEACON_TOKEN` gesetzt ist.
   - Header mit Hauptnavigation und Footer mit Impressum, Datenschutz und Repo-Link, beide aus `pages.ts`. `pages.ts` hat dafür das Feld `label` bekommen (Test zuerst rot).
   - Alle sieben Seiten mit Platzhaltern, dazu die 404-Seite.
   - `public/_headers` mit CSP ohne `unsafe-inline`, HSTS, `frame-ancestors 'none'` und weiteren Headern. Außerdem `robots.txt` und das Favicon aus `gestaltung/`.
2. **Impressum:** Astro 7 gibt Variablen ohne `PUBLIC_` nicht über `import.meta.env` an die Seite weiter. Der erste Build brach deshalb mit der Meldung aus `imprint.ts` ab (die Schutzregel greift). Jetzt liest `impressum.astro` die Werte über `getSecret` aus `astro:env/server`. `imprint.ts` exportiert dafür `IMPRINT_VARIABLES`.
3. **E2E (T-05):** `@playwright/test` 1.65.1 (Apache-2.0) mit vier Specs und 37 Tests: `navigation`, `seo`, `layout` (375 px und 1280 px) und `privacy`.
   - Der Test-Build bekommt die Platzhalter aus `apps/web/.env.example` und braucht keine `.env`.
   - `privacy` prüft im normalen Test-Build ohne Token, dass keine Anfrage den eigenen Ursprung verlässt. Nach dem Review läuft wie geplant ein zweiter Build mit Test-Token (`dist-beacon/`, Port 4322). `beacon.spec.ts` prüft dort, dass der Beacon die einzige fremde Quelle ist und das Token trägt. Playwright fängt die Anfrage ab. Gegenprobe: Ein falscher Schlüssel in `data-cf-beacon` macht den Test rot.
   - **Astro 7 und Agent-Umgebungen:** `astro preview` erkennt eine KI-Agent-Umgebung und startet dann von selbst im Hintergrund. Playwright hielt den Server deshalb für beendet („exited early“). Abhilfe ist `--ignore-lock`, damit läuft ein einmaliger Server im Vordergrund. Den liegengebliebenen Hintergrund-Server aus dem ersten Lauf habe ich vorher geprüft (eigener Prozess, eigener Ordner) und mit `astro preview stop` beendet.
4. **Gegenproben T-05**, jeweils zurückgesetzt, danach wieder 37 von 37 grün:

   | Fehler                                     | Spec         | Ergebnis |
   | ------------------------------------------ | ------------ | -------- |
   | Footer ohne Impressum-Link                 | `navigation` | 7 rot    |
   | `lang="en"`                                | `seo`        | 7 rot    |
   | externe Schrift (Google Fonts) im `<head>` | `privacy`    | 7 rot    |
   | 2000 px breites Element                    | `layout`     | 14 rot   |

5. **Lighthouse (T-06):** `@lhci/cli` 0.16.1 (Apache-2.0).
   - Gemessen werden alle acht Seiten, mobil, mit je drei Läufen. Gewertet wird der Median, alle vier Kategorien müssen mindestens 0,9 erreichen. Ergebnis: alle Seiten bestanden.
   - Die Berichte gehen nur in das gitignorierte `apps/web/.lighthouseci/`. Den Standard-Upload auf einen öffentlichen Speicher habe ich bewusst nicht gewählt.
   - Lighthouse nutzt das Chromium von Playwright.
   - **Gegenprobe:** Ohne Viewport-Tag blieb die schlichte Seite über 90. Mit fehlendem Viewport und Grenzwert 1,0 endet `lhci` mit Exit 1, 8 Seiten verfehlen „accessibility“. Ein erster Versuch war ungültig, weil das Einlesen der `.env.example` per Shell scheiterte und Lighthouse den alten Build maß. Er ist nicht mitgezählt.
6. **CI:** neuer Job „Webseite (E2E + Lighthouse)“ in `ci.yml`. Er installiert Chromium, führt die E2E-Tests aus und danach Lighthouse auf demselben Build.
7. Lokal grün: `lint`, `format`, `typecheck`, `knip`, `depcruise`, `test`, `spellcheck`, `spec-check`, E2E (37) und Lighthouse.
8. **Nach dem Review (PR #58):**
   - Die 404-Seite gibt kein Canonical mehr aus, getestet in `seo`. Sie läuft jetzt auch in `layout` und `privacy` mit. Insgesamt 41 E2E-Tests grün.
   - Hinweis für lokale Läufe: `pnpm --filter @codeslage/web lighthouse` misst das vorhandene `dist/`. Vorher also `test:e2e` oder `build` laufen lassen. In der CI stimmt die Reihenfolge.
   - Reihenfolge für T-07: Sobald der neue Check im Ruleset Pflicht ist, warten offene PRs ohne diesen Job (z. B. #57 aus Phase 1.5) auf ihn. Sie brauchen dann den aktuellen `main`.
