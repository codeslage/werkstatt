# 04 – Phase 1 Fundament: Spec

> Status: **Freigegeben** am 2026-11-05 (v2.1: AK-28 bis AK-30 aus der Analyse ergänzt)
> Stand: 2026-11-05
> Historie: v1 freigegeben am 2026-11-05 (mit eigenem Server). Am 2026-11-05 in Stufe 3 zurück nach Stufe 1: Der Server kommt erst, wenn er gebraucht wird (ADR 0009); die Server-AKs sind in eine spätere Spec „Server & Betrieb“ verschoben.
> Bezug: `CONSTITUTION.md` (v1.1.0), `02-architektur.md` (A1–A3, A8), `03-roadmap.md`
> SDD-Stufe: 1 Specify · 2 Clarify

## Ziel

Eine reproduzierbare Basis, auf der alle weiteren Phasen aufbauen, **ohne laufende Kosten**, solange nichts dauerhaft öffentlich laufen muss:

- Monorepo mit CI, das die Constitution maschinell durchsetzt
- DNS per IaC, **ohne dass Google-Mail ausfällt**
- Eine lokale Entwicklungsumgebung in Containern, die sich auf jedem Rechner mit wenigen Befehlen aufsetzen lässt
- Jede App ist von Anfang an so gebaut, dass sie später ohne Umbau auf einen Server umziehen kann

Leitsatz: **Wir bauen erst, wenn wir es brauchen** (Artikel XI).

## Nicht im Umfang

- **Server, Deployment-Plattform, Backups, Alarme, Umgebungen int/prod** → eigene Spec „Server & Betrieb“. Sie startet, sobald etwas dauerhaft öffentlich mit Server-Anteil laufen muss, spätestens vor der **ersten echten Kunden-Demo** (siehe ADR 0009 und offene Frage 7)
- Webseite → Phase 2, zunächst als Click-Dummy auf Cloudflare Pages
- Projekt-Vorlage, Docs-Portal → Phase 1.5; PoC-Hosting → Spec „Server & Betrieb“

## User Stories

- Als Inhaber möchte ich keine laufenden Kosten haben, solange das Projekt nichts einbringt und nichts dauerhaft erreichbar sein muss.
- Als Inhaber möchte ich, dass meine Mail bei der DNS-Umstellung ununterbrochen funktioniert.
- Als Inhaber möchte ich die Entwicklungsumgebung auf einem neuen Rechner (z. B. dem Mac) mit wenigen Befehlen aufsetzen können.
- Als Inhaber möchte ich sicher sein, dass sich jede App später ohne Umbau auf einem Server betreiben lässt.
- Als Inhaber möchte ich, dass die CI Verstöße gegen die Constitution (Secrets, interne Angaben, fehlende Spec-Abschnitte, unnötiger oder verworrener Code) automatisch findet.

## Voraussetzungen (erledigt der Inhaber selbst)

Claude legt keine Konten an und gibt keine Passwörter oder Tokens in Webformulare ein. Diese Schritte machst du selbst, Claude leitet dich jeweils an.

Alle Konten laufen über das Google-Workspace-Konto des Inhabers.

| # | Schritt | Wann | Status |
|---|---|---|---|
| V1 | GitHub-Organisation `codeslage` anlegen (Free), 2FA aktiv | vor dem Repo-Schritt | ✅ 2026-11-05 |
| V2 | Cloudflare-Konto anlegen (Free), 2FA aktiv | vor dem DNS-Schritt | ✅ 2026-11-05 |
| V5 | API-Tokens mit minimalen Rechten erzeugen und in die lokale `.env` bzw. GitHub Secrets eintragen (Claude sagt jeweils, welche Rechte) | je Schritt | ⬜ |
| V6 | Beim Registrar die Nameserver auf Cloudflare umstellen | im DNS-Schritt | ⬜ |
| V7 | Docker Desktop installieren und dessen Lizenzbedingungen akzeptieren (für private Nutzung kostenlos) | vor dem Schritt „lokale Umgebung“ | ⬜ |
| V8 | Zahlungsmethode in Cloudflare hinterlegen (nötig für R2, Nutzung bleibt im Gratis-Kontingent; ergänzt im Plan, offene Frage 9) | vor dem DNS-Schritt | ⬜ |
| – | 2FA beim Registrar | sofort | ✅ 2026-11-05 |

V3 (Konto beim Hosting-Anbieter) und V4 (privates Admin-Netz) sind in die Spec „Server & Betrieb“ verschoben.

## Akzeptanzkriterien

Die IDs bleiben gegenüber v1 stabil; verschobene AKs stehen im nächsten Abschnitt.

