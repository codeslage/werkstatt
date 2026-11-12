# Der Bootstrap-State liegt im Bucket, den er selbst verwaltet (Runbook docs/runbooks/tofu-state.md).
# Die Endpoint-Adresse enthält die Konto-ID und kommt deshalb beim `tofu init` aus der .env:
#   tofu init -backend-config="endpoints={s3=\"$R2_ENDPOINT\"}"
terraform {
  backend "s3" {
    bucket       = "codeslage-tofu-state"
    key          = "bootstrap.tfstate"
    region       = "auto"
    use_lockfile = true

    # R2 ist S3-kompatibel, aber kein AWS: diese Prüfungen von AWS gibt es dort nicht.
    use_path_style              = true
    skip_credentials_validation = true
    skip_region_validation      = true
    skip_requesting_account_id  = true
    skip_metadata_api_check     = true
    skip_s3_checksum            = true
  }
}
