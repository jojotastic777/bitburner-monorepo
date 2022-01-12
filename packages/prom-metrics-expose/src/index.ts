import express, { Request } from "express"
import { GameState, GameMessage } from "@global/promStats"
import { Player } from "@global/bitburner"

const formatNumber = (num: number) => {
    return num.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 20 }).replaceAll(",", "")
}

const app = express()

let gameState: GameState = {}

app.use(express.json())

app.post("/game", (req: Request<{}, any, GameMessage>, res) => {
    if (req.body.gameState) {
        gameState = { ...gameState, ...req.body.gameState }
    }

    res.statusCode = 200
    res.end()
})

app.get("/metrics", (req, res) => {
    let resData =  [
        `hp ${formatNumber(gameState.player?.hp ?? 0)}`,
        `max_hp ${formatNumber(gameState.player?.max_hp ?? 0)}`,
        `money ${formatNumber(gameState.player?.money ?? 0)}`,

        `stat_level{skill="Hack"} ${formatNumber(gameState.player?.hacking ?? 1)}`,
        `stat_exp{skill="Hack"} ${formatNumber(gameState.player?.hacking_exp ?? 0)}`,
        `stat_mult{skill="Hack"} ${formatNumber(gameState.player?.hacking_mult ?? 1)}`,

        `stat_level{skill="Strength"} ${formatNumber(gameState.player?.strength ?? 1)}`,
        `stat_exp{skill="Strength"} ${formatNumber(gameState.player?.strength_exp ?? 0)}`,
        `stat_mult{skill="Strength"} ${formatNumber(gameState.player?.strength_mult ?? 1)}`,

        `stat_level{skill="Defense"} ${formatNumber(gameState.player?.defense ?? 1)}`,
        `stat_exp{skill="Defense"} ${formatNumber(gameState.player?.defense_exp ?? 0)}`,
        `stat_mult{skill="Defense"} ${formatNumber(gameState.player?.defense_mult ?? 1)}`,

        `stat_level{skill="Dexterity"} ${formatNumber(gameState.player?.dexterity ?? 1)}`,
        `stat_exp{skill="Dexterity"} ${formatNumber(gameState.player?.dexterity_exp ?? 0)}`,
        `stat_mult{skill="Dexterity"} ${formatNumber(gameState.player?.dexterity_mult ?? 1)}`,

        `stat_level{skill="Agility"} ${formatNumber(gameState.player?.agility ?? 1)}`,
        `stat_exp{skill="Agility"} ${formatNumber(gameState.player?.agility_exp ?? 0)}`,
        `stat_mult{skill="Agility"} ${formatNumber(gameState.player?.agility_mult ?? 1)}`,

        `stat_level{skill="Charisma"} ${formatNumber(gameState.player?.charisma ?? 1)}`,
        `stat_exp{skill="Charisma"} ${formatNumber(gameState.player?.charisma_exp ?? 0)}`,
        `stat_mult{skill="Charisma"} ${formatNumber(gameState.player?.charisma_mult ?? 1)}`,

        ...Object.keys(gameState.player ?? {})
            //@ts-expect-error
            .filter(key => (typeof (gameState.player?.[key]) === "number"))
            //@ts-expect-error
            .map((key: string): string => `player_${key} ${formatNumber(gameState.player?.[key])}`),

        ...Object.keys(gameState.player ?? {})
            //@ts-expect-error
            .filter(key => (typeof (gameState.player?.[key]) === "boolean"))
            //@ts-expect-error
            .map((key: string): string => `player_${key} ${formatNumber(gameState.player?.[key] ? 1 : 0)}`),

        ...(gameState.servers ?? [])
            .filter(srv => srv.hasAdminRights)
            .map(srv => `server_max_ram{hostname="${srv.hostname}"} ${formatNumber(srv.maxRam)}`),

        ...(gameState.servers ?? [])
            .filter(srv => srv.hasAdminRights)
            .map(srv => `server_used_ram{hostname="${srv.hostname}"} ${formatNumber(srv.ramUsed)}`)
    ].map(l => "bitburner_" + l).join("\n")

    res.status(200).contentType("text/plain").send(resData).end()
})

app.listen(8888)
