# Bootstrap: legt nur den R2-Bucket für den OpenTofu-State an (ADR 0002, Plan 04-fundament T-35).
# Ablauf und Henne-Ei-Problem: docs/runbooks/tofu-state.md

terraform {
  required_version = ">= 1.10"

  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "5.28.1"
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
