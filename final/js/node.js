class Node {
    constructor(size, x, y, value, index) {
        this.possibles = [];
        this.row = [];
        this.col = [];
        this.sqr = [];
        this.x = x;
        this.y = y;
        this.value = value
        this.solved = false;
        this.index = index;

        if (this.value != 0) this.solved = true;

        for (let i = 0; i < size; i++) {
            if (this.value == 0) { this.possibles.push(i + 1); } //Pushed possible values
            if (i !== y) { this.col.push(x_y_to_index(x, i, size)); } //Pushes everything in the row
            if (i !== x) { this.row.push(x_y_to_index(i, y, size)); } //Pushes everyting in the col
        }

        //Square
        let sub_size = Math.sqrt(size);
        let sub_x = Math.floor(x / sub_size);
        let sub_y = Math.floor(y / sub_size);

        for (var x_i = 0; x_i < sub_size; x_i++) {
            for (var y_i = 0; y_i < sub_size; y_i++) {
                let n_index = x_y_to_index(sub_size * sub_x + x_i, sub_size * sub_y + y_i, size);

                if (index != n_index) {
                    this.sqr.push(n_index);
                }
            }
        }
    }

    solve(value) {
        this.value = value;
        this.solved = true;
    }

    remove_possibility(value) {
        if (this.solved) return false;

        const i = this.possibles.indexOf(value);

        if (i !== -1) {
            //console.log(`Before(${this.index}): ${this.possibles}   Removing:${value}`);
            this.possibles.splice(i, 1);
            //console.log(`After(${this.index}): ${this.possibles}`);
        }

        if (this.possibles.length === 1) {
            this.solve(this.possibles[0]);
            return true;
        }
        return false;
    }

    print_possibles() {
        console.log(this.possibles);
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
    Node
}