| ID | Kriterium | Nachweis |
|---|---|---|
| AK-1 | Repo ist öffentlich, `main` geschützt, CI läuft bei jedem PR grün | automatisiert (CI-Status) |
| AK-2 | Im Repo liegt kein Secret; der Secret-Scan läuft in CI und lokal vor jedem Commit | automatisiert |
| AK-24 | Inhalte aus der Liste „Öffentlich vs. intern“ (`governance.md`) werden auf **allen drei Ebenen** erkannt: lokal vor dem Commit, in der CI (Merge blockiert) und im Review; vor dem ersten Veröffentlichen ist die gesamte Historie gescannt | automatisiert (Negativtest je Ebene) + Protokoll |
| AK-3 | MX-Records von `codeslage.de` zeigen nach der Umstellung auf Google; SPF, DKIM und DMARC sind vorhanden | automatisiert (DNS-Lookup) |
| AK-4 | Eine Testmail an und von einer `@codeslage.de`-Adresse kommt nach der Umstellung an | manuell, protokolliert |
| AK-5 | Die IaC zeigt auf dem aktuellen `main` keine Abweichung zur echten Infrastruktur (in dieser Phase: Cloudflare) | automatisiert (CI) |
| AK-14 | Alle Tokens sind minimal berechtigt und dokumentiert (wer, wofür, welche Rechte, Ablaufdatum), ohne Werte | Review |
| AK-15 | Die laufenden Kosten der Phase liegen bei **0 €/Monat** (ausgenommen die bereits bestehende Domain und Google Workspace) | Kostenübersicht |
| AK-16 | Eine Spec oder ein Plan ohne vollständigen Constitution-Check lässt die CI rot werden | automatisiert (Negativtest) |
| AK-17 | Eine neue Claude-Code-Sitzung im Repo kennt Constitution und SDD-Befehle, ohne dass man sie erwähnt | manuell |
| AK-18 | Ungenutzter Code, ungenutzte Abhängigkeiten, zyklische oder verbotene Imports und Überschreitungen der Komplexitätsgrenzen lassen die CI rot werden | automatisiert (Negativtests) |
| AK-25 | Auf einem frischen Rechner starten nach Anleitung (Klonen, Installieren, ein Startbefehl) eine Test-App und eine Postgres-Datenbank mit Seed-Daten lokal; die Test-App meldet sich gesund | automatisiert (Smoke-Test) + einmal manuell auf einem zweiten Rechner oder frischen Benutzerkonto, protokolliert |
| AK-26 | Jede App hat ein Container-Image, das die CI bei jedem PR baut, startet und per Health-Check prüft; dasselbe Image läuft lokal | automatisiert (CI) |
| AK-27 | Ein fehlgeschlagener geplanter CI-Lauf (Drift-Check, Historien-Scan) erreicht den Inhaber per Mail, ohne dass er danach suchen muss | manuell (provozierter Fehler), protokolliert |
| AK-28 | Jeder Dienstleister, der in dieser Phase Daten verarbeitet, ist in `docs/dsgvo.md` erfasst (Zweck, Daten, Standort, AVV/DPF) | Review |
| AK-29 | Abhängigkeits- und Sicherheits-Updates kommen automatisch als PR (npm, GitHub Actions, Docker-Images, OpenTofu-Provider) | manuell (erster Update-PR), protokolliert |
| AK-30 | Die CI prüft die einheitliche Formatierung (TypeScript, JSON, YAML, Markdown und HCL) | automatisiert (Negativtest) |

## Verschoben in die Spec „Server & Betrieb“

Diese AKs aus v1 gelten unverändert als Anforderungen an die spätere Spec und werden dort übernommen oder bewusst angepasst:

| ID | Kurzfassung |
|---|---|
| AK-6 | Server lässt sich abreißen und aus dem Repo neu erzeugen |
| AK-7 | Auf der Server-IP nur 80/443, und die nur über Cloudflare |
| AK-8 | SSH nur über privates Admin-Netz, kein Root-/Passwort-Login |
| AK-9 | Sicherheitsupdates automatisch |
| AK-10 | Verwaltungsoberfläche nur über privates Admin-Netz |
| AK-11 | `https://status.codeslage.de` liefert 200, HTTP → HTTPS |
| AK-12 | Tägliches verschlüsseltes Backup außerhalb des Servers |
| AK-13 | Restore in frische DB liefert identische Daten |
| AK-19 | Backup-Fehler und Ausfall lösen in 30 min eine Mail aus |
| AK-20 | Getrennte Umgebungen dev, int, prod ohne Echtdaten in dev/int |
| AK-21 | Merge nach `main` landet automatisch auf dev |
| AK-22 | int läuft mit demselben Image wie das prod-Release |
| AK-23 | prod nur aus Release-Tag nach Freigabe, Rollback getestet |

Bis dahin ist **dev = lokal** (AK-25), int und prod gibt es noch nicht. `docs/prozess/release.md` beschreibt den Zielzustand; der Release-Ablauf greift erst mit der Server-Phase.

## Constitution-Check

