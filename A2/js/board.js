let StartState = [
    [1, 1, 2, 1, 1, 2],
    [2, 2, 1, 1, 1, 2],
    [2, 2, 1, 2, 2, 1],
    [1, 2, 2, 1, 2, 2],
    [2, 1, 1, 1, 2, 2],
    [2, 1, 1, 2, 1, 1]
];


class Board {
    constructor(state, turn, parent) {
        this.state = state;
        this.turn = turn;
        this.parent = parent;
        this.score = this.getScore();
        this.children = this.getChildren();
    }

    getScore() {
        return 0;
    }

    getChildren() {
        const state = this.state;
        let pieces = this.getPieces();
        let children = [];

        for (var p of pieces) {
            let check, mx, length, pad;
            const { row, col } = p;

            console.log(`(${row}, ${col})`);

            //Upwards slide
            check = getColumn(state, col);
            mx = copyArray(check);
            mx = mx.slice(0, row + 1);
            length = mx.length;

            mx = mx.filter(el => el !== 0);
            length = length - mx.length;

            pad = [].fill(0, mx.length, mx.length + length).concat(check.splice(row + 1));

            if (mx[0] !== this.turn && mx[0] !== 0) {
                while (mx[0] !== this.turn) {
                    mx.shift();
                    mx.push(0);
                    let temp = copy2DArray(this.state)
                    temp = replaceColumn(temp, mx.concat(pad), col);
                    children.push(temp);
                }
            }

            //Downwards slide
            check = copyArray(getColumn(copy2DArray(state), col));
            mx = copyArray(check);
            mx = mx.slice(row);
            length = mx.length;

            mx = mx.filter(el => el !== 0);
            length = length - mx.length;

            pad = check.slice(0, row).concat([].fill(0, mx.length, mx.length + length));

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
            // check = copyArray(state[row]);
            // mx = copyArray(check);
            // mx.splice(col + 1);
            // mx = check;
            // length = mx.length;

            // mx = mx.filter(el => el !== 0);
            // length = length - mx.length;

            // pad = check.splice(row + 1).concat([].fill(0, mx.length, mx.length + length));

            // if (mx[mx.length - 1] !== this.turn && mx[mx.length - 1] !== 0) {
            //     while (mx[mx.length - 1] !== this.turn) {
            //         mx.unshift(0);
            //         mx.pop();
            //         let temp = copy2DArray(this.state)
            //         temp = replaceColumn(temp, mx.concat(pad), col);
            //         children.push(temp);

            //     }
            // }
        }

        return children;
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

module.exports = {
    StartState,
    Board
}