## Review: Branch `claude/gallant-ritchie-qd1uhb` (Head 8bf0130, noch kein PR) · Vorhaben 09-content-pipeline · Stufe 1 Specify (noch keine Tasks)

Ergebnis: ✅ mergebar (keine offenen 🔴, fünf 🟡 sollten vor der Freigabe bzw. in Clarify behoben werden)

### Befunde

| #   | Grad | Datei:Zeile                       | Befund                                                                                                                                       | Umgesetzt (Commit nach 8bf0130)                                                             | Artikel        |
| --- | ---- | --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | -------------- |
| 1   | 🟡   | `spec.md` AK-5                    | Prüfung „Öffentlich vs. intern“ greift zu spät: Ein Entwurf ist als PR im öffentlichen Repo schon sichtbar, bevor die CI anschlägt.          | AK-5: Prüfung schlägt an, bevor der Entwurf ins öffentliche Repo gelangt, und vor Veröffentlichung | VI, VII        |
| 2   | 🟡   | `spec.md` G4, AK-1, AK-6          | „Abnahme = Merge“ mehrdeutig: Status „Entwurf“ nach Merge, und Auto-Merge bei grüner CI würde Posts ohne Freigabe auslösen.                  | G4 und AK-6: nur Merge durch den Inhaber, nie Auto-Merge; Merge = Abnahme; AK-1 Status „zur Abnahme“; Frage 20, Risiko | IX, IV         |
| 3   | 🟡   | `spec.md` AK-9, AK-13, AK-14      | Zurückschreiben auf den geschützten `main` ungeklärt; bis zum Merge droht ein doppelter Post.                                                | AK-9 ergänzt, neue blockierende Frage 19                                                    | III, IV        |
| 4   | 🟡   | `spec.md` AK-13 vs. Frage 11      | AK-13 nimmt die offene Frage 11 vorweg.                                                                                                      | AK-13 als Annahme nach Artikel III/IX gekennzeichnet, Frage 11 nicht mehr blockierend       | IV             |
| 5   | 🟡   | Protokoll                         | „9 blockierend“ statt 8.                                                                                                                     | Protokoll auf den neuen Stand gebracht (21 Fragen, 9 blockierend)                           | XII, XIV       |
| 6   | ⚪   | `spec.md` Constitution-Check IX   | Bezug auf Frage 13 (öffentliche Entwürfe) fehlt.                                                                                             | Anmerkung zu IX ergänzt                                                                     | IX, XII        |
| 7   | ⚪   | `spec.md` G5 vs. AK-7             | AK-7 weicht von gesetzter Vorgabe G5 ab.                                                                                                     | AK-7 und G5 als Vorschlag mit Verweis auf Frage 17 gekennzeichnet                           | IV             |
| 8   | ⚪   | `spec.md` AK-2                    | Abgeleitete Zahlen und Zahlwörter nicht eindeutig prüfbar.                                                                                   | neue Frage 21                                                                               | II             |
| 9   | ⚪   | Branchname                        | `claude/…` statt `feature/<kurzname>`, im Protokoll begründet (Cloud-Sitzung darf nur dorthin pushen).                                       | keine Änderung                                                                              | III            |

### Checkliste (Kurzfassung)

Auftrag ✅ · Korrektheit ❌ (Befunde 2–5, umgesetzt) · Tests ✅ (`format`, `spellcheck`, `spec-check`, `pnpm test` 241 grün, kein Konflikt mit `origin/main`) · Eingaben ✅ · Sicherheit ✅ (Befund 1) · Datenschutz ✅ · Mensch im Loop ✅ (Befund 2, 6) · Zerstörerisches ✅ · Code-Qualität – · Abhängigkeiten – · Fehler ✅ · Doku ❌ (Befund 5, umgesetzt)

### Zusammenfassung für den Inhaber

Gründliche Spec, die deine Vorgaben vollständig aufnimmt. Drei Lücken vor der Freigabe: Prüfung auf interne Angaben vor dem Push (nicht erst vor der Abnahme), nur du mergst Post-PRs (kein Auto-Merge), und das Zurückschreiben „veröffentlicht“ auf den geschützten `main` ohne Doppel-Post. Bitte die blockierenden Fragen prüfen und ob 30 statt 15 Minuten in Ordnung sind.
