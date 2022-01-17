import fs from "fs";
import prettier from "prettier";

const mainPackageJson = JSON.parse(fs.readFileSync("package.json").toString());

const APP_SHORT_NAME = process.argv[2];
const APP_NAME = `@${mainPackageJson.name}/${APP_SHORT_NAME}`;
const APP_DIR = `apps/${APP_SHORT_NAME}`;

function processFile(filename: string) {
  const path = `${APP_DIR}/${filename}`;
  const file = fs
    .readFileSync(path)
    .toString()
    .replace("{{app_name}}", APP_NAME)
    .replace("{{app_short_name}}", APP_SHORT_NAME);

  fs.writeFileSync(path, file);
}

// Copy script template.
fs.cpSync("templates/app", APP_DIR, { recursive: true });

["package.json", "rollup.config.ts", "README.md"].forEach((file) => processFile(file));

const baseTsConfig = JSON.parse(
  fs.readFileSync("tsconfig.base.json").toString()
);

if (baseTsConfig.compilerOptions === undefined)
  baseTsConfig.compilerOptions = { paths: {} };
if (baseTsConfig.compilerOptions.paths === undefined)
  baseTsConfig.compilerOptions.paths = {};
baseTsConfig.compilerOptions.paths[`@apps/${APP_SHORT_NAME}`] = [
  `${APP_DIR}/src/index.ts`,
];

const baseTsConfigText: string = prettier.format(JSON.stringify(baseTsConfig), {
  parser: "json-stringify",
});
fs.writeFileSync("tsconfig.base.json", baseTsConfigText);
