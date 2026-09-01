# =========================================================
# main.tf
# Resource Group + un groupe Azure Container Instances (ACI)
# qui fait tourner backend + PostgreSQL, comme un petit
# docker-compose managé. Pas de quota VM, pas de VNet.
# =========================================================

resource "azurerm_resource_group" "main" {
  name     = "rg-${var.project_name}-${var.environment}"
  location = var.location

  tags = {
    project     = var.project_name
    environment = var.environment
    managed_by  = "terraform"
  }
}

# Suffixe aléatoire pour rendre le label DNS public unique.
resource "random_string" "suffix" {
  length  = 5
  special = false
  upper   = false
}

resource "azurerm_container_group" "main" {
  name                = "aci-${var.project_name}-${var.environment}"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  os_type             = "Linux"
  restart_policy      = "Always"

  # IP publique + nom DNS : http://<label>.<region>.azurecontainer.io
  ip_address_type = "Public"
  dns_name_label  = "${var.project_name}-${var.environment}-${random_string.suffix.result}"

  # --- PostgreSQL ---
  # Pas de bloc "ports" : la base n'est PAS exposée sur l'IP publique.
  # Les conteneurs du même groupe se parlent via localhost, donc le
  # backend joint la base sur localhost:5432.
  container {
    name   = "db"
    image  = var.postgres_image
    cpu    = 0.5
    memory = 1.0

    environment_variables = {
      POSTGRES_USER = var.postgres_admin_username
      POSTGRES_DB   = "${var.project_name}_db"
    }

    secure_environment_variables = {
      POSTGRES_PASSWORD = var.postgres_admin_password
    }
  }

  # --- Backend ---
  container {
    name   = "backend"
    image  = var.backend_docker_image
    cpu    = 0.5
    memory = 1.0

    ports {
      port     = var.backend_port
      protocol = "TCP"
    }

    environment_variables = {
      APP_ENV = var.environment
    }

    secure_environment_variables = {
      DATABASE_URL = "postgresql://${var.postgres_admin_username}:${var.postgres_admin_password}@localhost:5432/${var.project_name}_db?serverVersion=18&charset=utf8"
    }
  }

  # Pour une image backend privée (ACR), décommenter :
  # image_registry_credential {
  #   server   = "monregistry.azurecr.io"
  #   username = "..."
  #   password = "..."
  # }

  tags = {
    project     = var.project_name
    environment = var.environment
    managed_by  = "terraform"
  }
}
