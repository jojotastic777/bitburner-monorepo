import { NS } from "@global/bitburner";

export enum LOG_LEVEL {
    NONE = "NONE",
    DEBUG = "DEBUG",
    INFO = "INFO",
    WARN = "WARN",
    ERROR = "ERROR"
}

export class Logger {
    public constructor(
        private readonly ns:          NS,
        public  readonly programName: string,
        public  readonly logLevel:    LOG_LEVEL
    ) {
        this.ns.disableLog("ALL")
    }

    public debug(message: string) {
        const logString = `[${new Date().toLocaleTimeString()}] [${this.programName}] [${LOG_LEVEL.DEBUG}]: ${message}`

        if ([ LOG_LEVEL.DEBUG ].includes(this.logLevel)) {
            this.ns.tprintf(logString.replace(/%/g, "%%"))
        }

        this.ns.print(logString)
    }

    public info(message: string) {
        const logString = `[${new Date().toLocaleTimeString()}] [${this.programName}] [${LOG_LEVEL.INFO}]: ${message}`

        if ([ LOG_LEVEL.DEBUG, LOG_LEVEL.INFO ].includes(this.logLevel)) {
            this.ns.tprintf(logString.replace(/%/g, "%%"))
        }

        this.ns.print(logString)
    }

    public warn(message: string) {
        const logString = `[${new Date().toLocaleTimeString()}] [${this.programName}] [${LOG_LEVEL.WARN}]: ${message}`

        if ([ LOG_LEVEL.DEBUG, LOG_LEVEL.INFO, LOG_LEVEL.WARN ].includes(this.logLevel)) {
            this.ns.tprintf(logString.replace(/%/g, "%%"))
        }

        this.ns.print(logString)
    }

    public error(message: string) {
        const logString = `[${new Date().toLocaleTimeString()}] [${this.programName}] [${LOG_LEVEL.ERROR}]: ${message}`

        if ([ LOG_LEVEL.DEBUG, LOG_LEVEL.INFO, LOG_LEVEL.WARN, LOG_LEVEL.ERROR ].includes(this.logLevel)) {
            this.ns.tprintf(logString.replace(/%/g, "%%"))
        }

        this.ns.print(logString)
    }
}