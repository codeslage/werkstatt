# tflint für OpenTofu-Code (Constitution XV, AK-18): findet u. a. ungenutzte Variablen, die `tofu validate` nicht meldet.
# Genutzt wird nur der in tflint enthaltene Regelsatz für Terraform/OpenTofu, keine Plugins aus dem Netz.
plugin "terraform" {
  enabled = true
  preset  = "recommended"
}
