# Runbook: CWK ausrollen (Sync)

> Stand: 2026-11-27 · Bezug: `specs/05-projekt-plattform/` (AK-7, AK-8, AK-19, AK-25, AK-27), Plan 05 Schritt 3, ADR 0011, `platform-setup.md`
> Wer: in öffentliche Repos `sync.yml` in `platform`, in private Repos der Inhaber lokal

Eine gemergte Änderung am CWK in `werkstatt` ist ein **CWK-Release**: Sie kommt per Sync-PR in die Projekte. `cwk sync` nimmt immer den neuesten Stand von `werkstatt/main`, nicht den Stand des lokalen Checkouts.

## 1. Was ein Sync tut

Für jedes Repo der Soll-Menge:

1. Klonen und `cwk.json` lesen. Fehlt sie, ist das Repo rot („nicht angebunden“). Die übrigen Repos laufen weiter.
2. Den Branch `cwk/sync` auschecken. Gibt es ihn noch nicht, entsteht er neu von `main`. Gibt es ihn, holt der Sync `main` per Merge hinein. Es gibt nie einen Force-Push: Eigene Commits auf dem Branch bleiben.
3. Jede CWK-Datei des Teils (Regeln, mit Code auch Code) im neuen Stand schreiben, `@CWK_REF` durch den Commit ersetzen. In ergänzbaren Dateien bleibt der Projektblock aus dem Stand des Branches. In `cwk.json` ändert sich nur der Wert von `cwk`.
4. Ohne Änderung passiert nichts, kein Commit und kein PR. Sonst committen, pushen und den PR anlegen oder den offenen aktualisieren. Die Beschreibung nennt den alten und den neuen Stand und verlinkt die Änderungen in `werkstatt`.

## 2. Öffentliche Repos: `sync.yml` in `platform`

- Starten: `gh workflow run sync.yml -R codeslage/platform`. Nach dem Anbinden von `internal` läuft er auch nächtlich (T-40).
- Soll-Menge: alle öffentlichen, nicht archivierten Repos, die die Lese-App `codeslage-cwk-read` sieht, ohne `werkstatt`. Branch und PR legt die Schreib-App `codeslage-cwk` an.
- Ein neues öffentliches Repo muss in der Installation der Schreib-App sein (`cwk new` nimmt es auf). Sonst scheitert dort der Push.

## 3. Private Repos: lokal mit dem gh-Login

Die Schreib-App hat in privaten Repos keinen Zugriff (Plan 05, P1). Der Inhaber rollt dort selbst aus, in einem Checkout von `werkstatt` (der Branch ist egal, der Stand kommt aus `origin/main`):

```bash
pnpm cwk sync --private
```

Ein einzelnes Repo, öffentlich oder privat:

```bash
pnpm cwk sync --repo internal
```

Der gh-Login kann einen Sync-PR auch selbst mergen. Das ist bewusst so (P1): Auf GitHub Free gibt es für private Repos keinen Schutz. Liegt ein privates Repo 14 Tage hinter dem neuesten Stand, meldet das `cwk status` per Mail (Schritt 4).

## 4. Sync-PR prüfen und mergen

- Die CI des Sync-PR muss grün sein. Passt eine neue Konfiguration nicht zu den Werkzeug-Versionen im Projekt, fällt das hier auf.
- In öffentlichen Repos braucht der Merge ein Code-Owner-Review des Teams `maintainers` zum neuesten Push. Die Schreib-App kann nicht mergen. Kommt nach der Freigabe ein neuer Sync-Commit, verfällt die Freigabe.
- Eigene Anpassungen gehören in den Projektblock. Ein eigener Commit auf `cwk/sync` bleibt beim nächsten Sync erhalten.

## 5. Sperrliste geändert

Nach jeder Änderung an `.sperrliste` setzt `cwk secrets` das Secret `PUBLIC_BLOCKLIST` in allen Repos neu und trägt das Datum in `platform/blocklist-status.json` ein:

```bash
pnpm cwk secrets
```

## 6. Wenn etwas schiefgeht

- **„nicht angebunden, cwk.json fehlt“:** Das Repo hat keine `cwk.json`. Anbinden per PR mit `cwk.json` (`neues-projekt.md`) oder archivieren, wenn es nicht mehr gebraucht wird.
- **„ist die CWK-Quelle, kein Ziel für den Sync“:** `--repo werkstatt` ist nicht vorgesehen.
- **Datei aus dem CWK gestrichen oder umbenannt:** Der Sync löscht die alte Datei selbst, wenn sie im bisherigen Manifest stand (T-48). Dateien, die nur das Projekt hat, fasst er nicht an.
- **Sync-PR ohne Merge geschlossen:** Liegt `cwk/sync` weiter vor `main`, legt der nächste Lauf wieder einen PR an. Einen CWK-Stand lehnt man deshalb nicht durch Schließen ab, sondern durch eine Änderung in `werkstatt`.
- **Merge-Konflikt auf `cwk/sync`:** Ein eigener Commit auf dem Branch widerspricht `main`. Den Konflikt auf dem Branch per Hand lösen und pushen, danach den Sync erneut starten.
- **„CWK_READ_TOKEN fehlt“:** `cwk sync` ohne Option braucht das Token der Lese-App. Lokal `--private` oder `--repo` verwenden.
- **Token-Schritt in `sync.yml` rot:** Client-ID oder Schlüssel der App stimmen nicht. Neuen Schlüssel erzeugen und das Secret neu setzen (`platform-setup.md`, Abschnitt 2).
