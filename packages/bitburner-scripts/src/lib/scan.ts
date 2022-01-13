/**
 * A library for getting all available hosts in Bitburner.
 * @module
 */
import { NS } from "@global/bitburner";
import { dedupe } from "/lib/utility.js";
import * as graph from "/lib/graph.js"

/**
 * A function which returns all available hosts.
 * @param ns A Netscript context.
 * @returns A list of all available hosts.
 */
export function scan(ns: NS, hosts: string[] = [ "home" ]): string[] {
    let newHosts = dedupe([ ...hosts, ...hosts.flatMap(host => ns.scan(host)) ])

    return newHosts.length > hosts.length ? scan(ns, newHosts) : hosts
}

export function buildNetGraph(ns: NS): graph.Graph {
    const HOSTS = scan(ns)

    let netGraph: graph.Graph = {}

    HOSTS.forEach(host => netGraph = graph.addVertex(netGraph, host))
    HOSTS.forEach(host => ns.scan(host).forEach(adjacent => netGraph = graph.addEdge(netGraph, host, adjacent)))

    return netGraph
}
