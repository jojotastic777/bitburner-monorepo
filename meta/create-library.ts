import fs from "fs";
import prettier from "prettier";

const mainPackageJson = JSON.parse(fs.readFileSync("package.json").toString());

const LIB_SHORT_NAME = process.argv[2];
const LIB_NAME = `@${mainPackageJson.name}/${LIB_SHORT_NAME}`;
const LIB_DIR = `libs/${LIB_SHORT_NAME}`;

function processFile(filename: string) {
  const path = `${LIB_DIR}/${filename}`;
  const file = fs
    .readFileSync(path)
    .toString()
    .replace("{{lib_name}}", LIB_NAME)
    .replace("{{lib_short_name}}", LIB_SHORT_NAME);

  fs.writeFileSync(path, file);
}

// Copy script template.
fs.cpSync("templates/library", LIB_DIR, { recursive: true });

["package.json", "README.md"].forEach((file) => processFile(file));

const baseTsConfig = JSON.parse(
  fs.readFileSync("tsconfig.base.json").toString()
);

if (baseTsConfig.compilerOptions === undefined)
  baseTsConfig.compilerOptions = { paths: {} };
if (baseTsConfig.compilerOptions.paths === undefined)
  baseTsConfig.compilerOptions.paths = {};
baseTsConfig.compilerOptions.paths[`@libs/${LIB_SHORT_NAME}`] = [
  `${LIB_DIR}/src/index.ts`,
];

const baseTsConfigText: string = prettier.format(JSON.stringify(baseTsConfig), {
  parser: "json-stringify",
});
fs.writeFileSync("tsconfig.base.json", baseTsConfigText);
