/**
 * A Bitburner script which kills all processes that *aren't* on `home`. Intended as a counterpart to the built-in `killall` command.
 * 
 * Usage: `run /bin/util/deepkill.ts`
 * @module
 */
import { NS } from "@global/bitburner";
import { scan } from "../../lib/scan";
import log from "../../lib/log"

/**
 * The main function, called whenever the script is run.
 * @param ns A Netscript context.
 */
export async function main(ns: NS): Promise<void> {
    ns.disableLog("ALL")
    const logger = log(ns, "deepkill", "info")

    const PROCESSES = scan(ns)
        .filter(host => host !== "home")
        .flatMap(host => ns.ps(host).map(proc => ({ host, ...proc })) )

    PROCESSES.forEach(proc => {
        ns.kill(proc.pid)
        logger.info(`Killed process ${proc.filename}[${proc.args?.map(arg => JSON.stringify(arg)).join(", ")}]@${proc.host} (PID - ${proc.pid})`)
    })

    logger.info(`Killed ${PROCESSES.length} processes.`)
}
