let Board = require("./board.js");
let Boards = require("./board-templates.js");

main();

function main() {
    const use = Boards.insane.START_25;
    const stream = true;
    let start = new Date();

    console.log(`Zeroes: ${count_entries(use, 0)}`);

    let brd = new Board.Board(use);
    //brd.list_possibles();
    brd = solve(brd, stream);

    brd.print_board();

    console.log("Time:", (new Date).getTime() - start.getTime());
}

function solve(brd, stream) {
    if (brd.is_solved()) return brd;  //Checks for trivially solvable case
    let start = new Date();
    let iterations = 0;
    let boards = [];
    let visited = {};

    if (stream) boards.push(brd.get_board());
    else boards.push({ board: brd, added: 1, total: 1 });
    //boards.push({ board: arr, total: 1 });

    while (iterations++ >= 0) {
        //console.log(iterations, boards.length);
        if (boards.length === 0) break;

        let cur = (stream) ? boards.pop() : get_top_priority(boards);
        let cur_str = board_to_string((stream) ? cur : cur.get_board());

        if (iterations % 1000 === 1) console.log(`Visited ${iterations - 1} - Queue:${boards.length} - Zeroes:${count_entries((stream) ? cur : cur.get_board(), 0)}`);

        if (!visited[cur_str]) {
            visited[cur_str] = true;
            brd = (stream) ? new Board.Board(cur) : cur;

            if (!brd.is_valid()) continue;
            if (brd.is_solved()) break;

            let n = brd.get_neighbours();

            n.neighbours.forEach(el => {
                let brd = new Board.Board(el.board);

                if (!brd.is_valid()) return;

                boards.push((stream) ? brd.get_board() : { board: brd, added: el.added, total: n.total });
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

function count_entries(board, entry) {
    let count = 0;

    for (var y = 0; y < board.length; y++) {
        for (var x = 0; x < board.length; x++) {
            if (board[y][x] === entry) count++;
        }
    }

    return count;
}

function get_top_priority(boards/*, data*/) {
    //if (boards.length !== data.length) throw error("length mismatch");
    if (boards.length === 0) throw error("Empty queue");
    if (boards.length === 1) return (boards.pop()).board;

    const size = boards[0].length;
    let top = { probability: 0, index: 0 };

    for (var i = 0; i < boards.length; i++) {
        const b = boards[i];
        if (!b.priority) {
            let counts = b.board.count(b.added);
            b.probability = (size - counts.solved) / (b.total * b.possibles)
        }
        //const brd = new Board.Board(b.board);
        //let d = data[i];

        if (b.probability > top.probability) top = { probability, index: i };
    }

    return (boards.splice(top.index, 1))[0].board;
    //return boards.pop();
}

function is_duplicates(boards, visited) {
    let cache = {};

    for (var i = 0; i < boards.length; i++) {
        const b = boards[i].board;
        const str = board_to_string(b.get_board());

        if (!cache[str]) cache[str] = true;
        else console.log("duplicate");
    }

    for (var i = 0; i < visited.length; i++) {
        const b = visited[i];
        const str = board_to_string(b);

        if (!cache[str]) cache[str] = true;
        else console.log("duplicate");
    }
}
