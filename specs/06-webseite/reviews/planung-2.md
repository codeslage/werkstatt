## Review: PR #54 (`feature/webseite-plan`, Head db8380a) · Vorhaben 06-webseite · Stufe 3 Plan, 2. Durchgang (noch keine Tasks)

Ergebnis: ✅ mergebar (keine offenen 🔴; das Gate „Plan freigegeben“ durch den Inhaber steht noch aus)

Geprüft habe ich den Diff `8c38ac1..db8380a` und den gesamten Diff gegen `main`. Vollständig gelesen habe ich `plan.md`, ADR 0015, den Diff von `02-architektur.md` und `zeiten.md`, das Protokoll, CHANGELOG und `reviews/planung.md`. Zum Abgleich habe ich gelesen: `drift.yml`, `ci.yml`, `vitest.config` und die Root-`package.json`, außerdem aus PR #53 (`origin/feature/projekt-plattform-plan`, weiterhin 0b722ad) `specs/05-projekt-plattform/plan.md` und ADR 0012/0013. Lokal grün: `spec-check` (Exit 0), `format` (Exit 0), `spellcheck` (153 Dateien, 0 Funde). Die CI auf dem Head db8380a ist grün: alle 11 Checks bestanden (Lauf 44589489579).

### Stand der Befunde aus dem 1. Durchgang
| # | Befund | Stand |
|---|---|---|
| 1 🔴 | Sichtbarer Text aus Schritt 1/2 ohne Freigabe | behoben: `plan.md:88` (Text-PR = jeder PR mit sichtbarem Text), `:90` und `:97` (Schritte 1/2 als Text-PR), `:131` (Gesamtabnahme), `:152` (AK-11), `:175` (IX) |
| 2 🔴 | Drift-Check dauerhaft rot zwischen Schritt 5 und 6 | behoben: `plan.md:115` und `:119` (Entwurfs-PR bis Schritt 6), `:134` (apply, sofort mergen, Drift grün). Das passt zum Hinweis in `drift.yml:3-5` („plan lokal angewendet … danach den Lauf neu starten“). |
| 3 🟡 | `ci-ok`-Modell aus PR #53 | behoben: `plan.md:94`, `:151`, `:194`. Passt zu Plan 05 Z. 12, 135 und 178. |
| 4 🟡 | „täglich“ | behoben: `plan.md:16`, `:135`, `:182` |
| 5 🟡 | Rechte der Tofu-Tokens | behoben: `plan.md:120-125`, `:133`. Passt zu Plan 05 V3 (Z. 169). |
| 6 🟡 | A2 ohne Ausnahme | behoben: `02-architektur.md:104` |
| 7 🟡 | Typecheck für `.astro` | behoben: `plan.md:65`, `:95` |
| 8 🟡 | ADR-Nummern in `zeiten.md` | behoben: `zeiten.md:30` |
| 9 ⚪ | Pages: Edit gilt kontoweit | aufgenommen: ADR 0015 Z. 35. Daraus folgt aber der neue Befund 1. |
| 10 ⚪ | AK-3, Adresse als Text | behoben: `plan.md:144` |

