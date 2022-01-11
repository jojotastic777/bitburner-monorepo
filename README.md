# [@bitburner-monorepo](#)
The Bitburner repository to end all Bitburner repositories. Hopefully. Leverages some small fraction of the [Nx](https://nx.dev/) build system to keep everything in one place.

Usage Prerequisates:
- Make sure that `npx nx` runs the correct Nx cli tool.
  - Alternately, install `nx` globally using `npm install -g nx`
- Run `npm install --include=dev` in the base directory. This will install all the dependencies for everything in the `packages` folder.

For further instructions, see the README.md for the particular project you want to use.

## Projects
- [Bitburner Scripts](packages/bitburner-scripts/README.md)
- [WebSocket Script Update Server](packages/ws-update-server/README.md)
- [WebSocket Stats Server](packages/ws-stats-server/README.md)
- [WebSocket Stats Viewer](packages/ws-stats-viewer/README.md)
- [prom-metrics-expose](packages/prom-metrics-expose/README.md)
- [prom-server-compose](packages/prom-server-compose/README.md)