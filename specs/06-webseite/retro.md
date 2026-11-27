# 06 – Phase 2 Webseite (Klick-Dummy): Retro

> Stand: 2026-11-27
> SDD-Stufen: 7 Verify · 8 Retro

## Abnahme (Stufe 7)

**Wo nachgewiesen:** Es gibt int und prod noch nicht (ADR 0009, Regel „Verify ohne int“ in `docs/prozess/sdd-ablauf.md`). `/release` entfällt. Nachgewiesen wird auf `main` mit Stand `f01e31a` (PR #81, letzter PR der Phase; die späteren #82 und #83 ändern nur Roadmap, Phase 1.5 und CHANGELOG und berühren kein AK der Webseite) und, wo die Spec es verlangt, an der Live-Seite `https://codeslage.de`.

**Läufe am 2026-11-27:**

- Lokal auf `f01e31a`: `pnpm test` 262/262 grün; `pnpm test:infra web.test.ts dns.test.ts` 15/15 grün gegen die Live-Seite und das echte DNS; `pnpm test:e2e` 95/95 grün; `pnpm lighthouse` auf 9 URLs mit je 3 Läufen ohne verletzte Grenze.
- CI auf `f01e31a` (Push nach `main`): alle Jobs grün, `ci-ok` grün ([Lauf](https://github.com/codeslage/werkstatt/actions/runs/45967999966)).
- Drift-Check auf `main` neu gestartet, grün, mit `dns.test.ts` und `web.test.ts` ([Lauf](https://github.com/codeslage/werkstatt/actions/runs/45968336349)).
- Historien-Scan auf `main` neu gestartet, grün ([Lauf](https://github.com/codeslage/werkstatt/actions/runs/45968340852)).
- Probelauf `tofu plan` in `infra/tofu/live` mit dem erweiterten Token `codeslage-tofu-rw`, vom Inhaber lokal ausgeführt (Test von T-24, zugesagt in Protokoll T-27, Punkt 6): kein Rechtefehler, „No changes. Your infrastructure matches the configuration.“ T-24 ist damit wieder ✅.
- Abruf der Live-Seite mit `curl`: `http://` und `www.` → 301 auf `https://codeslage.de/`; alle sieben Hauptseiten und `favicon.svg` liefern 200, ein unbekannter Pfad 404; HSTS, Content-Security-Policy und `X-Frame-Options: DENY` sind gesetzt, kein `Set-Cookie`.

**Hinweis zum lokalen E2E-Lauf:** Der erste Lauf hatte zwei Fehler (`build.spec.ts`, `legal.spec.ts`). Auf Port 4321 lief noch die Vorschau einer anderen Sitzung mit den echten Impressumsangaben, und Playwright hat sie lokal wiederverwendet (`reuseExistingServer`). Mit freien Ports (nur lokal geändert, nicht im Commit) liefen alle 95 Tests grün. In der CI tritt das nicht auf, weil dort immer neu gebaut wird.

| AK    | Nachweis                                                                                                                                                                                                                                                                                | Ergebnis |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| AK-1  | `e2e/navigation.spec.ts`: alle sieben Seiten erreichbar, Navigation von jeder Seite zu jeder Hauptseite, Impressum und Datenschutz mit einem Klick; live alle sieben Seiten 200                                                                                                         | ✅       |
| AK-2  | `infra/tests/web.test.ts` gegen die Live-Seite (lokal, im Drift-Check und nach jedem Deploy): `http://` und `www.` → 301 auf `https://codeslage.de`, Pfad und Query bleiben, 200 auf der Hauptdomain                                                                                    | ✅       |
| AK-3  | `e2e/contact.spec.ts`: alle Kontakt-Aufrufe führen zu `/kontakt/`, Adresse als Text, genau ein `mailto:`, kein `<form>`; Unit `test/contact.test.ts`. Der Buchungslink ist nur verlinkt (A9)                                                                                            | ✅       |
| AK-4  | `e2e/privacy.spec.ts` auf jeder Seite und der 404-Seite: keine Cookies, kein Speicher, nur eigener Ursprung; `e2e/beacon.spec.ts`: Beacon ist die einzige fremde Quelle; live prüft `web.test.ts` den Beacon als einzige fremde Quelle, `curl` zeigt kein `Set-Cookie`                  | ✅       |
| AK-5  | Protokoll T-27 (`docs/protokolle/2026-11-26-t-27-nachweise.md`): Web Analytics zeigt die ersten Besuche und 2 Aufrufe von `/kontakt/`, Screenshots ohne Metadaten in `docs/content/bilder/2026-11-26-t-27-nachweise/`                                                                   | ✅       |
| AK-6  | Lighthouse CI (`lighthouserc.json`, mobil, alle Seiten, Median aus drei Läufen, vier Kategorien ≥ 0,9) lokal und im CI-Job „Webseite (E2E + Lighthouse)“ grün                                                                                                                           | ✅       |
| AK-7  | `e2e/layout.spec.ts`: jede Seite bei 375 × 812 und 1280 × 800 ohne waagerechtes Scrollen                                                                                                                                                                                                | ✅       |
| AK-8  | `e2e/seo.spec.ts` (`lang="de"`, eigener Titel und Beschreibung, alle internen Links 200, unbekannter Pfad → 404), `e2e/texts.spec.ts` und `build.spec.ts` (kein Platzhalter); live 404 auf unbekanntem Pfad                                                                             | ✅       |
| AK-9  | `infra/tests/web.test.ts` gegen die Live-Seite: nur HTTPS, HSTS, Content-Security-Policy, kein Einbetten (`X-Frame-Options: DENY`, `frame-ancestors`); Abruf mit `curl` bestätigt                                                                                                       | ✅       |
| AK-10 | Der Web-Job steht in `needs` von `ci-ok`, das Ruleset von `main` verlangt `ci-ok` (per API geprüft); `infra/tests/repo.test.ts` grün                                                                                                                                                    | ✅       |
| AK-11 | Jeder Text-PR hat die Freigabe des Inhabers im Protokoll (T-08, T-10, T-12 bis T-17); Gesamtabnahme aller Texte inklusive Textkorrektur (#77) in der lokalen Vorschau vor dem Livegang (Protokoll T-23); vor dem Livegang gab es keine öffentliche Adresse, auch keine Vorschau-Adresse | ✅       |
| AK-12 | Impressum und Datenschutzerklärung vom Inhaber geprüft (Protokolle T-17 und T-23, „Das Impressum ist richtig.“); `e2e/legal.spec.ts`. Abweichung: Frage 15 (rechtliche Prüfung des Angebots) ist noch offen und läuft als bewusst akzeptiertes Risiko, Korrekturen kommen als Hotfix    | ⚠️       |
| AK-13 | `infra/tests/dns.test.ts` (MX, SPF, DKIM, DMARC unverändert) lokal und im Drift-Check grün; Testmail an und von `kontakt@codeslage.de` angekommen (Protokoll T-27)                                                                                                                      | ✅       |
| AK-14 | `docs/dsgvo.md`: Cloudflare Pages (Hosting), Cloudflare Web Analytics (Besuchsmessung) und Google mit Zweck „Terminbuchung“, je mit Zweck, Daten, Standort und DPF; Review T-17 bis T-19                                                                                                | ✅       |
| AK-15 | `docs/kosten.md`: Pages und Web Analytics im Free-Plan, 0 €; Cloudflare-Abrechnung 0 € laut Inhaber (Protokoll T-27)                                                                                                                                                                    | ✅       |
| AK-16 | `e2e/navigation.spec.ts`: Case Study „Wir bauen erst, wenn wir es brauchen“ erreichbar und von „Projekte“ verlinkt; live verlinkt unter `/projekte/wir-bauen-erst-wenn-wir-es-brauchen/`; Text freigegeben (T-15)                                                                       | ✅       |
| AK-17 | `e2e/brand.spec.ts`: Logo im Header jeder Seite, `<link rel="icon">` liefert 200; live `favicon.svg` 200; Logo freigegeben (T-10)                                                                                                                                                       | ✅       |
| AK-18 | `e2e/contrast.spec.ts`: axe `color-contrast` je Seite in `light` und `dark` ohne Verstoß                                                                                                                                                                                                | ✅       |

**Code-Reviews:** Für jeden PR der Phase liegt ein Review des Agenten `code-reviewer` in `reviews/` vor (PR #56, #58 bis #61, #63, #66, #72 bis #77, #79 bis #81). Alle 🔴 sind laut Nachtrag behoben; wo das erste Review ❌ ergab, folgte ein Nachreview oder ein Nachtrag mit der Umsetzung. Das Review dieser Stufe steht in `reviews/verify.md`.

**Offen:**

- **T-23 🔄, Frage 15:** Die rechtliche Prüfung des Angebots läuft noch. Der Inhaber hat den Livegang am 2026-11-26 als bewusst akzeptiertes Risiko freigegeben. Ergibt die Prüfung Korrekturen, kommen sie als Hotfix (`/hotfix`).

Abgenommen durch den Inhaber am: _steht aus_ (AK-12 mit der Abweichung zu Frage 15 ausdrücklich bestätigen)
