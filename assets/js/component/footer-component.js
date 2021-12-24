import { Component } from './component.js';

export class FooterComponent extends Component {

  template = `
    <h4>Ariel Armijo 2021</h4>
    <div>
      <a href="https://www.linkedin.com/in/arielarmijo" target="_blank"><span class="fab fa-linkedin zoom"></span></a>
      <a href="https://github.com/arielarmijo" target="_blank"><span class="fab fa-github-square zoom"></span></a>
      <a href="mailto:arielarmijo@yahoo.es"><span class="fas fa-envelope zoom"></span></a>
    </div>
  `;

  constructor(tag) {
    super(tag);
  }
  
}