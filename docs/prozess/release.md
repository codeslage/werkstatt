# Branches, Umgebungen & Releases

> Status: **Freigegeben** am 2026-11-05 · Stand: 2026-11-05
> Verbindlich über `CONSTITUTION.md`, Artikel III, V und X. Änderungen nach `docs/prozess/governance.md`.

## Auf einen Blick

```
feature/…  ──PR──▶  main  ──auto──▶  dev
                     │
                     └─ Tag vX.Y.Z ─▶ Image (einmal gebaut)
                                        │
                                        ├─▶ int   (Abnahme, Tests)
                                        │
                                        └─▶ prod  (nur nach Freigabe)

hotfix/… (vom prod-Tag) ──▶ Tag vX.Y.Z+1 ──▶ int ──▶ prod
                       └──▶ derselbe Fix zurück nach main
```

## Branches

| Branch               | Zweck                                                       | Lebensdauer                      |
| -------------------- | ----------------------------------------------------------- | -------------------------------- |
| `main`               | einziger dauerhafter Branch; Stand von **dev**              | dauerhaft, geschützt             |
| `feature/<kurzname>` | Arbeit an einer Task, einem Change oder einer Mini-Änderung | bis zum Merge                    |
| `hotfix/<kurzname>`  | Fix für prod, wenn `main` nicht releasefähig ist            | bis zum Merge zurück nach `main` |

Es gibt **keine** Branches `dev`, `int` oder `prod`. Umgebungen werden über **Tags und Images** befüllt, nicht über Merges.

## Umgebungen

| Umgebung | Inhalt                      | Wie kommt etwas hin?                                                         | Zugriff                                                | Daten                                   |
| -------- | --------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------ | --------------------------------------- |
| **dev**  | aktueller `main`            | automatisch bei jedem Merge                                                  | Inhaber (Cloudflare Access)                            | Seed-/Testdaten                         |
| **int**  | Release-Kandidat (Tag)      | `/release`; wird dafür **eingeschaltet** und danach wieder **ausgeschaltet** | Inhaber, später eingeladene Tester (Cloudflare Access) | Seed-/Testdaten, nie Echtdaten aus prod |
| **prod** | freigegebenes Release (Tag) | `/release` nach Freigabe                                                     | öffentlich (soweit die App es vorsieht)                | Echtdaten                               |

- Alle drei laufen als getrennte Coolify-Umgebungen auf derselben VM, mit Ressourcen-Limits, damit dev und int prod nicht ausbremsen.
- int und prod nutzen **dasselbe Image** (gleicher Digest) und dieselbe Konfigurationsstruktur; nur Secrets, Domains und Daten unterscheiden sich.
- Der vollständige Neuaufbau der Infrastruktur (AK-6 in Phase 1) wird separat und seltener getestet.

## Merge-Regel nach `main` (= dev)

Ein PR wird **automatisch** gemergt und nach dev deployt, wenn:

1. die CI grün ist,
2. das Review des Agents `code-reviewer` keine offenen 🔴-Befunde hat,
3. bei Klasse K die Change-Seite freigegeben ist.

Ausnahme: Änderungen an `CONSTITUTION.md` und `docs/prozess/` brauchen immer die Freigabe des Inhabers.

## Release (`/release`)

1. **Auslöser:** Ein Vorhaben hat SDD-Stufe 7 erreicht, oder der Inhaber will Changes bündeln.
2. **Freigabe 1 – Release-Kandidat:** Inhaber bestätigt Version und Inhalt (Changelog).
3. Tag `vX.Y.Z` auf `main`, Image wird **einmal** gebaut.
4. int einschalten, Image deployen, Migrationen ausführen, E2E-, Härtungs- und Smoke-Tests laufen lassen.
5. **Abnahme auf int** durch den Inhaber (= SDD-Stufe 7).
6. **Freigabe 2 – prod:** Inhaber gibt frei → dasselbe Image nach prod, Smoke-Tests auf prod.
7. int ausschalten, Changelog und Soll/Ist aktualisieren.

Versionen folgen SemVer: MAJOR = inkompatible Änderung für Nutzer, MINOR = neue Funktion, PATCH = Fix.

## Hotfix (`/hotfix`)

Zuerst die Frage: **Ist `main` gerade releasefähig?**

| Antwort  | Weg                                                                                                                                                                                                   |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **ja**   | Fix normal über `feature/…` nach `main`, dann `/release` als PATCH.                                                                                                                                   |
| **nein** | `hotfix/…` vom aktuellen prod-Tag, Fix, Tag `vX.Y.Z+1`, int → prod wie beim Release. **Danach derselbe Fix sofort nach `main`** (eigener PR), sonst kehrt der Fehler mit dem nächsten Release zurück. |

In beiden Fällen: Klasse **K** (`aenderungsklassen.md`), zuerst ein Test, der den Fehler zeigt, Review-Agent, beide Freigaben. Bei einem akuten Notfall darf die Change-Seite nachgezogen werden.

## Rückweg

- **Code:** vorheriges Release-Image erneut nach prod deployen (Coolify-Rollback), danach Fix nach vorn.
- **Datenbank:** Migrationen, die Daten löschen oder umbauen, sind zerstörerische Aktionen (Artikel V) und brauchen eine eigene Freigabe; vorher wird ein Backup gezogen.

## Für Kundenprojekte

Häufige kleine Releases sind risikoarm, können Nutzer aber überraschen („Mein Knopf ist weg“). Pro Kundenprojekt werden deshalb in der Projekt-Spec festgelegt: Release-Rhythmus, Release Notes für Nutzer, Ankündigung sichtbarer Änderungen und ggf. Feature-Flags.
