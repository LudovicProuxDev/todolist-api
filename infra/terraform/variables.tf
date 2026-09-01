# =========================================================
# variables.tf
# Toutes les valeurs "réglables" du projet.
# =========================================================

variable "project_name" {
  description = "Nom court du projet, préfixe des ressources (minuscules, sans underscore : sert aussi de label DNS)"
  type        = string
  default     = "todolist"
}

variable "environment" {
  description = "Environnement (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "location" {
  description = "Région Azure"
  type        = string
  default     = "East US"

  # NOTE gouvernance des données : pour une vraie prod, repasser sur une
  # région UE (France Central, West Europe...). Ici on teste sur un compte
  # perso, d'où une région US.
}

# --- Base de données (conteneur PostgreSQL, éphémère) ---

variable "postgres_image" {
  description = "Image Docker PostgreSQL (identique au compose.yaml)"
  type        = string
  default     = "postgres:18-alpine"
}

variable "postgres_admin_username" {
  description = "Utilisateur PostgreSQL"
  type        = string
  default     = "psqladmin"
}

variable "postgres_admin_password" {
  description = "Mot de passe PostgreSQL (via terraform.tfvars ou TF_VAR_postgres_admin_password). Éviter les caractères réservés d'URL : @ : / ? # %"
  type        = string
  sensitive   = true
}

# --- Backend ---

variable "backend_docker_image" {
  description = "Image Docker du backend. Placeholder public par défaut ; mettre l'image réelle (ACR) pour un vrai déploiement."
  type        = string
  default     = "nginxdemos/hello:latest"
}

variable "backend_port" {
  description = "Port écouté par le conteneur backend. 80 = placeholder nginx ; 8000 = backend Symfony réel (php -S ... :8000)."
  type        = number
  default     = 80
}
