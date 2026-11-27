# Runbook: Einrichtung der Projekt-Plattform

> Stand: 2026-11-27 · Bezug: `specs/05-projekt-plattform/plan.md` (Voraussetzungen V1–V6), ADR 0011, 0012, 0013
> Wer: der Inhaber. Claude legt keine Konten, Teams oder Apps an und gibt keine Tokens ein (Plan 05).
> Die Abschnitte kommen mit den Schritten des Plans dazu: Team (Schritt 2), GitHub Apps (Schritt 3), Cloudflare (Schritte 5–7).

## 1. Team `maintainers` (V1)

Das Team ist Code-Owner aller Dateien in jedem öffentlichen Projekt-Repo und in `werkstatt` (`CODEOWNERS`: `* @codeslage/maintainers`). Ein Sync-PR braucht deshalb sein Review. Eine App kann nicht Mitglied sein.

1. GitHub → Organisation `codeslage` → **Teams** → **New team**.
2. Name `maintainers`, Beschreibung „Code-Owner aller Repos (CWK)“.
3. Sichtbarkeit **Visible**. Ein geheimes Team kann kein Code-Owner sein.
4. Einziges Mitglied ist der Inhaber. Weitere Mitglieder kommen erst mit weiteren Personen dazu (Spec 05, Frage 3).
5. Prüfen:

   ```bash
   gh api /orgs/codeslage/teams/maintainers --jq '.privacy + " " + (.members_count|tostring)'
   ```

   Erwartet: `closed 1` (`closed` heißt bei GitHub „sichtbar“).

Schreibrecht je Repo setzt `cwk new`. In `werkstatt` setzt es der Inhaber selbst (T-08, am 2026-11-23). Ob es wirkt, zeigt der Job „Repo-Einstellungen“: Hat das Team kein Schreibrecht, meldet GitHub für `CODEOWNERS` „Unknown owner“.

## 2. GitHub Apps (V2)

Zwei Apps mit getrennten Rechten (Plan 05, V2; ADR 0011). Beide gehören der Organisation, nicht dem Konto des Inhabers.

| App                  | Rechte (Repository permissions)                                                                    | Installation                                                                                               |
| -------------------- | -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `codeslage-cwk-read` | Contents: Read, Pull requests: Read, Metadata: Read                                                | **All repositories**                                                                                       |
| `codeslage-cwk`      | Contents: Read and write, Workflows: Read and write, Pull requests: Read and write, Metadata: Read | **Only select repositories**: nur öffentliche Projekt-Repos, also nicht `werkstatt` und kein privates Repo |

Für jede App:

1. GitHub → Organisation `codeslage` → **Settings** → **Developer settings** → **GitHub Apps** → **New GitHub App**.
2. Name wie oben. Homepage URL: `https://github.com/codeslage`.
3. **Webhook:** „Active“ abwählen. Die Apps reagieren auf nichts, sie werden nur aus Workflows heraus benutzt.
4. Rechte wie in der Tabelle, sonst nichts. Organization und Account permissions bleiben auf „No access“.
5. „Where can this GitHub App be installed?“: **Only on this account**.
6. Nach dem Anlegen: **Generate a private key**. Die Datei lädt der Browser herunter. Sie kommt nur in die Secrets unten und wird danach gelöscht, nicht im Passwortmanager aufbewahrt (ein neuer Schlüssel lässt sich jederzeit erzeugen).
7. **Install App** → Organisation `codeslage` → Auswahl wie in der Tabelle. Bei `codeslage-cwk` sind das heute `project-template`, `cwk-sample` und `quiz`. Neue öffentliche Repos nimmt `cwk new` selbst auf.

Secrets in `platform` (Client-ID aus der Seite der App, „Client ID“; der Schlüssel aus der Datei):

```bash
gh secret set CWK_READ_CLIENT_ID -R codeslage/platform
gh secret set CWK_READ_PRIVATE_KEY -R codeslage/platform < <Datei von codeslage-cwk-read>.pem
gh secret set CWK_WRITE_CLIENT_ID -R codeslage/platform
gh secret set CWK_WRITE_PRIVATE_KEY -R codeslage/platform < <Datei von codeslage-cwk>.pem
```

Prüfen (zeigt nur Namen, keine Werte):

```bash
gh api /orgs/codeslage/installations --jq '.installations[] | .app_slug + " " + .repository_selection'
gh secret list -R codeslage/platform
```

Erwartet: `codeslage-cwk-read all`, `codeslage-cwk selected` und die vier Secrets. Welche Repos `codeslage-cwk` erreicht, prüft ab T-20 `infra/tests/cwk-sync.test.ts`.

**Claude GitHub App ohne `platform` (P1 c, Entscheidung vom 2026-11-27):** Über sie ließen sich sonst die Ersatzprüfung oder die Zeitpläne in `platform` ändern, wo GitHub Free keinen Schutz für `main` bietet. Lokale Sitzungen arbeiten dort weiter mit dem gh-Login des Inhabers, Cloud-Sitzungen nicht.

1. Organisation `codeslage` → **Settings** → **GitHub Apps** → **Claude** → **Configure**.
2. **Repository access:** **Only select repositories**, alle Repos außer `platform` auswählen, **Save**.

Prüfen: `gh api /orgs/codeslage/installations --jq '.installations[] | .app_slug + " " + .repository_selection'` zeigt `claude selected`. Neue Repos nimmt diese App danach nicht mehr von selbst auf (`neues-projekt.md`).
