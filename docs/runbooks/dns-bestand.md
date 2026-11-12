# Runbook: DNS-Bestand und Umzug von `codeslage.de` zu Cloudflare

> Stand: 2026-11-12 · Bezug: `specs/04-fundament/spec.md` (AK-3, AK-4), `plan.md` Schritt 4, Tasks T-33 bis T-38
> Angaben zum Registrar und zu Konten stehen nur im internen Repo (`codeslage-internal/betrieb/konten.md`).

## 1. Bestand vor dem Umzug (2026-11-12)

Abgefragt über die öffentliche Auflösung (Resolver 1.1.1.1). Die Nameserver gehören noch dem Registrar.

| Typ | Name                | Inhalt                                | Zweck            | Ziel bei Cloudflare                                          |
| --- | ------------------- | ------------------------------------- | ---------------- | ------------------------------------------------------------ |
| MX  | `codeslage.de`      | `smtp.google.com`, Priorität 1        | Google Workspace | übernehmen, nur DNS                                          |
| TXT | `codeslage.de`      | `v=spf1 include:_spf.google.com ~all` | SPF              | übernehmen                                                   |
| TXT | `google._domainkey` | `v=DKIM1; k=rsa; p=…` (2048 Bit)      | DKIM von Google  | übernehmen (Wert aus der Google-Admin-Konsole bzw. dem Scan) |
| A   | `codeslage.de`      | Parkseite des Registrars              | Platzhalter      | **entfällt** (Entscheidung des Inhabers, 2026-11-12)         |
| –   | `_dmarc`            | fehlt                                 | DMARC            | **neu:** `v=DMARC1; p=none` mit Reporting (AK-3)             |
| –   | `www`               | fehlt                                 | –                | bleibt leer bis Phase 2                                      |

Der Scan von Cloudflare beim Anlegen der Zone hat genau diese vier vorhandenen Einträge gefunden. Weitere Einträge, etwa Subdomains, gibt es nicht.

**Zum A-Eintrag:** Er zeigt auf die Parkseite des Registrars („Domainpark“). Unter HTTPS ist sie nicht erreichbar, und mit „SSL Full (strict)“ hinter dem Cloudflare-Proxy würde sie nicht funktionieren. Die Webseite kommt erst in Phase 2 (Cloudflare Pages). Bis dahin löst `codeslage.de` im Browser bewusst nicht auf. Mail ist davon nicht betroffen.

## 2. Zone bei Cloudflare anlegen (einmalig, Klick im Dashboard)

Diesen Schritt hat der Inhaber am 2026-11-12 im Dashboard erledigt. Grund: So kann der Tofu-Token auf genau diese Zone beschränkt bleiben. Für das Anlegen per API bräuchte er Rechte auf alle Domains des Kontos.

1. Domains → Add domain → `codeslage.de` → Plan **Free**.
2. Cloudflare scannt die vorhandenen Einträge und übernimmt sie (siehe Tabelle oben).
3. **Nameserver beim Registrar noch nicht umstellen.** Die Zone bleibt „pending“, bis T-38 dran ist.

OpenTofu übernimmt die Zone und ihre Einträge danach per Import (T-36). Ab dann ändert sich nichts mehr im Dashboard.

## 3. Umzug (T-38)

Wird mit T-38 ausgefüllt: TTL beim Registrar senken, DNS-Test gegen die Cloudflare-Nameserver, Nameserver umstellen, DS-Eintrag für DNSSEC, Testmail in beide Richtungen.

## 4. Rückweg

Bis die Nameserver beim Registrar umgestellt sind, hat nichts davon eine Wirkung nach außen. Danach gilt: Beim Registrar wieder die alten Nameserver eintragen. Die alten Einträge sind dort unverändert und greifen nach Ablauf der TTL wieder.
