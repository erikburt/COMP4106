use std::vec::Vec;

pub struct Board {
    pub id: u64,
    pub score: u8
}

impl Board {
    pub fn new(state:u64) -> Board {
        let score = Board::count_zeros(state);
        return Board {id: state, score: score};
    }

    pub fn id_to_array(id:u64) -> [[u8;8];8] {
        let mut state:[[u8;8];8] = [[0;8];8];
        let mut bit:u64 = 1 << 63;

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
        state[0][5] = 9;
        state[0][6] = 9;
        state[0][7] = 9;

        //Second row
        state[1][0] = 9;
        state[1][1] = 9;
        state[1][5] = 9;
        state[1][6] = 9;
        state[1][7] = 9;

        //Third row
        state[2][0] = 9;
        state[2][1] = 9;
        state[2][5] = 9;
        state[2][6] = 9;
        state[2][7] = 9;

        //Seventh row
        state[6][0] = 9;
        state[6][1] = 9;
        state[6][5] = 9;
        state[6][6] = 9;
        state[6][7] = 9;

        //Eigth row
        state[7][0] = 9;
        state[7][1] = 9;
        state[7][5] = 9;
        state[7][6] = 9;
        state[7][7] = 9;

        return state;
    }

    pub fn array_to_id(array:&[[u8;8]; 8]) -> u64 {
        let mut id:u64 = 0;

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

    fn count_zeros(id: u64) -> u8 {
        let mut bit:u64 = 1 << 63;
        let mut zeros:u8 = 0;

        for _row in 0..8 {
            for _col in 0..8 {
                let val = id&bit;

                if val == 0 { zeros += 1; }

                bit >>= 1
            }
        }

        zeros-=25;

        return zeros;
    }

    pub fn get_children(&self) -> Vec<u64> {
        let state: u64 = self.id;
        let mut arr = Board::id_to_array(state);
        let mut children:Vec<u64> = Vec::new();

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

                    //Down
                    if row < 6 && arr[row+1][col] == 1 && arr[row+2][col] == 1{
                        arr[row][col] = 1;
                        arr[row+1][col] = 0;
                        arr[row+2][col] = 0;

                        children.push(Board::array_to_id(&arr));

                        arr[row][col] = 0;
                        arr[row+1][col] = 1;
                        arr[row+2][col] = 1;
                    }

                    //Right
                    if col < 6 && arr[row][col+1] == 1 && arr[row][col+2] == 1 {
                        arr[row][col] = 1;
                        arr[row][col+1] = 0;
                        arr[row][col+2] = 0;

                        children.push(Board::array_to_id(&arr));

                        arr[row][col] = 0;
                        arr[row][col+1] = 1;
                        arr[row][col+2] = 1;
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
                }
            }
        }

        return children;
    }
}



