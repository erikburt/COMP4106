let Board = require("./board.js");
let Boards = require("./board-templates.js");

main();

function main() {
    const use = Boards.insane.START_25;
    let start = new Date();

    console.log(`Zeroes: ${count_zeroes(use)}`);

    let brd = new Board.Board(use);
    brd = solve(brd);

    brd.print_board();

    console.log("Time:", (new Date).getTime() - start.getTime());
}

function solve(brd) {
    if (brd.is_solved()) return brd;  //Checks for trivially solvable case
    let start = new Date();
    let iterations = 0;
    let boards = [];
    let visited = {};

    let arr = brd.get_board(); // DFS gets board where branching will occur
    boards.push(arr);

    while (iterations++ >= 0) {
        if (boards.length === 0) break;

        let cur = boards.pop();
        let cur_str = board_to_string(cur);

        if (iterations % 1000 === 1) console.log(`Visited ${iterations - 1} - Queue:${boards.length} - Zeroes:${count_zeroes(cur)}`);

        if (!visited[cur_str]) {
            visited[cur_str] = true;
            brd = new Board.Board(cur);

            if (!brd.is_valid()) continue;
            if (brd.is_solved()) break;

            let n = brd.get_neighbours();
            n.forEach(el => {
                //boards.push(el);
                let temp = new Board.Board(el);
                if (temp.is_valid()) boards.push(temp.get_board());
            });
        }
    }

    console.log(iterations);

    return brd;
}

function print_board(board) {
    let str = "";

    for (var y = 0; y < board.length; y++) {
        for (var x = 0; x < board.length; x++) {
            str += board[y][x] + " ";
        }
        str += "\n";
    }

    console.log(str);
}


function board_to_string(board) {
    let str = "";

    for (var y = 0; y < board.length; y++) {
        for (var x = 0; x < board.length; x++) {
            str += board[y][x];
        }
    }

    return str;
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
