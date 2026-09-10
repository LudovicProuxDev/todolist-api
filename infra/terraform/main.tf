# =========================================================
# main.tf
# Resource Group + Azure Container Registry (ACR) + un groupe
# Azure Container Instances (ACI) qui fait tourner backend +
# PostgreSQL, comme un petit docker-compose managé.
# Pas de quota VM, pas de VNet.
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

# =========================================================
# Azure Container Registry — héberge l'image backend réelle.
# SKU Basic + admin activé : l'auth la plus simple pour un test
# rapide (un seul "docker login" avec les creds admin, pas de
# service principal). ACR Basic se provisionne en ~30 s.
# =========================================================
resource "azurerm_container_registry" "main" {
  count = var.enable_container_registry ? 1 : 0

  name                = "acr${var.project_name}${var.environment}${random_string.suffix.result}"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  sku                 = var.acr_sku
  admin_enabled       = true

  tags = {
    project     = var.project_name
    environment = var.environment
    managed_by  = "terraform"
  }
}

locals {
  # Faut-il passer un bloc image_registry_credential à l'ACI ? Bool NON sensible
  # (nonsensitive) : c'est lui qui décide 0 ou 1 bloc, et for_each refuse une
  # valeur sensible pour la longueur de la collection.
  has_registry_credential = nonsensitive(var.image_registry_credential != null) || var.enable_container_registry

  # Credentials effectifs pour tirer l'image backend :
  # - si image_registry_credential est fourni explicitement, on le respecte ;
  # - sinon, si l'ACR est créé, on branche automatiquement ses creds admin ;
  # - sinon null (images placeholder publiques, pas d'auth).
  effective_registry_credential = (
    var.image_registry_credential != null ? var.image_registry_credential : (
      var.enable_container_registry ? {
        server   = azurerm_container_registry.main[0].login_server
        username = azurerm_container_registry.main[0].admin_username
        password = azurerm_container_registry.main[0].admin_password
      } : null
    )
  )
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
      DATABASE_URL = "postgresql://${var.postgres_admin_username}:${var.postgres_admin_password}@localhost:5432/${var.project_name}_db?serverVersion=16&charset=utf8"
    }
  }

  # Credentials de registre privé (ex: ACR) — actif si image_registry_credential
  # est renseignée ou si l'ACR géré par ce module est créé.
  dynamic "image_registry_credential" {
    for_each = local.has_registry_credential ? [local.effective_registry_credential] : []
    content {
      server   = image_registry_credential.value.server
      username = image_registry_credential.value.username
      password = image_registry_credential.value.password
    }
  }

  tags = {
    project     = var.project_name
    environment = var.environment
    managed_by  = "terraform"
  }
}
