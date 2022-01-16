import { NS } from "@global/bitburner";
import { Manifest } from "@global/httpUpdater"
import { Logger, LOG_LEVEL } from "../../lib/Logger";
import * as fs from "../../lib/fs"

const CONFIG_DIRECTORY = "/etc/update/config.json"

type UpdateConfig = {
    serverUrl: string
}

const currentManifest: Manifest = {}

const fetchManifest = async (log: Logger, url: string): Promise<Manifest> => {
    const response = await fetch(url).catch(() => log.error(`Failed to retrieve manifest from '${url}'.`))

    let manifest: Manifest = currentManifest
    try {
        manifest = await response?.json() ?? manifest
    } catch (e) {
        log.error(`Failed to parse manifest from '${url}'.`)
    }

    return manifest
}

const normalizeManifest = (manifest: Manifest): Manifest => {
    const newManifest: Manifest = {}

    Object.keys(manifest).forEach(filename => newManifest[fs.normalizeFilename(filename)] = manifest[filename])

    return newManifest
}

export async function main(ns: NS) {
    const log = new Logger(ns, "update", LOG_LEVEL.NONE)
    const config: UpdateConfig = await fs.readConfig(ns, CONFIG_DIRECTORY, {
        serverUrl: "http://127.0.0.1:63845"
    })

    ns.toast(`Starting update server. (Server: '${config.serverUrl}')`, "info")
    log.info(`Starting update server. (Server: '${config.serverUrl}')`)

    while (true) {
        const newManifest = normalizeManifest(await fetchManifest(log, config.serverUrl))

        for (const filename of Object.keys(newManifest)) {
            const content = newManifest[filename]

            if (currentManifest[filename] === undefined) {
                currentManifest[filename] = content
                const writeStatus = await fs.writeFile(ns, filename, content)
                
                if (writeStatus !== fs.WRITE_STATUS.OK) {
                    log.error(`Failed to write file '${filename}': ${writeStatus}.`)
                    continue
                }

                log.info(`Created file: '${filename}'.`)
                ns.toast(`Created file: '${filename}'.`)
                continue
            }

            if (currentManifest[filename] !== content) {
                currentManifest[filename] = content
                const writeStatus = await fs.writeFile(ns, filename, content)
                
                if (writeStatus !== fs.WRITE_STATUS.OK) {
                    log.error(`Failed to write file '${filename}': ${writeStatus}.`)
                    continue
                }

                log.info(`Updated file: '${filename}'.`)
                ns.toast(`Updated file: '${filename}'.`)

                if (filename === ns.getScriptName() && content.replace(/\s/g, "").length > 0) {
                    ns.toast(`Restarting ${ns.getScriptName()}...`, "warning")
                    log.warn(`Restarting ${ns.getScriptName()}...`)
                    ns.spawn(ns.getScriptName(), 1, ...(ns.args as string[]))
                    return
                }

                continue
            }
        }

        const removedFiles = Object.keys(currentManifest).filter(f => !Object.keys(newManifest).includes(f))
        for (const filename of removedFiles) {
            delete currentManifest[filename]
            await fs.removeFile(ns, filename)

            log.info(`Removed file: '${filename}'.`)
            ns.toast(`Removed File: '${filename}'.`)
        }

        await ns.sleep(1000)
    }
}
