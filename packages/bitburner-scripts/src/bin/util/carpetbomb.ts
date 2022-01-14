/**
 * A Bitburner script which NUKES all servers which it is presently possibly for the user to NUKE.
 * 
 * Usage: `run /bin/util/carpetbomb.js`
 * @module
 */

import { NS } from "@global/bitburner";
import { nuke } from "../../lib/nuke";
import { scan } from "../../lib/scan";
import log from "../../lib/log"

/**
 * The main function, called whenever the script is run.
 * @param ns A Netscript context.
 */
export async function main(ns: NS): Promise<void> {
    ns.disableLog("ALL")
    const logger = log(ns, "carpetbomb", "info")

    const STATUS = scan(ns).map(host => ({ host, nuked: nuke(ns, host) }))

    STATUS.filter(stat => stat.nuked).forEach(stat => logger.info(`NUKED '${stat.host}'.`))

    logger.info(`NUKED ${STATUS.filter(stat => stat.nuked).length}/${STATUS.length} hosts.`)
}
