# [@bitburner-monorepo](../../README.md)/[prom-metrics-expose](#)
A simple, barebones docker-compose file to host a Prometheus instance. Intended for use with [prom-metrics-expose](../prom-metrics-expose/README.md).

## Usage Instructions
1. Configure `prometheus/prometheus.yml` to your liking.
2. Run `nx run prom-server-compose:compose-up`.
    - Alternatively, run `docker-compose up`.