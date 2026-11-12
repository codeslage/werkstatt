# Runbook: OpenTofu-State in Cloudflare R2

> Stand: 2026-11-12 · Bezug: ADR 0002, `specs/04-fundament/plan.md` Schritt 4, Task T-35

## Überblick

- Alle Tofu-Wurzeln (`infra/tofu/bootstrap`, später `infra/tofu/live`) speichern ihren State im R2-Bucket **`codeslage-tofu-state`**, ein Objekt je Wurzel (`bootstrap.tfstate`, `live.tfstate`).
- Der Bucket liegt im **EU-Rechtsraum** von R2 (Constitution VIII). Dafür gibt es einen eigenen Endpoint: `https://<konto-id>.eu.r2.cloudflarestorage.com`.
- State und Pläne sind **immer verschlüsselt** (AES-GCM, Schlüssel per PBKDF2 aus `TF_ENCRYPTION_PASSPHRASE`). Ohne Passphrase sind sie unlesbar, deshalb liegt sie zusätzlich im Passwortmanager des Inhabers.
- `tofu apply` führt nur der Inhaber lokal aus, nach einem gemeinsam geprüften `plan` (ADR 0002, Constitution V).

## Lokal arbeiten

Voraussetzung: die lokale `.env` (Namen in `.env.example`, Register in `docs/secrets.md`).

```bash
set -a; . ./.env; set +a
export TF_VAR_account_id="$CLOUDFLARE_ACCOUNT_ID" TF_VAR_state_passphrase="$TF_ENCRYPTION_PASSPHRASE"
cd infra/tofu/bootstrap
tofu init -backend-config="endpoints={s3=\"$R2_ENDPOINT\"}"
tofu plan
```

Die Konto-ID steht nie im Code. Sie kommt nur über `TF_VAR_account_id` und den Endpoint herein (`governance.md`, „Öffentlich vs. intern“).

## Erstaufbau (Henne-Ei, einmalig am 2026-11-12 erledigt)

Der Bucket für den State muss existieren, bevor ein State darin liegen kann. Deshalb:

1. `bootstrap` **ohne** `backend.tf` initialisieren. Der State liegt dann lokal und ist trotzdem verschlüsselt.
2. `tofu plan`, Freigabe durch den Inhaber, `tofu apply`: Der Bucket entsteht.
3. `backend.tf` anlegen und `tofu init -migrate-state -force-copy -backend-config=…` ausführen: Der State wandert in den Bucket.
4. Prüfen: `tofu state list` zeigt den Bucket, `tofu plan -detailed-exitcode` endet mit 0, das Objekt im Bucket enthält nur `encrypted_data`.
5. Lokale Reste (`terraform.tfstate`, `.backup`, `*.tfplan`) löschen. Ab dann gibt es nur noch die Kopie in R2.

## Rechte und nächster Schritt

Für den Erstaufbau hat der Token `codeslage-tofu-rw` das Recht „Workers R2 Storage: Edit“ auf das ganze Konto. Mit T-39 bekommt der State-Zugriff eigene, auf diesen Bucket beschränkte R2-Tokens (lesen und schreiben lokal, nur lesen in der CI), und `codeslage-tofu-rw` verliert das R2-Recht (`docs/secrets.md`).

## Notfall

- **Passphrase verloren:** Der State ist nicht mehr lesbar. Die Ressourcen bestehen weiter, OpenTofu muss sie mit einer neuen Passphrase per `import` neu übernehmen.
- **Bucket gelöscht:** `prevent_destroy` schützt nur vor OpenTofu, nicht vor einem Löschen im Dashboard oder per API. Wiederherstellung: In `bootstrap` vorübergehend `backend.tf` entfernen und den Bucket wie beim Erstaufbau neu anlegen (Plan zeigen, Freigabe, `apply`, Migration). Danach übernimmt jede Wurzel ihre bestehenden Ressourcen per `tofu import` wieder in einen neuen State. Die Ressourcen selbst (Zone, DNS) sind von einem verlorenen State nicht betroffen. Löschen nur nach ausdrücklicher Freigabe (Constitution V).
