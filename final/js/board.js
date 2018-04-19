let NodeImp = require("./node.js");
let { Node } = NodeImp;

class Board {
    /*
        Constructor
    */
    constructor(board) {
        //console.log(board);
        this.nodes = [];
        this.size = board.length;

        for (var i = 0; i < this.size * this.size; i++) {
            let { x, y } = index_to_x_y(i, this.size);
            let new_node = new Node(this.size, x, y, board[y][x], i);
            this.nodes.push(new_node);
        }

        //Updates all nodes to include changes for initial values
        this.nodes.forEach(node => {
            if (node.solved) {
                const value = node.value;

                node.row.forEach(index => {
                    if (this.nodes[index].remove_possibility(value) && this.is_valid_solve(this.nodes[index])) {
                        this.propagate_update(index);
                    }
                });

                node.col.forEach(index => {
                    if (this.nodes[index].remove_possibility(value) && this.is_valid_solve(this.nodes[index])) {
                        this.propagate_update(index);
                    }
                });

                node.sqr.forEach(index => {
                    if (this.nodes[index].remove_possibility(value) && this.is_valid_solve(this.nodes[index])) {
                        this.propagate_update(index);
                    }
                });
            }
        });

        //Looks for sole candidates
        while (true) {
            let count = this.examine_possibles(false);
            //console.log(`Updated ${count}`);
            if (count === 0) break;
        };
    }

    /*
        Propagate Update

        When a node is updated (to solved) then this will propagate the new constraints
     */
    propagate_update(index) {
        let nodes = this.nodes;
        const node = this.nodes[index];
        const value = node.value;

        if (!node.solved) return;

        node.row.forEach(index => {
            if (this.nodes[index].remove_possibility(value) && this.is_valid_solve(this.nodes[index])) {
                this.propagate_update(index);
            }
        });
        node.col.forEach(index => {
            if (this.nodes[index].remove_possibility(value) && this.is_valid_solve(this.nodes[index])) {
                this.propagate_update(index);
            }
        });
        node.sqr.forEach(index => {
            if (this.nodes[index].remove_possibility(value) && this.is_valid_solve(this.nodes[index])) {
                this.propagate_update(index);
            }
        });


    }

    /*
        Is Valid Solve

        Checks if a node is actually being solved properly
     */
    is_valid_solve(node) {
        const value = node.possibles[0];

        for (var i = 0; i < node.row.length; i++) {
            if (this.nodes[node.row[i]].value == value) return false;
            if (this.nodes[node.col[i]].value == value) return false;
            if (this.nodes[node.sqr[i]].value == value) return false;
        }

        return true;
    }

    /*
        Examine Possibles

        Looks if a cell is the only candidate for a number in one of its subdomains

        if parameter count is true, no updates will occur will only count number of changes (for heuristic)
    */
    examine_possibles(count) {
        let updates = 0;
        //Loop through diagonally (hitting all rows/columns in n iterations)
        for (var i = 0; i < this.size; i++) {
            let node = this.nodes[i * (this.size + 1)];
            updates += this.calculate_frequencies(node, 0, count); //Row
            updates += this.calculate_frequencies(node, 1, count); //Col
        }

        let inc = Math.sqrt(this.size);

        //Loop through top left of all sub_squares
        for (var y = 0; y < this.size; y += inc) {
            for (var x = 0; x < this.size; x += inc) {
                updates += this.calculate_frequencies(this.nodes[x_y_to_index(x, y, this.size)], 2, count); //Sqr
            }
        }

        return updates;
    }

    /*
        ECalculate Frequencies

        Examine possibles helper (does the sole candidate on a per node basis);
    */
    calculate_frequencies(node, choice, count) {
        let updates = 0;
        let freq = [];
        let arr = (choice === 0) ? node.row : (choice === 1) ? node.col : node.sqr;

        if (node.solved) {
            freq[node.value] = { solved: true };
        }
        else {
            add_all_possibles(node);
        }

        arr.forEach(index => {
            let sub_node = this.nodes[index];

            if (sub_node.solved) {
                freq[sub_node.value] = { solved: true };
                return;
            }

            add_all_possibles(sub_node);
        });

        for (var i = 1; i < freq.length; i++) {
            if (freq[i] == undefined) continue;
            if (!freq[i].solved && freq[i].indices.length === 1) {
                //console.log(`Index:${freq[i].indices[0]} is now ${i}`);
                updates++;
                if (!count) {
                    this.nodes[freq[i].indices[0]].solve(i);
                    this.propagate_update(freq[i].indices[0]);
                }
            }
        }

        return updates;

        function add_all_possibles(node) {
            node.possibles.forEach(pos => {
                if (freq[pos] == undefined) {
                    freq[pos] = {
                        indices: [node.index],
                        solved: false
                    }
                }
                else if (!freq[pos].solved) {
                    freq[pos].indices.push(node.index);
                }
            });
        }
    }

