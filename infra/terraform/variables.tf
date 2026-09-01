# =========================================================
# variables.tf
# Toutes les valeurs "réglables" du projet, centralisées ici.
# On les utilise ensuite dans les autres fichiers avec var.nom_variable
# =========================================================

variable "project_name" {
  description = "Nom court du projet, utilisé comme préfixe pour nommer les ressources"
  type        = string
  default     = "todolist"
}

variable "environment" {
  description = "Environnement de déploiement (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "location" {
  description = "Région Azure où déployer les ressources"
  type        = string
  default     = "East US"

  # NOTE gouvernance des données : pour un vrai déploiement prod, cette région
  # devrait rester dans l'UE (France Central, West Europe...). Ici on teste sur
  # un compte perso, donc région US (meilleure dispo / quota).
}

variable "postgres_admin_username" {
  description = "Nom de l'utilisateur administrateur de la base PostgreSQL"
  type        = string
  default     = "psqladmin"
}

variable "postgres_admin_password" {
  description = "Mot de passe administrateur PostgreSQL (ne jamais commiter en clair : passer par terraform.tfvars ou TF_VAR_postgres_admin_password). Éviter les caractères réservés d'URL : @ : / ? # %"
  type        = string
  sensitive   = true
}

variable "backend_docker_image" {
  description = "Image Docker du backend Symfony/PHP, format image:tag (ex: monregistry.azurecr.io/todolist-backend:latest)"
  type        = string
  default     = "nginx:latest" # placeholder Docker Hub, juste pour tester le apply
}

variable "backend_docker_registry_url" {
  description = "URL du registre Docker du backend (Docker Hub par défaut ; pour ACR : https://monregistry.azurecr.io)"
  type        = string
  default     = "https://index.docker.io"
}
