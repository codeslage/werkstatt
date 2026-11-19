## Review: PR #51 `feature/webseite-clarify` (Head 384f1d0) · Vorhaben 06-webseite · Stufe 2 Clarify (noch keine Tasks)

Ergebnis: ❌ nicht mergebar (offene 🔴)

### Befunde
| # | Grad | Datei:Zeile | Befund | Fehlerfall | Artikel |
|---|---|---|---|---|---|
| 1 | 🔴 | `.gitleaks.toml:49` | Der Pflicht-Check Rechtschreibung schlägt fehl. In dem neuen Kommentar bzw. Regex steht `kontakt`, und cspell kennt das Wort nicht. | `pnpm spellcheck` meldet lokal `.gitleaks.toml:49:7 - Unknown word (kontakt)` mit Exit 1. In der CI ist der Job „Rechtschreibung“ auf PR #51 ebenfalls `fail`. Ein roter Pflicht-Check blockiert den Merge. Lösung nach CLAUDE.md: `kontakt` in `project-words.txt` aufnehmen. | XV, code-review.md Ebene 1 |
| 2 | 🟡 | `specs/06-webseite/zeiten.md:35` | Die Summe der Wartezeit für Clarify ist falsch. | Die Wartezeit-Zeilen 23 (0:01) und 25 (0:03) ergeben 0:04, in den Summen steht 0:05. Damit ist das Ist für Soll/Ist und eine spätere Abrechnung um eine Minute zu hoch. | XIV |
| 3 | 🟡 | `specs/06-webseite/spec.md:101` | Im Constitution-Check (Artikel IV) steht noch „Annahmen A1–A7“. Die Spec hat aber inzwischen A1–A9 (Z. 77–78, neu in diesem PR). | Wer den Check liest, übersieht die neuen Annahmen A8 (Datenschutz-Generator) und A9 (Erstgespräch). | IV, XII |
| 4 | 🟡 | `specs/06-webseite/gestaltung.md:108` | Für die Startseite sind „drei Leistungen kurz (Raster 3 → 1 Spalte mobil)“ vorgesehen. `leistungen.md:16–23` und `spec.md:82` legen aber **vier** Leistungsbereiche fest. | Baut Stufe 6 nach `gestaltung.md`, fehlt auf der Startseite ein Bereich, oder das Dreier-Raster passt nicht. Plan und Tasks erben den Widerspruch. | XII |
| 5 | ⚪ | `specs/06-webseite/gestaltung.md:111` | Für „Über mich“ steht dort „optional Foto (offene Frage 3)“. Frage 3 ist inzwischen beantwortet: mit Foto (`spec.md:134`, V2). | Die Notiz widerspricht der Spec. Nach der Rangfolge gilt die Spec, das kann aber im Plan verwirren. | XII |
| 6 | ⚪ | `specs/06-webseite/zeiten.md:9, 12` | Der Methodenblock ist veraltet. Dort steht „die Vorlage folgt mit eigenem PR“, die Vorlage liegt aber schon auf `main`. Außerdem fehlt die Regel der Vorlage „Ist = Gesamtzeit (Arbeit + Wartezeit)“ (`_vorlagen/zeiten.md:13`). | Wer in Stufe 4/8 nach Z. 12 auswertet, kann nur die Arbeitszeit als Ist eintragen und weicht damit von `sdd-ablauf.md` ab. | XIV |
| 7 | ⚪ | `specs/06-webseite/zeiten.md:26, 35` | Die Zeile „Clarify / Arbeit / läuft“ ist noch offen. | Wird so gemergt, steht auf `main` eine offene Zeile ohne Ende. Sie muss im nächsten PR nachgetragen werden. | XIV |
| 8 | ⚪ | `specs/06-webseite/leistungen.md:3, 5` | Im Kopf steht der Hinweis „Antwort auf die offene Frage 1“ zweimal. | Nur Kosmetik. | – |

Zu den drei Schwerpunkten:
- **`.gitleaks.toml`:** Die Ausnahme ist sachlich in Ordnung. Sie ist mit `^…$` verankert und gilt nur für die Regel `codeslage-email` mit `regexTarget = "match"`. Ausgenommen ist damit genau `kontakt@codeslage.de`, nicht die ganze Domain. Die Ausnahme deckt sich mit `governance.md` (öffentliche Rollenadressen sind erlaubt) und mit der Antwort zu Frage 6. Der Job „Secret- und Öffentlich-Scan“ ist grün. Einziges Problem ist Befund 1.
- **Interna in `leistungen.md` und `gestaltung.md`:** Ich habe keinen Verstoß gefunden. Es gibt keine E-Mail außer der Rollenadresse, keine IP-Adressen, Hostnamen oder Vorschau-URLs, keine lokalen Pfade, keine Konten, keinen Registrar, keinen Arbeitgeber und keine Beträge. `leistungen.md:61` erwähnt „Gewerbeanmeldung, eventuell als Kleinunternehmer; Einzelheiten intern“. Das ist neutral formuliert und ist schon öffentlich bekannt (`01-vision.md:19`, `02-architektur.md:256`, `03-roadmap.md:107`). Die Sperrliste selbst konnte ich nicht prüfen, sie ist vertraulich. Der CI-Scan mit Sperrliste ist grün.
- **`zeiten.md`:** Keine Zeile überlappt eine andere: 15:17–15:25, 15:25–15:29, 15:30–15:31, 15:31–15:32, 15:32–15:33, 15:33–15:36, 15:36–. Jede Wartezeit steht in einer eigenen Zeile mit Art `Wartezeit`, und keine Zeile mischt Arbeit und Wartezeit. Die Dauern stimmen. Abweichungen: die Summe (Befund 2), der veraltete Methodentext (Befund 6) und die offene Zeile (Befund 7).

