# Change: Cloudflare-Provider 5.28.1 → 5.29.0

> Klasse: **K** · Status: **Umgesetzt** (#21, #22) · Stand: 2026-11-18
> Bezug: `CONSTITUTION.md` (v1.1.0), `docs/prozess/aenderungsklassen.md`, `specs/04-fundament/tasks.md` (T-37, Nachtrag vom 2026-11-18), Review `specs/04-fundament/reviews/dependabot-21-26.md`
> Notfall: nein

**Nachträglich angelegt:** Die Freigabe kam im Chat, bevor diese Seite existierte. Die Seite hält Prüfung und Freigabe fest, wie es `aenderungsklassen.md` für Klasse K verlangt (Review PR #38, Befund 3).

## Ziel

Dependabot hebt den Cloudflare-Provider in beiden Tofu-Wurzeln von 5.28.1 auf 5.29.0 (#21 `bootstrap`, #22 `live`). Provider-Updates berühren Infrastruktur und sind deshalb Klasse K, nicht M.

## Änderung

Dateien: `infra/tofu/bootstrap/versions.tf` und `.terraform.lock.hcl`, `infra/tofu/live/versions.tf` und `.terraform.lock.hcl`. Ressourcen ändern sich nicht.

Auszug `tofu plan -lock=false -detailed-exitcode` in `infra/tofu/live` (Branch von #22, lokal mit `.env`):

```text
cloudflare_zone_setting.ssl: Refreshing state... [id=ssl]
cloudflare_zone_setting.min_tls_version: Refreshing state... [id=min_tls_version]
cloudflare_zone_setting.always_use_https: Refreshing state... [id=always_use_https]

No changes. Your infrastructure matches the configuration.
```

Exit 0. In `infra/tofu/bootstrap`: `tofu init -backend=false` und `tofu validate` grün. Ein `plan` ist dort nicht möglich, weil `codeslage-tofu-rw` seit T-39 kein R2-Recht mehr hat (401, `docs/runbooks/tofu-state.md`, „Rechte“).

## Risiko & Rückweg

- **Risiko:** 5.29.0 liest den R2-Bucket in `bootstrap` anders und plant eine Änderung. Das fiele erst beim nächsten `bootstrap`-Plan auf. Der Bucket hat `prevent_destroy`, und `apply` führt nur der Inhaber nach geprüftem Plan aus (ADR 0002). Den Runbook-Weg (R2-Recht vorübergehend vergeben) haben wir für ein reines Versions-Update nicht genutzt, weil er Token-Rechte ändert.
- **Rückweg:** Version in `versions.tf` und Lockfile per PR auf 5.28.1 zurücksetzen.

## Nachweis

| Prüfung                                    | Testart       | Ergebnis                         |
| ------------------------------------------ | ------------- | -------------------------------- |
| `tofu plan` in `live` ohne Änderungen      | manuell       | ✅ 2026-11-18, Exit 0            |
| `tofu validate` in `bootstrap`             | manuell       | ✅ 2026-11-18                    |
| CI „Infra (OpenTofu)“ und Drift-Check grün | automatisiert | ✅ auf den Head-SHAs von #21/#22 |

## Constitution-Kurzcheck

- V ✅ keine zerstörerische Aktion, kein `apply`
- VII ✅ Token-Rechte unverändert
- X ✅ Versionen per Lockfile festgeschrieben
- XI ✅ Update automatisiert per Dependabot-PR

## Review

Ergebnis des Agents `code-reviewer`: siehe `specs/04-fundament/reviews/dependabot-21-26.md` (Review der Dependabot-PRs #21 bis #26), dazu Review PR #38 (`specs/04-fundament/reviews/abschluss-pr12-provider.md`).

## Freigabe

Freigegeben durch den Inhaber am: 2026-11-18 (im Chat)
