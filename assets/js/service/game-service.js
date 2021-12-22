import { Observable } from '../model/observable.js';
import { Queue } from '../model/queue.js';
import { Player } from '../model/player.js';
import { Machine } from '../model/machine.js';
import { UserService } from './user-service.js';
import { HAL_9000, UNKNOWN_USER } from '../model/user.js';

export class GameService extends Observable {

  static instance = null;

  maxScores = 5;
  maxTurns = 10;
  turn = 0;
  winPoints = 100;
  losePoints = -30;
  storageItemName = 'lastScores';

  constructor() {
    super();
    this.machine = new Machine(HAL_9000);
    this.human = new Player(UNKNOWN_USER);
    this.turnWinner = null;
    this.gameWinner = null;
    this.lastScores = new Queue(this.maxScores);
    this.loadScores();
    this.userService = UserService.getInstance();
    this.userService.subscribe(this);
  }

  static getInstance() {
    if (!GameService.instance)
      GameService.instance = new GameService();
    return GameService.instance;
  }

  reset(user = UNKNOWN_USER) {
    this.turn = 0;
    this.turnWinner = null;
    this.gameWinner = null;
    this.machine.reset();
    this.human = new Player(user);
  }

  play(move) {

    if (this.isGameFinished()) {
      this.notify({
        event: 'GAME_OVER',
        body: this.getState()
      });
      return;
    }

    this.turn++;
    this.human.play(move);
    this.machine.play();
    this.turnWinner = this.whoWinsTurn();

    if (this.isLastTurn()) {
      this.gameWinner = this.whoWinsGame();
      this.saveScore(this.gameWinner);
      this.notify({
        event: 'LAST_TURN',
        body: this.getState()
      });
      return;
    }

    this.notify({
      event: 'TURN',
      body: this.getState()
    });

  }

  isGameFinished() {
    return this.turn >= this.maxTurns;
  }

  isLastTurn() {
    return this.turn === this.maxTurns;
  }

  whoWinsGame() {
    if (this.human.score > this.machine.score)
      return this.human;
    if (this.machine.score > this.human.score)
      return this.machine;
    return null;
  }

  whoWinsTurn() {
    const c = this.human.currentMove.compare(this.machine.currentMove);
    if (c === 1) {
      this.human.score += this.winPoints;
      this.machine.score += this.losePoints;
      return this.human;
    }
    if (c === -1) {
      this.machine.score += this.winPoints;
      this.human.score += this.losePoints;
      return this.machine;
    }
    return null;
  }

  saveScore(player) {
    this.lastScores.enqueue({
      player: player.name.toUpperCase(),
      score: player.score
    });
    sessionStorage.setItem(this.storageItemName, JSON.stringify(this.lastScores.elements));
  }

  loadScores() {
    const lastScores = sessionStorage.getItem(this.storageItemName) ?? '[]';
    this.lastScores.elements = JSON.parse(lastScores);
  }

  update(model) {

    const { event, body } = model;

    if (event === 'LOGIN' || event === 'RESET') {
      this.reset(body);
      this.notify({
        event: 'NEW_GAME',
        body: this.getState()
      });
    }

    if (event === 'LOGOUT') {
      this.reset();
      this.notify({
        event: 'KILL_GAME',
        body: this.getState()
      });
    }

  }

  getState() {
    return {
      machinePlayer: this.machine,
      humanPlayer: this.human,
      turn: this.turn,
      whoWinsTurn: this.turnWinner,
      whoWinsGame: this.gameWinner,
      lastScores: this.lastScores.elements
    };
  }

}