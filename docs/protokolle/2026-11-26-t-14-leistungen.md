# Protokoll T-14: Leistungen (Text-PR)

> Datum: 2026-11-26 · Task: T-14 · AK: AK-11, AK-1 · PR: PR-8 (Plan 06, Schritt 3)

1. **Grundlage:** `specs/06-webseite/leistungen.md` (Stand 2026-11-23).
   - Klammer „AI-driven“
   - vier Bereiche, die KI-Automatisierung gekennzeichnet als „im Aufbau“
   - Ablauf: Erstgespräch, Spec, Prototyp, MVP
   - Pilotprojekte mit Preisen auf Anfrage, nirgends „kostenlos“
   - „Nicht im Angebot“

   Die Seite spricht in der Ich-Form, wie Kontakt und Über mich.

2. **Offene Punkte aus Frage 14**, entschieden im Entwurf, gehen mit dem Text zur Freigabe:
   - Je Bereich ein Beispiel aus der Werkstatt.
   - „im Aufbau“ als kleine Kennzeichnung neben der Überschrift, mit einem Satz zum ersten Ablauf (Anfrage → Angebotsentwurf).
   - Große Projekte stehen nicht unter „Nicht im Angebot“: „Preise auf Anfrage“ lässt sie im Einzelfall offen.
3. **Test zuerst:** `e2e/services.spec.ts` war rot. Grün sind jetzt E2E 80, Lighthouse und alle Checks. Den Kontrast der Kennzeichnung prüft `contrast.spec.ts` in hell und dunkel mit.
4. **Screenshots:** `docs/content/bilder/2026-11-26-t-14-leistungen/`
5. **Review (kein 🔴):** Der Satz „Ergebnisse und Code gehören dir“ ist ergänzt: Allgemeines Wissen und wiederverwendbare Bausteine bleiben nutzbar (Artikel XIII). Die Punkte 1, 2 und 6 stehen in `leistungen.md` als entschieden (`reviews/T-14.md`).
6. **Wünsche des Inhabers:**
   - Den Satz im Infrastruktur-Beispiel hat er nicht verstanden, er ist umformuliert.
   - Neues Beispiel für die KI-Automatisierung: sein Social-Media-Agent.
   - Beispiele mit dünner Linie und Label „Beispiel“ statt grauem Text.
   - Die Beispiele sind gekürzt und jetzt kürzer als der Nutzen-Satz.
7. **Freigabe:** Der Inhaber hat die Seite am 2026-11-26 im Chat freigegeben („dann gefällt es mir jetzt“).
