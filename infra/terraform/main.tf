# =========================================================
# main.tf
# Ressource "racine" : le Resource Group.
# En Azure, TOUTES les ressources doivent appartenir à un
# Resource Group (un conteneur logique de ressources).
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
