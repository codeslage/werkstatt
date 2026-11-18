# Live: Zone codeslage.de mit DNS-Einträgen und Zonen-Einstellungen (ADR 0002, Plan 04-fundament T-36).
# Arbeiten mit State und Passphrase: docs/runbooks/tofu-state.md

terraform {
  required_version = ">= 1.10"

  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "5.29.0"
    }
  }

  # State und Pläne sind immer verschlüsselt (ADR 0002). Die Passphrase kommt aus der .env.
  encryption {
    key_provider "pbkdf2" "passphrase" {
      passphrase = var.state_passphrase
    }

    method "aes_gcm" "default" {
      keys = key_provider.pbkdf2.passphrase
    }

    state {
      method   = method.aes_gcm.default
      enforced = true
    }

    plan {
      method   = method.aes_gcm.default
      enforced = true
    }
  }
}
