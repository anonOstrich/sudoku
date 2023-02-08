import createGameInterface from './game_interface';
import { setupMenus } from './site_state';

function main() {
  const gameUI = createGameInterface(null);
  setupMenus(gameUI);
}

main();
