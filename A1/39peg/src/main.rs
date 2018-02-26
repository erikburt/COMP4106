mod board;
use board::Board;

use std::time::{Duration, Instant};

use std::vec::Vec;
use std::collections::HashSet;
use std::collections::VecDeque;

const BASE: [[u8;8]; 8] = [
    [9,9,1,1,1,9,9,9],
    [9,9,1,1,1,9,9,9],
    [9,9,1,1,1,9,9,9],
    [1,1,1,1,1,1,1,1],
    [1,1,1,0,1,1,1,1],
    [1,1,1,1,1,1,1,1],
    [9,9,1,1,1,9,9,9],
    [9,9,1,1,1,9,9,9]
];

fn main() {
    let now = Instant::now();

    run_dfs();

    println!("{}", now.elapsed().as_secs());
}

fn run_dfs() {
    let start_id = Board::array_to_id(&BASE);

    let mut path = dfs(start_id);

    for i in 0..path.len() {
        write_state_id(path[i]);
        println!();
    }
}

// fn bfs(start:u64) {
//     let mut queue: VecDeque<u64> = VecDeque::new();
//     let mut visited: HashSet<u64> = HashSet::new();
//     //let mut path:[u64;36] = [0;36];
//     let mut cur;

//     queue.push_back(start);
//     visited.insert(start);

//     loop {
//         if queue.is_empty() { break; }
        
//         match queue.pop_front() {
//             Some(x) => cur = Board::new(x),
//             None => break
//         }

//         if cur.score == 36 { 
//             write_state_id(cur.id);
//             println!("{}", cur.id);
//             break;
//         }

//         for x in cur.get_children() {
//             if visited.insert(x) { queue.push_back(x); }          
//         }
//     }
// }

fn dfs(start:u64) -> [u64;38] {
    let mut stack: Vec<u64> = Vec::new();
    let mut visited: HashSet<u64> = HashSet::new();
    let mut path:[u64;38] = [0;38];
    let mut cur;

    stack.push(start);
    visited.insert(start);

    loop {
        if stack.is_empty() { break; }
        
        match stack.pop() {
            Some(x) => cur = Board::new(x),
            None => break
        }

        path[(cur.score-1) as usize] = cur.id;

        if cur.score == 38 { 
            // write_state_id(cur.id);
            // println!("{}", cur.id); 33554432
            break;
        }

        for x in cur.get_children() {
            if visited.insert(x) { stack.push(x); }          
        }
    }

    return path;
}

//Working
fn write_state_array(state:&[[u8;8];8]) {
    println!("write_state_array");

    for row in 0..state.len() {
        for col in 0..state[row].len() {
            print!("{} ", state[row][col]);
        }
        println!();
    }
}

//Working
fn write_state_id(id: u64) {
    println!("write_state_id");
    let mut bit:u64 = 1 << 63;

    for _row in 0..8 {
        for _col in 0..8 {
            let val = id&bit;
            match val {
                0 => print!("0 "),
                _ => print!("1 ")
            }

            bit >>= 1
        }

        println!();
    }
}

//Working
fn write_bits(id: u64) {
    let mut bit:u64 = 1 << 63;

    for _i in 0..64 {
        let val = id&bit;
        match val {
            0 => print!("0"),
            _ => print!("1")
        }

        bit >>= 1
    }

}