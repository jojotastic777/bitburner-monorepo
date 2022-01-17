/**
 * A Bitburner library for running `NUKE.exe` and the associated "port buster" programs without worrying about which programs are currently available.
 * @module
 */
import { NS } from "@global/bitburner";

type PortBusterFunction = (ns: NS, host: string) => void
class PortBuster {
    private _exec: PortBusterFunction

    constructor(public filename: string, exec: PortBusterFunction) {
        this._exec = exec
    }

    public check(ns: NS): boolean {
        return ns.fileExists(this.filename, "home")
    }

    public exec(ns: NS, host: string): void {
        this._exec(ns, host)
    }
}
 
const PORT_BUSTERS: PortBuster[] = [
    new PortBuster("BruteSSH.exe",  (ns: NS, host: string) => ns.brutessh(host) ),
    new PortBuster("FTPCrack.exe",  (ns: NS, host: string) => ns.ftpcrack(host) ),
    new PortBuster("relaySMTP.exe", (ns: NS, host: string) => ns.relaysmtp(host)),
    new PortBuster("HTTPWorm.exe",  (ns: NS, host: string) => ns.httpworm(host) ),
    new PortBuster("SQLInject.exe", (ns: NS, host: string) => ns.sqlinject(host))
]
 
 /**
  * Runs NUKE.exe on the specified host. Uses all available/neccessary port busters (Ex. BruteSSH.exe, FTPCrack.exe, etc.) before doing so.
  * @param ns A Netscript context.
  * @param host The host to be NUKED.
  * @returns Whether or not the host was successfuly nuked.
  */
export function nuke(ns: NS, host: string): boolean {
    const BUSTERS_AVAIL = PORT_BUSTERS.filter(buster => buster.check(ns))

    if (!ns.serverExists(host)) {
        return false
    }

    if (ns.hasRootAccess(host)) {
        return false
    }

    if (ns.getServerNumPortsRequired(host) > BUSTERS_AVAIL.length) {
        return false
    }

    BUSTERS_AVAIL.forEach(buster => buster.exec(ns, host))
    ns.nuke(host)

    return true
}