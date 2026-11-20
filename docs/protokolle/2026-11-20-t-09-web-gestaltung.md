# Protokoll T-09: Farben, Schriften und Raster `apps/web`

> Datum: 2026-11-20 · Task: T-09 · AK: AK-18, AK-6 · PR: PR-4 (Plan 06, Schritt 2)

1. **Abhängigkeit:** `@axe-core/playwright` 4.14.0 (MPL-2.0, im Plan begründet), als genaue Version im Lockfile.
2. **Test zuerst:** `e2e/contrast.spec.ts` prüft je Seite (inkl. 404) in `light` und `dark`, ob die Hintergrundfarbe aus `gestaltung.md` stimmt (`#FFFFFF` bzw. `#0D1117`) und ob axe mit der Regel `color-contrast` (WCAG AA) keine Verstöße findet. Ohne CSS waren alle 16 Tests rot, weil der Hintergrund transparent war.
3. **Umsetzung:** `src/styles/global.css` mit den Farb-Tokens aus `gestaltung.md` (Stand Runde 7, Waldgrün), dunkel per `prefers-color-scheme`, nur Systemschriften. Dazu:
   - Inhaltsbreite ~1040 px, Seitenrand ≥ 16 px, Textbreite 65 Zeichen
   - Links im Fließtext unterstrichen
   - Fokus-Rahmen 2 px
   - Header und Footer brechen mobil um, ohne Burger-Menü

   Astro bindet die Datei als externes Stylesheet ein, Inline-CSS gibt es nicht, die CSP passt also weiter.

4. **Gegenprobe:** Nebentext auf `#B8BCC4` (zu hell auf Weiß) → 8 Kontrasttests rot (alle Seiten in `light`). Nach dem Zurücksetzen 57 von 57 E2E grün.
5. **Lighthouse:** alle Seiten bestanden (mobil, Median aus drei Läufen, alle Kategorien ≥ 0,9).
6. **Unterbrechung:** Die Sitzung brach nach der Lighthouse-Messung ab (letzte Datei 10:09:59). Weiter ging es um 13:59, auf Bitte des Inhabers („Versuch es noch einmal“). Die Zeit dazwischen zählt nicht.
7. Lokal grün: `lint`, `format`, `typecheck`, `knip`, `depcruise`, `test`, `spellcheck`, `spec-check`, E2E (57), Lighthouse.
8. **Nach dem Review (kein 🔴):** Ungenutztes CSS entfernt (`.mono`, `code`, `--radius`, `--surface`, `--on-accent`, `--mono`). Diese Tokens aus `gestaltung.md` kommen mit ihrer ersten Verwendung (Artikel XV). Danach weiter 57 von 57 E2E-Tests grün. Zeiten und Ist von T-09 sind geschlossen.
