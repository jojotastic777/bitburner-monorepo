import glob from "glob"
import { RollupOptions } from "rollup"
import typescript from "@rollup/plugin-typescript"
import nodeResolve from "@rollup/plugin-node-resolve"

const genTsAppConfig = (path: string): RollupOptions => ({
    input: path,
    output: {
        file: path.replace("src/", "../../dist/bitburner-scripts-2/").replace(/\.ts$/, ".js"),
        format: "esm"
    },
    plugins: [
        typescript(),
        nodeResolve()
    ],
    treeshake: "recommended"
})

const genJsAppConfig = (path: string): RollupOptions => ({
    input: path,
    output: {
        file: path.replace("src/", "../../dist/bitburner-scripts-2/"),
        format: "esm"
    },
    plugins: [
        nodeResolve()
    ],
    treeshake: "recommended"
})

const genAppConfig = (path: string): RollupOptions => {
    if (path.endsWith(".ts")) {
        return genTsAppConfig(path)
    }
    
    if (path.endsWith(".js")) {
        return genJsAppConfig(path)
    }

    return {}
}

const entryPoints: string[] = glob.sync("src/bin/**/*.*(ts|js)")
const options: RollupOptions[] = entryPoints.map(path => genAppConfig(path)).filter(config => Object.keys(config).length > 0)

export default options
