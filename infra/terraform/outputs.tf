# =========================================================
# outputs.tf
# Valeurs affichées dans le terminal après "terraform apply".
# Utile pour récupérer rapidement les URLs / infos sans aller
# chercher dans le portail Azure.
# =========================================================

output "backend_url" {
  description = "URL publique du backend Symfony"
  value       = "https://${azurerm_linux_web_app.backend.default_hostname}"
}

output "frontend_url" {
  description = "URL publique du frontend React"
  value       = "https://${azurerm_static_web_app.frontend.default_host_name}"
}

output "postgres_fqdn" {
  description = "Adresse (FQDN) du serveur PostgreSQL"
  value       = azurerm_postgresql_flexible_server.main.fqdn
}

output "postgres_connection_string" {
  description = "Chaîne de connexion complète à la base (sensible)"
  value       = "postgresql://${var.postgres_admin_username}:${var.postgres_admin_password}@${azurerm_postgresql_flexible_server.main.fqdn}:5432/${azurerm_postgresql_flexible_server_database.app_db.name}?sslmode=require&charset=utf8&serverVersion=15"
  sensitive   = true
}
