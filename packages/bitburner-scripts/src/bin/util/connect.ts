import { NS } from "@global/bitburner";
import { findPath } from "/lib/graph.js";
import { buildNetGraph } from "/lib/scan.js";

export function autocomplete(data: any) {
    return [...data.servers]
}

const doc: Document = eval("document")

function runTerminalCommand(command: string): void {
    const termInput: HTMLInputElement = doc.getElementById("terminal-input")! as HTMLInputElement
    termInput.value = command

    const handlerKey: string = Object.keys(termInput)[1]
    // @ts-expect-error
    termInput[handlerKey].onChange({ target: termInput })
    // @ts-expect-error
    termInput[handlerKey].onKeyDown({ keyCode: 13, preventDefault: () => null })
}

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
