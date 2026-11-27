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

Abgenommen durch den Inhaber am: 2026-11-27, im Chat („Ja, abgenommen“), ausdrücklich einschließlich AK-12 mit der Abweichung zu Frage 15

## Soll/Ist

|                   | Soll                                           | Ist                                                                                                                            |
| ----------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Zeit (gesamt)     | 35,75 h (Summe der Tasks, Claude, konservativ) | **12,0 h** (720 min laut `zeiten.md`, mit Retro); bis zur Abnahme 11 h 33 min                                                  |
| davon Arbeit      | –                                              | 5,8 h                                                                                                                          |
| davon Wartezeit   | –                                              | 6,2 h, davon allein 2:52 h bei T-15 (CI und Freigabe)                                                                          |
| Zeit (Kalender)   | 1–2 Wochen bei ~20 h/Woche                     | 9 Tage (2026-11-19 bis 2026-11-27), gearbeitet an 6 Tagen, nebenbei und parallel zu Phase 1.5                                  |
| Schätzung Inhaber | keine eigene Schätzung genannt                 | –                                                                                                                              |
| Kosten/Monat      | 0 € zusätzlich (AK-15)                         | 0 € zusätzlich (Cloudflare Pages und Web Analytics im Free-Plan); laufend bestehen weiter Domain, Google Workspace, Claude-Abo |

Die Zeit ist die gemeinsame Sitzungszeit von Inhaber und Claude, die Wartezeit auf den Inhaber eingeschlossen (Methode in `zeiten.md`). Alle 86 Zeilen haben wir auf Überlappungen geprüft und keine gefunden, die Dauern passen zu Start und Ende. Außerhalb der Sitzungen hat der Inhaber nichts für die Seite getan. Gespräche, in denen er die Seite gezeigt hat, zählen nicht als Arbeit.

**Wartezeiten:** In der Retro sind wir die Wartezeit-Zeilen mit dem Inhaber einzeln durchgegangen. Entscheidung des Inhabers vom 2026-11-27: Alle bleiben stehen, ausgewertet wird später über die Spalte „Art“. Gestrichen ist nur die Pause bei T-10 (2026-11-20, 14:49–16:55; gestrichen am 2026-11-26). Sie steht als Hinweis unter der Tabelle.

→ Übertragen in die Soll/Ist-Tabelle in `specs/03-roadmap.md`.

