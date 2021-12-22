import { Component } from './component.js';
import { UserService } from '../service/user-service.js';

export class LoginComponent extends Component {

  template = `
      <img src="./assets/img/anonymous-user.jpg" alt="Usuario anónimo">
      <p class="error"></p>
      <input name="user" type="text" placeholder="usuario" value="foca">
      <input name="password" type="password" placeholder="contraseña" value="1234">
      <button class="button">Login</button>
      <div id="users" class="hidden"></div>
  `;

  constructor(tag) {
    super(tag);
    this.userService = UserService.getInstance();
    this.userService.subscribe(this);
  }

  init() {
    super.init();
    this.nameInput = document.querySelector(`${this.tag}`).children.user;
    this.passwordInput = document.querySelector(`${this.tag}`).children.password;
    this.errorMessage = document.querySelector(`${this.tag} p.error`);
    const loginBtn = document.querySelector(`${this.tag} button`);
    loginBtn.onclick = () => { this.login(); };
    this.userService.getUsers().then(this.renderUserList);
  }

  async login() {
    const name = this.nameInput.value;
    const password = this.passwordInput.value;
    try {
      if (!name) {
        this.nameInput.focus();
        throw new Error('Ingrese nombre de usuario');
      }
      if (!password) {
        this.passwordInput.focus();
        throw new Error('Ingrese contraseña');
      }
      await this.userService.login({ name, password });
      this.errorMessage.innerHTML = '';
      // this.nameInput.value = '';
      // this.passwordInput.value = '';
    } catch (error) {
      this.showErrorMessage(error.message);
    }
  }

  renderUserList(users) {
    const usersList = document.querySelector('#users');
    usersList.innerHTML = users.reduce((acc, user, i, users) => {
      acc += `<li><span>${user.name}</span><span>${user.password}</span></li>`;
      if (i === users.length)
        acc += '</ul>';
      return acc;
    }, '<div><span>Usuario</span><span>Contraseña</span></div><ul>');
    usersList.classList.remove('hidden');
  }

  showErrorMessage(message) {
    this.errorMessage.innerHTML = message;
    this.animate(this.errorMessage);
  }

  update(model) {
    const { event } = model;
    if (event === 'LOGIN')
      this.componentElement.classList.add('hidden');
    if (event === 'LOGOUT') {
      this.errorMessage.innerHTML = '';
      this.componentElement.classList.remove('hidden');
      this.animate(this.componentElement);
    }
  }

}