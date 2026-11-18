# 04 – Phase 1 Fundament: Retro

> Stand: 2026-11-18
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

Abgenommen durch den Inhaber am: _offen_

## Soll/Ist

Folgt in Stufe 8.

|              | Soll | Ist |
| ------------ | ---- | --- |
| Zeit         |      |     |
| Kosten/Monat |      |     |

→ Übertrag in die Soll/Ist-Tabelle in `specs/03-roadmap.md`

## Was lief gut?

Folgt in Stufe 8.

## Was lief schlecht / was hat überrascht?

Folgt in Stufe 8. Gesammelte Punkte:

- Wie zählt Arbeitszeit, wenn Tasks parallel laufen?
- AK-29: Reicht ein Lauf ohne Updates als Nachweis, oder braucht es je Ökosystem einen ersten echten PR?
- Verify ohne int: Stufe 7 und `/sdd-verify` setzen int voraus, das es bis Phase S nicht gibt. Das Gate in `sdd-ablauf.md` ist dafür noch nicht angepasst.
- Reviews bei Klasse M: Bei #4 ist der Wortlaut des Reviews verloren. Ab #8 liegt jeder Review als Datei unter `reviews/`.

## Was ändern wir? (ggf. Constitution, Vorlagen, Befehle)

Folgt in Stufe 8.

## Content-Notizen

Folgt in Stufe 8.
