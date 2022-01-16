import { NS } from "@global/bitburner"
import * as R from "ramda"

export const normalizeFilename = (filename: string): string => {
    // If the filename is lacking a necessary leading "/", add one.
    filename = filename[0] !== "/" && filename.slice(1).includes("/") ? "/" + filename : filename

    // If the filename has an extra leading "/", remove it.
    filename = filename[0] === "/" && !filename.slice(1).includes("/") ? filename.slice(1) : filename

    // If the filename doesn't end in ".txt", ".js", or ".script", add ".txt" to the end.
    if (!filename.endsWith(".txt") && !filename.endsWith(".js") && !filename.endsWith(".script")) {
        filename = filename.replace(/(?<=\.)[a-zA-z0-9-]+$/, "$&.txt")
    }

    return filename
}

export const readFile = R.curry(async (ns: NS, filename: string): Promise<string> => {
    filename = normalizeFilename(filename)

    if (!ns.fileExists(filename, "home")) {
        return ""
    }

    if (ns.getHostname() !== "home") {
        const scpStatus = await ns.scp(filename, "home", ns.getHostname())

        if (!scpStatus) {
            return ""
        }
    }

    return ns.read(filename)
})

export enum WRITE_STATUS {
    OK = "OK",
    SCP_FAILURE = "SCP_FAILURE"
}

export const writeFile = R.curry(async (ns: NS, filename: string, content: string): Promise<WRITE_STATUS> => {
    filename = normalizeFilename(filename)

    await ns.write(filename, content, "w")

    if (ns.getHostname() !== "home") {
        const scpStatus = await ns.scp(filename, ns.getHostname(), "home")

        if (!scpStatus) {
            return WRITE_STATUS.SCP_FAILURE
        }
    }

    return WRITE_STATUS.OK
})

export const appendFile = R.curry(async (ns: NS, filename: string, content: string): Promise<WRITE_STATUS> => {
    filename = normalizeFilename(filename)

    await ns.write(filename, content, "a")

    if (ns.getHostname() !== "home") {
        const scpStatus = await ns.scp(filename, ns.getHostname(), "home")

        if (!scpStatus) {
            return WRITE_STATUS.SCP_FAILURE
        }
    }

    return WRITE_STATUS.OK
})

export const removeFile = R.curry(async (ns: NS, filename: string): Promise<void> => {
    filename = normalizeFilename(filename)

    ns.rm(filename)
    ns.rm(filename, "home")
})

export const readConfig = R.curry(async function<T> (ns: NS, filename: string, defaultConfig: T): Promise<T> {
    const configRaw = await readFile(ns, filename)

    let config: T = defaultConfig
    try {
        config = JSON.parse(configRaw)
    } catch (e) {}

    return config
})
