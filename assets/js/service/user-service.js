import { Observable } from '../model/observable.js';
import { User, UNKNOWN_USER } from '../model/user.js';

export class UserService extends Observable {

  static instance = null;

  constructor() {
    super();
    this.user = UNKNOWN_USER;
  }

  static getInstance() {
    if (!UserService.instance)
      UserService.instance = new UserService();
    return UserService.instance;
  }

  async login(user) {
    if (this.isUserLoggedIn(user)) 
      throw new Error('Usuario ya está logeado');
    if (this.isOtherUserLoggedIn()) 
      throw new Error('Otro usuario está logeado');
    const observedUser = new User(user);
    const expectedUser = await this.findUser(observedUser.name);
    if (!observedUser.isEquals(expectedUser))
      throw new Error('Usuario y/o contraseña inválidos');
    this.user = observedUser;
    this.user.image = expectedUser.image;
    this.notify({
      event: 'LOGIN',
      body: this.user
    });
  }

  logout() {
    this.user = UNKNOWN_USER;
    this.notify({
      event: 'LOGOUT',
      body: this.user
    });
  }

  isUserLoggedIn(user) {
    return this.user.isEquals(user);
  }

  isOtherUserLoggedIn() {
    return !this.user.isEquals(UNKNOWN_USER);
  }

  async getUsers() {
    if (!this.users) {
      const response = await fetch('./assets/data/users.json');
      const users = await response.json();
      this.users = users.map(usr => new User(usr));
    }
    return this.users;
  }

  async findUser(name) {
    const users = this.users ?? await this.getUsers();
    const user = users.find(usr => usr.name === name);
    return user;
  }

}