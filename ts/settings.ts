import { SudokuInterface } from './game_interface';

export interface Settings {
  displayErrors: boolean;
  useDarkTheme: boolean;
}

const rootEl = document.querySelector(":root")
if (!rootEl) throw new Error("NO!")

export function setDarkTheme(useDarkTheme: boolean) {
  if (useDarkTheme && !rootEl?.classList.contains('dark-theme')) {
    rootEl?.classList.add('dark-theme')
  } else {
    rootEl?.classList.remove('dark-theme')
  }
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
    handleUseDarkTheme(e: Event) {
      const settingEnabled = (e.target as HTMLInputElement).checked;
      if (settingEnabled != settings.useDarkTheme) {
        settings = {...settings, useDarkTheme: settingEnabled}
        saveSettings(settings)
        // This is surely not needed? But still -- the CSS will need to be programmatically changed... ? Or perhaps not.... :winky_face:
        //gameUI.setSettings(settings)
        setDarkTheme(settings.useDarkTheme)
      }
    }
  };
}

export function getDefaultSettings(): Settings {
  return {
    displayErrors: true,
    useDarkTheme: true
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
