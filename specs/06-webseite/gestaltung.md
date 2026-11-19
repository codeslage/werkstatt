# 06 – Phase 2 Webseite: Gestaltung und Logo

> Ergebnis der Sitzung „Gestaltung und Logo“ vom 2026-11-19, Antwort auf die offene Frage 10 der Spec. Logo-Dateien in `gestaltung/`, Zeiten in `zeiten.md`.

> Stand: 2026-11-19 · Status: **Logo vom Inhaber als final bestätigt** (2026-11-19, Runde 7: Graphit + Waldgrün); Freigabe der fertigen Seite erst mit AK-11

## Ablauf und Entscheidungen

| Schritt | Frage                                                  | Antwort des Inhabers                                                                                                         |
| ------- | ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| Vorab   | Wirkung                                                | alle drei Richtungen zeigen                                                                                                  |
| Vorab   | Vorbilder / Abneigungen                                | **kein Stock-Look**: keine Stockfotos, keine Verläufe, keine generische „KI-Startup“-Optik                                   |
| Vorab   | Hell / dunkel                                          | **hell und dunkel**, folgt der Systemeinstellung (`prefers-color-scheme`), kein Schalter                                     |
| Runde 1 | Richtung (A Terminal, B Werkstatt, C Signal)           | **A „Terminal“** (technisch-schlicht)                                                                                        |
| Runde 1 | Logo                                                   | Wortmarke **`codeslage_`** gefällt; das Bildzeichen `c_` ergibt keinen Sinn → verworfen                                      |
| Runde 2 | Zeichen / Favicon (5 Ideen)                            | **`>_` Eingabe-Prompt**                                                                                                      |
| Runde 3 | Rückmeldung: „noch nicht eingängig genug“; 6 Varianten | **Variante 5 „zweiteiliger Name“**: Prompt auf **blauem** Quadrat, Name gegliedert in „code“ (leicht, grau) + „slage“ (fett) |

Verworfen: B „Werkstatt“ (Papier, Rostrot, Serifen, Schraubzwinge), C „Signal“ (Schwarz-Weiß + Signalgelb), Zeichen `c_`, `cs_`, `{c}`, „nur Cursor“; in Runde 3 schwarzes Quadrat, „Name als Befehl“, „fette Form“, „Terminal-Fenster“, blinkender Cursor.

## Stil

Technisch-schlicht, ruhig, präzise, wie gute Entwickler-Doku:

- viel Weißraum, eine Akzentfarbe (Waldgrün; das Blau aus den Runden 1–5 ist seit Runde 7 ersetzt), keine Verläufe auf der Seite (Ausnahme: das Relief im Logo-Zeichen), keine Stockfotos, keine Schatten-Kaskaden
- Monospace nur für Details: Wortmarke, kleine Überzeilen (`// KI-Automatisierung für Startups`), Code, Zahlen der Soll/Ist-Wette
- Ecken leicht gerundet (6 px), dünne Linien statt Kästen; Karten nur, wo sie Gruppen trennen
- Bilder: höchstens Screenshots und Diagramme aus der eigenen Arbeit (Schaufenster), kein Foto-Schmuck

## Farben

Alle Text- und Akzentfarben erreichen mindestens WCAG AA (≥ 4,5:1), die meisten AAA (≥ 7:1). Werte nachgerechnet nach WCAG-2-Formel.

### Hell (Standard)

| Rolle                    | Hex                           | Kontrast                 |
| ------------------------ | ----------------------------- | ------------------------ |
| Grund                    | `#FFFFFF`                     | –                        |
| Fläche                   | `#F3F5F8`                     | –                        |
| Linie                    | `#DDE2EA`                     | (nur Schmuck)            |
| Text                     | `#14181F`                     | 17,8 : 1 auf Grund       |
| Nebentext                | `#4A5260`                     | 7,9 : 1 (7,2 auf Fläche) |
| Akzent / Link (Waldgrün) | `#1E7B4A`                     | 5,3 : 1 (4,8 auf Fläche) |
| Button                   | `#1E7B4A` mit Text `#FFFFFF`  | 5,3 : 1                  |
| Fokus-Rahmen             | `#1E7B4A`, 2 px, 2 px Abstand | 5,3 : 1                  |

