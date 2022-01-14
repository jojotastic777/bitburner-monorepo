/**
 * A Bitburner script which connects the user's terminal to the specified host using `scan.buildNetGraph` and `graph.findPath`.
 * @module
 */
import { NS } from "@global/bitburner";
import { findPath } from "../../lib/graph";
import { buildNetGraph } from "../../lib/scan";

/**
 * The function required to allow Bitburner to have correct autocompletes. Basically black magic.
 */
export function autocomplete(data: any) {
    return [...data.servers]
}

const doc = globalThis["document"]

/**
 * Run a command in the terminal using HTML injection. Basically black magic.
 * @param command The command to be run in the terminal.
 */
function runTerminalCommand(command: string): void {
    const termInput: HTMLInputElement = doc.getElementById("terminal-input")! as HTMLInputElement
    termInput.value = command

    const handlerKey: string = Object.keys(termInput)[1]
    // @ts-expect-error
    termInput[handlerKey].onChange({ target: termInput })
    // @ts-expect-error
    termInput[handlerKey].onKeyDown({ keyCode: 13, preventDefault: () => null })
}

/**
 * The main function, called whenever the script is run.
 * @param ns A Netscript context.
 */
export async function main(ns: NS) {
    let target = ns.args[0] as string | undefined

    if (target === undefined) {
        ns.tprintf("Please specify a host to connect to.")
        ns.exit()
        return
    }

    if (!ns.serverExists(target)) {
        ns.tprintf(`Host '${target}' does not exist.`)
        ns.exit()
        return
    }

    let netGraph = buildNetGraph(ns)
    let path = findPath(netGraph, ns.getHostname(), target)

    ns.tprintf(`Found Path: ${path.join(" -> ")}`)
    ns.tprintf(`Executing...`)

    runTerminalCommand(path.slice(1).map(host => `connect ${host}`).join(";"))
}
