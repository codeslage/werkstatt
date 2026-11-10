# ADR 0001 – Hosting-Anbieter: Hetzner Cloud

> Status: **Vertagt** bis Phase S (ADR 0009) · Stand: 2026-11-05
> Vergleich nach Rückfrage des Inhabers auf alle Kandidaten erweitert, danach Preise auf den Originalseiten geprüft.
> Bezug: `specs/02-architektur.md` (A3, Recherche R1), ADR 0009

## Nachtrag 2026-11-05: Prüfung auf den Anbieterseiten

Die Prüfung direkt auf hetzner.com und upcloud.com hat die Entscheidung unten gekippt:

| Angebot                                | Laut Anbieterseite                                                                                                            | Monatlich (brutto, 19 % MwSt.) |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| Hetzner CX33 (Cost-Optimized)          | **nicht bestellbar**, ebenso die ganze Linie CX23–CX53 und CAX; Grund laut Hetzner: weiterverwendete Hardware, Menge begrenzt | –                              |
| Hetzner CPX22 (2 vCPU, 4 GB)           | bestellbar                                                                                                                    | 23,79 €                        |
| Hetzner CPX32 (4 vCPU, 8 GB)           | bestellbar                                                                                                                    | 42,83 €                        |
| UpCloud Starter 4 GB / 2 Kerne / 30 GB | IPv4 inkl., Abrechnung stündlich, max. 28 Tage/Monat                                                                          | 12 € netto ≈ 14,28 €           |
| UpCloud Starter 8 GB / 4 Kerne / 40 GB | dto.                                                                                                                          | 20 € netto ≈ 23,80 €           |

Weil der Inhaber keine Vorsteuer abzieht und das Projekt noch nichts einbringt, kommt der Server erst bei Bedarf (ADR 0009). Diese Entscheidung wird in Phase S mit den dann gültigen Preisen neu getroffen. Der Vergleich unten bleibt als Ausgangspunkt stehen.

Lehre: Preise aus Vergleichsseiten erst nach einem Blick auf die Bestellseite verwenden, denn Listenpreis heißt nicht bestellbar.

## Kontext

Wir brauchen einen Cloud-Server mit ~4 vCPU / 8 GB RAM in der EU (bevorzugt DE). Er muss ins Budget passen (≤ ~10–15 €/Monat gesamt) und sich vollständig per OpenTofu verwalten lassen, inklusive einer Firewall **vor** dem Server. Diese Firewall trägt das Zugriffskonzept (A4, AK-7): Docker umgeht `ufw`, nur 80/443 aus den Cloudflare-Netzen dürfen durch, und das bei etwa 15 IPv4- und 7 IPv6-Bereichen.

## Vergleich

Preise Stand 2026-11-05, überwiegend aus Sekundärquellen, Netto-Monatspreise sofern nicht anders angegeben. Vor der Bestellung auf der Anbieterseite prüfen.

| Anbieter / Typ                            | 4 vCPU / 8 GB, Preis                                                 | Standort DE                            | Muss: Tofu-Provider (Server, Firewall, Keys) | Soll: Firewall vor dem Server                                            | Ergebnis                                                                      |
| ----------------------------------------- | -------------------------------------------------------------------- | -------------------------------------- | -------------------------------------------- | ------------------------------------------------------------------------ | ----------------------------------------------------------------------------- |
| **Hetzner Cloud CX33**                    | ca. **8,99 €** inkl. IPv4 (nach Erhöhung im Juni 2026)               | ✅ Nürnberg, Falkenstein               | ✅ offiziell (`hetznercloud/hcloud`)         | ✅ Cloud-Firewall, kostenlos, per API                                    | **gewählt**                                                                   |
| Hetzner Cloud CAX21 (ARM)                 | ca. 10,49 €                                                          | ✅ Falkenstein                         | ✅                                           | ✅                                                                       | nach der Preisrunde teurer als CX33, ARM-Images nötig → nein                  |
| OVHcloud VPS-2                            | ca. 8,50 $ (75 GB)                                                   | ✅ (Frankfurt teils nur größere Typen) | ⚠️ VPS im Provider nur eingeschränkt         | ⚠️ Edge Network Firewall: max. 20 Regeln pro IP, als DDoS-Filter gedacht | Firewall-Konzept passt nicht → nein                                           |
| OVHcloud Public Cloud                     | kleinste VM ab ca. 15 €, 8 GB deutlich darüber (nicht genau geprüft) | ✅                                     | ✅ (OpenStack)                               | ✅ Security Groups                                                       | über Budget → nein                                                            |
| IONOS VPS L+                              | 25 $ regulär (8 $ nur 3 Monate Aktion, 1 Jahr Bindung)               | ✅                                     | ❌ VPS-Linie nicht im `ionoscloud`-Provider  | ✅ (nur im Panel)                                                        | Muss verfehlt → nein                                                          |
| IONOS Cloud Cubes                         | passende Größe nicht eindeutig belegt, Spanne bis 90 $               | ✅                                     | ✅ (`ionoscloud_cube_server`)                | ✅                                                                       | teurer und unklar → nein                                                      |
| UpCloud Cloud Native 8 GB                 | ca. 20 € (Premium ca. 52 €)                                          | ✅ Frankfurt                           | ✅ offiziell                                 | ✅ eingebaut                                                             | **zweite Wahl**: technisch gleichwertig, gut doppelt so teuer                 |
| Scaleway DEV1-L                           | ca. 31 € (+ IPv4)                                                    | ❌ (FR, NL, PL)                        | ✅ offiziell                                 | ✅ Security Groups                                                       | Budget und Standort → nein                                                    |
| STACKIT c1.3                              | ca. 99 €                                                             | ✅                                     | ✅ offiziell                                 | ✅                                                                       | Faktor 10 über Budget → nein                                                  |
| netcup VPS 1000 G12                       | ca. 10,37 € brutto (256 GB)                                          | ✅ Nürnberg                            | ❌ kein offizieller Provider                 | ❌ nur auf dem Server                                                    | Muss verfehlt → nein                                                          |
| Contabo Cloud VPS 20                      | ca. 7–8 € (6 vCPU, 12 GB)                                            | ✅                                     | ❌ kein offizieller Provider gefunden        | ❌/unklar (Quellen widersprechen sich)                                   | Muss verfehlt → nein                                                          |
| DigitalOcean, Vultr, Akamai (EU-Regionen) | nicht im Detail geprüft                                              | ✅ Frankfurt                           | ✅                                           | ✅                                                                       | US-Firmen (CLOUD Act), erfahrungsgemäß deutlich teurer; nicht weiter verfolgt |

