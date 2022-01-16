import { NS } from "@global/bitburner";

export async function main(ns: NS): Promise<void> {
    const TARGET = ns.args[0] as string | undefined

    if (TARGET === undefined) {
        ns.exit()
        return
    }

    await ns.grow(TARGET)
}