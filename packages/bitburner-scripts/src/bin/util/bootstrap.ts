/**
 * A Bitburner script which downloads a known-good version of `wsUpdater` from a gist, then runs it. Meant to easily bootstrap fresh installations.
 * 
 * Usage: `run /bin/util/bootstrap.js`.
 * @module
 */

import { NS } from "@global/bitburner";
import log from "../../lib/log"

const UPDATER_URL      = "https://gist.github.com/jojotastic777/bb86fd11b0ae60eaa0dcf99a0f0cfd5f/raw/e7401407a180e27e2a0331ce4d8a460d73bc68e7/bitburner-wsUpdater-bootstrap.js"
const UPDATER_FILENAME = "/bin/svc/wsUpdater.js"

/**
 * The main function, called whenever the script is run.
 * @param ns A Netscript context.
 */
export async function main(ns: NS): Promise<void> {
    ns.disableLog("ALL")
    const logger = log(ns, "bootstrap", "info")

    let response = await fetch(UPDATER_URL)

    if (response.status !== 200) {
        logger.error(`Failed to download updater. HTTP Error ${response.status}.`)
        ns.exit()
        return
    }

    let content: string = await response.text()
    await ns.write(UPDATER_FILENAME, [content], "w")

    logger.info("Successfully downloaded updater. Running...")
    ns.spawn(UPDATER_FILENAME)
}