use std::vec::Vec;

pub struct Board {
    pub id: u32,
    pub score: u8
}

impl Board {
    pub fn new(state:u32) -> Board {
        let score = Board::count_zeros(state);
        
        return Board {id: state, score: score};
    }

    pub fn id_to_array(id:u32) -> [[u8;5];5] {
        let mut state:[[u8;5];5] = [[0;5];5];
        let mut bit:u32 = 1 << 24;

        for row in 0..state.len() {
            for col in 0..state.len() {
                match id&bit {
                    0 => state[row][col] = 0,
                    _ => state[row][col] = 1
                }

                bit >>= 1;
            }
        }

        //Top row
        state[0][0] = 9;
        state[0][1] = 9;
        state[0][2] = 9;
        state[0][3] = 9;

        //Second row
        state[1][0] = 9;
        state[1][1] = 9;
        state[1][2] = 9;

        //Third
        state[2][0] = 9;
        state[2][1] = 9;

        //Fourth row
        state[3][0] = 9;


        return state;
    }

    pub fn array_to_id(array:&[[u8;5]; 5]) -> u32 {
        let mut id:u32 = 0;

        for row in 0..array.len() {
            for col in 0..array.len() {
                match array[row][col] {
                    1 => id = (id|1) << 1,
                    _ => id <<= 1
                }
            }
        }
        id >>= 1;
        
        return id;
    }

    fn count_zeros(id: u32) -> u8 {
        let mut bit:u32 = 1 << 24;
        let mut zeros:u8 = 0;

        for _row in 0..5 {
            for _col in 0..5 {
                let val = id&bit;

                if val == 0 { zeros += 1; }

                bit >>= 1
            }
        }

        zeros-=10;

        return zeros;
    }

    pub fn get_children(&self) -> Vec<u32> {
        let state: u32 = self.id;
        let mut arr = Board::id_to_array(state);
        let mut children:Vec<u32> = Vec::new();

        for row in 0..arr.len() {
            for col in 0..arr.len() {
                //Peg or invalid
                if arr[row][col] == 9 || arr[row][col] == 1 { continue; }
                else if arr[row][col] == 0 {
                    
                    //Left
                    if col > 1 && arr[row][col-1] == 1 && arr[row][col-2] == 1{
                        arr[row][col] = 1;
                        arr[row][col-1] = 0;
                        arr[row][col-2] = 0;

                        children.push(Board::array_to_id(&arr));

                        arr[row][col] = 0;
                        arr[row][col-1] = 1;
                        arr[row][col-2] = 1;
                    }

                    //Right
                    if col < 3 && arr[row][col+1] == 1 && arr[row][col+2] == 1 {
                        arr[row][col] = 1;
                        arr[row][col+1] = 0;
                        arr[row][col+2] = 0;

                        children.push(Board::array_to_id(&arr));

                        arr[row][col] = 0;
                        arr[row][col+1] = 1;
                        arr[row][col+2] = 1;
                    }

                    //Down
                    if row < 3 && arr[row+1][col] == 1 && arr[row+2][col] == 1{
                        arr[row][col] = 1;
                        arr[row+1][col] = 0;
                        arr[row+2][col] = 0;

                        children.push(Board::array_to_id(&arr));

                        arr[row][col] = 0;
                        arr[row+1][col] = 1;
                        arr[row+2][col] = 1;
                    }

                    //Up
                    if row > 1 && arr[row-1][col] == 1 && arr[row-2][col] == 1 {
                        arr[row][col] = 1;
                        arr[row-1][col] = 0;
                        arr[row-2][col] = 0;

                        children.push(Board::array_to_id(&arr));

                        arr[row][col] = 0;
                        arr[row-1][col] = 1;
                        arr[row-2][col] = 1;
                    }

                    //Up right
                    if row > 1 && col < 3 && arr[row-1][col+1] == 1 && arr[row-2][col+2] == 1 {
                        arr[row][col] = 1;
                        arr[row-1][col+1] = 0;
                        arr[row-2][col+2] = 0;

                        children.push(Board::array_to_id(&arr));

                        arr[row][col] = 0;
                        arr[row-1][col+1] = 1;
                        arr[row-2][col+2] = 1;
                    }

                    //Down left
                    if row < 3 && col > 1 && arr[row+1][col-1] == 1 && arr[row+2][col-2] == 1 {
                        arr[row][col] = 1;
                        arr[row+1][col-1] = 0;
                        arr[row+2][col-2] = 0;

                        children.push(Board::array_to_id(&arr));

                        arr[row][col] = 0;
                        arr[row+1][col-1] = 1;
                        arr[row+2][col-2] = 1;

                    }
                }
            }
        }

        return children;
    }
}



