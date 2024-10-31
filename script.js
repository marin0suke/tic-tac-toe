
//define gameboard

function gameboard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i = 1; i <= rows; i++) {
        board[i] = []; // each element in board will get an array inside it. (creating of cells)
        for (let j = 1; j <= columns; j++) {
            board[i].push("x"); // cell will be defined later.
        }
    }

    console.log(board);
}



//obj for game logic