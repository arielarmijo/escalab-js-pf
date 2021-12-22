import { MOVES } from '../model/cachipun.js';
import { Component } from './component.js';
import { GameService } from '../service/game-service.js';

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
    const addListener = (button) => { button.onclick = (event) => { this.controlOnClick(event); }; };
    this.playerControls.innerHTML = MOVES.reduce(makeButtons, '');
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

    console.log(model);

    const { event, body } = model;

    if (event === 'NEW_GAME' || event === 'KILL_GAME') {
      const message = 'Seleccione piedra, papel o tijera...';
      this.showTurnInfo(message);
      this.updateMachineName(body.machinePlayer.name);
      this.updateMachineImage(body.machinePlayer.image);
      this.updateMachineScore('');
      this.updateHumanName(body.humanPlayer.name);
      this.updateHumanImage(body.humanPlayer.image);
      this.updateHumanScore('');
      this.renderLastScores(body.lastScores);
      this.isPlaying = true;
    }

    if (event === 'NEW_GAME') {
      this.show();
    }

    if (event === 'KILL_GAME') {
      this.hide();
    }

    if (event === 'TURN' || event === 'LAST_TURN') {
      let message = `<span>Turno ${body.turn}: </span>`;
      message += body.whoWinsTurn ? `¡${body.whoWinsTurn.name.toUpperCase()} gana!` : '¡Empate!';
      this.showTurnInfo(message);
      this.updateMachineImage(body.machinePlayer.currentMove.image);
      this.updateMachineScore(body.machinePlayer.score);
      this.updateHumanImage(body.humanPlayer.currentMove.image);
      this.updateHumanScore(body.humanPlayer.score);
    }

    if (event === 'LAST_TURN') {
      this.renderLastScores(body.lastScores);
      const message = `¡${body.whoWinsGame.name.toUpperCase()} ha ganado la partida!\n¿Jugar otra vez?`;
      this.promptNewGame(message);
      this.isPlaying = false;
    }

    if (event === 'GAME_OVER') {
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
    this.updateScore(this.machineScore, score);
  }

  updateHumanScore(score) {
    this.updateScore(this.humanScore, score);
  }

  updateScore(element, score) {
    element.innerHTML = score;
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

  promptNewGame(message) {
    setTimeout(() => {
      if (confirm(message)) {
        this.gameService.update({
          event: 'RESET',
          body: this.gameService.human
        });
      }
    }, 50);
  }

}