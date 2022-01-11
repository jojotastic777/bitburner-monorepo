# [@bitburner-monorepo](../..)/[bitburner-scripts](#)
This project contains all of my bitburner scripts, several of which are needed for other projects in this monorepo.

## Build Instructions
0. Make sure that all the usage prerequisites listed in the main repository's [README.md](../..) are fulfilled.
1. Run the command `nx run bitburner-scripts:build`.

That's it. All the scripts in this project should now exist in the `dist/bitburner-scripts` folder in the base directory of this repository.

You can now copy the scripts from that folder into the game however you like. However, might I suggest using the [WebSocket Script Update Server](../ws-update-server) for that?
