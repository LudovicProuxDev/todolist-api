# =========================================================
# frontend.tf
# Héberge le frontend React sur Azure Static Web App.
# Service pensé pour les apps front (React, Vue...) : simple,
# avec un tier gratuit, et un déploiement facile via CI/CD.
# =========================================================

resource "azurerm_static_web_app" "frontend" {
  name                = "swa-${var.project_name}-${var.environment}"
  resource_group_name = azurerm_resource_group.main.name

  # Les Static Web Apps ne sont pas disponibles dans toutes les régions,
  # on force une région supportée.
  location = "westeurope"

  sku_tier = "Free"
  sku_size = "Free"
}

# NOTE : le frontend et le backend (App Service) ne se "lient" pas
# automatiquement via Terraform. Le code actuel (frontend/src/api/api.js)
# appelle l'API en relatif ("/api") grâce au proxy Vite en dev — ça ne
# marchera pas tel quel sur Static Web App. À traiter au moment de
# déployer le frontend :
#   1. Récupérer l'URL du backend (voir outputs.tf)
#   2. Soit configurer un "linked backend" / proxy dans staticwebapp.config.json,
#      soit faire pointer axios sur l'URL absolue du backend via VITE_API_URL
#      injectée au build (et activer le CORS côté Symfony).
