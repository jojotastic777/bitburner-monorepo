/**
 * A Bitburner script which hacks whatever host is passed as the first argument.
 * 
 * Usage: `run /bin/simple/hack.js <target>`
 * @module
 */

import { NS } from "@global/bitburner";

/**
 * The main function, called whenever the script is run.
 * @param ns A Netscript context.
 */
export async function main(ns: NS): Promise<void> {
    const TARGET = ns.args[0] as string | undefined

    if (TARGET === undefined) {
        ns.exit()
        return
    }

    await ns.hack(TARGET)
}