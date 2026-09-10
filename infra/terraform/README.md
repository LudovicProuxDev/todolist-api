# IaC Terraform — todolist sur Azure (version test / compte perso)

Infra minimale pour **tester** sur un abonnement Azure bridé (compte
gratuit) : un Resource Group + un groupe **Azure Container Instances**
qui fait tourner le backend et un conteneur PostgreSQL, façon
docker-compose managé.

Pourquoi pas App Service + PostgreSQL Flexible Server + Static Web App ?
Parce que le compte perso a un quota de VM App Service à 0 et ne peut pas
provisionner de Flexible Server. ACI contourne ces limites.

## Contenu

| Fichier | Rôle |
|---|---|
| `providers.tf` | Providers azurerm + random |
| `variables.tf` | Variables (projet, région, image/port backend, creds PostgreSQL, ACR) |
| `main.tf` | Resource Group + Azure Container Registry + groupe ACI (conteneurs `db` + `backend`) |
| `outputs.tf` | URL / FQDN / IP publics + login server & creds admin de l'ACR |

## Prérequis

- Terraform ≥ 1.5 et Azure CLI (déjà présents dans Azure Cloud Shell)
- `az login` (automatique dans Cloud Shell)

## Utilisation

```bash
export TF_VAR_postgres_admin_password='UnMotDePasseFort2026'

terraform init
terraform plan     # RG, random_string, container_registry, container_group
terraform apply    # ~2-3 min (ACR Basic ~30 s + ACI ~1-2 min)

terraform output backend_url
curl -I "$(terraform output -raw backend_url)"   # 200 = la page nginx placeholder répond
```

### Test Azure Container Registry (< 10 min)

`enable_container_registry = true` (défaut) crée un ACR **Basic** avec
l'utilisateur admin activé, et branche automatiquement ses credentials
sur le groupe ACI (`image_registry_credential`). Cycle complet de test :

```bash
export TF_VAR_postgres_admin_password='UnMotDePasseFort2026'

terraform init
terraform apply -target=azurerm_container_registry.main   # ~1 min

ACR=$(terraform output -raw container_registry_login_server)
az acr login --name "${ACR%%.*}"

# Pousser une image de test (ou l'image backend réelle)
docker pull nginx:alpine
docker tag  nginx:alpine "$ACR/todolist-backend:test"
docker push "$ACR/todolist-backend:test"                  # ~1 min

terraform apply \
  -var="backend_docker_image=$ACR/todolist-backend:test"  # ~2 min

curl -I "$(terraform output -raw backend_url)"
terraform destroy                                         # ~2 min
```

Pour désactiver l'ACR et rester sur les images publiques :
`enable_container_registry = false`.

Pour tout supprimer (éviter les coûts) :

```bash
terraform destroy
```

## Limites de cette version (assumées)

- **PostgreSQL éphémère** : pas de volume persistant, les données sont
  perdues à chaque recréation du groupe. OK pour tester, pas pour de la
  vraie donnée.
- **HTTP uniquement** : l'IP publique ACI ne fait pas de HTTPS. Pour du
  TLS il faudrait ajouter Front Door / Application Gateway / un sidecar
  Caddy plus tard.
- **Frontend mis de côté** : la Static Web App échouait (limite compte
  gratuit) et le routing `/api` relatif du frontend n'est pas résolu. À
  reprendre une fois le backend + DB validés.
- **Backend = placeholder nginx** par défaut. Pour lancer le vrai backend
  Symfony : pousser l'image dans un registre puis
  `backend_docker_image = "<registre>/todolist-backend:latest"` +
  `backend_port = 8000` dans `terraform.tfvars`.

## Pour une vraie prod

Repasser `location` sur une région UE (gouvernance des données) et
remplacer ACI par App Service / Container Apps + PostgreSQL Flexible
Server + Front Door (nécessite un abonnement non bridé).
