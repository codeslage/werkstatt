## Review: PR #51 `feature/webseite-clarify` (Head 5bed499) · Vorhaben 06-webseite · Stufe 2 Clarify (noch keine Tasks) · zweiter Durchlauf

Ergebnis: ✅ mergebar

Bedingung: Wie angekündigt muss die offene Zeile „Clarify / Arbeit / läuft“ in `zeiten.md` direkt vor dem Merge geschlossen werden. Ich habe das als bekannten Befund 7 behandelt. Der Merge ist es nicht.

### Befunde

Es gibt keine neuen Befunde. So steht es um die Befunde aus dem ersten Durchlauf (`specs/06-webseite/reviews/clarify.md`), geprüft auf Head 5bed499:

| # | Grad | Datei:Zeile | Befund | Stand | Artikel |
|---|---|---|---|---|---|
| 1 | 🔴 | `project-words.txt:162` | `kontakt` fehlte im Wörterbuch | **Behoben.** `pnpm spellcheck` läuft lokal mit 150 Dateien und 0 Fehlern. Der CI-Job „Rechtschreibung“ auf 5bed499 ist `pass`. | XV |
| 2 | 🟡 | `specs/06-webseite/zeiten.md:36` | Die Wartezeit-Summe für Clarify war 0:05 | **Behoben.** Dort steht jetzt 0:04, das entspricht den Zeilen 0:01 + 0:03. | XIV |
| 3 | 🟡 | `specs/06-webseite/spec.md:101` | Dort stand „A1–A7“ | **Behoben.** Jetzt steht dort „A1–A9“, passend zu den Annahmen A8 und A9 (Z. 77–78). | IV, XII |
| 4 | 🟡 | `specs/06-webseite/gestaltung.md:108` | Dort standen drei statt vier Leistungen | **Behoben.** Jetzt sind es „vier Leistungen kurz (Raster 2 × 2 → 1 Spalte mobil)“. Eine andere Stelle mit „drei Leistungen“ oder „3 → 1“ gibt es in `specs/06-webseite/` nicht mehr. | XII |
| 5 | ⚪ | `specs/06-webseite/gestaltung.md:111` | Dort stand „optional Foto (offene Frage 3)“ | **Behoben.** Jetzt steht dort „Foto (Frage 3: ja, V2)“. | XII |
| 6 | ⚪ | `specs/06-webseite/zeiten.md:5–13` | Der Methodenblock war veraltet | **Behoben.** Der Block folgt jetzt der Vorlage. Er hat die Regel „Art“ für eigene Zeilen, einen Abschnitt zu den Summen und „Ist ist die Gesamtzeit (Arbeit + Wartezeit)“. Der Hinweis „Vorlage folgt mit eigenem PR“ ist entfernt. | XIV |
| 7 | ⚪ | `specs/06-webseite/zeiten.md:26, 36` | Die Zeile „Clarify / Arbeit / läuft“ ist offen | **Offen und bekannt.** Sie wird vor dem Merge mit `date` geschlossen. Dabei muss auch die Summenzeile Z. 36 („läuft“ bei Arbeit und Gesamt) ausgefüllt werden. | XIV |
| 8 | ⚪ | `specs/06-webseite/leistungen.md:3–5` | Der Hinweis auf Frage 1 stand doppelt | **Behoben.** Z. 5 lautet jetzt nur noch „Mit dem Inhaber abgestimmt am 2026-11-19.“ | – |

Der Korrektur-Commit 5bed499 ändert nur die genannten Stellen und legt die Review-Datei an. Darüber hinaus hat er keine Nebenwirkungen. Die Tabelle in `gestaltung.md` wurde nur wegen der Spaltenbreite neu umgebrochen, und `pnpm format` ist grün.

### CI auf Head 5bed499 (Run 44546723765)

Alle 11 Jobs sind `pass`: Format, Image (Compose + Smoke), Infra (OpenTofu), Knip, Lint, Modulgrenzen, Rechtschreibung, Repo-Einstellungen, Secret- und Öffentlich-Scan, Spec-Check und Typecheck. Lokal habe ich zusätzlich `pnpm spellcheck`, `pnpm format` und `pnpm spec-check` laufen lassen, alle mit Exit 0. Der PR steht auf `mergeable: MERGEABLE` und `mergeStateStatus: BLOCKED`. Das liegt am Branch-Schutz, der eine Freigabe verlangt, nicht an einem Check.

