# Protokoll T-32/T-35: Zugänge und State-Bucket

> Datum: 2026-11-12 · Tasks: T-32 (👤), T-35 (⛔) · AK: AK-5, AK-14 · PR: PR-14

## T-32 Zugänge (Schritt des Inhabers)

1. Zahlungsmethode in Cloudflare hinterlegt, R2 aktiviert (Free, 0 $). Der Inhaber hat die Bedingungen selbst bestätigt.
2. Token `codeslage-tofu-rw` als Account API token, das Formular hat Claude im Browser vorausgefüllt:
   - Konto: Workers R2 Storage Edit
   - Zone `codeslage.de`: DNS Edit, Zone Read, Zone DNS Settings Edit, Zone Settings Edit
   - gültig bis 2027-05-12

   Beim Ausfüllen sind einmal versehentlich Rechte unter „App Security“ markiert worden. Das wurde bemerkt, die Richtlinie verworfen und neu angelegt. Gegenprobe vor dem Erzeugen: alle anderen Kategorien auf 0.

3. `.env` mit Token, Passphrase und S3-Zugang. Prüfung ohne Werte: alle Felder gefüllt, Token aktiv, Zone `codeslage.de` und ihre vier Einträge lesbar, R2 erreichbar.
4. Die Konto-ID steht jetzt in der Sperrliste. Beide Secrets `PUBLIC_BLOCKLIST` (Actions und Dependabot) sind neu gesetzt.

## T-35 State-Bucket

5. `infra/tofu/bootstrap`: R2-Bucket `codeslage-tofu-state`, `jurisdiction = "eu"`, `location = "weur"`, `prevent_destroy`. Verschlüsselung von State und Plan erzwungen. Provider `cloudflare/cloudflare` 5.28.1; 5.29.0 war erst einen Tag alt und damit noch in der Wartezeit.
6. `tofu plan`: **1 to add, 0 to change, 0 to destroy.** Dem Inhaber vorgelegt und von ihm freigegeben, danach `tofu apply`.
7. Lokaler State nach dem `apply`: enthält nur `serial, lineage, meta, encrypted_data, encryption_version`, keine lesbaren Ressourcen.
8. `backend.tf` (S3-Backend auf R2, Endpoint per `-backend-config` aus der `.env`), dann `tofu init -migrate-state`. Bei Buckets im EU-Rechtsraum braucht es den Endpoint `….eu.r2.cloudflarestorage.com`, die `.env` wurde entsprechend angepasst.
9. Prüfungen nach der Migration:
   - `tofu state list` zeigt `cloudflare_r2_bucket.state`.
   - `tofu plan -detailed-exitcode` endet mit **0** (keine Änderungen).
   - Das Objekt `bootstrap.tfstate` im Bucket, roh über die API gelesen, enthält nur `encrypted_data`. **Kein Klartext.**
10. Lokale Reste gelöscht (leere `terraform.tfstate`, verschlüsselte `.backup` mit Serial 1, Plan-Datei). `*.tfplan` steht jetzt in der `.gitignore`.
11. Runbook `docs/runbooks/tofu-state.md`, `docs/secrets.md`, `.env.example` und `docs/dsgvo.md` (R2 im EU-Rechtsraum) aktualisiert.
