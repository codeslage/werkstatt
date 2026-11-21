# Runbook: OpenTofu-State in Cloudflare R2

> Stand: 2026-11-12 · Bezug: ADR 0002, `specs/04-fundament/plan.md` Schritt 4, Task T-35

## Überblick

- Alle Tofu-Wurzeln (`infra/tofu/bootstrap`, `infra/tofu/live`) speichern ihren State im R2-Bucket **`codeslage-tofu-state`**, ein Objekt je Wurzel (`bootstrap.tfstate`, `live.tfstate`).
- Der Bucket liegt im **EU-Rechtsraum** von R2 (Constitution VIII). Dafür gibt es einen eigenen Endpoint: `https://<konto-id>.eu.r2.cloudflarestorage.com`.
- State und Pläne sind **immer verschlüsselt** (AES-GCM, Schlüssel per PBKDF2 aus `TF_ENCRYPTION_PASSPHRASE`). Ohne Passphrase sind sie unlesbar, deshalb liegt sie zusätzlich im Passwortmanager des Inhabers.
- `tofu apply` führt nur der Inhaber lokal aus, nach einem gemeinsam geprüften `plan` (ADR 0002, Constitution V).

## Lokal arbeiten

Voraussetzung: die lokale `.env` (Namen in `.env.example`, Register in `docs/secrets.md`).

```bash
set -a; . ./.env; set +a
export TF_VAR_account_id="$CLOUDFLARE_ACCOUNT_ID" TF_VAR_state_passphrase="$TF_ENCRYPTION_PASSPHRASE"
cd infra/tofu/bootstrap   # bzw. infra/tofu/live
tofu init -backend-config="endpoints={s3=\"$R2_ENDPOINT\"}"
tofu plan
```

Die Konto-ID steht nie im Code. Sie kommt nur über `TF_VAR_account_id` und den Endpoint herein (`governance.md`, „Öffentlich vs. intern“).

## Prüfen vor dem PR

Dieselben Prüfungen wie der CI-Job „Code / IaC (OpenTofu)“ (`cwk-code.yml`; tflint 0.66.0 aus den Releases von `terraform-linters/tflint`, Prüfsumme vergleichen):

```bash
tofu fmt -check -recursive infra/tofu
for root in infra/tofu/*/; do
  tofu -chdir="$root" init -backend=false -input=false
  tofu -chdir="$root" validate
  tflint --chdir="$root" --config="$PWD/.tflint.hcl"
done
pnpm test:infra hcl.test.ts
```

## Erstaufbau (Henne-Ei, einmalig am 2026-11-12 erledigt)

Der Bucket für den State muss existieren, bevor ein State darin liegen kann. Deshalb:

1. `bootstrap` **ohne** `backend.tf` initialisieren. Der State liegt dann lokal und ist trotzdem verschlüsselt.
2. `tofu plan`, Freigabe durch den Inhaber, `tofu apply`: Der Bucket entsteht.
3. `backend.tf` anlegen und `tofu init -migrate-state -force-copy -backend-config=…` ausführen: Der State wandert in den Bucket.
4. Prüfen: `tofu state list` zeigt den Bucket, `tofu plan -detailed-exitcode` endet mit 0, das Objekt im Bucket enthält nur `encrypted_data`.
5. Lokale Reste (`terraform.tfstate`, `.backup`, `*.tfplan`) löschen. Ab dann gibt es nur noch die Kopie in R2.

## Rechte

Seit T-39 (`docs/secrets.md`):

- Der State-Zugriff läuft über R2-Tokens, die nur für den Bucket `codeslage-tofu-state` gelten: `codeslage-tofu-state-rw` lokal (`AWS_ACCESS_KEY_ID`/`AWS_SECRET_ACCESS_KEY` in der `.env`), `codeslage-tofu-state-ro` in der CI.
- `codeslage-tofu-rw` hat kein R2-Recht mehr. Für den Erstaufbau hatte er „Workers R2 Storage: Edit“ auf das ganze Konto.
- Folge: `tofu plan` in `bootstrap` liest den Bucket über die Cloudflare-API und braucht dafür dieses Recht; ohne es scheitert er mit `401` (so erwartet, geprüft 2026-11-18). Muss am Bucket etwas geändert werden, dem Token das Recht vorübergehend wieder geben, danach wieder entziehen und beides im Protokoll festhalten.

## Drift-Check (AK-5)

`.github/workflows/drift.yml` führt jeden Montag, bei jedem PR auf `infra/` und auf Knopfdruck (Actions → Drift-Check → Run workflow) `tofu plan -detailed-exitcode` für `live` aus, dazu den DNS-Test. Nur mit Read-only-Tokens und ohne Lock, `apply` bleibt lokal (ADR 0002).

- **Rot im PR auf `infra/`:** erwartet, solange der geprüfte `plan` noch nicht lokal angewendet ist. Nach dem `apply` den Lauf neu starten, er muss grün sein, bevor gemergt wird.
- **Rot im wöchentlichen Lauf:** Jemand hat im Dashboard etwas geändert, oder ein Token ist abgelaufen. Im Log steht, welche Ressource abweicht (IDs sind maskiert). Entweder die Änderung im Dashboard zurücknehmen oder in den Code übernehmen (eigener PR).
- **Benachrichtigung testen (AK-27):** Run workflow mit Haken bei `simulate_failure`. Der Lauf bricht im ersten Schritt ab, GitHub schickt die Fehler-Mail. Nicht starten, während ein echter Drift-Lauf auf demselben Branch läuft: Der neue Lauf bricht ihn ab (`cancel-in-progress`).
- `bootstrap` prüft der Drift-Check nicht: Der Read-only-Token hat bewusst keine Rechte auf Kontoebene.

## Notfall

- **Passphrase verloren:** Der State ist nicht mehr lesbar. Die Ressourcen bestehen weiter, OpenTofu muss sie mit einer neuen Passphrase per `import` neu übernehmen.
- **Bucket gelöscht:** `prevent_destroy` schützt nur vor OpenTofu, nicht vor einem Löschen im Dashboard oder per API. Wiederherstellung: In `bootstrap` vorübergehend `backend.tf` entfernen und den Bucket wie beim Erstaufbau neu anlegen (Plan zeigen, Freigabe, `apply`, Migration). Danach übernimmt jede Wurzel ihre bestehenden Ressourcen per `tofu import` wieder in einen neuen State. Die Ressourcen selbst (Zone, DNS) sind von einem verlorenen State nicht betroffen. Löschen nur nach ausdrücklicher Freigabe (Constitution V).
