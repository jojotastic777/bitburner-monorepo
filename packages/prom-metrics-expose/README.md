# [@bitburner-monorepo](https://jojotastic777.github.io/bitburner-monorepo/)/[prom-metrics-expose](#)
A means of exposing in-game Bitburner stats as Prometheus metrics. Relies on the `/bin/svc/promStatsConnector` script from [bitburner-scripts](../bitburner-scripts).

![An image of the exposed prometheus metrics being used in a grafana dashboard.](https://media.githubusercontent.com/media/jojotastic777/bitburner-monorepo/master/packages/prom-metrics-expose/docs/demo.png)

## Build Instructions
0. Make sure that all the usage prerequisites listed in the main repository's [README.md](https://jojotastic777.github.io/bitburner-monorepo/) are fulfilled.
1. Run the command `nx run prom-metrics-expose:build`.

## Usage Instructions
1. Build the project.
2. Build [bitburner-scripts](../bitburner-scripts).
3. Run `/bin/svc/promStatsConnector.js` from that project ingame.
4. Run the commnad `nx run prom-metrics-expose:listen`.
5. Point a prometheus instance at `http://your-computer:8888/metrics`.

For assistance running a Prometheus instance, might I suggest using [Prometheus Server Compose](../prom-server-compose)?
