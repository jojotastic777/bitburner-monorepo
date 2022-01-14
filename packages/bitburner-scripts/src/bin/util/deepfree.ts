/**
 * A Bitburner script which acts as a replacement for the built-in `free` command.
 * @module
 */
import { NS } from "@global/bitburner";
import { scan } from "../../lib/scan";

/**
 * The main function, called whenever the script is run.
 * @param ns A Netscript context.
 */
export async function main(ns: NS) {
    const SERVERS = scan(ns).concat(ns.getPurchasedServers()).map(host => ns.getServer(host))
    const TOTAL_RAM = SERVERS.map(srv => srv.maxRam).reduce((acc, cur) => acc + cur)
    const USED_RAM = SERVERS.map(srv => srv.ramUsed).reduce((acc, cur) => acc + cur)
    const FREE_RAM = TOTAL_RAM - USED_RAM
    
    ns.tprintf(`Total:     ${ns.nFormat(TOTAL_RAM * 1e9, "0.00b")}`)
    ns.tprintf(`Used:      ${ns.nFormat(USED_RAM * 1e9, "0.00b")} (${ns.nFormat(USED_RAM / TOTAL_RAM * 100, "0.00")}%%)`)
    ns.tprintf(`Available: ${ns.nFormat(FREE_RAM * 1e9, "0.00b")} (${ns.nFormat(FREE_RAM / TOTAL_RAM * 100, "0.00")}%%)`)
}
