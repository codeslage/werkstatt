## Review: PR #49 `feature/webseite-spec` (Head e48a43c) · Vorhaben 06-webseite · Stufe 1 Specify (noch keine Tasks) · 2. Durchlauf

Ergebnis: ✅ mergebar

### Befunde
| # | Grad | Datei:Zeile | Befund | Fehlerfall | Artikel |
|---|---|---|---|---|---|
| 1 | ⚪ | `specs/06-webseite/zeiten.md:20`, `:28` | Die letzte Arbeitszeile hat als Ende noch „läuft“. Die Summen für Arbeit und Gesamt stehen deshalb auch auf „läuft“. | Wird so gemergt, steht auf `main` eine offene Stufe 1, und Stufe 2 oder die Retro muss das Ende nachträglich rekonstruieren. Besser: Ende ablesen (`date`), bevor gemergt wird, oder spätestens beim Start von Stufe 2 nachtragen. | XIV |
| 2 | ⚪ | `specs/06-webseite/reviews/specify.md` (Ablage) | Das erste Review steht samt Nachtrag in `reviews/specify.md`. `code-review.md:31` verlangt für jeden weiteren Durchlauf eine eigene Datei. | Überschreibt die aufrufende Sitzung `specify.md` mit diesem zweiten Bericht, geht das erste Review mit 🔴-Befund verloren, und die Retro kann nicht mehr auswerten, welche Befunde vorkamen. Diesen Bericht deshalb als `reviews/specify-2.md` ablegen. | XII |

Erledigte Befunde aus dem ersten Review, jeweils am Diff geprüft:
- **Befund 1 🔴 (Konflikt `specs/03-roadmap.md`): erledigt.** `git diff main...HEAD -- specs/03-roadmap.md` zeigt genau drei Änderungen gegenüber `main` (7469c97): Stand-Zeile (Z. 4) mit dem neuen Eintrag „Start Phase 2, Spec `specs/06-webseite/`“ vor dem vollständig erhaltenen Eintrag aus #48 („Frage 3 beantwortet, Kit-Sync; Start Phase 1.5 …; Ist und Ende für Phase 1 …“), Tabellenzeile 2 mit Start 2026-11-19 (Zeile 1.5 behält 2026-11-19 von main, unverändert) und „Fertig, wenn“ in Phase 2. Von main geht nichts verloren. PR ist `MERGEABLE`, `mergeStateStatus: CLEAN`. Die CI auf e48a43c ist vollständig grün (11 von 11 Checks, auch „Image (Compose + Smoke)“).
- **Befund 2 🟡 (AK-Zählung): erledigt.** `spec.md:82` sagt „9 automatisiert, 3 teils automatisiert (AK-13, AK-16, AK-17), 5 mit Protokoll oder Review“. Nachgezählt an Z. 49–65: automatisiert AK-1–4 und 6–10 = 9; teils AK-13, 16, 17 = 3; Rest AK-5, 11, 12, 14, 15 = 5; zusammen 17.
- **Befund 3 🟡 (`zeiten.md`-Widerspruch): erledigt.** Die Methodenzeile Z. 9 beschreibt eigene Wartezeit-Zeilen mit Spalte „Art“ und getrennter Summe. Die Summentabelle Z. 26–28 hat die Spalten Arbeit, Wartezeit und Gesamt, und 0:51 + 0:06 = 0:57 stimmt. Die Vorlage folgt mit #50 (offen, Branch `feature/zeiten-warten`, ändert `specs/_vorlagen/zeiten.md` und `sdd-ablauf.md`). `git merge-tree` von e48a43c mit dem Head von #50 läuft ohne Konflikt.
- **Befund 4 🟡 (Roadmap „Klicks“): erledigt.** In `specs/03-roadmap.md:65` steht jetzt „Aufrufe der Kontaktseite als Kontakt-Interesse (Spec 06, Frage 8)“. Das passt zu AK-5 und zum Risiko in `spec.md:106`.
- **Befund 5 🟡 (PR-Beschreibung): erledigt.** Sie nennt 17 AKs, A1–A7, Status freigegeben und die Wartezeit-Zeilen mit Verweis auf #50.
- **Befund 6 🟡 (CHANGELOG/Protokoll): erledigt.** Beide Dateien sind im Branch committet und laufen durch die CI. Das Protokoll nennt in Schritt 2 „16 AKs, A1–A6“. Das ist als Verlauf korrekt, weil AK-17 und A7 in Schritt 3 dazukommen.
- **Befund 7 ⚪:** Er wird laut Nachtrag in Stufe 3 übernommen. Das ist für Stufe 1 angemessen.

Abgrenzung: Die Dateien unter `specs/05-projekt-plattform/` und `docs/protokolle/2026-11-19-05-specify.md` liegen nicht im Diff `main...HEAD`. Sie kommen nur über den Merge herein und wurden nicht bewertet.

