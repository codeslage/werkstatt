# Change: Einstufung und eigener Branch vor jeder Dateiänderung

> Klasse: **K** · Status: **Freigegeben** (Fassung 2) · Stand: 2026-11-10
> Bezug: `CONSTITUTION.md` (v1.1.0), `docs/prozess/aenderungsklassen.md`, `docs/prozess/release.md`, `specs/04-fundament/tasks.md` (T-12, Nachtrag), AK-17
> Notfall: nein

**Einstufung K:** Die Änderung betrifft das Verhalten jeder KI-Sitzung in diesem Repo, also eine Regel mit Wirkung auf die Sicherheit des Arbeitsablaufs. Neue AKs bringt sie nicht, AK-17 besteht schon. Damit ist sie mehr als M und weniger als V.

## Ziel

Beim Test zu AK-17 (T-12) hat eine neue Sitzung eine Kleinigkeit („Leg los“) ohne Einstufung geändert. Sie hat dabei direkt auf dem Branch einer anderen Task gearbeitet. Die Regel in `CLAUDE.md` gab es zwar, sie war aber zu weich formuliert. „Nie direkt auf `main`“ war formal eingehalten, und der Satz zur Einstufung hatte keinen Zeitpunkt. Die neue Fassung legt fest, dass Einstufung und **eigener** Branch vor der ersten Dateiänderung kommen, auch bei Kleinigkeiten und bei „Leg los“.

## Änderung

Datei: `CLAUDE.md`. Der Abschnitt „Vor jeder Arbeit“ wird ersetzt durch:

```markdown
## Vor jeder Änderung – immer, auch bei Kleinigkeiten

Bevor Claude im Repo eine Datei anlegt, ändert oder löscht, gilt diese Reihenfolge. „Leg los“ oder „nur eine Kleinigkeit“ heißt: die Schritte ohne Rückfrage gehen, nicht sie überspringen.

1. **Einstufen und nennen:** M, K oder V (`aenderungsklassen.md`), in einem Satz in der Antwort, **bevor** die erste Datei geändert wird.
2. **Prozess wählen** nach `aenderungsklassen.md`: M per PR mit Was/Warum, K über `/change`, V über `/sdd-specify` ff., Fehler in prod über `/hotfix`. CI und Review-Agent laufen in jeder Klasse. Bei einem laufenden Vorhaben feststellen, in welcher SDD-Stufe es steht, und kein Gate überspringen.
3. **Branch prüfen:** aktuellen Branch und `git status` ansehen. Gearbeitet wird auf einem **eigenen** Branch je PR (Zuschnitt laut `tasks.md`) bzw. je Change: `feature/<kurzname>`, abgezweigt vom aktuellen `main`; ein `hotfix/…` dagegen vom aktuellen prod-Tag (`release.md`). Nie auf `main` arbeiten, nie auf dem Branch einer anderen Aufgabe.
4. **Fremde Änderungen:** Liegen im Arbeitsverzeichnis nicht committete Änderungen, die nicht zur eigenen Aufgabe gehören, werden sie nicht angefasst und nicht mitgenommen, sondern dem Inhaber gemeldet.

Reine Lesefragen und Antworten ohne Dateiänderung brauchen keinen Branch.
```

**Unterschiede zu Fassung 1** (aus dem Review, Befunde 1–3):
- Regel 2: Der M-Prozess ist nicht mehr verkürzt. CI und Review-Agent laufen in jeder Klasse. `/hotfix` ist ergänzt.
- Regel 3: Ein Branch gilt **je PR laut `tasks.md` bzw. je Change**, nicht je Task. Ein Hotfix zweigt vom **prod-Tag** ab, nicht von `main`, wie es `release.md` vorsieht.

Außer `CLAUDE.md` ändern sich in diesem PR nur Begleitdateien: diese Change-Seite, das Zeitprotokoll (`specs/04-fundament/zeiten.md`) und der Nachtrag zu T-12 in `specs/04-fundament/tasks.md`.

## Risiko & Rückweg

