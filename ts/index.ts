import createGameInterface from './game_interface';
import { setupMenus } from './site_state';
import fixButtonsOniOS from './ios_button_fix';

function main() {
  // fixButtonsOniOS()
  const gameUI = createGameInterface(null);
  setupMenus(gameUI);
}

main();