### Checkliste
| # | Prüfpunkt | ✅/❌/– | Anmerkung |
|---|---|---|---|
| 1 | Auftrag | ✅ | Der Diff (7 Dateien) entspricht Stufe 1: Spec, `zeiten.md`, Review, Protokoll, CHANGELOG, Roadmap und Wortliste. Er enthält keine Technik und keinen Code. Die blockierenden Fragen 1 und 6 sind für Stufe 2 vorgesehen. |
| 2 | Korrektheit | ✅ | AK-Zählung, Wartezeit-Summe und Roadmap-Merge sind nachgeprüft (siehe oben). Die Bezüge zwischen Spec, Roadmap und Protokoll sind stimmig. |
| 3 | Tests | ✅ | Alle 17 AKs haben eine Nachweisart. Lokal sind `pnpm format`, `pnpm spellcheck` (0 Funde, 143 Dateien) und `pnpm spec-check` (Exit 0) grün, die CI auf e48a43c ebenfalls. |
| 4 | Eingaben | – | Kein Code. Die Spec schließt Formulare und Eingaben von außen aus (AK-3). |
| 5 | Sicherheit | ✅ | Keine Secrets, der Secret- und Öffentlich-Scan ist grün. Die Impressumsangaben bleiben außerhalb des Repos (Frage 4 b). Für Arbeitgeber- und Kundennamen gilt ein Freigabevorbehalt. |
| 6 | Datenschutz | ✅ | Keine Cookies und kein Speicher im Browser (AK-4), cookielose Messung (AK-5), Datenschutzerklärung (AK-12), Dienstleister in `dsgvo.md` (AK-14). |
| 7 | Mensch im Loop | ✅ | AK-11, Frage 9 (strengere Merge-Regel für Text-PRs) und A7 (Livegang nur nach OK) |
| 8 | Zerstörerisches | ✅ | Keine Löschungen. DNS nur nach Plan und Freigabe, Mail-Einträge bleiben unberührt (AK-13), nichts wird abgelöst (Frage 7). |
| 9 | Code-Qualität | – | Kein Code. Die neuen Wörter in `project-words.txt` werden in der Spec verwendet. |
| 10 | Abhängigkeiten | – | Keine neuen Pakete |
| 11 | Fehler | ✅ | Der unbemerkte Ausfall ist bewusst hingenommen und begründet (bis Phase S). |
| 12 | Doku | ✅ | Roadmap, CHANGELOG, Protokoll und PR-Beschreibung sind aktuell. Die Anpassung der Vorlage ist sauber in #50 ausgelagert. Offen ist nur der Hinweis zur „läuft“-Zeile (Befund 1). |

### Zusammenfassung für den Inhaber
Der PR legt fest, was die erste öffentliche Webseite von codeslage leisten soll: sieben Seiten, Kontakt per Mail ohne Formular, keine Cookies, eine einfache Besuchszählung, ein Logo, eine Case Study und keine laufenden Kosten. Live geht sie erst mit deinem ausdrücklichen OK. Alle Punkte aus dem ersten Review sind behoben. Beim Zusammenführen mit der Spec für Phase 1.5 sind beide Einträge in der Roadmap erhalten geblieben, und die automatischen Prüfungen sind vollständig grün. Ein echtes Risiko gibt es nicht. Offen sind nur zwei Kleinigkeiten: In der Zeiterfassung sollte die laufende Arbeitszeit noch abgeschlossen werden, und dieser zweite Prüfbericht sollte als eigene Datei abgelegt werden. Eine Vorschau gibt es in dieser Stufe noch nicht. Prüf bitte nur, ob die 17 Kriterien und die Antworten zu den offenen Fragen so stimmen, wie du sie gemeint hast.

Geprüfte Dateien (Pfade beim Ablegen auf das Repo gekürzt): `specs/06-webseite/spec.md`, `specs/06-webseite/zeiten.md`, `specs/06-webseite/reviews/specify.md`, `specs/03-roadmap.md`, `docs/protokolle/2026-11-19-06-spec.md`, `CHANGELOG.md`, `project-words.txt`. Ablage-Hinweis: Bitte als `specs/06-webseite/reviews/specify-2.md` ablegen und `specify.md` nicht überschreiben. Die Schweregrade folgen `code-review.md` (⚪ = Hinweis, entspricht dem erbetenen 🟢).

## Umsetzung der Befunde (Nachtrag)

1. ⚪ Ende der Stufe nach `date` eingetragen (2026-11-19 15:25), Summen geschlossen: Arbeit 0:11, Wartezeit 0:57, Gesamt 1:08.
2. ⚪ Bericht als `reviews/specify-2.md` abgelegt, `specify.md` bleibt unverändert.
