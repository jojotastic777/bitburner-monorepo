/**
 * A Bitburner script which manages the deployment of `hack`, `weaken`, and `grow` scripts.
 * 
 * Usage: `run /bin/svc/hwgMan.js`
 * @module
 */

import { NS } from "@global/bitburner";
import { deploy } from "../../lib/deploy";
import { readFile } from "../../lib/fs";

const CONFIG_PATH = "/etc/svc/hwgMan/config.txt"

type HWGManagerConfiguration = {
    hackTarget: string
}

/**
 * The main function, called whenever the script is run.
 * @param ns A Netscript context.
 */
export async function main(ns: NS): Promise<void> {
    while(true) {
        let configString: string = await readFile(ns, CONFIG_PATH)

        let config: HWGManagerConfiguration = {
            hackTarget: "n00dles"
        }

        try {
            config = { ...config, ...JSON.parse(configString) }
        } catch (e) {
            ns.print(`Couldn't read configuration file at ${CONFIG_PATH}, using default configuration.`)
        }

        if (ns.getServerSecurityLevel(config.hackTarget) > ns.getServerMinSecurityLevel(config.hackTarget)) {
            let weakenTime = ns.getWeakenTime(config.hackTarget)

            await deploy(ns, "/bin/simple/weaken.js", "MAX", [config.hackTarget])

            await ns.sleep(weakenTime + 100)
            continue
        } else if (ns.getServerMoneyAvailable(config.hackTarget) < ns.getServerMaxMoney(config.hackTarget)) {
            let growtime = ns.getGrowTime(config.hackTarget)

            await deploy(ns, "/bin/simple/grow.js", "MAX", [config.hackTarget])

            await ns.sleep(growtime + 100)
            continue
        } else {
            let hackTime = ns.getHackTime(config.hackTarget)

            await deploy(ns, "/bin/simple/hack.js", "MAX", [config.hackTarget])

            await ns.sleep(hackTime + 100)
            continue
        }
    }
}
