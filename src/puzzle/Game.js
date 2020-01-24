import Piece from "./Piece"
import Puzzle from "./Puzzle"

class Game {
  constructor(data) {
    this.data = data;
  }

  createPuzzle(width, height) {
    const scale = [
      width / this.data.width,
      height / this.data.height
    ];
    var puzzle = new Puzzle();
    puzzle.size = { width, height };
    puzzle.pieces = this.data.pieces.map(
      piece => Object.assign(new Piece(), piece, { scale })
    );
    return puzzle;
  }
}

export default Game;
