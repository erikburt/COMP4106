const fs = require("fs");
const b = require("./board.js");
const { Board, StartState } = b;

const N_INF = Number.NEGATIVE_INFINITY;
const P_INF = Number.POSITIVE_INFINITY;

let node_count = 0,
  turn_count = 0;

let game = runGameRandom();
outputArray(game, "random.txt");
outputJSON(game, "out/outr2.json");
console.log(node_count);

// let game = runGame();
// console.log(node_count);
// outputArray(game, "out/out1v2.text");
// outputJSON(game, "out/out1v2.json");

function runGameRandom() {
  let states = [],
    curState;
  let board = new Board(StartState(), 1, -1, 1);
  states.push({ state: board.state, player: 0 });

  curState = board;

  board.populateChildren();

  while (true) {
    curState = alphabeta(curState, 2, N_INF, P_INF, true, 4).inst;
    states.push({ state: curState.state, player: 1 });

    console.log(turn_count);
    turn_count = 0;

    if (curState.isWinState()) return states;

    curState = curState.getRandomChild();
    if (curState == null) return states;

    console.log(turn_count);
    turn_count = 0;

    states.push({ state: curState.state, player: 2 });

    if (curState.isWinState()) return states;
  }
}

function runGame() {
  let states = [],
    curState;
  let board = new Board(StartState(), 1, -1);
  states.push({ state: board.state, player: 0 });

  board.populateChildren();

  curState = board;

  while (true) {
    curState = alphabeta(curState, 2, N_INF, P_INF, true, 1).inst;
    states.push({ state: curState.state, player: 1 });

    console.log(turn_count);
    turn_count = 0;

    if (curState.isWinState() || curState.isLoseState()) return states;

    curState = alphabeta(curState, 2, N_INF, P_INF, true, 2).inst;
    states.push({ state: curState.state, player: 2 });

    console.log(turn_count);
    turn_count = 0;

    if (curState.isWinState() || curState.isLoseState()) return states;
  }
}

function alphabeta(node, depth, alpha, beta, maximizingPlayer, heuristic) {
  node_count++;
  turn_count++;
  if (depth === 0) return { score: node.getScore(heuristic), inst: node };

  let best = { score: 0, inst: node };

  if (maximizingPlayer) {
    best.score = N_INF;

    for (var c of node.getChildren()) {
      let v = alphabeta(c, depth - 1, alpha, beta, false, heuristic);
      if (v.score > best.score) {
        best.score = v.score;
        best.inst = c;
      }
      alpha = Math.max(alpha, best.score);
      //if (beta <= alpha) break;
    }
  } else {
    best.score = P_INF;

    for (var c of node.getChildren()) {
      let v = alphabeta(c, depth - 1, alpha, beta, true, heuristic).inst;
      if (v.score < best.score) {
        best.score = v.score;
        best.inst = c;
      }
      beta = Math.min(beta, best.score);
      //if (beta <= alpha) break;
    }
  }

  return best;
}

function outputArray(arr, filename) {
  let i = 0,
    str = "";
  for (var a of arr) {
    str += `\n\n Move${i++} - Player: ${a.player}:\n`;

    for (var r of a.state) {
      str += JSON.stringify(r);
      str += "\n";
    }
  }

  fs.writeFileSync(filename, str);
}

function outputJSON(arr, filename) {
  let i = 0,
    obj = [];

  for (var a of arr) {
    obj.push(a.state);
  }

  fs.writeFileSync(filename, JSON.stringify(obj));
}
