# DNS-Einträge von codeslage.de, übernommen 1:1 aus dem Bestand (docs/runbooks/dns-bestand.md).
# Mail läuft über Google Workspace. Diese Einträge dürfen nie über den Cloudflare-Proxy laufen.

locals {
  zone_name = cloudflare_zone.main.name
}

resource "cloudflare_dns_record" "mx_google" {
  zone_id  = cloudflare_zone.main.id
  name     = local.zone_name
  type     = "MX"
  content  = "SMTP.GOOGLE.COM" # Schreibweise wie beim Import, sonst zeigt jeder plan eine Änderung
  priority = 1
  ttl      = 1 # 1 = automatisch
  proxied  = false
}

resource "cloudflare_dns_record" "spf" {
  zone_id = cloudflare_zone.main.id
  name    = local.zone_name
  type    = "TXT"
  content = "\"v=spf1 include:_spf.google.com ~all\""
  ttl     = 1
  proxied = false
}

# Öffentlicher Schlüssel aus der Google-Admin-Konsole. Länger als 255 Zeichen, daher in zwei TXT-Teilen.
resource "cloudflare_dns_record" "dkim_google" {
  zone_id = cloudflare_zone.main.id
  name    = "google._domainkey.${local.zone_name}"
  type    = "TXT"
  content = join(" ", [
    "\"v=DKIM1;k=rsa;p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0U0FsGHwcfyQEzOENbTmxjAsAxszAG9IMoha7+fBYLoKRSYTuzBJ15opoHabo/nCnZx8puhNfYv+ruP80wOblRmfgmzAyMVP4ESyY1OGo0nHuvAMQx2v1dKezG0UrAekuOG5dwqZB466tzZJ/ogfv6DXqSTxZPzC6ITfQq72hDq950wmji+LTAhm6Jom0vdff1t\"",
    "\"e5C3KfpNEx8facBlByWlJ2eNKTa034A/L6Q+FniO1l+RW1uAb8ptIGSYOM/DALOUmF3ZL7mO8cw/AfX1Qlzq5OaP3doTCV4nR1nCGVPJmw2nNhAkL5qMYc8SfU90q3rELh+yjwJgg8o32CtuKiQIDAQAB\"",
  ])
  ttl     = 1
  proxied = false
}

# Neu (AK-3). Erst beobachten (p=none), verschärft wird nach Auswertung der Berichte.
# Die Berichtsadresse (rua) von Cloudflare DMARC Management kommt mit T-38: Das gibt es erst für aktive Zonen.
resource "cloudflare_dns_record" "dmarc" {
  zone_id = cloudflare_zone.main.id
  name    = "_dmarc.${local.zone_name}"
  type    = "TXT"
  content = "\"v=DMARC1; p=none\""
  ttl     = 1
  proxied = false
}
