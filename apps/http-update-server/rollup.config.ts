import { RollupOptions } from "rollup";
import typescript from "@rollup/plugin-typescript";
import nodeResolve from "@rollup/plugin-node-resolve";

const options: RollupOptions = {
  input: "src/index.ts",
  output: {
    file: "../../dist/apps/http-update-server/index.js",
    format: "umd",
  },
  plugins: [typescript(), nodeResolve({
    resolveOnly: [ "@libs/http-update-manifest" ]
  })],
  treeshake: "recommended",
};

export default options;
