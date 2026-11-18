# Runbook: DNS-Bestand und Umzug von `codeslage.de` zu Cloudflare

> Stand: 2026-11-18 (Verweis auf `codeslage/internal`) · Bezug: `specs/04-fundament/spec.md` (AK-3, AK-4), `plan.md` Schritt 4, Tasks T-33 bis T-38
> Angaben zum Registrar und zu Konten stehen nur im internen Repo (`codeslage/internal` (`betrieb/konten.md`)).

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

## 2a. Übernahme in OpenTofu (T-36, erledigt am 2026-11-17)

- `infra/tofu/live` verwaltet die Zone, MX, SPF, DKIM, DMARC (`p=none`), die Einstellungen (SSL Full strict, Always HTTPS, Mindest-TLS 1.2) und DNSSEC. Arbeiten damit wie in `docs/runbooks/tofu-state.md`, nur im Ordner `live`.
- Der A-Eintrag der Parkseite ist gelöscht (einmaliger API-Aufruf mit Freigabe, Protokoll `docs/protokolle/2026-11-17-t-36-tofu-live.md`).
- DMARC-Berichtsadresse und DS-Eintrag kamen mit T-38 dazu (Abschnitt 3). Seitdem prüft OpenTofu auch den DNSSEC-Status: Ein Abschalten im Dashboard zeigt `tofu plan` als Änderung.

## 3. Umzug (T-38)

Erledigt am 2026-11-17 (Protokoll `docs/protokolle/2026-11-17-t-38-ns-umzug.md`). Ablauf für einen erneuten Umzug:

1. DNS-Test gegen den neuen Nameserver: `DNS_SERVER=<ns> pnpm test:infra dns.test.ts` muss grün sein, bevor umgestellt wird.
2. Beim Registrar die neuen Nameserver eintragen (ohne Glue Records). Besonderheiten des Registrars: `codeslage/internal` (`betrieb/konten.md`).
3. Warten, bis die Registry (`nslookup -type=NS codeslage.de a.nic.de`) die neuen Nameserver meldet und die Zone bei Cloudflare `active` ist.
4. DNSSEC: Beim Registrar den DNSKEY eintragen (Flags 257, Algorithmus 13, öffentlicher Schlüssel aus `cloudflare_zone_dnssec` bzw. der API). Bei einem Wechsel weg von Cloudflare **zuerst** den DNSSEC-Eintrag beim Registrar löschen und den Ablauf der TTL abwarten, sonst ist die Domain für prüfende Resolver nicht erreichbar. Prüfen, ob der DS-Eintrag steht und die Signatur gilt: `curl -s -H "accept: application/dns-json" "https://cloudflare-dns.com/dns-query?name=codeslage.de&type=DS"` muss einen Eintrag und `"AD":true` liefern (`nslookup` unter Windows kennt den Typ DS nicht).
5. DNS-Test über die öffentliche Auflösung, Testmail in beide Richtungen.

## 4. Rückweg

1. Beim Registrar den DNSSEC-Eintrag löschen.
2. **Warten**, bis der DS-Eintrag bei der Registry verschwunden und seine TTL (derzeit 86400 s, also 24 h) abgelaufen ist. Prüfen wie in Abschnitt 3, Schritt 4: Die Abfrage darf keinen DS-Eintrag mehr liefern. Wer früher umstellt, riskiert SERVFAIL bei prüfenden Resolvern, auch für MX, und damit Ausfall der Mail.
3. Erst dann wieder die Nameserver des Registrars eintragen. Ob die alte Zone dort noch existiert, ist offen (siehe intern `betrieb/konten.md`). Fehlen die Einträge, sie nach der Tabelle in Abschnitt 1 neu anlegen (MX, SPF, DKIM, dazu DMARC).
