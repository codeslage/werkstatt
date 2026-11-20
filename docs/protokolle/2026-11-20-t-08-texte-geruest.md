# Protokoll T-08: Texte des Gerüsts (Text-PR)

> Datum: 2026-11-20 · Task: T-08 · AK: AK-8, AK-11 · PR: PR-3 (Plan 06, Schritt 1)

1. **Text-PR (📝):** Gemergt wird erst nach ausdrücklicher Freigabe des Inhabers anhand der Vorschau bzw. der Screenshots (Spec Frage 9, AK-11).
2. **Tests zuerst:**
   - `apps/web/test/texts.test.ts`: kein `[…]` in Titeln, Beschreibungen und Beschriftungen aus `pages.ts`
   - `apps/web/e2e/texts.spec.ts`: kein `[…]` in Navigation, Footer und Fehlerseite (Titel, Beschreibung, Inhalt)

   Beide waren zuerst rot: 7 Unit- und 2 E2E-Tests. Ausgenommen sind die Wortmarke (T-10) und der Seiteninhalt (T-12 bis T-18). Die Prüfung des ganzen Builds folgt mit T-23.

3. **Texte (Entwurf von Claude, Grundlage `leistungen.md`, Ansprache „du“):**
   - Titel nach dem Muster „Seite – codeslage“, die Startseite heißt „codeslage – KI-getriebene Entwicklung für Startups“. Beschreibungen mit 50–160 Zeichen.
   - Navigation: Leistungen, Projekte, Über mich, Kontakt. Footer: „© 2026 codeslage“, Impressum, Datenschutz, „Quellcode auf GitHub“.
   - 404: Titel „Seite nicht gefunden – codeslage“, Überschrift „Diese Seite gibt es nicht.“, Link „Zur Startseite“.
4. **Ergebnis:** Unit 22, E2E 59 und Lighthouse grün. Screenshots (Start und 404, hell und dunkel, mobil und Desktop) gingen an den Inhaber.
5. **Review (kein 🔴):** Die Mono-Optik der 404-Überschrift aus `gestaltung.md` fehlte. Nachgezogen sind Token `--mono` und Klasse `.mono` mit dieser ersten Verwendung. Drei inhaltliche Hinweise gingen an den Inhaber: „KI-Automatisierung“ ohne „im Aufbau“, die vorläufige Überschrift „Start“ und das feste Jahr „© 2026“.
6. **Freigabe:** Der Inhaber hat die Texte am 2026-11-20 um 14:30 im Chat freigegeben („Ja, so freigeben“). Die drei Hinweise bleiben, wie sie sind: KI-Automatisierung ohne „im Aufbau“ in den Beschreibungen, „Start“ vorläufig bis T-13, „© 2026“ fest.