    /*
        Is Valid

        Checks if the board is valid
    */
    is_valid(debug) {
        //Loop through diagonally (hitting all rows/columns in n iterations)
        for (var i = 0; i < this.size; i++) {
            let node = this.nodes[i * (this.size + 1)];
            let row_seen = {};
            let col_seen = {};

            if (node.solved) {
                row_seen[node.value] = { i: node.index };
                col_seen[node.value] = { i: node.index };
            }

            for (var i = 0; i < node.row.length; i++) {
                const node_row = this.nodes[node.row[i]];
                const node_col = this.nodes[node.col[i]];

                if (node_row.solved) {
                    if (row_seen[node_row.value]) {
                        if (debug) {
                            let n = this.nodes[row_seen[node_row.value].i];
                            console.log(`Row - Value: ${n.value} - Node: ${n.index}=(${index_to_x_y(n.index, this.size).x},${index_to_x_y(n.index, this.size).y})`)
                            console.log(`Row - Value: ${node_row.value} - Node: ${node_row.index}=(${index_to_x_y(node_row.index, this.size).x},${index_to_x_y(node_row.index, this.size).y})`)
                        }
                        return false;
                    }
                    row_seen[node_row.value] = { i: node_row.index };
                }

                if (node_col.solved) {
                    if (col_seen[node_col.value]) {
                        if (debug) {
                            let n = this.nodes[col_seen[node_col.value].i];
                            console.log(`Col - Value: ${n.value} - Node: ${n.index}=(${index_to_x_y(n.index, this.size).x},${index_to_x_y(n.index, this.size).y})`)
                            console.log(`Col - Value: ${node_col.value} - Node: ${node_col.index}=(${index_to_x_y(node_col.index, this.size).x},${index_to_x_y(node_col.index, this.size).y})`)
                        }
                        return false;
                    }

                    col_seen[node_col.value] = { i: node_col.index };
                }
            }
        }

        let inc = Math.sqrt(this.size);

        //Loop through top left of all sub_squares
        for (var y = 0; y < this.size; y += inc) {
            for (var x = 0; x < this.size; x += inc) {
                let sqr_seen = {};
                let node = this.nodes[x_y_to_index(x, y, this.size)];

                if (node.solved) sqr_seen[node.value] = { i: node.index }

                for (var i = 0; i < node.row.length; i++) {
                    const node_sqr = this.nodes[node.sqr[i]];

                    if (node_sqr.solved) {
                        if (sqr_seen[node_sqr.value]) {
                            if (debug) {
                                let n = this.nodes[sqr_seen[node_sqr.value].i];
                                console.log(`Sqr - Value: ${n.value} - Node: ${n.index}=(${index_to_x_y(n.index, this.size).x},${index_to_x_y(n.index, this.size).y})`)
                                console.log(`Sqr - Value: ${node_sqr.value} - Node: ${node_sqr.index}=(${index_to_x_y(node_sqr.index, this.size).x},${index_to_x_y(node_sqr.index, this.size).y})`)
                            }

                            return false;
                        }
                        sqr_seen[node_sqr.value] = { i: node_sqr.index };
                    }
                }
            }
        }

        return true;
    }

    /*
        Is Solved
     
        Checks if the board is solved
    */
    is_solved() {
        for (var i = 0; i < this.nodes.length; i++) {
            if (!this.nodes[i].solved) return false;
        }

        //return this.is_valid();
        return true;
    }

    /*
        List possibilities
     
        Debugging function to list possible answers per node
    */
    list_possibles() {
        this.nodes.forEach(node => {
            if (node.solved) return;
            console.log(`${node.index}: ${node.possibles}`);
        });
    }

    /*
        Print Board
    */
    print_board() {
        let str = "";
        let zeroes = 0;

        this.nodes.forEach(node => {
            if (node.index % this.size == 0) {
                console.log(`${str}`);
                str = "";
            }

            str += " " + node.value;
            if (node.value === 0) zeroes++;
        });

        console.log(`${str}\nZeroes:${zeroes}`);
    }

    /*
        Get Board
     
        Returns the board in a 2d array (like board templates);
    */
    get_board() {
        let board = [];
        let row = [];
        this.nodes.forEach(node => {
            row.push(node.value);

            if ((node.index + 1) % this.size == 0) {
                board.push(row);
                row = [];
            }
        });

        return board;
    }

    get_node(index) {
        if (index < 0 || index >= this.nodes.length) return;

        return this.nodes[index];
    }

    get_neighbours() {
        let neighbours = [];
        let min = { size: Number.MAX_SAFE_INTEGER, index: 0 };

        for (var n = 0; n < this.nodes.length; n++) {
            let node = this.nodes[n];
            if (node.solved) continue;
            if (node.possibles.length < min.size) min = { size: node.possibles.length, index: node.index };
        }

        let node = this.nodes[min.index];

        //console.log(min, node.possibles);

        for (var i = 0; i < min.size; i++) {
            let board = this.get_board();
            if (board[node.y][node.x].solved) console.log("Broken");
            board[node.y][node.x] = node.possibles[i];
            neighbours.push(board);
        }

        return neighbours;
    }

    get_all_min_neighbours() {
        let neighbours = [];
        let min = this.size;

        for (var n = 0; n < this.nodes.length; n++) {
            let node = this.nodes[n];
            if (node.solved) continue;
            if (node.possibles.length < min) min = node.possibles.length;
        }

        for (var n = 0; n < this.nodes.length; n++) {
            let node = this.nodes[n];
            if (!node.solved && node.possibles.length === min)
                for (var i = 0; i < min; i++) {
                    let board = this.get_board();
                    if (board[node.y][node.x].solved) console.log("Broken");
                    board[node.y][node.x] = node.possibles[i];
                    neighbours.push(board);
                }
        }

        return neighbours;
    }
}

function x_y_to_index(x, y, size) {
    return y * size + x;
}

function index_to_x_y(index, size) {
    let row = Math.floor(index / size);
    return {
        x: (index - (row * size)), y: row
    };
}

module.exports = {
    Board
}
