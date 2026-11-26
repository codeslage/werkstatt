# Runbook: Cloudflare-Tokens erneuern

> Stand: 2026-11-26 (Deploy-Token und Erweiterung der Rechte vorgemerkt) · Bezug: `docs/secrets.md` (Register, AK-14), `docs/runbooks/tofu-state.md`, Constitution VI und VII
> Nächster Termin: **alle Cloudflare-Tokens laufen am 2027-05-12 ab.** Erneuern spätestens zwei Wochen vorher.

## 1. Welche Tokens, was hängt daran

| Token (Cloudflare)                         | Art                  | Werte und wo sie liegen                                                                                          | Wer bricht, wenn er abläuft            |
| ------------------------------------------ | -------------------- | ---------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| `codeslage-tofu-rw`                        | Account API Token    | Token-Wert → `.env` `CLOUDFLARE_API_TOKEN`                                                                       | `tofu plan`/`apply` lokal              |
| `codeslage-tofu-state-rw`                  | Account API Token R2 | Access Key ID / Secret Access Key → `.env` `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY`                         | jeder lokale Tofu-Befehl               |
| `codeslage-tofu-ro`                        | Account API Token    | Token-Wert → GitHub Secret `CF_API_TOKEN_RO`                                                                     | Drift-Check                            |
| `codeslage-tofu-state-ro`                  | Account API Token R2 | Access Key ID / Secret Access Key → GitHub Secrets `R2_STATE_RO_ACCESS_KEY_ID` / `R2_STATE_RO_SECRET_ACCESS_KEY` | Drift-Check                            |
| `codeslage-pages-deploy` (ab Plan 06 T-24) | Account API Token    | Token-Wert → Secret `CF_PAGES_TOKEN` nur im GitHub-Environment `production`                                      | Deploy der Webseite (`deploy-web.yml`) |

GitHub Secrets gibt es jeweils zweimal: für Actions und für Dependabot. Alle Werte stehen zusätzlich im Passwortmanager des Inhabers.

Ein R2-Token zeigt beim Anlegen oder Rollen **drei** Werte: Token value, Access Key ID, Secret Access Key. OpenTofu braucht nur die beiden letzten. Der Token value gehört in **keine** Zeile der `.env`.

`CF_PAGES_TOKEN` liegt nur im Environment `production`, nicht in den Repo-Secrets und nicht bei Dependabot. Setzen mit `gh secret set CF_PAGES_TOKEN --env production --repo codeslage/werkstatt` (Wert wird abgefragt, nicht in die Shell-Historie).

### Rechte erweitern (statt erneuern)

Kommen neue Ressourcen in `infra/tofu/live` dazu (zuerst Plan 06 T-24 zusammen mit Plan 05 V3), werden die Rechte beim bestehenden Token unter **Edit** ergänzt, nicht neu angelegt; der Wert bleibt gleich. Soll-Rechte: `docs/secrets.md`, Abschnitt „Geplante Erweiterung“. Danach Abschnitt 4 ausführen, beim Read-only-Token zusätzlich den Drift-Check neu starten.

## 2. Anzeichen

- Drift-Check rot mit `401`, `403`, `9109` oder `SignatureDoesNotMatch`.
- Lokal: `tofu init` scheitert mit `SignatureDoesNotMatch` (R2-Schlüssel) oder `plan` mit `403` (Cloudflare-Token).

## 3. Erneuern (je Token)

1. Cloudflare → Seitenleiste → Manage account → Settings bzw. „Account API tokens“ → beim Token **⋯ → Roll**. Der alte Wert ist danach sofort ungültig.
2. Beim Token **Edit** → TTL: neues Enddatum (bisher halbjährlich). Rechte dabei nicht ändern, sie stehen in `docs/secrets.md`; im Dashboard sind sie Policies mit Geltungsbereich (Entire Account bzw. Zone `codeslage.de`).
3. Neue Werte in den Passwortmanager, alten Eintrag überschreiben.
4. Werte eintragen:
   - lokale Tokens: in der `.env` die betroffenen Zeilen ersetzen.
   - CI-Tokens: eine Datei `.env.ci-ro` anlegen (von `.env.*` in `.gitignore` erfasst) mit den Zeilen `CF_API_TOKEN_RO=`, `R2_STATE_RO_ACCESS_KEY_ID=`, `R2_STATE_RO_SECRET_ACCESS_KEY=`, ausfüllen, dann
     `for app in actions dependabot; do gh secret set -f .env.ci-ro --app $app --repo codeslage/werkstatt; done`
     und die Datei danach löschen.
5. `docs/secrets.md`: Spalte „Läuft ab“ und Stand anpassen (eigener PR, Klasse M).

## 4. Prüfen

- Welcher Token steht wo? `curl -s -H "Authorization: Bearer <token>" https://api.cloudflare.com/client/v4/accounts/<konto-id>/tokens/verify` zeigt Status, Startdatum (`not_before`) und Ablauf (`expires_on`), ohne den Wert preiszugeben. Am Startdatum lassen sich Tokens auseinanderhalten.
- Lokal: `tofu plan -detailed-exitcode` in `live` und `bootstrap` (Runbook `tofu-state.md`) muss 0 liefern.
- CI-Tokens vor dem Setzen lokal prüfen: mit den Read-only-Werten in `live` `tofu plan -lock=false` → 0; ohne `-lock=false` muss das Schreiben mit `403` scheitern (Nachweis „nur lesen“). Danach Actions → Drift-Check → Run workflow → grün.

## 5. Erfahrungen (T-39, 2026-11-18)

- Zweimal stand der falsche Wert in der `.env`: einmal der Token value eines R2-Tokens statt des Zonen-Tokens, einmal ein Secret Access Key, der zu einem anderen Token gehörte. Deshalb Werte immer **vom selben Bildschirm** und **pro Token** übernehmen und danach sofort prüfen (Abschnitt 4).