### Befunde
| # | Grad | Datei:Zeile | Befund | Fehlerfall | Artikel |
|---|---|---|---|---|---|
| 1 | 🟡 | `docs/adr/0015-webseite-deploy.md:34` vs. `:35`; `specs/06-webseite/plan.md:52`, `:133` | Die neue Gegenmaßnahme in ADR 0015 Z. 35 lautet: „Der Token liegt nur in einem GitHub-Environment, das ausschließlich `main` verwenden darf.“ Das steht weder im Plan noch in derselben ADR eine Zeile vorher. Z. 34 sagt „Er liegt als GitHub Secret“. Schritt 6.1 sagt nur „Secrets `CF_PAGES_TOKEN` und `IMPRESSUM_*` … setzen“. In der Struktur fehlt bei `deploy-web.yml` ein `environment:`. | Wer Schritt 6 nach dem Plan umsetzt, legt `CF_PAGES_TOKEN` als Repo-Secret an. Dann kann jeder Workflow-Lauf auf einem Branch im selben Repo den Token lesen, etwa ein geänderter Workflow in einem PR. Mit diesem Token lassen sich Dateien in die Pages-Projekte `docs` und `docs-internal` aus PR #53 hochladen, am Öffentlich-Scan vorbei. Die einzige wirksame Gegenmaßnahme aus der ADR greift dann nicht. Behebung: In Schritt 6.1 und an `deploy-web.yml` das Environment (z. B. `production`, Deployment-Branch nur `main`) mit `CF_PAGES_TOKEN` und `IMPRESSUM_*` nennen und ADR 0015 Z. 34 angleichen. | VII |
| 2 | 🟡 | `docs/protokolle/2026-11-19-06-plan.md:11`; `CHANGELOG.md:13` | Die Korrekturen aus dem Review sind nicht nachgezogen. Das Protokoll (Punkt 4) zählt die neuen Abhängigkeiten ohne `@astrojs/check` auf. Den Review-Durchgang erwähnt es nicht: keine Text-PR-Regel für alle Schritte, kein Entwurfs-PR. Der CHANGELOG nennt „`02-architektur.md` A1 und A3 angepasst“, inzwischen ist auch A2 geändert. | Wer später im Protokoll oder CHANGELOG nachliest, warum Schritt 5 als Entwurf offen bleibt oder wo `@astrojs/check` begründet wurde, findet dort nichts oder einen veralteten Stand. Plan 05 hält seine Review-Durchgänge dagegen im Protokoll fest. | XII |
| 3 | ⚪ | `specs/06-webseite/plan.md:192` | Gegenmaßnahme zum Risiko „Freigabe für Text-PRs bleibt aus“: „Technik-Schritte laufen unabhängig weiter“. Seit dem Umbau sind aber die Schritte 1 (Gerüst und Prüfstand) und 2 selbst Text-PRs, und alles danach baut auf ihnen auf. | Bleibt die Freigabe für Schritt 1 aus, steht auch der Prüfstand. Die Gegenmaßnahme stimmt dann nicht mehr. Vorschlag: Schritt 1 in einen Technik-PR (Gerüst, Tests, CI) und einen kleinen Text-PR (Titel, Beschreibungen, 404) teilen oder die Gegenmaßnahme umformulieren. | III |
| 4 | ⚪ | `docs/adr/0015-webseite-deploy.md:35` | „Jedes Vorhaben bekommt einen eigenen Token“ steht dort als Gegenmaßnahme gegen das kontoweite Recht. Ein eigener Token kann aber genauso auf alle Pages-Projekte hochladen. Er begrenzt nur Erneuerung und Widerruf. | – (Formulierung; die wirksame Gegenmaßnahme ist die Bindung an das Environment, siehe #1) | VII |
| 5 | ⚪ | `specs/06-webseite/plan.md:135`; PR #53 `specs/05-projekt-plattform/plan.md:21`, `:280`, ADR 0012 Z. 24 | PR #53 sagt allgemein: „Geplante Läufe liegen nur in `platform`“. Plan 06 hängt die Web-Live-Tests an den geplanten Drift-Lauf in `werkstatt`. Plan 05 selbst lässt `werkstatt` einen eigenen geplanten Scan (Z. 193), gemeint sind also wohl nur Läufe über mehrere Repos. | – (kein Fehlerfall, solange `drift.yml` in `werkstatt` bleibt). Damit später niemand den Drift-Check „nach Plan 05“ nach `platform` verschiebt, sollte eine der beiden Seiten den Geltungsbereich klarstellen. | XII |

### Checkliste
| # | Prüfpunkt | ✅/❌/– | Anmerkung |
|---|---|---|---|
| 1 | Auftrag | ✅ | Die Korrekturen betreffen nur die Review-Befunde. Es kommt nichts Neues dazu, und es fehlt nichts. |
| 2 | Korrektheit | ✅ | Die Reihenfolge Entwurfs-PR → `apply` → Merge passt zu `drift.yml` und `tofu-state.md`. `web.test.ts` läuft im Entwurfs-PR nicht mit, weil `ci.yml` und `drift.yml` Infra-Tests nur namentlich aufrufen. Die Unit-Tests in `apps/web/src/site` fallen unter `vitest --project unit`. Kleiner Widerspruch in den Risiken (#3). |
| 3 | Tests | ✅ | AK-1 bis AK-18 haben jeweils eine Testart und einen Ort. AK-3, AK-10 und AK-11 sind angepasst. AK-10 passt zur Spec („Pflicht-Check für den Merge“) und zum `ci-ok`-Modell. |
| 4 | Eingaben | ✅ | Unverändert: `IMPRESSUM_*` wird per Schema geprüft, bei Fehlern bricht der Build ab. |
| 5 | Sicherheit | ❌ | Die Bindung an das Environment steht nur in der ADR, nicht im Plan (#1). Sonst sind die Token-Rechte jetzt vollständig benannt. |
| 6 | Datenschutz | ✅ | unverändert, `dsgvo.md` in Schritt 4 |
| 7 | Mensch im Loop | ✅ | Jeder sichtbare Text geht über einen Text-PR, dazu die Gesamtabnahme vor dem Livegang. Vorher gibt es keinen Deploy-Workflow und kein `apply`. |
| 8 | Zerstörerisches | ✅ | `apply` erst in Schritt 6 nach gezeigtem `plan`. Die Mail-Einträge werden vorher festgehalten. |
| 9 | Code-Qualität | – | Kein Code im PR. Für `.astro` sind Lint, Knip, Modulgrenzen, Format und Typecheck geplant. |
| 10 | Abhängigkeiten | ✅ | `@astrojs/check` (MIT) ist begründet. Alle acht Pakete haben eine Lizenz und eine Begründung. |
| 11 | Fehler | ✅ | Die Live-Prüfung ist jetzt richtig als wöchentlich beschrieben. Kein Dauer-Rot mehr im Drift-Check. |
| 12 | Doku | ❌ | A2 ist angepasst, die ADR-Nummern stimmen. Protokoll und CHANGELOG zeigen aber noch den Stand vor dem Review (#2), und die ADR widerspricht sich in Z. 34/35 (#1). |

**Zu den Fragen des Aufrufers:**
- **Befunde behoben:** Alle 10, siehe Tabelle oben. Aus der Antwort auf ⚪ #9 ist der neue 🟡 #1 entstanden.
- **Neue Widersprüche zu PR #53:** Bei `ci-ok`, den Token-Rechten (V3/V4, getrennter Upload-Token in `platform`) und der eigenen Datei `web.tf` gibt es keinen Widerspruch. Beim Geltungsbereich „geplante Läufe nur in `platform`“ fehlt eine Klarstellung (#5, ⚪). PR #53 steht unverändert auf 0b722ad.
- **CI auf dem Head db8380a:** grün, 11 von 11 Checks.
- **`zeiten.md`:** Die ADR-Nummern sind korrigiert. Die Zeile „Plan / Arbeit / läuft“ bleibt bei offenem Gate wie bekannt offen.

### Zusammenfassung für den Inhaber
Die beiden kritischen Punkte aus dem ersten Review sind sauber gelöst. Jeder Text, der auf der Seite zu sehen ist, braucht jetzt deine Freigabe, auch Seitentitel und Fehlerseite, und vor dem Livegang siehst du dir die ganze Seite einmal lokal an. Die Infrastruktur-Änderung bleibt bis zum Livegang als Entwurf liegen, damit der wöchentliche Infrastruktur-Check nicht dauerhaft rot meldet. Offen sind zwei kleinere Punkte. Erstens: Der Upload-Schlüssel für Cloudflare soll laut Entscheidungsdokument nur vom Hauptzweig nutzbar sein, im Umsetzungsplan steht das aber noch nicht. Ohne diese Sperre könnte man mit dem Schlüssel auch die Dokumentationsseiten aus Phase 1.5 überschreiben. Zweitens: Protokoll und Änderungsliste zeigen noch den Stand vor dem Review. Ausprobieren kannst du noch nichts. Beim Plan-Gate solltest du bestätigen, dass du schon das technische Gerüst (Schritt 1) als Text-PR selbst freigeben willst, denn bis dahin wartet alles Weitere.

Relevante Dateien (Pfade beim Ablegen auf das Repo gekürzt): `specs/06-webseite/plan.md`, `docs/adr/0015-webseite-deploy.md`, `docs/protokolle/2026-11-19-06-plan.md`, `CHANGELOG.md`, `specs/06-webseite/reviews/planung.md`

## Umsetzung der Befunde (Nachtrag)

1. 🟡 GitHub-Environment `production` (nur `main`) im Plan festgelegt. Betroffen sind Schritt 6.1 (Secrets `CF_PAGES_TOKEN` und `IMPRESSUM_*` nur dort, nicht als Repo-Secrets), `deploy-web.yml` (`environment: production`) und die Struktur. ADR 0015 Z. 34 ist angeglichen.
2. 🟡 Das Protokoll führt jetzt `@astrojs/check` auf und hält in Punkt 6 die Änderungen aus beiden Review-Durchgängen fest. Der CHANGELOG nennt A1, A2 und A3.
3. ⚪ Schritt 1 ist geteilt: Ein Technik-PR mit erkennbaren Platzhaltern (`[Titel …]`) wird selbst gemergt, die echten Texte kommen in einem kleinen Text-PR. Ein Test vor Schritt 6 stellt sicher, dass kein Platzhalter mehr im Build steht. Die Gegenmaßnahme im Risiko ist entsprechend umformuliert. Damit muss der Inhaber das technische Gerüst nicht selbst freigeben.
4. ⚪ ADR 0015: Als wirksame Gegenmaßnahme gilt die Bindung an das Environment. Ein eigener Token je Vorhaben macht nur Erneuern und Widerrufen unabhängig voneinander.
5. ⚪ Plan Schritt 6.3 stellt klar: Der Drift-Workflow bleibt in `werkstatt`, und „geplante Läufe nur in `platform`“ gilt für Läufe über mehrere Repos.
