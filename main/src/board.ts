//window.board.js

import { ROWS, COLS } from './constants.js';
import { Piece } from './piece.js';

export class Board {
    ctx: CanvasRenderingContext2D;
    grid: number[][];
    piece: Piece;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
        this.grid = this.getEmptyBoard();
        this.piece = new Piece(ctx);
    }

    getEmptyBoard() {
        return Array.from(
            { length: ROWS }, () => Array(COLS).fill(0)
        );
    }
}
