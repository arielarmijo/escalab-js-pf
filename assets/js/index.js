import { HeaderComponent } from './component/header-component.js';
import { LoginComponent } from './component/login-component.js';
import { GameComponent } from './component/game-component.js';
import { FooterComponent } from './component/footer-component.js';

const components = [
  new HeaderComponent('header'),
  new LoginComponent('#login'),
  new GameComponent('#game'),
  new FooterComponent('footer')
];

components.forEach(component => component.init());

