# Webseite codeslage.de auf Cloudflare Pages (Plan 06, Schritt 5; ADR 0015).
# Entwurf bis zum Livegang (T-25): erst nach dem OK des Inhabers `apply`, dann sofort mergen.
# Diese Datei legt nur Einträge für @ und www an, nie MX oder TXT (AK-13, geprüft in infra/tests/hcl.test.ts).

# Direct Upload: kein `source`-Block, die CI lädt den fertigen Build mit wrangler hoch (T-26).
resource "cloudflare_pages_project" "web" {
  account_id        = var.account_id
  name              = "codeslage-web"
  production_branch = "main"
}

resource "cloudflare_pages_domain" "apex" {
  account_id   = var.account_id
  project_name = cloudflare_pages_project.web.name
  name         = local.zone_name
}

resource "cloudflare_pages_domain" "www" {
  account_id   = var.account_id
  project_name = cloudflare_pages_project.web.name
  name         = "www.${local.zone_name}"
}

# Am Apex löst Cloudflare den CNAME selbst auf (CNAME-Flattening). Beide Einträge laufen über den Proxy,
# sonst greifen weder HTTPS-Weiterleitung noch die Redirect-Regel.
resource "cloudflare_dns_record" "web_apex" {
  zone_id = cloudflare_zone.main.id
  name    = local.zone_name
  type    = "CNAME"
  content = cloudflare_pages_project.web.subdomain
  ttl     = 1
  proxied = true
}

resource "cloudflare_dns_record" "web_www" {
  zone_id = cloudflare_zone.main.id
  name    = "www.${local.zone_name}"
  type    = "CNAME"
  content = cloudflare_pages_project.web.subdomain
  ttl     = 1
  proxied = true
}

# www → Hauptdomain, 301, Pfad und Query bleiben (AK-2). Eine Zone hat genau einen Ruleset je Phase.
resource "cloudflare_ruleset" "redirects" {
  zone_id = cloudflare_zone.main.id
  name    = "Weiterleitungen"
  kind    = "zone"
  phase   = "http_request_dynamic_redirect"

  rules = [{
    description = "www auf die Hauptdomain"
    expression  = "(http.host eq \"www.${local.zone_name}\")"
    action      = "redirect"
    action_parameters = {
      from_value = {
        status_code           = 301
        preserve_query_string = true
        target_url = {
          expression = "concat(\"https://${local.zone_name}\", http.request.uri.path)"
        }
      }
    }
  }]
}

# Beacon wird von Hand eingebunden (Base.astro, PUBLIC_CF_BEACON_TOKEN), deshalb kein auto_install.
resource "cloudflare_web_analytics_site" "web" {
  account_id   = var.account_id
  host         = local.zone_name
  auto_install = false
}
