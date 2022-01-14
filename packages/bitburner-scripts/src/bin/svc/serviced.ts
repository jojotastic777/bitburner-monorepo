/**
 * A Bitburner script which manages launching scripts from a set of configuration files.
 * @module
 */
import { NS } from "@global/bitburner";
import { deploy } from "../../lib/deploy";
import { exec } from "../../lib/exec";
import * as fs from "../../lib/fs"
import { nuke } from "../../lib/nuke";
import { scan } from "../../lib/scan";
import log from "../../lib/log"

/**
 * Script configuration schema.
 */
type ServicedConfig = {
    serviceDirectory: string
}

/**
 * Service configuration file schema.
 */
type Service = {
    name: string
    description?: string
    dependencies?: string[]
    hostname?: string

    allowDeployOnHome?: boolean

    filename: string
    threads: number | "MAX"
    args: (string | number | boolean)[]
}

/**
 * The main function, called whenever the script is run.
 * @param ns A Netscript context.
 */
export async function main(ns: NS) {
    ns.disableLog("ALL")

    const logger = log(ns, "serviced", "info")

    const CONFIG = await fs.getConfig<ServicedConfig>(ns, "/etc/serviced/config.json", {
        serviceDirectory: "/etc/serviced/services/"
    })

    const SERVICE_FILE_NAMES = ns.ls("home")
        .filter(file => file.startsWith(fs.normalizeFoldername(CONFIG.serviceDirectory)))
        .filter(file => file.endsWith(".service.txt"))

    if (SERVICE_FILE_NAMES.length === 0) {
        logger.info(`There are no services to deploy.`)
        ns.exit()
    }

    const SERVERS = scan(ns)
    SERVERS.forEach(host => nuke(ns, host))
    
    let services: Service[] = []

    for (let filename of SERVICE_FILE_NAMES) {
        let fileRaw = await fs.readFile(ns, filename)

        try {
            let service: Service = JSON.parse(fileRaw)
            logger.info(`Loaded service '${service.name}' @ '${filename}'.`)
            services.push(service)
        } catch (e) {
            logger.error(`Bad service file @ '${filename}'.`)
        }
    }

    let success = 0
    for (let service of services) {
        let broke = false
        for (let dependency of service.dependencies ?? []) {
            let dep = fs.normalizeFilename(dependency)
            if (!ns.fileExists(dep, "home")) {
                logger.error(`Failed to deploy service '${service.name}': Bad Dependency: '${dep}'`)
                broke = true
                break
            }

            for (let host of SERVERS) {
                let scpOk = await ns.scp(dep, "home", host)

                if (!scpOk) {
                    logger.error(`Failed to deploy service '${service.name}': File Transfer Failure`)
                    broke = true
                    break
                }

                if (broke) {
                    break
                }
            }
        }

        if (broke) {
            continue
        }

        if (service.hostname !== undefined) {
            if (service.threads === "MAX") {
                logger.error(`Failed to deploy service '${service.name}': Bad Thread Count`)
                continue
            }

            let execStatus = await exec(ns, service.filename, service.hostname, service.threads, service.args)

            if (execStatus === -1) {
                logger.error(`Failed to deploy service '${service.name}': Bad Filename`)
                continue
            }

            if (execStatus === -2) {
                logger.error(`Failed to deploy service '${service.name}': Bad Host`)
                continue
            }

            if (execStatus === -3 || execStatus === -5) {
                logger.error(`Failed to deploy service '${service.name}': Bad Thread Count`)
                continue
            }

            if (execStatus === -4) {
                logger.error(`Failed to deploy service '${service.name}': Insufficient Ram`)
                continue
            }

            if (execStatus === -6) {
                logger.error(`Failed to deploy service '${service.name}': Service Already Running`)
                continue
            }

            if (execStatus === -7) {
                logger.error(`Failed to deploy service '${service.name}': File Transfer Failure`)
                continue
            }

            logger.info(`Successfully deployed service '${service.name}' on host '${service.hostname}'`)
            success++
        } else {
            let deployStatus = await deploy(ns, service.filename, service.threads, service.args, {
                allowDeployOnHome: service.allowDeployOnHome ?? true
            })
            let hosts = deployStatus.hosts.filter(host => host.pid > 0)

            if (hosts.length === 0) {
                logger.error(`Failed to deploy service '${service.name}': No Hosts Available`)
                continue
            }

            logger.info(`Successfully deployed service '${service.name}' on ${hosts.length} hosts: ${hosts.map(host => host.hostname).join(", ")}`)
            success++
        }
    }

    logger.info(`Successfully deployed ${success} of ${SERVICE_FILE_NAMES.length} services.`)
    logger.debug(`Exiting.`)
}
