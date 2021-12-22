export class Player {

  _score = 0;

  constructor({name, image}) {
    this.name = name;
    this.image = image;
  }

  get score() {
    return this._score;
  }
  set score(value) {
    this._score = value < 0 ? 0 : value;
  }

  play(move) {
    this.currentMove = move;
  }

  reset() {
    this.score = 0;
  }

}