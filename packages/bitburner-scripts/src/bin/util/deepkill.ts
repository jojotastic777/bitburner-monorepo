/**
 * A Bitburner script which kills all processes that *aren't* on `home`. Intended as a counterpart to the built-in `killall` command.
 * 
 * Usage: `run /bin/util/deepkill.ts`
 * @module
 */
import { NS } from "@global/bitburner";
import { scan } from "/lib/scan.js";

/**
 * The main function, called whenever the script is run.
 * @param ns A Netscript context.
 */
export async function main(ns: NS): Promise<void> {
    const PROCESSES = scan(ns)
        .filter(host => host !== "home")
        .flatMap(host => ns.ps(host).map(proc => ({ host, ...proc })) )

    PROCESSES.forEach(proc => {
        ns.kill(proc.pid)
        ns.tprintf(`Killed process ${proc.filename}[${proc.args?.map(arg => JSON.stringify(arg)).join(", ")}]@${proc.host} (PID - ${proc.pid})`)
    })

    if (PROCESSES.length > 0) {
        ns.tprintf("\n")
    }

    ns.tprintf(`Killed ${PROCESSES.length} processes.`)
}
