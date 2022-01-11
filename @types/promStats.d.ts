import { Player, Server } from "./NetscriptDefinitions"

export interface GameState {
    player?: Player,
    servers?: Server[]
}

export interface GameMessage {
    timestamp: number
    gameState?: GameState
}