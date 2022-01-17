import { RollupOptions } from "rollup";
import typescript from "@rollup/plugin-typescript";
import nodeResolve from "@rollup/plugin-node-resolve";

const options: RollupOptions = {
  input: "src/index.ts",
  output: {
    file: "../../dist/apps/{{app_short_name}}/index.js",
    format: "esm",
  },
  plugins: [typescript(), nodeResolve()],
  treeshake: "recommended",
};

export default options;
