mod board;
use board::Board;

extern crate priority_queue;

use std::time::Instant;

use std::vec::Vec;
use std::collections::HashSet;
use std::collections::VecDeque;
use std::collections::HashMap;
use priority_queue::PriorityQueue;

const BASE: [[u8;7]; 7] = [
    [9,9,1,1,1,9,9],
    [9,1,1,1,1,1,9],
    [1,1,1,0,1,1,1],
    [1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1],
    [9,1,1,1,1,1,9],
    [9,9,1,1,1,9,9]
];

const BASE_BFS: [[u8;7]; 7] = [
    [9,9,0,0,0,9,9],
    [9,0,0,0,0,1,9],
    [1,1,0,0,1,0,0],
    [1,1,1,0,1,0,0],
    [1,0,0,1,1,0,0],
    [9,0,0,0,1,1,9],
    [9,9,0,0,1,9,9]
];

fn main() {
    // run_dfs();
    // run_bfs();
    run_astar();
}

fn run_dfs() {
    println!("--DFS--");

    let mut now = Instant::now();
    let start_id = Board::array_to_id(&BASE);
    let mut path = dfs(start_id);

    //print_path(&path);
    println!("DFS Time: {}\n\n", now.elapsed().as_secs());
}

fn run_bfs() {

    println!("--BFS--");

    let mut now = Instant::now();
    let start_id = Board::array_to_id(&BASE_BFS);
    let mut path = bfs(start_id);

    //print_path(&path);
    println!("BFS Time: {}\n\n", now.elapsed().as_secs());
}

fn run_astar() {
    println!("--A Star--");

    let mut now = Instant::now();
    let start_id = Board::array_to_id(&BASE);
    let mut path = astar(start_id);
    
    print_path(&path);
    println!("AStar Time: {}\n\n", now.elapsed().as_secs());
}

fn print_path(path:&[u64;36]) {
    for i in 0..path.len() {
        write_state_id(path[i]);
        println!();
     }
} 

fn bfs(start:u64) -> [u64;36]  {
    let mut queue: VecDeque<u64> = VecDeque::new();
    let mut visited: HashSet<u64> = HashSet::new();
    let mut parent:HashMap<u64, u64> = HashMap::new();
    let mut path:[u64;36] = [0;36];
    let mut cur = Board::new(start);
    let mut end:u64 = 0;

    parent.insert(start, 0);
    queue.push_back(start);
    visited.insert(start);

    loop {
        if queue.is_empty() { break; }
        
        match queue.pop_front() {
            Some(x) => cur = Board::new(x),
            None => println!("Last element")
        }

        if cur.score == 36 { 
            end = cur.id;
            write_state_id(cur.id);
            println!("{}", cur.id);
            break;
        }

        for x in cur.get_children() {
            if visited.insert(x) {
                queue.push_back(x);
                parent.insert(x, cur.id);
            }
        }
    }

    queue.clear();
    queue.push_front(end);
    let mut parent_id:u64 = 0;
    
    match parent.get(&end) {
        Some(x) => parent_id = *x,
        None => println!("Error: no parent id found for end")
    }

    loop {
        if parent_id == 0 { break; }

        queue.push_front(parent_id);
        match parent.get(&parent_id) {
            Some(x) => parent_id = *x,
            None => break
        }
    }

    for x in 0..queue.len() {
        match queue.get(x) {
            Some(ele) => path[x] = *ele,
            None => break
        }
    }

    return path;
}

fn dfs(start:u64) -> [u64;36] {
    let mut stack: Vec<u64> = Vec::new();
    let mut visited: HashSet<u64> = HashSet::new();
    let mut path:[u64;36] = [0;36];

    let mut cur = Board::new(start);

    stack.push(start);
    visited.insert(start);

    loop {
        if stack.is_empty() { break; }
        
        match stack.pop() {
            Some(x) => cur = Board::new(x),
            None => println!("Last element")
        }

        path[(cur.score-1) as usize] = cur.id;

        if cur.score == 36 { 
            write_state_id(cur.id);
            println!("{}", cur.id);
            break;
        }

        for x in cur.get_children() {
            if visited.insert(x) { stack.push(x); }      
        }
    }

    println!("Stack: {}\nVisited: {}\nSum: {}", stack.len(), visited.len(),  stack.len()+visited.len());

    return path;
}

fn astar(start:u64) -> [u64;36]  {
    let mut queue: PriorityQueue<u64, u8> = PriorityQueue::new();
    let mut visited: HashSet<u64> = HashSet::new();
    let mut parent:HashMap<u64, u64> = HashMap::new();
    let mut path:[u64;36] = [0;36];
    let mut cur = Board::new(start);
    let mut end:u64 = 0;

    parent.insert(start, 0);
    queue.push(start, 1);
    visited.insert(start);

    loop {
        if queue.is_empty() { break; }
        
        let ele = queue.pop();

        match ele {
            Some((x,y)) => cur = Board::new(x),
            None => println!("Last element")
        }

        if cur.score == 36 { 
            end = cur.id;
            write_state_id(cur.id);
            println!("{}", cur.id);
            break;
        }

        for x in cur.get_children() {
            if visited.insert(x) {
                queue.push(x, get_priority_avg(x));
                parent.insert(x, cur.id);
            }
        }
    }

    println!("Queue: {}\nVisited: {}\nSum: {}", queue.len(), visited.len(),  queue.len()+visited.len());

    let mut vecd: VecDeque<u64> = VecDeque::new();

    queue.clear();
    vecd.push_front(end);
    let mut parent_id:u64 = 0;
    
    match parent.get(&end) {
        Some(x) => parent_id = *x,
        None => println!("Error: no parent id found for end")
    }

    loop {
        if parent_id == 0 { break; }

        vecd.push_front(parent_id);
        match parent.get(&parent_id) {
            Some(x) => parent_id = *x,
            None => break
        }
    }

    for x in 0..vecd.len() {
        match vecd.get(x) {
            Some(ele) => path[x] = *ele,
            None => break
        }
    }

    return path;
}

