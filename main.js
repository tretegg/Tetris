const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');

let groundedPieces = [];

let newPosition = {
    x: 0,
    y: 0
}

// calculate the size of the canvas
ctx.canvas.width = COLS * BLOCK_SIZE;
ctx.canvas.height = ROWS * BLOCK_SIZE;

ctx.scale(BLOCK_SIZE, BLOCK_SIZE);

function play() {
    board = new Board(ctx);
    draw();
    console.log('X:' + board.piece.x);
    console.log('Y:' + board.piece.y);
}

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
            console.log('X:' + board.piece.x);
            console.log('Y:' + board.piece.y);
            console.log('A key pressed');
            break;
        case 's':
            newPosition = moves[S]({ x: board.piece.x, y: board.piece.y });
            board.piece.move(newPosition);
            draw();  
            console.log('X:' + board.piece.x);
            console.log('Y:' + board.piece.y);
            console.log('S key pressed');
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
            console.log('X:' + board.piece.x);
            console.log('Y:' + board.piece.y);
            console.log('D key pressed');
            break;
        case 'ArrowLeft':
            event.preventDefault();
            board.piece.rotateCounterClockwise();
            draw();
            console.log('X:' + board.piece.x);
            console.log('Y:' + board.piece.y);
            console.log('LeftArrow key pressed');
            break;
        case 'ArrowRight':
            event.preventDefault();
            board.piece.rotateClockwise();
            draw();
            console.log('X:' + board.piece.x);
            console.log('Y:' + board.piece.y);
            console.log('RightArrow key pressed');
            break;
        default:
            console.log('Another key pressed');
    }
});

function lower_piece() {
    newPosition = moves[S]({ x: board.piece.x, y: board.piece.y });
    board.piece.move(newPosition);
    draw();
}


setInterval(lower_piece, 1000);
