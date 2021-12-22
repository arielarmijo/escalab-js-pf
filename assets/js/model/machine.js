import { MOVES } from './cachipun.js';
import { Player } from './player.js';

export class Machine extends Player {

  constructor({name, image}) {
    super({name, image});
  }

  play() {
    const i = Math.floor(Math.random() * MOVES.length);
    super.play(MOVES[i]);
  }

}