### Dunkel (`prefers-color-scheme: dark`)

| Rolle                         | Hex                          | Kontrast                  |
| ----------------------------- | ---------------------------- | ------------------------- |
| Grund                         | `#0D1117`                    | –                         |
| Fläche                        | `#161B22`                    | –                         |
| Linie                         | `#2A313C`                    | (nur Schmuck)             |
| Text                          | `#E6EAF0`                    | 15,7 : 1                  |
| Nebentext                     | `#9AA4B2`                    | 7,5 : 1 (6,9 auf Fläche)  |
| Akzent / Link (Waldgrün hell) | `#6FD69A`                    | 10,6 : 1 (9,7 auf Fläche) |
| Button                        | `#6FD69A` mit Text `#0D1117` | 10,6 : 1                  |
| Fokus-Rahmen                  | `#6FD69A`                    | 10,6 : 1                  |

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

- **Wortmarke (zweiteilig):** `codeslage_` in Monospace: „code“ Gewicht 300 in Nebentextfarbe (`#4A5260` hell / `#9AA4B2` dunkel), „slage_“ Gewicht 800 in Textfarbe (`#14181F` / `#E6EAF0`), Unterstrich ebenfalls in Textfarbe. Grundlinie der Schrift auf der Unterkante des Zeichens. Auf der Webseite als **echter Text** im Header, nicht als Bild; beide Farben ≥ 7:1.
- **Zeichen:** Eingabe-Prompt `>_` in **Waldgrün hell** (`#6FD69A`) auf einer **Graphit**-Kachel, wie ein Terminal. Groß im Relief-Stil (Verlauf `#454B55` → `#1E2228`, feiner heller Rand, weicher Schatten, Zeichen mit dunkler und grüner Kante herausgeprägt); klein und als Favicon flach (`#1E2228`, Zeichen `#6FD69A`, ≈ 9,0 : 1). Dieselbe Kachel funktioniert auf hellem und dunklem Grund. Reine Pfade, keine Schrift.

Die Dateien stehen unten in „Dateien (Stand Runde 7)“.

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

| Seite                  | Aufbau                                                                                                                                                                                                                                                                  |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Start**              | Überzeile in Mono · H1 (Kernsatz) · ein Satz Erklärung · Button „Schreib mir“ + Link „Projekte ansehen →“ · vier Leistungen kurz (Raster 2 × 2 → 1 Spalte mobil; angepasst an `leistungen.md`) · Teaser Case Study mit Soll/Ist-Zahl in Mono · kurzer Kontakt-Abschluss |
| **Leistungen**         | je Leistung ein Abschnitt: Name, für wen, was du bekommst, typischer Ablauf; am Ende „Schreib mir“                                                                                                                                                                      |
| **Projekte**           | Liste als Karten: Titel, ein Satz, Kennzahl (z. B. „≈ 14,4 h statt ≈ 50 h“), Link; Case Study als eigene Unterseite mit Lesebreite ~65 Zeichen                                                                                                                          |
| **Über mich**          | kurzer Text, Foto (Frage 3: ja, V2), Arbeitsweise (Spec-driven, offen dokumentiert, Mensch im Loop), Link zum Repo                                                                                                                                                      |
| **Kontakt**            | ein Satz, die Rollenadresse groß und als Text sichtbar, Button „Mail schreiben“ (`mailto:`), Hinweis, was in die Mail gehört; kein Formular                                                                                                                             |
| Impressum, Datenschutz | reine Textseiten, Lesebreite                                                                                                                                                                                                                                            |
| 404                    | „Diese Seite gibt es nicht.“ in Mono-Optik (z. B. `$ cd /seite → nicht gefunden`), Link zur Startseite                                                                                                                                                                  |

