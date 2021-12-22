export class CachipunMove {

  constructor(name, image) {
    this.name = name;
    this.image = image;
    this.winsAgainst = null;
  }

  isEquals(move) {
    return this.name === move.name;
  }

  compare(move) {
    if (this.isEquals(move))
      return 0;
    if (this.winsAgainst.isEquals(move))
      return 1;
    return -1;
  }

}

const ROCK = new CachipunMove('Piedra', {src: './assets/img/piedra.png', alt: 'Piedra'});
const PAPER = new CachipunMove('Papel', {src: './assets/img/papel.png', alt: 'Papel'});
const SCISSOR = new CachipunMove('Tijera', {src: './assets/img/tijera.png', alt: 'Tijera'});

ROCK.winsAgainst = SCISSOR;
SCISSOR.winsAgainst = PAPER;
PAPER.winsAgainst = ROCK;

export const MOVES = [ROCK, SCISSOR, PAPER];