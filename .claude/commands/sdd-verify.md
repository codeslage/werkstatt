---
description: 'SDD Stufe 7 – prüfen, ob die Umsetzung die Spec erfüllt'
argument-hint: '<NN-name>'
---

SDD-Stufe 7 **Verify** gemäß `docs/prozess/sdd-ablauf.md` (verbindlich über `CONSTITUTION.md`).

Vorhaben: $ARGUMENTS

1. Prüfe, dass alle Tasks in `specs/<NN-name>/tasks.md` erledigt und nach `main` gemergt sind. Bringe den Stand mit `/release` (Schritte 1–4) als Release-Kandidat auf int. **Gibt es noch kein int (bis Phase S):** kein `/release`; abgenommen wird auf dem aktuellen `main` (`sdd-ablauf.md`, „Verify ohne int“).
2. Weise jedes AK aus `spec.md` **auf int** nach (Testlauf oder Protokoll des manuellen Tests). Ohne int: auf `main` – Tests lokal und in der CI, geplante Läufe auf `main` neu starten, manuelle Tests aus den Protokollen.
3. Stelle sicher, dass für jeden PR ein Code-Review nach `docs/prozess/code-review.md` vorliegt und keine 🔴-Befunde offen sind. Fehlt es, starte den Agent `code-reviewer` und nenne ihm **nur** Branch/PR und Vorhaben – keine eigene Einschätzung.
4. Lege `specs/<NN-name>/retro.md` aus `specs/_vorlagen/retro.md` an und fülle den Abschnitt „Abnahme“.
5. Ende mit der Bitte um Abnahme auf int durch den Inhaber (Gate ⛔). Die Abnahme ist die Freigabe für prod; danach `/release` fortsetzen. Ohne int: Abnahme auf `main`, danach direkt Stufe 8.

Zeit: Trage die Zeit dieser Stufe in `specs/<NN-name>/zeiten.md` ein (Systemuhr, Wartezeit auf den Inhaber in eigenen Zeilen, Spalte „Art“).
