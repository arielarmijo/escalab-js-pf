export class Queue {

  _elements = [];

  constructor(size) {
    this.size = size;
  }

  get elements() {
    return this._elements;
  }
  
  set elements(value) {
    const n = value.length;
    this._elements = n > this.size ? value.slice(n - this.size) : value;
  }

  enqueue(item) {
    this.elements.push(item);
    if (this.elements.length > this.size)
      this.dequeue();
  }

  dequeue() {
    this.elements.shift();
  }

}