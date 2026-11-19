# 06 – Phase 2 Webseite: Gestaltung und Logo

> Ergebnis der Sitzung „Gestaltung und Logo“ vom 2026-11-19, Antwort auf die offene Frage 10 der Spec. Logo-Dateien in `gestaltung/`, Zeiten in `zeiten.md`.

> Stand: 2026-11-19 · Status: vom Inhaber ausgewählt (Richtung, Wortmarke, Zeichen); Freigabe der fertigen Seite erst mit AK-11

## Ablauf und Entscheidungen

| Schritt | Frage                                        | Antwort des Inhabers                                                                       |
| ------- | -------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Vorab   | Wirkung                                      | alle drei Richtungen zeigen                                                                |
| Vorab   | Vorbilder / Abneigungen                      | **kein Stock-Look**: keine Stockfotos, keine Verläufe, keine generische „KI-Startup“-Optik |
| Vorab   | Hell / dunkel                                | **hell und dunkel**, folgt der Systemeinstellung (`prefers-color-scheme`), kein Schalter   |
| Runde 1 | Richtung (A Terminal, B Werkstatt, C Signal) | **A „Terminal“** (technisch-schlicht)                                                      |
| Runde 1 | Logo                                         | Wortmarke **`codeslage_`** gefällt; das Bildzeichen `c_` ergibt keinen Sinn → verworfen    |
| Runde 2 | Zeichen / Favicon (5 Ideen)                  | **`>_` Eingabe-Prompt**                                                                    |

Verworfen: B „Werkstatt“ (Papier, Rostrot, Serifen, Schraubzwinge), C „Signal“ (Schwarz-Weiß + Signalgelb), Zeichen `c_`, `cs_`, `{c}`, „nur Cursor“.

## Stil

Technisch-schlicht, ruhig, präzise, wie gute Entwickler-Doku:

- viel Weißraum, eine Akzentfarbe (Blau), keine Verläufe, keine Stockfotos, keine Schatten-Kaskaden
- Monospace nur für Details: Wortmarke, kleine Überzeilen (`// KI-Automatisierung für Startups`), Code, Zahlen der Soll/Ist-Wette
- Ecken leicht gerundet (6 px), dünne Linien statt Kästen; Karten nur, wo sie Gruppen trennen
- Bilder: höchstens Screenshots und Diagramme aus der eigenen Arbeit (Schaufenster), kein Foto-Schmuck

## Farben

Alle Text- und Akzentfarben erreichen mindestens WCAG AA (≥ 4,5:1), die meisten AAA (≥ 7:1). Werte nachgerechnet nach WCAG-2-Formel.

### Hell (Standard)

| Rolle         | Hex                           | Kontrast                 |
| ------------- | ----------------------------- | ------------------------ |
| Grund         | `#FFFFFF`                     | –                        |
| Fläche        | `#F3F5F8`                     | –                        |
| Linie         | `#DDE2EA`                     | (nur Schmuck)            |
| Text          | `#14181F`                     | 17,8 : 1 auf Grund       |
| Nebentext     | `#4A5260`                     | 7,9 : 1 (7,2 auf Fläche) |
| Akzent / Link | `#1747C8`                     | 7,6 : 1 (6,9 auf Fläche) |
| Button        | `#1747C8` mit Text `#FFFFFF`  | 7,6 : 1                  |
| Fokus-Rahmen  | `#1747C8`, 2 px, 2 px Abstand | 7,6 : 1                  |

### Dunkel (`prefers-color-scheme: dark`)

| Rolle         | Hex                          | Kontrast                 |
| ------------- | ---------------------------- | ------------------------ |
| Grund         | `#0D1117`                    | –                        |
| Fläche        | `#161B22`                    | –                        |
| Linie         | `#2A313C`                    | (nur Schmuck)            |
| Text          | `#E6EAF0`                    | 15,7 : 1                 |
| Nebentext     | `#9AA4B2`                    | 7,5 : 1 (6,9 auf Fläche) |
| Akzent / Link | `#7EA6FF`                    | 7,9 : 1 (7,2 auf Fläche) |
| Button        | `#7EA6FF` mit Text `#0D1117` | 7,9 : 1                  |
| Fokus-Rahmen  | `#7EA6FF`                    | 7,9 : 1                  |

Hinweis für den Plan: Links im Fließtext zusätzlich unterstreichen (nicht nur Farbe), damit Lighthouse/axe „link-in-text-block“ nicht anschlägt.

## Schriften

Nur Systemschriften, nichts wird geladen (AK-4, gut für Performance in AK-6):

```css
--sans: system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
--mono: ui-monospace, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace;
```

