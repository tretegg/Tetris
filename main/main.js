const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');

let groundedPieces = [];

let groundedGrid = Array.from({length: ROWS}, () => Array(COLS).fill(0));

let bag = [0, 1, 2, 3, 4, 5, 6];

let level = 1;
let score = 0;
let totalLines = 0;

let speed = 1000;

let newPosition = {
    x: 0,
    y: 0
}

// calculate the size of the canvas
ctx.canvas.width = COLS * BLOCK_SIZE;
ctx.canvas.height = ROWS * BLOCK_SIZE;

ctx.scale(BLOCK_SIZE, BLOCK_SIZE);

/**
 * Start a new game of Tetris by creating a new Board object and drawing
 * the initial game state on the canvas.
 */
function play() {
    board = new Board(ctx);
    draw();

    
}

/**
 * Draw the current game state on the canvas. This includes clearing the
 * canvas, drawing all grounded blocks, and drawing the current falling
 * piece. If the current falling piece is grounded, create a new falling
 * piece.
 */
function draw() {
    const { width, height } = ctx.canvas;
    ctx.clearRect(0, 0, width, height);
    
    groundedPieces.forEach(block => {
        ctx.fillStyle = block.color;
        ctx.fillRect(block.x, block.y, 1, 1);
    });

    
    if (board.piece.grounded === true) {
      board.piece = new Piece(ctx);
    }

    board.piece.draw();
}

// TODO: Add a function to check if the game is over
function endGame () {
    console.log('game over');
    play();
}

const moves = {
    [A]: (p) => ({ ...p, x: p.x - 1 }),
    [D]: (p) => ({ ...p, x: p.x + 1 }),
    [S]: (p) => ({ ...p, y: p.y + 1 })
}

document.addEventListener('keydown', event => {
    // Convert only alphabetic keys to lowercase
    const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
    switch (key) {
        case 'a':
            newPosition = moves[A]({ x: board.piece.x, y: board.piece.y });
            board.piece.farthestLeftX = 3;
            for (let y = 0; y < board.piece.shape.length; y++) {
                let row = board.piece.shape[y];  // Access each row
                for (let x = 0; x < row.length; x++) {
                    if (row[x] > 0 && x < board.piece.farthestLeftX) {  // Check if there's a block at this position
                        board.piece.farthestLeftX = x;  // Track the furthest x index
                    }
                }
            }
            let farthestLeftInGrid = newPosition.x + board.piece.farthestLeftX;
            if (farthestLeftInGrid >= 0) {
                board.piece.move(newPosition);
                draw();
            }
            break;
        case 's':
            newPosition = moves[S]({ x: board.piece.x, y: board.piece.y });
            board.piece.move(newPosition);
            draw();  
            break;
        case 'd':
            newPosition = moves[D]({ x: board.piece.x, y: board.piece.y });
            board.piece.farthestRightX = -1;
            for (let y = 0; y < board.piece.shape.length; y++) {
                let row = board.piece.shape[y];  // Access each row
                for (let x = 0; x < row.length; x++) {
                    if (row[x] > 0 && x > board.piece.farthestRightX) {  // Check if there's a block at this position
                        board.piece.farthestRightX = x;  // Track the furthest x index
                    }
                }
            }
            let farthestRightInGrid = newPosition.x + board.piece.farthestRightX;
            if (farthestRightInGrid < COLS) {
                board.piece.move(newPosition);
                draw();  
                board.piece.farthestRightX = -1;
            }
            break;
        case 'ArrowLeft':
            event.preventDefault();
            board.piece.rotateCounterClockwise();
            draw();
            break;
        case 'ArrowRight':
            event.preventDefault();
            board.piece.rotateClockwise();
            draw();
            break;
        case ' ':
            while (board.piece.grounded === false && board.piece.y != 0) {
                newPosition = moves[S]({ x: board.piece.x, y: board.piece.y });
                board.piece.move(newPosition);
            }
            draw();
            break;
        default:
    }
});

// Prevent spacebar from pressing button
// Not working
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && e.target === document.getElementById('play-button')) {
      e.preventDefault();
    }
  });

/**
 * Update the score and level after a piece has been added to the
 * grounded pieces. The score is increased by 100, 300, 500, or 800
 * depending on the number of lines cleared. The level increases by
 * one for every 10 lines cleared. The speed is updated to reflect
 * the new level.
 * @param {number} linesCleared - The number of lines cleared.
 */
function updateScore(linesCleared) {
    if (linesCleared === 1) {
        score += 100 * level;
    }
    else if (linesCleared === 2) {
        score += 300 * level;
    }
    else if (linesCleared === 3) {
        score += 500 * level;
    }
    else if (linesCleared === 4) {
        score += 800 * level;
    }
    totalLines += linesCleared;
    level = Math.floor(totalLines / 10) + 1;
    speed = 1000 - level * 30;
    document.getElementById('score').innerHTML = score;
    document.getElementById('level').innerHTML = level;
    document.getElementById('lines').innerHTML = totalLines;
}

/**
 * Select a random piece from the given bag of pieces. If the bag is empty,
 * replenish it with all 7 possible pieces. Then select a random piece from 
 * the bag and remove it. Return the index of the selected piece.
 * @param {array<number>} bag - An array of numbers, each representing a
 *                              different Tetris piece.
 * @returns {number} The index of the selected piece.
 */
function selectPieceFromBag() {
    if (bag.length === 0) {
        bag = [0, 1, 2, 3, 4, 5, 6];
    }
  
    // Select a random piece from the bag
    const selectedPieceIndex = Math.floor(Math.random() * bag.length);
    const selectedPiece = bag[selectedPieceIndex];  
  
    // Remove the selected piece from the bag
    bag.splice(selectedPieceIndex, 1);

    return selectedPiece;
}

/**
 * Move the falling piece down by one block. This is done by calling the
 * move() method of the piece with a new position that is one block down
 * from the current position. The draw() method is then called to update
 * the canvas.
 */
function lower_piece() {
    newPosition = moves[S]({ x: board.piece.x, y: board.piece.y });
    board.piece.move(newPosition);
    draw();
}

setInterval(lower_piece, speed);