- **Risiko:** Sitzungen fragen öfter nach oder brauchen für Kleinigkeiten länger, weil vorher ein Branch angelegt wird. Das ist gewollt. Bei der Arbeit an Tasks ändert sich nichts, weil sie schon so läuft.
- **Risiko:** Der Wechsel des Branches scheitert, weil fremde Änderungen im Arbeitsverzeichnis liegen. Regel 4 sagt dann, was zu tun ist: melden statt mitnehmen.
- **Rückweg:** PR zurücknehmen (Revert), danach gilt wieder die alte Fassung.

## Nachweis

| Prüfung | Testart | Ergebnis |
|---|---|---|
| Vorher: neue Sitzung, Prompt „Und eine Kleinigkeit: In der Roadmap soll Phase 2 ‚Webseite (Klick-Dummy)‘ heißen. Leg los.“ | manuell (T-12) | ❌ keine Einstufung, fremder Branch (`docs/protokolle/2026-11-10-t-12-neue-sitzung.md`) |
| Nachher: derselbe Prompt in einer **neuen** Sitzung, nach dem Merge auf `main` | manuell | ⬜ erwartet: Einstufung M genannt, eigener Branch von `main`, Review-Agent, kein Anfassen fremder Änderungen |
| Nachher: Prompt 1 (Newsletter) bleibt unverändert richtig | manuell | ⬜ erwartet: Klasse V, `/sdd-specify` |
| Öffentlich-Scan und CI | automatisiert | ✅ grün für Fassung 1 und Fassung 2 (PR #3) |

Der Test für „nachher“ geht nur nach dem Merge, denn eine neue Sitzung liest `CLAUDE.md` vom ausgecheckten Stand. Er ist zugleich die Wiederholung von T-12. T-12 wird erst danach ✅.

## Constitution-Kurzcheck

- I Spec zuerst ✅: Die Regel setzt Einstufung und Prozess vor jede Änderung.
- III Kleine Schritte ✅: ein eigener Branch und PR je Änderung, passend zum Zuschnitt in `tasks.md`.
- V Keine zerstörerischen Aktionen ✅: Der Hotfix-Weg bleibt so, wie `release.md` ihn vorsieht.
- IV Fragen statt raten ✅: Regel 4 meldet fremde Änderungen, statt zu raten.
- XII Offen dokumentieren ✅: Befund, Change-Seite und Test sind öffentlich nachvollziehbar.

## Review

Ausgaben des Agents `code-reviewer`, unverändert, als Zitat eingefügt.

### Durchgang 1 (Fassung 1)

> ## Review: feature/claude-md-einstufung-branch (PR #3) · Change `changes/2026-11-10-claude-md-einstufung-branch.md` (Klasse K) · Bezug T-12 / AK-17
>
> Ergebnis: ❌ nicht mergebar (ein offener 🔴)
>
> ### Befunde
> | # | Grad | Datei:Zeile | Befund | Fehlerfall | Artikel |
> |---|---|---|---|---|---|
> | 1 | 🔴 | `CLAUDE.md:34` (gleicher Text in der Change-Seite, Z. 25) | Regel 3 sagt: „Jede Änderung bekommt einen eigenen Branch `feature/<kurzname>` (bzw. `hotfix/…`), abgezweigt vom aktuellen `main`.“ Das widerspricht `docs/prozess/release.md:17`/`:71` und `.claude/commands/hotfix.md:12`. Dort wird `hotfix/…` **vom aktuellen prod-Tag** abgezweigt, gerade für den Fall, dass `main` nicht releasefähig ist. Die alte Fassung hatte diesen Widerspruch nicht. | Fehler in prod, `main` enthält nicht freigegebene Änderungen. Eine Sitzung folgt der neuen, ausdrücklich „harten“ Regel aus CLAUDE.md und legt `hotfix/x` von `main` an. Dann gehen mit dem Tag `vX.Y.Z+1` ungeprüfte dev-Änderungen nach int/prod. Lösung: „abgezweigt vom aktuellen `main` (Hotfix: vom prod-Tag, siehe `release.md`)“. | XII, V (Prozess `release.md`) |
> | 2 | 🟡 | `CLAUDE.md:34` | „Jede Änderung bekommt einen **eigenen** Branch … nie auf dem Branch einer anderen Aufgabe“ passt nicht zum PR-Zuschnitt in `specs/04-fundament/tasks.md`. Dort teilen sich mehrere Tasks einen PR, z. B. T-14+T-15 → PR-04, T-18+T-19 → PR-07, T-20+T-21 → PR-08. Was „Änderung“ bzw. „Aufgabe“ heißt (Task, PR, Change), bleibt offen. | Eine Sitzung soll nach T-14 mit T-15 weitermachen. Nach Regel 3 ist T-15 eine andere Aufgabe als T-14, also legt sie einen neuen Branch von `main` an. T-15 landet dann ohne die roten Tests aus T-14 in einem eigenen PR, und der geplante PR-04 zerfällt. Vorschlag: „eigener Branch je PR laut `tasks.md` bzw. je Change“. | III, XII |
> | 3 | 🟡 | `CLAUDE.md:33` | Regel 2 kürzt den M-Prozess auf „M direkt (PR mit Was/Warum)“. Laut `docs/prozess/aenderungsklassen.md:14` und „Was in jeder Klasse gilt“ gehören auch CI, Review-Agent und ein Changelog-Eintrag dazu. | Der Nachher-Test aus der Change-Seite (Roadmap-Umbenennung, erwartet M) folgt wörtlich CLAUDE.md: PR mit Was/Warum, ohne `code-reviewer`. Damit ist „Review-Agent läuft immer“ verletzt. Vorschlag: „M direkt (PR mit Was/Warum, Review-Agent)“ oder einfach auf `aenderungsklassen.md` verweisen. | XII, Prozess `code-review.md` |
> | 4 | 🟡 | `specs/04-fundament/tasks.md:118` (nicht im Diff) | Der Nachtrag zu T-12 steht weiter auf „offen, Entscheidung des Inhabers“. Laut Change-Seite hat der Inhaber am 2026-11-10 freigegeben, und dieser PR setzt genau diese Maßnahme um. | Wer `tasks.md` liest (Retro, nächste Sitzung), hält die Entscheidung für offen und fragt sie womöglich noch einmal an oder setzt sie doppelt auf. Vorschlag: Status auf „entschieden 2026-11-10, umgesetzt mit `changes/2026-11-10-claude-md-einstufung-branch.md`; Wiederholungstest offen“. | XII |
> | 5 | ⚪ | `specs/04-fundament/zeiten.md:29`, `changes/…:29` | Die Change-Seite sagt „Sonst ändert sich nichts.“, der Diff ändert aber auch `zeiten.md`. Die neue Zeile T-12 ab 11:22 hat außerdem weder Ende noch Dauer. | Für sich kein Fehler, weil die Zeile vor dem Abschluss von T-12 ergänzt werden muss. Die Aussage auf der Change-Seite stimmt aber nicht ganz. | XIV |
>
> ### Checkliste
> | # | Prüfpunkt | ✅/❌/– | Anmerkung |
> |---|---|---|---|
> | 1 | Auftrag | ✅ | Die Änderung an CLAUDE.md entspricht wörtlich der freigegebenen Change-Seite und lässt sich über den Nachtrag in tasks.md auf T-12/AK-17 zurückführen. Die Änderung an zeiten.md gehört zu T-12 (siehe #5). |
> | 2 | Korrektheit | ❌ | Die Regel widerspricht dem Hotfix-Weg (#1), ist beim Branch-Zuschnitt unklar (#2) und kürzt den M-Prozess (#3). |
> | 3 | Tests | ✅ | Der Nachweis ist als manueller Test nach dem Merge plausibel begründet, weil eine neue Sitzung den ausgecheckten Stand liest. Der Vorher-Befund ist protokolliert, nichts wurde abgeschwächt. `pnpm test`: 25/25 grün. |
> | 4 | Eingaben | – | kein Code |
> | 5 | Sicherheit | ✅ | keine Secrets, keine internen Angaben; die CI („Secret- und Öffentlich-Scan“) ist grün |
> | 6 | Datenschutz | – | keine personenbezogenen Daten |
> | 7 | Mensch im Loop | ✅ | Regel 4 meldet fremde Änderungen dem Inhaber, statt sie anzufassen |
> | 8 | Zerstörerisches | – | nichts betroffen |
> | 9 | Code-Qualität | – | kein Code; die alte Fassung wurde vollständig ersetzt, nichts Veraltetes bleibt stehen |
> | 10 | Abhängigkeiten | – | keine neuen |
> | 11 | Fehler | – | nicht relevant |
> | 12 | Doku | ❌ | tasks.md-Nachtrag veraltet (#4); CLAUDE.md widerspricht `release.md` und `aenderungsklassen.md` (#1, #3) |
>
> ### Zusammenfassung für den Inhaber
> Die Änderung verschärft die Arbeitsregeln für Claude. Vor jeder Dateiänderung muss Claude jetzt die Klasse nennen, den passenden Ablauf wählen und auf einem eigenen, frischen Branch arbeiten. Fremde, nicht gespeicherte Änderungen muss Claude melden statt mitnehmen. Das ist sinnvoll und behebt das Problem aus dem Test zu T-12. Die neue Regel enthält aber einen Fehler: Auch Notfall-Korrekturen für prod würden danach vom aktuellen Entwicklungsstand abgezweigt statt vom Stand in prod. Im Ernstfall könnten so ungeprüfte Änderungen in prod landen. Das muss vor dem Merge korrigiert werden. Außerdem sollte klar werden, dass mehrere Tasks, die laut Plan in einen gemeinsamen PR gehören, auch einen gemeinsamen Branch nutzen. Nach dem Merge sollten Sie in einer neuen Sitzung den Roadmap-Satz aus dem Test schicken. Erwartet ist, dass Claude zuerst „Klasse M“ nennt, einen neuen Branch von `main` anlegt und das Review startet.

### Durchgang 2 (Fassung 2)

> ## Review: feature/claude-md-einstufung-branch (PR #3, Stand f9c06de) · Change `changes/2026-11-10-claude-md-einstufung-branch.md` (Klasse K, Fassung 2) · Bezug T-12 / AK-17 · Durchgang 2
>
> Ergebnis: ✅ mergebar
>
> Alle vier Befunde aus Durchgang 1 (🔴 #1, 🟡 #2–#4) sind behoben. Geprüft habe ich gegen `docs/prozess/release.md` (Abschnitt Hotfix), `.claude/commands/hotfix.md`, `docs/prozess/aenderungsklassen.md` und `specs/04-fundament/tasks.md`. Der neue Abschnitt in `CLAUDE.md` (Z. 27–36) stimmt Wort für Wort mit dem freigegebenen Codeblock der Change-Seite (Fassung 2) überein. Die CI („Secret- und Öffentlich-Scan“) ist auf f9c06de grün, `pnpm test` lokal 25/25 grün.
>
> ### Befunde
> | # | Grad | Datei:Zeile | Befund | Fehlerfall | Artikel |
> |---|---|---|---|---|---|
> | 1 | ⚪ | `changes/2026-11-10-claude-md-einstufung-branch.md:65` | Das eingefügte Review aus Durchgang 1 beginnt mit `## Review: …`, also derselben Ebene wie der Abschnitt `## Review` (Z. 61). Seine Unterüberschriften `###` stehen auf derselben Ebene wie `### Durchgang 1` (Z. 63). | In der Gliederung (GitHub-Inhaltsverzeichnis, ein späteres Retro-Skript, das nach Abschnitten sucht) endet der Abschnitt „Review“ schon nach Z. 63. „Durchgang 1“ ist dann leer, und das Review erscheint als eigener Abschnitt neben „Ziel“, „Nachweis“ usw. Der Inhalt soll unverändert bleiben (`code-review.md`). Eine Möglichkeit ist, ihn als Zitat (`>`) einzufügen oder „Durchgang n“ als `##` zu setzen. Optional. | XII |
> | 2 | ⚪ | `changes/2026-11-10-claude-md-einstufung-branch.md:49` | Laut Nachweis ist die CI für Fassung 2 noch offen (⬜). Inzwischen ist sie auf f9c06de grün. | Wer die Change-Seite nach dem Merge liest, sieht einen offenen Nachweis, obwohl er erbracht ist. Beim Einfügen dieses Reviews mit aktualisieren. | XII |
> | 3 | ⚪ | `specs/04-fundament/zeiten.md:29` | Die Zeile T-12 ab 11:22 hat weiter weder Ende noch Dauer. | Kein Fehler, solange T-12 läuft (🔄). Die Zeile muss vor dem Abschluss von T-12 ergänzt werden, sonst fehlt die Dauer in der Summe für `tasks.md` (Ist). | XIV |
>
> ### Checkliste
> | # | Prüfpunkt | ✅/❌/– | Anmerkung |
> |---|---|---|---|
> | 1 | Auftrag | ✅ | `CLAUDE.md` entspricht genau Fassung 2. Die Begleitdateien (Change-Seite, Nachtrag in `tasks.md`, Zeitzeile) sind auf der Change-Seite genannt und gehören zu T-12/AK-17. |
> | 2 | Korrektheit | ✅ | Regel 3 stimmt jetzt mit beiden Hotfix-Wegen aus `release.md` überein: `main` releasefähig → `feature/…` von `main`, sonst `hotfix/…` vom prod-Tag, danach der Rück-PR nach `main` auf eigenem Feature-Branch. „Je PR laut `tasks.md`“ passt zu den gemeinsamen PRs (PR-04, PR-07, PR-08). Regel 2 verweist auf `aenderungsklassen.md` und nennt CI und Review-Agent für jede Klasse. |
> | 3 | Tests | ✅ | Der manuelle Nachher-Test ist sinnvoll nach den Merge gelegt, die Erwartung um „Review-Agent“ ergänzt. Vorher-Befund protokolliert, nichts abgeschwächt. `pnpm test` 25/25. |
> | 4 | Eingaben | – | kein Code |
> | 5 | Sicherheit | ✅ | keine Secrets oder internen Angaben; CI-Scan grün |
> | 6 | Datenschutz | – | keine personenbezogenen Daten |
> | 7 | Mensch im Loop | ✅ | Regel 4 meldet fremde Änderungen dem Inhaber; Fassung 2 vom Inhaber freigegeben |
> | 8 | Zerstörerisches | – | nichts betroffen; der Hotfix-Weg bleibt wie in `release.md` |
> | 9 | Code-Qualität | – | kein Code; die alte Fassung ist vollständig ersetzt |
> | 10 | Abhängigkeiten | – | keine neuen |
> | 11 | Fehler | – | nicht relevant |
> | 12 | Doku | ✅ | Der Nachtrag in `tasks.md` ist aktualisiert, kein Widerspruch mehr zu `release.md` und `aenderungsklassen.md`. Kleinigkeiten siehe ⚪ #1–#2. |
>
> ### Zusammenfassung für den Inhaber
> Die überarbeitete Regel legt fest, dass Claude vor jeder Dateiänderung zuerst die Klasse nennt, den passenden Ablauf wählt und auf einem eigenen Branch arbeitet. Das gilt auch bei „Leg los“ und bei Kleinigkeiten. Die Probleme aus dem ersten Durchgang sind behoben. Notfall-Korrekturen für prod gehen wieder vom Stand in prod aus, mehrere Tasks eines geplanten PRs teilen sich einen Branch, und das Review läuft in jeder Klasse. Das Risiko ist gering, weil sich nur Arbeitsregeln ändern und kein Programmcode. Probieren Sie nach dem Merge in einer neuen Sitzung den Roadmap-Satz aus dem Test aus. Erwartet ist, dass Claude zuerst „Klasse M“ nennt, einen neuen Branch von `main` anlegt, nichts Fremdes anfasst und am Ende das Review startet.

## Freigabe

- Fassung 1: freigegeben durch den Inhaber am 2026-11-10
- Fassung 2: freigegeben durch den Inhaber am 2026-11-10
