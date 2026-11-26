# Protokoll: T-23, Voraussetzungen für den Livegang

> Datum: 2026-11-26 · Vorhaben: `specs/06-webseite/` · Klasse V, Stufe 6 · AK: AK-11, AK-12

T-23 bleibt 🔄, bis Frage 15 erledigt ist. Nachtrag 2026-11-26: Der Inhaber hat den Livegang (T-25, T-26) ausdrücklich freigegeben und Frage 15 bis zum Ergebnis der Prüfung als bewusst akzeptiertes Risiko eingestuft.

| Punkt                    | Stand                                                                                                                                                                                                                                     | Datum              |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| V1 Alias `kontakt@…`     | ✅ Alias `kontakt@codeslage.de` angelegt (Angabe des Inhabers, eingetragen mit #77)                                                                                                                                                       | vor dem 2026-11-26 |
| V4 Impressumsangaben     | ✅ liegen im privaten Repo `codeslage/internal`, nicht in diesem Repo; `spec.md` steht auf erledigt                                                                                                                                       | 2026-11-26         |
| Gesamtabnahme            | ✅ Der Inhaber hat die vollständige Seite in der lokalen Vorschau abgenommen (Stand `main` 2bf0f69), ausgenommen Frage 15. Wörtlich: „Ich würde die Webseite bis auf Die Frage 15 abnehmen.“                                              | 2026-11-26         |
| Frage 15 (Rechtsprüfung) | ⚠️ bewusst akzeptiertes Risiko: Der Inhaber gibt den Livegang vor dem Ergebnis frei. Wörtlich: „das risiko ist ja sehr gering“, „Das Impressum ist richtig.“ und „Ja, go“. Die Prüfung läuft weiter, Korrekturen kommen danach als Hotfix | 2026-11-26         |
| Test „kein Platzhalter“  | ✅ `apps/web/e2e/build.spec.ts` eingeführt, zuerst rot, jetzt grün                                                                                                                                                                        | 2026-11-26         |

## Test „kein Platzhalter im gesamten Build“

1. **Definition:** wie in T-08 `hasPlaceholder` aus `src/site/pages.ts`, also Text in eckigen Klammern. Die Musterwerte `IMPRESSUM_*` aus `.env.example` sind Absicht und kein Platzhalter in diesem Sinn: Der Test-Build braucht keine echten Angaben, der Deploy setzt sie aus dem GitHub-Environment `production` (T-24).
2. **Umfang:** jede HTML-Datei in `dist/`, mit Titel, Beschreibung, sichtbarem Text und den Attributen `alt`, `aria-label` und `title`. Der Test liest die Dateien selbst und nicht über den Vorschau-Server. Den Build erzeugt der webServer aus `playwright.config.ts`. In der CI läuft er immer neu. Lokal entfällt er, wenn auf Port 4321 schon ein Server läuft (`reuseExistingServer`); dann vorher selbst `pnpm build` mit den Werten aus `.env.example` laufen lassen, sonst prüft der Test einen alten Stand. So lief der Nachweis hier, weil auf 4321 ein fremder Server lief.
3. **Zuerst rot:** Mit „[Text folgt]“ auf der Fehlerseite schlug der Test mit genau dieser Stelle fehl. Ohne den Platzhalter ist er grün.
4. **Review:** `specs/06-webseite/reviews/T-23.md`.
