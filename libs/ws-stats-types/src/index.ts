import { Player, ProcessInfo } from "@global/bitburner"

export type RamState = {
    local: {
        total: number
        used: number
        free: number
    }

    remote: {
        total: number
        used: number
        free: number
    }
}

export type ExtendedProcessInfo = ProcessInfo & {
    host: string,
    logs: string[]
}

export type GameState = {
    player: Player
    ram: RamState
    processes: ExtendedProcessInfo[]
}

export type GameMessage = {
    state?: GameState
}

export type ViewMessage = {
    state?: GameState
}
