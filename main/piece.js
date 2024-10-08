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
            this.x = p.x;
            this.y = p.y; 
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
                        color: this.color
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
            let newShape = this.shape = this.shape[0]
                .map((_, i) => this.shape.map(row => row[i]))
                .reverse(); 

            if (this.collision(newShape) === false) {
                this.shape = this.shape[0]
                .map((_, i) => this.shape.map(row => row[i]))
                .reverse();  
            }
        } 
        else {
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
        
    }
}