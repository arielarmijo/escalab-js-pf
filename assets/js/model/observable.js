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
    console.log({event: model.event.name, body: model.body});
    this.observers.forEach(obs => {
      obs.update(model);
    });
  }

}