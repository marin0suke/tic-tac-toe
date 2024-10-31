
//define gameboard

function gameboard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i = 1; i <= rows; i++) {
        board[i] = []; // each element in board will get an array inside it. (creating of cells)
        for (let j = 1; j <= columns; j++) {
            board[i].push("-"); // cell will be defined later.
        }
    }

    const getBoard = () => board; // this will retrieve the board.

    const dropMarker = (row, column, player) => {
        const availableCells = 
            board.filter((row) => 
                row[column].getValue() === "-").map(row => row[column]); // gets us back all the possible places we can dropMarker.

        if (!availableCells.length) return; // if no available cells, return.    
    }

}



//obj for game logic