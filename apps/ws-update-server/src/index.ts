import { WebSocketServer } from "ws"
import * as chokidar from "chokidar"
import * as fs from "fs"
import { UpdateMessage } from "@libs/UpdateMessage"

const PORT: number = parseInt(process.env.PORT ?? "8080")

console.log(process.cwd())

// Create a new WebSocket server listening on the specified port, defaulting to 8080.
const wss = new WebSocketServer({
    port: PORT
})

wss.on("listening", () => {
    console.log(`Update Server listening on port ${PORT}.`)
})

wss.on("connection", (ws, req) => {
    console.log(`Connection from '${req.socket.remoteAddress}'.`)

    // When a file event happened, send a relevant UpdateMessage.
    const addFile    = (path: string) => {
        // Delay is needed because Rollup is being a shithead.
        setTimeout(() => ws.send(JSON.stringify({ type: "add",    path, content: fs.readFileSync(path).toString() } as UpdateMessage)), 500)
    }
    const changeFile = (path: string) => {
        // Delay is needed because Rollup is being a shithead.
        setTimeout(() => ws.send(JSON.stringify({ type: "change", path, content: fs.readFileSync(path).toString() } as UpdateMessage)), 500)
    }
    const removeFile = (path: string) => ws.send(JSON.stringify({ type: "remove", path                                            } as UpdateMessage))

    // Set up the file watcher.
    const watcher = chokidar.watch("./bitburner-scripts")
        .on("add", addFile)
        .on("change", changeFile)
        .on("unlink", removeFile)

    ws.on("close", () => {
        console.log(`Closed connection from '${req.socket.remoteAddress}'.`)

        // Stop the relevent file watcher instance when a socket is closed.
        watcher.close()
    })
})