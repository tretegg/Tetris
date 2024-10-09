class Piece {
    constructor(ctx) {
        this.ctx = ctx;

        this.shape_num = Math.floor(Math.random() * 6);
        this.shape = SHAPES[this.shape_num];
        this.color = COLORS[this.shape_num];

          // starting position
        this.x = 3;
        this.y = 0;

        this.farthestRightX = -1;
        this.farthestLeftX = 3;
        this.lowestY = 0;
        this.grounded = false;
    }

    draw() {
        this.ctx.fillStyle = this.color;
        this.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value > 0) {
                    this.ctx.fillRect(this.x + x, this.y + y, 1, 1);
                }
            });
        });
    }      

    
    move(p) {
        this.updateLowestY();
        if (this.y + this.lowestY < ROWS - 1) {
            let newShape = this.shape;
            newShape.x = p.x;
            newShape.y = p.y;
            if (this.collision(newShape) === false) {
                this.x = p.x;
                this.y = p.y; 
            }
            else if (p.x === this.x) {
                this.grounded = true;
                this.addToGroundedPieces();
            }
        } 
        else {
            this.grounded = true;
            this.addToGroundedPieces();
        } 
    }

    addToGroundedPieces() {
        // Store each block's position and color when grounded
        this.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value > 0) {
                    groundedPieces.push({
                        x: this.x + x,
                        y: this.y + y,
                        color: this.color,
                    });
                }
            });
        });
    }


     rotateClockwise() {
        this.updateLowestY();
        if (this.y + this.lowestY < ROWS - 1) {
            let newShape = this.shape[0]
                .map((_, i) => this.shape.map(row => row[i]))
                .map(row => row.reverse());
            newShape.x = this.x;
            newShape.y = this.y;

            if (this.collision(newShape) === false) {
               this.shape = this.shape[0]
                .map((_, i) => this.shape.map(row => row[i]))
                .map(row => row.reverse());    
            }
        } 
        else {
            this.grounded = true;
            this.addToGroundedPieces();
        } 
    }

    rotateCounterClockwise() {
        this.updateLowestY();
        if (this.y + this.lowestY < ROWS - 1) {
            let newShape = this.shape[0]
                .map((_, i) => this.shape.map(row => row[i])) // Transpose
                .reverse();
            newShape.x = this.x;
            newShape.y = this.y;
    
            if (this.collision(newShape) === false) {
                this.shape = newShape;
            }
        } else {
            this.grounded = true;
            this.addToGroundedPieces();
        }
    }

    updateLowestY() {
        this.lowestY = 0;
        for (let y = 0; y < this.shape.length; y++) {
            let row = this.shape[y];  // Access each row
            for (let x = 0; x < row.length; x++) {
                if (row[x] > 0 && y > this.lowestY) {  // Check if there's a block at this position
                    this.lowestY = y;  // Track the lowest y index
                }
            }
        }
    }


    collision(shape) {
        // Loop through each block in the falling piece's shape
        for (let y = 0; y < shape.length; y++) {
            let row = shape[y];  // Access each row of the falling shape
            for (let x = 0; x < row.length; x++) {
                if (row[x] > 0) {  // If there's a block in the falling piece
                    let blockX = shape.x + x;  // Absolute X position of the block
                    let blockY = shape.y + y;  // Absolute Y position of the block
    
                    // Loop through all grounded pieces to check for collisions
                    for (let i = 0; i < groundedPieces.length; i++) {
                        let groundedPiece = groundedPieces[i];  // Access grounded block
                        let groundedBlockX = groundedPiece.x;  // Grounded block's X position
                        let groundedBlockY = groundedPiece.y;  // Grounded block's Y position
    
                        // Check for a collision between the falling block and the grounded block
                        if (blockX === groundedBlockX && blockY === groundedBlockY) {
                            return true;  // Collision detected
                        }
                    }
                }
            }
        }
        return false;  // No collision detected
    }
    
}