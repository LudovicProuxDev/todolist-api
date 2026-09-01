# =========================================================
# outputs.tf
# Infos affichées après "terraform apply".
# =========================================================

output "backend_url" {
  description = "URL publique du backend (HTTP uniquement : ACI ne fait pas de TLS)"
  value       = "http://${azurerm_container_group.main.fqdn}:${var.backend_port}"
}

output "container_group_fqdn" {
  description = "Nom DNS du groupe de conteneurs"
  value       = azurerm_container_group.main.fqdn
}

output "container_group_ip" {
  description = "IP publique du groupe de conteneurs"
  value       = azurerm_container_group.main.ip_address
}
