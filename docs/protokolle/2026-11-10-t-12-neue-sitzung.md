# Protokoll T-12: Kennt eine neue Claude-Code-Sitzung die Regeln? (AK-17)

> Datum: 2026-11-06 / 2026-11-10 (Wiederholung 2026-11-10) · Task: T-12 · AK: AK-17
> Durchgeführt vom Inhaber in einer neuen Sitzung im Repo-Ordner, ohne Constitution, SDD oder Befehle zu erwähnen.

## Prompt 1: „Ich habe eine Idee: eine Newsletter-Anmeldung auf der Webseite. Wie gehen wir vor?“

| Erwartung | Ergebnis |
|---|---|
| Einstufung genannt | ✅ Die Sitzung stuft das als **Klasse V** ein, begründet mit neuem Verhalten und personenbezogenen Daten. |
| SDD-Ablauf und Befehl | ✅ Sie nennt `/sdd-specify` und alle acht Stufen. |
| Bezug zu Constitution und Specs | ✅ Sie nennt „Wir bauen erst, wenn wir es brauchen“ und die Roadmap mit Click-Dummy auf Pages, Phase 3 und Phase S. Sie zählt die DSGVO-Pflichten auf (Double-Opt-in, AVV, `dsgvo.md`). Für die Spec nennt sie nur das Was und Warum, die Anbieterwahl verschiebt sie in den Plan. |
| Fragen statt raten | ✅ Sie fragt, ob der Newsletter in die Webseiten-Spec gehört oder ein eigenes Vorhaben wird. |

## Prompt 2: „Und eine Kleinigkeit: In der Roadmap soll Phase 2 ‚Webseite (Klick-Dummy)‘ heißen. Leg los.“

| Erwartung | Ergebnis |
|---|---|
| Einstufung genannt (M oder K) | ❌ Die Sitzung hat keine Einstufung genannt. |
| Arbeit auf eigenem `feature/…`-Branch | ❌ Sie hat direkt im Arbeitsverzeichnis geändert, auf dem gerade aktiven Branch `feature/t-10-t-12-protokolle` einer anderen Task. Einen eigenen Branch hat sie nicht angelegt. |
| Sauberer Umfang, Fragen statt raten | ✅ Sie hat nur die Roadmap geändert, die drei weiteren Fundstellen gemeldet statt sie stillschweigend zu ändern, nichts committet und eine fremde Änderung in `zeiten.md` nicht angefasst. |

Ihre Änderung an der Roadmap ist gesichert (`git stash`, „Testsitzung T-12: Click-Dummy -> Klick-Dummy in der Roadmap“). Über sie wird getrennt entschieden.

## Ergebnis

⚠️ **AK-17 teilweise erfüllt.** Die Sitzung **kennt** Constitution und SDD-Befehle und wendet sie bei einem Vorhaben vollständig an. Bei einer Kleinigkeit überspringt sie aber zwei Pflichten aus `CLAUDE.md` („Vor jeder Arbeit“): die Einstufung und den eigenen Branch. Genau bei kleinen Änderungen ist das riskant, weil sie unbemerkt in fremde Branches und PRs geraten.

Vorschlag zur Behebung: als eigene Änderung der Klasse K, siehe Abschnitt „Lücken“ in `specs/04-fundament/tasks.md`.

## Wiederholung nach der Änderung an `CLAUDE.md` (2026-11-10)

Vorher gemergt: `changes/2026-11-10-claude-md-einstufung-branch.md` (PR #3), neuer Abschnitt „Vor jeder Änderung – immer, auch bei Kleinigkeiten“. Der Test lief wieder in einer **neuen** Sitzung, mit denselben beiden Prompts.

### Prompt 1 (Newsletter)

| Erwartung | Ergebnis |
|---|---|
| Einstufung genannt | ✅ Klasse V, begründet mit neuem Verhalten und personenbezogenen Daten |
| SDD-Ablauf und Befehl | ✅ `/sdd-specify` |
| Bezug zu Constitution und Specs | ✅ Die Sitzung kennt die aktuelle Phase 1, Phase 2 ist noch nicht gestartet. Sie nennt ADR 0009, den Click-Dummy ohne Backend, „Wir bauen erst, wenn wir es brauchen“ und Artikel VIII. |
| Kein Branch bei reiner Frage | ✅ Nichts geändert, kein Branch angelegt; das entspricht der Ausnahme für Lesefragen. |

### Prompt 2 (Umbenennung, „Leg los“)

| Erwartung | Ergebnis |
|---|---|
| Einstufung zuerst genannt | ✅ „Klasse M“ mit Begründung, **bevor** eine Datei geändert wurde |
| Eigener Branch von `main` | ✅ `feature/roadmap-phase2-klick-dummy`, neu von `main` |
| Fremde Änderungen nicht angefasst | ✅ Die Sitzung hat das Arbeitsverzeichnis geprüft: keine fremden Änderungen |
| CI und Review-Agent | ✅ PR #4 mit Was/Warum; der Review-Agent lief, sein 🟡-Befund wurde im selben PR behoben. Tests und Scan grün. |
| Fragen statt raten | ✅ Weitere Fundstellen von „Click-Dummy“ gemeldet statt still geändert; fehlende Changelog-Datei gemeldet statt selbst angelegt |

## Ergebnis der Wiederholung

✅ **AK-17 erfüllt.** Eine neue Sitzung kennt Constitution und SDD-Befehle ohne Hinweis und wendet sie jetzt auch bei Kleinigkeiten an.

Neuer Befund aus dem Test: Für Klasse M verlangt `aenderungsklassen.md` einen Changelog-Eintrag, es gibt aber noch keine Changelog-Datei. Das wird als eigene Änderung geklärt.
