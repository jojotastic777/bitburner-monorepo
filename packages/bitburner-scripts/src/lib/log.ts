import { NS } from "@global/bitburner"
import * as R from "ramda"

export type LogLevel = "none" | "debug" | "info" | "warning" | "error"

export default R.curry((ns: NS, scriptName: string, logLevel: LogLevel) => ({
    debug: (message: string): void => {
        let logString = `[${scriptName}] [DEBUG]: ${message}`

        if ([ "debug" ].includes(logLevel)) {
            ns.tprintf(logString)
        }

        ns.print(logString)
    },

    info: (message: string): void => {
        let logString = `[${scriptName}] [INFO]: ${message}`

        if ([ "debug", "info" ].includes(logLevel)) {
            ns.tprintf(logString)
        }

        ns.print(logString)
    },

    warning: (message: string): void => {
        let logString = `[${scriptName}] [WARN]: ${message}`

        if ([ "debug", "info", "warning" ].includes(logLevel)) {
            ns.tprintf(logString)
        }

        ns.print(logString)
    },

    error: (message: string): void => {
        let logString = `[${scriptName}] [ERROR]: ${message}`

        if ([ "debug", "info", "warning", "error" ].includes(logLevel)) {
            ns.tprintf(logString)
        }

        ns.print(logString)
    }
}))
