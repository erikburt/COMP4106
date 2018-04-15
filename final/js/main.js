let Board = require("./board.js");
let Boards = require("./board-templates.js");


main();

function main() {
    const use = Boards.hard.START_9;
    const BOARD_SIZE = use.length;

    console.log(`Zeroes: ${count_zeroes(use)}`);
    let brd = new Board.Board(BOARD_SIZE, use);
    solve(brd);
    brd.print_board();
}

function solve(brd) {
    if (brd.is_solved()) return;  //Checks for trivially solvable case

    let boards = [];

    boards.push(brd.get_board()); // DFS gets board where branching will occur

    //board.apply_heuristic();
    //heuristic is number of nodes solved after / probability

    //apply heuristic
    //branch
    //solve as far as possible
    //loop until solved

}

function count_zeroes(board) {
    let count = 0;

    for (var y = 0; y < board.length; y++) {
        for (var x = 0; x < board.length; x++) {
            if (board[y][x] === 0) count++;
        }
    }

    return count;
}
