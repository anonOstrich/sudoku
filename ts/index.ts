import createGameInterface from './game_interface';
import { connectSettingsUI, setupMenus } from './site_state';
import { loadGame, saveGame } from './storage';
import loadSettings, { createSettingsHandler } from './settings';

function main() {
  const gameUI = createGameInterface(null);

  setupMenus(gameUI);
  const settingsHandler = createSettingsHandler(gameUI);
  connectSettingsUI(settingsHandler);
  
  loadGame(gameUI);

  setInterval(() => {
    if (gameUI.game != null) {
      saveGame(gameUI.game);
    }
  }, 5000);
}

main();
