/**
 * A library for working with undirected graphs.
 * @module
 */

/**
 * An undirected graph.
 */
export type Graph = { [vertex: string]: string[] }

/**
 * Copies any graph.
 * @param graph Any graph.
 * @returns A copy of the graph.
 */
export function clone(graph: Graph): Graph {
    return JSON.parse(JSON.stringify(graph))
}

/**
 * Adds an edge to a graph.
 * @param graph Any graph.
 * @param source The vertex the new edge should connect from.
 * @param destination The vertex the new edge should connect to.
 * @returns A copy of the graph, with a new edge added to it.
 */
export function addEdge(graph: Graph, source: string, destination: string): Graph {
    if (graph[source] === undefined || graph[destination] === undefined) {
        return graph
    }

    if (graph[source].includes(destination) || graph[destination].includes(source)) {
        return graph
    }

    graph = clone(graph)
    graph[source].push(destination)
    graph[destination].push(source)

    return graph
}

/**
 * Adds a vertex to a graph.
 * @param graph Any graph.
 * @param vertex The vertex to be added to the graph.
 * @returns A copy of the graph, with a new vertex added to it.
 */
export function addVertex(graph: Graph, vertex: string): Graph {
    graph = clone(graph)
    graph[vertex] = graph[vertex] ?? []

    return graph
}

/**
 * Removes an edge from a graph.
 * @param graph Any graph.
 * @param source The vertex which the edge to be removed connects from.
 * @param destination The vertex which the edge to be removed connects to.
 * @returns A copy of the graph, with an edge removes.
 */
export function removeEdge(graph: Graph, source: string, destination: string): Graph {
    if (graph[source] === undefined || graph[destination] === undefined) {
        return graph
    }

    graph = clone(graph)
    graph[source] = graph[source].filter(vertex => vertex !== destination)
    graph[destination] = graph[destination].filter(vertex => vertex !== source)

    return graph
}

/**
 * Removes a vertex from a graph.
 * @param graph Any graph.
 * @param vertex The vertex to be removed.
 * @returns A copy of the graph, with a vertex removed.
 */
export function removeVertex(graph: Graph, vertex: string): Graph {
    if (graph[vertex] === undefined) {
        return graph
    }

    while (graph[vertex].length > 0) {
        const adjacentVertex = graph[vertex].pop()!
        graph = removeEdge(graph, vertex, adjacentVertex)
    }

    delete graph[vertex]

    return graph
}

/**
 * Conducts a breadth-first search of a graph to find a path between two points.
 * @param graph Any graph.
 * @param start The vertex the path should start from.
 * @param end The vertex the path should end at.
 * @returns A list of vertices constituting a path between the starting and ending vertices.
 */
export function findPath(graph: Graph, start: string, end: string): string[] {
    let queue = [ start ]
    let visited: { [vertex: string]: boolean } = { [start]: true }
    let depth: { [vertex: string]: number } = { [start]: 0 }

    while (queue.length > 0) {
        let currVertex: string = queue.shift()!
        for (let adjVertex of graph[currVertex]) {
            if (!visited[adjVertex]) {
                visited[adjVertex] = true
                queue.push(adjVertex)
                depth[adjVertex] = depth[currVertex] + 1
            }
        }
    }

    let path = [ end ]
    
    while (path[path.length - 1] !== start) {
        path.push(Object.keys(depth).find(vertex => depth[path[path.length - 1]] - 1 === depth[vertex] && graph[vertex].includes(path[path.length - 1]))!)
    }

    return path.reverse()
}
