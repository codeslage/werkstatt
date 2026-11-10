---
description: 'Fehler in prod beheben – wählt den passenden Hotfix-Weg'
argument-hint: '<kurzname> <Fehlerbeschreibung>'
---

Hotfix gemäß `docs/prozess/release.md` (Abschnitt Hotfix) und `docs/prozess/aenderungsklassen.md` (Klasse K, ggf. Notfall).

Fehler: $ARGUMENTS

1. Kläre mit dem Inhaber: Ist es ein akuter Notfall? (Dann darf die Change-Seite nachgezogen werden.)
2. Prüfe selbst und nenne das Ergebnis: **Ist `main` releasefähig?** (alles seit dem prod-Tag abgenommen bzw. unkritisch?)
   - **ja:** Weg über `feature/<kurzname>` → `main` → `/release` als PATCH.
   - **nein:** `hotfix/<kurzname>` vom aktuellen prod-Tag.
3. Change-Seite anlegen (bzw. bei Notfall eine Kurzfassung), zuerst einen Test schreiben, der den Fehler zeigt, dann den Fix.
4. Agent `code-reviewer` starten, 🔴-Befunde beheben.
5. Release wie in `/release` (beide Freigaben des Inhabers).
6. Beim Hotfix-Branch: **sofort** einen PR mit demselben Fix nach `main` erstellen. Erst wenn der gemergt ist, gilt der Hotfix als abgeschlossen.
7. Bei Notfall: Change-Seite innerhalb eines Arbeitstags vervollständigen.
