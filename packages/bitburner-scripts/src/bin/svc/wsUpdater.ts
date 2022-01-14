/**
 * A Bitburner script which connects to a compatible update server and responds appropriately whenever an update is pushed.
 * 
 * Usage: `run /bin/svc/wsUpdater.js`
 * @module
 */
import { NS } from "@global/bitburner";
import { UpdateMessage } from "@global/UpdateMessage";
import log from "../../lib/log"

const CONFIG_PATH: string = "/etc/svc/wsUpdater/config.txt"

/**
 * An object representing all the options available to configure the updater.
 * 
 * Configuration is read from `/etc/svc/wsUpdater/config.txt`.
 */
export type UpdaterConfig = {
    serverUrl: string
}

/**
 * Removes "dist/bitburner" from the start of the filename.
 * Adds a leading "/" if one is needed.
 * Removes a leading "/" if one isn't needed.
 * 
 * @param filename The filename to be normalized.
 * @returns A normalized filename.
 */
function normalizeFilename(filename: string): string {
    // Remove the unneeded folder prefix.
    filename = filename.replace(/^bitburner-scripts/, "")

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
async function readFile(ns: NS, filename: string): Promise<string> {
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
async function writeFile(ns: NS, filename: string, data: string, allowRestart: boolean = false): Promise<void> {
    let normFilename = normalizeFilename(filename)

    await ns.write(normFilename, [data], "w")
    await ns.scp(normFilename, ns.getHostname(), "home")

    if (normFilename === ns.getScriptName() && allowRestart) {
        ns.toast(`Updated '${ns.getScriptName()}'. Restarting...`, "info")
        ns.spawn(ns.getScriptName())
    }
}

let messageQueue: UpdateMessage[] = []

/**
 * The main function, called whenever the script is run.
 * @param ns A Netscript context.
 */
export async function main(ns: NS): Promise<void> {
    // Disable extranious logging.
    ns.disableLog("ALL")

    // Set up logger.
    const logger = log(ns, "wsUpdater", "none")

    // Read the configuration file, if it exists.
    let configString: string = await readFile(ns, CONFIG_PATH)

    // Set up default configuration.
    let config: UpdaterConfig = {
        serverUrl: "ws://127.0.0.1:8080"
    }

    try {
        // Override default configuration with values from read config file.
        config = { ...config, ...JSON.parse(configString) }
    } catch (e) {
        logger.warning(`Couldn't read configuration file at ${CONFIG_PATH}, using default configuration.`)
    }

    // Open a connection to the update server.
    let ws = new WebSocket(config.serverUrl)

    // Notify when/if the connection is established.
    ws.onopen = () => {
        ns.toast(`Connected to update server at '${config.serverUrl}'.`, "success")
    }

    // Warn and exit the script when/if the connection is closed.
    ws.onclose = () => {
        ns.toast(`Closed connection to update server at '${config.serverUrl}'.`, "warning")
        ns.exit()
    }

    // Warn when/if there is a connection error.
    ws.onerror = () => {
        ns.toast(`Error connecting to update server at '${config.serverUrl}'.`, "error")
    }

    // Close the connection to the update server when the script is terminated.
    ns.atExit(() => {
        ws.close()
    })

    ws.onmessage = (ev) => {
        // Parse the recieved message, assuming it's an UpdateMessage.
        let message: UpdateMessage = JSON.parse(ev.data.toString())

        ns.tprint(`${message.path} ${message.type} ${message.content?.length ?? ""}`)

        // Add the message to the message queue.
        messageQueue.push(message)
    }

    while (true) {
        // Split the message queue into catagories based on each message's type.
        let added   = messageQueue.filter(msg => msg.type === "add" && (msg.content?.length ?? 0) > 0)
        let changed = messageQueue.filter(msg => msg.type === "change" && (msg.content?.length ?? 0) > 0)
        let removed = messageQueue.filter(msg => msg.type === "remove")

        // Empty the message queue.
        messageQueue = []

        // Process "added" messages.
        if (added.length > 0) {
            ns.toast(`Added ${added.length} files.`, "success")

            for (let msg of added) {
                await writeFile(ns, msg.path, msg.content ?? "")
            }
        }

        // Process "changed" messages.
        if (changed.length > 0) {
            ns.toast(`Changed ${changed.length} files.`, "success")

            for (let msg of changed) {
                await writeFile(ns, msg.path, msg.content ?? "", true)
            }
        }

        // Process "removed" messages.
        if (removed.length > 0) {
            ns.toast(`Removed ${removed.length} files.`, "success")

            for (let msg of removed) {
                let normalizedFilename = normalizeFilename(msg.path)

                ns.rm(normalizedFilename, "home")

                if (ns.getHostname() !== "home") {
                    ns.rm(normalizedFilename, ns.getHostname())
                }
            }
        }
        
        await ns.asleep(1000)
    }
}