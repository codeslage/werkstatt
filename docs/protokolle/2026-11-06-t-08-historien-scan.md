# Protokoll T-08: Historien-Scan vor dem ersten Veröffentlichen

> Datum: 2026-11-06 · Task: T-08 · AK: AK-24 · Werkzeug: gitleaks 8.30.1 über `tools/public-scan`

## Ablauf

1. Sperrliste `.sperrliste` angelegt (Rohfassung aus `codeslage-internal/betrieb/konten.md` und GitHub-Konto). Sie ist per `.gitignore` ausgeschlossen, das hat `git check-ignore` bestätigt.
2. Entscheidung des Inhabers: Der Name des Registrars wird nicht gesperrt. Er steht im Repo nur als verglichener Hosting-Anbieter (ADR 0001). Absicherung über das Review (Ebene 3).
3. Scan des Arbeitsstands mit Sperrliste: keine Funde. Gemeldet wurde nur die ungetrackte Datei `.sperrliste` selbst, das ist so erwartet.
4. Commit-Identität nur für dieses Repo gesetzt: Name `codeslage`, anonyme GitHub-noreply-Adresse.
5. Bootstrap-Commit `79afab8`: Der Pre-Commit-Hook lief und meldete `no leaks found`. Vorgemerkt waren 62 Dateien. Geprüft wurde, dass `.sperrliste`, `.env`, Tofu-State und lokale Einstellungen nicht darunter sind.
6. Historien-Scan aller Commits (`cli.ts git . --require-blocklist`, also `--log-opts=--all`): **1 Commit, 0 Funde.**

## Ergebnis

✅ Die Historie ist vor dem ersten Push frei von Secrets, IP- und E-Mail-Adressen und Sperrlisten-Begriffen.

## Hinweis

Die Commit-Metadaten (noreply-Adresse) enthalten GitHub-Login und Konto-ID. In einem öffentlichen Repo ist das nicht vermeidbar und vom Inhaber akzeptiert. Im Inhalt der Dateien sind beide über die Sperrliste gesperrt.
