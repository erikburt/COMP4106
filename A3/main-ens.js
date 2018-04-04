let rand = require("randgen");

const MAPPING = getRandomMap(); //[1, 2, 3, 4, 5, 6, 7, 8];
const INDEX_EIGHT = MAPPING.indexOf(8);
const SIGMA = 3;
const TRIALS = 100;
const ENS = 5000;
const ITERATIONS = 15000;

console.log("mapping", MAPPING);
main();

function main() {
    tsetlin_ens();
    krinsky_ens();
    krylov_ens();
    lri_ens();
}

//------------------TSETLIN----------------------
function tsetlin_ens() {
    let t0 = new Date().getTime();
    let ensemble = [0, 0, 0, 0, 0, 0, 0, 0], avg;
    let start = 0, start_average = 0, memory = 5;

    for (var i = 0; i < TRIALS; i++) {
        //Random start everytime
        start = Math.floor(Math.random(8));

        //Random memory from [3,15)
        memory = Math.floor(Math.random(10)) + 3;

        //Increment start avg from 0 to 100
        start_average++;

        let res = run_tsetlin(start, start_average, memory);

        for (var j = 0; j < ensemble.length; j++) {
            ensemble[j] += res[j];
        }
    }

    console.log("tsetlin:", ensemble, (avg = weightedAvg(ensemble)), ensemble[INDEX_EIGHT] / (TRIALS * ENS), avg / 8, (new Date().getTime()) - t0);
}

function run_tsetlin(start_choice, start_average, memory) {
    let ensemble = [0, 0, 0, 0, 0, 0, 0, 0]
    const N = memory;
    const NUM_STATES = 8;

    let average = start_average;
    let choice = { cur: start_choice, n: 0 };
    let reward = false;
    let str = 0;

    for (var i = 1; i <= ITERATIONS; i++) {
        choice = automata(choice, reward);
        str = strength(choice.cur);
        reward = str > average;

        average = ((i * average) + str) / (i + 1);

        if (ITERATIONS - i < ENS) ensemble[choice.cur]++;
    }

    return ensemble;

    //TSETLIN
    function automata(i, reward) {
        if (reward) {
            if (i.n < N) i.n++;
        }
        else {
            if (i.n === 0) i.cur = (i.cur + 1) % NUM_STATES;
            else i.n--;
        }

        return i;
    }
}

//------------------KRINSKY----------------------
function krinsky_ens() {
    let t0 = new Date().getTime();
    let ensemble = [0, 0, 0, 0, 0, 0, 0, 0], avg;
    let start = 0, start_average = 0, memory = 5;

    for (var i = 0; i < TRIALS; i++) {
        //Random start everytime
        start = Math.floor(Math.random(8));

        //Random memory from [2,5)
        memory = Math.floor(Math.random(4)) + 2;

        //Increment start avg from 0 to 100
        start_average++;

        let res = run_krinsky(start, start_average, memory);

        for (var j = 0; j < ensemble.length; j++) {
            ensemble[j] += res[j];
        }
    }

    console.log("krinsky:", ensemble, (avg = weightedAvg(ensemble)), ensemble[INDEX_EIGHT] / (TRIALS * ENS), avg / 8, (new Date().getTime()) - t0);
}

function run_krinsky(start_choice, start_average, memory) {
    let ensemble = [0, 0, 0, 0, 0, 0, 0, 0]
    const N = memory;
    const NUM_STATES = 8;

    let average = start_average;
    let choice = { cur: start_choice, n: 0 };
    let reward = false;
    let str = 0;

    for (var i = 1; i <= ITERATIONS; i++) {
        choice = automata(choice, reward);
        str = strength(choice.cur);
        reward = str > average;

        average = ((i * average) + str) / (i + 1);

        if (ITERATIONS - i < ENS) ensemble[choice.cur]++;
    }

    return ensemble;

    //Krinsky
    function automata(i, reward) {
        if (reward) {
            if (i.n < N) i.n = N;
        }
        else {
            if (i.n === 0) i.cur = (i.cur + 1) % NUM_STATES;
            else i.n--;
        }

        return i;
    }
}


