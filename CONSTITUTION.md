# codeslage – Constitution

> Version: **1.1.0** · Status: **Freigegeben** am 2026-11-05 · Stand: 2026-11-05
> Diese Constitution gilt für **alle** codeslage-Repos, Specs, Pläne, PRs und KI-Sitzungen.
> Rangfolge bei Widersprüchen: **Constitution > Prozesse > Spec > Plan > Tasks > Code** (siehe `docs/prozess/governance.md`).

Die Artikel sind kurz und überprüfbar. Jede Spec und jeder Plan enthält einen **Constitution-Check**, der jeden Artikel mit ✅ (erfüllt), ⚠️ (Abweichung, begründet) oder – (nicht relevant) bewertet.

---

## I. Spec zuerst

Kein Vorhaben (Code oder Infrastruktur) ohne freigegebene Spec. Jedes Vorhaben durchläuft den **SDD-Ablauf** (`docs/prozess/sdd-ablauf.md`); keine Stufe wird übersprungen. Wie viel Prozess eine Änderung braucht, richtet sich nach ihrem Risiko (`docs/prozess/aenderungsklassen.md`); dokumentiert wird jede Änderung.

## II. Tests beweisen die Spec

Jedes Akzeptanzkriterium wird durch einen Test abgedeckt, automatisiert wo möglich, sonst als dokumentierter manueller Test. Tests werden vor oder mit dem Code geschrieben, nicht danach. Fertig ist etwas erst, wenn die Tests grün sind, nicht wenn der Code geschrieben ist.

**Tests nicht abschwächen, um grün zu werden:** Ein fehlschlagender Test wird nicht gelöscht, übersprungen, auskommentiert oder aufgeweicht, damit die CI grün wird. Zuerst wird der Code korrigiert. Ist der Test selbst falsch, wird die Änderung im PR begründet und auf das betroffene AK zurückgeführt.

## III. Kleine, überprüfbare Schritte

Ein PR = eine oder wenige Tasks = ein überprüfbares Ergebnis. `main` ist geschützt und wird nur per PR geändert.

## IV. Fragen statt raten

Bei Unklarheiten wird nachgefragt. Annahmen werden in der Spec als offene Frage oder als Annahme markiert. Blockierende Fragen werden vor dem Plan geklärt.

## V. Keine zerstörerischen Aktionen ohne ausdrückliche Bestätigung

Löschen von Servern, Datenbanken, Volumes, Buckets oder DNS-Einträgen, `tofu destroy`, Force-Push, History-Rewrite: immer erst nach ausdrücklicher Freigabe des Inhabers für genau diese Aktion. Vorher wird gezeigt, was betroffen ist.

## VI. Secrets gehören nie ins Repo

Secrets liegen in `.env` (gitignored), in GitHub Secrets oder in Coolify. Jedes Repo hat eine `.env.example` ohne echte Werte und einen Secret-Scan in der CI.

## VII. Sicher als Standard

Least Privilege für jeden Token und Dienst. Admin-Oberflächen und SSH sind nie öffentlich erreichbar. 2FA auf allen Konten. Updates für Sicherheitslücken laufen automatisch.

**Eingaben an Systemgrenzen validieren:** Alles, was von außen kommt, wird vor der Verarbeitung gegen ein Schema geprüft: Formulare, API-Aufrufe, Webhooks, Dateien und auch **KI-Antworten**. Ungültiges wird abgelehnt, nicht „repariert“.

## VIII. Datenschutz & EU

Personenbezogene Daten liegen in der EU. Jeder Dienstleister, der Daten verarbeitet, ist in `docs/dsgvo.md` erfasst. Daten werden nur zweckgebunden erhoben und haben eine definierte Löschfrist.

## IX. Mensch im Loop

KI erstellt Entwürfe, ein Mensch gibt frei. Nichts, was eine KI erzeugt hat, geht ohne menschliche Freigabe an Kunden oder die Öffentlichkeit. KI-Aufrufe haben Kostenlimits und werden protokolliert.

## X. Reproduzierbar

Infrastruktur entsteht per Code (IaC). Was nicht als Code geht, steht als Runbook in `docs/runbooks/`. Klicks ohne Doku gelten als Fehler. Backups gelten erst, wenn der Restore getestet ist.

## XI. Einfach vor vollständig

Gebaut wird, was jetzt gebraucht wird, nicht was vielleicht einmal gebraucht wird. Ein neues Tool oder Paket muss einen konkreten Bedarf und einen Platz im Budget haben.

