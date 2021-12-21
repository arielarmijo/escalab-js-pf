export class Observable {

  constructor() {
    this.observers = [];
  }

  subscribe(observer) {
    this.observers.push(observer);
  }

  unsuscribe(observer) {
    this.observers = this.observers.filter(obs => obs instanceof observer !== true);
  }

  notify(model) {
    this.observers.forEach(obs => {
      obs.update(model);
    });
  }

}