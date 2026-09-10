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

# --- Azure Container Registry ---
# Sert au "docker login" avant de pousser l'image backend.
#   az acr login --name <login_server>   (ou docker login <login_server>)

output "container_registry_login_server" {
  description = "Login server de l'ACR (ex: acrtodolistdevxxxxx.azurecr.io). null si enable_container_registry = false"
  value       = var.enable_container_registry ? azurerm_container_registry.main[0].login_server : null
}

output "container_registry_admin_username" {
  description = "Utilisateur admin de l'ACR"
  value       = var.enable_container_registry ? azurerm_container_registry.main[0].admin_username : null
  sensitive   = true
}

output "container_registry_admin_password" {
  description = "Mot de passe admin de l'ACR (terraform output -raw container_registry_admin_password)"
  value       = var.enable_container_registry ? azurerm_container_registry.main[0].admin_password : null
  sensitive   = true
}
