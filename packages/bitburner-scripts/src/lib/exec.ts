/**
 * A library for executing Bitburner scripts on remote hosts, without needing to worry about whether or not the script is present on the remote host.
 * @module
 */
import { NS } from "@global/bitburner";

/**
 * A wrapper function for ns.exec which uses ns.scp to ensure the script is present and up-to-date on the target host.
 * @param ns A Netscript context.
 * @param script The script to be executed.
 * @param targetHost The host the script is to be executed on.
 * @param threads The number of threads with which the script is to be executed.
 * @param args The arguments with which the script is to be executed.
 * @returns 
 * - The PID of the newly-executed script if successful.
 * - `0` if ns.exec failed somehow.
 * - `-1` if the script doesn't exist.
 * - `-2` if the target host doesn't exist.
 * - `-3` if the thread count is too low.
 * - `-4` if there isn't enough ram on the target host.
 * - `-5` if the thread count is a non-integer.
 * - `-6` if the script is already running.
 * - `-7` if `ns.scp` fails for some reason.
 */
export async function exec(ns: NS, script: string, targetHost: string, threads: number, args: (string | number | boolean)[]): Promise<number> {
    if (!ns.fileExists(script, "home")) {
        return -1
    }

    if (!ns.serverExists(targetHost)) {
        return -2
    }

    if (threads <= 0) {
        return -3
    }

    if (ns.getScriptRam(script, "home") * threads > ns.getServerMaxRam(targetHost) - ns.getServerUsedRam(targetHost)) {
        return -4
    }

    if (Math.floor(threads) !== threads) {
        return -5
    }

    if (ns.scriptRunning(script, targetHost)) {
        return -6
    }

    if (targetHost !== "home") {
        let scpResults = await ns.scp(script, "home", targetHost)

        if (scpResults !== true) {
            return -7
        }
    }
    
    return ns.exec(script, targetHost, threads, ...args)
}
