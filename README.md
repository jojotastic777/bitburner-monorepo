# Bitburner Monorepo Template

An opinionated template for writing Bitburner scripts, as well as out-of-game applications, in Typescript.

Intended for working with scripts that interface with out-of-game components, but can be used with normal scripts as well.

## Technologies

Uses [Rollup](https://rollupjs.org/) to bundle each script's dependencies into the resulting `.js` file, removing any reliance on Bitburner's built-in module resolution. Additionally, allows for the use of npm packages in in-game scripts.

Uses [Yarn Workspaces](https://yarnpkg.com/features/workspaces) to allow structuring the project as a [monorepo](https://en.wikipedia.org/wiki/Monorepo). This is potentially very useful when working with Bitburner scripts, and is even more useful when interacting between Bitburner scripts and out-of-game apps.

Uses [Turborepo](https://turborepo.org/) as a high-performance build system, allowing all scripts/apps to be built quickly, and with a single command.

## Usage Instructions

### Prerequisites

- Make sure [Yarn](https://yarnpkg.com/) is installed.

### Setup

1. Fork this repository, then clone the fork.
   - Alternatively, clone this repository, remove the `.git` folder, then `git init`.
2. Go into `package.json` and change give the project a `name`.
3. Run `yarn install`.
4. Run `yarn pull-netscript` to retrieve `NetscriptDefinitions.d.ts`.
5. Optionally, replace this README file with your own.

The project should now be completely set up. Now you need to create an in-game [script](#create-an-in-game-script), a [library](#create-a-library), or an out-of-game [application](#create-an-out-of-game-application).

### General Usage

- Build everything: `yarn turbo run build`.
- Format everything using Prettier: `yarn turbo run format`.
- Lint everything using ESLint: `yarn turbo run lint`.

These commands use caching to make sure each script/library/app only gets built when it needs to be.

### Create an In-Game Script

Run `yarn create-script <script-name>` to create a new script in the `scripts` folder.

- To import something from the newly-created script, use `import { something } from "@scripts/<script-name>"`.
- To build just the newly-created script, run `yarn build` in the script's folder.
- To format just the newly-created script, run `yarn format` in the script's folder.
- To lint just the newly-created script, run `yarn lint` in the script's folder.

#### Important Notes

Scripts are built to the `dist/scripts` directory, and that is where you should point your [Bitburner VSCode Extension](https://github.com/bitburner-official/bitburner-vscode) or other script updater, if you're using one.

### Create a Library

Run `yarn create-library <library-name>` to create a new library in the `libs` folder.

- To import something from the newly-created library, use `import { something } from "@libs/<library-name>"`
- To format just the newly-created library, run `yarn format` in the library's folder.
- To lint just the newly-created library, run `yarn lint` in the library's folder.

#### Important Notes

Libraries are _never_ built directly, and instead built by the depending script or application.

### Create an Out-Of-Game Application

Run `yarn create-app <app-name>` to create a new app in the `apps` folder.

- To import something from the newly-created app, use `import { something } from "@apps/<app-name>"`.
- To build just the newly-created app, run `yarn build` in the app's folder.
- To format just the newly-created app, run `yarn format` in the app's folder.
- To lint just the newly-created app, run `yarn lint` in the app's folder.

#### Important Notes

Out-of-game applications each built to a unique `dist/apps/<app-name>` directory.
