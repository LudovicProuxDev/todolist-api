# TodoList API

A task management application: a **Symfony / API Platform** REST API secured with JWT, and a **React** frontend.
The whole stack (database, monitoring, code quality) runs locally with Docker Compose.

## Documentation

| Part | Documentation |
|---|---|
| Backend (Symfony API) | [`backend/README.md`](backend/README.md) |
| Frontend (React app) | [`frontend/README.md`](frontend/README.md) |
| Monitoring (Prometheus, Grafana) | [`monitoring/README.md`](monitoring/README.md) |

## Tech stack

| Part | Technologies |
|---|---|
| Backend | PHP 8.4, Symfony 8.1, API Platform 4.4, Doctrine ORM, LexikJWT + refresh tokens |
| Frontend | React 19, Vite 7, React Router 7, Axios, Vitest |
| Database | PostgreSQL 16 |
| Monitoring | Prometheus, Grafana |
| Quality | PHPUnit, PHPStan, PHP-CS-Fixer, ESLint, SonarQube, Trivy |

## Architecture

All services are defined in [`compose.yaml`](compose.yaml):

| Service | URL | Description |
|---|---|---|
| `frontend` | http://localhost:3000 | React app (Vite dev server), proxies `/api` to the backend |
| `backend` | http://localhost:8000 | Symfony API, documentation at http://localhost:8000/api |
| `db` | `localhost:5432` | PostgreSQL database of the application |
| `prometheus` | http://localhost:9090 | Collects the backend metrics |
| `grafana` | http://localhost:3001 | Metrics dashboards |
| `sonarqube` | http://localhost:9000 | Code quality analysis (with its own `sonar_db` database) |

```
.
├── backend/                 # Symfony API
├── frontend/                # React app
├── monitoring/              # Prometheus configuration
├── scripts/                 # SonarQube scripts
├── .github/workflows/ci.yml # CI pipeline
└── compose.yaml
```

## Getting started

Prerequisite: Docker with Docker Compose.

No secret is versioned. Create the local files first, from the templates:

```bash
# Compose secrets (database accounts, Grafana, SonarQube database): fill in the values
cp .env.example .env

# Password of the Prometheus metrics user (see monitoring/README.md)
printf '%s' 'YourMetricsPassword' > monitoring/prometheus/metrics_password.txt
```

Then generate the backend secrets (`backend/.env.local`, `backend/.env.test.local`): see
[Local secrets](backend/README.md#local-secrets). Then start the stack:

```bash
docker compose up -d --build
```

On startup, the backend installs its dependencies, creates the database and runs the migrations.
Then finish the backend setup (JWT keys and first user): see [Backend setup](backend/README.md#setup).

## SonarQube

The analysis runs on the local SonarQube of `compose.yaml`, with one project for the backend and one for the frontend.
Both use the **Rating A** Quality Gate: the analysis fails as soon as a rating (Reliability, Security,
Maintainability, Security Review) is B or worse.

```bash
# Once (and after each reset of SonarQube): admin password, projects, Quality Gate and token
scripts/sonar-setup.sh

# Analysis with Quality Gate check
scripts/sonar-scan.sh             # backend and frontend
scripts/sonar-scan.sh backend     # a single project
```

The credentials (admin password, analysis token) are stored in `.env.sonar.local`, which is not versioned
(template: [`.env.sonar.example`](.env.sonar.example)).
The reports are available on the SonarQube dashboards:
[backend](http://localhost:9000/dashboard?id=todolist-backend) and
[frontend](http://localhost:9000/dashboard?id=todolist-frontend).

## CI pipeline

The GitHub Actions pipeline ([`.github/workflows/ci.yml`](.github/workflows/ci.yml)) runs on every push and pull
request to `master`:

```
               ┌──► backend-build  ──► backend-test  ──┐
secrets-scan ──┤                                       ├──► docker
               └──► frontend-build ──► frontend-test ──┘
```

| Job | Steps |
|---|---|
| `secrets-scan` | Gitleaks on the whole git history (reviewed findings are listed in `.gitleaksignore`) |
| `backend-build` | Composer install, `composer audit`, PHP-CS-Fixer, PHPStan |
| `backend-test` | PHPUnit on PostgreSQL 16 |
| `frontend-build` | `npm ci`, `npm audit`, ESLint, Vite build |
| `frontend-test` | Vitest |
| `docker` | Image builds, Trivy scans, Compose validation, smoke tests of the backend and frontend |

The Trivy scans fail the pipeline when an image contains a HIGH or CRITICAL vulnerability that has a fix.

Artifacts available on each run:

| Artifact | Content |
|---|---|
| `backend-test-report` | PHPUnit JUnit report |
| `frontend-dist` | Frontend build |
| `frontend-test-report` | Vitest JUnit report |
| `trivy-reports` | Full Trivy reports of both images |

The pipeline uses the `JWT_SECRET_KEY`, `JWT_PUBLIC_KEY` and `JWT_PASSPHRASE` repository secrets.
