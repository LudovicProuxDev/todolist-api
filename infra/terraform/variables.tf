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
  description = "Image PostgreSQL (le compose.yaml local utilise postgres:18 ; 16 suffit pour tester)."
  type        = string
  default     = "postgres:16-alpine"
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

# --- Azure Container Registry ---

variable "enable_container_registry" {
  description = "Créer un Azure Container Registry pour héberger l'image backend réelle. Laisser true pour le test ACR ; false si on reste sur les images placeholder publiques."
  type        = bool
  default     = true
}

variable "acr_sku" {
  description = "SKU de l'ACR. Basic suffit pour tester (le moins cher)."
  type        = string
  default     = "Basic"
}

# --- Backend ---

variable "backend_docker_image" {
  description = "Image Docker du backend. Défaut = nginx (placeholder). Mettre l'image réelle (ACR) pour un vrai déploiement."
  type        = string
  default     = "nginx:alpine"
}

variable "backend_port" {
  description = "Port écouté par le conteneur backend. 80 = placeholder nginx ; 8000 = backend Symfony réel (php -S ... :8000)."
  type        = number
  default     = 80
}

# --- Frontend (React / Vite) ---

variable "enable_frontend" {
  description = "Ajouter le conteneur frontend au groupe ACI. false = backend + DB seulement."
  type        = bool
  default     = true
}

variable "frontend_docker_image" {
  description = "Image Docker du frontend (vite dev server, port 3000). À pousser dans l'ACR. Défaut = nginx placeholder."
  type        = string
  default     = "nginx:alpine"
}

variable "frontend_port" {
  description = "Port écouté par le conteneur frontend (3000 = vite dev server)."
  type        = number
  default     = 3000
}

variable "frontend_api_proxy_target" {
  description = "Cible du proxy /api du frontend (env VITE_API_PROXY_TARGET). null => http://localhost:<backend_port> : dans un groupe ACI les conteneurs partagent localhost."
  type        = string
  default     = null
}

variable "frontend_allowed_hosts" {
  description = "Valeur de VITE_ALLOWED_HOSTS pour le vite dev server : le(s) FQDN public(s) ACI séparés par des virgules, ou 'all' pour tout autoriser."
  type        = string
  default     = "all"
}

variable "image_registry_credential" {
  description = "Optionnel : credentials d'un registre privé (ex: ACR) hébergeant l'image backend réelle. Laisser null avec les images placeholder publiques."
  type = object({
    server   = string
    username = string
    password = string
  })
  default   = null
  sensitive = true
}
