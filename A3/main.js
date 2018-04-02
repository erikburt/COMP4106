let rand = require("randgen");

let mapping = [1, 2, 3, 4, 5, 6, 7, 8]; //getRandomMap(); //
let nodes_copy = [0, 0, 0, 0, 0, 0, 0, 0]

main();

function main() {
    const MEMORY = 5;
    const SIGMA = 2;
    const SIZE = 100;
    const BETA = 1;
    const FACTOR = .9;

    let resTsetlin = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    let resKrinsky = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    let resKryvlov = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    let resLri = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    let ensemble = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    let a, b, c, d, add = 0;

    for (var i = 0; i < 15000; i++) {
        resTsetlin[(a = tsetlin(MEMORY, SIGMA, SIZE))]++;
        resKrinsky[(b = krinsky(MEMORY, SIGMA, SIZE))]++;
        resKryvlov[(c = kryvlov(MEMORY, BETA, SIGMA, SIZE))]++;
        resLri[(d = lri(FACTOR, SIGMA, SIZE))]++;

        if (i >= 10000) {
            add += (a + b + c + d)
        }
    }

    console.log(`,${mapping}`);
    console.log(`Tsetlin, ${resTsetlin}`);
    console.log(`Krinsky, ${resKrinsky}`);
    console.log(`Kryvlov, ${resKryvlov}`);
    console.log(`LRI, ${resLri}`);

    console.log(add / 20000);
    //console.log(`Ensemble: ${ensemble}`);
}

function run() {

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

    return getMaxIndex(nodes);
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

    return getMaxIndex(nodes);
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

    return getMaxIndex(nodes);
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

    return getMaxIndex(nodes);
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

    return action === max_index;

    function strength(index) {
        let gi = mapping[index];
        let noise = rand.rnorm(0, sigma);
        return (3 * gi) / 2 + noise;
    }
}

function getMaxIndex(nodes) {
    let max_index = 0;
    let all_same = true;

    for (var i = 1; i < nodes.length; i++) {
        if (nodes[i] !== nodes[0]) {
            all_same = false;
            break;
        }
    }

    if (all_same) return 8;

    for (var i = 0; i < nodes.length; i++) {
        if (nodes[max_index] < nodes[i]) {
            max_index = i;
        }
    }

    return max_index;
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