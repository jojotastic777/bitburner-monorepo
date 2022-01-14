/**
 * A Bitburner script which runs NUKE.exe (and other associated programs) on all possible hosts.
 * @module
 */
import { NS } from "@global/bitburner";
import { nuke } from "../../lib/nuke";
import { scan } from "../../lib/scan";

/**
 * The main function, called whenever the script is run.
 * @param ns A Netscript context.
 */
export async function main(ns: NS) {
    while (true) {
        const HOSTS = scan(ns)
        const NUKE_RESULTS = HOSTS.map(host => ({ host, didNuke: nuke(ns, host) })).filter(res => res.didNuke)

        if (NUKE_RESULTS.length > 0) {
            ns.toast(`NUKED ${NUKE_RESULTS.length} host${NUKE_RESULTS.length > 1 ? "s" : ""}.`, "success")
        }
        
        await ns.sleep(1000)
    }
}
