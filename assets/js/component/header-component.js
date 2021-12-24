import { Component } from './component.js';
import { UserService } from '../service/user-service.js';
import { LOGIN, LOGOUT } from '../model/event.js';

export class HeaderComponent extends Component {

  template = `
    <a href="https://github.com/arielarmijo/escalab-js-pf" class="repo zoom" title="Ver código fuente"><i class="fab fa-github"></i></a>
    <div class="corner"></div>
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
    this.logoutBtn = document.getElementById('logout-btn');
    this.logoutBtn.onclick = () => this.logout();
  }

  logout() {
    this.userService.logout();
  }

  update(model) {
    const { event } = model;
    if (event.isEquals(LOGIN)) {
      this.logoutBtn.classList.remove('hidden');
      this.animate(this.logoutBtn);
    }
    if (event.isEquals(LOGOUT))
      this.logoutBtn.classList.add('hidden');
  }

}