/**
 * A Bitburner script which manages the deployment of `hack`, `weaken`, and `grow` scripts.
 * 
 * Usage: `run /bin/svc/hwgMan.js`
 * @module
 */

import { NS } from "@global/bitburner";
import { deploy } from "../../lib/deploy";

const CONFIG_PATH = "/etc/svc/hwgMan/config.txt"

type HWGManagerConfiguration = {
    hackTarget: string
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
    filename = filename.replace(/^dist\/bitburner/, "")

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
 * The main function, called whenever the script is run.
 * @param ns A Netscript context.
 */
export async function main(ns: NS): Promise<void> {
    while(true) {
        let configString: string = await readFile(ns, CONFIG_PATH)

        let config: HWGManagerConfiguration = {
            hackTarget: "n00dles"
        }

        try {
            config = { ...config, ...JSON.parse(configString) }
        } catch (e) {
            ns.print(`Couldn't read configuration file at ${CONFIG_PATH}, using default configuration.`)
        }

        if (ns.getServerSecurityLevel(config.hackTarget) > ns.getServerMinSecurityLevel(config.hackTarget)) {
            let weakenTime = ns.getWeakenTime(config.hackTarget)

            await deploy(ns, "/bin/simple/weaken.js", "MAX", [config.hackTarget])

            await ns.sleep(weakenTime + 100)
            continue
        } else if (ns.getServerMoneyAvailable(config.hackTarget) < ns.getServerMaxMoney(config.hackTarget)) {
            let growtime = ns.getGrowTime(config.hackTarget)

            await deploy(ns, "/bin/simple/grow.js", "MAX", [config.hackTarget])

            await ns.sleep(growtime + 100)
            continue
        } else {
            let hackTime = ns.getHackTime(config.hackTarget)

            await deploy(ns, "/bin/simple/hack.js", "MAX", [config.hackTarget])

            await ns.sleep(hackTime + 100)
            continue
        }
    }
}