### Checkliste

| # | Prüfpunkt | ✅/❌/– | Anmerkung |
|---|---|---|---|
| 1 | Auftrag | ✅ | Der PR liefert, was Stufe 2 verlangt: Die Fragen 1, 6, 10 und 13 sind beantwortet, 14–16 sind als nicht blockierend vertagt. Die Spec steht auf „Geklärt“, Protokoll und CHANGELOG (#51) sind vorhanden. Der Korrektur-Commit geht nicht über die Befunde hinaus. |
| 2 | Korrektheit | ✅ | Die Widersprüche zwischen Notizen und Spec sind behoben (3, 4, 5) und die Summe stimmt (2). Die Zeitzeilen überlappen sich weiterhin nicht. |
| 3 | Tests | ✅ | Das neue AK-18 hat eine Testart. Die Zählung im Constitution-Check (18 AKs: 10/3/5) passt. Spec-Check ist grün. |
| 4 | Eingaben | – | Es gibt keinen Code. Formulare bleiben ausgeschlossen (AK-3). |
| 5 | Sicherheit / Öffentlich vs. intern | ✅ | Die gitleaks-Ausnahme ist weiterhin eng auf `kontakt@codeslage.de` beschränkt. Der Secret- und Öffentlich-Scan auf dem Head ist grün. Die Korrekturen bringen keine neuen Interna hinein. |
| 6 | Datenschutz | ✅ | Die Angaben fürs Impressum bleiben außerhalb des Repos (V4). Das Foto liefert der Inhaber (V2). |
| 7 | Mensch im Loop | ✅ | Die Vorschau gibt es nur lokal (AK-11, Frage 13). Texte werden erst nach Freigabe veröffentlicht. |
| 8 | Zerstörerisches | – | Der PR enthält nichts dergleichen. Die DNS-Arbeiten folgen im Plan. |
| 9 | Code-Qualität | – | Es gibt keinen Code. Die SVGs sind schlank. |
| 10 | Abhängigkeiten | ✅ | Es gibt keine neuen Abhängigkeiten. |
| 11 | Fehler | – | Für Stufe 2 nicht relevant. |
| 12 | Doku | ✅ | Alle CI-Jobs sind grün, auch die Rechtschreibung. Constitution-Check und Methodenblock in `zeiten.md` sind aktuell. Einzige Ausnahme ist die bekannte offene Zeitzeile (7), die vor dem Merge geschlossen wird. |

### Zusammenfassung für den Inhaber

Alle Punkte aus dem ersten Review sind erledigt. Die Rechtschreibprüfung kennt jetzt „kontakt“, und alle automatischen Prüfungen sind grün. Die Zeiterfassung rechnet richtig, und die Gestaltungsnotiz passt zur Spec: vier Leistungen auf der Startseite und „Über mich“ mit Foto. Das Risiko ist gering, denn der PR ändert nur Dokumente und keinen Code. Vor dem Merge muss noch die laufende Zeitzeile mit der echten Uhrzeit geschlossen werden. Zum Ausprobieren eignen sich weiterhin die Logo-Dateien in `specs/06-webseite/gestaltung/`, auf hellem und dunklem Hintergrund und als Favicon.

Hinweis zur Ablage: Das ist der zweite Durchlauf. Nach `docs/prozess/code-review.md` („bei mehreren Durchläufen: …-2.md“) gehört er nach `specs/06-webseite/reviews/clarify-2.md`, so wie bei `specify-2.md`.

Relevante Dateien (Pfade beim Ablegen auf das Repo gekürzt): `specs/06-webseite/zeiten.md`, `specs/06-webseite/spec.md`, `specs/06-webseite/gestaltung.md`, `specs/06-webseite/leistungen.md`, `project-words.txt`, `specs/06-webseite/reviews/clarify.md`

## Umsetzung der Befunde (Nachtrag)

7. ⚪ Ende der Stufe nach `date` eingetragen (2026-11-19 15:44); Summen Clarify: Arbeit 0:14, Wartezeit 0:04, Gesamt 0:18.
