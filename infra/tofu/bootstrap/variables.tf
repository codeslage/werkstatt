variable "account_id" {
  description = "Cloudflare-Konto-ID (kein Secret, aber intern: nie ins Repo; kommt als TF_VAR_account_id aus der .env)."
  type        = string
}

variable "state_passphrase" {
  description = "Passphrase für die State-Verschlüsselung (TF_VAR_state_passphrase aus der .env, zusätzlich im Passwortmanager)."
  type        = string
  sensitive   = true
}
