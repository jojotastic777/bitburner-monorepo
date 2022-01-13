import { NS } from "@global/bitburner";

// TODO: Add actual configs using the fs library.
const MIN_SERVER_RAM = 2
const SERVER_PREFIX = "starforge-"
const BUDGET_QUOTIENT = 1/100

export async function main(ns: NS) {
    const MAX_SERVERS = ns.getPurchasedServerLimit()
    const MAX_RAM = ns.getPurchasedServerMaxRam()

    while (true) {
        const MONEY_AVAIL = ns.getServerMoneyAvailable("home") * BUDGET_QUOTIENT
        const CURR_SERVERS = ns.getPurchasedServers().map(host => ns.getServer(host))

        if (CURR_SERVERS.length < MAX_SERVERS && ns.getPurchasedServerCost(MIN_SERVER_RAM) <= MONEY_AVAIL) {
            let newServerName = `${SERVER_PREFIX}${CURR_SERVERS.length}`
            ns.purchaseServer(newServerName, MIN_SERVER_RAM)
            ns.toast(`Purchased new server: '${newServerName}'.`, "success")
        }

        let upgradeCandidate = CURR_SERVERS
            .filter(srv => srv.maxRam * 2 <= MAX_RAM)
            .sort((a, b) => a.maxRam - b.maxRam)
            .filter(srv => ns.getPurchasedServerCost(srv.maxRam * 2) < MONEY_AVAIL)[0]
        
        if (upgradeCandidate !== undefined) {
            ns.killall(upgradeCandidate.hostname)
            ns.deleteServer(upgradeCandidate.hostname)
            ns.purchaseServer(upgradeCandidate.hostname, upgradeCandidate.maxRam * 2)
            ns.toast(`Upgraded server '${upgradeCandidate.hostname}' from ${upgradeCandidate.maxRam}GB to ${upgradeCandidate.maxRam * 2}GB.`)
        }

        await ns.sleep(1000)
    }
}
