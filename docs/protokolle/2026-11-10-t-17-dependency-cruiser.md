# Protokoll T-17: dependency-cruiser für Zyklen und Modulgrenzen

> Datum: 2026-11-10 · Task: T-17 · AK: AK-18 · PR: codeslage/werkstatt#11

## Ablauf

1. dependency-cruiser 18.7.2 installiert. `pnpm-workspace.yaml` geprüft: keine Ausnahme von der Wartezeit.
2. Test **vor** der Konfiguration geschrieben: **rot** (5 Tests, Konfigurationsdatei fehlt).
3. `.dependency-cruiser.json` mit den Regeln `no-circular` und `packages-nicht-nach-oben`. Die Tests nutzen die echte Repo-Konfiguration.
4. **Fund Exit-Code:** Mit `--output-type json` meldet dependency-cruiser zwar Verstöße, endet aber mit Exit 0. `text` endet ebenfalls mit 0. Nur `err` liefert Exit 1. Deshalb legen Skript `pnpm depcruise` und Test `err` ausdrücklich fest.
5. **Gegenprobe:** Ohne die Regel `no-circular` wird der Zyklus-Test rot. Beim Wiederherstellen hat `git checkout` die noch ungetrackte Datei nicht zurückgeholt, sie wurde von Hand neu geschrieben und geprüft.
6. **Fund versteckter Fehler:** Zwischendurch ließ sich die Testdatei nicht laden (`package.json` von dependency-cruiser ist nicht exportiert). „Tests 41 passed“ sah grün aus, nur „Test Files 1 failed“ zeigte den Fehler. Lösung: Pfad über `import.meta.resolve`, das knip auch als Nutzung der Abhängigkeit erkennt. **Lehre:** immer „Test Files“ und „Tests“ prüfen.
7. Ergebnis: 5 Testdateien / 46 Tests grün, `lint`, `typecheck`, `knip`, `depcruise` mit Exit 0, alle fünf CI-Jobs grün.
8. Ruleset `main-schutz`: Pflicht-Checks sind jetzt **„Secret- und Öffentlich-Scan“, „Typecheck“, „Lint“, „Knip“, „Modulgrenzen“**.
