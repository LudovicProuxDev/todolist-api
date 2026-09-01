# =========================================================
# backend.tf
# Héberge le backend Symfony (PHP) sur Azure App Service
# (Linux, en mode conteneur Docker).
# =========================================================

# Le "Service Plan" définit la puissance de calcul (CPU/RAM) allouée.
# Plusieurs Web Apps peuvent partager le même plan.
resource "azurerm_service_plan" "backend" {
  name                = "plan-${var.project_name}-backend"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location

  os_type  = "Linux"
  sku_name = "B1" # Basic : suffisant pour un projet de démo/école
}

# La Web App elle-même : c'est ici que le conteneur backend tourne.
resource "azurerm_linux_web_app" "backend" {
  name                = "app-${var.project_name}-backend"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  service_plan_id     = azurerm_service_plan.backend.id

  site_config {
    application_stack {
      docker_image_name   = var.backend_docker_image
      docker_registry_url = var.backend_docker_registry_url
      # Pour une image ACR privée, ajouter aussi :
      # docker_registry_username = "..."
      # docker_registry_password = "..."
    }
    always_on = true
  }

  # Variables d'environnement injectées dans le conteneur backend.
  app_settings = {
    # WEBSITES_PORT : port écouté par le conteneur. Le Dockerfile du backend
    # lance "php -S 0.0.0.0:8000", donc 8000.
    "WEBSITES_PORT" = "8000"

    # Chaîne de connexion vers PostgreSQL (database.tf).
    # sslmode=require est obligatoire : Flexible Server refuse les
    # connexions non chiffrées. serverVersion évite une requête de
    # détection au démarrage de Doctrine.
    "DATABASE_URL" = "postgresql://${var.postgres_admin_username}:${var.postgres_admin_password}@${azurerm_postgresql_flexible_server.main.fqdn}:5432/${azurerm_postgresql_flexible_server_database.app_db.name}?sslmode=require&charset=utf8&serverVersion=15"

    "APP_ENV" = var.environment
  }
}
