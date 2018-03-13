const BOARD_SIZE = 6;
const SQUARE_SIZE = 60;
let move_counter = 0, moves, src;

function preload() {
  moves = loadJSON('file:///home/erik/Documents/School/COMP4106/A2/js/out/out3v2.json');
  console.log(moves.length);
}

function setup() {
  createCanvas(480, 480);
  frameRate(0);
  draw();
}

function draw() {
  const move = moves[move_counter];

  for (var x = 0; x < BOARD_SIZE; x++) {
    for (var y = 0; y < BOARD_SIZE; y++) {
      const tile = move[x][y];
      setColor(tile);

      rect(
        SQUARE_SIZE * (x + 1),
        SQUARE_SIZE * (y + 1),
        SQUARE_SIZE,
        SQUARE_SIZE
      );
    }
  }
}
function keyPressed() {
  if (keyCode === LEFT_ARROW && move_counter > 0) {
    move_counter--;
  } else if (keyCode === RIGHT_ARROW && moves[move_counter + 1] != null) {
    move_counter++;
  }

  draw();
}


function setColor(tile) {
  switch (tile) {
    case 0:
      fill(255);
      break;
    case 1:
      var c = color(80, 0, 80);
      fill(c);
      break;
    case 2:
      var c = color(0, 80, 0);
      fill(c);
      break;
    default:
      fill(0);
  }
}
