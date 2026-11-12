# Secrets & Tokens – Register

> Stand: 2026-11-05 · Bezug: Constitution VI und VII, `specs/04-fundament/spec.md` (AK-14)
> **Hier stehen nie Werte**, nur wer, wofür, welche Rechte und bis wann. Die Werte liegen lokal in `.env` (gitignoriert), in GitHub Secrets oder im Passwort-Manager des Inhabers.

| Name               | Wo hinterlegt                                                                                             | Wofür                                        | Rechte (minimal)                                                               | Verwaltet von | Angelegt   | Läuft ab |
| ------------------ | --------------------------------------------------------------------------------------------------------- | -------------------------------------------- | ------------------------------------------------------------------------------ | ------------- | ---------- | -------- |
| `PUBLIC_BLOCKLIST` | GitHub Secret (Repo `codeslage/werkstatt`, für Actions **und** für Dependabot); lokal Datei `.sperrliste` | Sperrliste für den Öffentlich-Scan (Ebene 2) | – (kein Token, vertraulicher Inhalt; nach jeder Änderung der Datei neu setzen) | Inhaber       | 2026-11-06 | –        |

Geplant (werden mit der jeweiligen Task ergänzt, siehe `specs/04-fundament/plan.md`): `CF_API_TOKEN_RW`, `CF_API_TOKEN_RO`, `R2_STATE_RW`, `R2_STATE_RO`, `TF_ENCRYPTION_PASSPHRASE`.

## Regeln

- Jeder Token bekommt nur die Rechte, die seine Aufgabe braucht; Lesen und Schreiben sind getrennte Tokens.
- Jeder Token hat ein Ablaufdatum, sofern der Anbieter es erlaubt. Vor Ablauf erneuert ihn der Inhaber und passt diese Tabelle an.
- Gerät ein Wert in die Öffentlichkeit: sofort widerrufen und neu erzeugen (`docs/prozess/governance.md`).
