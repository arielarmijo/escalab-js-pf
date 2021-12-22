export class Event {

  constructor(name) {
    this.name = name;
  }

  isEquals(otherEvent) {
    return this.name === otherEvent.name;
  }

}

export const LOGIN = new Event('LOGIN');
export const LOGOUT = new Event('LOGOUT');
export const NEW_GAME = new Event('NEW_GAME');
export const KILL_GAME = new Event('KILL_GAME');
export const GAME_OVER = new Event('GAME_OVER');
export const RESET = new Event('RESET');
export const TURN = new Event('TURN');
export const LAST_TURN = new Event('LAST_TURN');