## Nachtrag Runde 4 (Feinschliff, 2026-11-19)

> Überholt durch Runde 7, was Farben, Dateien und viewBox angeht; maßgeblich sind „Logo“ oben und „Dateien (Stand Runde 7)“.

Inhaber wählte: **1b** Gewicht „code“ 300 / „slage“ 800 · **2c** „code“ grau, „slage_“ inkl. Unterstrich in Textfarbe, nur das Kästchen ist blau · **3a** Zeichen unverändert · **4a** nebeneinander · Grundlinie der Schrift auf der Unterkante des Kästchens (viewBox 230 × 36, Unterstrich ragt darunter). `logo.svg` / `logo-dunkel.svg` entsprechend aktualisiert; Abschnitt „Logo“ oben gilt bis auf diese Punkte. Noch nicht vom Inhaber in der Vorschau geprüft.

## Nachtrag Runde 5 (plastisch, 2026-11-19)

> Überholt durch Runde 7, was Farben, Dateien und viewBox angeht; maßgeblich sind „Logo“ oben und „Dateien (Stand Runde 7)“.

Wunsch des Inhabers: Zeichen „etwas plastischer, im Stil vom neuen Apple-Design“. Gezeigt: A Glas-Kachel, B Liquid Glass, C Relief. Gewählt: **C Relief** – Kachel mit leichtem Verlauf (`#2A5AE0` → `#1640B8`), feiner heller Rand (Weiß 18 %), weicher Schatten; das `>_` ist herausgeprägt (dunkle Kante `#0C2C85`, helle Kante `#9DB6F5`, Zeichen Weiß). Dunkle Fassung: Kachel `#9BB9FF` → `#6F98F5`, Zeichen `#0D1117`. Die Vorgabe „keine Verläufe“ gilt weiter für die Webseite; der Verlauf im Zeichen ist eine bewusste Ausnahme des Inhabers.

Einsatz: **groß plastisch, Tab flach.** `logo.svg`, `logo-dunkel.svg`, `logo-zeichen.svg`, `logo-zeichen-dunkel.svg` sind plastisch (App-Icon, Avatar, Folien, Header). `favicon.svg` und neu `logo-zeichen-flach.svg` bleiben flach (blau, `#1747C8`), weil Effekte bei 16 px verschwimmen.

## Nachtrag Runden 6 und 7 (Farbe, 2026-11-19)

Rückmeldung: Blau erinnert zu sehr an Jira; außerdem waren die Einzel-Zeichen abgeschnitten (Schatten ragte über den Bildrand → viewBox jetzt mit 5 Einheiten Rand). Runde 6 zeigte Petrol, Waldgrün, Orange, Beere, Senf, Graphit + Orange; der Inhaber wollte Graphit und Waldgrün kombiniert sehen. Runde 7 zeigte vier Kombinationen; gewählt: **Graphit-Kachel mit grünem Zeichen**. Akzentfarbe der Webseite wird **Waldgrün** (`#1E7B4A` hell / `#6FD69A` dunkel), die Farbtabellen oben sind angepasst. Blau ist damit vollständig ersetzt.

## Dateien (Stand Runde 7)

| Datei                    | Inhalt                                                            |
| ------------------------ | ----------------------------------------------------------------- |
| `logo.svg`               | Zeichen (Relief) + Wortmarke, für helle Flächen                   |
| `logo-dunkel.svg`        | Zeichen (Relief) + Wortmarke, für dunkle Flächen                  |
| `logo-zeichen.svg`       | Zeichen (Relief), für helle und dunkle Flächen (Avatar, App-Icon) |
| `logo-zeichen-flach.svg` | Zeichen flach, für kleine Größen                                  |
| `favicon.svg`            | flaches Favicon, Linien 3,8 für 16 px                             |

`logo-zeichen-dunkel.svg` entfällt, weil die Graphit-Kachel auf beiden Hintergründen funktioniert. Diese Tabelle ersetzt die Dateitabellen weiter oben.