//Working
fn write_state_array(state:&[[u8;7];7]) {
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
    let mut bit:u64 = 1 << 48;

    for _row in 0..7 {
        for _col in 0..7 {
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

fn get_priority_1(id:u64) -> u8{
    let score = Board::count_zeros(id);
    let mut heur_score:u8 = 0;
    let arr = Board::id_to_array(id);

    //Checks how many pegs are within a 2 radius of another
    for row in 0..arr.len() {
        for col in 0..arr[row].len() {
            if arr[row][col] != 1 { continue; }

            let mut ok:bool = false;
            let mut srow:i8 = row as i8 -3;

            loop {
                srow += 1;
                if srow > row as i8 +2 { break; }
        
                let mut scol:i8 = col as i8 -3;
                loop {
                    scol += 1;
                    if scol > col as i8 +2 { break; }

                    if srow < 0 || scol < 0 || srow > 6 || scol > 6 ||
                    (srow == row as i8 -2 && scol == col as i8 -2) ||
                    (srow == row as i8 -2 && scol == col as i8 +2) ||
                    (srow == row as i8 +2 && scol == col as i8 -2) ||
                    (srow == row as i8 +2 && scol == col as i8 +2) ||
                    (arr[srow as usize][scol as usize] == 9) { continue; }

                    if arr[srow as usize][scol as usize] == 1 {
                        ok = true;
                        break;
                    }
                }

                if ok {
                    heur_score += 1;
                    break;
                }
            }            
        }
    }

    return score+(heur_score/2);
}

fn get_priority_2(id:u64) -> u8{
    let score = Board::count_zeros(id);
    let mut heur_score:u8 = 0;
    let arr = Board::id_to_array(id);

    const ROW:u8 = 3;
    const COL:u8 = 3;

    //Checks how many pegs are within a 2 radius of the center
    let mut srow:u8 = 0;

    loop {
        srow += 1;
        if srow > ROW +2 { break; }

        let mut scol:u8 = 0;
        loop {
            scol += 1;
            if scol > COL +2 { break; }

            if  (srow == ROW-2 && scol == COL-2) ||
            (srow == ROW-2 && scol == COL+2) ||
            (srow == ROW+2 && scol == COL-2) ||
            (srow == ROW+2 && scol == COL+2) ||
            (arr[srow as usize][scol as usize] == 9) { continue; }

            if arr[srow as usize][scol as usize] == 1 {
                heur_score += 1;
            }
        }
    }

    return score+heur_score;
}

fn get_priority_avg(id:u64) -> u8{
    let score = Board::count_zeros(id);
    let mut heur_score_1:u8 = 0;
    let mut heur_score_2:u8 = 0;
    let arr = Board::id_to_array(id);

    //Checks how many pegs are within a 2 radius of another
    for row in 0..arr.len() {
        for col in 0..arr[row].len() {
            if arr[row][col] != 1 { continue; }

            let mut ok:bool = false;
            let mut srow:i8 = row as i8 -3;

            loop {
                srow += 1;
                if srow > row as i8 +2 { break; }
        
                let mut scol:i8 = col as i8 -3;
                loop {
                    scol += 1;
                    if scol > col as i8 +2 { break; }

                    if srow < 0 || scol < 0 || srow > 6 || scol > 6 ||
                    (srow == row as i8 -2 && scol == col as i8 -2) ||
                    (srow == row as i8 -2 && scol == col as i8 +2) ||
                    (srow == row as i8 +2 && scol == col as i8 -2) ||
                    (srow == row as i8 +2 && scol == col as i8 +2) ||
                    (arr[srow as usize][scol as usize] == 9) { continue; }

                    if arr[srow as usize][scol as usize] == 1 {
                        ok = true;
                        break;
                    }
                }

                if ok {
                    heur_score_1 += 1;
                    break;
                }
            }            
        }
    }

    //Checks how many pegs are within a 2 radius of the center
    const C_ROW:u8 = 3;
    const C_COL:u8 = 3;

    let mut srow:u8 = 0;

    loop {
        srow += 1;
        if srow > C_ROW +2 { break; }

        let mut scol:u8 = 0;
        loop {
            scol += 1;
            if scol > C_COL +2 { break; }

            if  (srow == C_ROW-2 && scol == C_COL-2) ||
            (srow == C_ROW-2 && scol == C_COL+2) ||
            (srow == C_ROW+2 && scol == C_COL-2) ||
            (srow == C_ROW+2 && scol == C_COL+2) ||
            (arr[srow as usize][scol as usize] == 9) { continue; }

            if arr[srow as usize][scol as usize] == 1 {
                heur_score_2 += 1;
            }
        }
    }

    return score+(heur_score_1+heur_score_2)/2;
}