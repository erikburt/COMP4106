mod board;
use board::Board;

use std::time::{Duration, Instant};

use std::vec::Vec;
use std::collections::HashSet;
use std::collections::VecDeque;

const BASE: [[u8;5]; 5] = [
    [9,9,9,9,0],
    [9,9,9,1,1],
    [9,9,1,1,1],
    [9,1,1,1,1],
    [1,1,1,1,1],
];

fn main() {
   let now = Instant::now();
    
    let start_id = Board::array_to_id(&BASE);
    run_dfs();
    println!("{}", now.elapsed().as_secs());
}

fn run_dfs() {
    let start_id = Board::array_to_id(&BASE);

    let mut path = dfs(start_id);

    for i in 0..path.len() {
        if path[i] == 0 { break; }
        write_state_id(path[i]);
        println!();
    }
}

fn dfs(start:u32) -> [u32;14] {
    let mut stack: Vec<u32> = Vec::new();
    let mut visited: HashSet<u32> = HashSet::new();
    let mut path:[u32;14] = [0;14];
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

        if cur.score == 14 { 
            write_state_id(cur.id);
            println!("{}", cur.id);
            break;
        }

        for x in cur.get_children() {
            if visited.insert(x) { stack.push(x); }          
        }
    }

    return path;
}

//Working
fn write_state_array(state:&[[u8;5];5]) {
    println!("write_state_array");

    for row in 0..state.len() {
        for col in 0..state[row].len() {
            print!("{} ", state[row][col]);
        }
        println!();
    }
}

//Working
fn write_state_id(id: u32) {
    println!("write_state_id");
    let mut bit:u32 = 1 << 24;

    for _row in 0..5 {
        for _col in 0..5 {
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
fn write_bits(id: u32) {
    let mut bit:u32 = 1 << 31;

    for _i in 0..32 {
        let val = id&bit;
        match val {
            0 => print!("0"),
            _ => print!("1")
        }

        bit >>= 1
    }

}