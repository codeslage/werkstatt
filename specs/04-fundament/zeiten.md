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
| T-08 | 2026-11-05 16:38 | 2026-11-05 16:39 | 0:01 | Scan des Arbeitsstands ohne Sperrliste; Pause bis zur Sperrliste des Inhabers (zählt nicht) |
| T-08 | 2026-11-06 10:22 | 2026-11-06 10:27 | 0:05 | Rohfassung Sperrliste, Entscheidungen Registrar und Commit-Name, Bootstrap-Commit lokal, Historien-Scan 0 Funde |
| T-09 | 2026-11-06 10:26 | 2026-11-06 10:28 | 0:02 | Veröffentlichung vorbereitet, Freigabe angefragt; danach Pause bis zur Antwort (zählt nicht) |
| T-09 | 2026-11-06 17:14 | 2026-11-06 17:30 | 0:16 | Namensentscheidung (werkstatt) umgesetzt, Repo öffentlich angelegt, 3 Commits gepusht |
| T-10 | 2026-11-06 17:30 | 2026-11-06 17:51 | 0:21 | Ruleset main-schutz aktiv und öffentlich lesbar; Secret durch Inhaber gesetzt (Wartezeit enthalten); CI erst rot ohne Sperrliste, nach Rerun grün; Direkt-Push auf main abgelehnt |
| T-11 | 2026-11-06 17:53 | 2026-11-06 17:56 | 0:03 | Kanarienbegriff + Secret (Inhaber), Wegwerf-PR 1: CI rot mit 3 Funden, Review-Agent 3× 🔴; PR geschlossen, Branch gelöscht |
| T-12 | 2026-11-06 17:56 | 2026-11-06 17:57 | 0:01 | Anleitung für den Test in neuer Sitzung; danach Pause bis zur Antwort (zählt nicht) |
| T-12 | 2026-11-10 11:08 | 2026-11-10 11:12 | 0:04 | Antworten ausgewertet (⚠️ AK-17 teilweise), Änderung der Testsitzung gesichert, Protokoll |
| T-12 | 2026-11-10 11:22 | | | |
