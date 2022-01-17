/**
 * A library for mass-deploying Bitburner scripts.
 * @module
 */
import { NS } from "@global/bitburner";
import { exec } from "@libs/bb-exec";
import { scan } from "@libs/bb-scan";
 
 /**
  * Represents the various options which can be passed to `deploy`.
  */
export type DeployOptions = {
    allowDeployOnHome: boolean
}
 
 /**
  * Contains information on a set of mass-deployed scripts.
  */
export type Deployment = {
    script: string
    threads: number,
    args: (string | number | boolean)[],
    hosts: { hostname: string, pid: number, threads: number }[]
}
 
 /**
  * Automatically mass-deploy a script to as many servers as are needed to fulfill the desired number of threads.
  * @param ns A Netscript context.
  * @param script The script to be deployed.
  * @param threads The desired number of threads.
  * @param args The arguments to be passed to the deployed script.
  * @param options Various options which modify the behavior of the deployment.
  * @returns An object containing details of how the script was deployed.
  */
export async function deploy(ns: NS, script: string, threads: number | "MAX", args: (string | number | boolean)[], options?: DeployOptions): Promise<Deployment> {
    const OPTIONS: DeployOptions = {
        allowDeployOnHome: false,

        ...options
    }
    
    if (!ns.fileExists(script, "home")) {
        return {
            script,
            threads: 0,
            args: args,
            hosts: []
        }
    }

    if (threads <= 0) {
        return {
            script,
            threads: 0,
            args: args,
            hosts: []
        }
    }

    if (ns.getHostname() !== "home") {
        await ns.scp(script, "home", ns.getHostname())
    }

    const SCRIPT_RAM = ns.getScriptRam(script, "home")
    const HOSTS = scan(ns)
        .map(host => ns.getServer(host))
        .filter(host => host.hostname === "home" ? OPTIONS.allowDeployOnHome : true)
        .filter(host => host.hasAdminRights)
        .filter(host => host.maxRam - host.ramUsed >= SCRIPT_RAM)
        .map(host => ({ hostname: host.hostname, threads: Math.floor((host.maxRam - host.ramUsed) / SCRIPT_RAM)}))

    if (threads === "MAX") {
        const hostsDeployed = []

        for (const host of HOSTS) {
            const pid = await exec(ns, script, host.hostname, host.threads, args)

            hostsDeployed.push({ hostname: host.hostname, pid: pid, threads: host.threads })
        }

        return {
            script,
            threads: hostsDeployed.reduce((acc, cur) => acc + cur.threads, 0),
            args,
            hosts: hostsDeployed
        }
    }

    let threadsRemaining: number = Math.min(threads, HOSTS.reduce((acc, cur) => acc + cur.threads, 0))
    const hostsDeployed = []

    while (threadsRemaining > 0 && HOSTS.length > 0) {
        const host = HOSTS.pop() as { hostname: string, threads: number }
        const th = Math.min(threadsRemaining, host.threads)

        const pid = await exec(ns, script, host.hostname, th, args)

        hostsDeployed.push({ hostname: host.hostname, pid: pid, threads: host.threads })
        threadsRemaining -= th
    }

    return {
        script,
        threads: hostsDeployed.reduce((acc, cur) => acc + cur.threads, 0),
        args,
        hosts: hostsDeployed
    }
}