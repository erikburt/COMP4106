let rand = require("randgen");
let columnify = require("columnify");

const MAPPING = getRandomMap(); //[1, 2, 3, 4, 5, 6, 7, 8];
const INDEX_EIGHT = MAPPING.indexOf(8);
const SIGMA = 64;
const TRIALS = 100;
const ENS = 1;
const ITERATIONS = 1000;

console.log("mapping", MAPPING);
main();

function main() {
  let out = [];

  out.push(tsetlin_ens());
  out.push(krinsky_ens());
  out.push(krylov_ens());
  out.push(lri_cur_ens());
  out.push(lri_pro_ens());
  out.push(lri_rand_ens());

  console.log(
    columnify(out, {
      columns: [
        "name",
        "weightedavg",
        "accuracy",
        "time",
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7"
      ]
    })
  );
}

//------------------TSETLIN----------------------
function tsetlin_ens() {
  let t0 = new Date().getTime();
  let ensemble = [0, 0, 0, 0, 0, 0, 0, 0],
    avg;
  let start = 0,
    start_average = 0,
    memory = 5;

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

  return formatObj("Tsetlin", ensemble, t0);
}

function run_tsetlin(start_choice, start_average, memory) {
  let ensemble = [0, 0, 0, 0, 0, 0, 0, 0];
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

    average = (i * average + str) / (i + 1);

    if (ITERATIONS - i < ENS) ensemble[choice.cur]++;
  }

  return ensemble;

  //TSETLIN
  function automata(i, reward) {
    if (reward) {
      if (i.n < N) i.n++;
    } else {
      if (i.n === 0) i.cur = (i.cur + 1) % NUM_STATES;
      else i.n--;
    }

    return i;
  }
}

//------------------KRINSKY----------------------
function krinsky_ens() {
  let t0 = new Date().getTime();
  let ensemble = [0, 0, 0, 0, 0, 0, 0, 0],
    avg;
  let start = 0,
    start_average = 0,
    memory = 5;

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

  return formatObj("Krinsky", ensemble, t0);
}

function run_krinsky(start_choice, start_average, memory) {
  let ensemble = [0, 0, 0, 0, 0, 0, 0, 0];
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

    average = (i * average + str) / (i + 1);

    if (ITERATIONS - i < ENS) ensemble[choice.cur]++;
  }

  return ensemble;

  //Krinsky
  function automata(i, reward) {
    if (reward) {
      if (i.n < N) i.n = N;
    } else {
      if (i.n === 0) i.cur = (i.cur + 1) % NUM_STATES;
      else i.n--;
    }

    return i;
  }
}

//------------------KRYLOV----------------------
function krylov_ens() {
  let t0 = new Date().getTime();
  let ensemble = [0, 0, 0, 0, 0, 0, 0, 0],
    avg;
  let start = 0,
    start_average = 0,
    memory = 5;

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

  return formatObj("Krylov", ensemble, t0);
}

