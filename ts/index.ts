import createGameInterface from './game_interface';
import { setupMenus } from './site_state';
import { loadGame, saveGame } from './storage';

function main() {
  const gameUI = createGameInterface(null);
  setupMenus(gameUI);
  loadGame(gameUI);
  setInterval(() => {
    if (gameUI.game != null) {
      saveGame(gameUI.game);
    }
  }, 5000);
}

main();
