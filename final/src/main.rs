// mod board;
// use board::Board;

use std::time::Instant;
use std::f64;
use std::vec::Vec;

// use std::collections::HashSet;
// use std::collections::VecDeque;

const START_4: [[u8; 4]; 4] = [
    //"easy"
    [3, 0, 0, 2],
    [0, 1, 0, 0],
    [0, 0, 2, 0],
    [1, 0, 0, 4],
];

const START_9: [[u8; 9]; 9] = [
    //"easy"
    [0, 4, 0, 0, 0, 7, 1, 0, 0],
    [5, 3, 0, 0, 9, 0, 0, 7, 0],
    [0, 0, 7, 0, 6, 0, 9, 4, 0],
    [4, 0, 6, 0, 8, 0, 7, 5, 1],
    [0, 1, 0, 0, 0, 0, 6, 9, 0],
    [0, 5, 3, 0, 1, 0, 0, 0, 2],
    [9, 6, 0, 0, 3, 0, 0, 1, 0],
    [3, 7, 0, 6, 5, 1, 0, 0, 0],
    [1, 0, 0, 2, 0, 9, 3, 6, 7],
];

const START_16: [[u8; 16]; 16] = [
    [0, 1, 9, 12, 0, 5, 0, 0, 6, 0, 0, 0, 0, 3, 13, 0],
    [0, 0, 3, 0, 1, 12, 0, 0, 9, 16, 0, 5, 0, 4, 0, 0],
    [7, 6, 0, 10, 0, 0, 0, 0, 0, 1, 8, 0, 14, 0, 2, 0],
    [16, 15, 0, 0, 11, 0, 4, 8, 0, 0, 0, 0, 0, 0, 0, 12],
    [0, 10, 8, 11, 0, 3, 0, 0, 0, 0, 7, 13, 0, 9, 14, 6],
    [0, 12, 15, 0, 0, 10, 8, 0, 0, 0, 0, 0, 16, 2, 5, 0],
    [0, 2, 0, 3, 9, 13, 7, 0, 0, 10, 0, 1, 0, 8, 0, 0],
    [0, 0, 0, 16, 0, 15, 0, 6, 8, 0, 0, 14, 0, 0, 0, 0],
    [0, 0, 0, 0, 5, 0, 0, 15, 13, 0, 9, 0, 7, 0, 0, 0],
    [0, 0, 1, 0, 3, 0, 14, 0, 0, 2, 5, 10, 11, 0, 16, 0],
    [0, 14, 11, 15, 0, 0, 0, 0, 0, 7, 3, 0, 0, 13, 4, 0],
    [5, 9, 16, 0, 13, 2, 0, 0, 0, 0, 1, 0, 8, 15, 3, 0],
    [15, 0, 0, 0, 0, 0, 0, 0, 3, 14, 0, 2, 0, 0, 7, 8],
    [0, 16, 0, 5, 0, 6, 3, 0, 0, 0, 0, 0, 2, 0, 12, 4],
    [0, 0, 14, 0, 8, 0, 2, 13, 0, 0, 15, 7, 0, 5, 0, 0],
    [0, 8, 2, 0, 0, 0, 0, 14, 0, 0, 11, 0, 1, 10, 6, 0],
];

// const START_25: [[u8; 25]; 4] = [
//     [ 1, 0, 4, 0, 25, 0, 19, 0, 0, 10, 21, 8, 0, 14, 0, 6, 12, 9, 0, 0, 0, 0, 0, 0, 5],
//     [ 5, 0, 19, 23, 24, 0, 22, 12, 0, 0, 16, 6, 0, 20, 0, 18, 0, 25, 14, 13, 10, 11, 0, 1, 15],
//     [0, 0, 0, 0, 0, 0, 21, 5, 0, 20, 11, 10, 0, 1, 0, 4, 8, 24, 23, 15, 18, 0, 16, 22, 19],
//     [0, 7, 21, 8, 18, 0, 0, 0, 11, 0, 5, 0, 0, 24, 0, 0, 0, 17, 11, 1, 9, 6, 25, 0, 0],
// ];

fn main() {
    let now = Instant::now();
    //let start_id = Board::array_to_id(&BASE);

    const BOARD_SIZE: usize = 16;
    let _board = START_16;

    let mut nodes: Vec<Vec<Node>> = Vec::with_capacity(BOARD_SIZE);

    for y in 0..BOARD_SIZE {
        let mut new: Vec<Node> = Vec::with_capacity(BOARD_SIZE);
        for x in 0..BOARD_SIZE {
            let new_node: Node = Node::new(BOARD_SIZE, x as u8, y as u8, _board[y][x]);
            new.push(new_node);
        }
        nodes.push(new);
    }

    println!("\n\n{}", now.elapsed().as_secs());
}

pub struct Node {
    pub possibles: Vec<u8>,
    pub value: u8,
    pub x: u8,
    pub y: u8,
    pub row: Vec<(u8, u8)>,
    pub col: Vec<(u8, u8)>,
    pub sqr: Vec<(u8, u8)>,
    pub solved: bool,
}

impl Node {
    pub fn new(size: usize, x: u8, y: u8, value: u8) -> Node {
        let mut possibles: Vec<u8> = Vec::with_capacity(size as usize);
        let mut row: Vec<(u8, u8)> = Vec::with_capacity(size as usize);
        let mut col: Vec<(u8, u8)> = Vec::with_capacity(size as usize);
        let mut sqr: Vec<(u8, u8)> = Vec::with_capacity(size as usize);
        let mut solved: bool = false;

        if value != 0 {
            possibles.push(value);
            solved = true;
        }

        for i in 0..size {
            if value == 0 {
                possibles.push((i + 1) as u8);
            } //Pushed possible values

            if i as u8 != x {
                row.push((x, i as u8));
            } //Pushes everything in the row
            if i as u8 != y {
                col.push((i as u8, y));
            } //Pushes everyting in the col
        }

        //Square
        let sub_size = (size as f64).sqrt() as u8;
        let sub_x = x / sub_size;
        let sub_y = y / sub_size;

        for x_i in 0..sub_size {
            for y_i in 0..sub_size {
                if x != x_i && y != y_i {
                    sqr.push((
                        (sub_size * sub_x + x_i) as u8,
                        (sub_size * sub_y + y_i) as u8,
                    ));
                }
            }
        }

        return Node {
            possibles: possibles,
            value: value,
            x: x,
            y: y,
            row: row,
            col: col,
            sqr: sqr,
            solved: solved,
        };
    }

    pub fn out(&self) {
        //print!()
    }
}

fn print_board(&nodes: Vec<Vec<Node>>) {
    for row in nodes {
        for node in row {
            let mut val: u8 = 0;

            match node.possibles.len() {
                1 => val = node.value,
                _ => val = 0,
            }

            print!("{num:>2} ", num = val);
        }

        println!();
    }
}
