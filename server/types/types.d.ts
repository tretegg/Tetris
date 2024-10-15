/**
 * Data types for data going Server -> Client
 */
export type ServerEventDataTypes = "ERROR" | "GAME_FULL" | "PEICE_PLACE" | "GAME_START" | "GAME_END" | "OPPONENT_PIECE_PLACE" | "INIT"
/**
 * Data types for data going Client -> Server
 */
export type ClientEventDataTypes = "ERROR" 
/**
 * Error codes used within the data of a "ERROR" event, non context specific (same on client and server)
 */
export type ErrorCodes = "GAME_FULL"

/**
 *  Websocket Data going from the Server -> Client 
 */
export interface ServerData {

}

/**
 *  Websocket Data going from the Client -> Server 
 */
export interface ClientData {

}

/**
 * When a player is first connected to the server, it will recieve this Initialization data from the server
 */
export interface ServerInitData extends ServerData {
    id: number
}

/**
 * When an error on the server occurs involving a client, the client will recieve this data 
 */
export interface ServerErrorData extends ServerData {
    code: ErrorCodes
}

/**
 * Websocket event data coming from the Server 
 */
export interface WebsocketServerData {
    type: ServerEventDataTypes,
    data: ServerData
}

/**
 * Websocket event data coming from the Client 
 */
export interface WebsocketClientData {
    type: ServerEventDataTypes,
    data: ClientData
}

/**
 * Player data held in the Player class on the server.
 */
export interface PlayerData {
    id: number
}
