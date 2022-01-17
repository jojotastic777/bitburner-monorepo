import fs from "fs"
import glob from "glob"
import express from "express"
import { Manifest } from "@libs/http-update-manifest"

const PORT = parseInt(process.env.PORT ?? "63845")

const buildManifest = (): Manifest => {
    const filenames = glob.sync("**/*.js")
    const manifest: Manifest = {}

    filenames.forEach(filename => {
        manifest[filename] = fs.readFileSync(filename).toString()
    })

    return manifest
}

const app = express()

app.get("/", (req, res) => {
    res.json(buildManifest()).end()
})

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}.`)
})