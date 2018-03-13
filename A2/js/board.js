function StartState() {
    return [
        [1, 1, 2, 1, 1, 2],
        [2, 2, 1, 1, 1, 2],
        [2, 2, 1, 2, 2, 1],
        [1, 2, 2, 1, 2, 2],
        [2, 1, 1, 1, 2, 2],
        [2, 1, 1, 2, 1, 1]
    ];
}


class Board {
    constructor(state, turn, parent) {
        this.state = copy2DArray(state);
        this.turn = turn;
        this.parent = parent;
        this.children = [];
        this.generated = false;
    }

    setScore() {
        this.score = this.getScore();
    }

    getScore(heuristic) {
        let score = 0;
        const state = this.state;

        if (this.isWinState()) return Number.NEGATIVE_INFINITY;
        if (this.isLoseState()) return Number.NEGATIVE_INFINITY;

        if (heuristic === 1 || heuristic === 3) {
            for (var row = 0; row < state.length; row++) {
                for (var col = 0; col < state[row].length; col++) {
                    if (state[row][col] == this.turn) {
                        score++
                    }
                    else if (state[row][col] !== 0) {
                        score--;
                    }
                }
            }
        }

        if (heuristic === 2 || heuristic === 3) {
            let temp = 0;

            for (var p of this.getPieces()) {
                const { row, col } = p;

                //all the way left
                for (var i = col; i >= 0; i--) {
                    if (state[row][i] === this.turn) temp--;
                    if (state[row][i] !== 0) temp++;
                }


                //all the way right
                for (var i = col; i < 6; i++) {
                    if (state[row][i] === this.turn) temp--;
                    if (state[row][i] !== 0) temp++;
                }

                //all the way up
                for (var i = row; i >= 0; i--) {
                    if (state[i][col] === this.turn) temp--;
                    if (state[i][col] !== 0) temp++;
                }

                //all the way down
                for (var i = 0; i < 6; i++) {
                    if (state[i][col] === this.turn) temp--;
                    if (state[i][col] !== 0) temp++;
                }

                if (heuristic === 3) temp = temp / 3;

                score += temp;
            }
        }

        return score;
    }

    getRandomChild() {
        const state = this.state;

        this.populateChildren();
        return this.children[randomNum(this.children.length)];

        function randomNum(hi) {
            return Math.floor((Math.random() * hi));
        }
    }

    getChildren() {
        this.populateChildren();
        return this.children;
    }

