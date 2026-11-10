# Protokoll T-12: Kennt eine neue Claude-Code-Sitzung die Regeln? (AK-17)

> Datum: 2026-11-06 / 2026-11-10 · Task: T-12 · AK: AK-17
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
