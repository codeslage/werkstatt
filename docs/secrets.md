# Secrets & Tokens – Register

> Stand: 2026-11-12 · Bezug: Constitution VI und VII, `specs/04-fundament/spec.md` (AK-14)
> **Hier stehen nie Werte**, nur wer, wofür, welche Rechte und bis wann. Die Werte liegen lokal in `.env` (gitignoriert), in GitHub Secrets oder im Passwort-Manager des Inhabers.

| Name                                          | Wo hinterlegt                                                                                                                                    | Wofür                                                                | Rechte (minimal)                                                                                                                                             | Verwaltet von | Angelegt   | Läuft ab   |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------- | ---------- | ---------- |
| `PUBLIC_BLOCKLIST`                            | GitHub Secret (Repo `codeslage/werkstatt`): für Actions gesetzt; **für Dependabot noch offen** (Schritt des Inhabers); lokal Datei `.sperrliste` | Sperrliste für den Öffentlich-Scan (Ebene 2)                         | – (kein Token, vertraulicher Inhalt; nach jeder Änderung der Datei neu setzen)                                                                               | Inhaber       | 2026-11-06 | –          |
| `CLOUDFLARE_API_TOKEN` (`codeslage-tofu-rw`)  | lokal `.env`                                                                                                                                     | OpenTofu lokal: Zone und DNS, Bootstrap des State-Buckets            | Konto: Workers R2 Storage Edit (nur für den Bootstrap, Entzug in T-39); Zone `codeslage.de`: DNS Edit, Zone Read, Zone Settings Edit, Zone DNS Settings Edit | Inhaber       | 2026-11-12 | 2027-05-12 |
| `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` | lokal `.env`                                                                                                                                     | S3-Zugang zum State-Bucket, abgeleitet vom Token `codeslage-tofu-rw` | wie das R2-Recht des Tokens; in T-39 ersetzt durch einen Token nur für `codeslage-tofu-state`                                                                | Inhaber       | 2026-11-12 | 2027-05-12 |
| `TF_ENCRYPTION_PASSPHRASE`                    | lokal `.env`, Passwortmanager                                                                                                                    | Verschlüsselung von Tofu-State und -Plänen                           | –                                                                                                                                                            | Inhaber       | 2026-11-12 | –          |

Geplant (werden mit der jeweiligen Task ergänzt): `CF_API_TOKEN_RO`, `R2_STATE_RW`, `R2_STATE_RO` (T-39).

## Regeln

- Jeder Token bekommt nur die Rechte, die seine Aufgabe braucht; Lesen und Schreiben sind getrennte Tokens.
- Jeder Token hat ein Ablaufdatum, sofern der Anbieter es erlaubt. Vor Ablauf erneuert ihn der Inhaber und passt diese Tabelle an.
- Gerät ein Wert in die Öffentlichkeit: sofort widerrufen und neu erzeugen (`docs/prozess/governance.md`).
