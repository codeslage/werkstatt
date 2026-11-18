# Zonen-Einstellungen laut Plan 04-fundament, Schritt 4.

resource "cloudflare_zone_setting" "ssl" {
  zone_id    = cloudflare_zone.main.id
  setting_id = "ssl"
  value      = "strict" # „Full (strict)“: Cloudflare prüft das Zertifikat des Ursprungs.
}

resource "cloudflare_zone_setting" "always_use_https" {
  zone_id    = cloudflare_zone.main.id
  setting_id = "always_use_https"
  value      = "on"
}

resource "cloudflare_zone_setting" "min_tls_version" {
  zone_id    = cloudflare_zone.main.id
  setting_id = "min_tls_version"
  value      = "1.2"
}

# Der DS-Eintrag steht seit T-38 beim Registrar (DNSKEY, Flags 257, Algorithmus 13).
resource "cloudflare_zone_dnssec" "main" {
  zone_id = cloudflare_zone.main.id
  status  = "active"
}
