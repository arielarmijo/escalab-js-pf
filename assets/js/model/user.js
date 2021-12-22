export class User {

  constructor({name, password, image}) {
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

export const UNKNOWN_USER = new User({
  name: 'UNKNOWN USER',
  password: null,
  image: {
    src: './assets/img/anonymous-user.jpg',
    alt: 'Usuario anónimo'
  }
});

export const HAL_9000 = new User({
  name: 'HAL 9000',
  password: null,
  image: {
    src: './assets/img/HAL9000.png',
    alt: 'HAL 9000'
  }
});