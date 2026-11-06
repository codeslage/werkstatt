# 04 – Phase 1 Fundament: Zeitprotokoll

> Bezug: `tasks.md` (Spalte Ist), Constitution Artikel XIV, Roadmap (Soll/Ist-Wette)

Methode (festgelegt am 2026-11-05):
- **Start:** Claude beginnt die Task (Zeitstempel aus der Systemuhr).
- **Ende:** Die Task ist fertig, also Test grün bzw. Protokoll geschrieben.
- Wartezeit auf den Inhaber (Freigaben, Schritte 👤) zählt mit, so wie in einem echten Projekt; sie wird in der Bemerkung genannt.
- Pausen zwischen Sitzungen zählen nicht: Eine Task kann mehrere Zeilen haben.
- Die Summe pro Task wird auf Viertelstunden gerundet (mindestens 0,25 h) und in `tasks.md` als Ist eingetragen. Für die Auswertung in der Retro zählen die genauen Minuten aus dieser Tabelle.

| Task | Start | Ende | Dauer | Bemerkung |
|---|---|---|---|---|
| T-01 | 2026-11-05 15:39 | 2026-11-05 15:57 | 0:18 | nachgetragen aus Dateizeiten (Roadmap-Eintrag → Protokoll); enthält Wartezeit auf die Installation durch den Inhaber |
| T-02 | 2026-11-05 16:30 | 2026-11-05 16:31 | 0:01 | Ignorier-Regeln vorab per `git check-ignore` geprüft; der automatisierte Test folgt mit T-03 |
| T-03 | 2026-11-05 16:33 | 2026-11-05 16:33 | 0:00 | 12 Tests rot wie erwartet (CLI fehlt noch), 7 grün (.gitignore aus T-02) |
| T-04 | 2026-11-05 16:34 | 2026-11-05 16:36 | 0:02 | Regeln + CLI (Sperrliste per GITLEAKS_CONFIG_TOML); alle 19 Tests im ersten Lauf grün |
| T-05 | 2026-11-05 16:36 | 2026-11-05 16:37 | 0:01 | Hook + prepare-Skript; 5 Hook-Tests erst rot, dann grün (25/25) |
| T-06 | 2026-11-05 16:37 | 2026-11-05 16:37 | 0:00 | ci.yml mit gepinnten Actions (SHA) und gitleaks-Prüfsumme; Lauf erst nach dem Push (T-09) prüfbar, Negativtest in T-11 |
| T-07 | 2026-11-05 16:37 | 2026-11-05 16:38 | 0:01 | secrets.md, kosten.md, dsgvo.md als Gerüst; AVV-Prüfung offen beim Inhaber (bis T-43) |
| T-08 | 2026-11-05 16:38 | | | |
