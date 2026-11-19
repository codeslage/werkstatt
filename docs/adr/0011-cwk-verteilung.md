# ADR 0011 – CodeslageWerkzeugKasten: Quelle, Manifest, wiederverwendbare Workflows, Sync-PR

> Status: **Vorgeschlagen** · Stand: 2026-11-19
> Bezug: `specs/05-projekt-plattform/spec.md` (AK-1 bis AK-9, AK-25, AK-27), `plan.md`, `docs/prozess/governance.md` (Geltungsbereich), Constitution Artikel XIII und XV

## Kontext

Jedes Repo der Organisation soll den CodeslageWerkzeugKasten (CWK) haben: Regeln, Vorlagen, Claude-Befehle und Prüfungen. Er wird zentral gepflegt, und Änderungen kommen per PR in jedes Projekt. Projekte dürfen ergänzen, aber nicht abschwächen. `werkstatt` soll dieselben Prüfungen nutzen wie die Projekte, damit nichts auseinanderläuft.

## Optionen

|                                 | Kopie per Template + Sync-PR, Prüfungen als wiederverwendbare Workflows | npm-Paket mit Konfiguration und CLI        | Git-Submodule                   |
| ------------------------------- | ----------------------------------------------------------------------- | ------------------------------------------ | ------------------------------- |
| Repos ohne Code (`internal`)    | ✅ nur Dateien und Workflow-Aufruf                                      | ❌ braucht `package.json` und Installation | ✅                              |
| Änderung sichtbar im Projekt-PR | ✅ Diff der Dateien                                                     | ⚠️ nur Versionssprung                      | ⚠️ nur Commit-Zeiger            |
| Claude liest Regeln im Repo     | ✅ Dateien liegen im Repo                                               | ⚠️ in `node_modules`                       | ⚠️ erst nach `submodule update` |
| Zusätzliche Infrastruktur       | keine (GitHub)                                                          | Registry (GitHub Packages)                 | keine                           |

## Entscheidung

- **Quelle ist `werkstatt`.** `cwk/manifest.json` listet jede CWK-Datei mit Quelle, Ziel, Teil (`rules`/`code`) und Art (`exact`/`extendable`). Dateien, die es nur für Projekte gibt, liegen unter `cwk/files/`. Die Version des CWK ist der Commit von `werkstatt`.
- **Prüfungen als wiederverwendbare Workflows** `cwk-rules.yml` und `cwk-code.yml`. Projekte rufen sie über einen auf einen Commit gepinnten Verweis auf. In den Quelldateien steht dafür der Platzhalter `@CWK_REF`, den der Sync durch den Commit aus `cwk.json` ersetzt; `cwk check` verlangt, dass beide übereinstimmen. `werkstatt` ruft die Workflows lokal auf. Einziger Pflicht-Check im Ruleset ist der Sammel-Job `ci-ok`, so dass neue Jobs keine Änderung an den Rulesets der Projekte brauchen. Die Tools (`spec-check`, `public-scan`, `cwk`) holt der Workflow aus `werkstatt`; Projekte installieren sie nicht.
- **Verteilung:** Ein neues Repo entsteht aus dem Template-Repo `codeslage/project-template` (`cwk new`). Änderungen kommen per Sync-PR auf dem Branch `cwk/sync`, höchstens einer je Repo, ohne Force-Push.
- **Ergänzungen** nur in markierten Projektblöcken (`cwk:project:start` … `cwk:project:end`). `cwk check` vergleicht alles andere mit dem Stand aus `cwk.json` und wird bei jeder Abweichung rot.
- **Festlegungen je Repo** in `cwk.json`: Stand (`cwk`), `code`, `docs`.

## Folgen

- Doppelte CI-Definitionen entfallen: `werkstatt` und alle Projekte nutzen dieselben Jobs.
- Projektspezifische Inhalte in CWK-Dateien gehen nur über Projektblöcke. Wer mehr braucht, ändert den CWK in `werkstatt` (für alle).
- Werkzeug-Versionen (ESLint, Prettier …) stehen weiter in der `package.json` jedes Projekts mit Code und werden per Dependabot aktualisiert.
- Ein npm-Paket bleibt eine Option, wenn Projekte Code aus `packages/` brauchen (Spec, Nicht im Umfang).