**Abhängigkeiten bewusst wählen:** Jede neue Abhängigkeit wird im PR begründet. Sie muss aktiv gepflegt sein und eine Lizenz haben, die eigene und kommerzielle Nutzung erlaubt. Versionen sind über das Lockfile festgeschrieben, Updates laufen automatisiert per PR. Was sich mit wenigen Zeilen eigenem Code lösen lässt, braucht kein Paket.

## XII. Offen dokumentieren

Öffentlich ist der Standard, privat die begründete Ausnahme. Jede Architekturentscheidung bekommt ein ADR. Jede Phase liefert Rohmaterial für Case Studies, Talks und Podcast (`docs/content/`).

**Doku im selben PR:** Ändert sich Verhalten, Schnittstelle oder Betrieb, werden die betroffenen Specs, Doku-Seiten und Runbooks im selben PR angepasst. Ein PR mit veralteter Doku ist nicht fertig.

## XIII. Wiederverwendbare Bausteine

Bausteine werden so gekapselt, dass sie in Kundenprojekten wiederverwendbar sind: klare Schnittstellen, keine codeslage-spezifischen Annahmen im Kern.

## XIV. Messen statt schätzen

Geschätzte und tatsächliche Zeiten werden festgehalten (Soll/Ist), ebenso die Kosten. Entscheidungen stützen sich auf Daten, wo es welche gibt.

## XV. Kein unnötiger Code, kein Spaghetti-Code

Jede Zeile Code lässt sich auf eine Task und damit auf ein Akzeptanzkriterium zurückführen. Darüber hinaus gilt:

- **Kein toter Code:** keine ungenutzten Exporte, Dateien oder Abhängigkeiten, keine auskommentierten Blöcke, keine „für später“-Abstraktionen.
- **Klare Struktur:** ein Modul hat eine Aufgabe. Abhängigkeiten zeigen nur in erlaubte Richtungen (Apps → Pakete, nie umgekehrt), keine zyklischen Imports.
- **Lesbar vor clever:** sprechende Namen, kurze Funktionen, geringe Verschachtelung. Kommentare erklären das _Warum_, nicht das _Was_.
- **Wiederholung bewusst:** Duplikate werden spätestens beim dritten Vorkommen zusammengeführt, nicht vorsorglich beim ersten.
- **Maschinell geprüft:** Linter-Regeln für Komplexität und Größe, Erkennung von ungenutztem Code und Abhängigkeiten sowie Prüfung der Modulgrenzen laufen in der CI und brechen den Build bei Verstößen.
- **Aufräumen gehört dazu:** Was durch eine Änderung überflüssig wird, wird im selben PR entfernt.

## XVI. Fehler sind sichtbar

- **Im Code:** Kein Fehler wird still verschluckt. Jeder Fehler wird behandelt oder mit Kontext weitergereicht.
- **Im Betrieb:** Apps protokollieren strukturiert auf die Standardausgabe, ohne Secrets und ohne personenbezogene Daten.
- **Benachrichtigung:** Kritische Fehler (z. B. fehlgeschlagenes Backup, ausgefallene Automation) erreichen einen Menschen, ohne dass er danach suchen muss.

---

## Verbindliche Prozesse

Die Artikel oben sind die Grundsätze. Wie sie im Alltag umgesetzt werden, regeln diese Dokumente. Sie sind genauso verbindlich, dürfen sich aber schneller weiterentwickeln:

| Dokument                                                                 | Regelt                                                                                  | Bezug                              |
| ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------- | ---------------------------------- |
| [`docs/prozess/sdd-ablauf.md`](docs/prozess/sdd-ablauf.md)               | die 8 Stufen von Specify bis Retro, Gates, Vorlagen, Befehle                            | Artikel I, II, III                 |
| [`docs/prozess/code-review.md`](docs/prozess/code-review.md)             | was ein Code-Review prüft, wer es macht, wann ein PR mergen darf                        | Artikel II, V–IX, XI, XII, XV, XVI |
| [`docs/prozess/aenderungsklassen.md`](docs/prozess/aenderungsklassen.md) | wie viel Prozess eine Änderung braucht (M · K · V), Notfall-Änderungen                  | Artikel I, II, V                   |
| [`docs/prozess/release.md`](docs/prozess/release.md)                     | Branches, Umgebungen dev · int · prod, Releases, Hotfixes, Rückweg                      | Artikel III, V, X                  |
| [`docs/prozess/governance.md`](docs/prozess/governance.md)               | wie Constitution und Prozesse geändert und versioniert werden, Geltungsbereich, Prüfung | alle                               |

Ein Prozessdokument darf die Constitution konkretisieren, aber nie abschwächen.
