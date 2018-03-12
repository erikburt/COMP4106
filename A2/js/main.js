const b = require("./board.js");
const { Board, StartState } = b;

let board = new Board(StartState, 2, StartState);

console.log(board.children.length);

// for (var i of board.children) {
//     console.log(i);
//     console.log();
//     console.log();
// }
