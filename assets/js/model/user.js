const UNKNOWN_USER = {
  name: 'UNKNOWN USER',
  password: null,
  image: {
    src: './assets/img/anonymous-user.jpg',
    alt: 'Usuario anónimo'
  }
};

export class User {

  constructor({name, password, image} = UNKNOWN_USER) {
    this.name = name;
    this.password = password;
    this.image = image;
  }

  isEquals(user) {
    if (!user) return false;
    if (typeof user !== 'object') return false;
    if (!('name' in user && 'password' in user)) return false;
    return this.name === user.name && this.password === user.password;
  }

}