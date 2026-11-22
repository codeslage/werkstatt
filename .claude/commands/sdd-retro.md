---
description: 'SDD Stufe 8 – Retro, Soll/Ist und Content-Notizen'
argument-hint: '<NN-name>'
---

SDD-Stufe 8 **Retro** gemäß `docs/prozess/sdd-ablauf.md` (verbindlich über `CONSTITUTION.md`), Regel „Verify meldet, Retro hält fest“.

Vorhaben: $ARGUMENTS

Die Retro **hält fest**, sie setzt nichts um.

1. Frage den Inhaber nach tatsächlicher Zeit, Überraschungen und Learnings.
2. Fülle `specs/<NN-name>/retro.md` aus und übertrage Soll/Ist in `specs/03-roadmap.md`. Das Ist kommt aus `zeiten.md`: Summe der genauen Minuten aller Zeilen, Überlappungen geprüft, Ist = Gesamtzeit, dazu Arbeit und Wartezeit getrennt ausgewiesen.
3. Lege Content-Notizen für Case Study, Talk und Podcast in `docs/content/` ab.
4. Verbesserungen an Code, Doku, Constitution, Vorlagen oder Befehlen nur als **Vorschlag** mit Änderungsklasse (M/K/V) in `retro.md` notieren. Umgesetzt wird später per eigenem PR, nicht in der Retro.
5. Setze den Status von `spec.md` auf `Umgesetzt`.
