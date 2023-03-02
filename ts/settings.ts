import { SudokuInterface } from './game_interface';

export interface Settings {
  displayErrors: boolean;
}

export type SettingsHandler = ReturnType<typeof createSettingsHandler>;

export function createSettingsHandler(gameUI: SudokuInterface) {
  let settings = loadSettings();

  return {
    handleDisplayErrors(e: Event) {
      const settingEnabled = (e.target as HTMLInputElement).checked;
      if (settingEnabled != settings.displayErrors) {
        settings = { ...settings, displayErrors: settingEnabled };
        saveSettings(settings);
        gameUI.setSettings(settings);
      }
    },
  };
}

export function getDefaultSettings(): Settings {
  return {
    displayErrors: true,
  };
}

export function loadSettings() {
  const saved = localStorage.getItem('settings');
  if (saved == null) {
    console.log("loading default settings...")
    return getDefaultSettings();
  }
  return JSON.parse(saved) as Settings;
}

function saveSettings(settings: Settings) {
  localStorage.setItem('settings', JSON.stringify(settings));
}

export default loadSettings;
