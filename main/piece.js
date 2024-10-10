class Piece {
    /**
     * Constructor for the Piece class.
     * @param {Object} ctx - The canvas context to draw on.
     */
    constructor(ctx) {
        this.ctx = ctx;

        // starting shape
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
    
    /**
     * Draw the piece on the canvas at its current position.
     */
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

    
    /**
     * Move the piece to the given position, but only if it will not collide
     * with the grid or any grounded pieces. 
     * Can also move left or right before being added to the grounded pieces.
     * @param {Object} p - The new position of the piece, as an object with
     *                     x and y properties.
     */
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
        else if (p.x != this.x) {
            let newShape = this.shape;
            newShape.x = p.x;
            newShape.y = p.y;
            if (this.collision(newShape) === false) {
                this.x = p.x;
            }
            this.grounded = true;
            this.addToGroundedPieces();
        }
        else {
            this.grounded = true;
            this.addToGroundedPieces();
        } 
    }

    /**
     * Store each block's position and color when grounded in the groundedPieces
     * array and the groundedGrid matrix. Then call checkLines() to check for
     * lines cleared and update the score.
     */
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
                    groundedGrid[this.y + y][this.x + x] = 1;
                }
            });
        });
        console.table(groundedGrid);
        this.checkLines();
    }


    /**
     * Rotate the piece clockwise by 90 degrees if it will not collide with
     * the grid or any grounded pieces. 
     */
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

    /**
     * Rotate the piece counter-clockwise by 90 degrees if it will not collide
     * with the grid or any grounded pieces. 
     */
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

    /**
     * Update the lowestY property of the piece, which is the lowest row index
     * of any block in the piece's shape.
     */
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


    /**
     * Check if the given shape collides with any grounded pieces or the grid.
     * @param {Object} shape - The shape of the falling piece, with properties
     *                        'x' and 'y' for the top-left corner of the shape.
     * @returns {boolean} True if a collision is detected, false otherwise.
     */
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



    /**
     * Check each row of the groundedGrid for lines cleared. If a line is cleared,
     * increment the linesCleared counter and remove the blocks from the
     * groundedPieces array. Call lowerBlocks() to move any blocks above the
     * cleared line down. Finally, call refreshGrid() and updateScore() to
     * update the score and refresh the grid.
     */
    checkLines() { 
        let linesCleared = 0;
        let topRowCleared = 0;
        for (let rowIndex = 0; rowIndex < groundedGrid.length; rowIndex++) {
            let row = groundedGrid[rowIndex];
            if (row.every(value => value === 1)) {
            linesCleared++;

            // Clear the blocks from the groundedPieces array
            groundedPieces = groundedPieces.filter(piece => piece.y !== rowIndex);
            }
            if (rowIndex > topRowCleared) {
                topRowCleared = rowIndex;
            } 
        }
        
        this.lowerBlocks(linesCleared, topRowCleared);
        this.refreshGrid();
        updateScore(linesCleared);
    }

    /**
     * Move any blocks above the cleared line down by the number of lines
     * cleared. This is done by iterating over the groundedPieces array and
     * checking if the block's Y position is less than the cleared row index.
     * If so, increment the block's Y position by the number of lines cleared.
     * @param {number} linesCleared - The number of lines cleared.
     * @param {number} rowIndex - The index of the cleared row.
     */
    lowerBlocks(linesCleared, rowIndex) {
        if (linesCleared > 0) {
            // Move the blocks down
            for (let i = 0; i < groundedPieces.length; i++) {
              let groundedPiece = groundedPieces[i];
              let groundedBlockY = groundedPiece.y;
          
              if (groundedBlockY < rowIndex) {
                groundedPiece.y += linesCleared;
              }
            }
          }
    }

    /**
     * Reset the groundedGrid matrix and re-populate it with the positions
     * of all blocks in the groundedPieces array. This is done by iterating
     * over the groundedPieces array and setting the corresponding position
     * in the groundedGrid matrix to 1.
     */
    refreshGrid() {
        groundedGrid = Array(ROWS).fill(0).map(() => Array(COLS).fill(0));
        for (let i = 0; i < groundedPieces.length; i++) {
            let groundedPiece = groundedPieces[i];
            let groundedBlockX = groundedPiece.x;
            let groundedBlockY = groundedPiece.y;
        
            groundedGrid[groundedBlockY][groundedBlockX] = 1;
        }
    }
}

