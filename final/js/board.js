let NodeImp = require("./node.js");
let { Node } = NodeImp;

class Board {
    constructor(size, board) {
        this.nodes = [];
        this.size = size;

        for (var i = 0; i < size * size; i++) {
            let new_node = new Node(size, board, i);
            this.nodes.push(new_node);
        }

        this.update_all_possibles();

        while (true) {
            let count = this.examine_possibles(false);
            console.log(`Updated ${count}`);
            if (count === 0) break;
        };
    }

    update_all_possibles() {
        this.nodes.forEach(node => {

            if (node.solved) {
                const value = node.value;

                node.row.forEach(index => {
                    if (this.nodes[index].remove_possibility(value) && this.is_valid_solve(node)) {
                        this.propagate_update(index);
                    }
                });

                node.col.forEach(index => {
                    if (this.nodes[index].remove_possibility(value) && this.is_valid_solve(node)) {
                        this.propagate_update(index);
                    }
                });

                node.sqr.forEach(index => {
                    if (this.nodes[index].remove_possibility(value) && this.is_valid_solve(node)) {
                        this.propagate_update(index);
                    }
                });
            }
        });
    }

    propagate_update(index) {
        const node = this.nodes[index];
        const value = node.value;

        if (!node.solved) return;

        node.row.forEach(index => {
            if (this.nodes[index].remove_possibility(value) && this.is_valid_solve(node)) {
                this.propagate_update(index);
            }
        });

        node.col.forEach(index => {
            if (this.nodes[index].remove_possibility(value) && this.is_valid_solve(node)) {
                this.propagate_update(index);
            }
        });

        node.sqr.forEach(index => {
            if (this.nodes[index].remove_possibility(value) && this.is_valid_solve(node)) {
                this.propagate_update(index);
            }
        });
    }

    is_valid_solve(node) {
        const value = node.possibles[0];

        for (var i = 0; i < node.row.length; i++) {
            if (this.nodes[node.row[i]].value == value) return false;
            if (this.nodes[node.col[i]].value == value) return false;
            if (this.nodes[node.sqr[i]].value == value) return false;
        }

        return true;
    }

    //Looks if a cell is the only candidate for a number in one of its subdomains
    examine_possibles(count) {
        let updates = 0;
        //Loop through diagonally (hitting all rows/columns in n iterations)
        for (var i = 0; i < this.size; i++) {
            let node = this.nodes[i * (this.size + 1)];
            updates += this.calculate_frequencies(node, 0, count) + this.calculate_frequencies(node, 1, count);
        }

        let inc = Math.sqrt(this.size);

        for (var y = 0; y < this.size; y += inc) {
            for (var x = 0; x < this.size; x += inc) {
                const node = this.nodes[x_y_to_index(x, y, this.size)];
                updates += this.calculate_frequencies(node, 2, count);
            }
        }

        return updates;
    }

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

    //Very redundant
    is_valid() {
        let valid = true;
        this.nodes.forEach(node => {
            if (!valid) return valid;

            const value = node.value;
            if (value !== 0) {

                node.row.forEach(index => {
                    if (node.value === this.nodes[index].value) {
                        console.log(`Value: ${node.value} - Node: ${node.index}=(${index_to_x_y(node.index, this.size).x},${index_to_x_y(node.index, this.size).y})`)
                        console.log(`Value: ${this.nodes[index].value} - Node: ${index}=(${index_to_x_y(index, this.size).x},${index_to_x_y(index, this.size).y})`)
                        console.log();
                        valid = false;
                        return valid;
                    }
                });

                node.col.forEach(index => {
                    if (node.value === this.nodes[index].value) {
                        console.log(`Value: ${node.value} - Node: ${node.index}=(${index_to_x_y(node.index, this.size).x},${index_to_x_y(node.index, this.size).y})`)
                        console.log(`Value: ${this.nodes[index].value} - Node: ${index}=(${index_to_x_y(index, this.size).x},${index_to_x_y(index, this.size).y})`)
                        console.log();
                        valid = false;
                        return valid;
                    }
                });

                node.sqr.forEach(index => {
                    if (node.value === this.nodes[index].value) {
                        console.log(`Value: ${node.value} - Node: ${node.index}=(${index_to_x_y(node.index, this.size).x},${index_to_x_y(node.index, this.size).y})`)
                        console.log(`Value: ${this.nodes[index].value} - Node: ${index}=(${index_to_x_y(index, this.size).x},${index_to_x_y(index, this.size).y})`)
                        console.log();
                        valid = false;
                        return valid;
                    }
                });
            }
        });

        return valid;
    }

    is_solved() {
        for (var i = 0; i < this.nodes.length; i++) {
            if (!this.nodes[i].solved) return false;
        }

        return true;
    }

    list_possibles() {
        this.nodes.forEach(node => {
            if (node.solved) return;
            console.log(`${node.index}: ${node.possibles}`);
        });
    }

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
