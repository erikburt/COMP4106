use std::vec::Vec;

const BLUE: u8 = 1;
const RED: u8 = 2;

const START: [[u8; 6]; 6] = [
    [1, 1, 2, 1, 1, 2],
    [2, 2, 1, 1, 1, 2],
    [2, 2, 1, 2, 2, 1],
    [1, 2, 2, 1, 2, 2],
    [2, 1, 1, 1, 2, 2],
    [2, 1, 1, 2, 1, 1],
];

pub struct Board {
    pub state: [[u8; 6]; 6],
    pub score: u8,
    pub parent: &[[u8; 6]; 6],
    pub child: Vec<[[u8; 6]; 6]>,
    pub turn: u8
}

impl Board {
    pub fn new(state: [u8; 6]; 6], parent:&[u8; 6]; 6], turn:u8) {
        let score = Board::get_score(state);
        let mut children::Vec<&[[u8; 6]; 6]> = Vec::new();

        return Board { state, score, parent, child: children, turn};
    }

    pub fn get_children(&mut self) {
        
    }

    fn add_slide_moves(&mut self) {
        for col in 0..6 {
            if self.state[0][col] != 0 && self.state[0][col] != turn {  //Opponent piece on edge (slide is possible)

                for row in 0..6 {
                    if self.state[row][col] == turn && self.state[row-1][col] != 0 {    //Slide is guaranteed
                        let mut new_state = self.state;

                        for sub_row in 0..row {
                            if new_state[row-sub_row][col] == 0 { //Found air gap - collapse
                                for air_row in (row-sub_row)..row
                            }                            
                        }
                    }
                }
            }

            


            if self.state[0][col] != self.turn { //Find piece on edge of board
                
                for row in 1..6 {
                    if self.state[row][col] == 0 || self.state[row][col] != turn { continue; }

                    if self.state[row][col] = turn { //Own piece found, can slide

                        let mut air:u8 = 9;
                        for sub_row in 0..row { //Finds airspace in between sliding piece and edge 
                            if self.state[sub_row][col] == 0 {
                                air = sub_row;
                                break;
                            }
                        }

                        for sub_row in 0..row {

                        }
                    }
                }
            }
        }
    }

    fn add_single_moves(&mut self){

    }
}
