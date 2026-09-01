# =========================================================
# providers.tf
# Déclare les providers Terraform (plugins qui parlent aux API).
# =========================================================

terraform {
  required_version = ">= 1.5"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.100"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.6"
    }
  }

  # State local par défaut (terraform.tfstate dans ce dossier).
  # Pour un state distant partagé plus tard : créer un Storage Account +
  # container, puis décommenter et compléter :
  #
  # backend "azurerm" {
  #   resource_group_name  = "rg-terraform-state"
  #   storage_account_name = "sttfstatetodolist"
  #   container_name       = "tfstate"
  #   key                  = "dev.terraform.tfstate"
  # }
}

provider "azurerm" {
  features {}
}
