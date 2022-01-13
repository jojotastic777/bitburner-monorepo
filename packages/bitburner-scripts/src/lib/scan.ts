/**
 * A library for getting all available hosts in Bitburner.
 * @module
 */
import { NS } from "@global/bitburner";
import { dedupe } from "/lib/utility.js";

/**
 * A function which returns all available hosts.
 * @param ns A Netscript context.
 * @returns A list of all available hosts.
 */
export function scan(ns: NS, hosts: string[] = []): string[] {
    let newHosts = dedupe([ ...hosts, ...hosts.flatMap(host => ns.scan(host)) ])

    return newHosts.length > hosts.length ? scan(ns, newHosts) : hosts
}
