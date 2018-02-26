var HashSet = require("hashset");

class Node {
  constructor(state) {
    this.state = state;
  }

  //Checks if the coordinate is one of the 3 tiles removed in each corner
  isValid(x, y) {
    if (
      x < 0 ||
      x > 6 ||
      y < 0 ||
      y > 6 ||
      (y === 0 && (x === 0 || x === 1 || x === 5 || x === 6)) || //Top row
      (y === 6 && (x === 0 || x === 1 || x === 5 || x === 6)) || //Bottom row
      (y === 1 && (x === 0 || x === 6)) || //Lower top row
      (y === 5 && (x === 0 || x === 6)) //Lower bottom row
    ) {
      return false;
    }
    return true;
  }

  isPeg(x, y) {
    for (var i = 0; i < this.state.length; i++) {
      const tile = this.state[i];
      if (x === tile.x && y === tile.y) return false;
    }
    return true;
  }

  isEmpty(x, y) {
    return !this.isPeg(x, y);
  }

  getSide(x, y, delta, i) {
    const x1 = x + delta,
      x2 = x + 2 * delta;

    if (
      this.isValid(x2, y) &&
      this.isValid(x1, y) &&
      this.isPeg(x2, y) &&
      this.isPeg(x1, y)
    ) {
      let newState = copyState(this.state);
      newState.splice(i, 1);
      newState.push({ x: x1, y });
      newState.push({ x: x2, y });
      return newState;
    }
  }
  getVert(x, y, delta, i) {
    const y1 = y + delta,
      y2 = y + 2 * delta;

    if (
      this.isValid(x, y2) &&
      this.isValid(x, y1) &&
      this.isPeg(x, y2) &&
      this.isPeg(x, y1)
    ) {
      let newState = copyState(this.state);
      newState.splice(i, 1);
      newState.push({ x, y: y1 });
      newState.push({ x, y: y2 });
      return newState;
    }
  }

  getChildren() {
    let children = [];

    for (var i = 0; i < this.state.length; i++) {
      const tile = this.state[i];
      let res;

      if ((res = this.getVert(tile.x, tile.y, -1, i))) children.push(res); //Up
      if ((res = this.getVert(tile.x, tile.y, 1, i))) children.push(res); //Down
      if ((res = this.getSide(tile.x, tile.y, -1, i))) children.push(res); //Left
      if ((res = this.getSide(tile.x, tile.y, 1, i))) children.push(res); //Right
    }

    for (var i = 0; i < children.length; i++) {
      children[i].sort((one, two) => {
        if (one.x === two.x) {
          if (one.y === two.y) throw "fook";

          if (one.y < two.y) return -1;
          else return 1;
        }
        if (one.x < two.x) return -1;
        else return 1;
      });
    }
    return children;
  }

  drawState(state) {
    console.log("----------------");
    for (var i = 0; i < state.length; i++) {
      console.log(state[i]);
    }

    console.log("--------------\n\n");
  }
}

class FIFO {
  constructor() {
    this.queue = [];
    this.set = new HashSet();
  }
  add(node) {
    const str = JSON.stringify(node.state);
    if (!this.set.contains(str)) {
      this.set.add(str);
      this.queue.push(node);
    }
  }
  next() {
    //if (this.queue.length == 0) return [];

    return this.queue.shift(-1);
  }
}

const startState = [{ x: 3, y: 3 }];

const copyState = state => {
  return state.map(function(obj) {
    return Object.assign({}, obj);
  });
};

let gameState = copyState(startState);

function bfs() {
  const q = new FIFO();

  q.add(new Node(gameState));
  let node;
  let i = 0;

  while ((node = q.next()) !== []) {
    console.log(`${i} ${q.queue.length}`);
    f;
    const newStates = node.getChildren();

    newStates.forEach(newState => {
      q.add(new Node(newState));
    });

    if (i++ == 4000000) {
      console.log(node.state);
      console.log(q.queue[q.queue.length - 1].state);
      //break;
    }
  }
}

bfs();
