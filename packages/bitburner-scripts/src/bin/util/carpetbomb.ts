/**
 * A Bitburner script which NUKES all servers which it is presently possibly for the user to NUKE.
 * 
 * Usage: `run /bin/util/carpetbomb.js`
 * @module
 */

import { NS } from "@global/bitburner";
import { nuke } from "/lib/nuke.js";
import { scan } from "/lib/scan.js";

/**
 * The main function, called whenever the script is run.
 * @param ns A Netscript context.
 */
export async function main(ns: NS): Promise<void> {
    const STATUS = scan(ns).map(host => ({ host, nuked: nuke(ns, host) }))

    STATUS.filter(stat => stat.nuked).forEach(stat => ns.tprintf(`NUKED '${stat.host}'.`))

    if (STATUS.length > 0) {
        ns.tprintf("\n")
    }

    ns.tprintf(`NUKED ${STATUS.filter(stat => stat.nuked).length}/${STATUS.length} hosts.`)
}
