---
description: "Release-Kandidat taggen, über int abnehmen lassen und nach prod bringen"
argument-hint: "[Version, z. B. v0.3.0]"
---
Release gemäß `docs/prozess/release.md`.

Version (optional): $ARGUMENTS

1. Prüfe: `main` ist grün, keine offenen 🔴-Reviews, alle enthaltenen Vorhaben stehen mindestens in SDD-Stufe 7. Zeige den Inhalt seit dem letzten Tag (Changelog-Entwurf) und schlage eine SemVer-Version vor.
2. **Freigabe 1:** Inhaber bestätigt Version und Inhalt. Ohne Bestätigung abbrechen.
3. Tag setzen, Image einmal bauen lassen.
4. int einschalten, Image deployen, Migrationen ausführen, E2E-, Härtungs- und Smoke-Tests ausführen und Ergebnisse zeigen. Löschende Migrationen gesondert freigeben lassen (Artikel V).
5. Inhaber zur **Abnahme auf int** auffordern (Link nennen, was ausprobiert werden soll).
6. **Freigabe 2:** Erst nach ausdrücklicher Freigabe dasselbe Image nach prod deployen, Smoke-Tests auf prod.
7. int ausschalten, Changelog finalisieren, Soll/Ist in `specs/03-roadmap.md` bzw. Retro aktualisieren.
