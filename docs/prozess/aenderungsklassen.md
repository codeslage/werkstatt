# Änderungsklassen

> Status: **Freigegeben** am 2026-11-05 · Stand: 2026-11-05
> Verbindlich über `CONSTITUTION.md`, Artikel I. Änderungen nach `docs/prozess/governance.md`.

## Ziel

Der Prozessaufwand richtet sich nach dem **Risiko** einer Änderung, nicht nach ihrer Größe. Ein einzelnes Wort in einer Firewall-Regel kann riskanter sein als hundert Zeilen Text. Jede Änderung wird nachvollziehbar dokumentiert, aber keine Änderung durchläuft mehr Prozess als nötig.

## Die drei Klassen

| Klasse | Typische Beispiele | Prozess | Doku | Freigabe |
|---|---|---|---|---|
| **M – Mini** | Tippfehler, Texte, Abhängigkeits-Updates (Renovate), Refactoring ohne Verhaltensänderung | CI + Review-Agent | PR-Beschreibung (Was/Warum) + Changelog-Eintrag | keine (Auto-Merge nach dev) |
| **K – Kleine Änderung** | Bugfix, Hotfix, kleine Infra-Änderung (Firewall-Regel, DNS-Eintrag, TTL), Konfiguration mit Wirkung auf Sicherheit/Daten | Change-Seite → Test → Umsetzung → CI + Review-Agent | `changes/JJJJ-MM-TT-name.md` (Vorlage `specs/_vorlagen/change.md`), bei Infra mit `tofu plan`-Auszug | **eine** Freigabe des Inhabers auf der Change-Seite |
| **V – Vorhaben** | neues Feature, neue Komponente, neue AKs, mehr als ca. ein Tag Aufwand | voller SDD-Ablauf (`sdd-ablauf.md`) | Spec, Plan, Tasks, Reviews, Retro | Gates laut SDD-Ablauf |

Befehle: M braucht keinen eigenen Befehl, K läuft über `/change`, V über `/sdd-specify` ff., Hotfixes über `/hotfix`.

## Einstufung

1. Claude schlägt die Klasse vor und begründet sie in einem Satz.
2. Der Inhaber darf jederzeit **hochstufen**, Claude darf nie selbst herunterstufen.
3. Feste Untergrenzen:
   - Alles, was **Infrastruktur, Sicherheit, Auth, personenbezogene Daten oder Löschungen** berührt, ist **mindestens K**.
   - Alles mit **neuen Akzeptanzkriterien** oder neuem Verhalten für Nutzer ist **V**.
4. Stellt sich während der Arbeit heraus, dass die Klasse zu niedrig war: anhalten, hochstufen, im neuen Prozess weitermachen.

## Was in jeder Klasse gilt

Die Klassen verkürzen den **Prozess**, nie die Grundsätze:
- Tests beweisen die Änderung (Artikel II) – bei Bugfixes zuerst ein Test, der den Fehler zeigt.
- Review-Agent läuft immer (`code-review.md`).
- Keine Secrets, keine zerstörerischen Aktionen ohne Freigabe (Artikel V, VI).
- Doku im selben PR (Artikel XII).

## Notfall-Änderungen

Bei einem akuten Fehler in prod darf eine K-Änderung deployt werden, **bevor** die Change-Seite vollständig ist. Test, Review-Agent und die Freigabe des Inhabers bleiben Pflicht. Die Change-Seite wird innerhalb eines Arbeitstags vervollständigt. Ablauf über `/hotfix` (`release.md`).
