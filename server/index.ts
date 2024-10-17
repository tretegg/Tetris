import WebSocket, { WebSocketServer } from 'ws';
import { ServerEventDataTypes, PlayerData, ServerData, ServerErrorData, ServerInitData, WebsocketServerData } from './types/types';
import Express from 'express';
import path from 'path';

const express = Express()

const files = {
    "/board.js": "/compiled/board.js",
    "/constant.js": "/compiled/constant.js",
    "/favicon.ico": "/main/favicon.ico",
    "/": "/main/index.html",
    "/main.js": "/compiled/main.js",
    "/peice.js": "/compiled/piece.js",
    "/styles.css": "/main/styles.css"
}

Object.entries(files).forEach(file => {
    express.get(file[0], (req, res)=>{
        console.log("serving", file[0])
        console.log(path.join(__dirname, "..", ".."))

        res.sendFile(file[1], {root: path.join(__dirname, "..", "..")})
        res.status(200)
    })
})

express.listen({port: 3000})

const wss = new WebSocketServer({ port: 8080 });

const maxAmountOfPlayers: number = 2
let players: Player[] = []

wss.on('connection', function connection(ws) {
    ws.on('error', console.error);
    if (players.length > maxAmountOfPlayers) {
        
        let data: WebsocketServerData = {
            type: "ERROR",
            data: {
                code: "GAME_FULL"
            } as ServerErrorData
        }

        ws.send(JSON.stringify(data))
        ws.close()
        return
    }

    let player = new Player(ws, players.length+1)
    players.push(player)
});

class Player {
    id: number
    ws: WebSocket

    constructor(ws: WebSocket, id: number) {
        this.ws = ws
        this.id = id

        let data: ServerInitData = {
            id
        }

        this.sendData("INIT", data)
    }

    getPlayerData(): PlayerData {
        return {id: this.id}
    }

    sendData(type: ServerEventDataTypes, data: ServerData) {
        if (this.ws.readyState == this.ws.CLOSED) return

        let toSend: WebsocketServerData = {
            type, 
            data
        }

        this.ws.send(JSON.stringify(toSend))
    }
}
