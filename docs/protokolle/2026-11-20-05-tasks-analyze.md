# Protokoll 05, Stufen 4 und 5 (Tasks, Analyze): Projekt-Plattform

> Datum: 2026-11-20 · Vorhaben: `specs/05-projekt-plattform/` · Stufen: 4 Tasks, 5 Analyze · PR: #57

1. Start durch den Inhaber („Ja, Stufe 4“). Branch `feature/projekt-plattform-tasks` vom aktuellen `main`, Arbeitsverzeichnis sauber.
2. `tasks.md`: Plan v4 in Tasks zerlegt, je Plan-Schritt ein PR, je Task AK, Test, Abhängigkeiten und Soll; ⛔ bei neuen öffentlichen Repos, Rulesets, `tofu apply` und Prozessdokumenten, 👤 bei Konten und Tokens.
3. Analyse direkt danach: alle 26 gültigen AKs mit Task und Test (per Skript geprüft). Fünf Lücken, vier davon behoben, darunter die Ausnahme für private Repos in AK-4 und AK-7 nach P1/P5. Offen beim Inhaber: Roadmap-Soll.
4. Review durch `code-reviewer`: ❌, 3 × 🔴, 6 × 🟡, 3 × ⚪. Die 🔴 waren ein Testfall aus Plan v3, `internal` erst in PR-8 und die Vorlage ohne Rulesets. Alle Befunde sind umgesetzt, es gibt drei neue Tasks (T-45 bis T-47), und die Doku entsteht jetzt im jeweiligen PR. Plan v4.1 korrigiert einen Satz aus v3 und nennt die Probe-Dateien; der Ansatz ist unverändert. Bericht wörtlich mit Nachtrag in `specs/05-projekt-plattform/reviews/tasks-review.md`.
5. Ergebnis: 47 Tasks, Soll 58,25 h. Offen beim Inhaber: Bestätigung von AK-4 und AK-7 (Spec-Änderung) und Entscheidung zum Roadmap-Soll („~1 Woche“).
6. Review 2. Durchgang: ✅ mergebar, kein 🔴, 3 × 🟡, 2 × ⚪, alle umgesetzt (Plan v4.1 an die Tasks angeglichen, Repo-Einstellungen in `werkstatt` bis T-08, T-40 nach T-19). Gate „keine offenen Lücken“ erfüllt. Bestätigung von AK-4/AK-7 und Entscheidung zum Roadmap-Soll beim Inhaber angefragt.
7. Antworten des Inhabers: AK-4 und AK-7 bestätigt; Roadmap-Soll für Phase 1.5 auf ≈ 58 h (~3 Wochen) korrigiert. Merge nach grüner CI.