## Entscheidung

**Hetzner Cloud, Typ CX33, Standort Nürnberg**, Projekt `codeslage`.

Hetzner ist der einzige Anbieter, der alle drei harten Punkte zugleich erfüllt: Preis im Budget, offizieller Tofu-Provider und eine kostenlose, per API steuerbare Firewall vor dem Server.

Die günstigeren oder großzügigeren Angebote (netcup, Contabo, IONOS VPS, OVH VPS) scheitern alle an derselben Stelle: Server oder Firewall lassen sich nicht sauber als Code verwalten. Bei OVH reichen 20 Regeln pro IP nicht für „nur 80/443 aus allen Cloudflare-Netzen“. Wer alle Ports für Cloudflare öffnet, macht die Coolify-Ports für Cloudflare Workers erreichbar.

**UpCloud** ist die ehrliche zweite Wahl. Technisch gleichwertig, Frankfurt, offizieller Provider, eingebaute Firewall, aber etwa 20 € statt 9 €. Dazu ist UpCloud bei DACH-Startups weniger bekannt (Kann-Kriterium).

## Hinweis zur Entstehung

Die erste Fassung dieses ADR hatte nur Hetzner und netcup recherchiert und die übrigen Kandidaten ungeprüft abgehakt. Hetzner war in `02-architektur.md` schon als Beispiel angelegt (z. B. „Hetzner-Web-Konsole“). Diese Fassung prüft alle Kandidaten aus R1 und ergänzt UpCloud, Contabo und die US-Anbieter. Das Ergebnis bleibt gleich, steht jetzt aber auf einem Vergleich.

## Folgen

- Kosten Server ≈ 10,70 €/Monat brutto; Puffer im Budget (AK-15). Bei weiteren Preiserhöhungen ist UpCloud die Ausweichoption.
- Hetzner wird als Auftragsverarbeiter in `docs/dsgvo.md` erfasst (AVV im Hetzner-Konto abschließen).
- Shared vCPU: bei Engpässen Rescale auf einen größeren Typ, ohne Neuinstallation.
- Die Firewall-Regeln stecken in `modules/server`. Ein Anbieterwechsel bedeutet, dieses Modul neu zu schreiben; cloud-init und alles darüber bleiben gleich.
- Die Verfügbarkeit der CX-Linie schwankt laut Berichten. Ist CX33 bei der Bestellung nicht verfügbar, gilt der nächstgrößere Typ mit gleichem Preisrahmen, oder es geht zurück zu dieser Entscheidung.

## Quellen

- [Better Stack: Hetzner Cloud Review 2026](https://betterstack.com/community/guides/web-servers/hetzner-cloud-review/)
- [Northflank: Hetzner cloud server price increases in 2026](https://northflank.com/blog/hetzner-cloud-server-price-increases)
- [prismix: Hetzner Price Adjustment](https://prismix.dev/news/e099eaeb0874)
- [OVHcloud: VPS Deutschland](https://www.ovhcloud.com/en/vps/vps-deutschland/)
- [OVHcloud: Edge Network Firewall](https://docs.ovhcloud.com/en/guides/bare-metal-cloud/dedicated-servers/firewall-network)
- [eucloudcost: OVHcloud Pricing 2026](https://www.eucloudcost.com/providers/ovh/)
- [IONOS: VPS](https://www.ionos.com/servers/vps)
- [usagepricing: IONOS Cloud Cubes](https://www.usagepricing.com/blueprint/ionos)
- [UpCloud: Pricing](https://upcloud.com/pricing/)
- [UpCloud: Starter Plans (Terraform, Firewall)](https://upcloud.com/global/solutions/starter-plans/)
- [Scaleway: Pricing update](https://www.scaleway.com/en/blog/a-transparent-update-on-scaleway-pricing/)
- [STACKIT: Compute Engine](https://stackit.com/en/products/compute-engine/stackit-compute-engine)
- [Valebyte: netcup review 2026](https://valebyte.com/en/blog/netcup-review-2026-the-price-performance-king-and-its-fine-print/)
- [afftank: Contabo Review 2026](https://afftank.com/blog/contabo-review)
