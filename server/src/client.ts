import { ClientData, ServerErrorData, ServerEventDataTypes, ServerInitData } from "./types/types";

type subscriberFunction = (data: any) => void;

type Subscribers = {
    [type in ServerEventDataTypes]: {
        [uuid: string]: (null | subscriberFunction);
    };
};

class WebsocketHandler {
    private connection: WebSocket;
    private subscribers: Subscribers
    public id: number = -1;
    handlerMap: {[type in ServerEventDataTypes]: (data: any)=>void|{type: ServerEventDataTypes, data: any}} = {
        "GAME_FULL": (data: any) => {
            this.passDataToSubscribers("GAME_FULL", data);
        },
        "PIECE_PLACE": (data: any) => {
            this.passDataToSubscribers("PIECE_PLACE", data);
        },
        "GAME_START": (data: any) => {
            this.passDataToSubscribers("GAME_START", data);
        },
        "GAME_END": (data: any) => {
            this.passDataToSubscribers("GAME_END", data);
        },
        "OPPONENT_PIECE_PLACE": (data: any) => {
            this.passDataToSubscribers("OPPONENT_PIECE_PLACE", data);
        },
        "ERROR": (data: ServerErrorData) => {
            this.passDataToSubscribers("ERROR", data);
        },
        "INIT": (data: ServerInitData) => {
            this.id = data.id

            this.passDataToSubscribers("INIT", data);
        }
    }
    
    constructor(url: string) {
        this.connection = new WebSocket(url);

        this.connection.onmessage = this.handleMessage
        this.connection.onerror = this.handleConnectionError
        this.connection.onopen = this.handleConnectionOpen

        this.subscribers = {
            "GAME_END": {},
            "GAME_FULL": {},
            "GAME_START": {},
            "PIECE_PLACE": {},
            "OPPONENT_PIECE_PLACE": {},
            "ERROR": {},
            "INIT": {}
        }
    }

    sendData(type: ServerEventDataTypes, data: ClientData) {
        if (this.connection.readyState != WebSocket.OPEN) return
        
        let toSend: any = {
            type,
            data
        }

        this.connection.send(JSON.stringify(toSend))
    }

    private handleMessage(data: any) {
        if (!this.handlerMap[data.type as ServerEventDataTypes]) return

        const response = this.handlerMap[data.type as ServerEventDataTypes](data)
        if (!response) return

        this.sendData(response.type, response.data)
    }

    private handleConnectionError(e: any) {
        console.log("Connection Interupted:", e)
    }

    private handleConnectionOpen() {
        console.log("Connection Opened.")
    }

    eventSubscribe(type: ServerEventDataTypes, subscriber: (data: any)=>void): string {
        let uuid = WebsocketHandler.generateUUIDv4()

        while (this.subscribers[type][uuid]) {
            uuid = WebsocketHandler.generateUUIDv4()
        }
        
        this.subscribers[type][uuid] = subscriber

        return uuid
    }

    eventUnsubscribe(type: ServerEventDataTypes, uuid: string) {
        this.subscribers[type][uuid] = null
    }

    private passDataToSubscribers(type: ServerEventDataTypes, data:any) {
        Object.entries(this.subscribers[type]).forEach(subscriber => {
            if (!subscriber[1]) return
            
            subscriber[1](data)
        })
    }
    
    static generateUUIDv4() {
        return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
            (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
        );
    }
}

class TetrisNetworkHandler {
    private websocketHandler: WebsocketHandler

    constructor() {
        this.websocketHandler = new WebsocketHandler("ws://localhost:8080")
    }

    eventSubscribe(type: ServerEventDataTypes, subscriber: (data: any)=>void): string {
        return this.websocketHandler.eventSubscribe(type, subscriber)
    }

    eventUnsubscribe(type: ServerEventDataTypes, uuid: string) {
        this.websocketHandler.eventUnsubscribe(type, uuid)
    }

    
}

let networkHandler = new TetrisNetworkHandler()