
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

function createPlayer(name, marker) {
    const playerName = name;
    return { playerName, marker };
}

function gameController() {

}

