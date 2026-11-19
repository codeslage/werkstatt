# 04 – Phase 1 Fundament: Retro

> Stand: 2026-11-19
> SDD-Stufen: 7 Verify · 8 Retro

## Abnahme (Stufe 7)

**Wo nachgewiesen:** Es gibt in Phase 1 weder int noch prod (ADR 0009, `spec.md` „Umgebungen“: dev = lokal). Der Release-Kandidat auf int und `/release` entfallen deshalb. Nachgewiesen wird auf dem aktuellen `main` (`cd5abff`, PR #42): Die automatischen Tests liefen lokal und in der CI, Drift-Check und Historien-Scan wurden am 2026-11-18 auf `main` neu gestartet, die manuellen Tests sind protokolliert.

**Läufe auf `main` am 2026-11-18:**

- `pnpm test`: 100/100 grün. `pnpm test:infra`: 22/22 grün (DNS, Repo-Schutz, Workflows, HCL).
- CI auf `cd5abff` (Push nach `main`): alle Jobs grün, auch „Image (Compose + Smoke)“.
- Drift-Check, manuell gestartet: Run 44402691716, „Drift (OpenTofu live)“ grün.
- Historien-Scan mit Sperrliste, manuell gestartet: Run 44402696714 grün.
- Lokal auf dem Mac: `pnpm dev:up`, `pnpm test:smoke` 9/9 grün, `pnpm dev:down`.

| AK    | Nachweis                                                                                                                                                                                                                                                                                                                                                                       | Ergebnis |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| AK-1  | `infra/tests/repo.test.ts`: Repo öffentlich, `main` nur per PR, kein Force-Push, jeder CI-Job ist Pflicht-Check; CI auf `main` grün                                                                                                                                                                                                                                            | ✅       |
| AK-2  | Secret-Scan im Pre-Commit-Hook und als CI-Job „Secret- und Öffentlich-Scan“ (grün); Historien-Scan grün; Register `docs/secrets.md`                                                                                                                                                                                                                                            | ✅       |
| AK-24 | Ebene 1 Hook per Test (`tools/public-scan/test/pre-commit.test.ts`: Commit mit Fixture wird abgelehnt), Ebene 2 CI und Ebene 3 Review per Negativtest (Protokoll T-11, `reviews/T-11.md`); Historie vor dem Veröffentlichen gescannt (Protokoll T-08); monatlicher Historien-Scan mit Pflicht-Sperrliste (`infra/tests/history-scan.test.ts`, Protokoll T-40, Run 44402696714) | ✅       |
| AK-3  | `infra/tests/dns.test.ts` über 1.1.1.1: MX bei Google, SPF, DKIM, DMARC mit `rua`; auch im Drift-Check                                                                                                                                                                                                                                                                         | ✅       |
| AK-4  | Testmail in beide Richtungen nach dem Umzug der Nameserver angekommen (Protokoll T-38, 2026-11-17)                                                                                                                                                                                                                                                                             | ✅       |
| AK-5  | Drift-Check auf `main` ohne Abweichung (Run 44402691716); `infra/tests/drift.test.ts` (wöchentlich, bei PRs auf `infra/`, Read-only-Tokens)                                                                                                                                                                                                                                    | ✅       |
| AK-14 | Register `docs/secrets.md` gegen die tatsächlichen Tokens abgeglichen (Protokoll T-42, `reviews/T-42.md`); Drift nur mit Read-only-Tokens                                                                                                                                                                                                                                      | ✅       |
| AK-15 | Kostenübersicht 0 € zusätzlich (Protokoll T-43, `docs/dsgvo.md`). Abweichung: Die GitHub-Abrechnungsseite war per API nicht lesbar, belegt ist der Tarif `free`                                                                                                                                                                                                                | ✅       |
| AK-16 | `tools/spec-check/test/check.test.ts`: jeder fehlende Pflichtteil macht den Check rot; CI-Job „Spec-Check“                                                                                                                                                                                                                                                                     | ✅       |
| AK-17 | Neue Sitzung, Wiederholungstest nach der Änderung an `CLAUDE.md` bestanden (Protokoll T-12, `reviews/T-12-3.md`); der erste Durchgang war nur teilweise erfüllt                                                                                                                                                                                                                | ✅       |
| AK-18 | Negativ-Fixtures für ESLint-Grenzen, knip, dependency-cruiser (`tools/quality-fixtures`) und tflint (`infra/tests/hcl.test.ts`); CI-Jobs Lint, Knip, Modulgrenzen, Infra                                                                                                                                                                                                       | ✅       |
| AK-25 | Smoke-Test in der CI bei jedem PR und lokal 9/9; manuell durch die Ersteinrichtung des neuen Mac (Plan v1.3, Protokoll T-30/T-31). Bewusst angenommene Lücke: Runbook-Abschnitte 1 und 2 sowie `cp .env.example .env` sind nicht noch einmal blind befolgt worden                                                                                                              | ✅       |
| AK-26 | CI-Job „Image (Compose + Smoke)“ baut, startet und prüft das Image bei jedem PR, mit Gegenprobe (kaputter Seed → rot); dasselbe Image läuft lokal; Basis-Images als Multi-Arch-Digest gepinnt                                                                                                                                                                                  | ✅       |
| AK-27 | Provozierter Fehler in Drift-Check und Historien-Scan, beide Fehler-Mails angekommen (Protokoll T-41); Schalter `simulate_failure` per Test (`infra/tests/simulate-failure.test.ts`)                                                                                                                                                                                           | ✅       |
| AK-28 | `docs/dsgvo.md` erfasst alle Dienstleister der Phase (Protokoll T-43, `reviews/T-43.md`)                                                                                                                                                                                                                                                                                       | ✅       |
| AK-29 | Update-PRs: npm (#15, #23–#26), OpenTofu-Provider (#21, #22). Für GitHub Actions, `docker` und `docker-compose` gab es bisher nur erfolgreiche Läufe ohne Updates (Protokolle T-22/T-23, T-27–T-29). Abweichung vom Wortlaut „erster Update-PR“: Der erste echte PR dieser Ökosysteme wird nachgetragen (offener Punkt in `tasks.md`, Nachträge); Klärung in der Retro         | ⚠️       |
| AK-30 | `tools/quality-fixtures/test/prettier.test.ts` (TS, JSON, YAML, Markdown) und `infra/tests/hcl.test.ts` (`tofu fmt`): falsch formatiert → rot; CI-Jobs Format und Infra                                                                                                                                                                                                        | ✅       |

**Reviews:** Für jeden gemergten PR (#2 bis #42) liegt ein Review vor, kein 🔴 ist offen. Drei frühe PRs der Klasse M haben keine eigene Datei unter `reviews/`: Bei #6 (zwei 🟡, im PR behoben) und #7 (keine Befunde) steht der Review als Kommentar im PR. Bei #4 belegt ihn nur eine Zeile im Protokoll T-12 („sein 🟡-Befund wurde im selben PR behoben“); den Wortlaut gibt es nicht mehr.

**Hinweis Historien-Scan lokal:** Ein lokaler Scan über alle Refs findet die drei absichtlichen Verstöße des Negativtests (Commit `83e43b6`). Lokal liegt er unter `origin/pr/1`, GitHub behält ihn als Ref des geschlossenen PR #1. Er ist auf keinem Branch, und der Historien-Scan auf GitHub ist grün.

Abgenommen durch den Inhaber am: 2026-11-18 (im Chat, mit den Abweichungen bei AK-15, AK-25 und AK-29)

## Soll/Ist

|                   | Soll                                          | Ist                                                                                                                                                        |
| ----------------- | --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Zeit (Arbeit)     | ≈ 50 h (Summe der Tasks, Claude, konservativ) | **≈ 14,4 h** mit Retro (bis zur Abnahme 13,8 h = 827 min laut `zeiten.md`, davon 8 min doppelt gezählt; Retro ≈ 0,5 h); auf Viertelstunden je Task: 16,5 h |
| Zeit (Kalender)   | 2–3 Wochen bei ~20 h/Woche                    | 2 Wochen (2026-11-05 bis 2026-11-19), gearbeitet an 7 Tagen, nebenbei                                                                                      |
| Schätzung Inhaber | 2–5 Arbeitstage                               | ≈ 2 Arbeitstage, wenn man die gut 14 h am Stück rechnet                                                                                                    |
| Kosten/Monat      | 0 € zusätzlich (AK-15)                        | 0 € zusätzlich. Laufend bestehen weiter: Domain, Google Workspace, Claude-Abo (Beträge in `codeslage/internal`)                                            |

Die Zeit ist die gemeinsame Sitzungszeit von Inhaber und Claude, Wartezeit auf den Inhaber eingeschlossen (Methode in `zeiten.md`). Außerhalb der Sitzungen hat der Inhaber nichts für das Vorhaben getan; auch Registrar, Cloudflare und Docker Desktop liefen mit Anleitung in der Sitzung.

→ Übertragen in die Soll/Ist-Tabelle in `specs/03-roadmap.md`.

**Umfang:** 42 PRs gemergt (davon 6 von Dependabot), 35 Review-Berichte mit 52 🟡 und 7 🔴 (alle erledigt: behoben, vom Inhaber freigegeben oder – beim Negativtest – der PR verworfen), 25 Protokolle, 10 ADRs, 103 Unit-Tests, 22 Infra-Tests, 9 Smoke-Tests.

## Was lief gut?

- **Das Vorgehen trägt.** Spec, Plan, Tasks, Review, Protokoll: Jeder Schritt war nachvollziehbar, und in Stufe 7 ließ sich jedes AK auf einen Test oder ein Protokoll zurückführen. Der Inhaber: „Unser Framework scheint zu funktionieren.“
- **Tests zuerst, mit Gegenprobe.** Rot-Phasen und Gegenproben haben echte Fehler gefunden, bevor sie in `main` kamen, z. B. dass ein geänderter Seed ohne `dev:down` nicht neu geladen wird oder dass der Smoke-Test ohne `.env` scheiterte.
- **Der Review-Agent findet etwas.** Fast jeder PR hatte berechtigte 🟡: ungenaue Doku, fehlende Change-Seite, falsch zugeordnete Schritte. Von den 7 🔴 stammen 3 aus dem absichtlichen Negativtest (PR verworfen); die übrigen wurden vor dem Merge behoben oder vom Inhaber ausdrücklich freigegeben.
- **DNS-Umzug ohne Mail-Ausfall.** Records nachgebaut, verglichen, dann umgestellt; die Testmail kam in beide Richtungen an (AK-3, AK-4).
- **Der Rechnerwechsel mitten in der Phase** (Windows → Mac) kostete nur eine Plan-Version (v1.2) und eine Sitzung.
- **Viel weniger Zeit als geschätzt:** ≈ 14,4 h statt ≈ 50 h.

## Was lief schlecht / was hat überrascht?

- **Dependabot reagiert nicht immer auf Kommandos.** „@dependabot rebase“ blieb ohne Wirkung; `gh pr update-branch` und „@dependabot recreate“ halfen.
- **Rechte von Claude haben Grenzen, und das ist gut so.** Änderungen am Ruleset und das Schreiben von Werten in `.env` wurden blockiert. Das kostete Wartezeit (z. B. 1:55 h auf den Pflicht-Check), der Schritt lag dann beim Inhaber.
- **Das interne Repo war auf GitHub leer.** Der Inhalt lag nur auf dem Windows-PC. Aufgefallen ist das erst beim Review auf dem Mac.
- **Verify ohne int:** Stufe 7 und `/sdd-verify` setzen int voraus, das es bis Phase S nicht gibt.
- **Zeiterfassung bei parallelen Tasks:** Laufen zwei Tasks gleichzeitig, zählt die Zeit doppelt (hier nur 8 min, mit echten Projekten wird es mehr).
- **AK-29:** Für GitHub Actions und Docker gab es nichts zu aktualisieren, also auch keinen „ersten Update-PR“.
- **Reviews bei Klasse M:** Bei #4 ist der Wortlaut des Reviews verloren. Ab #8 liegt jeder Review als Datei unter `reviews/`.

## Was ändern wir? (ggf. Constitution, Vorlagen, Befehle)

| Vorschlag                                                                                        | Entscheidung des Inhabers (2026-11-18) | Umsetzung                                                     |
| ------------------------------------------------------------------------------------------------ | -------------------------------------- | ------------------------------------------------------------- |
| Bis Phase S wird in Stufe 7 auf `main` abgenommen statt auf int (`sdd-ablauf.md`, `/sdd-verify`) | ja                                     | eigener PR #46 (Prozessdokument, Merge durch den Inhaber)     |
| Zeiterfassung: Laufen Tasks parallel, zählt die Zeit nur einmal                                  | ja                                     | im selben Prozess-PR wie oben (#46), Regel in `sdd-ablauf.md` |
| AK-29: Nachweis „erfolgreicher Lauf, bei Updates ein PR“ statt „erster Update-PR“                | nicht übernommen                       | abwarten: der erste echte PR wird nachgetragen (`tasks.md`)   |
| Checkliste beim Wechsel auf einen neuen Rechner („interne Repos gepusht?“)                       | nein, nicht relevant                   | –                                                             |

## Content-Notizen

→ `docs/content/2026-11-19-phase-1-fundament.md`
