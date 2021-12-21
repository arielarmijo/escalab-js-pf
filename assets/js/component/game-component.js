import { CACHIPUN } from '../model/cachipun.js';
import { Component } from './component.js';
import { GameService } from '../service/game-service.js';

const ID = {
  information: 'information',
  machine: 'machine',
  human: 'human',
  controls: 'player-controls',
  scores: 'scores'
};

const SFX = {
  swing: new Audio('./assets/audio/swing.mp3')
};

export class GameComponent extends Component {

  template = `
    <div id="arena">
      <div id="players-moves">
        <div id="${ID.machine}" class="player-card">
          <h3></h3>
          <img draggable="false"/>
          <p></p>
        </div>
        <div id="versus">
          <img src="./assets/img/vs.png" alt="Versus" draggable="false"/>
        </div>
        <div id="${ID.human}" class="player-card">
          <h3></h3>
          <img draggable="false"//>
          <p></p>
        </div>
      </div>
      <div id="${ID.information}">Seleccione piedra, papel o tijera...</div>
      <div id="${ID.controls}"></div>
    </div>
    <div id="${ID.scores}">
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
    this.isPlaying = true;
    this.info = document.getElementById(ID.information);
    this.machineName = document.querySelector(`#${ID.machine} h3`);
    this.machineImage = document.querySelector(`#${ID.machine} img`);
    this.machineScore = document.querySelector(`#${ID.machine} p`);
    this.humanName = document.querySelector(`#${ID.human} h3`);
    this.humanImage = document.querySelector(`#${ID.human} img`);
    this.humanScore = document.querySelector(`#${ID.human} p`);
    this.scores = document.getElementById(ID.scores);
    this.makePlayerControls();
    this.hide();
  }


  makePlayerControls() {
    const makeButtons = (acc, [key, value]) => acc += `<img src="${value.img}" class="button zoom" data-move="${key}" alt="${value.name}" draggable="false"/>`;
    const addListener = (button) => {
      button.onclick = (event) => { this.controlOnClick(event); };
    };
    const playerControls = document.getElementById(ID.controls);
    playerControls.innerHTML = Object.entries(CACHIPUN).reduce(makeButtons, '');
    Array.from(playerControls.children).forEach(addListener);
  }

  controlOnClick(event) {
    const move = event.target.dataset.move;
    if (this.isPlaying)
      this.playSound(SFX.swing);
    this.gameService.play(move);
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
      this.updateMachineMove(body.machinePlayer.currentMove);
      this.updateMachineScore(body.machinePlayer.score);
      this.updateHumanMove(body.humanPlayer.currentMove);
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

  updateHumanMove(move) {
    const { img: src, name: alt } = move;
    this.updateHumanImage({ src, alt });
  }

  updateMachineMove(move) {
    const { img: src, name: alt } = move;
    this.updateMachineImage({ src, alt });
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
    const makeListItems = (acc, item) => acc += `<li><span>${item.player}:</span>${item.score} pts</li>`;
    this.scores.lastElementChild.innerHTML = scores.reduceRight(makeListItems, '');
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