| Artikel | Bewertung | Anmerkung |
|---|---|---|
| I Spec zuerst | ✅ | diese Spec; die Server-Spec folgt vor jeder Server-Arbeit |
| II Tests beweisen die Spec | ✅ | 17 AKs, davon 10 automatisiert |
| III Kleine Schritte | ✅ | Umsetzung in einzelnen PRs (siehe Plan) |
| IV Fragen statt raten | ✅ | offene Fragen unten, keine blockierende |
| V Keine zerstörerischen Aktionen | ✅ | Nameserver erst nach geprüftem Plan; kein `apply` ohne geprüften `plan` |
| VI Secrets nie ins Repo | ✅ | AK-2, AK-14, AK-24 |
| VII Sicher als Standard | ✅ | nichts läuft öffentlich außer DNS; Tokens minimal (AK-14); lokale Dienste nur auf `localhost`; Sicherheits-Updates automatisch (AK-29) |
| VIII Datenschutz & EU | ✅ | keine personenbezogenen Daten, lokal nur Seed-Daten; Dienstleister in `docs/dsgvo.md` (AK-28) |
| IX Mensch im Loop | – | keine KI-Ausgaben an Kunden in dieser Phase |
| X Reproduzierbar | ✅ | DNS per IaC (AK-5), lokale Umgebung per Code (AK-25), Images in der CI geprüft (AK-26) |
| XI Einfach vor vollständig | ✅ | Kern dieser Überarbeitung: kein Server, solange keiner gebraucht wird (AK-15) |
| XII Offen dokumentieren | ✅ | öffentliches Repo, ADRs (u. a. 0009), Content-Notizen |
| XIII Wiederverwendbar | ✅ | Repo-Gerüst, CI-Checks und Compose-Setup als Vorlage für Projekt-Repos (Phase 1.5) |
| XIV Messen statt schätzen | ✅ | AK-15, Soll/Ist in der Retro |
| XV Kein unnötiger Code | ✅ | AK-18 |
| XVI Fehler sind sichtbar | ✅ | AK-27; laufende Dienste mit Alarmen kommen mit der Server-Spec |

## Risiken

| Risiko | Gegenmaßnahme |
|---|---|
| Mail-Ausfall beim Umzug der Nameserver | Records zuerst nachbauen und vergleichen, Umstellung mit niedriger TTL, AK-3/AK-4 direkt danach |
| Deploy-Probleme fallen erst spät auf | AK-26: jedes Image wird in der CI gebaut und gestartet; in der Server-Spec ein Probe-Aufbau auf Stundenbasis vor dem ersten echten Einsatz |
| Kunden-Demo kommt kurzfristig, Server fehlt | Server-Spec rechtzeitig anstoßen; Aufbau mit Vorlauf (geschätzt ~1 Woche) einplanen |
| Docker unter Windows ist langsam (WSL2, Laufwerk `X:\`) | nur Datenbank und Test-App in Containern; Entwicklung selbst nativ; mit dem Mac entfällt das |
| Secrets im IaC-State | State-Verschlüsselung + privater Speicher (ADR 0002) |

## Offene Fragen

| # | Frage | Blockiert? | Antwort |
|---|---|---|---|
| 1 | Wo ist `codeslage.de` registriert? | – | beantwortet am 2026-11-05, dokumentiert in `codeslage-internal/betrieb/konten.md` |
| 2 | Gibt es schon ein Cloudflare-Konto? | – | ja, angelegt am 2026-11-05 (V2) |
| 3 | Ist `status.codeslage.de` als Test-App ok? | – | entfällt hier; die Test-App läuft lokal, die Domain kommt mit der Server-Spec |
| 4 | Reicht ein kostenloser externer Uptime-Check? | – | verschoben in die Server-Spec |
| 5 | AK-6 vor dem Go-Live durchspielen? | – | verschoben in die Server-Spec |
| 6 | Privates Admin-Netz: Tailscale oder Cloudflare Tunnel? | – | verschoben in die Server-Spec (ADR 0003 vertagt) |
| 7 | Löst neben der ersten Kunden-Demo auch der Live-Gang einer Funktion mit Server-Anteil (z. B. Kontaktformular → Automation in Phase 3) die Server-Phase aus? | nein | Vorschlag: ja, was zuerst kommt |
| 8 | Docker Desktop oder Podman für die lokale Umgebung? | nein | im Plan entschieden: Docker Desktop (ADR 0010) |
| 9 | Cloudflare R2 (für den verschlüsselten Tofu-State) verlangt nach meinem Kenntnisstand eine hinterlegte Zahlungsmethode, auch im kostenlosen Rahmen. Ist das ok, oder soll der State woanders liegen? | nein, aber vor dem DNS-Schritt klären | im Plan geklärt: Laut Anleitungen ist eine Zahlungsmethode nötig → Voraussetzung V8; Ausweichweg in ADR 0002, falls nicht gewünscht |
