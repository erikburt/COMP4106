use std::vec::Vec;

pub struct Board {
    pub size: usize,
    pub nodes: Vec<Node>,
}

impl Board {
    pub fn new(size: usize, board: [[u8; 4]; 4]) -> Board {
        let mut nodes: Vec<Node> = Vec::with_capacity(size * size);

        for i in 0..size * size {
            let new_node: Node = Node::new(size, board, i);

            nodes.push(new_node);
        }

        return Board {
            size: size,
            nodes: nodes,
        };
    }

    pub fn print_board(&self) {
        for i in 0..self.nodes.len() {
            let node: &Node;

            match self.nodes.get(i) {
                Some(n) => node = n,
                None => panic!("err in print_board"),
            }

            if node.index % self.size == 0 {
                println!();
            }

            print!("{num:>2} ", num = node.value);
        }
    }

    pub fn update_possibles(&self) {
        for node in self.nodes.iter() {
            print!("{}-", node.value);

            for i in node.sqr.iter() {
                print!("{} ", i);
            }

            // if node.solved {
            // }

            println!();
        }

        // for i in 0..self.nodes.len() {
        //     let node: &Node = self.get_node(i);

        //     if node.solved {
        //         for i in 0..self.size {
        //             let node_u: &Node;
        //             let node_col_idx: usize;
        //             // let node_row: &Node;
        //             // let node_sqr: &Node;

        //             match node.col.get(i) {
        //                 Some(n) => node_col_idx = *n,
        //                 None => panic!("err in update_possibilities"),
        //             }

        //             match self.nodes.get_mut(node_col_idx) {
        //                 Some(n) => node_u = n,
        //                 None => panic!("FFS"),
        //             }

        //             // match self.nodes.get_mut(i) {
        //             //     Some(n) => Node::remove_possibility(n, node.value),
        //             //     None => println!("Err"),
        //             // }
        //         }
        //     }
        // }
    }

    fn get_node(&self, index: usize) -> &Node {
        match self.nodes.get(index) {
            Some(n) => return n,
            None => panic!("err in update_possibilities"),
        }
    }
}

pub struct Node {
    pub possibles: Vec<u8>,
    pub value: u8,
    pub row: Vec<usize>,
    pub col: Vec<usize>,
    pub sqr: Vec<usize>,
    pub solved: bool,
    index: usize,
}

impl Node {
    pub fn new(size: usize, board: [[u8; 4]; 4], index: usize) -> Node {
        let mut possibles: Vec<u8> = Vec::with_capacity(size);
        let mut row: Vec<usize> = Vec::with_capacity(size);
        let mut col: Vec<usize> = Vec::with_capacity(size);
        let mut sqr: Vec<usize> = Vec::with_capacity(size);
        let x_y = index_to_x_y(index, size);
        let x = x_y.0;
        let y = x_y.1;
        let value = board[x as usize][y as usize];
        let mut solved: bool = false;

        // println!("{} -> ({},{})", index, x, y);

        if value != 0 {
            possibles.push(value);
            solved = true;
        }

        for i in 0..size {
            if value == 0 {
                possibles.push((i + 1) as u8);
            } //Pushed possible values

            if i as u8 != x {
                row.push(x_y_to_index(x, i as u8, size));
            } //Pushes everything in the row
            if i as u8 != y {
                col.push(x_y_to_index(i as u8, y, size));
            } //Pushes everyting in the col
        }

        //Square
        let sub_size = (size as f64).sqrt() as u8;
        let sub_x = x_y.0 / sub_size;
        let sub_y = x_y.1 / sub_size;

        for x_i in 0..sub_size {
            for y_i in 0..sub_size {
                let n_index = x_y_to_index(sub_size * sub_x + x_i, sub_size * sub_y + y_i, size);

                if index != n_index {
                    sqr.push(n_index);
                }
            }
        }

        return Node {
            possibles: possibles,
            value: value,
            row: row,
            col: col,
            sqr: sqr,
            solved: solved,
            index: index,
        };
    }

    fn remove_possibility(&mut self, val: u8) {
        match self.possibles.iter().position(|&x| x == val) {
            Some(x) => self.possibles.swap_remove(x),
            None => return,
        };
    }

    pub fn print_val(&mut self) {
        print!("{}", self.value);
    }
}

fn x_y_to_index(x: u8, y: u8, size: usize) -> usize {
    return ((y as usize * size) + x as usize) as usize;
}

fn index_to_x_y(index: usize, size: usize) -> (u8, u8) {
    let row = index / size;
    return ((index - (row * size)) as u8, row as u8);
}
