import { Component } from './component.js';
import { UserService } from '../service/user-service.js';

export class HeaderComponent extends Component {

  template = `
    <h1>Cachipún</h1>
    <button id="logout-btn" class="button hidden">Logout</button>
  `;

  constructor(tag) {
    super(tag);
    this.userService = UserService.getInstance();
    this.userService.subscribe(this);
  }

  init() {
    super.init();
    this.logoutBtn = document.querySelector('#logout-btn');
    this.logoutBtn.onclick = () => this.logout();
  }

  logout() {
    this.userService.logout();
  }

  update(model) {

    const { event } = model;

    if (event === 'LOGIN') {
      this.logoutBtn.classList.remove('hidden');
      this.animate(this.logoutBtn);
    }

    if (event === 'LOGOUT')
      this.logoutBtn.classList.add('hidden');
    
  }

}