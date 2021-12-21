import { Observable } from '../model/observable.js';
import { User } from '../model/user.js';

export class UserService extends Observable {

  static instance = null;

  constructor() {
    super();
    this.user = new User();
  }

  static getInstance() {
    if (!UserService.instance)
      UserService.instance = new UserService();
    return UserService.instance;
  }

  async login(user) {
    if (this.isUserLoggedIn(user)) 
      throw new Error('Usuario ya está logeado');
    if (this.user.isLoggedIn) 
      throw new Error('Otro usuario está logeado');
    const observedUser = new User(user);
    const expectedUser = await this.findUser(observedUser.name);
    if (!observedUser.isEquals(expectedUser))
      throw new Error('Usuario y/o contraseña inválidos');
    this.user = observedUser;
    this.user.image = expectedUser.image;
    this.user.isLoggedIn = true;
    this.notify({
      event: 'LOGIN',
      body: this.user
    });
  }

  logout() {
    this.user = new User();
    this.notify({
      event: 'LOGOUT',
      body: this.user
    });
  }

  async getUsers() {
    const response = await fetch('./assets/data/users.json');
    const users = await response.json();
    return users.map(u => new User(u));
  }

  async findUser(name) {
    const users = await this.getUsers();
    const user = users.find(u => u.name === name);
    return user;
  }

  isUserLoggedIn(user) {
    return this.user.isEquals(user) && this.user.isLoggedIn;
  }

}