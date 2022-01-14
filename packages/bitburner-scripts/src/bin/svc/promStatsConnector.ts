import { NS } from "@global/bitburner";
import { GameMessage } from "@global/promStats"
import { scan } from "../../lib/scan";

async function sendPlayerState(ns: NS) {
    let message: GameMessage = {
        timestamp: Date.now(),
        gameState: {
            player: ns.getPlayer(),
            servers: scan(ns).map(host => ns.getServer(host))
        }
    }

    try {
        return await fetch("http://127.0.0.1:8888/game", {
            method: "POST",
            body: JSON.stringify(message),
            headers: {
                'Content-Type': "application/json"
            }
        })
    } catch (e) {}
}

export async function main(ns: NS) {
    while (true) {
        await sendPlayerState(ns)
        await ns.sleep(250)
    }
}
