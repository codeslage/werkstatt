# Code-Review

> Status: **Freigegeben** am 2026-11-05 · Stand: 2026-11-05
> Verbindlich über `CONSTITUTION.md`, Abschnitt „Verbindliche Prozesse“. Gilt für jeden PR und für SDD-Stufe 7 (Verify).

## Ziel

Ein Review stellt sicher, dass ein PR **genau das** tut, was Spec und Task verlangen, und dabei keine Constitution-Regel verletzt. Weil der Inhaber den Code nicht selbst liest, ist das Review so aufgebaut, dass er die **Ergebnisse** beurteilen kann, nicht den Code.

## Drei Ebenen

| Ebene | Wer | Was | Ergebnis |
|---|---|---|---|
| 1. Automatisch | CI | Lint, Typecheck, Tests, Secret-Scan, Code-Qualität (XV), Spec-Check | grün/rot – rot blockiert immer |
| 2. KI-Review | **Agent `code-reviewer`** (`.claude/agents/code-reviewer.md`) mit eigenem, frischem Kontext | die Checkliste unten | Befundliste mit Schweregrad als Review-Datei (siehe unten) |
| 3. Mensch | Inhaber | Zusammenfassung, Blocker, Verhalten auf int | Abnahme und prod-Freigabe beim Release (`release.md`) |

Die Trennung bei Ebene 2 ist wichtig: Wer den Code geschrieben hat, übersieht die eigenen Annahmen. Deshalb gilt für den Agent:
- Er startet ohne den Gesprächsverlauf der schreibenden Sitzung.
- Er bekommt **nur** Branch/PR und Vorhaben genannt und liest Spec, Plan, Tasks und Diff selbst. Wertungen des Aufrufers („ist eigentlich fertig“) ignoriert er.
- Er arbeitet nur lesend und ändert nichts.
- Behoben werden die Befunde von der schreibenden Sitzung. Danach läuft das Review erneut.

### Wo das Review landet

Der Agent schreibt nicht selbst. Die aufrufende Sitzung übernimmt seine Ausgabe **unverändert**:

| Klasse (`aenderungsklassen.md`) | Ablage |
|---|---|
| V – Vorhaben | `specs/NN-name/reviews/T-xx.md` (bei mehreren Durchläufen: `T-xx-2.md` …) |
| K – Kleine Änderung | Abschnitt „Review“ der Change-Seite in `changes/` |
| M – Mini | Zusammenfassung in der PR-Beschreibung |

So kann die Retro die Reviews auswerten (z. B. „welche Befunde kamen wiederholt?“).

### Später: Review per GitHub Action

Vorerst nicht nötig, weil der Agent fest im SDD-Ablauf und in `/change` eingeplant ist. Einführen, sobald einer dieser Fälle eintritt:
- mehrere Personen arbeiten im Repo, oder jemand arbeitet ohne KI,
- PRs entstehen ohne Claude-Sitzung (z. B. über die GitHub-Weboberfläche),
- die Retro zeigt, dass ein Review lokal ausgelassen wurde.

## Checkliste (Ebene 2, wird vom Agent abgearbeitet)

| # | Prüfpunkt | Artikel |
|---|---|---|
| 1 | **Auftrag:** Jede Änderung gehört zu einer Task/einem AK. Nichts darüber hinaus, nichts fehlt. | I, XV |
| 2 | **Korrektheit:** Logik, Randfälle, leere/ungültige Eingaben, Fehlerpfade | II, XVI |
| 3 | **Tests:** decken das AK ab, prüfen Verhalten statt Implementierung, wurden nicht abgeschwächt | II |
| 4 | **Eingaben:** alles von außen (inkl. KI-Antworten) wird per Schema validiert | VII |
| 5 | **Sicherheit:** keine Secrets, Rechteprüfung vorhanden, Least Privilege, nichts Admin-artiges öffentlich; im öffentlichen Repo nichts aus der Liste „Öffentlich vs. intern“ (`governance.md`) | VI, VII, VIII |
| 6 | **Datenschutz:** personenbezogene Daten nur zweckgebunden, nicht in Logs, Dienstleister erfasst | VIII |
| 7 | **Mensch im Loop:** KI-Ausgaben an Kunden/Öffentlichkeit nur nach Freigabe, Kostenlimit gesetzt | IX |
| 8 | **Zerstörerisches:** Löschende Migrationen, `destroy`, Daten-Löschungen sind markiert und freigegeben | V |
| 9 | **Code-Qualität:** kein toter Code, klare Modulgrenzen, lesbar, Überflüssiges entfernt | XV |
| 10 | **Abhängigkeiten:** neue Pakete begründet, gepflegt, Lizenz passt | XI |
| 11 | **Fehler:** nichts verschluckt, Logs ohne sensible Daten, kritische Fehler melden sich | XVI |
| 12 | **Doku:** Specs, Doku und Runbooks im selben PR aktualisiert | XII |

## Schweregrade

| Grad | Bedeutung | Folge |
|---|---|---|
| 🔴 **Blocker** | Fehlverhalten, Sicherheits- oder Datenschutzproblem, Constitution-Verstoß | muss vor dem Merge behoben werden |
| 🟡 **Sollte** | Qualitätsmangel ohne akutes Risiko | im selben PR beheben oder als Issue mit Begründung |
| ⚪ **Hinweis** | Geschmack, kleine Verbesserung | optional |

Jeder Befund nennt **Datei/Zeile** und einen **konkreten Fehlerfall** („bei Eingabe X passiert Y“). Befunde ohne Beleg zählen nicht.

## Merge-Regel

Gilt nach `docs/prozess/release.md`. Kurz:
- **Nach `main` (= dev):** automatisch, wenn die CI grün ist, das Review keine offenen 🔴-Befunde hat und bei Klasse K die Change-Seite freigegeben ist. Änderungen an `CONSTITUTION.md` und `docs/prozess/` brauchen immer die Freigabe des Inhabers.
- **Nach prod:** nur über `/release` mit Abnahme auf int und Freigabe des Inhabers.

## Was der Inhaber prüft (Ebene 3)

Ohne Code zu lesen:
- Passt die **Zusammenfassung** des PRs zur Task?
- Sind alle 🔴 erledigt, sind die 🟡 sinnvoll entschieden?
- **Verhalten:** Funktioniert es in der Vorschau oder Demo so, wie die Spec es beschreibt?
- Bei 🔴 in Sicherheit, Datenschutz oder Löschungen: Erklärung in einfachen Worten verlangen.
