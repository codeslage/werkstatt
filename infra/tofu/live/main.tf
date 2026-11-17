provider "cloudflare" {
  # Token kommt aus CLOUDFLARE_API_TOKEN (Rechte: docs/secrets.md).
}

# Die Zone hat der Inhaber im Dashboard angelegt, damit der Token auf diese Zone beschränkt bleibt
# (docs/runbooks/dns-bestand.md, Abschnitt 2). OpenTofu verwaltet sie ab der Übernahme.
resource "cloudflare_zone" "main" {
  account = {
    id = var.account_id
  }
  name = "codeslage.de"
  type = "full"

  # Ohne Zone keine Mail: Löschen nur bewusst (Constitution V).
  lifecycle {
    prevent_destroy = true
  }
}
