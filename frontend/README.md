# Frontend

Single-page application built with **React 19** and **Vite 7**, consuming the backend API.

## Table of contents

- [Structure](#structure)
- [Routes](#routes)
- [Authentication](#authentication)
- [API client](#api-client)
- [Configuration](#configuration)
- [Tests and code quality](#tests-and-code-quality)
- [Docker image](#docker-image)

## Structure

The code is organised by feature: each feature has its own API calls, hooks, components and routes.

```
frontend/
├── src/
│   ├── api/api.js            # Axios instance, JWT and refresh token handling
│   ├── components/           # Layout, Home, Login, Logout, ProtectedRoute, AccessControl, Unauthorized
│   ├── constants/roles.js    # Roles used by the UI
│   ├── context/              # AuthContext and AuthProvider
│   ├── features/
│   │   ├── categories/
│   │   ├── profile/
│   │   ├── tasks/
│   │   └── users/
│   │       ├── api/          # Calls to the API resource
│   │       ├── hooks/        # Data fetching and mutations (useTasks, useTaskCreate...)
│   │       ├── components/   # List, item, create and update views
│   │       └── routes/       # Routes of the feature
│   ├── App.jsx               # Main routes
│   └── main.jsx
├── tests/setupTests.js       # Vitest setup
├── vite.config.js
├── eslint.config.js
└── sonar-project.properties
```

## Routes

| Path | Access |
|---|---|
| `/` | Public |
| `/login`, `/logout` | Public |
| `/tasks/*` | Public in the UI (the API does not restrict tasks either) |
| `/categories/*` | `ROLE_ADMIN` |
| `/users/*` | `ROLE_ADMIN` |
| `/profile/*` | Authenticated |
| `/unauthorized` | Shown when the user lacks the required role |

The tasks, categories and users features expose a list (`/`), a detail page (`/:id`), and create (`/create`) and
update (`/:id/update`) pages. The profile feature shows the current user (`/profile`).

`ProtectedRoute` redirects to `/login` when the user is not authenticated, and to `/unauthorized` when they do not
have one of the required roles.

## Authentication

`AuthProvider` (`src/context/AuthProvider.jsx`) exposes through `AuthContext`:

| Value | Description |
|---|---|
| `user` | Decoded JWT payload (`username`, `roles`, `exp`...), or `null` |
| `isAuthenticated` | `true` when a valid, non-expired token is stored |
| `login(username, password)` | Calls `POST /api/auth`, stores the tokens and decodes the JWT |
| `logout()` | Removes the tokens |
| `hasRole(role \| roles)` | `true` when the user has the role (or one of the roles) |

The JWT and the refresh token are stored in `localStorage` (`token` and `refresh_token`).

## API client

`src/api/api.js` creates an Axios instance on `/api` (JSON-LD headers) and provides `fetchData`, `postData`,
`updateData` (`PATCH` in `application/merge-patch+json`) and `deleteData`.

- **Request interceptor**: adds the `Authorization: Bearer <token>` header.
- **Response interceptor**: on a `401`, calls `POST /api/token/refresh` once, stores the new tokens and replays
  the request. Requests failing during the refresh are queued and replayed with the new token. When the refresh
  fails (or no refresh token is stored), the tokens are removed and the user is redirected to `/login`.

## Configuration

[`vite.config.js`](vite.config.js):

- Dev server on `0.0.0.0:3000`.
- `/api` is proxied to the backend, so the browser only talks to the frontend origin.
- `@` is an alias for `src/`.

| Variable | Default | Description |
|---|---|---|
| `VITE_API_PROXY_TARGET` | `http://backend:8000` | Target of the `/api` proxy |
| `VITE_ALLOWED_HOSTS` | Vite default (`localhost`) | Hosts accepted by the dev server, comma-separated, or `all` |

## Tests and code quality

| Tool | Configuration | Command |
|---|---|---|
| Vitest (jsdom, Testing Library) | `vite.config.js`, `tests/setupTests.js` | `npx vitest --run` |
| ESLint (React hooks, React Refresh) | `eslint.config.js` | `npm run lint` |
| npm audit | - | `npm audit` |

Run them with `docker compose exec frontend <command>`. Tests are written next to the components (`*.test.jsx`).

## Docker image

[`Dockerfile`](Dockerfile): `node:22-slim`. It updates the npm bundled with the base image (whose dependencies are
flagged by Trivy), installs the dependencies, builds the app, and starts the Vite dev server (`npm run dev`) on
port 3000.
The `compose.yaml` service mounts the sources in `/app`.
