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

# Den DS-Eintrag trägt der Inhaber nach dem Nameserver-Wechsel beim Registrar ein (T-38).
resource "cloudflare_zone_dnssec" "main" {
  zone_id = cloudflare_zone.main.id
  status  = "active"

  # Cloudflare meldet „pending“, bis der DS-Eintrag beim Registrar steht. Sonst zeigt jeder plan eine Änderung.
  # Mit T-38 (DS-Eintrag gesetzt, Status „active“) wird dieser Block entfernt.
  lifecycle {
    ignore_changes = [status]
  }
}