Außerdem habe ich die Kontrastwerte in `gestaltung.md` nach der WCAG-2-Formel nachgerechnet. Alle angegebenen Werte stimmen auf 0,1 genau.

### Checkliste
| # | Prüfpunkt | ✅/❌/– | Anmerkung |
|---|---|---|---|
| 1 | Auftrag | ✅ | Der PR liefert, was Stufe 2 verlangt: Fragen 1, 6 und 13 beantwortet, 14–16 als nicht blockierend vertagt, Spec auf „Geklärt“, Protokoll, CHANGELOG. Nichts geht darüber hinaus. |
| 2 | Korrektheit | ❌ | Summenfehler in `zeiten.md` (2) sowie Widersprüche zwischen Notizen und Spec (3, 4, 5). |
| 3 | Tests | ✅ | Das neue AK-18 hat eine Testart (E2E, beide Darstellungen). Die Zählung „18 AKs: 10/3/5“ im Constitution-Check stimmt. |
| 4 | Eingaben | – | Kein Code. Die Spec schließt Formulare weiter aus (AK-3). |
| 5 | Sicherheit / Öffentlich vs. intern | ✅ | Die Ausnahme in gitleaks ist eng gefasst, und in den Notizen stehen keine Interna. Der Secret-Scan ist grün. |
| 6 | Datenschutz | ✅ | Die Angaben fürs Impressum bleiben außerhalb des Repos (V4, Frage 4b). Das Foto liefert der Inhaber selbst (V2). |
| 7 | Mensch im Loop | ✅ | Die Vorschau gibt es nur lokal (AK-11, Frage 13). Texte gehen erst nach Freigabe live. |
| 8 | Zerstörerisches | – | Nichts dergleichen. Die DNS-Arbeiten folgen erst im Plan. |
| 9 | Code-Qualität | – | Kein Code. Die SVGs sind schlank und laden keine Schrift. |
| 10 | Abhängigkeiten | ✅ | Es kommen keine neuen hinzu. Schriften und `fonttools` sind ausdrücklich nur nach Freigabe vorgesehen. |
| 11 | Fehler | – | Nicht relevant für Stufe 2. |
| 12 | Doku | ❌ | CI „Rechtschreibung“ ist rot (1). Constitution-Check und `zeiten.md` sind nicht auf dem aktuellen Stand (3, 6). |

### Zusammenfassung für den Inhaber
Mit dieser Änderung sind die offenen Fragen zur Webseite geklärt: welche Leistungen auf der Seite stehen, wie sie aussieht, das Logo, die Kontaktadresse und dass die Vorschau nur auf dem eigenen Rechner läuft. Interne Angaben habe ich in den neuen Notizen nicht gefunden. Die Ausnahme für die Kontaktadresse ist eng gefasst und gilt nur für genau diese eine Adresse. Gemergt werden kann der PR trotzdem noch nicht: Die Rechtschreibprüfung kennt das Wort „kontakt“ nicht, und die CI ist deshalb rot. Außerdem ist in der Zeiterfassung eine Minute Wartezeit zu viel summiert, und an zwei Stellen passen die Notizen nicht zur Spec: drei statt vier Leistungen auf der Startseite und ein Foto, das dort noch „optional“ heißt. Ausprobieren kannst du jetzt am besten die Logo-Dateien in `specs/06-webseite/gestaltung/`, also das Favicon und das Logo auf hellem und dunklem Hintergrund.

Relevante Dateien (Pfade beim Ablegen auf das Repo gekürzt): `.gitleaks.toml`, `specs/06-webseite/zeiten.md`, `specs/06-webseite/spec.md`, `specs/06-webseite/gestaltung.md`, `specs/06-webseite/leistungen.md`

## Umsetzung der Befunde (Nachtrag)

1. 🔴 `kontakt` in `project-words.txt` aufgenommen; `pnpm spellcheck` lokal grün.
2. 🟡 Summe Wartezeit Clarify auf 0:04 korrigiert.
3. 🟡 Constitution-Check nennt jetzt „Annahmen A1–A9“.
4. 🟡 `gestaltung.md`, Startseite: „vier Leistungen kurz (Raster 2 × 2 → 1 Spalte mobil; angepasst an `leistungen.md`)“.
5. ⚪ `gestaltung.md`, Über mich: „Foto (Frage 3: ja, V2)“.
6. ⚪ Methodenblock in `zeiten.md` durch den der aktuellen Vorlage ersetzt (inkl. „Ist ist die Gesamtzeit“).
7. ⚪ Ende der Stufe nach `date` eingetragen, bevor gemergt wird.
8. ⚪ Doppelter Hinweis im Kopf von `leistungen.md` entfernt.
