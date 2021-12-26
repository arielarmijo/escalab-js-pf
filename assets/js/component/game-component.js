import { MOVES } from '../model/cachipun.js';
import { Component } from './component.js';
import { GameService } from '../service/game-service.js';
import { GAME_OVER, KILL_GAME, LAST_TURN, NEW_GAME, RESET, TURN } from '../model/event.js';

const SFX = {
  swing: new Audio('./assets/audio/swing.mp3')
};

export class GameComponent extends Component {

  template = `
    <div id="arena">
      <div id="players-moves">
        <div id="machine" class="player-card">
          <h3></h3>
          <img draggable="false"/>
          <p></p>
        </div>
        <div id="versus">
          <img src="./assets/img/vs.png" alt="Versus" draggable="false"/>
        </div>
        <div id="human" class="player-card">
          <h3></h3>
          <img draggable="false"//>
          <p></p>
        </div>
      </div>
      <div id="information">Seleccione piedra, papel o tijera...</div>
      <div id="player-controls"></div>
    </div>
    <div id="scores" class="hidden">
      <h3>Últimos Ganadores</h3>
      <ul></ul>
    </div>
  `;

  constructor(tag) {
    super(tag);
    this.gameService = GameService.getInstance();
    this.gameService.subscribe(this);
  }

  init() {
    super.init();
    this.info = document.getElementById('information');
    this.machineName = document.querySelector('#machine h3');
    this.machineImage = document.querySelector('#machine img');
    this.machineScore = document.querySelector('#machine p');
    this.humanName = document.querySelector('#human h3');
    this.humanImage = document.querySelector('#human img');
    this.humanScore = document.querySelector('#human p');
    this.playerControls = document.getElementById('player-controls');
    this.scores = document.getElementById('scores');
    this.makePlayerControls();
    this.hide();
  }

  makePlayerControls() {
    const makeButtons = (acc, {image}, i) => acc += `<img src="${image.src}" class="button zoom" data-move="${i}" alt="${image.alt}" draggable="false"/>`;
    this.playerControls.innerHTML = MOVES.reduce(makeButtons, '');
    const addListener = (button) => { button.onclick = (event) => { this.controlOnClick(event); }; };
    Array.from(this.playerControls.children).forEach(addListener);
  }

  controlOnClick(event) {
    const i = event.target.dataset.move;
    if (this.isPlaying)
      this.playSound(SFX.swing);
    this.gameService.play(MOVES[i]);
  }

  playSound(audio) {
    audio.currentTime = 0;
    audio.play();
  }

  update(model) {

    const { event, body } = model;

    if (event.isEquals(NEW_GAME) || event.isEquals(KILL_GAME)) {
      const message = 'Seleccione piedra, papel o tijera...';
      this.showTurnInfo(message);
      this.updateMachineName(body.machinePlayer.name);
      this.updateMachineImage(body.machinePlayer.image);
      this.updateMachineScore(body.machinePlayer.score);
      this.updateHumanName(body.humanPlayer.name);
      this.updateHumanImage(body.humanPlayer.image);
      this.updateHumanScore(body.humanPlayer.score);
      this.isPlaying = true;
    }

    if (event.isEquals(NEW_GAME)) {
      this.renderLastScores(body.lastScores);
      this.show();
    }

    if (event.isEquals(KILL_GAME)) {
      this.hide();
    }

    if (event.isEquals(TURN) || event.isEquals(LAST_TURN)) {
      let message = `<b>Turno ${body.turn}: </b>`;
      message += body.whoWinsTurn ? `¡${body.whoWinsTurn.name.toUpperCase()} gana!` : '¡Empate!';
      this.showTurnInfo(message);
      this.updateMachineImage(body.machinePlayer.currentMove.image);
      this.updateMachineScore(body.machinePlayer.score);
      this.updateHumanImage(body.humanPlayer.currentMove.image);
      this.updateHumanScore(body.humanPlayer.score);
    }

    if (event.isEquals(LAST_TURN)) {
      this.renderLastScores(body.lastScores);
      const winner = body.whoWinsGame;
      let message = `${winner ? `¡${winner.name.toUpperCase()} ha ganado la partida!` : '¡Empate!'}\n¿Jugar otra vez?`;
      this.promptNewGame(message, () => {
        let msg = `<b>Game Over: </b> ${winner ? `${winner.name.toUpperCase()} ha ganado la última partida` : '¡Empate!'}`;
        this.showTurnInfo(msg);
        this.updateMachineImage(body.machinePlayer.image);
        this.updateHumanImage(body.humanPlayer.image);
      });
      this.isPlaying = false;
    }

    if (event.isEquals(GAME_OVER)) {
      this.promptNewGame('Juego terminado. ¿Iniciar otra partida?');
    }

  }

  updateHumanName(name) {
    this.humanName.innerHTML = name;
  }

  updateMachineName(name) {
    this.machineName.innerHTML = name;
  }

  updateHumanImage(image) {
    this.updateImage(this.humanImage, image);
  }

  updateMachineImage(image) {
    this.updateImage(this.machineImage, image);
  }

  updateImage(element, { src, alt }) {
    element.src = src;
    element.alt = alt;
    this.animate(element);
  }

  updateMachineScore(score) {
    this.machineScore.innerHTML = score;
  }

  updateHumanScore(score) {
    this.humanScore.innerHTML = score;
  }

  showTurnInfo(message) {
    this.info.innerHTML = message;
  }

  renderLastScores(scores) {
    if (scores.length === 0)
      return;
    const makeListItems = (acc, item) => acc += `<li><span>${item.player}:</span>${item.score} pts</li>`;
    this.scores.lastElementChild.innerHTML = scores.reduceRight(makeListItems, '');
    if (this.scores.classList.contains('hidden'))
      this.scores.classList.remove('hidden');
  }

  promptNewGame(message, callback) {
    setTimeout(() => {
      if (confirm(message)) {
        this.gameService.update({
          event: RESET,
          body: this.gameService.human
        });
      } else {
        callback?.();
      }
    }, 50);
  }

}