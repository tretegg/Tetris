import { Board } from "../board"

interface GroundedPiece {
    x: number,
    y: number,
    color: string
}

declare global {
    interface Window {
        board: Board   
        groundedGrid: number[][],
        groundedPieces: GroundedPiece[]
    }
}