function run_krylov(start_choice, start_average, memory) {
  let ensemble = [0, 0, 0, 0, 0, 0, 0, 0];
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

    average = (i * average + str) / (i + 1);

    if (ITERATIONS - i < ENS) ensemble[choice.cur]++;
  }

  return ensemble;

  //KRYLOV
  function automata(i, reward) {
    if (reward) {
      if (i.n < N) i.n++;
    } else {
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
function lri_cur_ens() {
  let t0 = new Date().getTime();
  let ensemble = [0, 0, 0, 0, 0, 0, 0, 0],
    avg;
  let start = 0,
    start_average = 50,
    lambda = 0.89;

  for (var i = 0; i < TRIALS; i++) {
    //Random start everytime
    start = Math.floor(Math.random(8));

    //Increment start avg from 0 to 100
    start_average++;

    //Increment factor from .89 to .99
    lambda += 0.001;

    let res = run_lri(start, start_average, lambda, false);

    for (var j = 0; j < ensemble.length; j++) {
      ensemble[j] += res[j];
    }
  }

  return formatObj("LRI (c)", ensemble, t0);
}

//------------------LRI----------------------
function lri_pro_ens() {
  let t0 = new Date().getTime();
  let ensemble = [0, 0, 0, 0, 0, 0, 0, 0],
    avg;
  let start = 0,
    start_average = 50,
    lambda = 0.89;

  for (var i = 0; i < TRIALS; i++) {
    //Random start everytime
    start = Math.floor(Math.random(8));

    //Increment start avg from 0 to 100
    start_average++;

    //Increment factor from .89 to .99
    lambda += 0.001;

    let res = run_lri(start, start_average, lambda, true);

    for (var j = 0; j < ensemble.length; j++) {
      ensemble[j] += res[j];
    }
  }

  return formatObj("LRI (p)", ensemble, t0);
}

//------------------LRI----------------------
function lri_rand_ens() {
  let t0 = new Date().getTime();
  let ensemble = [0, 0, 0, 0, 0, 0, 0, 0],
    avg;
  let start = 0,
    start_average = 50,
    lambda = 0.89;

  for (var i = 0; i < TRIALS; i++) {
    //Random start everytime
    start = Math.floor(Math.random(8));

    //Increment start avg from 0 to 100
    start_average++;

    //Increment factor from .89 to .99
    lambda += 0.001;

    let res = run_lri(
      start,
      start_average,
      lambda,
      Math.round(Math.random(), 1)
    );

    for (var j = 0; j < ensemble.length; j++) {
      ensemble[j] += res[j];
    }
  }

  return formatObj("LRI (r)", ensemble, t0);
}

function run_lri(start_choice, start_average, lambda, percent) {
  let ensemble = [0, 0, 0, 0, 0, 0, 0, 0];
  const NUM_STATES = 8;

  let probabilities = [0.125, 0.125, 0.125, 0.125, 0.125, 0.125, 0.125, 0.125];
  let average = start_average;
  let choice = { cur: start_choice, n: 0 };
  let reward = false;
  let str = 0;

  for (var i = 1; i <= ITERATIONS; i++) {
    choice = automata(choice, reward);
    str = strength(choice.cur);
    reward = str > average;

    average = (i * average + str) / (i + 1);

    if (reward) {
      let total = 0;
      for (var x = 0; x < probabilities.length; x++) {
        if (x === choice.cur) continue;

        probabilities[x] = probabilities[x] * lambda;
        total += probabilities[x];
      }

      probabilities[choice.cur] = 1 - total;
    }

    if (ITERATIONS - i < ENS) {
      if (percent) ensemble[indexOfMax(probabilities)]++;
      else ensemble[choice.cur]++;
    }
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
  return 3 * gi / 2 + noise;
}

function weightedAvg(ens) {
  let total = 0;
  for (var i = 0; i < ens.length; i++) {
    total += MAPPING[i] * ens[i];
  }

  return total / (TRIALS * ENS);
}

function indexOfMax(arr) {
  if (arr.length === 0) {
    return -1;
  }

  var max = arr[0];
  var maxIndex = 0;

  for (var i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      maxIndex = i;
      max = arr[i];
    }
  }

  return maxIndex;
}

function formatObj(name, ensemble, t0) {
  let obj = { name };

  for (var j = 0; j < ensemble.length; j++) {
    obj[`${j}`] = ensemble[j];
  }

  obj.weightedavg = weightedAvg(ensemble);
  obj.accuracy = ensemble[INDEX_EIGHT] / (TRIALS * ENS);
  obj.time = new Date().getTime() - t0;

  return obj;
}

function getRandomMap() {
  let out_arr = [];
  let arr = [1, 2, 3, 4, 5, 6, 7, 8];

  while (arr.length !== 0) {
    let x = Math.floor(Math.random() * arr.length);
    out_arr.push(arr[x]);
    arr.splice(x, 1);
  }

  return out_arr;
}
