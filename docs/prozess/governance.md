# Governance

> Status: **Freigegeben** am 2026-11-05 · Stand: 2026-11-27 (CWK-Sync automatisch nur in öffentliche Repos; Scan in privaten Repos nur auf Secrets, Plan 05); 2026-11-18 (lokaler Pfad zu `codeslage/internal` für den Mac)
> Verbindlich über `CONSTITUTION.md`, Abschnitt „Verbindliche Prozesse“.

## Rangfolge

**Constitution > Prozessdokumente (`docs/prozess/`) > Spec > Plan > Tasks > Code**

Bei Widersprüchen gilt das höhere Dokument. Der Widerspruch wird behoben, nicht geduldet.

## Änderungen

| Was                        | Wie                                                   | Freigabe              |
| -------------------------- | ----------------------------------------------------- | --------------------- |
| Constitution               | PR mit Begründung, Version und Stand im Kopf anpassen | Inhaber, ausdrücklich |
| Prozessdokumente           | PR mit Begründung                                     | Inhaber               |
| Vorlagen, `/sdd-*`-Befehle | PR, Bezug auf das Prozessdokument, das sie umsetzen   | Inhaber               |

Änderungsvorschläge entstehen meist in der Retro (SDD-Stufe 8) und werden dort festgehalten.

## Versionierung der Constitution

- **MAJOR:** Artikel gestrichen oder grundlegend geändert
- **MINOR:** Artikel neu oder erweitert, Prozess neu ausgelagert
- **PATCH:** nur Formulierung

Nach einer Änderung werden die Constitution-Bezüge (`vX.Y.Z`) in offenen Specs und Plänen geprüft. Bei MAJOR- und MINOR-Änderungen wird der Constitution-Check laufender Vorhaben neu bewertet.

## Geltungsbereich

- Gilt für alle Repos der Organisation `codeslage` (auch `codeslage/internal`) und für alle KI-Sitzungen darin.
- Projekt-Repos übernehmen Constitution und Prozessdokumente aus der Projekt-Vorlage. Öffentliche Repos werden bei Änderungen automatisch per Sync-PR aktualisiert. In private Repos rollt der Inhaber selbst aus (`cwk sync --private`, Runbook `cwk-sync.md`), weil GitHub Free sie nicht schützen kann (Plan 05, P1).
- Projektspezifische Ergänzungen sind erlaubt, Abschwächungen nicht.

## Öffentlich vs. intern

Öffentliche Repos (z. B. `codeslage/werkstatt`) enthalten **nie**:

- Secrets, Tokens, Passwörter, private Schlüssel
- IP-Adressen und Hostnamen von Servern (außer den öffentlichen Domains)
- persönliche Kontaktdaten (E-Mail-Adressen, Telefonnummern, Anschriften) – ausgenommen sind Rollenadressen, die ausdrücklich öffentlich sein sollen
- Angaben zu Konten: Kontonamen oder -IDs, Registrar, Zugangswege
- persönliche Rahmenbedingungen: Arbeitgeber, private Finanzen

Diese Angaben gehören nach `codeslage/internal` (lokal `~/Developer/codeslage/internal`), z. B. `betrieb/konten.md`.

**Geprüft wird dreifach** – jede Ebene allein muss den Verstoß finden können:

| #   | Ebene            | Wann                              | Wie                                                                                  |
| --- | ---------------- | --------------------------------- | ------------------------------------------------------------------------------------ |
| 1   | **Lokal**        | vor jedem Commit                  | Pre-Commit-Hook: gitleaks + eigene Regeln (IP-Adressen, E-Mail-Adressen, Sperrliste) |
| 2   | **CI**           | bei jedem PR, blockiert den Merge | dieselben Regeln; die Sperrliste kommt aus einem GitHub Secret                       |
| 3   | **Review-Agent** | bei jedem PR                      | Checklistenpunkt 5 in `code-review.md`                                               |

Zusätzlich: **Scan der gesamten Git-Historie** vor dem ersten Veröffentlichen eines Repos und danach monatlich.

**Private Repos** (z. B. `codeslage/internal`) enthalten Internes mit Absicht. Dort sucht Ebene 2 nur nach Secrets, ohne eigene Regeln und ohne Sperrliste (Plan 05). Wird ein privates Repo öffentlich, gilt vorher der Scan der gesamten Historie mit allen Regeln und der Sperrliste.

Die **Sperrliste** (konkrete Begriffe wie Kontonamen oder der Registrar) ist selbst vertraulich: Sie liegt lokal in einer gitignorierten Datei und in der CI als Secret, nie im öffentlichen Repo.

Wird trotzdem etwas veröffentlicht: Secret sofort widerrufen bzw. neu erzeugen. Aus der Historie entfernen bringt danach nur noch wenig, denn was öffentlich war, gilt als bekannt.

## Prüfung

| Wo              | Was                                                                                             |
| --------------- | ----------------------------------------------------------------------------------------------- |
| Specs und Pläne | Constitution-Check mit allen Artikeln                                                           |
| PRs             | Checkliste im PR-Template, Code-Review nach `code-review.md`                                    |
| CI              | Pflichtabschnitte der Specs, Secret- und Öffentlich-Scan (s. o.), Code-Qualität nach Artikel XV |
