let rand = require("randgen");

let mapping = [1, 2, 3, 4, 5, 6, 7, 8]; //getRandomMap();
let nodes_copy = [0, 0, 0, 0, 0, 0, 0, 0]

main();
console.log('\n\n', nodes_copy)
function main() {
    // tsetlin(10, 3, 100);
    // krinsky(10, 3, 100);
    // kryvlov(10, 1, 3, 100);
    lri(.9, 3, 100);
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

function krinsky(size, sigma, n) {
    let node_number = 0;
    let nodes = [0, 0, 0, 0, 0, 0, 0, 0];

    for (var i = 0; i < n; i++) {
        if (isMax(node_number, sigma)) {
            if (nodes[node_number] !== size) nodes[node_number] = size;
        }
        else {
            if (nodes[node_number] === 0) node_number = (node_number + 1) % 8;
            else nodes[node_number] -= 1;
        }
    }

    console.log(nodes);
}

function kryvlov(size, beta, sigma, n) {
    let node_number = 0;
    let nodes = [0, 0, 0, 0, 0, 0, 0, 0];

    for (var i = 0; i < n; i++) {
        if (isMax(node_number, sigma)) {
            if (nodes[node_number] !== size) nodes[node_number] = size;
        }
        else {
            if (nodes[node_number] === 0) node_number = (node_number + 1) % 8;
            else if (nodes[node_number] >= size - beta || nodes[node_number] <= beta) {
                if (Math.round(Math.random(), 1)) nodes[node_number]++;
                else nodes[node_number]--;
            }
            else nodes[node_number] -= 1;
        }
    }

    console.log(nodes);
}

function lri(lambda, sigma, n) {
    let nodes = [.125, .125, .125, .125, .125, .125, .125, .125];
    let node_number = 0;

    for (var i = 0; i < n; i++) {
        if (isMax(node_number, sigma)) {
            let total = 0;
            for (var x = 0; x < nodes.length; x++) {
                if (x === node_number) continue;

                nodes[x] = nodes[x] * lambda;
                total += nodes[x];
            }

            nodes[node_number] = 1 - total;
        }
        else {
            node_number = (node_number + 1) % 8;
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

    nodes_copy[max_index]++;

    return action === max_index;

    function strength(index) {
        let gi = mapping[index];
        let noise = rand.rnorm(0, sigma);
        return (3 * gi) / 2 + noise;
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