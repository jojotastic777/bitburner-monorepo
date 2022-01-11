# [@bitburner-monorepo](#)
The Bitburner repository to end all Bitburner repositories. Hopefully. Leverages some small fraction of the [Nx](https://nx.dev/) build system to keep everything in one place.

Usage Prerequisates:
- Make sure that `npx nx` runs the correct Nx cli tool.
  - Alternately, install `nx` globally using `npm install -g nx`
- Run `npm install --include=dev` in the base directory. This will install all the dependencies for everything in the `packages` folder.

For further instructions, see the README.md for the particular project you want to use.

## Projects
- [Bitburner Scripts](packages/bitburner-scripts)
- [WebSocket Script Update Server](packages/ws-update-server)
- [WebSocket Stats Server](packages/ws-stats-server)
- [WebSocket Stats Viewer](packages/ws-stats-viewer)
- [Bitburner Prometheus Metrics Exposer](packages/prom-metrics-expose)
- [Prometheus Server Compose](packages/prom-server-compose)