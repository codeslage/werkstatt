# Protokoll: Cloudflare-Provider 5.29.0 (#21, #22)

> Datum: 2026-11-18 · Task: T-37 (Nachweis Ökosystem `opentofu`, AK-29) · Klasse K (Infrastruktur, Review `reviews/dependabot-21-26.md`)

1. **Freigabe:** vom Inhaber im Chat erteilt (2026-11-18).
2. **`live`:** Branch von #22 mit `.env` initialisiert (Provider 5.29.0 installiert, signiert), `tofu plan -lock=false -detailed-exitcode`: „No changes“, Exit 0.
3. **`bootstrap`:** `tofu init -backend=false` und `tofu validate` grün. Ein echter `plan` ist hier nicht möglich: `codeslage-tofu-rw` hat seit T-39 kein R2-Recht mehr, der `plan` scheitert mit 401 (`docs/runbooks/tofu-state.md`, Abschnitt „Rechte“). Das Update ändert nur Version und Lockfile; die Ressource (Bucket mit `prevent_destroy`) bleibt unverändert.
4. Beide Branches per `gh pr update-branch` auf `main` gebracht (neuer Pflicht-Check aus #37). CI und Drift-Check auf den Head-SHAs grün. Merge per Squash mit `--match-head-commit`: #22 (`105e0e9`), #21 (`f99c060`).
5. **Beobachtung:** `tofu init` auf dem Mac ergänzt im Lockfile einen Hash für `darwin_arm64`. Die lokale Änderung wurde verworfen; die CI braucht nur die Linux-Hashes. Fällt das wieder auf, kann `tofu providers lock -platform=…` alle Plattformen eintragen (eigener Change).
