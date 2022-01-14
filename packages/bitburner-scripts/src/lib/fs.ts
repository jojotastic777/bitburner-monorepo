/**
 * A library for working with the filesystem in Bitburner.
 * @module
 */
import { NS } from "@global/bitburner"

/**
 * A filename processor which does the following:
 * - Adds a leading "/" if one is needed.
 * - Removes a leading "/" if one isn't needed.
 * - Adds ".txt" to the end of any filename not ending in ".txt", ".js", or ".script"
 * 
 * @param filename The filename to be normalized.
 * @returns A normalized filename.
 */
export function normalizeFilename(filename: string): string {
    // If the filename is lacking a neccesary leading "/", add one.
    filename = filename[0] !== "/" && filename.slice(1).includes("/") ? "/" + filename : filename

    // If the filename has an extra leading "/", remove it.
    filename = filename[0] === "/" && !filename.slice(1).includes("/") ? filename.slice(1) : filename

    // If the filename ends in ".txt", ".js", or ".script", add ".txt" to the end.
    if (!filename.endsWith(".txt") && !filename.endsWith(".js") && !filename.endsWith(".script")) {
        filename = filename.replace(/(?<=\.)[a-zA-z0-9\-]+$/, "$&.txt")
    }

    return filename
}

/**
 * A foldername processor which does the following:
 * - Adds a leading "/" if one is needed.
 * - Adds a trailing "/" if one is needed.
 * 
 * @param foldername The foldername to be normalized.
 * @returns A normalized foldername.
 */
export function normalizeFoldername(foldername: string): string {
    // If the foldername doesn't have a leading "/", add one.
    foldername = foldername[0] !== "/" ? "/" + foldername : foldername

    // If the foldername doesn't have a trailing "/", add one.
    foldername = !foldername.endsWith("/") ? foldername + "/" : foldername

    return foldername
}

/**
 * A function which joins two paths together.
 * @param start The starting path.
 * @param end The ending path.
 * @returns A new path which is the starting path followed by the ending path.
 */
export function joinPaths(start: string, end: string): string {
    if (end.startsWith("/")) {
        end = end.slice(1)
    }

    return start + end
}

/**
 * A wrapper for ns.read which does the following:
 * - Processes the filename with normalizeFilename.
 * - Copies the file from the 'home' system, if the script isn't already running there. (Returns an empty string if doing so is impossible.)
 * @param ns A Netscript context.
 * @param filename The name of the file to read.
 * @returns If the file exists, returns its contents. Otherwise, returns an empty string.
 */
export async function readFile(ns: NS, filename: string): Promise<string> {
    let normFilename = normalizeFilename(filename)

    // Copy the file from 'home' if we aren't running there already.
    if (ns.getHostname() !== "home") {
        let scpOk = await ns.scp(normFilename, "home", ns.getHostname())

        if (!scpOk) {
            return ""
        }
    }

    return await ns.read(normFilename)
}

/**
 * A wrapper for ns.write, which does the following:
 * - Processes the filename with normalizeFilename.
 * - Copies the newly-written file to the 'home' system if the script isn't already running there.
 * 
 * @param ns A Netscript context.
 * @param filename The name of the file to be written to.
 * @param data The data to write to the file.
 * @returns Whether or not the file was written successfully.
 */
export async function writeFile(ns: NS, filename: string, data: string): Promise<boolean> {
    let normFilename = normalizeFilename(filename)

    await ns.write(normFilename, [data], "w")
    
    if (ns.getHostname() !== "home") {
        return await ns.scp(normFilename, ns.getHostname(), "home")
    }

    return true
}

/**
 * A specialized wrapper for readFile intended for reading configuration.
 * @param ns A Netscript context.
 * @param configFilename The filename where the configuration can be found.
 * @param configDefaults Default configuration values.
 * @returns Configuration.
 */
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