- Fließtext: `--sans`, 16–17 px, Zeilenhöhe 1,55, Zeilenlänge max. ~65 Zeichen
- Überschriften: `--sans`, Gewicht 650, Laufweite −0,02 em; H1 mobil ~30 px, Desktop ~44 px
- Details (Wortmarke, Überzeilen, Code, Zahlen): `--mono`, Zahlen mit `tabular-nums`

## Logo

- **Wortmarke:** `codeslage_` in Monospace, Gewicht 600, der Unterstrich in Akzentfarbe (`#1747C8` hell, `#7EA6FF` dunkel). Auf der Webseite als **echter Text** im Header (barrierefrei, 0 Byte extra), nicht als Bild.
- **Zeichen / Favicon:** Eingabe-Prompt `>_` – weißer Winkel und blauer Cursor auf dunklem, abgerundetem Quadrat. Reine Pfade, keine Schrift, sieht überall gleich aus.

| Datei                     | Inhalt                                               |
| ------------------------- | ---------------------------------------------------- |
| `favicon.svg`             | Favicon, Linien etwas kräftiger (3,6) für 16 px      |
| `logo-zeichen.svg`        | Zeichen `>_` für helle Flächen (z. B. GitHub-Avatar) |
| `logo-zeichen-dunkel.svg` | Zeichen invertiert für dunkle Flächen                |
| `logo.svg`                | Zeichen + Wortmarke, hell                            |
| `logo-dunkel.svg`         | Zeichen + Wortmarke, dunkel                          |

Offen für Stufe 6 (nicht blockierend):

- Die Wortmarke in `logo.svg` / `logo-dunkel.svg` ist `<text>` mit dem System-Monospace-Stapel und sieht daher je Gerät leicht anders aus. Für Verwendung außerhalb der Seite (Social, Folien) in Pfade umwandeln; dafür braucht es eine frei lizenzierte Monospace (z. B. JetBrains Mono oder IBM Plex Mono, beide OFL) und ein Werkzeug wie `fonttools`. Beides ist hier nicht installiert, Download nur nach Freigabe.
- Zusätzlich `apple-touch-icon.png` (180 px) und ggf. `favicon.ico` (32 px) aus `favicon.svg` erzeugen.

## Grundlayout

Gemeinsam auf jeder Seite: Header mit Wortmarke links und Navigation rechts (mobil: Navigation umbricht unter die Wortmarke, kein Burger-Menü nötig bei 4 Punkten), Inhaltsbreite max. ~1040 px, Seitenrand ≥ 16 px, Footer mit „© codeslage“, Impressum, Datenschutz, Link zum öffentlichen Repo. Jeder Kontakt-Aufruf („Schreib mir“) führt zur Kontaktseite (AK-3).

```
┌──────────────────────────────────────────────────────┐
│ [>_] codeslage_     Leistungen Projekte Über mich Kontakt │
├──────────────────────────────────────────────────────┤
│  (Seiteninhalt, siehe unten)                         │
├──────────────────────────────────────────────────────┤
│ © codeslage · Impressum · Datenschutz · GitHub       │
└──────────────────────────────────────────────────────┘
```

| Seite                  | Aufbau                                                                                                                                                                                                                                |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Start**              | Überzeile in Mono · H1 (Kernsatz) · ein Satz Erklärung · Button „Schreib mir“ + Link „Projekte ansehen →“ · drei Leistungen kurz (Raster 3 → 1 Spalte mobil) · Teaser Case Study mit Soll/Ist-Zahl in Mono · kurzer Kontakt-Abschluss |
| **Leistungen**         | je Leistung ein Abschnitt: Name, für wen, was du bekommst, typischer Ablauf; am Ende „Schreib mir“                                                                                                                                    |
| **Projekte**           | Liste als Karten: Titel, ein Satz, Kennzahl (z. B. „≈ 14,4 h statt ≈ 50 h“), Link; Case Study als eigene Unterseite mit Lesebreite ~65 Zeichen                                                                                        |
| **Über mich**          | kurzer Text, optional Foto (offene Frage 3), Arbeitsweise (Spec-driven, offen dokumentiert, Mensch im Loop), Link zum Repo                                                                                                            |
| **Kontakt**            | ein Satz, die Rollenadresse groß und als Text sichtbar, Button „Mail schreiben“ (`mailto:`), Hinweis, was in die Mail gehört; kein Formular                                                                                           |
| Impressum, Datenschutz | reine Textseiten, Lesebreite                                                                                                                                                                                                          |
| 404                    | „Diese Seite gibt es nicht.“ in Mono-Optik (z. B. `$ cd /seite → nicht gefunden`), Link zur Startseite                                                                                                                                |