    populateChildren() {
        if (this.generated) { return; }

        if (this.isWinState() || this.isLoseState()) {
            return;
        }

        this.generated = true;

        const state = this.state;
        let pieces = this.getPieces();
        let children = [];

        for (var p of pieces) {
            let check, mx, length, pad;
            const { row, col } = p;

            //Upwards slide
            check = getColumn(state, col);
            mx = copyArray(check);
            mx = mx.slice(0, row + 1);
            length = mx.length;

            mx = mx.filter(el => el !== 0);
            length = length - mx.length;

            pad = [];
            for (var i = 0; i < length; i++) pad.push(0);
            pad = pad.concat(check.slice(row + 1));

            if (mx[0] !== this.turn && mx[0] !== 0) {
                while (mx[0] !== this.turn) {
                    mx.shift();
                    mx.push(0);
                    let temp = copy2DArray(this.state)
                    temp = replaceColumn(temp, mx.concat(pad), col);
                    children.push(temp);
                }
            }

            // //Downwards slide
            check = copyArray(getColumn(copy2DArray(state), col));
            mx = copyArray(check);
            mx = mx.slice(row);
            length = mx.length;

            mx = mx.filter(el => el !== 0);
            length = length - mx.length;

            pad = [];
            for (var i = 0; i < length; i++) pad.push(0);
            pad = check.slice(0, row).concat(pad);

            if (mx[mx.length - 1] !== this.turn && mx[mx.length - 1] !== 0) {
                while (mx[mx.length - 1] !== this.turn) {
                    mx.unshift(0);
                    mx.pop();
                    let temp = copy2DArray(this.state)
                    temp = replaceColumn(temp, pad.concat(mx), col);
                    children.push(temp);
                }
            }

            //Left slide
            check = copyArray(state[row]);
            mx = copyArray(check);
            mx = mx.slice(0, col + 1);
            length = mx.length;

            mx = mx.filter(el => el !== 0);
            length = length - mx.length;

            pad = [];
            for (var i = 0; i < length; i++) pad.push(0);
            pad = pad.concat(check.slice(col + 1));

            if (mx[0] !== this.turn && mx[0] !== 0) {
                while (mx[0] !== this.turn) {
                    mx.shift();
                    mx.push(0);
                    let temp = copy2DArray(this.state)
                    temp[row] = mx.concat(pad);
                    children.push(temp);
                }
            }

            //Right slide
            check = copyArray(state[row]);
            mx = copyArray(check);
            mx = mx.slice(col);
            length = mx.length;

            mx = mx.filter(el => el !== 0);
            length = length - mx.length;

            pad = [];
            for (var i = 0; i < length; i++) pad.push(0);
            pad = check.slice(0, col).concat(pad);

            if (mx[mx.length - 1] !== this.turn && mx[mx.length - 1] !== 0) {
                while (mx[mx.length - 1] !== this.turn) {
                    mx.unshift(0);
                    mx.pop();
                    let temp = copy2DArray(this.state)
                    temp[row] = pad.concat(mx);
                    children.push(temp);
                }
            }

            //Single moves
            if (row != 5 && state[row + 1][col] == 0) {
                let temp = copy2DArray(state)
                temp[row + 1][col] = this.turn;
                temp[row][col] = 0;
            }

            if (row != 0 && state[row - 1][col] == 0) {
                let temp = copy2DArray(state)
                temp[row - 1][col] = this.turn;
                temp[row][col] = 0
                children.push(temp)
            }

            if (col != 5 && state[row][col + 1] == 0) {
                let temp = copy2DArray(state)
                temp[row][col + 1] = this.turn;
                temp[row][col] = 0
                children.push(temp)
            }

            if (col != 0 && state[row][col - 1] == 0) {
                let temp = copy2DArray(state)
                temp[row][col - 1] = this.turn;
                temp[row][col] = 0
                children.push(temp)
            }
        }

        for (var c of children) {
            const turn = (this.turn === 1) ? 2 : 1;
            this.children.push(new Board(c, turn, this));
        }
    }

    getPieces() {
        let pieces = [];
        const state = this.state;

        for (var row = 0; row < state.length; row++) {
            for (var col = 0; col < state[row].length; col++) {
                if (state[row][col] == this.turn) {
                    pieces.push({ row, col });
                }
            }
        }

        return pieces;
    }

    isWinState() {
        const state = this.state;
        const enemy = (this.turn === 1) ? 2 : 1;

        for (var row = 0; row < state.length; row++) {
            for (var col = 0; col < state[row].length; col++) {
                if (state[row][col] !== enemy) {
                    return false;
                }
            }
        }
        return true;
    }

    isLoseState() {
        const state = this.state;

        for (var row = 0; row < state.length; row++) {
            for (var col = 0; col < state[row].length; col++) {
                if (state[row][col] === this.turn) {
                    return false;
                }
            }
        }
        return true;
    }
}

function getColumn(arr, index) {
    return arr.map((val, ind) => { return val[index]; });
}

function replaceColumn(arr, newCol, index) {
    return arr.map((val, ind) => {
        val[index] = newCol[ind];
        return val;
    });
}

function copyArray(array) {
    return array.slice(0);
}

function copy2DArray(array) {
    return array.map(function (arr) {
        return arr.slice(0);
    });
}

function checkUndefined(state) {
    for (var row = 0; row < state.length; row++) {
        for (var col = 0; col < state[row].length; col++) {
            if (state[row][col] == undefined) {
                return true;
            }
        }
    }
    return false;
}

module.exports = {
    StartState,
    Board
}