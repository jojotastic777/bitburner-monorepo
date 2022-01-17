import fs from "fs";
import prettier from "prettier";

const mainPackageJson = JSON.parse(fs.readFileSync("package.json").toString());

const SCRIPT_SHORT_NAME = process.argv[2];
const SCRIPT_NAME = `@${mainPackageJson.name}/${SCRIPT_SHORT_NAME}`;
const SCRIPT_DIR = `scripts/${SCRIPT_SHORT_NAME}`;

function processFile(filename: string) {
  const path = `${SCRIPT_DIR}/${filename}`;
  const file = fs
    .readFileSync(path)
    .toString()
    .replace("{{script_name}}", SCRIPT_NAME)
    .replace("{{script_short_name}}", SCRIPT_SHORT_NAME);

  fs.writeFileSync(path, file);
}

// Copy script template.
fs.cpSync("templates/script", SCRIPT_DIR, { recursive: true });

["package.json", "rollup.config.ts", "README.md"].forEach((file) =>
  processFile(file)
);

const baseTsConfig = JSON.parse(
  fs.readFileSync("tsconfig.base.json").toString()
);

if (baseTsConfig.compilerOptions === undefined)
  baseTsConfig.compilerOptions = { paths: {} };
if (baseTsConfig.compilerOptions.paths === undefined)
  baseTsConfig.compilerOptions.paths = {};
baseTsConfig.compilerOptions.paths[`@scripts/${SCRIPT_SHORT_NAME}`] = [
  `${SCRIPT_DIR}/src/index.ts`,
];

const baseTsConfigText: string = prettier.format(JSON.stringify(baseTsConfig), {
  parser: "json-stringify",
});
fs.writeFileSync("tsconfig.base.json", baseTsConfigText);
