# IaC Terraform — todolist sur Azure

Infrastructure simple : Resource Group + PostgreSQL Flexible Server (DB) +
App Service Linux (backend Symfony/PHP) + Static Web App (frontend React).
Toutes les ressources sont en région UE (contrôlé par une `validation` sur
la variable `location`).

## Prérequis

1. [Terraform](https://developer.hashicorp.com/terraform/install) installé (≥ 1.5)
2. [Azure CLI](https://learn.microsoft.com/cli/azure/install-azure-cli) installé
3. Être connecté : `az login`
4. Copier `terraform.tfvars.example` en `terraform.tfvars` et adapter les valeurs

## Utilisation

```bash
# 1. Initialise Terraform (télécharge le provider azurerm)
terraform init

# 2. Affiche ce que Terraform va créer/modifier, sans rien appliquer
terraform plan

# 3. Applique réellement les changements sur Azure
terraform apply

# 4. Pour tout détruire en fin de projet (évite les coûts inutiles)
terraform destroy
```

## Fichiers

| Fichier | Rôle |
|---|---|
| `providers.tf` | Déclare le provider Azure et le state |
| `variables.tf` | Toutes les variables du projet |
| `main.tf` | Resource Group (conteneur de toutes les ressources) |
| `database.tf` | Serveur PostgreSQL + base + règle firewall |
| `backend.tf` | App Service Linux pour le backend Symfony/PHP |
| `frontend.tf` | Static Web App pour le frontend React |
| `outputs.tf` | URLs et infos affichées après `apply` |
| `terraform.tfvars.example` | Exemple de valeurs à copier |

## Prochaine étape possible : intégration CI/CD

Une fois ce socle validé, on peut brancher un job GitHub Actions qui lance
`terraform plan` sur chaque pull request (validation) et `terraform apply`
sur merge vers `main` (déploiement), en utilisant un Service Principal Azure
(`az ad sp create-for-rbac`) stocké dans les secrets GitHub.
