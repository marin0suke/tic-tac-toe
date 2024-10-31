// DOM elements and ui
const displayController = (() => { // 
    //first connect all the elements we want to change, control, display dynamically.
    const boardElement = document.querySelector("#board");
    const messageElement = document.querySelector("#message");
    const playerOneInput = document.querySelector("#playerOneName");
    const playerTwoInput = document.querySelector("#playerTwoName");
    const startButton = document.querySelector("#startButton");
    const resetButton = document.querySelector("#resetButton");

    let player1, player2;

    const renderBoard = () => {
        boardElement.innerHTML = ""; // clear the board.

        const board = gameController.getBoard(); // get current board state.
        board.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                const cellElement = document.createElement("div");
                cellElement.classList.add("cell");
                cellElement.textContent = cell; // x, o or empty "-" .. ?
                cellElement.addEventListener("click", () => handleCellClick(rowIndex, colIndex));
                boardElement.appendChild(cellElement);
            });
        });
    };

    const handleCellClick = (row, col) => {
        const result = gameController.playTurn(row, col);

        if (result === "win") {
            renderBoard();
            messageElement.textContent = `${gameController.getCurrentPlayerName()} wins!`;
        } else if (result === "tie") {
            renderBoard();
            messageElement.textContent = "It's a tie!";
        } else if (result === "occupied") {
            messageElement.textContent = "Cell is already occupied! Choose a vacant cell.";
        } else {
            renderBoard();
            messageElement.textContent = `${gameController.getCurrentPlayerName()}'s turn`;
        }
    }

    const startGame = () => {
        const name1 = playerOneInput.value || "Player 1";
        const name2 = playerTwoInput.value || "Player 2";
        gameController.start(name1, name2);
        renderBoard();
        messageElement.textContent = `${name1}'s turn!`;
    };

    const resetGame = () => {
        gameController.resetGame();
        renderBoard();
        messageElement.textContent = "Game reset. Start again!";
    };

    startButton.addEventListener("click", startGame);
    resetButton.addEventListener("click", resetGame);

})();


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
            if (checkWin()) {
                return "win";
            }
            if (checkTie()) {
                return "tie";
            }
            switchTurn(); // no win or tie means the game continues, so next person goes.
            return "continue";
        } 
        return "occupied"; 
    };

    // reset the game when needed.
    const resetGame = () => {
        board.getBoard().forEach((row) => row.fill("-")); // to fill each cell again with "empty" value. avoid manually looping through indices since board is already created.
        currentPlayer = player1; // reset to player one.
    }

    const getBoard = () => board.getBoard(); // expose for export
    const getCurrentPlayerName = () => currentPlayer.playerName;

    return { start, getBoard, getCurrentPlayerName, playTurn, resetGame, checkTie }; // we expose only these two methods to control the game from the outside of gameController. hides checkWin, checkTie, and switchTurn
    // bc gameController is an IIFE, we need to explicitly return what we want accessible outside of this function.
    // this returned obj becomes the public API of gameController.

})();

