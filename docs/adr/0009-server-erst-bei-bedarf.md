# ADR 0009 – Server erst bei Bedarf, Entwicklung lokal

> Status: **Vorgeschlagen** · Stand: 2026-11-05
> Bezug: Constitution Artikel XI, `specs/04-fundament/spec.md`, `specs/03-roadmap.md` (Phase S), `specs/02-architektur.md` (A2, A3, A11)

## Kontext

Phase 1 sah einen eigenen Cloud-Server vor, der rund um die Uhr läuft. Bei der Anbieterwahl am 2026-11-05 hat sich gezeigt:

- Der günstige Hetzner CX33 ist nicht bestellbar. Bestellbare Alternativen kosten 14–43 € brutto pro Monat.
- Das Projekt erzielt keine Einnahmen und kann keine Vorsteuer abziehen. Jeder laufende Euro ist ein Verlust.
- Rund um die Uhr erreichbar sein muss heute nur die Webseite. Die braucht keinen Server, sie kann statisch auf Cloudflare Pages laufen.
- Einen dauerhaft laufenden Server braucht es erst für eine echte Kunden-Demo oder eine Live-Funktion mit Backend.

## Optionen

| | Server jetzt (Cloud) | Server lokal | Server erst bei Bedarf |
|---|---|---|---|
| Laufende Kosten bis zur ersten Demo | 14–24 €/Monat | Strom, ggf. Hardware | 0 € |
| Demo-Links jederzeit erreichbar | ✅ | ❌ nur wenn der Rechner läuft | ✅ ab Phase S |
| Reproduzierbar per IaC | ✅ | ❌ | ✅ ab Phase S |
| Spätere Umzugskosten | – | hoch (anderes Setup) | gering, wenn Apps von Anfang an in Containern laufen |

## Entscheidung

**Der Server kommt erst, wenn er gebraucht wird**: spätestens vor der ersten echten Kunden-Demo, oder wenn eine Funktion mit Server-Anteil live gehen soll. Das wird eine eigene Phase „Server & Betrieb“ (Phase S) mit eigener Spec.

Bis dahin gilt:
- Entwicklung lokal. Postgres und Apps laufen über Docker Compose auf `localhost`, mit Seed-Daten. **dev = lokal.**
- Jede App hat ein Dockerfile. Die CI baut und startet jedes Image bei jedem PR (AK-26), damit der spätere Umzug kein Umbau wird.
- DNS (inkl. Google-Mail) liegt per OpenTofu bei Cloudflare. Die Webseite läuft in Phase 2 als Click-Dummy auf Cloudflare Pages.

## Folgen

- Laufende Kosten in Phase 1 und 2: 0 €. Die Domain und Google Workspace bestehen ohnehin.
- Die Server-AKs aus `04-fundament` v1 (AK-6 bis AK-13, AK-19 bis AK-23) wandern in die Spec von Phase S.
- ADRs 0001, 0003, 0005, 0006 und 0007 sind **vertagt** und werden in Phase S mit den dann gültigen Preisen und Bedingungen neu geprüft.
- `docs/prozess/release.md` beschreibt weiterhin das Zielbild mit dev, int und prod. Der Release-Ablauf mit int und prod greift erst ab Phase S.
- Risiko: Eine Demo kommt kurzfristig. Phase S braucht etwa eine Woche Vorlauf, deshalb wird sie rechtzeitig angestoßen.
- Die Case Study wird ehrlicher: „Wir bauen erst, wenn wir es brauchen.“
