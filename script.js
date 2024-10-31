
//define gameboard

function gameboard() {
    const rows = 2;
    const columns = 2;
    const board = [];

    for (let i = 0; i <= rows; i++) {
        board[i] = []; // each element in board will get an array inside it. (creating of cells)
        for (let j = 0; j <= columns; j++) {
            board[i].push("-"); // cell will be defined later.
        }
    }

    const getBoard = () => board; // this will retrieve the board.

    const placeMarker = (row, column, marker) => {
        if (board[row][column] === "-") {
            board[row][column] = marker;
            return true; // indicates placement was successful.
        } 
        return false; // indicates cell was already occupied.
    }

    return { placeMarker, getBoard };

}

function createPlayer(name, marker) { // factory function to create player - makes code clean and readable.
    const playerName = name;
    return { playerName, marker };
}

const gameController = (() => { // this is an IIFE! immediately invoked function expression. this creates a single instance of game controller.
    // initialise everything we need.
    let currentPlayer, player1, player2; // initialise empty vars.
    const board = gameboard(); // initialise gameboard module. grabs from gameboard.

    const start = (p1, p2) => {
        player1 = createPlayer(p1, "X");
        player2 = createPlayer(p2, "O");
        currentPlayer = Math.random() < 0.5 ? player1 : player2; // randomises who starts.
    }

    // manage turns
    const switchTurn = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1; // ternary to switch based on who is current.
    }

    // checking for win or tie after each move
    const checkWin = () => { // arrow function used here to avoid "this" binding issues. best practice. arrow functions used for simple, non-method functions. (don't use arrows for object methods and ctors.)
        const boardState = board.getBoard(); // a snapshot of the current board. dot notation. WHY - accessing in a controlled way - interacting with the board as designed by the gameboard module (via getBoard const)
        const winPatterns = [
            [ [0, 0], [0, 1], [0, 2] ], // rows
            [ [1, 0], [1, 1], [1, 2] ],
            [ [2, 0], [2, 1], [2, 2] ],
            [ [0, 0], [1, 0], [2, 0] ], // columns
            [ [0, 1], [1, 1], [2, 1] ],
            [ [0, 2], [1, 2], [2, 2] ],
            [ [0, 0], [1, 1], [2, 2] ], // diagonals
            [ [0, 2], [1, 1], [2, 0] ]
        ];

        return winPatterns.some(pattern => pattern.every(([row, col]) => boardState[row][col] === currentPlayer.marker));
        /* higher order array functions. some() is a short-circuiting method that 
         returns true as soon as any winning pattern matches the current players marker.
         we used every() within some() to check each cell in the pattern. destructuring [row][col]
         is used to unpack coordinates, making it concise. */

    
          
    };

    const checkTie = () => {
        const boardState = board.getBoard();
        return boardState.every(row => row.every(cell => cell !== "-"));
    };

    //play turn
    const playTurn = (row, column) => {
        if (board.placeMarker(row, column, currentPlayer.marker)) { // attempt to place marker. returns true if success.
            if (checkWin()) {// after every marker is placed, we check for a win.
                console.log(`${currentPlayer.playerName} wins!`);
                return;
            }
            if (checkTie()) {
                console.log("It's a tie!");
                return;
            }
            switchTurn(); // no win or tie means the game continues, so next person goes.
        } else {
            console.log(("Cell is already occupied! Choose a vacant cell."));
        }
    };

    // reset the game when needed.
    const resetGame = () => {
        board.getBoard().forEach((row) => row.fill("-")); // to fill each cell again with "empty" value. avoid manually looping through indices since board is already created.
        currentPlayer = player1; // reset to player one.
    }

    const getBoard = () => board.getBoard(); // expose for export
    const getCurrentPlayerName = () => currentPlayer.playerName;

    return { start, getBoard, getCurrentPlayerName, playTurn, resetGame }; // we expose only these two methods to control the game from the outside of gameController. hides checkWin, checkTie, and switchTurn
    // bc gameController is an IIFE, we need to explicitly return what we want accessible outside of this function.
    // this returned obj becomes the public API of gameController.

})();