//------------------KRYLOV----------------------
function krylov_ens() {
    let t0 = new Date().getTime();
    let ensemble = [0, 0, 0, 0, 0, 0, 0, 0], avg;
    let start = 0, start_average = 0, memory = 5;

    for (var i = 0; i < TRIALS; i++) {
        //Random start everytime
        start = Math.floor(Math.random(8));

        //Random memory from [2,5)
        memory = Math.floor(Math.random(4)) + 2;

        //Increment start avg from 0 to 100
        start_average++;

        let res = run_krylov(start, start_average, memory);

        for (var j = 0; j < ensemble.length; j++) {
            ensemble[j] += res[j];
        }
    }
    console.log("krylov:", ensemble, (avg = weightedAvg(ensemble)), ensemble[INDEX_EIGHT] / (TRIALS * ENS), avg / 8, (new Date().getTime()) - t0);
}

function run_krylov(start_choice, start_average, memory) {
    let ensemble = [0, 0, 0, 0, 0, 0, 0, 0]
    const N = memory;
    const NUM_STATES = 8;

    let average = start_average;
    let choice = { cur: start_choice, n: 0 };
    let reward = false;
    let str = 0;

    for (var i = 1; i <= ITERATIONS; i++) {
        choice = automata(choice, reward);
        str = strength(choice.cur);
        reward = str > average;

        average = ((i * average) + str) / (i + 1);

        if (ITERATIONS - i < ENS) ensemble[choice.cur]++;
    }

    return ensemble;

    //KRYLOV
    function automata(i, reward) {
        if (reward) {
            if (i.n < N) i.n++;
        }
        else {
            if (i.n === 0) i.cur = (i.cur + 1) % NUM_STATES;
            else {
                if (Math.round(Math.random(), 1)) i.n = (i.n + 1) % N;
                else i.n--;
            }
        }

        return i;
    }
}


//------------------LRI----------------------
function lri_ens() {
    let t0 = new Date().getTime();
    let ensemble = [0, 0, 0, 0, 0, 0, 0, 0], avg;
    let start = 0, start_average = 50, lambda = .89;

    for (var i = 0; i < TRIALS; i++) {
        //Random start everytime
        start = Math.floor(Math.random(8));

        //Increment start avg from 0 to 100
        start_average++;

        //Increment factor from .89 to .99
        lambda += .001;

        let res = run_lri(start, start_average, lambda);

        for (var j = 0; j < ensemble.length; j++) {
            ensemble[j] += res[j];
        }
    }

    console.log("lri:", ensemble, (avg = weightedAvg(ensemble)), ensemble[INDEX_EIGHT] / (TRIALS * ENS), avg / 8, (new Date().getTime()) - t0);
}


function run_lri(start_choice, start_average, lambda) {
    let ensemble = [0, 0, 0, 0, 0, 0, 0, 0]
    const NUM_STATES = 8;

    let probabilities = [.125, .125, .125, .125, .125, .125, .125, .125];
    let average = start_average;
    let choice = { cur: start_choice, n: 0 };
    let reward = false;
    let str = 0;


    for (var i = 1; i <= ITERATIONS; i++) {
        choice = automata(choice, reward);
        str = strength(choice.cur);
        reward = str > average;

        average = ((i * average) + str) / (i + 1);

        if (reward) {
            let total = 0;
            for (var x = 0; x < probabilities.length; x++) {
                if (x === choice.cur) continue;

                probabilities[x] = probabilities[x] * lambda;
                total += probabilities[x];
            }

            probabilities[choice.cur] = 1 - total;
        }

        if (ITERATIONS - i < ENS) ensemble[choice.cur]++;
    }

    return ensemble;

    //LRI
    function automata(i, reward) {
        if (reward) return i;
        else i.cur = (i.cur + 1) % NUM_STATES;

        return i;
    }
}

function strength(index) {
    let gi = MAPPING[index];
    let noise = rand.rnorm(0, SIGMA);
    return (3 * gi) / 2 + noise;
}

function weightedAvg(ens) {
    let total = 0;
    for (var i = 0; i < ens.length; i++) {
        total += MAPPING[i] * ens[i];
    }

    return total / (TRIALS * ENS);
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