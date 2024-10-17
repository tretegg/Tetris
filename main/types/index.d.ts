import { Board } from "../board"

declare global {
    interface Window {
        board: Board   
    }
}