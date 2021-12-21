import { Player } from './player.js';

export class Machine extends Player {

  constructor(user) {
    super(user);
  }

  play() {
    const options = Object.keys(this.moves);
    const move = options[Math.floor(Math.random() * options.length)];
    super.play(move);
  }

}