const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;

const A = 'A';
const D = 'D';
const S = 'S';

const SHAPES = [
    // Example shapes (Tetris-style pieces)
    [  
        [1, 1, 1],   
        [0, 1, 0],
        [0, 0, 0]
    ],
    [  
        [0, 1, 1],   
        [1, 1, 0],
        [0, 0, 0]
    ],
    [  
        [1, 0, 0],   
        [1, 1, 1],
        [0, 0, 0]
    ],
    [  
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    [  
        [1, 1],  
        [1, 1]
    ],
    [  
        [0, 0, 1],   
        [1, 1, 1],
        [0, 0, 0]
    ]
];

const COLORS = ['purple', 'yellow', 'blue', 'lightblue', 'red', 'orange'];