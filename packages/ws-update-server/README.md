# [@bitburner-monorepo](https://jojotastic777.github.io/bitburner-monorepo/)/[ws-update-server](#)
This project contains the server-side of my WebSockets-based automatic script editor.

## Build Instructions
0. Make sure that all the usage prerequisites listed in the main repository's [README.md](https://jojotastic777.github.io/bitburner-monorepo/) are fulfilled.
1. Run the command `nx run ws-stats-server:build`.

That's it. All the files needed to use this project should now exist in the `dist/ws-stats-server` folder in the base directory of this repository.

## Usage Instructions
0. Ensure you've built the project first.
1. Run the command `nx run ws-stats-server:listen`

The WebSockets Stats Server should now be running.
