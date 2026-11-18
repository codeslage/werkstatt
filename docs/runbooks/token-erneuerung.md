# Runbook: Cloudflare-Tokens erneuern

> Stand: 2026-11-18 · Bezug: `docs/secrets.md` (Register, AK-14), `docs/runbooks/tofu-state.md`, Constitution VI und VII
> Nächster Termin: **alle Cloudflare-Tokens laufen am 2027-05-12 ab.** Erneuern spätestens zwei Wochen vorher.

## 1. Welche Tokens, was hängt daran

| Token (Cloudflare)        | Art                  | Werte und wo sie liegen                                                                                          | Wer bricht, wenn er abläuft |
| ------------------------- | -------------------- | ---------------------------------------------------------------------------------------------------------------- | --------------------------- |
| `codeslage-tofu-rw`       | Account API Token    | Token-Wert → `.env` `CLOUDFLARE_API_TOKEN`                                                                       | `tofu plan`/`apply` lokal   |
| `codeslage-tofu-state-rw` | Account API Token R2 | Access Key ID / Secret Access Key → `.env` `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY`                         | jeder lokale Tofu-Befehl    |
| `codeslage-tofu-ro`       | Account API Token    | Token-Wert → GitHub Secret `CF_API_TOKEN_RO`                                                                     | Drift-Check                 |
| `codeslage-tofu-state-ro` | Account API Token R2 | Access Key ID / Secret Access Key → GitHub Secrets `R2_STATE_RO_ACCESS_KEY_ID` / `R2_STATE_RO_SECRET_ACCESS_KEY` | Drift-Check                 |

GitHub Secrets gibt es jeweils zweimal: für Actions und für Dependabot. Alle Werte stehen zusätzlich im Passwortmanager des Inhabers.

Ein R2-Token zeigt beim Anlegen oder Rollen **drei** Werte: Token value, Access Key ID, Secret Access Key. OpenTofu braucht nur die beiden letzten. Der Token value gehört in **keine** Zeile der `.env`.

## 2. Anzeichen

- Drift-Check rot mit `401`, `403`, `9109` oder `SignatureDoesNotMatch`.
- Lokal: `tofu init` scheitert mit `SignatureDoesNotMatch` (R2-Schlüssel) oder `plan` mit `403` (Cloudflare-Token).

## 3. Erneuern (je Token)

1. Cloudflare → Manage Account → Account API Tokens → beim Token **⋯ → Roll**. Der alte Wert ist danach sofort ungültig.
2. Beim Token **Edit** → TTL: neues Enddatum (bisher halbjährlich). Rechte dabei nicht ändern, sie stehen in `docs/secrets.md`.
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
