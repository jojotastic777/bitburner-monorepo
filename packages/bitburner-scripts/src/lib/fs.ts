import { NS } from "@global/bitburner"

/**
 * Removes "dist/bitburner" from the start of the filename.
 * Adds a leading "/" if one is needed.
 * Removes a leading "/" if one isn't needed.
 * 
 * @param filename The filename to be normalized.
 * @returns A normalized filename.
 */
export function normalizeFilename(filename: string): string {
    // Remove the unneeded folder prefix.
    // filename = filename.replace(/^dist\/bitburner/, "")

    // If the filename is lacking a neccesary leading "/", add one.
    filename = filename[0] !== "/" && filename.slice(1).includes("/") ? "/" + filename : filename

    // If the filename has an extra leading "/", remove it.
    filename = filename[0] === "/" && !filename.slice(1).includes("/") ? filename.slice(1) : filename

    return filename
}

/**
 * A wrapper for ns.read, which normalizes the filename and copies the requested file from "home" before reading.
 * @param ns A Netscript context.
 * @param filename The name of the file to read.
 * @returns If the file exists, returns its contents. Otherwise, returns an empty string.
 */
export async function readFile(ns: NS, filename: string): Promise<string> {
    let normFilename = normalizeFilename(filename)

    await ns.scp(normFilename, "home", ns.getHostname())
    return await ns.read(normFilename)
}

/**
 * A wrapper for ns.write, which normalizes the filename and copies the resulting file to "home" after writing.
 * Additionally, restarts the script using ns.spawn if the currently running script's file was written to.
 * If the script is restarted, sends a toast notification.
 * 
 * @param ns A Netscript context.
 * @param filename The name of the file to be written to.
 * @param data The data to write to the file.
 */
export async function writeFile(ns: NS, filename: string, data: string, allowRestart: boolean = false): Promise<void> {
    let normFilename = normalizeFilename(filename)

    await ns.write(normFilename, [data], "w")
    await ns.scp(normFilename, ns.getHostname(), "home")

    if (normFilename === ns.getScriptName() && allowRestart) {
        ns.toast(`Updated '${ns.getScriptName()}'. Restarting...`, "info")
        ns.spawn(ns.getScriptName())
    }
}

export async function getConfig<T>(ns: NS, configFilename: string, configDefaults: T): Promise<T> {
    const normFilename = normalizeFilename(configFilename)

    let configRaw = await readFile(ns, normFilename)
    let config = configDefaults

    try {
        config = { ...config, ...JSON.parse(configRaw) }
    } catch (e) {
        ns.print(`Couldn't read configuration file at ${normFilename}, using default configuration.`)
    }

    return config
}