**Umfang:** 22 PRs der Phase (#49 bis #85, ohne Phase 1.5, Dependabot, #50 und #82), 27 Review-Berichte mit 10 🔴 und 53 🟡 (alle erledigt), 2 ADRs (0014, 0015), 95 E2E-Tests (Playwright, inklusive axe-Kontrast hell und dunkel), Lighthouse ≥ 0,9 auf 9 URLs, 15 Live-Tests gegen `codeslage.de` und das DNS. Die Seite ist seit dem 2026-11-26 live.

## Was lief gut?

- **Die Qualität der Seite.** Der Inhaber: Die Qualität der Webseite sei „wirklich gut“, das Design gefalle ihm. Lighthouse liegt auf jeder Seite bei mindestens 90, die Kontraste sind hell und dunkel nach WCAG AA geprüft, und die Seite setzt kein einziges Cookie.
- **Weit unter dem Soll:** 12,0 h statt 35,75 h, gut ein Drittel. Ohne Wartezeit waren es 5,8 h Arbeit.
- **Unterchats mit Koordination.** Der Inhaber arbeitet nur noch in Claude Code. Eine Koordinationssitzung steuert das Vorhaben, jede Task läuft in einer eigenen Sitzung mit frischem Kontext und meldet sich, wenn sie fertig ist. So liefen T-13, T-15 und T-17 parallel.
- **Text-PRs mit Freigabe.** Kein KI-Text ging ungeprüft live (Artikel IX). Die lokale Vorschau und die Gesamtabnahme vor dem Livegang haben noch Korrekturen gebracht (#77).
- **Livegang ohne Mail-Ausfall.** Plan geprüft, `apply`, Drift-Check und Testmail. MX, SPF, DKIM und DMARC sind unverändert (AK-13).

## Was lief schlecht / was hat überrascht?

- **`main` war gesperrt.** Das Ruleset wurde auf den Pflicht-Check `ci-ok` umgestellt, bevor der Job auf `main` lag. Bis dahin konnte kein PR mergen.
- **„CI grün“ zu früh gemeldet.** Eine Sitzung hat „CI grün“ gemeldet, während `ci-ok` auf dem neuen Head noch lief. Die Merges mit `--match-head-commit` scheiterten.
- **Fremder Server im lokalen Test.** Playwright hat mit `reuseExistingServer` die Vorschau einer anderen Sitzung auf Port 4321 getestet, mit den echten Impressumsangaben. Das ergab zwei falsch rote Tests. Genauso gut hätte ein veralteter Build falsch grün sein können.
- **Lock-Datei nicht nachgezogen.** Der Dependabot-PR #22 hat den Cloudflare-Provider auf 5.29.0 gehoben, in `.terraform.lock.hcl` aber die alte Einschränkung und einen fehlenden Hash stehen lassen. Aufgefallen ist das erst beim lokalen `tofu init` in Stufe 7.
- **Rebase eines Branches mit offenem PR.** Der Force-Push danach wurde zu Recht blockiert (Artikel V). Abhilfe war ein Merge von `main`.
- **Ein Testschritt fehlte.** Der Test von T-24 (`tofu plan` mit erweitertem Token) lief erst in Stufe 7, obwohl die Task schon auf ✅ stand.
- **Wartezeit ist der größte Posten.** Mit 6,2 h ist sie größer als die Arbeit, vor allem durch Freigaben von Text-PRs und durch CI-Läufe, auf die gewartet wurde.
- **Token-Verbrauch.** Der Inhaber braucht aktuell einen großen Teil der Token aus seinem Abo. Ein Upgrade lohnt sich noch nicht, wird aber wohl die erste große Investition.

## Was ändern wir? (ggf. Constitution, Vorlagen, Befehle)

Nur Vorschläge. Jede Änderung an `docs/prozess/` kommt als eigener PR, den der Inhaber mergt (`governance.md`).

| Vorschlag                                                                                                                                                        | Ort                                        | Entscheidung des Inhabers                                         |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ | ----------------------------------------------------------------- |
| Merge-Regel festschreiben: eigene PRs mit `--squash --admin --match-head-commit <sha>` nur bei grünem `ci-ok` auf genau diesem Head (`gh pr checks`) und ohne 🔴 | `code-review.md` oder `release.md`         | offen                                                             |
| Reihenfolge beim Ändern von Pflicht-Checks: zuerst den Job auf `main` mergen, danach das Ruleset umstellen                                                       | `governance.md` oder Runbook               | offen                                                             |
| Orchestrierung als fester Ablauf: eine Koordinationssitzung je Vorhaben, je Task eine Sitzung mit frischem Kontext, die sich bei Abschluss meldet                | `sdd-ablauf.md`, Befehl `/sdd-implement`   | offen                                                             |
| Lokale E2E-Läufe auf eigenen Ports oder ohne `reuseExistingServer`, damit kein fremder Server getestet wird                                                      | `apps/web/playwright.config.ts` (Klasse K) | offen                                                             |
| Branches mit offenem PR per Merge von `main` aktualisieren, nicht per Rebase                                                                                     | `release.md`                               | offen                                                             |
| Dependabot-PRs für OpenTofu: Lock-Datei mit `tofu providers lock` prüfen, die Lock-Datei auf `main` korrigieren                                                  | Klasse M, eigener PR                       | Lock-Datei korrigiert am 2026-11-27, Prüfung bei Dependabot offen |

## Content-Notizen

→ `docs/content/2026-11-27-phase-2-webseite.md`
