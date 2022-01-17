import axios from "axios";
import fs from "fs";

axios
  .get(
    "https://raw.githubusercontent.com/danielyxie/bitburner/dev/src/ScriptEditor/NetscriptDefinitions.d.ts"
  )
  .then((res) =>
    fs.writeFileSync("@types/NetscriptDefinitions.d.ts", res.data)
  );
