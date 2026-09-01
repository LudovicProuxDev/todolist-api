# =========================================================
# providers.tf
# Déclare quels "providers" Terraform doit utiliser.
# Un provider = un plugin qui sait parler à une API (ici Azure).
# =========================================================

terraform {
  required_version = ">= 1.5"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.100"
    }
  }

  # --- State local (par défaut) ---
  # Le fichier terraform.tfstate sera créé dans ce dossier.
  # Simple pour démarrer, mais risqué en équipe (pas de verrouillage,
  # pas de partage automatique).

  # --- Pour passer à un state distant partagé (à activer plus tard) ---
  # 1. Créer manuellement un Storage Account + un container Azure
  # 2. Décommenter le bloc ci-dessous et compléter les valeurs
  #
  # backend "azurerm" {
  #   resource_group_name  = "rg-terraform-state"
  #   storage_account_name = "sttfstatetodolist"
  #   container_name        = "tfstate"
  #   key                   = "prod.terraform.tfstate"
  # }
}

# Configuration du provider Azure.
# "features {}" est obligatoire même vide : il active le comportement
# par défaut du provider (ex: suppression automatique des ressources
# liées lors d'un destroy).
provider "azurerm" {
  features {}
}
