export class Component {

  template = '';

  constructor(tag) {
    this.tag = tag;
    this.componentElement = document.querySelector(this.tag);
  }

  init() {
    if (!this.componentElement)
      throw new Error('Tag no existe');
    this.componentElement.innerHTML = this.template;
  }

  show() {
    this.componentElement.classList.remove('hidden');
    this.animate(this.componentElement);
  }

  hide() {
    this.componentElement.classList.add('hidden');
  }

  animate(element) {
    element.classList.add('animate');
    setTimeout(() => {
      element.classList.remove('animate');
    }, 500);
  }

}