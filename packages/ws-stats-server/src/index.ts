import { GameMessage, GameState, ViewMessage } from "@global/statsViewer"
import WebSocket, { WebSocketServer } from "ws"
import http from "http"

const PORT = 9090

const server = http.createServer()

const wssGame = new WebSocketServer({ noServer: true })
const wssView = new WebSocketServer({ noServer: true })

let gameState: GameState | undefined
let viewSockets: WebSocket[] = []

wssGame.on("connection", (ws, req) => {
    console.log(`Opened game connection from '${req.socket.remoteAddress}'.`)

    ws.on("message", (data) => {
        let message: GameMessage = JSON.parse(data.toString())

        if (message.state !== undefined) {
            // console.log(message.state)
            gameState = message.state
        }

        viewSockets.forEach(sock => sock.send(JSON.stringify({ state: gameState } as ViewMessage)))
    })

    ws.on("close", () => {
        console.log(`Closed game connection from '${req.socket.remoteAddress}'.`)
    })
})

wssView.on("connection", (ws, req) => {
    console.log(`Opened view connection from '${req.socket.remoteAddress}'.`)
    viewSockets.push(ws)

    ws.on("close", () => {
        console.log(`Closed view connection from '${req.socket.remoteAddress}'.`)
        viewSockets = viewSockets.filter(sock => sock !== ws)
    })
})

server.on("upgrade", (request, socket, head) => {
    const pathname = request.url as string

    if (pathname === "/game") {
        wssGame.handleUpgrade(request, socket, head, (ws) => {
            wssGame.emit("connection", ws, request)
        })
    } else if (pathname === "/view") {
        wssView.handleUpgrade(request, socket, head, (ws) => {
            wssView.emit("connection", ws, request)
        })
    } else {
        socket.destroy()
    }
})

server.on("listening", () => {
    console.log(`Listening on port ${PORT}.`)
})

server.listen(PORT)
