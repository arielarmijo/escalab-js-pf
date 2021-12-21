import { CACHIPUN } from './cachipun.js';

export class Player {

  moves = CACHIPUN;
  
  _score = 0;

  constructor(user) {
    this.name = user.name;
    this.image = user.image;
  }

  get score() {
    return this._score;
  }
  set score(value) {
    this._score = value < 0 ? 0 : value;
  }

  play(choice) {
    this.currentMove = this.moves[choice];
  }

  reset() {
    this.score = 0;
  }

}