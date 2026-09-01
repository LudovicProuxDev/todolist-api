# =========================================================
# database.tf
# Base de données PostgreSQL managée par Azure
# (Azure Database for PostgreSQL - Flexible Server)
# =========================================================

resource "azurerm_postgresql_flexible_server" "main" {
  name                = "psql-${var.project_name}-${var.environment}"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location

  administrator_login    = var.postgres_admin_username
  administrator_password = var.postgres_admin_password

  # Version de PostgreSQL
  version = "15"

  # Taille du serveur : B_Standard_B1ms = petite instance, pas chère,
  # suffisante pour un projet de démo / école. À ajuster en prod.
  sku_name   = "B_Standard_B1ms"
  storage_mb = 32768 # 32 Go

  # Pas de bloc high_availability : par défaut = pas de HA (simple + économique).
  # (le mode "Disabled" n'existe pas, seules les valeurs ZoneRedundant / SameZone
  # sont acceptées, donc on omet le bloc.)

  backup_retention_days = 7
}

# Base de données applicative à l'intérieur du serveur PostgreSQL
resource "azurerm_postgresql_flexible_server_database" "app_db" {
  name      = "${var.project_name}_db"
  server_id = azurerm_postgresql_flexible_server.main.id
  charset   = "UTF8"
  collation = "en_US.utf8"
}

# Règle de firewall : autorise les services Azure (ex: App Service)
# à se connecter à la base. IP de début/fin = 0.0.0.0 est une
# convention Azure spécifique qui veut dire "services Azure uniquement".
resource "azurerm_postgresql_flexible_server_firewall_rule" "allow_azure_services" {
  name             = "AllowAzureServices"
  server_id        = azurerm_postgresql_flexible_server.main.id
  start_ip_address = "0.0.0.0"
  end_ip_address   = "0.0.0.0"
}
