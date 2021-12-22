import { Component } from './component.js';

export class FooterComponent extends Component {

  template = `
    <h4>Ariel Armijo 2021</h4>
    <div>
      <a href="https://www.linkedin.com/in/arielarmijo" target="_blank"><i class="fab fa-linkedin zoom"></i></a>
      <a href="https://github.com/arielarmijo" target="_blank"><i class="fab fa-github-square zoom"></i></a>
      <a href="mailto:arielarmijo@yahoo.es"><i class="fas fa-envelope zoom"></i></a>
    </div>
  `;

  constructor(tag) {
    super(tag);
  }
  
}