provider "cloudflare" {
  # Token kommt aus CLOUDFLARE_API_TOKEN (Rechte: docs/secrets.md).
}

# Speicher für die verschlüsselten States aller Tofu-Wurzeln (bootstrap, live).
# EU-Rechtsraum: Daten bleiben in der EU (Constitution VIII).
resource "cloudflare_r2_bucket" "state" {
  account_id   = var.account_id
  name         = "codeslage-tofu-state"
  jurisdiction = "eu"
  location     = "weur"

  # Ohne diesen Bucket ist der State aller Wurzeln weg: Löschen nur bewusst (Constitution V).
  lifecycle {
    prevent_destroy = true
  }
}
