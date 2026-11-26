# Protokoll: Textkorrekturen nach der Abnahme (Text-PR)

> Datum: 2026-11-26 · Vorhaben: `specs/06-webseite/` · Klasse V, Nachtrag in Stufe 6 · AK: AK-11, AK-1

1. **Einstufung:** Nachtrag im laufenden Vorhaben 06 (Klasse V, Stufe 6), kein `/change`: Die Änderung betrifft Entscheidung 6 in `leistungen.md`, die Spec, `tasks.md` und `zeiten.md` dieses Vorhabens.
2. **Anlass:** Der Inhaber hat die Seite am 2026-11-26 in der lokalen Vorschau angesehen und Korrekturen am Text gegeben.
3. **Überzeile und Beschreibung:** Die Überzeile der Startseite und ihre Beschreibung in `pages.ts` nennen jetzt KI-Softwareentwicklung als Schwerpunkt, nicht KI-Automatisierung.
4. **„offen dokumentiert“:** Auf der Startseite, in `pages.ts` und auf „Über mich“ steht jetzt „nachvollziehbar dokumentiert“. „Über mich“ sagt dazu: Bei codeslage selbst ist die Doku öffentlich, bei deinem Projekt entscheidest du, wer sie sieht.
5. **Prototyp-Satz:** Varianten:
   - A: „Aus deiner Idee wird schnell ein Prototyp, den du Nutzern und Investoren zeigen kannst.“
   - B (eingesetzt): „Ein lauffähiger Prototyp in Tagen, nicht in Monaten: zum Testen mit Nutzern und zum Zeigen vor Investoren.“ Auf „Leistungen“ beginnt der Satz mit „Aus deiner Idee wird …“.
   - C: „Schnell etwas Lauffähiges, mit dem du deine Idee bei Nutzern und Investoren prüfst.“
6. **„günstig“:** Ersetzt durch „mit niedrigen laufenden Kosten“ (Start, Leistungen, `leistungen.md`).
7. **„im Aufbau“:** Die Kennzeichnung entfällt auf Start- und Leistungsseite (Entscheidung 6 in `leistungen.md`, Nachtrag 2026-11-26, Spec-Abschnitt „Inhalte“). Die CSS-Klasse `.badge` war danach ungenutzt und ist entfernt.
8. **Link zur Case Study:** Der Teaser nennt den Titel ohne Link, darunter steht ein eigener Link „Case Study lesen →“, im Stil von „Alle Leistungen →“.
9. **Test zuerst:** `services.spec.ts` (keine Kennzeichnung) und `navigation.spec.ts` (eigener Link, kein Link im Satz, keine Kennzeichnung) waren rot. Grün sind jetzt E2E 94, Unit, Typecheck, Lint, Knip, Depcruise, Format und Spellcheck. Die E2E liefen auf den Ports 4331 und 4332, weil auf 4321 die Vorschau der Koordinationssitzung lief.
10. **Nachträge:** V1 (Alias `kontakt@codeslage.de`) ist laut Inhaber erledigt. Die Zeile Wartezeit bei T-10 (2026-11-20, 14:49–16:55) war eine Pause. Sie ist aus `zeiten.md` gestrichen und steht dort jetzt als Hinweis. Das Ist von T-10 ist von 2,5 h auf 0,25 h korrigiert.
11. **Screenshots:** `docs/content/bilder/2026-11-26-texte-korrektur/` (vorher und nachher, Start, Leistungen und Über mich, hell und dunkel, mobil und Desktop).
12. **Review:** `specs/06-webseite/reviews/texte-korrektur.md`.
13. **Offen:** Die Texte werden später noch weiter geschliffen, über einen Agenten aus dem Social-Media-Vorhaben. Das gehört nicht in diesen PR.
