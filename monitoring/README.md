# Monitoring

The backend metrics are collected by **Prometheus** and displayed by **Grafana**, both started by `compose.yaml`.

```
backend (/metrics/prometheus) ──► Prometheus (:9090) ──► Grafana (:3001)
```

## Metrics exposed by the backend

The backend uses [artprima/prometheus-metrics-bundle](https://github.com/artprima/prometheus-metrics-bundle)
(configuration: [`backend/config/packages/prometheus.yaml`](../backend/config/packages/prometheus.yaml)).
Metrics are stored in APCu and prefixed with the `app_backend` namespace:

| Metric | Description |
|---|---|
| `app_backend_http_requests_total` | Number of HTTP requests |
| `app_backend_http_2xx_responses_total`, `app_backend_http_4xx_responses_total`... | Responses by status class |
| `app_backend_request_durations_histogram_seconds` | Request durations (histogram) |
| `app_backend_instance_name` | Instance information |

The endpoint `/metrics/prometheus` is protected by HTTP basic authentication and requires the `ROLE_METRICS` role.

## Prometheus

Configuration: [`prometheus/prometheus.yml`](prometheus/prometheus.yml), mounted read-only in the container.

- Scrapes `backend:8000/metrics/prometheus` every 15 seconds (`backend` job).
- Authenticates with the `prometheus` user, whose credentials are set in the `basic_auth` section.
- Data is kept in the `todolist-prometheus-data` volume.

### Metrics user

The `prometheus` user must exist in the backend database with the `ROLE_METRICS` role, and with the password set in
`prometheus.yml`. Create it like the [first user](../backend/README.md#first-user), with the `prometheus` username
and the `["ROLE_METRICS"]` roles. A user cannot have both `ROLE_ADMIN` and `ROLE_METRICS`.

Check the scraping at http://localhost:9090/targets: the `backend` target must be `UP`.

## Grafana

Available at http://localhost:3001. Log in as `admin` with the password set by `GF_SECURITY_ADMIN_PASSWORD`
in `compose.yaml`. Data is kept in the `todolist-grafana-data` volume.

No data source or dashboard is provisioned. To display the metrics:

1. *Connections → Data sources → Add data source → Prometheus*.
2. Set the URL to `http://prometheus:9090` (the service name on the Compose network), then *Save & test*.
3. Create a dashboard, for example with `rate(app_backend_http_requests_total[5m])`.
