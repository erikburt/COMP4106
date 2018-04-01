let rand = require("randgen");

let mapping = [1, 2, 3, 4, 5, 6, 7, 8]; //getRandomMap();

main();

function main() {
    tsetlin(5, 5, 100);
}

function tsetlin(size, sigma, n) {
    let node_number = 0;
    let nodes = [0, 0, 0, 0, 0, 0, 0, 0];

    for (var i = 0; i < n; i++) {
        if (isMax(node_number, sigma)) {
            if (nodes[node_number] !== size) nodes[node_number]++;
        }
        else {
            if (nodes[node_number] === 0) node_number = (node_number + 1) % 8;
            else nodes[node_number] -= 1;
        }
    }

    console.log(nodes);
}

function isMax(action, sigma) {
    let val = [];
    for (var i = 0; i < mapping.length; i++) {
        val.push(strength(i));
    }

    let max_index = 0;
    for (var i = 0; i < val.length; i++) {
        if (val[max_index] < val[i]) {
            max_index = i;
        }
    }

    console.log(val, max_index)

    return action === max_index;

    function strength(index) {
        let gi = mapping[index];
        let h = rand.rnorm(0, sigma);

        return (3 * gi) / 2 + h;
    }
}


function getRandomMap() {
    let out_arr = [];
    let arr = [1, 2, 3, 4, 5, 6, 7, 8];

    while (arr.length !== 0) {
        let x = Math.floor(Math.random() * (arr.length));
        out_arr.push(arr[x]);
        arr.splice(x, 1);
    }

    return out_arr;
}